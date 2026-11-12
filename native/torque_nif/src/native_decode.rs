//! Fused single-pass decoder built on sonic-rs's native push-based parser.
//!
//! This implements sonic-rs's `JsonVisitor` directly, building Erlang terms
//! during the SIMD parse — no intermediate `Value` tree, zero-copy
//! sub-binaries for unescaped strings, and one shared term per repeated
//! object key (see `KeyCache`).
//!
//! Terms are assembled with a postfix value stack: scalars push a term; a
//! container-end pops its children, builds the list/map term, and pushes the
//! result. After a successful parse the stack holds exactly the root term.

use rustler::sys::{
    enif_make_map_put, enif_make_new_map, enif_make_sub_binary, enif_system_info, ErlNifSysInfo,
    ERL_NIF_TERM,
};
use rustler::{Atom, Encoder, Env, NewBinary, NifUnitEnum, Term};
use sonic_rs::JsonVisitor;
use std::cell::RefCell;
use std::marker::PhantomData;
use std::sync::OnceLock;

use crate::atoms;
use crate::decoder::parse_error_term;
use crate::nif_util::{make_list, make_tuple2, map_last_wins, try_make_map, FLATMAP_LIMIT};
use crate::types::MAX_DEPTH;

/// Cap on each retained thread-local buffer, so a one-off huge document
/// doesn't pin a large allocation on a scheduler thread indefinitely. Mirrors
/// the encoder's `BUF_RETAIN_CAP`.
const RETAIN_CAP_BYTES: usize = 1 << 20;

/// Empties a stack and caps its capacity. Emptying first matters: `shrink_to`
/// cannot go below the length, and a build can leave any number of roots.
fn release<T>(stack: &mut Vec<T>) {
    stack.clear();
    let max = RETAIN_CAP_BYTES / std::mem::size_of::<T>();
    if stack.capacity() > max {
        stack.shrink_to(max);
    }
}

const KEY_CACHE_SLOTS: usize = 256;
/// Longest key eligible for caching; bounds the byte-compare on lookup.
const KEY_CACHE_MAX_LEN: usize = 64;
/// Miss/hit balance above which the cache is bypassed for the rest of the
/// call (see `KeyCache::debit`).
const KEY_CACHE_BYPASS_AT: i32 = 256;

#[derive(Clone, Copy)]
struct KeyEntry {
    ptr: *const u8,
    term: ERL_NIF_TERM,
    /// First 8 key bytes, zero-padded, and for longer keys the last 8. Up to
    /// 16 bytes they cover the whole key, so a hit needs no byte compare.
    prefix: u64,
    tail: u64,
    len: u32,
    epoch: u32,
}

/// Direct-mapped, per-call memo of object-key terms. Typical JSON repeats the
/// same few keys across every element of an array, and each occurrence used to
/// build a fresh term; a hit reuses the earlier one instead. Entries are keyed
/// by pointers into the input buffer (stable for the whole call) and
/// invalidated between calls by an epoch counter, since terms are only valid
/// within the env of the call that made them.
///
/// Cached keys are copies, never references to the input: a map's keys can
/// outlive its values, and would otherwise pin the whole input. On OTP 27+
/// `enif_make_sub_binary` copies a slice of at most 64 bytes onto the heap,
/// and does it cheaper than `enif_make_new_binary`, which flushes the env's
/// heap pointers around an `HAlloc`; older releases get the explicit copy.
struct KeyCache {
    entries: [KeyEntry; KEY_CACHE_SLOTS],
    epoch: u32,
    /// Per-call adaptivity: a miss adds 1, a hit subtracts 8. Documents shaped
    /// as unique-key dictionaries never hit, so once the balance exceeds
    /// `KEY_CACHE_BYPASS_AT` the cache is bypassed for the rest of the call
    /// rather than charging a lookup per key that can never pay off. The
    /// threshold is high enough that a record array whose objects have up to
    /// ~256 distinct keys still warms the cache before tripping it.
    debit: i32,
}

impl KeyCache {
    fn new() -> Self {
        KeyCache {
            entries: [KeyEntry {
                ptr: std::ptr::null(),
                term: 0,
                prefix: 0,
                tail: 0,
                len: 0,
                epoch: 0,
            }; KEY_CACHE_SLOTS],
            epoch: 0,
            debit: 0,
        }
    }

    /// Invalidate all entries for a new decode call. On the (rare) epoch
    /// wraparound, hard-clear so stale entries can't alias the new epoch.
    #[inline]
    fn next_epoch(&mut self) {
        self.debit = 0;
        self.epoch = self.epoch.wrapping_add(1);
        if self.epoch == 0 {
            for e in self.entries.iter_mut() {
                e.epoch = 0;
            }
            self.epoch = 1;
        }
    }
}

/// Whether `enif_make_sub_binary` copies a slice of `KEY_CACHE_MAX_LEN` bytes
/// or fewer onto the heap, as it does from OTP 27 on.
fn sub_binaries_copy_keys() -> bool {
    static COPIES: OnceLock<bool> = OnceLock::new();
    *COPIES.get_or_init(|| {
        // SAFETY: `enif_system_info` fills at most `size_of::<ErlNifSysInfo>()`
        // bytes, and `otp_release` points to a static NUL-terminated string.
        let release = unsafe {
            let mut info = std::mem::zeroed::<ErlNifSysInfo>();
            enif_system_info(&mut info, std::mem::size_of::<ErlNifSysInfo>());
            if info.otp_release.is_null() {
                return false;
            }
            std::ffi::CStr::from_ptr(info.otp_release).to_bytes()
        };
        std::str::from_utf8(release)
            .ok()
            .and_then(|r| r.parse::<u32>().ok())
            .is_some_and(|r| r >= 27)
    })
}

/// Below this, ERTS's sort is cheaper than checking the order ourselves.
const MIN_ORDERED_MEMBERS: usize = 4;

/// Sort key for an object member. `ptr` is null when the key bytes live in
/// the parser's scratch buffer (escaped keys), which later strings overwrite.
#[derive(Clone, Copy)]
struct KeyOrd {
    prefix: u64,
    ptr: *const u8,
    len: usize,
}

impl KeyOrd {
    /// Erlang orders binaries by bytes, then length, like `[u8]`'s `Ord`.
    ///
    /// # Safety
    ///
    /// Neither `ptr` may be null.
    #[inline]
    unsafe fn lt(&self, other: &KeyOrd) -> bool {
        if self.prefix != other.prefix {
            return self.prefix < other.prefix;
        }
        // SAFETY: non-null, so both point into the input binary, which
        // outlives the call.
        unsafe {
            std::slice::from_raw_parts(self.ptr, self.len)
                < std::slice::from_raw_parts(other.ptr, other.len)
        }
    }
}

#[derive(Clone, Copy)]
struct Frame {
    values: usize,
    ords: usize,
}

struct DecodeBufs {
    values: Vec<ERL_NIF_TERM>,
    frames: Vec<Frame>,
    key_terms: Vec<ERL_NIF_TERM>,
    ords: Vec<KeyOrd>,
    keys: KeyCache,
}

thread_local! {
    /// Reused across decode calls on each scheduler thread, avoiding two heap
    /// allocations (the value and frame stacks) per call — the dominant
    /// per-call cost for small payloads. NIFs run to completion without
    /// preemption and decode never re-enters this NIF, so the borrow is never
    /// nested.
    static DECODE_BUFS: RefCell<DecodeBufs> = RefCell::new(DecodeBufs {
        values: Vec::with_capacity(64),
        frames: Vec::with_capacity(16),
        key_terms: Vec::with_capacity(64),
        ords: Vec::with_capacity(64),
        keys: KeyCache::new(),
    });
}

struct InputRef {
    term: ERL_NIF_TERM,
    base: *const u8,
    len: usize,
}

impl InputRef {
    /// Offset of `s` when its entire span lies inside the input. Integer
    /// arithmetic on purpose: `s` may point into the parser's scratch buffer,
    /// a different allocation, where `offset_from` would be undefined.
    #[inline]
    fn offset_within(&self, s: &str) -> Option<usize> {
        let offset = (s.as_ptr() as usize).checked_sub(self.base as usize)?;
        let room = self.len.checked_sub(offset)?;
        (s.len() <= room).then_some(offset)
    }
}

/// How the builder spells a string that lies inside the input binary.
#[derive(Clone, Copy, PartialEq, Eq)]
pub(crate) enum Strings {
    /// A sub-binary of the input, which may keep the input alive.
    Borrow,
    /// A fresh binary.
    Copy,
}

/// What `decode_to_term` makes of object keys.
#[derive(Clone, Copy, Debug, PartialEq, Eq, NifUnitEnum)]
pub(crate) enum ObjectKeys {
    /// A binary, built like any other string.
    Binary,
    /// An atom, created when none exists.
    Atom,
    /// An existing atom; a key naming none fails the parse.
    ExistingAtom,
}

/// What a `TermBuilder` makes of object keys. It is a type parameter rather
/// than a field so that the parser is compiled once per kind, and the
/// binary-key parse carries no atom checks.
pub(crate) trait KeyKind {
    /// How a key becomes an atom, or `None` when keys stay binaries.
    const ATOMS: Option<AtomLookup>;
}

/// `ObjectKeys::Binary` as a `KeyKind`.
pub(crate) enum BinaryKeys {}

impl KeyKind for BinaryKeys {
    const ATOMS: Option<AtomLookup> = None;
}

/// `ObjectKeys::Atom` as a `KeyKind`.
pub(crate) enum AtomKeys {}

impl KeyKind for AtomKeys {
    const ATOMS: Option<AtomLookup> = Some(AtomLookup::CreateMissing);
}

/// `ObjectKeys::ExistingAtom` as a `KeyKind`.
pub(crate) enum ExistingAtomKeys {}

impl KeyKind for ExistingAtomKeys {
    const ATOMS: Option<AtomLookup> = Some(AtomLookup::ExistingOnly);
}

pub(crate) struct TermBuilder<'env, 'bufs, K: KeyKind = BinaryKeys> {
    env: Env<'env>,
    input: InputRef,
    strings: Strings,
    /// Bytes of strings borrowed from the input. Recent ERTS releases copy
    /// the short ones onto the heap, but they still count: the budget weighs
    /// what the results hold against the input they may keep alive.
    borrowed: usize,
    /// An object built so far lost members to a later duplicate key, so
    /// `borrowed` counts strings no result holds.
    dropped_members: bool,
    /// Postfix value stack: completed terms plus the open containers' children.
    /// Borrowed from a reused thread-local buffer (see `DECODE_BUFS`).
    values: &'bufs mut Vec<ERL_NIF_TERM>,
    /// Where each currently-open container's children begin in `values`,
    /// and its members' keys in `key_terms` and `ords`.
    frames: &'bufs mut Vec<Frame>,
    /// Open objects' key terms, kept apart from `values` so an object's keys
    /// and values reach `enif_make_map_from_arrays` without being copied.
    key_terms: &'bufs mut Vec<ERL_NIF_TERM>,
    ords: &'bufs mut Vec<KeyOrd>,
    keys: &'bufs mut KeyCache,
    /// The term JSON null becomes.
    null: ERL_NIF_TERM,
    empty_map: ERL_NIF_TERM,
    too_deep: bool,
    /// How the key that stopped the parse was looked up, when one did.
    failed_key: Option<AtomLookup>,
    key_kind: PhantomData<K>,
}

impl<'env, 'bufs, K: KeyKind> TermBuilder<'env, 'bufs, K> {
    /// Terms of the values parsed so far, in order. Each parse driven through
    /// the builder leaves exactly one.
    #[inline]
    pub(crate) fn roots(&self) -> &[ERL_NIF_TERM] {
        debug_assert!(self.frames.is_empty(), "a container is still open");
        self.values
    }

    /// Bytes of input strings borrowed so far.
    #[inline]
    pub(crate) fn borrowed(&self) -> usize {
        self.borrowed
    }

    /// Whether a duplicate key discarded built members, leaving `borrowed`
    /// and any span or node count of the containers above what survives.
    #[inline]
    pub(crate) fn dropped_members(&self) -> bool {
        self.dropped_members
    }

    #[inline]
    pub(crate) fn set_strings(&mut self, strings: Strings) {
        self.strings = strings;
    }

    /// This call's empty map, shared by every `{}` in the document.
    #[inline]
    fn empty_map(&mut self) -> ERL_NIF_TERM {
        if self.empty_map == 0 {
            // SAFETY: `env` is the live env of this call.
            self.empty_map = unsafe { enif_make_new_map(self.env.as_c_arg()) };
        }
        self.empty_map
    }

    /// Map of a single member. `enif_make_map_from_arrays` sets up and closes
    /// a heap factory around every map, which costs more than building a
    /// one-member map; putting the member into an empty map is a single
    /// `HAlloc`. With more members the puts compare keys and leave garbage.
    #[inline]
    fn map_of_one(&mut self, key: ERL_NIF_TERM, value: ERL_NIF_TERM) -> ERL_NIF_TERM {
        let empty = self.empty_map();
        let mut map = 0;
        // SAFETY: the terms were built in `env`, and `map` is a local the
        // call writes.
        unsafe { enif_make_map_put(self.env.as_c_arg(), empty, key, value, &mut map) };
        map
    }

    #[inline]
    fn push(&mut self, term: ERL_NIF_TERM) {
        self.values.push(term);
    }

    /// Sub-binary (zero-copy) when the str lives in the input buffer and the
    /// builder borrows, else copy (escaped strings are unescaped into the
    /// parser's scratch buffer).
    #[inline]
    fn str_term(&mut self, s: &str) -> ERL_NIF_TERM {
        if self.strings == Strings::Borrow {
            if let Some(offset) = self.input.offset_within(s) {
                self.borrowed += s.len();
                // SAFETY: `offset_within` checked the span lies inside the
                // input binary.
                return unsafe {
                    enif_make_sub_binary(self.env.as_c_arg(), self.input.term, offset, s.len())
                };
            }
        }
        let mut binary = NewBinary::new(self.env, s.len());
        binary.as_mut_slice().copy_from_slice(s.as_bytes());
        let term: Term = binary.into();
        term.as_c_arg()
    }

    /// Term for an object key, memoized in the per-call key cache. `None` when
    /// the key has no atom `K` allows.
    ///
    /// Only borrowed keys qualify: an escaped key's bytes live in the parser's
    /// scratch buffer, which later strings overwrite, so its pointer can't be
    /// used as a cache identity. Those (rare) keys bypass the cache.
    /// `wide` is the key's offset in the input when it starts at least 8 bytes
    /// before the end, so `prefix` came from one unaligned load; a key inside
    /// the final 8 bytes of the document (impossible in valid JSON, which needs
    /// at least `":x}` after it) just falls back.
    #[inline]
    fn key_term(&mut self, s: &str, wide: Option<usize>, prefix: u64) -> Option<ERL_NIF_TERM> {
        let ptr = s.as_ptr();
        let len = s.len();
        let offset = match wide {
            Some(offset)
                if self.keys.debit <= KEY_CACHE_BYPASS_AT
                    && len != 0
                    && len <= KEY_CACHE_MAX_LEN =>
            {
                offset
            }
            _ => return self.uncached_key_term(s),
        };
        // Schema keys often share their first 8 bytes and length
        // (`profile_link_color`, `profile_text_color`), so mix in the last 8
        // too or they evict each other from the same slot.
        let tail = if len > 8 {
            // SAFETY: `s` holds `len` bytes.
            unsafe { (ptr.add(len - 8) as *const u64).read_unaligned() }
        } else {
            0
        };
        let h = (prefix ^ (len as u64) ^ tail.rotate_left(29)).wrapping_mul(0x9E37_79B9_7F4A_7C15);
        let slot = (h >> 56) as usize & (KEY_CACHE_SLOTS - 1);
        let entry = &self.keys.entries[slot];
        if entry.epoch == self.keys.epoch
            && entry.prefix == prefix
            && entry.tail == tail
            && entry.len == len as u32
            && (len <= 16
                // SAFETY: both keys are `len` bytes of the input, which
                // outlives the call.
                || unsafe {
                    std::slice::from_raw_parts(entry.ptr.add(8), len - 16)
                        == std::slice::from_raw_parts(ptr.add(8), len - 16)
                })
        {
            self.keys.debit -= 8;
            return Some(entry.term);
        }
        self.keys.debit += 1;
        let term = match K::ATOMS {
            Some(lookup) => atom_term(self.env, s.as_bytes(), lookup)?,
            // len <= KEY_CACHE_MAX_LEN (64), so either way this is an on-heap
            // binary, not refc.
            None if sub_binaries_copy_keys() => {
                // SAFETY: `wide` is the key's offset inside the input binary.
                unsafe { enif_make_sub_binary(self.env.as_c_arg(), self.input.term, offset, len) }
            }
            None => {
                let mut binary = NewBinary::new(self.env, len);
                binary.as_mut_slice().copy_from_slice(s.as_bytes());
                Term::from(binary).as_c_arg()
            }
        };
        self.keys.entries[slot] = KeyEntry {
            ptr,
            term,
            prefix,
            tail,
            len: len as u32,
            epoch: self.keys.epoch,
        };
        Some(term)
    }

    /// `key_term` for a key the cache cannot hold.
    #[inline]
    fn uncached_key_term(&mut self, s: &str) -> Option<ERL_NIF_TERM> {
        match K::ATOMS {
            Some(lookup) => atom_term(self.env, s.as_bytes(), lookup),
            None => Some(self.str_term(s)),
        }
    }
}

/// The longest atom name, in characters.
const MAX_ATOM_CHARACTERS: usize = 255;

/// Whether `atom_term` may add the atom it names to the atom table.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum AtomLookup {
    CreateMissing,
    ExistingOnly,
}

/// The atom named by `name`. `None` when it does not exist and `lookup` may
/// not create it, or when the name is too long for an atom.
#[inline]
fn atom_term(env: Env, name: &[u8], lookup: AtomLookup) -> Option<ERL_NIF_TERM> {
    if !name.is_ascii() {
        return utf8_atom_term(env, name, lookup);
    }
    // Checked here because `enif_make_atom_len` raises badarg past the limit
    // instead of failing.
    if name.len() > MAX_ATOM_CHARACTERS {
        return None;
    }
    let atom = match lookup {
        AtomLookup::CreateMissing => Atom::from_bytes(env, name),
        AtomLookup::ExistingOnly => Atom::existing_from_bytes(env, name),
    };
    atom.ok().map(|a| a.as_c_arg())
}

/// External term format tag for an atom with a UTF-8 name of up to 65535
/// bytes.
const ATOM_UTF8_EXT: u8 = 118;

/// `atom_term` for a name outside ASCII, through the external term format: the
/// atom functions take UTF-8 names only from NIF 2.17, and the NIF still loads
/// on 2.15.
#[cold]
#[inline(never)]
fn utf8_atom_term(env: Env, name: &[u8], lookup: AtomLookup) -> Option<ERL_NIF_TERM> {
    // At most four bytes per character; ERTS rejects a name with more than
    // MAX_ATOM_CHARACTERS of them.
    if name.len() > 4 * MAX_ATOM_CHARACTERS {
        return None;
    }
    let mut etf = [0u8; 4 + 4 * MAX_ATOM_CHARACTERS];
    etf[0] = ETF_VERSION;
    etf[1] = ATOM_UTF8_EXT;
    etf[2..4].copy_from_slice(&(name.len() as u16).to_be_bytes());
    etf[4..4 + name.len()].copy_from_slice(name);
    let etf = &etf[..4 + name.len()];
    let decoded = match lookup {
        // SAFETY: the buffer holds one atom, and creating it is the point.
        AtomLookup::CreateMissing => unsafe { env.binary_to_term_trusted(etf) },
        // The safe decode creates no atoms, so it finds only existing ones.
        AtomLookup::ExistingOnly => env.binary_to_term(etf),
    };
    decoded.map(|(term, _)| term.as_c_arg())
}

/// Stable insertion sort of member indices into Erlang term order, or `None`
/// when the members are already ordered or a key can't be compared here.
///
/// ERTS sorts flatmap keys itself (`erts_validate_and_sort_flatmap`) with an
/// insertion sort over generic term comparisons, O(n²) unless the keys arrive
/// in term order. JSON producers other than the BEAM emit schema order, so
/// sorting on raw key bytes first leaves ERTS a linear validation pass.
#[inline]
fn member_order(ords: &[KeyOrd]) -> Option<[u8; FLATMAP_LIMIT]> {
    // Sorted neighbours often share 8 bytes (`in_reply_to_status_id`,
    // `in_reply_to_status_id_str`); compare those in full rather than
    // sorting to find nothing moved.
    let ordered = ords.windows(2).all(|w| {
        w[0].prefix < w[1].prefix
            || (w[0].prefix == w[1].prefix
                && !w[0].ptr.is_null()
                && !w[1].ptr.is_null()
                // SAFETY: both checked non-null just above.
                && unsafe { w[0].lt(&w[1]) })
    });
    if ordered || ords.iter().any(|o| o.ptr.is_null()) {
        return None;
    }
    let mut perm = [0u8; FLATMAP_LIMIT];
    let mut moved = false;
    for i in 0..ords.len() {
        let mut j = i;
        // SAFETY: members with a null `ptr` returned above.
        while j > 0 && unsafe { ords[i].lt(&ords[perm[j - 1] as usize]) } {
            perm[j] = perm[j - 1];
            j -= 1;
        }
        moved |= j != i;
        perm[j] = i as u8;
    }
    moved.then_some(perm)
}

/// Build a map term from an object's keys and values, ordering its members
/// first when ERTS would otherwise sort them itself. `None` when a key
/// repeats.
#[inline]
fn build_map(
    env: Env,
    keys: &[ERL_NIF_TERM],
    vals: &[ERL_NIF_TERM],
    ords: &[KeyOrd],
) -> Option<ERL_NIF_TERM> {
    let pairs = keys.len();
    if (MIN_ORDERED_MEMBERS..=FLATMAP_LIMIT).contains(&pairs) {
        if let Some(perm) = member_order(ords) {
            let mut k = [0 as ERL_NIF_TERM; FLATMAP_LIMIT];
            let mut v = [0 as ERL_NIF_TERM; FLATMAP_LIMIT];
            for (slot, &i) in perm[..pairs].iter().enumerate() {
                k[slot] = keys[i as usize];
                v[slot] = vals[i as usize];
            }
            return try_make_map(env, &k[..pairs], &v[..pairs]);
        }
    }
    try_make_map(env, keys, vals)
}

// Erlang External Term Format tags for arbitrary-precision integers.
const ETF_VERSION: u8 = 131;
const SMALL_BIG_EXT: u8 = 110;
/// Magnitude bytes for SMALL_BIG_EXT fit in a one-byte length, so 255 base-256
/// bytes (~614 decimal digits) is the stack fast path; larger falls back.
const MAG_CAP: usize = 255;

/// Build an exact Erlang bignum term from a decimal integer token.
///
/// Converts the digits to a little-endian base-256 magnitude on the stack and
/// hands ERTS the SMALL_BIG_EXT bytes directly (`binary_to_term_trusted`, no
/// SAFE scan) — no `num-bigint` allocation, no `to_bytes_le` pass, no heap
/// buffer. Tokens beyond `MAG_CAP` bytes defer to `num-bigint` so correctness
/// stays unbounded. Returns `None` only if the digits don't parse.
#[inline]
pub(crate) fn bignum_term(env: Env, raw: &str) -> Option<ERL_NIF_TERM> {
    let (neg, digits) = match raw.as_bytes().split_first() {
        Some((b'-', rest)) => (1u8, rest),
        _ => (0u8, raw.as_bytes()),
    };
    if digits.is_empty() {
        return None;
    }

    let mut mag = [0u8; MAG_CAP];
    let mut len = 0usize;
    for &d in digits {
        let mut carry = match d {
            b'0'..=b'9' => (d - b'0') as u32,
            _ => return None,
        };
        for limb in mag[..len].iter_mut() {
            let v = *limb as u32 * 10 + carry;
            *limb = v as u8;
            carry = v >> 8;
        }
        while carry > 0 {
            if len >= MAG_CAP {
                return bignum_term_large(env, raw);
            }
            mag[len] = carry as u8;
            carry >>= 8;
            len += 1;
        }
    }

    // ETF: [131, SMALL_BIG_EXT, len, sign, <len LE magnitude bytes>]
    let mut etf = [0u8; 4 + MAG_CAP];
    etf[0] = ETF_VERSION;
    etf[1] = SMALL_BIG_EXT;
    etf[2] = len as u8;
    etf[3] = neg;
    etf[4..4 + len].copy_from_slice(&mag[..len]);

    // SAFETY: self-constructed SMALL_BIG_EXT — no atoms/resources, so the
    // trusted (unsafe, no-SAFE-scan) decode cannot create anything unsafe.
    unsafe { env.binary_to_term_trusted(&etf[..4 + len]) }.map(|(t, _)| t.as_c_arg())
}

/// Cold path for integers too large for the stack buffer (~600+ digits).
#[cold]
#[inline(never)]
fn bignum_term_large(env: Env, raw: &str) -> Option<ERL_NIF_TERM> {
    rustler::BigInt::parse_bytes(raw.as_bytes(), 10).map(|big| big.encode(env).as_c_arg())
}

impl<'de, 'env, 'bufs, K: KeyKind> JsonVisitor<'de> for TermBuilder<'env, 'bufs, K> {
    #[inline]
    fn visit_dom_start(&mut self) -> bool {
        true
    }

    #[inline]
    fn visit_dom_end(&mut self) -> bool {
        true
    }

    #[inline]
    fn visit_null(&mut self) -> bool {
        self.push(self.null);
        true
    }

    #[inline]
    fn visit_bool(&mut self, val: bool) -> bool {
        self.push(if val {
            atoms::r#true().as_c_arg()
        } else {
            atoms::r#false().as_c_arg()
        });
        true
    }

    #[inline]
    fn visit_i64(&mut self, val: i64) -> bool {
        self.push(val.encode(self.env).as_c_arg());
        true
    }

    #[inline]
    fn visit_u64(&mut self, val: u64) -> bool {
        self.push(val.encode(self.env).as_c_arg());
        true
    }

    #[inline]
    fn visit_f64(&mut self, val: f64) -> bool {
        self.push(val.encode(self.env).as_c_arg());
        true
    }

    /// Integer literal beyond i64/u64 range: an exact Erlang bignum from the
    /// raw digits.
    #[inline]
    fn visit_overflow_int(&mut self, raw: &str, as_f64: f64) -> bool {
        let t = bignum_term(self.env, raw).unwrap_or_else(|| as_f64.encode(self.env).as_c_arg());
        self.push(t);
        true
    }

    #[inline]
    fn visit_str(&mut self, value: &str) -> bool {
        let t = self.str_term(value);
        self.push(t);
        true
    }

    #[inline]
    fn visit_key(&mut self, key: &str) -> bool {
        let len = key.len();
        let offset = self.input.offset_within(key);
        let wide = offset.filter(|&o| self.input.len - o >= 8);
        // First 8 key bytes, little-endian and zero-padded.
        let prefix = if wide.is_some() {
            // SAFETY: `wide` means 8 input bytes are left from the key's start.
            let w = unsafe { (key.as_ptr() as *const u64).read_unaligned() };
            if len < 8 {
                w & ((1u64 << (len * 8)) - 1)
            } else {
                w
            }
        } else {
            let mut b = [0u8; 8];
            let n = len.min(8);
            b[..n].copy_from_slice(&key.as_bytes()[..n]);
            u64::from_le_bytes(b)
        };
        let ptr = if offset.is_some() {
            key.as_ptr()
        } else {
            std::ptr::null()
        };
        if K::ATOMS.is_none() {
            self.ords.push(KeyOrd {
                prefix: prefix.swap_bytes(),
                ptr,
                len,
            });
        }
        let Some(t) = self.key_term(key, wide, prefix) else {
            self.failed_key = K::ATOMS;
            return false;
        };
        if K::ATOMS.is_some() {
            // From OTP 26, ERTS orders a small map's atom keys by atom table
            // index, which is the order of the raw terms.
            self.ords.push(KeyOrd {
                prefix: t as u64,
                ptr,
                len,
            });
        }
        self.key_terms.push(t);
        true
    }

    #[inline]
    fn visit_array_start(&mut self, _hint: usize) -> bool {
        if self.frames.len() >= MAX_DEPTH as usize {
            self.too_deep = true;
            return false;
        }
        self.frames.push(Frame {
            values: self.values.len(),
            ords: self.ords.len(),
        });
        true
    }

    #[inline]
    fn visit_array_end(&mut self, _len: usize) -> bool {
        let start = match self.frames.pop() {
            Some(f) => f.values,
            None => return false,
        };
        let list = make_list(self.env, &self.values[start..]).as_c_arg();
        self.values.truncate(start);
        self.values.push(list);
        true
    }

    #[inline]
    fn visit_object_start(&mut self, _hint: usize) -> bool {
        if self.frames.len() >= MAX_DEPTH as usize {
            self.too_deep = true;
            return false;
        }
        self.frames.push(Frame {
            values: self.values.len(),
            ords: self.ords.len(),
        });
        true
    }

    #[inline]
    fn visit_object_end(&mut self, _len: usize) -> bool {
        let frame = match self.frames.pop() {
            Some(f) => f,
            None => return false,
        };
        let start = frame.values;
        let map = match self.key_terms.len() - frame.ords {
            0 => self.empty_map(),
            1 => self.map_of_one(self.key_terms[frame.ords], self.values[start]),
            _ => {
                let keys = &self.key_terms[frame.ords..];
                let vals = &self.values[start..];
                match build_map(self.env, keys, vals, &self.ords[frame.ords..]) {
                    Some(map) => map,
                    None => {
                        self.dropped_members = true;
                        map_last_wins(self.env, keys, vals)
                    }
                }
            }
        };
        self.key_terms.truncate(frame.ords);
        self.ords.truncate(frame.ords);
        self.values.truncate(start);
        self.values.push(map);
        true
    }
}

/// Runs `f` with a term builder over the binary `input_term`, whose bytes are
/// `bytes`, on this scheduler thread's reused stacks and key cache. JSON null
/// becomes `null`.
pub(crate) fn with_term_builder<'env, K: KeyKind, R>(
    env: Env<'env>,
    input_term: ERL_NIF_TERM,
    bytes: &[u8],
    strings: Strings,
    null: ERL_NIF_TERM,
    f: impl for<'bufs> FnOnce(&mut TermBuilder<'env, 'bufs, K>) -> R,
) -> R {
    let input = InputRef {
        term: input_term,
        base: bytes.as_ptr(),
        len: bytes.len(),
    };

    DECODE_BUFS.with(|cell| {
        let mut bufs = cell.borrow_mut();
        let DecodeBufs {
            values,
            frames,
            key_terms,
            ords,
            keys,
        } = &mut *bufs;
        // Emptied on entry as well as on exit: where panics unwind (debug
        // builds; release aborts), rustler catches one out of `f`, skipping
        // the release below and leaving the next build a dead env's terms.
        values.clear();
        frames.clear();
        key_terms.clear();
        ords.clear();
        keys.next_epoch();
        let mut builder = TermBuilder {
            env,
            input,
            strings,
            borrowed: 0,
            dropped_members: false,
            values,
            frames,
            key_terms,
            ords,
            keys,
            null,
            empty_map: 0,
            too_deep: false,
            failed_key: None,
            key_kind: PhantomData,
        };
        let result = f(&mut builder);
        // The terms live in the environment; the handles here are dead now.
        release(builder.values);
        release(builder.frames);
        release(builder.key_terms);
        release(builder.ords);
        result
    })
}

/// Build the `{:error, _}` term for a failed parse through `builder`.
pub(crate) fn builder_error_term<'a, K: KeyKind>(
    env: Env<'a>,
    builder: &TermBuilder<K>,
    err: &sonic_rs::Error,
) -> Term<'a> {
    let reason = match (builder.too_deep, builder.failed_key) {
        (true, _) => atoms::nesting_too_deep(),
        (false, Some(AtomLookup::ExistingOnly)) => atoms::nonexistent_atom(),
        (false, Some(AtomLookup::CreateMissing)) => atoms::atom_too_long(),
        (false, None) => return parse_error_term(env, err),
    };
    make_tuple2(env, atoms::error().as_c_arg(), reason.as_c_arg())
}

/// Decodes a whole document. With `Strings::Borrow`, strings the parser did
/// not have to unescape are sub-binaries of `input_term`; with
/// `Strings::Copy`, every string is copied. JSON null becomes `null`.
pub fn decode_to_term<'a>(
    env: Env<'a>,
    input_term: ERL_NIF_TERM,
    bytes: &[u8],
    strings: Strings,
    object_keys: ObjectKeys,
    null: ERL_NIF_TERM,
) -> Term<'a> {
    match object_keys {
        ObjectKeys::Binary => decode_keys_as::<BinaryKeys>(env, input_term, bytes, strings, null),
        ObjectKeys::Atom => decode_keys_as::<AtomKeys>(env, input_term, bytes, strings, null),
        ObjectKeys::ExistingAtom => {
            decode_keys_as::<ExistingAtomKeys>(env, input_term, bytes, strings, null)
        }
    }
}

fn decode_keys_as<'a, K: KeyKind>(
    env: Env<'a>,
    input_term: ERL_NIF_TERM,
    bytes: &[u8],
    strings: Strings,
    null: ERL_NIF_TERM,
) -> Term<'a> {
    with_term_builder::<K, _>(env, input_term, bytes, strings, null, |builder| {
        match sonic_rs::parse_into_visitor(bytes, builder) {
            Ok(()) => match builder.values.first() {
                Some(&root) => make_tuple2(env, atoms::ok().as_c_arg(), root),
                None => make_tuple2(
                    env,
                    atoms::error().as_c_arg(),
                    "empty document".encode(env).as_c_arg(),
                ),
            },
            Err(e) => builder_error_term(env, builder, &e),
        }
    })
}
