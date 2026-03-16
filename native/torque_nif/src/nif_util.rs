use rustler::sys::{enif_make_tuple_from_array, ERL_NIF_TERM};
use rustler::{Env, Term};

/// Build a 2-tuple from two raw NIF terms.
#[inline]
pub fn make_tuple2<'a>(env: Env<'a>, a: ERL_NIF_TERM, b: ERL_NIF_TERM) -> Term<'a> {
    let arr: [ERL_NIF_TERM; 2] = [a, b];
    unsafe {
        Term::new(
            env,
            enif_make_tuple_from_array(env.as_c_arg(), arr.as_ptr(), 2),
        )
    }
}
