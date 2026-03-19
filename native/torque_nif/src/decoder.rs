use crate::atoms;
use crate::nif_util::make_tuple2;
use crate::types::{value_to_term, MAX_DEPTH};
use crate::ParsedDocument;
use rustler::sys::{enif_make_list_from_array, ERL_NIF_TERM};
use rustler::{Binary, Encoder, Env, ListIterator, ResourceArc, Term};
use sonic_rs::{JsonContainerTrait, JsonValueTrait};

const GET_MANY_STACK: usize = 64;

/// Returns the last value for `key` in an object, matching the last-value-wins
/// behaviour of `value_to_term` / `build_map_dedup` for duplicate keys.
#[inline]
fn object_get_last<'v>(value: &'v sonic_rs::Value, key: &str) -> Option<&'v sonic_rs::Value> {
    value
        .as_object()?
        .iter()
        .rfind(|(k, _)| *k == key)
        .map(|(_, v)| v)
}

#[inline]
fn pointer_lookup<'v>(value: &'v sonic_rs::Value, path: &str) -> Option<&'v sonic_rs::Value> {
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
        if !seg_bytes.is_empty() && seg_bytes[0].is_ascii_digit() {
            if let Ok(index) = segment.parse::<usize>() {
                current = current.get(index)?;
                continue;
            }
        }
        if segment.contains('~') {
            let unescaped = segment.replace("~1", "/").replace("~0", "~");
            current = object_get_last(current, &unescaped)?;
        } else {
            current = object_get_last(current, segment)?;
        }
    }
    Some(current)
}

fn do_parse(bytes: &[u8]) -> Result<ResourceArc<ParsedDocument>, String> {
    match sonic_rs::from_slice::<sonic_rs::Value>(bytes) {
        Ok(value) => Ok(ResourceArc::new(ParsedDocument { value })),
        Err(e) => Err(format!("{}", e)),
    }
}

#[rustler::nif]
fn parse<'a>(env: Env<'a>, json: Binary) -> Term<'a> {
    match do_parse(json.as_slice()) {
        Ok(resource) => make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg()),
        Err(reason) => make_tuple2(
            env,
            atoms::error().as_c_arg(),
            reason.encode(env).as_c_arg(),
        ),
    }
}

#[rustler::nif(schedule = "DirtyCpu")]
fn parse_dirty<'a>(env: Env<'a>, json: Binary) -> Term<'a> {
    match do_parse(json.as_slice()) {
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
    match pointer_lookup(&doc.value, path) {
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
    match pointer_lookup(&doc.value, path) {
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
    match pointer_lookup(&doc.value, path) {
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

fn do_decode<'a>(env: Env<'a>, bytes: &[u8]) -> Term<'a> {
    match sonic_rs::from_slice::<sonic_rs::Value>(bytes) {
        Ok(value) => match value_to_term(env, &value, MAX_DEPTH) {
            Some(term) => make_tuple2(env, atoms::ok().as_c_arg(), term.as_c_arg()),
            None => make_tuple2(
                env,
                atoms::error().as_c_arg(),
                atoms::nesting_too_deep().as_c_arg(),
            ),
        },
        Err(e) => make_tuple2(
            env,
            atoms::error().as_c_arg(),
            format!("{}", e).encode(env).as_c_arg(),
        ),
    }
}

#[rustler::nif]
fn decode<'a>(env: Env<'a>, json: Binary) -> Term<'a> {
    do_decode(env, json.as_slice())
}

#[rustler::nif(schedule = "DirtyCpu")]
fn decode_dirty<'a>(env: Env<'a>, json: Binary) -> Term<'a> {
    do_decode(env, json.as_slice())
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

        let r = match pointer_lookup(&doc.value, path) {
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
