// SIMD-accelerated JSON string escaping with optional UTF-8 validation.
//
// Entry points:
//   `escape_to_vec(bytes, buf)` — escape only (for known-valid UTF-8, e.g. atom names)
//   `write_json_string(bytes, buf)` — validate, escape, and add quotes
//
// Platform dispatch:
//   aarch64 → NEON (vmaxvq_u8 / UMAXV, mandatory on AArch64)
//   x86_64  → AVX2 (32-byte lanes, runtime-detected), else SSE2 (baseline)
//   other   → scalar fallback

type QuoteEntry = (u8, [u8; 8]); // (output_len, escape_bytes)

const fn hex_nibble(n: u8) -> u8 {
    if n < 10 {
        b'0' + n
    } else {
        b'a' + n - 10
    }
}

const fn build_quote_tab() -> [QuoteEntry; 256] {
    let mut tab = [(0u8, [0u8; 8]); 256];
    // Initialize all bytes as passthrough (len=1, first byte = b itself).
    let mut i = 0usize;
    while i < 256 {
        let b = i as u8;
        tab[i] = (1, [b, 0, 0, 0, 0, 0, 0, 0]);
        i += 1;
    }
    // Named 2-byte escapes. Must be set BEFORE the \u00XX loop below so
    // the loop skips them (it checks tab[b].0 == 1 as the passthrough sentinel).
    tab[b'"' as usize] = (2, [b'\\', b'"', 0, 0, 0, 0, 0, 0]);
    tab[b'\\' as usize] = (2, [b'\\', b'\\', 0, 0, 0, 0, 0, 0]);
    tab[b'\n' as usize] = (2, [b'\\', b'n', 0, 0, 0, 0, 0, 0]);
    tab[b'\r' as usize] = (2, [b'\\', b'r', 0, 0, 0, 0, 0, 0]);
    tab[b'\t' as usize] = (2, [b'\\', b't', 0, 0, 0, 0, 0, 0]);
    tab[0x08] = (2, [b'\\', b'b', 0, 0, 0, 0, 0, 0]);
    tab[0x0C] = (2, [b'\\', b'f', 0, 0, 0, 0, 0, 0]);
    // Remaining control bytes (0x00–0x1F without a named escape): \u00XX
    let mut b = 0u8;
    while b < 0x20 {
        if tab[b as usize].0 == 1 {
            // Still passthrough → replace with 6-byte \u00XX form.
            let hi = hex_nibble(b >> 4);
            let lo = hex_nibble(b & 0x0F);
            tab[b as usize] = (6, [b'\\', b'u', b'0', b'0', hi, lo, 0, 0]);
        }
        b += 1;
    }
    tab
}

/// The SIMD kernels emit an escape as two fixed-width stores, the whole input
/// chunk and all 8 bytes of the entry, each partly overwritten afterwards;
/// variable-length copies compile to `memcpy` calls. The kernels run only
/// while a whole chunk of input is left and emit at most 6 bytes per input
/// byte, so neither store reaches 6 × the input length.
static QUOTE_TAB: [QuoteEntry; 256] = build_quote_tab();

const fn build_needs_escape() -> [bool; 256] {
    let mut tab = [false; 256];
    let mut i = 0usize;
    while i < 256 {
        let b = i as u8;
        tab[i] = b < 0x20 || b == b'"' || b == b'\\';
        i += 1;
    }
    tab
}

static NEEDS_ESCAPE: [bool; 256] = build_needs_escape();

// ---------------------------------------------------------------------------
// Short-string fast path
// ---------------------------------------------------------------------------

/// Strings shorter than this use the scalar prefix path before SIMD dispatch.
const SHORT_STRING: usize = 32;

const ONES: u64 = 0x0101_0101_0101_0101;
const HIGH: u64 = 0x8080_8080_8080_8080;

/// True when any byte of `w` is zero.
#[inline(always)]
fn has_zero(w: u64) -> bool {
    w.wrapping_sub(ONES) & !w & HIGH != 0
}

/// Returns true if any byte is non-ASCII, a control byte, a quote, or a backslash.
#[inline(always)]
fn swar_special(w: u64) -> bool {
    let ctrl = w.wrapping_sub(ONES * 0x20) & !w & HIGH;
    (ctrl | (w & HIGH)) != 0
        || has_zero(w ^ (ONES * b'"' as u64))
        || has_zero(w ^ (ONES * b'\\' as u64))
}

/// Copies the leading ASCII run that needs no escaping and returns its length.
///
/// The return value is a resume offset for the general path. A special byte may
/// cause the SWAR loop to recheck its containing word, but no earlier data.
///
/// # Safety
///
/// `src` must be readable and `dst` writable for `len` bytes.
#[inline(always)]
unsafe fn escape_prefix(src: *const u8, len: usize, dst: *mut u8) -> usize {
    let mut i = 0usize;
    while i + 8 <= len {
        let w = (src.add(i) as *const u64).read_unaligned();
        // The fallback overwrites this word when it contains a special byte.
        (dst.add(i) as *mut u64).write_unaligned(w);
        if swar_special(w) {
            break;
        }
        i += 8;
    }
    while i < len {
        let b = *src.add(i);
        if b >= 0x80 || NEEDS_ESCAPE[b as usize] {
            return i;
        }
        *dst.add(i) = b;
        i += 1;
    }
    i
}

// ---------------------------------------------------------------------------
// UTF-8 validation helpers
// ---------------------------------------------------------------------------

#[inline]
unsafe fn validate_utf8_seq(src: *const u8, pos: usize, len: usize) -> Result<usize, ()> {
    let b0 = *src.add(pos);
    let width = match b0 {
        0xC2..=0xDF => 2,
        0xE0..=0xEF => 3,
        0xF0..=0xF4 => 4,
        _ => return Err(()), // 0x80-0xC1 or 0xF5-0xFF
    };
    if pos + width > len {
        return Err(());
    }
    match width {
        2 => {
            if *src.add(pos + 1) & 0xC0 != 0x80 {
                return Err(());
            }
        }
        3 => {
            let b1 = *src.add(pos + 1);
            let b2 = *src.add(pos + 2);
            if b1 & 0xC0 != 0x80 || b2 & 0xC0 != 0x80 {
                return Err(());
            }
            if b0 == 0xE0 && b1 < 0xA0 {
                return Err(());
            }
            if b0 == 0xED && b1 >= 0xA0 {
                return Err(());
            }
        }
        4 => {
            let b1 = *src.add(pos + 1);
            let b2 = *src.add(pos + 2);
            let b3 = *src.add(pos + 3);
            if b1 & 0xC0 != 0x80 || b2 & 0xC0 != 0x80 || b3 & 0xC0 != 0x80 {
                return Err(());
            }
            if b0 == 0xF0 && b1 < 0x90 {
                return Err(());
            }
            if b0 == 0xF4 && b1 >= 0x90 {
                return Err(());
            }
        }
        _ => unreachable!(),
    }
    Ok(width)
}

// ===========================================================================
// Escape-only path (for Latin-1 atom names — no UTF-8 validation needed)
// ===========================================================================

/// Append the JSON-escaped form of `bytes` to `buf`.
///
/// `bytes` must already be valid UTF-8; this function only escapes JSON
/// special characters, it does not validate.
#[inline]
pub(crate) fn escape_to_vec(bytes: &[u8], buf: &mut Vec<u8>) {
    let len = bytes.len();
    if len == 0 {
        return;
    }
    buf.reserve(len * 6 + 32);
    let base = buf.len();
    let written = unsafe {
        let dst = buf.as_mut_ptr().add(base);
        let done = if len < SHORT_STRING {
            escape_prefix(bytes.as_ptr(), len, dst)
        } else {
            0
        };
        if done == len {
            done
        } else {
            done + escape_dispatch(bytes.as_ptr().add(done), len - done, dst.add(done))
        }
    };
    unsafe { buf.set_len(base + written) };
}

/// # Safety
///
/// `src` must be readable for `len` bytes and `dst` writable for `6 * len`
/// bytes; escapes overrun what they keep, but not that (see `QUOTE_TAB`).
#[cfg(target_arch = "aarch64")]
#[target_feature(enable = "neon")]
unsafe fn escape_neon(src: *const u8, len: usize, dst: *mut u8) -> usize {
    use std::arch::aarch64::*;

    let thresh = vdupq_n_u8(0x20);
    let dq = vdupq_n_u8(b'"');
    let bs = vdupq_n_u8(b'\\');
    let mut in_pos = 0usize;
    let mut out_pos = 0usize;

    while in_pos + 16 <= len {
        let v = vld1q_u8(src.add(in_pos));
        let needs = vorrq_u8(
            vorrq_u8(vcltq_u8(v, thresh), vceqq_u8(v, dq)),
            vceqq_u8(v, bs),
        );

        if vmaxvq_u8(needs) == 0 {
            vst1q_u8(dst.add(out_pos), v);
            in_pos += 16;
            out_pos += 16;
        } else {
            let mut mask = [0u8; 16];
            vst1q_u8(mask.as_mut_ptr(), needs);
            let first = mask.iter().position(|&x| x != 0).unwrap_unchecked();

            // Fixed-width stores; see `QUOTE_TAB`.
            vst1q_u8(dst.add(out_pos), v);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            (dst.add(out_pos) as *mut [u8; 8]).write_unaligned(esc_bytes);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    out_pos + escape_scalar(src.add(in_pos), len - in_pos, dst.add(out_pos))
}

/// # Safety
///
/// The CPU must support AVX2. `src` must be readable for `len` bytes and
/// `dst` writable for `6 * len` bytes; escapes overrun what they keep, but
/// not that (see `QUOTE_TAB`).
#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn escape_avx2(src: *const u8, len: usize, dst: *mut u8) -> usize {
    use std::arch::x86_64::*;

    let thresh = _mm256_set1_epi8(0x20u8 as i8);
    let zero = _mm256_setzero_si256();
    let dq = _mm256_set1_epi8(b'"' as i8);
    let bs = _mm256_set1_epi8(b'\\' as i8);
    let mut in_pos = 0usize;
    let mut out_pos = 0usize;

    while in_pos + 32 <= len {
        let v = _mm256_loadu_si256(src.add(in_pos) as *const __m256i);

        let ctrl = _mm256_cmpgt_epi8(_mm256_subs_epu8(thresh, v), zero);
        let needs = _mm256_or_si256(
            _mm256_or_si256(ctrl, _mm256_cmpeq_epi8(v, dq)),
            _mm256_cmpeq_epi8(v, bs),
        );
        let mask = _mm256_movemask_epi8(needs) as u32;

        if mask == 0 {
            _mm256_storeu_si256(dst.add(out_pos) as *mut __m256i, v);
            in_pos += 32;
            out_pos += 32;
        } else {
            let first = mask.trailing_zeros() as usize;

            // Fixed-width stores; see `QUOTE_TAB`.
            _mm256_storeu_si256(dst.add(out_pos) as *mut __m256i, v);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            (dst.add(out_pos) as *mut [u8; 8]).write_unaligned(esc_bytes);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    // Handle the short tail before falling back to SSE2.
    let tail = len - in_pos;
    let done = escape_prefix(src.add(in_pos), tail, dst.add(out_pos));
    if done == tail {
        return out_pos + done;
    }
    out_pos + done + escape_sse2(src.add(in_pos + done), tail - done, dst.add(out_pos + done))
}

/// # Safety
///
/// `src` must be readable for `len` bytes and `dst` writable for `6 * len`
/// bytes; escapes overrun what they keep, but not that (see `QUOTE_TAB`).
#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn escape_sse2(src: *const u8, len: usize, dst: *mut u8) -> usize {
    use std::arch::x86_64::*;

    let thresh = _mm_set1_epi8(0x20u8 as i8);
    let zero = _mm_setzero_si128();
    let dq = _mm_set1_epi8(b'"' as i8);
    let bs = _mm_set1_epi8(b'\\' as i8);
    let mut in_pos = 0usize;
    let mut out_pos = 0usize;

    while in_pos + 16 <= len {
        let v = _mm_loadu_si128(src.add(in_pos) as *const __m128i);

        let ctrl = _mm_cmpgt_epi8(_mm_subs_epu8(thresh, v), zero);
        let needs = _mm_or_si128(
            _mm_or_si128(ctrl, _mm_cmpeq_epi8(v, dq)),
            _mm_cmpeq_epi8(v, bs),
        );
        let mask = _mm_movemask_epi8(needs) as u32;

        if mask == 0 {
            _mm_storeu_si128(dst.add(out_pos) as *mut __m128i, v);
            in_pos += 16;
            out_pos += 16;
        } else {
            let first = mask.trailing_zeros() as usize;

            // Fixed-width stores; see `QUOTE_TAB`.
            _mm_storeu_si128(dst.add(out_pos) as *mut __m128i, v);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            (dst.add(out_pos) as *mut [u8; 8]).write_unaligned(esc_bytes);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    out_pos + escape_scalar(src.add(in_pos), len - in_pos, dst.add(out_pos))
}

unsafe fn escape_scalar(src: *const u8, len: usize, dst: *mut u8) -> usize {
    let mut in_pos = 0usize;
    let mut out_pos = 0usize;
    let mut start = 0usize;

    while in_pos < len {
        let b = *src.add(in_pos);
        if NEEDS_ESCAPE[b as usize] {
            if start < in_pos {
                let copy_len = in_pos - start;
                std::ptr::copy_nonoverlapping(src.add(start), dst.add(out_pos), copy_len);
                out_pos += copy_len;
            }
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            std::ptr::copy_nonoverlapping(esc_bytes.as_ptr(), dst.add(out_pos), esc_len as usize);
            out_pos += esc_len as usize;
            start = in_pos + 1;
        }
        in_pos += 1;
    }

    if start < len {
        let copy_len = len - start;
        std::ptr::copy_nonoverlapping(src.add(start), dst.add(out_pos), copy_len);
        out_pos += copy_len;
    }

    out_pos
}

unsafe fn escape_dispatch(src: *const u8, len: usize, dst: *mut u8) -> usize {
    #[cfg(target_arch = "aarch64")]
    {
        escape_neon(src, len, dst)
    }
    #[cfg(target_arch = "x86_64")]
    {
        // Cached by std_detect after the first call (one relaxed load).
        if is_x86_feature_detected!("avx2") {
            escape_avx2(src, len, dst)
        } else {
            escape_sse2(src, len, dst)
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        escape_scalar(src, len, dst)
    }
}

// ===========================================================================
// Fused UTF-8 validation + escape (for binary strings)
// ===========================================================================

/// Appends `bytes` as a quoted, escaped JSON string.
///
/// Returns `Err(())` for invalid UTF-8. Capacity for the maximum expansion is
/// reserved before writing through the vector's spare capacity.
#[inline]
pub(crate) fn write_json_string(bytes: &[u8], buf: &mut Vec<u8>) -> Result<(), ()> {
    let len = bytes.len();
    buf.reserve(len * 6 + 34);
    let base = buf.len();
    unsafe {
        let dst = buf.as_mut_ptr().add(base);
        *dst = b'"';
        let body = dst.add(1);
        let done = if len < SHORT_STRING {
            escape_prefix(bytes.as_ptr(), len, body)
        } else {
            0
        };
        let written = if done == len {
            done
        } else {
            done + validate_escape_dispatch(bytes.as_ptr().add(done), len - done, body.add(done))?
        };
        *body.add(written) = b'"';
        buf.set_len(base + written + 2);
    }
    Ok(())
}

// ---------------------------------------------------------------------------
// AArch64 NEON — validating
// ---------------------------------------------------------------------------

/// # Safety
///
/// `src` must be readable for `len` bytes and `dst` writable for `6 * len`
/// bytes; escapes overrun what they keep, but not that (see `QUOTE_TAB`).
#[cfg(target_arch = "aarch64")]
#[target_feature(enable = "neon")]
unsafe fn validate_escape_neon(src: *const u8, len: usize, dst: *mut u8) -> Result<usize, ()> {
    use std::arch::aarch64::*;

    let thresh = vdupq_n_u8(0x20);
    let dq = vdupq_n_u8(b'"');
    let bs = vdupq_n_u8(b'\\');
    let mut in_pos = 0usize;
    let mut out_pos = 0usize;

    while in_pos + 16 <= len {
        let v = vld1q_u8(src.add(in_pos));

        // Every byte before this chunk was ASCII, so the rest starts on a
        // character boundary.
        if vmaxvq_u8(v) >= 0x80 {
            return finish_non_ascii(src, in_pos, len, dst, out_pos);
        }

        // All ASCII — check for JSON escapes.
        let needs = vorrq_u8(
            vorrq_u8(vcltq_u8(v, thresh), vceqq_u8(v, dq)),
            vceqq_u8(v, bs),
        );

        if vmaxvq_u8(needs) == 0 {
            vst1q_u8(dst.add(out_pos), v);
            in_pos += 16;
            out_pos += 16;
        } else {
            let mut mask = [0u8; 16];
            vst1q_u8(mask.as_mut_ptr(), needs);
            let first = mask.iter().position(|&x| x != 0).unwrap_unchecked();

            // Fixed-width stores; see `QUOTE_TAB`.
            vst1q_u8(dst.add(out_pos), v);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            (dst.add(out_pos) as *mut [u8; 8]).write_unaligned(esc_bytes);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    Ok(out_pos + validate_escape_scalar(src.add(in_pos), len - in_pos, dst.add(out_pos))?)
}

// ---------------------------------------------------------------------------
// x86-64 AVX2 — validating
// ---------------------------------------------------------------------------

/// # Safety
///
/// The CPU must support AVX2. `src` must be readable for `len` bytes and
/// `dst` writable for `6 * len` bytes; escapes overrun what they keep, but
/// not that (see `QUOTE_TAB`).
#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn validate_escape_avx2(src: *const u8, len: usize, dst: *mut u8) -> Result<usize, ()> {
    use std::arch::x86_64::*;

    let thresh = _mm256_set1_epi8(0x20u8 as i8);
    let zero = _mm256_setzero_si256();
    let dq = _mm256_set1_epi8(b'"' as i8);
    let bs = _mm256_set1_epi8(b'\\' as i8);
    let mut in_pos = 0usize;
    let mut out_pos = 0usize;

    while in_pos + 32 <= len {
        let v = _mm256_loadu_si256(src.add(in_pos) as *const __m256i);

        // Every byte before this chunk was ASCII, so the rest starts on a
        // character boundary.
        if _mm256_movemask_epi8(v) != 0 {
            return finish_non_ascii(src, in_pos, len, dst, out_pos);
        }

        // All ASCII — check for escapes.
        let ctrl = _mm256_cmpgt_epi8(_mm256_subs_epu8(thresh, v), zero);
        let needs = _mm256_or_si256(
            _mm256_or_si256(ctrl, _mm256_cmpeq_epi8(v, dq)),
            _mm256_cmpeq_epi8(v, bs),
        );
        let mask = _mm256_movemask_epi8(needs) as u32;

        if mask == 0 {
            _mm256_storeu_si256(dst.add(out_pos) as *mut __m256i, v);
            in_pos += 32;
            out_pos += 32;
        } else {
            let first = mask.trailing_zeros() as usize;

            // Fixed-width stores; see `QUOTE_TAB`.
            _mm256_storeu_si256(dst.add(out_pos) as *mut __m256i, v);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            (dst.add(out_pos) as *mut [u8; 8]).write_unaligned(esc_bytes);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    // Handle the short tail before falling back to SSE2.
    let tail = len - in_pos;
    let done = escape_prefix(src.add(in_pos), tail, dst.add(out_pos));
    if done == tail {
        return Ok(out_pos + done);
    }
    Ok(out_pos
        + done
        + validate_escape_sse2(src.add(in_pos + done), tail - done, dst.add(out_pos + done))?)
}

// ---------------------------------------------------------------------------
// x86-64 SSE2 — validating
// ---------------------------------------------------------------------------

/// # Safety
///
/// `src` must be readable for `len` bytes and `dst` writable for `6 * len`
/// bytes; escapes overrun what they keep, but not that (see `QUOTE_TAB`).
#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn validate_escape_sse2(src: *const u8, len: usize, dst: *mut u8) -> Result<usize, ()> {
    use std::arch::x86_64::*;

    let thresh = _mm_set1_epi8(0x20u8 as i8);
    let zero = _mm_setzero_si128();
    let dq = _mm_set1_epi8(b'"' as i8);
    let bs = _mm_set1_epi8(b'\\' as i8);
    let mut in_pos = 0usize;
    let mut out_pos = 0usize;

    while in_pos + 16 <= len {
        let v = _mm_loadu_si128(src.add(in_pos) as *const __m128i);

        // Every byte before this chunk was ASCII, so the rest starts on a
        // character boundary.
        if _mm_movemask_epi8(v) != 0 {
            return finish_non_ascii(src, in_pos, len, dst, out_pos);
        }

        // All ASCII — check for escapes.
        let ctrl = _mm_cmpgt_epi8(_mm_subs_epu8(thresh, v), zero);
        let needs = _mm_or_si128(
            _mm_or_si128(ctrl, _mm_cmpeq_epi8(v, dq)),
            _mm_cmpeq_epi8(v, bs),
        );
        let mask = _mm_movemask_epi8(needs) as u32;

        if mask == 0 {
            _mm_storeu_si128(dst.add(out_pos) as *mut __m128i, v);
            in_pos += 16;
            out_pos += 16;
        } else {
            let first = mask.trailing_zeros() as usize;

            // Fixed-width stores; see `QUOTE_TAB`.
            _mm_storeu_si128(dst.add(out_pos) as *mut __m128i, v);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            (dst.add(out_pos) as *mut [u8; 8]).write_unaligned(esc_bytes);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    Ok(out_pos + validate_escape_scalar(src.add(in_pos), len - in_pos, dst.add(out_pos))?)
}

/// Validates and escapes the rest of a string from its first non-ASCII chunk.
///
/// Checking UTF-8 sequence by sequence while escaping ran text with frequent
/// multi-byte characters (CJK, emoji) one byte at a time. One SIMD validation
/// pass followed by the escape-only kernel, which copies high bytes through,
/// keeps both at vector width.
#[inline(never)]
unsafe fn finish_non_ascii(
    src: *const u8,
    in_pos: usize,
    len: usize,
    dst: *mut u8,
    out_pos: usize,
) -> Result<usize, ()> {
    let rest = std::slice::from_raw_parts(src.add(in_pos), len - in_pos);
    if simdutf8::basic::from_utf8(rest).is_err() {
        return Err(());
    }
    Ok(out_pos + escape_dispatch(rest.as_ptr(), rest.len(), dst.add(out_pos)))
}

// ---------------------------------------------------------------------------
// Scalar — validating
// ---------------------------------------------------------------------------

unsafe fn validate_escape_scalar(src: *const u8, len: usize, dst: *mut u8) -> Result<usize, ()> {
    let mut in_pos = 0usize;
    let mut out_pos = 0usize;
    let mut start = 0usize;

    while in_pos < len {
        let b = *src.add(in_pos);
        if b >= 0x80 {
            // Flush clean run, then validate + copy the multi-byte sequence.
            if start < in_pos {
                let copy_len = in_pos - start;
                std::ptr::copy_nonoverlapping(src.add(start), dst.add(out_pos), copy_len);
                out_pos += copy_len;
            }
            let width = validate_utf8_seq(src, in_pos, len)?;
            std::ptr::copy_nonoverlapping(src.add(in_pos), dst.add(out_pos), width);
            out_pos += width;
            in_pos += width;
            start = in_pos;
        } else if NEEDS_ESCAPE[b as usize] {
            if start < in_pos {
                let copy_len = in_pos - start;
                std::ptr::copy_nonoverlapping(src.add(start), dst.add(out_pos), copy_len);
                out_pos += copy_len;
            }
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            std::ptr::copy_nonoverlapping(esc_bytes.as_ptr(), dst.add(out_pos), esc_len as usize);
            out_pos += esc_len as usize;
            in_pos += 1;
            start = in_pos;
        } else {
            in_pos += 1;
        }
    }

    if start < len {
        let copy_len = len - start;
        std::ptr::copy_nonoverlapping(src.add(start), dst.add(out_pos), copy_len);
        out_pos += copy_len;
    }

    Ok(out_pos)
}

// ---------------------------------------------------------------------------
// Dispatch — validating
// ---------------------------------------------------------------------------

unsafe fn validate_escape_dispatch(src: *const u8, len: usize, dst: *mut u8) -> Result<usize, ()> {
    #[cfg(target_arch = "aarch64")]
    {
        validate_escape_neon(src, len, dst)
    }
    #[cfg(target_arch = "x86_64")]
    {
        // Cached by std_detect after the first call (one relaxed load).
        if is_x86_feature_detected!("avx2") {
            validate_escape_avx2(src, len, dst)
        } else {
            validate_escape_sse2(src, len, dst)
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        validate_escape_scalar(src, len, dst)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // Scalar reference implementation for `escape_prefix`.
    fn first_special(bytes: &[u8]) -> usize {
        bytes
            .iter()
            .position(|&b| b >= 0x80 || NEEDS_ESCAPE[b as usize])
            .unwrap_or(bytes.len())
    }

    fn prefix_of(bytes: &[u8]) -> (usize, Vec<u8>) {
        let mut dst = vec![0xAAu8; bytes.len() + 8];
        let n = unsafe { escape_prefix(bytes.as_ptr(), bytes.len(), dst.as_mut_ptr()) };
        (n, dst)
    }

    #[test]
    fn the_prefix_ends_at_the_first_byte_it_cannot_take() {
        for len in 0..80usize {
            for pos in 0..=len {
                for special in [b'"', b'\\', 0x01, b'\n', 0x80, 0xC3, 0xFF] {
                    let mut input = vec![b'a'; len];
                    if pos < len {
                        input[pos] = special;
                    }
                    let (n, dst) = prefix_of(&input);
                    assert_eq!(
                        n,
                        first_special(&input),
                        "len {len} special {special:#04x} at {pos}"
                    );
                    assert_eq!(&dst[..n], &input[..n], "prefix bytes differ at len {len}");
                }
            }
        }
    }

    #[test]
    fn a_clean_input_is_taken_whole() {
        for len in 0..80usize {
            let input = vec![b'a'; len];
            let (n, dst) = prefix_of(&input);
            assert_eq!(n, len, "clean input of {len} bytes was cut short");
            assert_eq!(&dst[..n], &input[..]);
        }
    }

    #[test]
    fn a_leading_special_yields_an_empty_prefix() {
        for special in [b'"', b'\\', 0x00, 0x1f, 0x80, 0xFF] {
            let mut input = vec![b'a'; 40];
            input[0] = special;
            assert_eq!(prefix_of(&input).0, 0, "special {special:#04x}");
        }
    }

    #[test]
    fn quoted_output_matches_the_escape_table_at_every_handoff() {
        for len in 0..80usize {
            for pos in 0..=len {
                for special in [b'"', b'\\', 0x01, b'\n', b'\t'] {
                    let mut input = vec![b'a'; len];
                    if pos < len {
                        input[pos] = special;
                    }
                    let mut want = vec![b'"'];
                    for &b in &input {
                        let (n, esc) = QUOTE_TAB[b as usize];
                        want.extend_from_slice(&esc[..n as usize]);
                    }
                    want.push(b'"');

                    let mut got = Vec::new();
                    write_json_string(&input, &mut got).expect("ascii input is valid utf8");
                    assert_eq!(got, want, "len {len} special {special:#04x} at {pos}");
                }
            }
        }
    }

    #[test]
    fn multibyte_sequences_survive_every_boundary() {
        for pad in 0..40usize {
            for seq in ["é".as_bytes(), "✨".as_bytes(), "🚀".as_bytes()] {
                let mut input = vec![b'a'; pad];
                input.extend_from_slice(seq);
                input.extend_from_slice(&[b'b'; 3]);

                let mut got = Vec::new();
                write_json_string(&input, &mut got).expect("valid utf8");

                let mut want = vec![b'"'];
                want.extend_from_slice(&input);
                want.push(b'"');
                assert_eq!(got, want, "pad {pad} seq {seq:?}");
            }
        }
    }

    // Runtime dispatch picks AVX2 on every CI runner, so the SSE2 kernels only
    // run on old hardware unless called directly.
    #[cfg(target_arch = "x86_64")]
    mod x86_kernels {
        use super::super::*;

        type Escape = unsafe fn(*const u8, usize, *mut u8) -> usize;
        type Validate = unsafe fn(*const u8, usize, *mut u8) -> Result<usize, ()>;

        fn escape_with(kernel: Escape, input: &[u8]) -> Vec<u8> {
            let mut dst = vec![0u8; input.len() * 6 + 64];
            let n = unsafe { kernel(input.as_ptr(), input.len(), dst.as_mut_ptr()) };
            dst.truncate(n);
            dst
        }

        fn validate_with(kernel: Validate, input: &[u8]) -> Result<Vec<u8>, ()> {
            let mut dst = vec![0u8; input.len() * 6 + 64];
            let n = unsafe { kernel(input.as_ptr(), input.len(), dst.as_mut_ptr())? };
            dst.truncate(n);
            Ok(dst)
        }

        fn kernels() -> Vec<(&'static str, Escape, Validate)> {
            let mut k: Vec<(&'static str, Escape, Validate)> =
                vec![("sse2", escape_sse2, validate_escape_sse2)];
            if is_x86_feature_detected!("avx2") {
                k.push(("avx2", escape_avx2, validate_escape_avx2));
            }
            k
        }

        fn inputs() -> Vec<Vec<u8>> {
            let mut all = Vec::new();
            for len in 0..100usize {
                all.push(vec![b'a'; len]);
                for pos in 0..len {
                    for special in [b'"', b'\\', 0x01, b'\n', 0x1f] {
                        let mut input = vec![b'a'; len];
                        input[pos] = special;
                        all.push(input);
                    }
                }
            }
            for pad in 0..70usize {
                for seq in ["é", "✨", "🚀"] {
                    let mut input = vec![b'a'; pad];
                    input.extend_from_slice(seq.as_bytes());
                    input.extend_from_slice(b"\"tail\\");
                    all.push(input);
                }
            }
            all
        }

        #[test]
        fn escape_kernels_match_the_scalar_kernel() {
            for (name, escape, _) in kernels() {
                for input in inputs() {
                    assert_eq!(
                        escape_with(escape, &input),
                        escape_with(escape_scalar, &input),
                        "{name} on {input:?}"
                    );
                }
            }
        }

        #[test]
        fn validating_kernels_match_the_scalar_kernel() {
            for (name, _, validate) in kernels() {
                for input in inputs() {
                    assert_eq!(
                        validate_with(validate, &input),
                        validate_with(validate_escape_scalar, &input),
                        "{name} on {input:?}"
                    );
                }
            }
        }

        #[test]
        fn validating_kernels_reject_invalid_utf8_at_any_offset() {
            for (name, _, validate) in kernels() {
                for pad in 0..70usize {
                    for bad in [
                        &[0xFFu8][..],
                        &[0xC3, 0x28],
                        &[0xED, 0xA0, 0x80],
                        &[0xE2, 0x82],
                    ] {
                        let mut input = vec![b'a'; pad];
                        input.extend_from_slice(bad);
                        input.extend_from_slice(&[b'b'; 40]);
                        assert!(
                            validate_with(validate, &input).is_err(),
                            "{name} accepted {bad:?} after {pad} bytes"
                        );
                    }
                }
            }
        }
    }

    #[test]
    fn invalid_utf8_is_rejected_after_any_clean_prefix() {
        for pad in 0..40usize {
            for bad in [
                &[0xFFu8][..],
                &[0xC3, 0x28],
                &[0xE2, 0x28, 0xA1],
                &[0xED, 0xA0, 0x80],
                &[0xC3],
            ] {
                let mut input = vec![b'a'; pad];
                input.extend_from_slice(bad);
                let mut got = Vec::new();
                assert!(
                    write_json_string(&input, &mut got).is_err(),
                    "accepted {bad:?} after {pad} clean bytes"
                );
            }
        }
    }

    /// An escape every `period` bytes; period 1 is all escapes, whose output
    /// fills the whole 6 × len bound.
    fn escape_heavy(len: usize, period: usize) -> Vec<u8> {
        (0..len)
            .map(|i| {
                if i % period == 0 {
                    [0x01, b'"', b'\\', b'\n'][i % 4]
                } else {
                    b'a'
                }
            })
            .collect()
    }

    #[test]
    fn the_kernels_write_nothing_past_six_times_the_input() {
        type Kernel = fn(*const u8, usize, *mut u8) -> usize;
        #[cfg_attr(not(target_arch = "x86_64"), allow(unused_mut))]
        let mut kernels: Vec<(&str, Kernel)> = vec![
            ("escape", |s, l, d| unsafe { escape_dispatch(s, l, d) }),
            ("validate", |s, l, d| unsafe {
                validate_escape_dispatch(s, l, d).expect("ascii")
            }),
        ];
        // Dispatch prefers AVX2, which reaches SSE2 only for its tail.
        #[cfg(target_arch = "x86_64")]
        {
            kernels.push(("escape_sse2", |s, l, d| unsafe { escape_sse2(s, l, d) }));
            kernels.push(("validate_sse2", |s, l, d| unsafe {
                validate_escape_sse2(s, l, d).expect("ascii")
            }));
        }

        for len in 0..200usize {
            for period in [1, 2, 3, 7, 33] {
                let input = escape_heavy(len, period);
                let want: Vec<u8> = input
                    .iter()
                    .flat_map(|&b| {
                        let (n, esc) = QUOTE_TAB[b as usize];
                        esc[..n as usize].to_vec()
                    })
                    .collect();
                for (name, kernel) in &kernels {
                    let bound = 6 * len;
                    let mut dst = vec![0xAAu8; bound + 64];
                    let n = kernel(input.as_ptr(), len, dst.as_mut_ptr());
                    assert_eq!(&dst[..n], &want[..], "{name}: len {len} period {period}");
                    assert!(
                        dst[bound..].iter().all(|&b| b == 0xAA),
                        "{name} wrote past 6 x {len} bytes, period {period}"
                    );
                }
            }
        }
    }
}
