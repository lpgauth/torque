//! Single-pass JSON decoder using sonic-rs's serde Deserializer.
//!
//! Instead of parsing to `sonic_rs::Value` and then converting to Erlang terms
//! (two passes), this module uses a custom serde `Visitor` that builds Erlang
//! terms directly as sonic-rs parses the JSON (single pass).

use rustler::sys::{
    enif_make_list_from_array, enif_make_map_from_arrays, enif_make_map_put, enif_make_new_map,
    ERL_NIF_TERM,
};
use rustler::{Encoder, Env, NewBinary, Term};
use serde::de::{self, DeserializeSeed, MapAccess, SeqAccess, Visitor};
use serde::Deserialize;
use std::fmt;

use crate::atoms;
use crate::nif_util::make_tuple2;

const STACK_SIZE: usize = 32;
const MAX_DEPTH: u32 = 512;

#[inline]
fn make_binary_term<'a>(env: Env<'a>, s: &str) -> ERL_NIF_TERM {
    let bytes = s.as_bytes();
    let mut binary = NewBinary::new(env, bytes.len());
    binary.as_mut_slice().copy_from_slice(bytes);
    let term: Term<'a> = binary.into();
    term.as_c_arg()
}

// ---------------------------------------------------------------------------
// DeserializeSeed: carries Env + depth budget through recursive deserialization
// ---------------------------------------------------------------------------

struct TermSeed<'a> {
    env: Env<'a>,
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
            depth: self.depth,
        })
    }
}

// Separate seed for map keys — always strings, avoids depth tracking overhead
struct KeySeed<'a> {
    env: Env<'a>,
}

impl<'de, 'a> DeserializeSeed<'de> for KeySeed<'a> {
    type Value = ERL_NIF_TERM;

    #[inline]
    fn deserialize<D: serde::Deserializer<'de>>(
        self,
        deserializer: D,
    ) -> Result<Self::Value, D::Error> {
        deserializer.deserialize_str(KeyVisitor { env: self.env })
    }
}

struct KeyVisitor<'a> {
    env: Env<'a>,
}

impl<'de, 'a> Visitor<'de> for KeyVisitor<'a> {
    type Value = ERL_NIF_TERM;

    fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str("a string key")
    }

    #[inline]
    fn visit_str<E: de::Error>(self, v: &str) -> Result<Self::Value, E> {
        Ok(make_binary_term(self.env, v))
    }

    #[inline]
    fn visit_borrowed_str<E: de::Error>(self, v: &'de str) -> Result<Self::Value, E> {
        Ok(make_binary_term(self.env, v))
    }
}

// ---------------------------------------------------------------------------
// Visitor: builds Erlang terms directly from JSON tokens
// ---------------------------------------------------------------------------

struct TermVisitor<'a> {
    env: Env<'a>,
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
        Ok(make_binary_term(self.env, v))
    }

    #[inline]
    fn visit_borrowed_str<E: de::Error>(self, v: &'de str) -> Result<Self::Value, E> {
        Ok(make_binary_term(self.env, v))
    }

    fn visit_seq<A: SeqAccess<'de>>(self, mut seq: A) -> Result<Self::Value, A::Error> {
        if self.depth == 0 {
            return Err(de::Error::custom("nesting too deep"));
        }
        let child_depth = self.depth - 1;
        let hint = seq.size_hint().unwrap_or(0);

        if hint <= STACK_SIZE {
            let mut stack: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
            let mut count = 0;

            // Fill stack first
            while count < STACK_SIZE {
                match seq.next_element_seed(TermSeed {
                    env: self.env,
                    depth: child_depth,
                })? {
                    Some(term) => {
                        stack[count] = term;
                        count += 1;
                    }
                    None => {
                        return Ok(unsafe {
                            enif_make_list_from_array(
                                self.env.as_c_arg(),
                                stack.as_ptr(),
                                count as u32,
                            )
                        });
                    }
                }
            }

            // Overflow to heap
            let mut heap = Vec::with_capacity(STACK_SIZE * 2);
            heap.extend_from_slice(&stack[..count]);
            while let Some(term) = seq.next_element_seed(TermSeed {
                env: self.env,
                depth: child_depth,
            })? {
                heap.push(term);
            }
            Ok(unsafe {
                enif_make_list_from_array(self.env.as_c_arg(), heap.as_ptr(), heap.len() as u32)
            })
        } else {
            // Large hint — go straight to heap
            let mut terms = Vec::with_capacity(hint);
            while let Some(term) = seq.next_element_seed(TermSeed {
                env: self.env,
                depth: child_depth,
            })? {
                terms.push(term);
            }
            Ok(unsafe {
                enif_make_list_from_array(self.env.as_c_arg(), terms.as_ptr(), terms.len() as u32)
            })
        }
    }

    fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<Self::Value, A::Error> {
        if self.depth == 0 {
            return Err(de::Error::custom("nesting too deep"));
        }
        let child_depth = self.depth - 1;
        let hint = map.size_hint().unwrap_or(0);

        if hint <= STACK_SIZE {
            let mut key_stack: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
            let mut val_stack: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
            let mut count = 0;

            // Fill stack first
            while count < STACK_SIZE {
                match map.next_key_seed(KeySeed { env: self.env })? {
                    Some(key) => {
                        let val = map.next_value_seed(TermSeed {
                            env: self.env,
                            depth: child_depth,
                        })?;
                        key_stack[count] = key;
                        val_stack[count] = val;
                        count += 1;
                    }
                    None => {
                        return build_map(
                            self.env,
                            &key_stack[..count],
                            &val_stack[..count],
                            count,
                        );
                    }
                }
            }

            // Overflow to heap
            let mut keys = Vec::with_capacity(STACK_SIZE * 2);
            let mut vals = Vec::with_capacity(STACK_SIZE * 2);
            keys.extend_from_slice(&key_stack[..count]);
            vals.extend_from_slice(&val_stack[..count]);
            while let Some(key) = map.next_key_seed(KeySeed { env: self.env })? {
                let val = map.next_value_seed(TermSeed {
                    env: self.env,
                    depth: child_depth,
                })?;
                keys.push(key);
                vals.push(val);
            }
            build_map(self.env, &keys, &vals, keys.len())
        } else {
            // Large hint — go straight to heap
            let mut keys = Vec::with_capacity(hint);
            let mut vals = Vec::with_capacity(hint);
            while let Some(key) = map.next_key_seed(KeySeed { env: self.env })? {
                let val = map.next_value_seed(TermSeed {
                    env: self.env,
                    depth: child_depth,
                })?;
                keys.push(key);
                vals.push(val);
            }
            build_map(self.env, &keys, &vals, keys.len())
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
            // Duplicate keys: last-value-wins via incremental put
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

pub fn decode_to_term<'a>(env: Env<'a>, bytes: &[u8]) -> Term<'a> {
    let mut deserializer = sonic_rs::Deserializer::from_slice(bytes);
    let seed = TermSeed {
        env,
        depth: MAX_DEPTH,
    };
    match seed.deserialize(&mut deserializer) {
        Ok(term) => {
            // Reject trailing content: try to read past the value.
            // EOF error = good (fully consumed), anything else = trailing content.
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
            // Map nesting depth errors to the :nesting_too_deep atom
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
