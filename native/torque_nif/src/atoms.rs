rustler::atoms! {
    ok,
    error,
    no_such_field,
    nesting_too_deep,
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
}
