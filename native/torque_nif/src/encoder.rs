use crate::atoms;
use crate::nif_util::make_tuple2;
use crate::types::MAX_DEPTH;
use rustler::sys::{
    c_int, c_uint, enif_get_atom, enif_get_atom_length, enif_get_double, enif_get_int64,
    enif_get_list_cell, enif_get_tuple, enif_get_uint64, enif_inspect_binary, ErlNifBinary,
    ErlNifCharEncoding, ErlNifEnv, ERL_NIF_TERM,
};
use rustler::{Encoder, Env, MapIterator, NewBinary, Term, TermType};
use std::mem::MaybeUninit;

#[derive(Debug)]
enum EncodeError {
    BadArg,
    DepthExceeded,
}

/// Read an atom's name into a stack buffer without heap allocation.
#[inline]
unsafe fn atom_to_stack_buf(
    env_raw: *mut ErlNifEnv,
    term_raw: ERL_NIF_TERM,
    buf: &mut [u8; 256],
) -> Result<&[u8], EncodeError> {
    let mut len: c_uint = 0;
    if enif_get_atom_length(
        env_raw,
        term_raw,
        &mut len,
        ErlNifCharEncoding::ERL_NIF_LATIN1,
    ) == 0
    {
        return Err(EncodeError::BadArg);
    }
    let alen = (len + 1) as usize;
    if alen > 256 {
        return Err(EncodeError::BadArg);
    }
    enif_get_atom(
        env_raw,
        term_raw,
        buf.as_mut_ptr(),
        alen as c_uint,
        ErlNifCharEncoding::ERL_NIF_LATIN1,
    );
    Ok(&buf[..len as usize])
}

#[rustler::nif]
fn encode<'a>(env: Env<'a>, term: Term<'a>) -> Term<'a> {
    let mut buf: Vec<u8> = Vec::with_capacity(2048);
    let env_raw = env.as_c_arg();
    match encode_term(env, env_raw, term, &mut buf, MAX_DEPTH) {
        Ok(()) => {
            let mut binary = NewBinary::new(env, buf.len());
            binary.as_mut_slice().copy_from_slice(&buf);
            let bin_term: Term = binary.into();
            make_tuple2(env, atoms::ok().as_c_arg(), bin_term.as_c_arg())
        }
        Err(EncodeError::DepthExceeded) => make_tuple2(
            env,
            atoms::error().as_c_arg(),
            atoms::nesting_too_deep().as_c_arg(),
        ),
        Err(EncodeError::BadArg) => make_tuple2(
            env,
            atoms::error().as_c_arg(),
            "encode error".encode(env).as_c_arg(),
        ),
    }
}

/// Returns the raw binary on success, raises on error.
/// Skips the {:ok, binary} tuple wrapping for maximum throughput.
#[rustler::nif]
fn encode_iodata<'a>(env: Env<'a>, term: Term<'a>) -> Term<'a> {
    let mut buf: Vec<u8> = Vec::with_capacity(2048);
    let env_raw = env.as_c_arg();
    match encode_term(env, env_raw, term, &mut buf, MAX_DEPTH) {
        Ok(()) => {
            let mut binary = NewBinary::new(env, buf.len());
            binary.as_mut_slice().copy_from_slice(&buf);
            binary.into()
        }
        Err(e) => unsafe {
            let reason = match e {
                EncodeError::DepthExceeded => atoms::nesting_too_deep().as_c_arg(),
                EncodeError::BadArg => "encode error".encode(env).as_c_arg(),
            };
            Term::new(env, rustler::sys::enif_raise_exception(env_raw, reason))
        },
    }
}

#[inline]
fn encode_term(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
    depth: u32,
) -> Result<(), EncodeError> {
    match term.get_type() {
        TermType::Map => encode_map(env, env_raw, term, buf, depth),
        TermType::List => encode_list(env, env_raw, term, buf, depth),
        TermType::Binary => encode_binary(env_raw, term, buf),
        TermType::Integer => encode_integer(env_raw, term, buf),
        TermType::Float => encode_float(env_raw, term, buf),
        TermType::Atom => encode_atom(env_raw, term, buf),
        TermType::Tuple => encode_tuple(env, env_raw, term, buf, depth),
        _ => Err(EncodeError::BadArg),
    }
}

fn encode_map(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
    depth: u32,
) -> Result<(), EncodeError> {
    if depth == 0 {
        return Err(EncodeError::DepthExceeded);
    }
    let iter = MapIterator::new(term).ok_or(EncodeError::BadArg)?;
    buf.push(b'{');
    let mut first = true;
    for (key, value) in iter {
        if !first {
            buf.push(b',');
        }
        first = false;
        encode_map_key(env_raw, key, buf)?;
        buf.push(b':');
        encode_term(env, env_raw, value, buf, depth - 1)?;
    }
    buf.push(b'}');
    Ok(())
}

#[inline]
fn encode_map_key(
    env_raw: *mut ErlNifEnv,
    key: Term,
    buf: &mut Vec<u8>,
) -> Result<(), EncodeError> {
    buf.push(b'"');
    match key.get_type() {
        TermType::Atom => {
            let mut atom_buf = [0u8; 256];
            let name = unsafe { atom_to_stack_buf(env_raw, key.as_c_arg(), &mut atom_buf)? };
            escape_bytes(name, buf);
        }
        TermType::Binary => {
            let mut bin = MaybeUninit::<ErlNifBinary>::uninit();
            unsafe {
                if enif_inspect_binary(env_raw, key.as_c_arg(), bin.as_mut_ptr()) == 0 {
                    return Err(EncodeError::BadArg);
                }
                let bin = bin.assume_init();
                let slice = std::slice::from_raw_parts(bin.data, bin.size);
                escape_bytes(slice, buf);
            }
        }
        _ => return Err(EncodeError::BadArg),
    }
    buf.push(b'"');
    Ok(())
}

fn encode_list(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
    depth: u32,
) -> Result<(), EncodeError> {
    if depth == 0 {
        return Err(EncodeError::DepthExceeded);
    }
    buf.push(b'[');
    let mut first = true;
    let mut current = term.as_c_arg();
    let mut head: ERL_NIF_TERM = 0;
    let mut tail: ERL_NIF_TERM = 0;
    while unsafe { enif_get_list_cell(env_raw, current, &mut head, &mut tail) } != 0 {
        if !first {
            buf.push(b',');
        }
        first = false;
        let item = unsafe { Term::new(env, head) };
        encode_term(env, env_raw, item, buf, depth - 1)?;
        current = tail;
    }
    buf.push(b']');
    Ok(())
}

#[inline]
fn encode_binary(
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
) -> Result<(), EncodeError> {
    let mut bin = MaybeUninit::<ErlNifBinary>::uninit();
    unsafe {
        if enif_inspect_binary(env_raw, term.as_c_arg(), bin.as_mut_ptr()) == 0 {
            return Err(EncodeError::BadArg);
        }
        let bin = bin.assume_init();
        let slice = std::slice::from_raw_parts(bin.data, bin.size);
        buf.push(b'"');
        escape_bytes(slice, buf);
        buf.push(b'"');
    }
    Ok(())
}

#[inline]
fn encode_integer(
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
) -> Result<(), EncodeError> {
    let mut n: i64 = 0;
    if unsafe { enif_get_int64(env_raw, term.as_c_arg(), &mut n) } != 0 {
        let mut itoa_buf = itoa::Buffer::new();
        buf.extend_from_slice(itoa_buf.format(n).as_bytes());
        return Ok(());
    }
    // Fallback for u64 range (i64::MAX + 1 ..= u64::MAX)
    let mut u: u64 = 0;
    if unsafe { enif_get_uint64(env_raw, term.as_c_arg(), &mut u) } != 0 {
        let mut itoa_buf = itoa::Buffer::new();
        buf.extend_from_slice(itoa_buf.format(u).as_bytes());
        return Ok(());
    }
    Err(EncodeError::BadArg)
}

#[inline]
fn encode_float(env_raw: *mut ErlNifEnv, term: Term, buf: &mut Vec<u8>) -> Result<(), EncodeError> {
    let mut n: f64 = 0.0;
    if unsafe { enif_get_double(env_raw, term.as_c_arg(), &mut n) } == 0 {
        return Err(EncodeError::BadArg);
    }
    // ryu panics on non-finite floats; JSON has no representation for them
    if !n.is_finite() {
        return Err(EncodeError::BadArg);
    }
    let mut ryu_buf = ryu::Buffer::new();
    buf.extend_from_slice(ryu_buf.format(n).as_bytes());
    Ok(())
}

#[inline]
fn encode_atom(env_raw: *mut ErlNifEnv, term: Term, buf: &mut Vec<u8>) -> Result<(), EncodeError> {
    let raw = term.as_c_arg();
    if raw == atoms::r#true().as_c_arg() {
        buf.extend_from_slice(b"true");
    } else if raw == atoms::r#false().as_c_arg() {
        buf.extend_from_slice(b"false");
    } else if raw == atoms::nil().as_c_arg() {
        buf.extend_from_slice(b"null");
    } else {
        let mut atom_buf = [0u8; 256];
        let name = unsafe { atom_to_stack_buf(env_raw, raw, &mut atom_buf)? };
        buf.push(b'"');
        escape_bytes(name, buf);
        buf.push(b'"');
    }
    Ok(())
}

/// Get a raw tuple slice without allocating a Vec.
#[inline]
unsafe fn get_tuple_raw<'a>(
    env_raw: *mut ErlNifEnv,
    term: Term,
) -> Result<&'a [ERL_NIF_TERM], EncodeError> {
    let mut arity: c_int = 0;
    let mut array_ptr = MaybeUninit::uninit();
    if enif_get_tuple(env_raw, term.as_c_arg(), &mut arity, array_ptr.as_mut_ptr()) != 1 {
        return Err(EncodeError::BadArg);
    }
    Ok(std::slice::from_raw_parts(
        array_ptr.assume_init(),
        arity as usize,
    ))
}

fn encode_tuple(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
    depth: u32,
) -> Result<(), EncodeError> {
    let elements = unsafe { get_tuple_raw(env_raw, term)? };
    if elements.len() == 1 {
        let inner = unsafe { Term::new(env, elements[0]) };
        if inner.get_type() == TermType::List {
            return encode_proplist(env, env_raw, inner, buf, depth);
        }
    }
    Err(EncodeError::BadArg)
}

fn encode_proplist(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
    depth: u32,
) -> Result<(), EncodeError> {
    if depth == 0 {
        return Err(EncodeError::DepthExceeded);
    }
    buf.push(b'{');
    let mut first = true;
    let mut current = term.as_c_arg();
    let mut head: ERL_NIF_TERM = 0;
    let mut tail: ERL_NIF_TERM = 0;
    while unsafe { enif_get_list_cell(env_raw, current, &mut head, &mut tail) } != 0 {
        let pair = unsafe {
            let pair_term = Term::new(env, head);
            get_tuple_raw(env_raw, pair_term)?
        };
        if pair.len() != 2 {
            return Err(EncodeError::BadArg);
        }
        if !first {
            buf.push(b',');
        }
        first = false;
        let key = unsafe { Term::new(env, pair[0]) };
        let val = unsafe { Term::new(env, pair[1]) };
        encode_map_key(env_raw, key, buf)?;
        buf.push(b':');
        encode_term(env, env_raw, val, buf, depth - 1)?;
        current = tail;
    }
    buf.push(b'}');
    Ok(())
}

#[inline]
fn escape_bytes(bytes: &[u8], buf: &mut Vec<u8>) {
    let len = bytes.len();
    let mut start = 0;

    for i in 0..len {
        let b = bytes[i];
        let escape = match b {
            b'"' => b"\\\"" as &[u8],
            b'\\' => b"\\\\",
            b'\n' => b"\\n",
            b'\r' => b"\\r",
            b'\t' => b"\\t",
            0x08 => b"\\b",
            0x0C => b"\\f",
            b if b < 0x20 => {
                if start < i {
                    buf.extend_from_slice(&bytes[start..i]);
                }
                buf.extend_from_slice(b"\\u00");
                buf.push(HEX_DIGITS[(b >> 4) as usize]);
                buf.push(HEX_DIGITS[(b & 0x0F) as usize]);
                start = i + 1;
                continue;
            }
            _ => {
                continue;
            }
        };
        if start < i {
            buf.extend_from_slice(&bytes[start..i]);
        }
        buf.extend_from_slice(escape);
        start = i + 1;
    }
    if start < len {
        buf.extend_from_slice(&bytes[start..len]);
    }
}

const HEX_DIGITS: [u8; 16] = *b"0123456789abcdef";
