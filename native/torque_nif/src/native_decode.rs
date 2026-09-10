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
    enif_make_double, enif_make_int64, enif_make_list_from_array, enif_make_map_put,
    enif_make_new_map, enif_make_sub_binary, enif_make_uint64, ERL_NIF_TERM,
};
use rustler::{Encoder, Env, NewBinary, Term};
use sonic_rs::JsonVisitor;
use std::cell::RefCell;
use std::mem::MaybeUninit;

use crate::atoms;
use crate::decoder::parse_error_term;
use crate::nif_util::{make_tuple2, map_from_arrays};
use crate::types::MAX_DEPTH;

const STACK_SIZE: usize = 64;

/// Cap on the retained thread-local value stack (in terms, 8 bytes each ≈ 1 MB),
/// so a one-off huge document doesn't pin a large allocation on a scheduler
/// thread indefinitely. Mirrors the encoder's `BUF_RETAIN_CAP`.
const VALUES_RETAIN_CAP: usize = 1 << 17;

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
    /// First 8 key bytes, zero-padded. For keys of ≤ 8 bytes this is the whole
    /// content, so prefix + len equality needs no byte compare on a hit.
    prefix: u64,
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
/// Cached keys are built as *copied* heap binaries rather than sub-binaries.
/// On OTP 28+ this matches what `enif_make_sub_binary` does anyway (slices
/// ≤ 64 bytes are copied on-heap); on older OTPs it avoids real sub-binaries
/// that would pin the whole input binary via the decoded map's keys. The copy
/// is once per distinct key per call — amortized by the cache.
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

struct DecodeBufs {
    values: Vec<ERL_NIF_TERM>,
    frames: Vec<usize>,
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

struct TermBuilder<'a, 'b> {
    env: Env<'a>,
    input: InputRef,
    /// Postfix value stack: completed terms plus the open containers' children.
    /// Borrowed from a reused thread-local buffer (see `DECODE_BUFS`).
    values: &'b mut Vec<ERL_NIF_TERM>,
    /// `values` index where each currently-open container's children begin.
    frames: &'b mut Vec<usize>,
    keys: &'b mut KeyCache,
    too_deep: bool,
}

impl<'a, 'b> TermBuilder<'a, 'b> {
    #[inline]
    fn push(&mut self, term: ERL_NIF_TERM) {
        self.values.push(term);
    }

    /// Sub-binary (zero-copy) when the str lives in the input buffer, else copy
    /// (escaped strings are unescaped into the parser's scratch buffer).
    #[inline]
    fn str_term(&self, s: &str) -> ERL_NIF_TERM {
        if let Some(offset) = self.input.offset_within(s) {
            return unsafe {
                enif_make_sub_binary(self.env.as_c_arg(), self.input.term, offset, s.len())
            };
        }
        let mut binary = NewBinary::new(self.env, s.len());
        binary.as_mut_slice().copy_from_slice(s.as_bytes());
        let term: Term = binary.into();
        term.as_c_arg()
    }

    /// Term for an object key, memoized in the per-call key cache.
    ///
    /// Only borrowed keys qualify: an escaped key's bytes live in the parser's
    /// scratch buffer, which later strings overwrite, so its pointer can't be
    /// used as a cache identity. Those (rare) keys fall back to `str_term`.
    /// The `len.max(8)` bound keeps the unaligned prefix load in-bounds; a key
    /// inside the final 8 bytes of the document (impossible in valid JSON,
    /// which needs at least `":x}` after it) just falls back.
    #[inline]
    fn key_term(&mut self, s: &str) -> ERL_NIF_TERM {
        let ptr = s.as_ptr();
        let len = s.len();
        if self.keys.debit > KEY_CACHE_BYPASS_AT || len == 0 || len > KEY_CACHE_MAX_LEN {
            return self.str_term(s);
        }
        match self.input.offset_within(s) {
            Some(offset) if self.input.len - offset >= 8 => {}
            _ => return self.str_term(s),
        }
        let mut prefix = unsafe { (ptr as *const u64).read_unaligned() };
        if len < 8 {
            prefix &= (1u64 << (len * 8)) - 1;
        }
        let h = (prefix ^ (len as u64)).wrapping_mul(0x9E37_79B9_7F4A_7C15);
        let entry = &mut self.keys.entries[(h >> 56) as usize & (KEY_CACHE_SLOTS - 1)];
        if entry.epoch == self.keys.epoch
            && entry.prefix == prefix
            && entry.len == len as u32
            && (len <= 8
                || unsafe {
                    std::slice::from_raw_parts(entry.ptr.add(8), len - 8)
                        == std::slice::from_raw_parts(ptr.add(8), len - 8)
                })
        {
            self.keys.debit -= 8;
            return entry.term;
        }
        self.keys.debit += 1;
        // len <= KEY_CACHE_MAX_LEN (64), so this is an on-heap binary, not refc.
        let mut binary = NewBinary::new(self.env, len);
        binary.as_mut_slice().copy_from_slice(s.as_bytes());
        let term = Term::from(binary).as_c_arg();
        *entry = KeyEntry {
            ptr,
            term,
            prefix,
            len: len as u32,
            epoch: self.keys.epoch,
        };
        term
    }
}

/// Build a map term from interleaved `[k0, v0, k1, v1, ...]` children.
/// De-interleaves into separate key/value arrays for `enif_make_map_from_arrays`.
#[inline]
fn build_map(env: Env, kv: &[ERL_NIF_TERM]) -> ERL_NIF_TERM {
    let pairs = kv.len() / 2;
    if pairs <= STACK_SIZE {
        let mut keys: [MaybeUninit<ERL_NIF_TERM>; STACK_SIZE] = [MaybeUninit::uninit(); STACK_SIZE];
        let mut vals: [MaybeUninit<ERL_NIF_TERM>; STACK_SIZE] = [MaybeUninit::uninit(); STACK_SIZE];
        for i in 0..pairs {
            keys[i].write(kv[2 * i]);
            vals[i].write(kv[2 * i + 1]);
        }
        // SAFETY: keys[..pairs]/vals[..pairs] were just written.
        unsafe {
            make_map(
                env,
                std::slice::from_raw_parts(keys.as_ptr() as *const ERL_NIF_TERM, pairs),
                std::slice::from_raw_parts(vals.as_ptr() as *const ERL_NIF_TERM, pairs),
            )
        }
    } else {
        let mut keys = Vec::with_capacity(pairs);
        let mut vals = Vec::with_capacity(pairs);
        for i in 0..pairs {
            keys.push(kv[2 * i]);
            vals.push(kv[2 * i + 1]);
        }
        make_map(env, &keys, &vals)
    }
}

#[inline]
fn make_map(env: Env, keys: &[ERL_NIF_TERM], vals: &[ERL_NIF_TERM]) -> ERL_NIF_TERM {
    unsafe {
        let mut map: ERL_NIF_TERM = 0;
        if map_from_arrays(env, keys.as_ptr(), vals.as_ptr(), keys.len(), &mut map) {
            map
        } else {
            // Duplicate keys: last value wins (matches value_to_term).
            map = enif_make_new_map(env.as_c_arg());
            for i in 0..keys.len() {
                let mut new_map: ERL_NIF_TERM = 0;
                enif_make_map_put(env.as_c_arg(), map, keys[i], vals[i], &mut new_map);
                map = new_map;
            }
            map
        }
    }
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
fn bignum_term(env: Env, raw: &str) -> Option<ERL_NIF_TERM> {
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

impl<'de, 'a, 'b> JsonVisitor<'de> for TermBuilder<'a, 'b> {
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
        self.push(atoms::nil().as_c_arg());
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
        let t = unsafe { enif_make_int64(self.env.as_c_arg(), val) };
        self.push(t);
        true
    }

    #[inline]
    fn visit_u64(&mut self, val: u64) -> bool {
        let t = unsafe { enif_make_uint64(self.env.as_c_arg(), val) };
        self.push(t);
        true
    }

    #[inline]
    fn visit_f64(&mut self, val: f64) -> bool {
        let t = unsafe { enif_make_double(self.env.as_c_arg(), val) };
        self.push(t);
        true
    }

    /// Integer literal beyond i64/u64 range: build an exact Erlang bignum from
    /// the raw digits instead of degrading to a lossy f64.
    #[inline]
    fn visit_overflow_int(&mut self, raw: &str, as_f64: f64) -> bool {
        let t = bignum_term(self.env, raw)
            .unwrap_or_else(|| unsafe { enif_make_double(self.env.as_c_arg(), as_f64) });
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
        let t = self.key_term(key);
        self.push(t);
        true
    }

    #[inline]
    fn visit_array_start(&mut self, _hint: usize) -> bool {
        if self.frames.len() >= MAX_DEPTH as usize {
            self.too_deep = true;
            return false;
        }
        self.frames.push(self.values.len());
        true
    }

    #[inline]
    fn visit_array_end(&mut self, _len: usize) -> bool {
        let start = match self.frames.pop() {
            Some(s) => s,
            None => return false,
        };
        let count = (self.values.len() - start) as u32;
        let list = unsafe {
            enif_make_list_from_array(self.env.as_c_arg(), self.values[start..].as_ptr(), count)
        };
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
        self.frames.push(self.values.len());
        true
    }

    #[inline]
    fn visit_object_end(&mut self, _len: usize) -> bool {
        let start = match self.frames.pop() {
            Some(s) => s,
            None => return false,
        };
        let map = build_map(self.env, &self.values[start..]);
        self.values.truncate(start);
        self.values.push(map);
        true
    }
}

pub fn decode_to_term<'a>(env: Env<'a>, input_term: ERL_NIF_TERM, bytes: &[u8]) -> Term<'a> {
    DECODE_BUFS.with(|cell| {
        let mut bufs = cell.borrow_mut();
        let DecodeBufs {
            values,
            frames,
            keys,
        } = &mut *bufs;
        values.clear();
        frames.clear();
        keys.next_epoch();
        let mut builder = TermBuilder {
            env,
            input: InputRef {
                term: input_term,
                base: bytes.as_ptr(),
                len: bytes.len(),
            },
            values,
            frames,
            keys,
            too_deep: false,
        };

        let result = match sonic_rs::parse_into_visitor(bytes, &mut builder) {
            Ok(()) => match builder.values.first() {
                Some(&root) => make_tuple2(env, atoms::ok().as_c_arg(), root),
                None => make_tuple2(
                    env,
                    atoms::error().as_c_arg(),
                    "empty document".encode(env).as_c_arg(),
                ),
            },
            Err(e) => {
                if builder.too_deep {
                    make_tuple2(
                        env,
                        atoms::error().as_c_arg(),
                        atoms::nesting_too_deep().as_c_arg(),
                    )
                } else {
                    parse_error_term(env, &e)
                }
            }
        };

        if builder.values.capacity() > VALUES_RETAIN_CAP {
            builder.values.shrink_to(VALUES_RETAIN_CAP);
        }
        result
    })
}
