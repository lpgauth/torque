rustler::atoms! {
    ok,
    error,
    no_such_field,
    nesting_too_deep,
    nonexistent_atom,
    atom_too_long,
    exponent_too_large,
    nil,
    // atoms for fast identity comparison in encoder
    r#true = "true",
    r#false = "false",
    // specific encode error atoms
    unsupported_type,
    non_finite_float,
    invalid_key,
    malformed_proplist,
    invalid_utf8,
    unhandled_struct,
    // struct marker key (atom `__struct__` in Elixir structs)
    __struct__ = "__struct__",
    // `Decimal`'s struct name and fields, for `floats: :decimals`
    decimal = "Elixir.Decimal",
    coef,
    exp,
    sign,
}
