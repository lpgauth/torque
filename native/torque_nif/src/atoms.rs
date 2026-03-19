rustler::atoms! {
    ok,
    error,
    no_such_field,
    nesting_too_deep,
    nil,
    // atoms for fast identity comparison in encoder
    r#true = "true",
    r#false = "false",
}
