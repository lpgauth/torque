use rustler::sys::{enif_make_list_from_array, enif_make_map_put, enif_make_new_map, ERL_NIF_TERM};
use rustler::{Env, NewBinary, Term};
use sonic_rs::{JsonContainerTrait, JsonType, JsonValueTrait};

use crate::atoms;

const STACK_SIZE: usize = 32;

#[inline]
fn build_map(env: Env, obj: &sonic_rs::Object) -> ERL_NIF_TERM {
    let mut map = unsafe { enif_make_new_map(env.as_c_arg()) };
    for (k, v) in obj.iter() {
        let key = make_binary_term(env, k).as_c_arg();
        let val = value_to_term(env, v).as_c_arg();
        let mut next_map: ERL_NIF_TERM = 0;
        let ok = unsafe { enif_make_map_put(env.as_c_arg(), map, key, val, &mut next_map) };
        if ok == 0 {
            return 0;
        }
        map = next_map;
    }
    map
}

#[inline]
fn make_binary_term<'a>(env: Env<'a>, s: &str) -> Term<'a> {
    let bytes = s.as_bytes();
    let mut binary = NewBinary::new(env, bytes.len());
    binary.as_mut_slice().copy_from_slice(bytes);
    binary.into()
}

#[inline]
pub fn value_to_term<'a>(env: Env<'a>, value: &sonic_rs::Value) -> Term<'a> {
    match value.get_type() {
        JsonType::Null => atoms::nil().to_term(env),
        JsonType::Boolean => {
            if value.as_bool().unwrap() {
                atoms::r#true().to_term(env)
            } else {
                atoms::r#false().to_term(env)
            }
        }
        JsonType::Number => {
            if value.is_i64() {
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
            }
        }
        JsonType::String => make_binary_term(env, value.as_str().unwrap()),
        JsonType::Array => {
            let arr: &sonic_rs::Array = value.as_array().unwrap();
            let count = arr.len();
            if count <= STACK_SIZE {
                let mut terms: [ERL_NIF_TERM; STACK_SIZE] = [0; STACK_SIZE];
                for (i, v) in arr.iter().enumerate() {
                    terms[i] = value_to_term(env, v).as_c_arg();
                }
                unsafe {
                    Term::new(
                        env,
                        enif_make_list_from_array(env.as_c_arg(), terms.as_ptr(), count as u32),
                    )
                }
            } else {
                let mut terms: Vec<ERL_NIF_TERM> = Vec::with_capacity(count);
                for v in arr.iter() {
                    terms.push(value_to_term(env, v).as_c_arg());
                }
                unsafe {
                    Term::new(
                        env,
                        enif_make_list_from_array(env.as_c_arg(), terms.as_ptr(), count as u32),
                    )
                }
            }
        }
        JsonType::Object => {
            let obj: &sonic_rs::Object = value.as_object().unwrap();
            let map = build_map(env, obj);
            if map == 0 {
                atoms::nil().to_term(env)
            } else {
                unsafe { Term::new(env, map) }
            }
        }
    }
}
