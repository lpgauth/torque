use crate::atoms;
use crate::native_decode;
use crate::nif_util::{make_tuple2, timeslice_percent, REDUCTION_COUNT};
use crate::types::{value_to_term, MAX_DEPTH};
use crate::ParsedDocument;
use rustler::sys::{enif_make_list_from_array, ERL_NIF_TERM};
use rustler::{schedule, Binary, Encoder, Env, ListIterator, NifResult, ResourceArc, Term};
use sonic_rs::{JsonContainerTrait, JsonValueTrait};

const GET_MANY_STACK: usize = 64;

/// Below this many built terms the enif_consume_timeslice call costs more than
/// the accounting is worth — mirrors the encoder's TIMESLICE_MIN_BYTES guard,
/// so scalar extractions pay only this one branch.
const TIMESLICE_MIN_NODES: usize = 512;
/// Terms built per BEAM reduction. Calibrated for parity with the byte-based
/// accounting used by parse/decode/encode (20 bytes per reduction): typical
/// JSON runs ~5-10 source bytes per built term, so extracting a subtree
/// charges roughly what decoding the same content would. Long strings count
/// as one term, so string-heavy content charges less; both schemes are coarse
/// work proxies, not wall-clock estimates.
const NODES_PER_REDUCTION: usize = 4;

/// Report term-building work from the get family to the scheduler. The
/// pointer lookup itself is sub-microsecond, but `value_to_term` cost is
/// proportional to the extracted subtree, which only the node counter sees.
#[inline]
fn consume_timeslice_nodes(env: Env, nodes: usize) {
    if nodes >= TIMESLICE_MIN_NODES {
        let reds = nodes / NODES_PER_REDUCTION;
        schedule::consume_timeslice(env, ((reds * 100 / REDUCTION_COUNT) as i32).clamp(1, 100));
    }
}

/// Stack-first accumulator for per-path result terms: fills a fixed array,
/// spilling to a heap Vec only past `GET_MANY_STACK` entries — or immediately,
/// with exact capacity, when a larger size is known up front via `with_hint`.
struct TermAcc {
    stack: [ERL_NIF_TERM; GET_MANY_STACK],
    count: usize,
    heap: Option<Vec<ERL_NIF_TERM>>,
}

impl TermAcc {
    #[inline]
    fn new() -> Self {
        Self::with_hint(0)
    }

    #[inline]
    fn with_hint(n: usize) -> Self {
        TermAcc {
            stack: [0; GET_MANY_STACK],
            count: 0,
            heap: if n > GET_MANY_STACK {
                Some(Vec::with_capacity(n))
            } else {
                None
            },
        }
    }

    #[inline]
    fn push(&mut self, term: ERL_NIF_TERM) {
        if self.count < GET_MANY_STACK && self.heap.is_none() {
            self.stack[self.count] = term;
        } else {
            self.heap
                .get_or_insert_with(|| {
                    let mut v = Vec::with_capacity(GET_MANY_STACK * 2);
                    v.extend_from_slice(&self.stack[..self.count]);
                    v
                })
                .push(term);
        }
        self.count += 1;
    }

    #[inline]
    fn into_list<'a>(self, env: Env<'a>) -> Term<'a> {
        let terms = match &self.heap {
            Some(v) => v.as_slice(),
            None => &self.stack[..self.count],
        };
        unsafe {
            Term::new(
                env,
                enif_make_list_from_array(env.as_c_arg(), terms.as_ptr(), self.count as u32),
            )
        }
    }
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
        value.as_object()?.get_last(&key)
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

/// Build the `{:error, _}` term for a parse failure. The vendored sonic-rs caps
/// nesting and reports it with a "...layers deep" message; surface that as
/// `:nesting_too_deep` for parity with get/encode. Other errors keep the
/// sonic-rs message string.
#[inline]
pub(crate) fn parse_error_term<'a>(env: Env<'a>, reason: String) -> Term<'a> {
    let err_raw = atoms::error().as_c_arg();
    if reason.contains("layers deep") {
        make_tuple2(env, err_raw, atoms::nesting_too_deep().as_c_arg())
    } else {
        make_tuple2(env, err_raw, reason.encode(env).as_c_arg())
    }
}

#[rustler::nif]
fn parse<'a>(env: Env<'a>, json: Binary) -> Term<'a> {
    match do_parse(json.as_slice(), false) {
        Ok(resource) => {
            schedule::consume_timeslice(env, timeslice_percent(json.len()));
            make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg())
        }
        Err(reason) => parse_error_term(env, reason),
    }
}

#[rustler::nif(schedule = "DirtyCpu")]
fn parse_dirty<'a>(env: Env<'a>, json: Binary) -> Term<'a> {
    match do_parse(json.as_slice(), false) {
        Ok(resource) => make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg()),
        Err(reason) => parse_error_term(env, reason),
    }
}

#[rustler::nif]
fn parse_opts<'a>(env: Env<'a>, json: Binary, unique_keys: bool) -> Term<'a> {
    match do_parse(json.as_slice(), unique_keys) {
        Ok(resource) => {
            schedule::consume_timeslice(env, timeslice_percent(json.len()));
            make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg())
        }
        Err(reason) => parse_error_term(env, reason),
    }
}

#[rustler::nif(schedule = "DirtyCpu")]
fn parse_opts_dirty<'a>(env: Env<'a>, json: Binary, unique_keys: bool) -> Term<'a> {
    match do_parse(json.as_slice(), unique_keys) {
        Ok(resource) => make_tuple2(env, atoms::ok().as_c_arg(), resource.encode(env).as_c_arg()),
        Err(reason) => parse_error_term(env, reason),
    }
}

#[rustler::nif]
fn get<'a>(env: Env<'a>, doc: ResourceArc<ParsedDocument>, path: &str) -> Term<'a> {
    let ok_raw = atoms::ok().as_c_arg();
    let err_raw = atoms::error().as_c_arg();
    let nsf_raw = atoms::no_such_field().as_c_arg();
    let ntd_raw = atoms::nesting_too_deep().as_c_arg();
    let mut nodes = 0usize;
    let result = match pointer_lookup(&doc.value, path, doc.unique_keys) {
        Some(value) => match value_to_term(env, value, MAX_DEPTH, &mut nodes) {
            Some(term) => make_tuple2(env, ok_raw, term.as_c_arg()),
            None => make_tuple2(env, err_raw, ntd_raw),
        },
        None => make_tuple2(env, err_raw, nsf_raw),
    };
    consume_timeslice_nodes(env, nodes);
    result
}

/// Cached raw atoms for the per-path result tuples in `get_many`.
struct ResultAtoms {
    ok: ERL_NIF_TERM,
    err: ERL_NIF_TERM,
    nsf: ERL_NIF_TERM,
    ntd: ERL_NIF_TERM,
}

#[inline]
fn get_one_result(
    env: Env,
    doc: &ParsedDocument,
    path: &str,
    atoms: &ResultAtoms,
    nodes: &mut usize,
) -> ERL_NIF_TERM {
    match pointer_lookup(&doc.value, path, doc.unique_keys) {
        Some(value) => match value_to_term(env, value, MAX_DEPTH, nodes) {
            Some(term) => make_tuple2(env, atoms.ok, term.as_c_arg()).as_c_arg(),
            None => make_tuple2(env, atoms.err, atoms.ntd).as_c_arg(),
        },
        None => make_tuple2(env, atoms.err, atoms.nsf).as_c_arg(),
    }
}

#[rustler::nif]
fn get_many<'a>(
    env: Env<'a>,
    doc: ResourceArc<ParsedDocument>,
    paths: ListIterator<'a>,
) -> NifResult<Term<'a>> {
    let result_atoms = ResultAtoms {
        ok: atoms::ok().as_c_arg(),
        err: atoms::error().as_c_arg(),
        nsf: atoms::no_such_field().as_c_arg(),
        ntd: atoms::nesting_too_deep().as_c_arg(),
    };
    let mut nodes = 0usize;
    let mut acc = TermAcc::new();

    for path_term in paths {
        // Non-binary (or non-UTF-8) path entries are caller bugs: badarg.
        let path: &str = path_term.decode()?;
        acc.push(get_one_result(env, &doc, path, &result_atoms, &mut nodes));
    }

    consume_timeslice_nodes(env, nodes);
    Ok(acc.into_list(env))
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
    let result = native_decode::decode_to_term(env, input_term, json.as_slice());
    schedule::consume_timeslice(env, timeslice_percent(json.len()));
    result
}

#[rustler::nif(schedule = "DirtyCpu")]
fn decode_dirty<'a>(env: Env<'a>, json: Binary<'a>) -> Term<'a> {
    let input_term = json.encode(env).as_c_arg();
    native_decode::decode_to_term(env, input_term, json.as_slice())
}

// --- Pre-compiled pointers + fused parse/extract ---
//
// The common parse-once-extract-once workload uses a *fixed* set of JSON
// Pointer paths known at startup. Compiling those paths once (segment split,
// `~`-unescape, index-vs-key classification) lets the per-request call skip all
// per-path string work — roughly halving extraction time — and fusing the parse
// and the extraction into one NIF call avoids materializing a document handle.
use crate::{CompiledPaths, PathSeg};

/// Pre-split a single JSON Pointer into segments. A numeric segment is stored as
/// `Num`, keeping both the parsed index and the literal key so the lookup can
/// pick the right interpretation per node (array index vs. object key) —
/// matching the runtime behaviour of `pointer_lookup`.
fn compile_one(path: &str) -> Vec<PathSeg> {
    let mut segs = Vec::new();
    if path.len() <= 1 {
        return segs;
    }
    for segment in path[1..].split('/') {
        let b = segment.as_bytes();
        let key = if segment.contains('~') {
            segment.replace("~1", "/").replace("~0", "~")
        } else {
            segment.to_string()
        };
        if !b.is_empty() && b[0].is_ascii_digit() {
            if let Ok(idx) = segment.parse::<usize>() {
                segs.push(PathSeg::Num { idx, key });
                continue;
            }
        }
        segs.push(PathSeg::Key(key));
    }
    segs
}

#[rustler::nif]
fn compile_paths<'a>(
    env: Env<'a>,
    paths: ListIterator<'a>,
    unique_keys: bool,
) -> NifResult<Term<'a>> {
    let mut out = Vec::new();
    for pt in paths {
        // Non-binary (or non-UTF-8) entries are caller bugs: badarg. Silently
        // compiling them (e.g. as "") would return the whole document.
        let p: &str = pt.decode()?;
        out.push(compile_one(p));
    }
    Ok(ResourceArc::new(CompiledPaths {
        paths: out,
        unique_keys,
    })
    .encode(env))
}

/// Extract all compiled paths from an already-traversed `value` into a result
/// list term, substituting nil for missing fields and depth-exceeded values.
#[inline]
fn extract_compiled<'a>(
    env: Env<'a>,
    value: &sonic_rs::Value,
    compiled: &CompiledPaths,
    nodes: &mut usize,
) -> Term<'a> {
    let nil_raw = atoms::nil().as_c_arg();
    let mut acc = TermAcc::with_hint(compiled.paths.len());
    for segs in compiled.paths.iter() {
        let r = match pointer_lookup_compiled(value, segs, compiled.unique_keys) {
            Some(v) => value_to_term(env, v, MAX_DEPTH, nodes)
                .map(|t| t.as_c_arg())
                .unwrap_or(nil_raw),
            None => nil_raw,
        };
        acc.push(r);
    }
    acc.into_list(env)
}

#[inline]
fn do_parse_get_many_nil<'a>(
    env: Env<'a>,
    bytes: &[u8],
    compiled: &CompiledPaths,
    nodes: &mut usize,
) -> Term<'a> {
    match sonic_rs::from_slice::<sonic_rs::Value>(bytes) {
        Ok(value) => {
            let list = extract_compiled(env, &value, compiled, nodes);
            make_tuple2(env, atoms::ok().as_c_arg(), list.as_c_arg())
        }
        Err(e) => parse_error_term(env, format!("{}", e)),
    }
}

#[rustler::nif]
fn parse_get_many_nil<'a>(
    env: Env<'a>,
    json: Binary,
    compiled: ResourceArc<CompiledPaths>,
) -> Term<'a> {
    let mut nodes = 0usize;
    let result = do_parse_get_many_nil(env, json.as_slice(), &compiled, &mut nodes);
    // Timeslice fractions accumulate: bytes cover the parse, nodes the extraction.
    schedule::consume_timeslice(env, timeslice_percent(json.len()));
    consume_timeslice_nodes(env, nodes);
    result
}

#[rustler::nif(schedule = "DirtyCpu")]
fn parse_get_many_nil_dirty<'a>(
    env: Env<'a>,
    json: Binary,
    compiled: ResourceArc<CompiledPaths>,
) -> Term<'a> {
    let mut nodes = 0usize;
    do_parse_get_many_nil(env, json.as_slice(), &compiled, &mut nodes)
}

#[inline]
fn pointer_lookup_compiled<'v>(
    value: &'v sonic_rs::Value,
    segs: &[PathSeg],
    unique_keys: bool,
) -> Option<&'v sonic_rs::Value> {
    let mut current = value;
    for seg in segs {
        current = match seg {
            PathSeg::Key(k) => object_get(current, k, unique_keys)?,
            PathSeg::Num { idx, key } => {
                if current.is_array() {
                    current.get(*idx)?
                } else {
                    object_get(current, key, unique_keys)?
                }
            }
        };
    }
    Some(current)
}

#[rustler::nif]
fn get_many_nil_compiled<'a>(
    env: Env<'a>,
    doc: ResourceArc<ParsedDocument>,
    compiled: ResourceArc<CompiledPaths>,
) -> Term<'a> {
    let mut nodes = 0usize;
    let result = extract_compiled(env, &doc.value, &compiled, &mut nodes);
    consume_timeslice_nodes(env, nodes);
    result
}

#[rustler::nif]
fn get_many_nil<'a>(
    env: Env<'a>,
    doc: ResourceArc<ParsedDocument>,
    paths: ListIterator<'a>,
) -> NifResult<Term<'a>> {
    let nil_raw = atoms::nil().as_c_arg();
    let mut nodes = 0usize;
    let mut acc = TermAcc::new();

    for path_term in paths {
        // Non-binary (or non-UTF-8) path entries are caller bugs: badarg.
        let path: &str = path_term.decode()?;
        let r = match pointer_lookup(&doc.value, path, doc.unique_keys) {
            Some(value) => match value_to_term(env, value, MAX_DEPTH, &mut nodes) {
                Some(term) => term.as_c_arg(),
                None => nil_raw,
            },
            None => nil_raw,
        };
        acc.push(r);
    }

    consume_timeslice_nodes(env, nodes);
    Ok(acc.into_list(env))
}
