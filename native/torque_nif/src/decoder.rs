use crate::atoms;
use crate::nif_util::make_tuple2;
use crate::serde_decode;
use crate::types::{value_to_term, MAX_DEPTH};
use crate::ParsedDocument;
use rustler::sys::{enif_make_list_from_array, ERL_NIF_TERM};
use rustler::{schedule, Binary, Encoder, Env, ListIterator, ResourceArc, Term};
use sonic_rs::{JsonContainerTrait, JsonValueTrait};

const GET_MANY_STACK: usize = 64;
const BYTES_PER_REDUCTION: usize = 20;
const REDUCTION_COUNT: usize = 4000;

/// Compute a timeslice percentage (1–100) proportional to bytes processed.
#[inline]
fn timeslice_percent(bytes: usize) -> i32 {
    let reds = bytes / BYTES_PER_REDUCTION;
    ((reds * 100 / REDUCTION_COUNT) as i32).clamp(1, 100)
}

/// Looks up `key` in an object.
///
/// When `unique_keys` is true, uses sonic-rs's internal index (fast).
/// Otherwise, does a reverse linear scan so that the last value wins,
/// matching the duplicate-key behaviour of `value_to_term` / `build_map_dedup`.
#[inline]
fn object_get<'v>(
    value: &'v sonic_rs::Value,
    key: &str,
    unique_keys: bool,
) -> Option<&'v sonic_rs::Value> {
    if unique_keys {
        value.get(key)
    } else {
        value
            .as_object()?
            .iter()
            .rfind(|(k, _)| *k == key)
            .map(|(_, v)| v)
    }
}

#[inline]
fn pointer_lookup<'v>(
    value: &'v sonic_rs::Value,
    path: &str,
    unique_keys: bool,
) -> Option<&'v sonic_rs::Value> {
    let bytes = path.as_bytes();
    if bytes.is_empty() {
        return Some(value);
    }
    if bytes[0] != b'/' {
        return None;
    }
    if bytes.len() == 1 {
        return Some(value);
    }

    let mut current = value;
    for segment in path[1..].split('/') {
        let seg_bytes = segment.as_bytes();
        if current.is_array() && !seg_bytes.is_empty() && seg_bytes[0].is_ascii_digit() {
            if let Ok(index) = segment.parse::<usize>() {
                current = current.get(index)?;
                continue;
            }
        }
        if segment.contains('~') {
            if segment.len() > 512 {
                let unescaped = segment.replace("~1", "/").replace("~0", "~");
                current = object_get(current, &unescaped, unique_keys)?;
            } else {
                let bytes = segment.as_bytes();
                let mut tmp = [0u8; 512];
                let mut out_len = 0usize;
                let mut i = 0usize;
                while i < bytes.len() {
                    if bytes[i] == b'~' && i + 1 < bytes.len() {
                        match bytes[i + 1] {
                            b'1' => {
                                tmp[out_len] = b'/';
                                out_len += 1;
                                i += 2;
                            }
                            b'0' => {
                                tmp[out_len] = b'~';
                                out_len += 1;
                                i += 2;
                            }
                            _ => {
                                tmp[out_len] = bytes[i];
                                out_len += 1;
                                i += 1;
                            }
                        }
                    } else {
                        tmp[out_len] = bytes[i];
                        out_len += 1;
                        i += 1;
                    }
                }
                // SAFETY: input is valid UTF-8 &str; substitutions write only ASCII bytes
                let unescaped = unsafe { std::str::from_utf8_unchecked(&tmp[..out_len]) };
                current = object_get(current, unescaped, unique_keys)?;
            }
        } else {
            current = object_get(current, segment, unique_keys)?;
        }
    }
    Some(current)
}

fn do_parse(bytes: &[u8], unique_keys: bool) -> Result<ResourceArc<ParsedDocument>, String> {
    match sonic_rs::from_slice::<sonic_rs::Value>(bytes) {
        Ok(value) => Ok(ResourceArc::new(ParsedDocument { value, unique_keys })),
        Err(e) => Err(format!("{}", e)),
    }
}

#[rustler::nif]
fn parse<'a>(env: Env<'a>, json: Binary) -> Term<'a> {
    match do_parse(json.as_slice(), false) {
        Ok(resource) => {
            schedule::consume_timeslice(env, timeslice_percent(json.len()));
            make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg())
        }
        Err(reason) => make_tuple2(
            env,
            atoms::error().as_c_arg(),
            reason.encode(env).as_c_arg(),
        ),
    }
}

#[rustler::nif(schedule = "DirtyCpu")]
fn parse_dirty<'a>(env: Env<'a>, json: Binary) -> Term<'a> {
    match do_parse(json.as_slice(), false) {
        Ok(resource) => make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg()),
        Err(reason) => make_tuple2(
            env,
            atoms::error().as_c_arg(),
            reason.encode(env).as_c_arg(),
        ),
    }
}

#[rustler::nif]
fn parse_opts<'a>(env: Env<'a>, json: Binary, unique_keys: bool) -> Term<'a> {
    match do_parse(json.as_slice(), unique_keys) {
        Ok(resource) => {
            schedule::consume_timeslice(env, timeslice_percent(json.len()));
            make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg())
        }
        Err(reason) => make_tuple2(
            env,
            atoms::error().as_c_arg(),
            reason.encode(env).as_c_arg(),
        ),
    }
}

#[rustler::nif(schedule = "DirtyCpu")]
fn parse_opts_dirty<'a>(env: Env<'a>, json: Binary, unique_keys: bool) -> Term<'a> {
    match do_parse(json.as_slice(), unique_keys) {
        Ok(resource) => make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg()),
        Err(reason) => make_tuple2(
            env,
            atoms::error().as_c_arg(),
            reason.encode(env).as_c_arg(),
        ),
    }
}

#[rustler::nif]
fn get<'a>(env: Env<'a>, doc: ResourceArc<ParsedDocument>, path: &str) -> Term<'a> {
    let ok_raw = atoms::ok().as_c_arg();
    let err_raw = atoms::error().as_c_arg();
    let nsf_raw = atoms::no_such_field().as_c_arg();
    let ntd_raw = atoms::nesting_too_deep().as_c_arg();
    match pointer_lookup(&doc.value, path, doc.unique_keys) {
        Some(value) => match value_to_term(env, value, MAX_DEPTH) {
            Some(term) => make_tuple2(env, ok_raw, term.as_c_arg()),
            None => make_tuple2(env, err_raw, ntd_raw),
        },
        None => make_tuple2(env, err_raw, nsf_raw),
    }
}

#[inline]
fn get_one_result(
    env: Env,
    doc: &ParsedDocument,
    path: &str,
    ok_raw: ERL_NIF_TERM,
    err_raw: ERL_NIF_TERM,
    nsf_raw: ERL_NIF_TERM,
    ntd_raw: ERL_NIF_TERM,
) -> ERL_NIF_TERM {
    match pointer_lookup(&doc.value, path, doc.unique_keys) {
        Some(value) => match value_to_term(env, value, MAX_DEPTH) {
            Some(term) => make_tuple2(env, ok_raw, term.as_c_arg()).as_c_arg(),
            None => make_tuple2(env, err_raw, ntd_raw).as_c_arg(),
        },
        None => make_tuple2(env, err_raw, nsf_raw).as_c_arg(),
    }
}

#[rustler::nif]
fn get_many<'a>(
    env: Env<'a>,
    doc: ResourceArc<ParsedDocument>,
    paths: ListIterator<'a>,
) -> Term<'a> {
    let ok_raw = atoms::ok().as_c_arg();
    let err_raw = atoms::error().as_c_arg();
    let nsf_raw = atoms::no_such_field().as_c_arg();
    let ntd_raw = atoms::nesting_too_deep().as_c_arg();

    // Collect into stack array when possible
    let mut stack: [ERL_NIF_TERM; GET_MANY_STACK] = [0; GET_MANY_STACK];
    let mut count = 0;
    let mut heap: Option<Vec<ERL_NIF_TERM>> = None;

    for path_term in paths {
        let path: &str = match path_term.decode() {
            Ok(p) => p,
            Err(_) => {
                let r = make_tuple2(env, err_raw, nsf_raw).as_c_arg();
                if count < GET_MANY_STACK && heap.is_none() {
                    stack[count] = r;
                } else {
                    heap.get_or_insert_with(|| {
                        let mut v = Vec::with_capacity(GET_MANY_STACK * 2);
                        v.extend_from_slice(&stack[..count]);
                        v
                    })
                    .push(r);
                }
                count += 1;
                continue;
            }
        };

        let r = get_one_result(env, &doc, path, ok_raw, err_raw, nsf_raw, ntd_raw);
        if count < GET_MANY_STACK && heap.is_none() {
            stack[count] = r;
        } else {
            heap.get_or_insert_with(|| {
                let mut v = Vec::with_capacity(GET_MANY_STACK * 2);
                v.extend_from_slice(&stack[..count]);
                v
            })
            .push(r);
        }
        count += 1;
    }

    let terms = match &heap {
        Some(v) => v.as_slice(),
        None => &stack[..count],
    };

    unsafe {
        Term::new(
            env,
            enif_make_list_from_array(env.as_c_arg(), terms.as_ptr(), count as u32),
        )
    }
}

#[rustler::nif]
fn array_length<'a>(env: Env<'a>, doc: ResourceArc<ParsedDocument>, path: &str) -> Term<'a> {
    match pointer_lookup(&doc.value, path, doc.unique_keys) {
        Some(value) if value.is_array() => {
            let len = value.as_array().unwrap().len();
            unsafe {
                Term::new(
                    env,
                    rustler::sys::enif_make_uint64(env.as_c_arg(), len as u64),
                )
            }
        }
        _ => atoms::nil().to_term(env),
    }
}

#[rustler::nif]
fn decode<'a>(env: Env<'a>, json: Binary<'a>) -> Term<'a> {
    let input_term = json.encode(env).as_c_arg();
    let result = serde_decode::decode_to_term(env, input_term, json.as_slice());
    schedule::consume_timeslice(env, timeslice_percent(json.len()));
    result
}

#[rustler::nif(schedule = "DirtyCpu")]
fn decode_dirty<'a>(env: Env<'a>, json: Binary<'a>) -> Term<'a> {
    let input_term = json.encode(env).as_c_arg();
    serde_decode::decode_to_term(env, input_term, json.as_slice())
}

#[rustler::nif]
fn get_many_nil<'a>(
    env: Env<'a>,
    doc: ResourceArc<ParsedDocument>,
    paths: ListIterator<'a>,
) -> Term<'a> {
    let nil_raw = atoms::nil().as_c_arg();

    let mut stack: [ERL_NIF_TERM; GET_MANY_STACK] = [0; GET_MANY_STACK];
    let mut count = 0;
    let mut heap: Option<Vec<ERL_NIF_TERM>> = None;

    for path_term in paths {
        let path: &str = match path_term.decode() {
            Ok(p) => p,
            Err(_) => {
                if count < GET_MANY_STACK && heap.is_none() {
                    stack[count] = nil_raw;
                } else {
                    heap.get_or_insert_with(|| {
                        let mut v = Vec::with_capacity(GET_MANY_STACK * 2);
                        v.extend_from_slice(&stack[..count]);
                        v
                    })
                    .push(nil_raw);
                }
                count += 1;
                continue;
            }
        };

        let r = match pointer_lookup(&doc.value, path, doc.unique_keys) {
            Some(value) => match value_to_term(env, value, MAX_DEPTH) {
                Some(term) => term.as_c_arg(),
                None => nil_raw,
            },
            None => nil_raw,
        };
        if count < GET_MANY_STACK && heap.is_none() {
            stack[count] = r;
        } else {
            heap.get_or_insert_with(|| {
                let mut v = Vec::with_capacity(GET_MANY_STACK * 2);
                v.extend_from_slice(&stack[..count]);
                v
            })
            .push(r);
        }
        count += 1;
    }

    let terms = match &heap {
        Some(v) => v.as_slice(),
        None => &stack[..count],
    };

    unsafe {
        Term::new(
            env,
            enif_make_list_from_array(env.as_c_arg(), terms.as_ptr(), count as u32),
        )
    }
}
