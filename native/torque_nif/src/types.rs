use rustler::sys::{
    enif_make_list_from_array, enif_make_map_from_arrays, enif_make_map_put, enif_make_new_map,
    ERL_NIF_TERM,
};
use rustler::{Env, NewBinary, Term};
use sonic_rs::{JsonContainerTrait, JsonType, JsonValueTrait};

use crate::atoms;

const STACK_SIZE: usize = 32;

/// Maximum JSON nesting depth accepted by `value_to_term`. Inputs nested deeper
/// than this return `{:error, :nesting_too_deep}` rather than crashing the VM.
pub const MAX_DEPTH: u32 = 512;

#[inline]
fn make_binary_term<'a>(env: Env<'a>, s: &str) -> Term<'a> {
    let bytes = s.as_bytes();
    let mut binary = NewBinary::new(env, bytes.len());
    binary.as_mut_slice().copy_from_slice(bytes);
    binary.into()
}

/// Convert a sonic-rs Value to an Erlang term.
///
/// `depth` is the remaining nesting budget; returns `None` when it reaches zero
/// on an object or array, signalling that the document is too deeply nested.
#[inline]
pub fn value_to_term<'a>(env: Env<'a>, value: &sonic_rs::Value, depth: u32) -> Option<Term<'a>> {
    match value.get_type() {
        JsonType::Null => Some(atoms::nil().to_term(env)),
        JsonType::Boolean => Some(if value.as_bool().unwrap() {
            atoms::r#true().to_term(env)
        } else {
            atoms::r#false().to_term(env)
        }),
        JsonType::Number => Some(if value.is_i64() {
            unsafe {
                let n = value.as_i64().unwrap();
                Term::new(env, rustler::sys::enif_make_int64(env.as_c_arg(), n))
            }
        } else if value.is_u64() {
            unsafe {
                let n = value.as_u64().unwrap();
                Term::new(env, rustler::sys::enif_make_uint64(env.as_c_arg(), n))
            }
        } else {
            unsafe {
                let n = value.as_f64().unwrap();
                Term::new(env, rustler::sys::enif_make_double(env.as_c_arg(), n))
            }
        }),
        JsonType::String => Some(make_binary_term(env, value.as_str().unwrap())),
        JsonType::Array => {
            if depth == 0 {
                return None;
            }
            let arr: &sonic_rs::Array = value.as_array().unwrap();
            let count = arr.len();
            let child_depth = depth - 1;
            if count <= STACK_SIZE {
                let mut terms: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
                for (i, v) in arr.iter().enumerate() {
                    terms[i] = value_to_term(env, v, child_depth)?.as_c_arg();
                }
                unsafe {
                    Some(Term::new(
                        env,
                        enif_make_list_from_array(env.as_c_arg(), terms.as_ptr(), count as u32),
                    ))
                }
            } else {
                let mut terms: Vec<ERL_NIF_TERM> = Vec::with_capacity(count);
                for v in arr.iter() {
                    terms.push(value_to_term(env, v, child_depth)?.as_c_arg());
                }
                unsafe {
                    Some(Term::new(
                        env,
                        enif_make_list_from_array(env.as_c_arg(), terms.as_ptr(), count as u32),
                    ))
                }
            }
        }
        JsonType::Object => {
            if depth == 0 {
                return None;
            }
            let obj: &sonic_rs::Object = value.as_object().unwrap();
            let count = obj.len();
            let child_depth = depth - 1;
            if count <= STACK_SIZE {
                let mut keys: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
                let mut vals: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
                for (i, (k, v)) in obj.iter().enumerate() {
                    keys[i] = make_binary_term(env, k).as_c_arg();
                    vals[i] = value_to_term(env, v, child_depth)?.as_c_arg();
                }
                let mut map: ERL_NIF_TERM = 0;
                unsafe {
                    if enif_make_map_from_arrays(
                        env.as_c_arg(),
                        keys.as_ptr(),
                        vals.as_ptr(),
                        count,
                        &mut map,
                    ) != 0
                    {
                        Some(Term::new(env, map))
                    } else {
                        build_map_dedup(env, obj, child_depth)
                    }
                }
            } else {
                let mut keys: Vec<ERL_NIF_TERM> = Vec::with_capacity(count);
                let mut vals: Vec<ERL_NIF_TERM> = Vec::with_capacity(count);
                for (k, v) in obj.iter() {
                    keys.push(make_binary_term(env, k).as_c_arg());
                    vals.push(value_to_term(env, v, child_depth)?.as_c_arg());
                }
                let mut map: ERL_NIF_TERM = 0;
                unsafe {
                    if enif_make_map_from_arrays(
                        env.as_c_arg(),
                        keys.as_ptr(),
                        vals.as_ptr(),
                        count,
                        &mut map,
                    ) != 0
                    {
                        Some(Term::new(env, map))
                    } else {
                        build_map_dedup(env, obj, child_depth)
                    }
                }
            }
        }
    }
}

/// Fallback for objects with duplicate keys. Iterates all pairs so that the
/// last value for each duplicate key wins, matching common JSON parser behaviour.
/// Marked `#[cold]` so the optimiser keeps the duplicate-free fast path hot.
#[cold]
fn build_map_dedup<'a>(env: Env<'a>, obj: &sonic_rs::Object, depth: u32) -> Option<Term<'a>> {
    unsafe {
        let mut map = enif_make_new_map(env.as_c_arg());
        for (k, v) in obj.iter() {
            let key = make_binary_term(env, k).as_c_arg();
            let val = value_to_term(env, v, depth)?.as_c_arg();
            let mut new_map: ERL_NIF_TERM = 0;
            enif_make_map_put(env.as_c_arg(), map, key, val, &mut new_map);
            map = new_map;
        }
        Some(Term::new(env, map))
    }
}
