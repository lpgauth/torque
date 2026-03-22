//! Single-pass JSON decoder using sonic-rs's serde Deserializer.
//!
//! Instead of parsing to `sonic_rs::Value` and then converting to Erlang terms
//! (two passes), this module uses a custom serde `Visitor` that builds Erlang
//! terms directly as sonic-rs parses the JSON (single pass).
//!
//! Optimizations:
//! - **Sub-binary zero-copy**: `visit_borrowed_str` creates sub-binaries pointing
//!   into the original input, avoiding allocation and memcpy for unescaped strings.

use rustler::sys::{
    enif_make_list_from_array, enif_make_map_from_arrays, enif_make_map_put, enif_make_new_map,
    enif_make_sub_binary, ERL_NIF_TERM,
};
use rustler::{Encoder, Env, NewBinary, Term};
use serde::de::{self, DeserializeSeed, MapAccess, SeqAccess, Visitor};
use serde::Deserialize;
use std::fmt;

use crate::atoms;
use crate::nif_util::make_tuple2;

const STACK_SIZE: usize = 32;
const MAX_DEPTH: u32 = 512;

/// Input buffer info for sub-binary creation. All fields are Copy.
#[derive(Clone, Copy)]
struct InputRef {
    term: ERL_NIF_TERM,
    base: *const u8,
    len: usize,
}

#[inline]
fn make_binary_term(env: Env, s: &str) -> ERL_NIF_TERM {
    let bytes = s.as_bytes();
    let mut binary = NewBinary::new(env, bytes.len());
    binary.as_mut_slice().copy_from_slice(bytes);
    let term: Term = binary.into();
    term.as_c_arg()
}

/// Try to create a sub-binary; fall back to copy if the str is not in the input buffer.
#[inline]
fn make_str_term(env: Env, input: InputRef, s: &str) -> ERL_NIF_TERM {
    let ptr = s.as_ptr();
    if ptr >= input.base {
        let offset = unsafe { ptr.offset_from(input.base) } as usize;
        let len = s.len();
        if offset + len <= input.len {
            return unsafe { enif_make_sub_binary(env.as_c_arg(), input.term, offset, len) };
        }
    }
    make_binary_term(env, s)
}

// ---------------------------------------------------------------------------
// DeserializeSeed: carries Env + depth + input through recursive deser
// ---------------------------------------------------------------------------

struct TermSeed<'a> {
    env: Env<'a>,
    input: InputRef,
    depth: u32,
}

impl<'de, 'a> DeserializeSeed<'de> for TermSeed<'a> {
    type Value = ERL_NIF_TERM;

    #[inline]
    fn deserialize<D: serde::Deserializer<'de>>(
        self,
        deserializer: D,
    ) -> Result<Self::Value, D::Error> {
        deserializer.deserialize_any(TermVisitor {
            env: self.env,
            input: self.input,
            depth: self.depth,
        })
    }
}

struct KeySeed<'a> {
    env: Env<'a>,
    input: InputRef,
}

impl<'de, 'a> DeserializeSeed<'de> for KeySeed<'a> {
    type Value = ERL_NIF_TERM;

    #[inline]
    fn deserialize<D: serde::Deserializer<'de>>(
        self,
        deserializer: D,
    ) -> Result<Self::Value, D::Error> {
        deserializer.deserialize_str(KeyVisitor {
            env: self.env,
            input: self.input,
        })
    }
}

struct KeyVisitor<'a> {
    env: Env<'a>,
    input: InputRef,
}

impl<'de, 'a> Visitor<'de> for KeyVisitor<'a> {
    type Value = ERL_NIF_TERM;

    fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str("a string key")
    }

    #[inline]
    fn visit_str<E: de::Error>(self, v: &str) -> Result<Self::Value, E> {
        Ok(make_str_term(self.env, self.input, v))
    }

    #[inline]
    fn visit_borrowed_str<E: de::Error>(self, v: &'de str) -> Result<Self::Value, E> {
        Ok(make_str_term(self.env, self.input, v))
    }
}

// ---------------------------------------------------------------------------
// Visitor: builds Erlang terms directly from JSON tokens
// ---------------------------------------------------------------------------

struct TermVisitor<'a> {
    env: Env<'a>,
    input: InputRef,
    depth: u32,
}

impl<'de, 'a> Visitor<'de> for TermVisitor<'a> {
    type Value = ERL_NIF_TERM;

    fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str("any JSON value")
    }

    #[inline]
    fn visit_unit<E: de::Error>(self) -> Result<Self::Value, E> {
        Ok(atoms::nil().as_c_arg())
    }

    #[inline]
    fn visit_bool<E: de::Error>(self, v: bool) -> Result<Self::Value, E> {
        Ok(if v {
            atoms::r#true().as_c_arg()
        } else {
            atoms::r#false().as_c_arg()
        })
    }

    #[inline]
    fn visit_i64<E: de::Error>(self, v: i64) -> Result<Self::Value, E> {
        Ok(unsafe { rustler::sys::enif_make_int64(self.env.as_c_arg(), v) })
    }

    #[inline]
    fn visit_u64<E: de::Error>(self, v: u64) -> Result<Self::Value, E> {
        Ok(unsafe { rustler::sys::enif_make_uint64(self.env.as_c_arg(), v) })
    }

    #[inline]
    fn visit_f64<E: de::Error>(self, v: f64) -> Result<Self::Value, E> {
        Ok(unsafe { rustler::sys::enif_make_double(self.env.as_c_arg(), v) })
    }

    #[inline]
    fn visit_str<E: de::Error>(self, v: &str) -> Result<Self::Value, E> {
        Ok(make_str_term(self.env, self.input, v))
    }

    #[inline]
    fn visit_borrowed_str<E: de::Error>(self, v: &'de str) -> Result<Self::Value, E> {
        Ok(make_str_term(self.env, self.input, v))
    }

    fn visit_seq<A: SeqAccess<'de>>(self, mut seq: A) -> Result<Self::Value, A::Error> {
        if self.depth == 0 {
            return Err(de::Error::custom("nesting too deep"));
        }
        let child_depth = self.depth - 1;
        let hint = seq.size_hint().unwrap_or(0);
        let env = self.env;
        let input = self.input;

        if hint <= STACK_SIZE {
            let mut stack: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
            let mut count = 0;

            while count < STACK_SIZE {
                match seq.next_element_seed(TermSeed {
                    env,
                    input,
                    depth: child_depth,
                })? {
                    Some(term) => {
                        stack[count] = term;
                        count += 1;
                    }
                    None => {
                        return Ok(unsafe {
                            enif_make_list_from_array(env.as_c_arg(), stack.as_ptr(), count as u32)
                        });
                    }
                }
            }

            let mut heap = Vec::with_capacity(STACK_SIZE * 2);
            heap.extend_from_slice(&stack[..count]);
            while let Some(term) = seq.next_element_seed(TermSeed {
                env,
                input,
                depth: child_depth,
            })? {
                heap.push(term);
            }
            Ok(unsafe {
                enif_make_list_from_array(env.as_c_arg(), heap.as_ptr(), heap.len() as u32)
            })
        } else {
            let mut terms = Vec::with_capacity(hint);
            while let Some(term) = seq.next_element_seed(TermSeed {
                env,
                input,
                depth: child_depth,
            })? {
                terms.push(term);
            }
            Ok(unsafe {
                enif_make_list_from_array(env.as_c_arg(), terms.as_ptr(), terms.len() as u32)
            })
        }
    }

    fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<Self::Value, A::Error> {
        if self.depth == 0 {
            return Err(de::Error::custom("nesting too deep"));
        }
        let child_depth = self.depth - 1;
        let hint = map.size_hint().unwrap_or(0);
        let env = self.env;
        let input = self.input;

        if hint <= STACK_SIZE {
            let mut key_stack: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
            let mut val_stack: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
            let mut count = 0;

            while count < STACK_SIZE {
                match map.next_key_seed(KeySeed { env, input })? {
                    Some(key) => {
                        let val = map.next_value_seed(TermSeed {
                            env,
                            input,
                            depth: child_depth,
                        })?;
                        key_stack[count] = key;
                        val_stack[count] = val;
                        count += 1;
                    }
                    None => {
                        return build_map(env, &key_stack[..count], &val_stack[..count], count);
                    }
                }
            }

            let mut keys = Vec::with_capacity(STACK_SIZE * 2);
            let mut vals = Vec::with_capacity(STACK_SIZE * 2);
            keys.extend_from_slice(&key_stack[..count]);
            vals.extend_from_slice(&val_stack[..count]);
            while let Some(key) = map.next_key_seed(KeySeed { env, input })? {
                let val = map.next_value_seed(TermSeed {
                    env,
                    input,
                    depth: child_depth,
                })?;
                keys.push(key);
                vals.push(val);
            }
            build_map(env, &keys, &vals, keys.len())
        } else {
            let mut keys = Vec::with_capacity(hint);
            let mut vals = Vec::with_capacity(hint);
            while let Some(key) = map.next_key_seed(KeySeed { env, input })? {
                let val = map.next_value_seed(TermSeed {
                    env,
                    input,
                    depth: child_depth,
                })?;
                keys.push(key);
                vals.push(val);
            }
            build_map(env, &keys, &vals, keys.len())
        }
    }
}

#[inline]
fn build_map<E: de::Error>(
    env: Env,
    keys: &[ERL_NIF_TERM],
    vals: &[ERL_NIF_TERM],
    count: usize,
) -> Result<ERL_NIF_TERM, E> {
    unsafe {
        let mut result: ERL_NIF_TERM = 0;
        if enif_make_map_from_arrays(
            env.as_c_arg(),
            keys.as_ptr(),
            vals.as_ptr(),
            count,
            &mut result,
        ) != 0
        {
            Ok(result)
        } else {
            result = enif_make_new_map(env.as_c_arg());
            for i in 0..count {
                let mut new_map: ERL_NIF_TERM = 0;
                enif_make_map_put(env.as_c_arg(), result, keys[i], vals[i], &mut new_map);
                result = new_map;
            }
            Ok(result)
        }
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

pub fn decode_to_term<'a>(env: Env<'a>, input_term: ERL_NIF_TERM, bytes: &[u8]) -> Term<'a> {
    let input = InputRef {
        term: input_term,
        base: bytes.as_ptr(),
        len: bytes.len(),
    };

    let mut deserializer = sonic_rs::Deserializer::from_slice(bytes);
    let seed = TermSeed {
        env,
        input,
        depth: MAX_DEPTH,
    };
    match seed.deserialize(&mut deserializer) {
        Ok(term) => {
            match serde::de::IgnoredAny::deserialize(&mut deserializer) {
                Err(e) if e.is_eof() => {}
                _ => {
                    return make_tuple2(
                        env,
                        atoms::error().as_c_arg(),
                        "trailing characters".encode(env).as_c_arg(),
                    );
                }
            }
            make_tuple2(env, atoms::ok().as_c_arg(), term)
        }
        Err(e) => {
            let msg = format!("{}", e);
            if msg.contains("nesting too deep") {
                return make_tuple2(
                    env,
                    atoms::error().as_c_arg(),
                    atoms::nesting_too_deep().as_c_arg(),
                );
            }
            make_tuple2(env, atoms::error().as_c_arg(), msg.encode(env).as_c_arg())
        }
    }
}
