use rustler::sys::{
    enif_get_map_size, enif_make_map_from_arrays, enif_make_tuple_from_array, ERL_NIF_TERM,
};
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

const BYTES_PER_REDUCTION: usize = 20;
/// Reductions per full BEAM timeslice (CONTEXT_REDS).
pub const REDUCTION_COUNT: usize = 4000;

/// Compute a timeslice percentage (1–100) proportional to bytes processed.
#[inline]
pub fn timeslice_percent(bytes: usize) -> i32 {
    let reds = bytes / BYTES_PER_REDUCTION;
    ((reds * 100 / REDUCTION_COUNT) as i32).clamp(1, 100)
}

/// Largest map ERTS stores as a flatmap; bigger maps are hash maps.
const FLATMAP_LIMIT: usize = 32;

/// Build a map from key and value arrays.
///
/// Returns false when ERTS rejects the members, or when duplicate keys
/// collapsed the map size: before erlang/otp#10976, `enif_make_map_from_arrays`
/// reported success for a hashmap-sized input with duplicate keys and returned
/// an invalid map.
///
/// # Safety
///
/// `keys` and `vals` must point to `count` initialized terms, and `map` to a
/// writable term.
#[inline]
pub unsafe fn map_from_arrays(
    env: Env,
    keys: *const ERL_NIF_TERM,
    vals: *const ERL_NIF_TERM,
    count: usize,
    map: *mut ERL_NIF_TERM,
) -> bool {
    if enif_make_map_from_arrays(env.as_c_arg(), keys, vals, count, map) == 0 {
        return false;
    }
    if count <= FLATMAP_LIMIT {
        return true;
    }
    let mut size = 0;
    enif_get_map_size(env.as_c_arg(), *map, &mut size) != 0 && size == count
}
