// SIMD-accelerated JSON string escaping with optional UTF-8 validation.
//
// Entry points:
//   `escape_to_vec(bytes, buf)` — escape only (for Latin-1 atom names)
//   `validate_and_escape_to_vec(bytes, buf)` — fused UTF-8 validation + escape
//
// Platform dispatch:
//   aarch64 → NEON (vmaxvq_u8 / UMAXV, mandatory on AArch64)
//   x86_64  → SSE2 (pmovmskb + tzcnt, baseline on x86-64)
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
/// `bytes` must already be validated as UTF-8 (or Latin-1 for atom names);
/// this function only escapes JSON special characters, it does not re-validate.
pub(crate) fn escape_to_vec(bytes: &[u8], buf: &mut Vec<u8>) {
    if bytes.is_empty() {
        return;
    }
    buf.reserve(bytes.len() * 6 + 32);
    let written = unsafe {
        let dst = buf.spare_capacity_mut().as_mut_ptr() as *mut u8;
        escape_dispatch(bytes.as_ptr(), bytes.len(), dst)
    };
    unsafe { buf.set_len(buf.len() + written) };
}

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

            std::ptr::copy_nonoverlapping(src.add(in_pos), dst.add(out_pos), first);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            std::ptr::copy_nonoverlapping(esc_bytes.as_ptr(), dst.add(out_pos), esc_len as usize);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    out_pos + escape_scalar(src.add(in_pos), len - in_pos, dst.add(out_pos))
}

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

            std::ptr::copy_nonoverlapping(src.add(in_pos), dst.add(out_pos), first);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            std::ptr::copy_nonoverlapping(esc_bytes.as_ptr(), dst.add(out_pos), esc_len as usize);
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
        escape_sse2(src, len, dst)
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        escape_scalar(src, len, dst)
    }
}

// ===========================================================================
// Fused UTF-8 validation + escape (for binary strings)
// ===========================================================================

/// Validate UTF-8 and escape JSON special characters in a single pass.
/// Returns `Err(())` if `bytes` is not valid UTF-8.
pub(crate) fn validate_and_escape_to_vec(bytes: &[u8], buf: &mut Vec<u8>) -> Result<(), ()> {
    if bytes.is_empty() {
        return Ok(());
    }
    buf.reserve(bytes.len() * 6 + 32);
    let written = unsafe {
        let dst = buf.spare_capacity_mut().as_mut_ptr() as *mut u8;
        validate_escape_dispatch(bytes.as_ptr(), bytes.len(), dst)?
    };
    unsafe { buf.set_len(buf.len() + written) };
    Ok(())
}

// ---------------------------------------------------------------------------
// AArch64 NEON — validating
// ---------------------------------------------------------------------------

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

        // Non-ASCII byte detected — process chunk byte-by-byte then resume SIMD.
        if vmaxvq_u8(v) >= 0x80 {
            let chunk_limit = in_pos + 16;
            while in_pos < chunk_limit {
                let b = *src.add(in_pos);
                if b >= 0x80 {
                    let width = validate_utf8_seq(src, in_pos, len)?;
                    std::ptr::copy_nonoverlapping(src.add(in_pos), dst.add(out_pos), width);
                    out_pos += width;
                    in_pos += width;
                } else if NEEDS_ESCAPE[b as usize] {
                    let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
                    std::ptr::copy_nonoverlapping(
                        esc_bytes.as_ptr(),
                        dst.add(out_pos),
                        esc_len as usize,
                    );
                    out_pos += esc_len as usize;
                    in_pos += 1;
                } else {
                    *dst.add(out_pos) = b;
                    out_pos += 1;
                    in_pos += 1;
                }
            }
            continue;
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

            std::ptr::copy_nonoverlapping(src.add(in_pos), dst.add(out_pos), first);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            std::ptr::copy_nonoverlapping(esc_bytes.as_ptr(), dst.add(out_pos), esc_len as usize);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    Ok(out_pos + validate_escape_scalar(src.add(in_pos), len - in_pos, dst.add(out_pos))?)
}

// ---------------------------------------------------------------------------
// x86-64 SSE2 — validating
// ---------------------------------------------------------------------------

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

        // Non-ASCII byte detected — process chunk byte-by-byte then resume SIMD.
        if _mm_movemask_epi8(v) != 0 {
            let chunk_limit = in_pos + 16;
            while in_pos < chunk_limit {
                let b = *src.add(in_pos);
                if b >= 0x80 {
                    let width = validate_utf8_seq(src, in_pos, len)?;
                    std::ptr::copy_nonoverlapping(src.add(in_pos), dst.add(out_pos), width);
                    out_pos += width;
                    in_pos += width;
                } else if NEEDS_ESCAPE[b as usize] {
                    let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
                    std::ptr::copy_nonoverlapping(
                        esc_bytes.as_ptr(),
                        dst.add(out_pos),
                        esc_len as usize,
                    );
                    out_pos += esc_len as usize;
                    in_pos += 1;
                } else {
                    *dst.add(out_pos) = b;
                    out_pos += 1;
                    in_pos += 1;
                }
            }
            continue;
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

            std::ptr::copy_nonoverlapping(src.add(in_pos), dst.add(out_pos), first);
            out_pos += first;

            let b = *src.add(in_pos + first);
            let (esc_len, esc_bytes) = QUOTE_TAB[b as usize];
            std::ptr::copy_nonoverlapping(esc_bytes.as_ptr(), dst.add(out_pos), esc_len as usize);
            out_pos += esc_len as usize;
            in_pos += first + 1;
        }
    }

    Ok(out_pos + validate_escape_scalar(src.add(in_pos), len - in_pos, dst.add(out_pos))?)
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
        validate_escape_sse2(src, len, dst)
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        validate_escape_scalar(src, len, dst)
    }
}
