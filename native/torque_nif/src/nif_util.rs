use std::mem::MaybeUninit;

use rustler::sys::{
    enif_get_map_size, enif_make_map_from_arrays, enif_make_map_put, enif_make_new_map,
    enif_make_tuple_from_array, enif_map_iterator_create, enif_map_iterator_destroy,
    enif_map_iterator_get_pair, enif_map_iterator_next, ErlNifMapIterator, ErlNifMapIteratorEntry,
    ERL_NIF_TERM,
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

/// Largest map ERTS stores as a flatmap (`MAP_SMALL_MAP_LIMIT`); bigger maps
/// are hash maps.
pub const FLATMAP_LIMIT: usize = 32;

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

/// Build a map from an object's keys and values. Duplicate keys fall back to
/// inserting the members in order, so the last value for a key wins.
#[inline]
pub fn make_map(env: Env, keys: &[ERL_NIF_TERM], vals: &[ERL_NIF_TERM]) -> ERL_NIF_TERM {
    try_make_map(env, keys, vals).unwrap_or_else(|| map_last_wins(env, keys, vals))
}

/// `make_map` without the fallback: `None` when a key repeats.
#[inline]
pub fn try_make_map(
    env: Env,
    keys: &[ERL_NIF_TERM],
    vals: &[ERL_NIF_TERM],
) -> Option<ERL_NIF_TERM> {
    let mut map: ERL_NIF_TERM = 0;
    // SAFETY: `keys` and `vals` are live slices of `keys.len()` terms.
    unsafe { map_from_arrays(env, keys.as_ptr(), vals.as_ptr(), keys.len(), &mut map) }
        .then_some(map)
}

/// Map of an object whose keys repeat: members inserted in source order, so
/// the last value for a key wins.
#[cold]
#[inline(never)]
pub fn map_last_wins(env: Env, keys: &[ERL_NIF_TERM], vals: &[ERL_NIF_TERM]) -> ERL_NIF_TERM {
    unsafe {
        let mut map = enif_make_new_map(env.as_c_arg());
        for (&key, &val) in keys.iter().zip(vals) {
            let mut new_map: ERL_NIF_TERM = 0;
            enif_make_map_put(env.as_c_arg(), map, key, val, &mut new_map);
            map = new_map;
        }
        map
    }
}

/// Forward-only iterator over a map's entries.
///
/// rustler's `MapIterator` is double-ended: it checks `enif_is_map` and keeps
/// a second, reverse cursor whose last key it compares on every step. The
/// encoder only walks forwards.
pub struct MapEntries<'a> {
    env: Env<'a>,
    iter: ErlNifMapIterator,
}

impl<'a> MapEntries<'a> {
    pub fn new(map: Term<'a>) -> Option<Self> {
        let env = map.get_env();
        let mut iter = MaybeUninit::<ErlNifMapIterator>::uninit();
        // SAFETY: `enif_map_iterator_create` initialises `iter` when it
        // succeeds, and fails without touching it for anything but a map.
        let created = unsafe {
            enif_map_iterator_create(
                env.as_c_arg(),
                map.as_c_arg(),
                iter.as_mut_ptr(),
                ErlNifMapIteratorEntry::ERL_NIF_MAP_ITERATOR_HEAD,
            )
        };
        if created == 0 {
            return None;
        }
        Some(MapEntries {
            env,
            // SAFETY: created, as just checked.
            iter: unsafe { iter.assume_init() },
        })
    }
}

impl<'a> Iterator for MapEntries<'a> {
    type Item = (Term<'a>, Term<'a>);

    #[inline]
    fn next(&mut self) -> Option<Self::Item> {
        let (mut key, mut val) = (0 as ERL_NIF_TERM, 0 as ERL_NIF_TERM);
        // SAFETY: the iterator lives as long as `self`, and the terms it hands
        // back belong to `self.env`.
        unsafe {
            if enif_map_iterator_get_pair(self.env.as_c_arg(), &mut self.iter, &mut key, &mut val)
                == 0
            {
                return None;
            }
            enif_map_iterator_next(self.env.as_c_arg(), &mut self.iter);
            Some((Term::new(self.env, key), Term::new(self.env, val)))
        }
    }
}

impl Drop for MapEntries<'_> {
    fn drop(&mut self) {
        // SAFETY: created in `new`, destroyed exactly once here.
        unsafe { enif_map_iterator_destroy(self.env.as_c_arg(), &mut self.iter) };
    }
}
