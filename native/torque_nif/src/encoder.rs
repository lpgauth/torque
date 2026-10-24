use crate::atoms;
use crate::escape::InvalidUtf8;
use crate::nif_util::{make_tuple2, timeslice_percent, MapEntries};
use crate::types::MAX_DEPTH;
use rustler::sys::{
    c_int, c_uint, enif_get_atom, enif_get_double, enif_get_int64, enif_get_list_cell,
    enif_get_tuple, enif_get_uint64, enif_inspect_binary, enif_is_empty_list, enif_release_binary,
    enif_term_to_binary, ErlNifBinary, ErlNifCharEncoding, ErlNifEnv, ERL_NIF_TERM,
};
use rustler::{schedule, Atom, Env, NewBinary, Term, TermType};
use std::cell::RefCell;
use std::mem::MaybeUninit;

/// Below this output size the work is sub-microsecond, so the
/// enif_consume_timeslice call costs more than the scheduler accounting is
/// worth. The BEAM's fixed per-NIF-call reduction charge already covers it.
const TIMESLICE_MIN_BYTES: usize = 4096;

/// Cap on the retained thread-local scratch buffer, so a one-off huge document
/// doesn't pin a large allocation on a scheduler thread indefinitely.
const BUF_RETAIN_CAP: usize = 1 << 20;

/// Cap on the retained indent unit. Callers pass a short binary in practice, but
/// nothing stops one from passing a huge one, and the scratch outlives the call.
const INDENT_RETAIN_CAP: usize = 64;

/// Atom-name cache slots per scheduler thread, indexed by atom-table index.
const ATOM_SLOTS: usize = 512;
/// Longest quoted, escaped name the cache holds.
const ATOM_NAME_CAP: usize = 32;

#[derive(Clone, Copy)]
struct AtomName {
    term: ERL_NIF_TERM,
    len: usize,
    quoted: [u8; ATOM_NAME_CAP],
}

/// Quoted, escaped JSON spellings of encoded atoms, keyed by the raw term.
/// Atoms are never garbage collected, so entries stay valid across calls, and
/// raw terms of different types never compare equal, so a hit needs no type
/// check.
struct AtomNames {
    slots: Box<[AtomName; ATOM_SLOTS]>,
}

impl AtomNames {
    fn new() -> Self {
        // 0 has the header tag, which no term carries, so empty slots never hit.
        let empty = AtomName {
            term: 0,
            len: 0,
            quoted: [0; ATOM_NAME_CAP],
        };
        AtomNames {
            slots: Box::new([empty; ATOM_SLOTS]),
        }
    }

    /// ERTS tags an atom as `index << 6 | 0b001011`. Any other layout only
    /// degrades the spread, never correctness: hits compare the whole term.
    #[inline(always)]
    fn slot(term: ERL_NIF_TERM) -> usize {
        (term >> 6) & (ATOM_SLOTS - 1)
    }

    /// Appends `term`'s quoted name when it is a cached atom.
    #[must_use]
    #[inline(always)]
    fn write_cached(&self, term: ERL_NIF_TERM, buf: &mut Vec<u8>) -> bool {
        let entry = &self.slots[Self::slot(term)];
        if entry.term != term {
            return false;
        }
        buf.reserve(ATOM_NAME_CAP);
        // SAFETY: ATOM_NAME_CAP bytes were just reserved. The fixed-size copy
        // is two vector moves where `len` bytes would be a memcpy call.
        unsafe {
            let at = buf.len();
            std::ptr::copy_nonoverlapping(
                entry.quoted.as_ptr(),
                buf.as_mut_ptr().add(at),
                ATOM_NAME_CAP,
            );
            buf.set_len(at + entry.len);
        }
        true
    }

    /// Appends `term`'s quoted name, caching it when it fits.
    #[inline(never)]
    fn write(
        &mut self,
        env_raw: *mut ErlNifEnv,
        term: ERL_NIF_TERM,
        buf: &mut Vec<u8>,
    ) -> Result<(), EncodeError> {
        let start = buf.len();
        buf.push(b'"');
        write_atom_name(env_raw, term, buf)?;
        buf.push(b'"');
        let quoted = &buf[start..];
        if quoted.len() <= ATOM_NAME_CAP {
            let entry = &mut self.slots[Self::slot(term)];
            entry.quoted[..quoted.len()].copy_from_slice(quoted);
            entry.len = quoted.len();
            entry.term = term;
        }
        Ok(())
    }
}

struct Scratch {
    buf: Vec<u8>,
    names: AtomNames,
    /// The atom that encodes as JSON null for the current call: `nil` from
    /// Elixir, `null` from Erlang. Set on entry; it rides in the scratch the
    /// recursion already carries rather than a thread-local read per atom.
    null: ERL_NIF_TERM,
    /// Indent unit for pretty output, copied from the caller's binary on entry
    /// so the scratch never holds env-owned memory. Empty selects compact
    /// output.
    indent: Vec<u8>,
    /// Nesting level of the container being written, for indent repetition.
    depth: usize,
}

impl Scratch {
    #[inline]
    fn prepare(&mut self, null: ERL_NIF_TERM, indent: &[u8]) {
        self.buf.clear();
        self.null = null;
        self.depth = 0;
        self.indent.clear();
        self.indent.extend_from_slice(indent);
    }

    // The shape of the output is a `PRETTY` const parameter rather than a
    // runtime flag: the compact instantiation is then the code the encoder
    // wrote before pretty printing existed, with no per-member check, while
    // the pretty one is monomorphized separately.

    #[inline(always)]
    fn open<const PRETTY: bool>(&mut self, bracket: u8) {
        self.buf.push(bracket);
        if PRETTY {
            self.depth += 1;
        }
    }

    /// Separator before a container member or array item: a bare comma when
    /// compact, a line break plus the current indent when pretty.
    #[inline(always)]
    fn separator<const PRETTY: bool>(&mut self, first: bool) {
        if PRETTY {
            self.buf
                .extend_from_slice(if first { b"\n" } else { b",\n" });
            self.write_indent(self.depth);
        } else if !first {
            self.buf.push(b',');
        }
    }

    #[inline(always)]
    fn key_separator<const PRETTY: bool>(&mut self) {
        if PRETTY {
            self.buf.extend_from_slice(b": ");
        } else {
            self.buf.push(b':');
        }
    }

    /// Closes a container. An empty one stays on one line, matching Jason.
    #[inline(always)]
    fn close<const PRETTY: bool>(&mut self, bracket: u8, non_empty: bool) {
        if PRETTY {
            self.depth -= 1;
            if non_empty {
                self.buf.push(b'\n');
                self.write_indent(self.depth);
            }
        }
        self.buf.push(bracket);
    }

    #[inline(always)]
    fn write_indent(&mut self, levels: usize) {
        for _ in 0..levels {
            self.buf.extend_from_slice(&self.indent);
        }
    }

    /// Drops oversized allocations a one-off call left behind, so they aren't
    /// pinned on this scheduler thread indefinitely.
    #[inline]
    fn finish(&mut self) {
        if self.buf.capacity() > BUF_RETAIN_CAP {
            self.buf.shrink_to(BUF_RETAIN_CAP);
        }
        if self.indent.capacity() > INDENT_RETAIN_CAP {
            self.indent = Vec::new();
        }
    }
}

thread_local! {
    /// Reused across encode calls on each scheduler thread, avoiding a
    /// malloc/free per call. NIFs run to completion and the encoder never
    /// re-enters, so the borrow is never nested.
    static SCRATCH: RefCell<Scratch> = RefCell::new(Scratch {
        buf: Vec::with_capacity(2048),
        names: AtomNames::new(),
        null: 0,
        indent: Vec::new(),
        depth: 0,
    });
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum EncodeError {
    UnsupportedType,
    NonFiniteFloat,
    InvalidKey,
    MalformedProplist,
    DepthExceeded,
    InvalidUtf8,
    UnhandledStruct,
}

impl From<InvalidUtf8> for EncodeError {
    fn from(_: InvalidUtf8) -> Self {
        EncodeError::InvalidUtf8
    }
}

#[inline]
fn error_reason(e: EncodeError) -> ERL_NIF_TERM {
    match e {
        EncodeError::DepthExceeded => atoms::nesting_too_deep().as_c_arg(),
        EncodeError::UnsupportedType => atoms::unsupported_type().as_c_arg(),
        EncodeError::NonFiniteFloat => atoms::non_finite_float().as_c_arg(),
        EncodeError::InvalidKey => atoms::invalid_key().as_c_arg(),
        EncodeError::MalformedProplist => atoms::malformed_proplist().as_c_arg(),
        EncodeError::InvalidUtf8 => atoms::invalid_utf8().as_c_arg(),
        EncodeError::UnhandledStruct => atoms::unhandled_struct().as_c_arg(),
    }
}

/// The scheduler an encode runs on.
#[derive(Clone, Copy, PartialEq, Eq)]
enum Scheduler {
    Normal,
    Dirty,
}

/// Hand the finished scratch buffer to a freshly allocated Erlang binary,
/// reporting the work to the scheduler only when it's large enough to matter.
/// Timeslice accounting is skipped on dirty schedulers, where it's meaningless.
#[inline]
fn buf_to_binary<'a>(env: Env<'a>, buf: &[u8], scheduler: Scheduler) -> Term<'a> {
    if scheduler == Scheduler::Normal && buf.len() >= TIMESLICE_MIN_BYTES {
        schedule::consume_timeslice(env, timeslice_percent(buf.len()));
    }
    let mut binary = NewBinary::new(env, buf.len());
    binary.as_mut_slice().copy_from_slice(buf);
    binary.into()
}

/// Read an atom's name into a stack buffer without heap allocation.
///
/// Latin-1, because `ERL_NIF_UTF8` is a NIF 2.17 (OTP 26) addition and this
/// NIF still loads on 2.15. Reports `None` rather than an error for a name
/// holding a character above U+00FF; `write_atom_name` reads those a slower
/// way. Only atoms reach here, so failure has no other cause.
///
/// # Safety
///
/// `env_raw` must be a live environment that `term_raw` belongs to.
#[inline]
unsafe fn atom_to_stack_buf(
    env_raw: *mut ErlNifEnv,
    term_raw: ERL_NIF_TERM,
    buf: &mut [u8; 256],
) -> Option<&[u8]> {
    let len = enif_get_atom(
        env_raw,
        term_raw,
        buf.as_mut_ptr(),
        buf.len() as c_uint,
        ErlNifCharEncoding::ERL_NIF_LATIN1,
    );
    if len == 0 {
        None
    } else {
        // The return count includes the terminator, not just the prefix before
        // an embedded NUL. Even an empty atom therefore returns one.
        Some(&buf[..len as usize - 1])
    }
}

/// External term format tags for a UTF-8 atom: `SMALL_ATOM_UTF8_EXT` carries a
/// one-byte length, `ATOM_UTF8_EXT` a two-byte big-endian one.
const SMALL_ATOM_UTF8_EXT: u8 = 119;
const ATOM_UTF8_EXT: u8 = 118;

/// Append an atom whose name leaves the Latin-1 range, as escaped UTF-8.
///
/// `enif_get_atom` cannot spell these below NIF 2.17, but `enif_term_to_binary`
/// can: an atom that is not Latin-1 representable always serialises as one of
/// the two UTF-8 atom tags, whose payload is the name. That costs a binary per
/// atom, which is why only the atoms the fast path rejects come here.
#[cold]
fn write_wide_atom_name(
    env_raw: *mut ErlNifEnv,
    term_raw: ERL_NIF_TERM,
    buf: &mut Vec<u8>,
) -> Result<(), EncodeError> {
    let mut bin = MaybeUninit::<ErlNifBinary>::uninit();
    // SAFETY: `term_raw` belongs to `env_raw`, and `bin` is written on success.
    if unsafe { enif_term_to_binary(env_raw, term_raw, bin.as_mut_ptr()) } == 0 {
        return Err(EncodeError::UnsupportedType);
    }
    // SAFETY: `enif_term_to_binary` succeeded, so `bin` holds `size` bytes at
    // `data`, which this function owns until the release below.
    let (mut bin, bytes) = unsafe {
        let bin = bin.assume_init();
        (bin, std::slice::from_raw_parts(bin.data, bin.size))
    };

    // `131`, tag, length, name.
    let name = match bytes {
        [131, SMALL_ATOM_UTF8_EXT, len, rest @ ..] if rest.len() >= *len as usize => {
            Some(&rest[..*len as usize])
        }
        [131, ATOM_UTF8_EXT, hi, lo, rest @ ..]
            if rest.len() >= u16::from_be_bytes([*hi, *lo]) as usize =>
        {
            Some(&rest[..u16::from_be_bytes([*hi, *lo]) as usize])
        }
        _ => None,
    };
    let result = match name {
        Some(name) => {
            crate::escape::escape_to_vec(name, buf);
            Ok(())
        }
        None => Err(EncodeError::UnsupportedType),
    };
    // SAFETY: `bin` came from `enif_term_to_binary`, and `bytes` is not used
    // past this point.
    unsafe { enif_release_binary(&mut bin) };
    result
}

/// Append an atom's name to `buf` as an escaped JSON string body (no quotes).
///
/// The Latin-1 read yields bytes >= 0x80 for the U+0080..U+00FF range, which
/// are transcoded to two-byte UTF-8 so the emitted JSON stays valid.
#[inline]
fn write_atom_name(
    env_raw: *mut ErlNifEnv,
    term_raw: ERL_NIF_TERM,
    buf: &mut Vec<u8>,
) -> Result<(), EncodeError> {
    let mut atom_buf = [0u8; 256];
    // SAFETY: the encoder only passes a term together with its own env.
    let Some(name) = (unsafe { atom_to_stack_buf(env_raw, term_raw, &mut atom_buf) }) else {
        return write_wide_atom_name(env_raw, term_raw, buf);
    };
    if name.is_ascii() {
        crate::escape::escape_to_vec(name, buf);
    } else {
        // Latin-1 name is at most 255 bytes, so 2x fits on the stack.
        let mut utf8 = [0u8; 512];
        let mut n = 0usize;
        for &b in name {
            if b < 0x80 {
                utf8[n] = b;
                n += 1;
            } else {
                utf8[n] = 0xC0 | (b >> 6);
                utf8[n + 1] = 0x80 | (b & 0x3F);
                n += 2;
            }
        }
        crate::escape::escape_to_vec(&utf8[..n], buf);
    }
    Ok(())
}

/// Bytes of the caller's indent binary, or empty for compact output. Both the
/// Elixir and Erlang fronts always pass a binary, so only a direct NIF call
/// with another type reaches the empty fallback.
#[inline]
fn indent_bytes<'a>(env_raw: *mut ErlNifEnv, indent: Term<'a>) -> &'a [u8] {
    let mut bin = MaybeUninit::<ErlNifBinary>::uninit();
    // SAFETY: `indent` belongs to `env_raw`; on success `bin` describes bytes
    // that live as long as the term.
    unsafe {
        if enif_inspect_binary(env_raw, indent.as_c_arg(), bin.as_mut_ptr()) == 0 {
            return &[];
        }
        let bin = bin.assume_init();
        std::slice::from_raw_parts(bin.data, bin.size)
    }
}

#[inline]
fn encode_impl<'a>(
    env: Env<'a>,
    term: Term<'a>,
    scheduler: Scheduler,
    null: ERL_NIF_TERM,
    indent: &[u8],
) -> Term<'a> {
    let env_raw = env.as_c_arg();
    SCRATCH.with(|cell| {
        let s = &mut *cell.borrow_mut();
        s.prepare(null, indent);
        let result = match encode_root(env, env_raw, term, s) {
            Ok(()) => {
                let bin_term = buf_to_binary(env, &s.buf, scheduler);
                make_tuple2(env, atoms::ok().as_c_arg(), bin_term.as_c_arg())
            }
            Err(e) => make_tuple2(env, atoms::error().as_c_arg(), error_reason(e)),
        };
        s.finish();
        result
    })
}

#[rustler::nif]
fn encode<'a>(env: Env<'a>, term: Term<'a>) -> Term<'a> {
    encode_impl(env, term, Scheduler::Normal, atoms::nil().as_c_arg(), &[])
}

/// Opt-in dirty variant: output size can't be predicted from the input term
/// without a full traversal, so large encodes are dispatched by the caller.
#[rustler::nif(schedule = "DirtyCpu")]
fn encode_dirty<'a>(env: Env<'a>, term: Term<'a>) -> Term<'a> {
    encode_impl(env, term, Scheduler::Dirty, atoms::nil().as_c_arg(), &[])
}

/// `encode/1` with the atom that encodes as JSON null and the pretty-print
/// indent chosen by the caller; an empty indent binary means compact output.
#[rustler::nif]
fn encode_opts<'a>(env: Env<'a>, term: Term<'a>, null: Atom, indent: Term<'a>) -> Term<'a> {
    let indent = indent_bytes(env.as_c_arg(), indent);
    encode_impl(env, term, Scheduler::Normal, null.as_c_arg(), indent)
}

#[rustler::nif(schedule = "DirtyCpu")]
fn encode_opts_dirty<'a>(env: Env<'a>, term: Term<'a>, null: Atom, indent: Term<'a>) -> Term<'a> {
    let indent = indent_bytes(env.as_c_arg(), indent);
    encode_impl(env, term, Scheduler::Dirty, null.as_c_arg(), indent)
}

/// Returns the raw binary on success, raises on error.
/// Skips the {:ok, binary} tuple wrapping for maximum throughput.
#[inline]
fn encode_iodata_impl<'a>(
    env: Env<'a>,
    term: Term<'a>,
    scheduler: Scheduler,
    indent: &[u8],
) -> Term<'a> {
    let env_raw = env.as_c_arg();
    SCRATCH.with(|cell| {
        let s = &mut *cell.borrow_mut();
        s.prepare(atoms::nil().as_c_arg(), indent);
        let result = match encode_root(env, env_raw, term, s) {
            Ok(()) => buf_to_binary(env, &s.buf, scheduler),
            // SAFETY: the reason is an atom, and the raised term is returned.
            Err(e) => unsafe {
                Term::new(
                    env,
                    rustler::sys::enif_raise_exception(env_raw, error_reason(e)),
                )
            },
        };
        s.finish();
        result
    })
}

#[rustler::nif]
fn encode_iodata<'a>(env: Env<'a>, term: Term<'a>) -> Term<'a> {
    encode_iodata_impl(env, term, Scheduler::Normal, &[])
}

#[rustler::nif(schedule = "DirtyCpu")]
fn encode_iodata_dirty<'a>(env: Env<'a>, term: Term<'a>) -> Term<'a> {
    encode_iodata_impl(env, term, Scheduler::Dirty, &[])
}

/// `encode_iodata/1` with a pretty-print indent; empty means compact.
#[rustler::nif]
fn encode_iodata_opts<'a>(env: Env<'a>, term: Term<'a>, indent: Term<'a>) -> Term<'a> {
    let indent = indent_bytes(env.as_c_arg(), indent);
    encode_iodata_impl(env, term, Scheduler::Normal, indent)
}

#[rustler::nif(schedule = "DirtyCpu")]
fn encode_iodata_opts_dirty<'a>(env: Env<'a>, term: Term<'a>, indent: Term<'a>) -> Term<'a> {
    let indent = indent_bytes(env.as_c_arg(), indent);
    encode_iodata_impl(env, term, Scheduler::Dirty, indent)
}

/// Picks the compact or pretty instantiation once per call, so neither pays
/// for the other's branches.
#[inline]
fn encode_root(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    s: &mut Scratch,
) -> Result<(), EncodeError> {
    if s.indent.is_empty() {
        encode_term::<false>(env, env_raw, term, s, MAX_DEPTH)
    } else {
        encode_term::<true>(env, env_raw, term, s, MAX_DEPTH)
    }
}

#[inline]
fn encode_term<const PRETTY: bool>(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    s: &mut Scratch,
    depth: u32,
) -> Result<(), EncodeError> {
    match term.get_type() {
        TermType::Map => encode_map::<PRETTY>(env, env_raw, term, s, depth),
        TermType::List => encode_list::<PRETTY>(env, env_raw, term, s, depth),
        TermType::Binary => encode_binary(env_raw, term, &mut s.buf),
        TermType::Integer => encode_integer(env_raw, term, &mut s.buf),
        TermType::Float => encode_float(env_raw, term, &mut s.buf),
        TermType::Atom => encode_atom(env_raw, term, s),
        TermType::Tuple => encode_tuple::<PRETTY>(env, env_raw, term, s, depth),
        _ => Err(EncodeError::UnsupportedType),
    }
}

fn encode_map<const PRETTY: bool>(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    s: &mut Scratch,
    depth: u32,
) -> Result<(), EncodeError> {
    if depth == 0 {
        return Err(EncodeError::DepthExceeded);
    }
    let iter = MapEntries::new(term).ok_or(EncodeError::UnsupportedType)?;
    // Elixir structs (maps carrying an atom `__struct__` key) are not
    // encodable as-is: they must opt into Torque.Encoder, and the Elixir layer
    // normalizes them through the protocol and retries once. The test rides on
    // the iteration the encoder already does: atoms are immediate terms, so a
    // key is the `__struct__` atom exactly when the raw terms are equal. A
    // separate enif_get_map_value would rescan the key array the loop is about
    // to walk anyway. A binary "__struct__" key is boxed and never matches.
    let struct_key = atoms::__struct__().as_c_arg();
    s.open::<PRETTY>(b'{');
    let mut first = true;
    for (key, value) in iter {
        if key.as_c_arg() == struct_key {
            return Err(EncodeError::UnhandledStruct);
        }
        s.separator::<PRETTY>(first);
        first = false;
        encode_map_key(env_raw, key, s)?;
        s.key_separator::<PRETTY>();
        encode_term::<PRETTY>(env, env_raw, value, s, depth - 1)?;
    }
    s.close::<PRETTY>(b'}', !first);
    Ok(())
}

#[inline]
fn encode_map_key(env_raw: *mut ErlNifEnv, key: Term, s: &mut Scratch) -> Result<(), EncodeError> {
    let raw = key.as_c_arg();
    // Atoms are immediates (low tag bits 0b11), so boxed binary keys skip the
    // probe. A filter only: a hit still compares the whole term.
    if raw & 0b11 == 0b11 && s.names.write_cached(raw, &mut s.buf) {
        return Ok(());
    }
    // `enif_inspect_binary` doubles as the type check for the common binary-key
    // path, avoiding a separate `enif_term_type` call.
    let mut bin = MaybeUninit::<ErlNifBinary>::uninit();
    // SAFETY: on success `bin` describes the binary's bytes, which live as
    // long as the term they came from.
    if unsafe { enif_inspect_binary(env_raw, raw, bin.as_mut_ptr()) } != 0 {
        // SAFETY: initialised by the successful call above.
        let slice = unsafe {
            let bin = bin.assume_init();
            std::slice::from_raw_parts(bin.data, bin.size)
        };
        return Ok(crate::escape::write_json_string(slice, &mut s.buf)?);
    }
    match key.get_type() {
        TermType::Atom => s.names.write(env_raw, raw, &mut s.buf),
        // Object names must be strings (RFC 8259 §4), so integer keys are
        // stringified rather than rejected, matching Jason. Skips escaping
        // because a decimal integer is only digits and a leading '-'.
        TermType::Integer => {
            s.buf.push(b'"');
            encode_integer(env_raw, key, &mut s.buf)?;
            s.buf.push(b'"');
            Ok(())
        }
        _ => Err(EncodeError::InvalidKey),
    }
}

fn encode_list<const PRETTY: bool>(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    s: &mut Scratch,
    depth: u32,
) -> Result<(), EncodeError> {
    if depth == 0 {
        return Err(EncodeError::DepthExceeded);
    }
    s.open::<PRETTY>(b'[');
    let mut first = true;
    let mut current = term.as_c_arg();
    let mut head: ERL_NIF_TERM = 0;
    let mut tail: ERL_NIF_TERM = 0;
    // SAFETY: `current` is the list term or a tail read from it, all in `env`.
    while unsafe { enif_get_list_cell(env_raw, current, &mut head, &mut tail) } != 0 {
        s.separator::<PRETTY>(first);
        first = false;
        // SAFETY: a list cell's head belongs to the list's env.
        let item = unsafe { Term::new(env, head) };
        encode_term::<PRETTY>(env, env_raw, item, s, depth - 1)?;
        current = tail;
    }
    // Improper list: the loop ends on a non-cons tail, which must be [].
    // SAFETY: `current` is a tail read from the list, in `env`.
    if unsafe { enif_is_empty_list(env_raw, current) } == 0 {
        return Err(EncodeError::UnsupportedType);
    }
    s.close::<PRETTY>(b']', !first);
    Ok(())
}

#[inline]
fn encode_binary(
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
) -> Result<(), EncodeError> {
    let mut bin = MaybeUninit::<ErlNifBinary>::uninit();
    // SAFETY: on success `bin` describes the binary's bytes, which live as
    // long as `term`.
    let slice = unsafe {
        if enif_inspect_binary(env_raw, term.as_c_arg(), bin.as_mut_ptr()) == 0 {
            return Err(EncodeError::UnsupportedType);
        }
        let bin = bin.assume_init();
        std::slice::from_raw_parts(bin.data, bin.size)
    };
    Ok(crate::escape::write_json_string(slice, buf)?)
}

#[inline]
fn encode_integer(
    env_raw: *mut ErlNifEnv,
    term: Term,
    buf: &mut Vec<u8>,
) -> Result<(), EncodeError> {
    let mut n: i64 = 0;
    // SAFETY: `term` belongs to `env_raw`, and `n` is a local the call writes.
    if unsafe { enif_get_int64(env_raw, term.as_c_arg(), &mut n) } != 0 {
        let mut itoa_buf = itoa::Buffer::new();
        buf.extend_from_slice(itoa_buf.format(n).as_bytes());
        return Ok(());
    }
    // Fallback for u64 range (i64::MAX + 1 ..= u64::MAX)
    let mut u: u64 = 0;
    // SAFETY: as for `enif_get_int64` above.
    if unsafe { enif_get_uint64(env_raw, term.as_c_arg(), &mut u) } != 0 {
        let mut itoa_buf = itoa::Buffer::new();
        buf.extend_from_slice(itoa_buf.format(u).as_bytes());
        return Ok(());
    }
    // Arbitrary-precision integer (Erlang bignum) — the term is an integer
    // (encode_term only routes integers here) but doesn't fit i64/u64, so
    // emit its exact decimal form. num-bigint's Display is plain base-10 with
    // a leading '-' for negatives, which is already a valid JSON number.
    if let Ok(big) = term.decode::<rustler::BigInt>() {
        use std::io::Write;
        let _ = write!(buf, "{}", big);
        return Ok(());
    }
    Err(EncodeError::UnsupportedType)
}

#[inline]
fn encode_float(env_raw: *mut ErlNifEnv, term: Term, buf: &mut Vec<u8>) -> Result<(), EncodeError> {
    let mut n: f64 = 0.0;
    // SAFETY: `term` belongs to `env_raw`, and `n` is a local the call writes.
    if unsafe { enif_get_double(env_raw, term.as_c_arg(), &mut n) } == 0 {
        return Err(EncodeError::UnsupportedType);
    }
    // JSON has no non-finite numbers, and `format_finite` requires this check.
    if !n.is_finite() {
        return Err(EncodeError::NonFiniteFloat);
    }
    let mut fbuf = zmij::Buffer::new();
    buf.extend_from_slice(fbuf.format_finite(n).as_bytes());
    Ok(())
}

#[inline]
fn encode_atom(env_raw: *mut ErlNifEnv, term: Term, s: &mut Scratch) -> Result<(), EncodeError> {
    let raw = term.as_c_arg();
    if raw == atoms::r#true().as_c_arg() {
        s.buf.extend_from_slice(b"true");
    } else if raw == atoms::r#false().as_c_arg() {
        s.buf.extend_from_slice(b"false");
    } else if raw == s.null {
        s.buf.extend_from_slice(b"null");
    } else if !s.names.write_cached(raw, &mut s.buf) {
        s.names.write(env_raw, raw, &mut s.buf)?;
    }
    Ok(())
}

/// Get a raw tuple slice without allocating a Vec.
#[inline]
fn get_tuple_raw(term: Term<'_>) -> Result<&[ERL_NIF_TERM], EncodeError> {
    let mut arity: c_int = 0;
    let mut array_ptr = MaybeUninit::uninit();
    // SAFETY: on success `enif_get_tuple` points `array_ptr` at the tuple's
    // `arity` elements, which live on the heap of `term`'s environment.
    unsafe {
        let env_raw = term.get_env().as_c_arg();
        if enif_get_tuple(env_raw, term.as_c_arg(), &mut arity, array_ptr.as_mut_ptr()) != 1 {
            return Err(EncodeError::UnsupportedType);
        }
        Ok(std::slice::from_raw_parts(
            array_ptr.assume_init(),
            arity as usize,
        ))
    }
}

fn encode_tuple<const PRETTY: bool>(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    s: &mut Scratch,
    depth: u32,
) -> Result<(), EncodeError> {
    let elements = get_tuple_raw(term)?;
    if elements.len() == 1 {
        // SAFETY: a tuple's elements belong to the tuple's env.
        let inner = unsafe { Term::new(env, elements[0]) };
        if inner.get_type() == TermType::List {
            return encode_proplist::<PRETTY>(env, env_raw, inner, s, depth);
        }
    }
    Err(EncodeError::UnsupportedType)
}

fn encode_proplist<const PRETTY: bool>(
    env: Env,
    env_raw: *mut ErlNifEnv,
    term: Term,
    s: &mut Scratch,
    depth: u32,
) -> Result<(), EncodeError> {
    if depth == 0 {
        return Err(EncodeError::DepthExceeded);
    }
    s.open::<PRETTY>(b'{');
    let mut first = true;
    let mut current = term.as_c_arg();
    let mut head: ERL_NIF_TERM = 0;
    let mut tail: ERL_NIF_TERM = 0;
    // SAFETY: `current` is the list term or a tail read from it, all in `env`.
    while unsafe { enif_get_list_cell(env_raw, current, &mut head, &mut tail) } != 0 {
        // SAFETY: a list cell's head belongs to the list's env.
        let pair_term = unsafe { Term::new(env, head) };
        let pair = get_tuple_raw(pair_term).map_err(|_| EncodeError::MalformedProplist)?;
        if pair.len() != 2 {
            return Err(EncodeError::MalformedProplist);
        }
        s.separator::<PRETTY>(first);
        first = false;
        // SAFETY: a tuple's elements belong to the tuple's env.
        let (key, val) = unsafe { (Term::new(env, pair[0]), Term::new(env, pair[1])) };
        encode_map_key(env_raw, key, s)?;
        s.key_separator::<PRETTY>();
        encode_term::<PRETTY>(env, env_raw, val, s, depth - 1)?;
        current = tail;
    }
    // Improper list: the loop ends on a non-cons tail, which must be [].
    // SAFETY: `current` is a tail read from the list, in `env`.
    if unsafe { enif_is_empty_list(env_raw, current) } == 0 {
        return Err(EncodeError::MalformedProplist);
    }
    s.close::<PRETTY>(b'}', !first);
    Ok(())
}
