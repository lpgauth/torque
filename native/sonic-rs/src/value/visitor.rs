pub trait JsonVisitor<'de> {
    fn visit_dom_start(&mut self) -> bool {
        false
    }

    fn visit_null(&mut self) -> bool {
        false
    }

    fn visit_bool(&mut self, _val: bool) -> bool {
        false
    }

    fn visit_u64(&mut self, _val: u64) -> bool {
        false
    }

    fn visit_i64(&mut self, _val: i64) -> bool {
        false
    }

    fn visit_f64(&mut self, _val: f64) -> bool {
        false
    }

    /// An integer-shaped token (no `.`, `e`, or `E`) whose magnitude exceeds
    /// the i64/u64 range, so `sonic-number` parsed it as `f64`. `raw` is the
    /// original token bytes (including any leading `-`); `as_f64` is the lossy
    /// float fallback. The default preserves historical behavior by yielding
    /// the float; visitors that want exact bignums override this.
    fn visit_overflow_int(&mut self, _raw: &str, as_f64: f64) -> bool {
        self.visit_f64(as_f64)
    }

    fn visit_raw_number(&mut self, _val: &str) -> bool {
        false
    }

    fn visit_borrowed_raw_number(&mut self, _val: &str) -> bool {
        false
    }

    fn visit_str(&mut self, _value: &str) -> bool {
        false
    }

    fn visit_borrowed_str(&mut self, _value: &'de str) -> bool {
        false
    }

    fn visit_object_start(&mut self, _hint: usize) -> bool {
        false
    }

    fn visit_object_end(&mut self, _len: usize) -> bool {
        false
    }

    fn visit_array_start(&mut self, _hint: usize) -> bool {
        false
    }

    fn visit_array_end(&mut self, _len: usize) -> bool {
        false
    }

    // Torque patch: the visitor-driven parse delivers object keys through the
    // key hooks, so the defaults forward to the string hooks for visitors that
    // don't care about the distinction.
    fn visit_key(&mut self, key: &str) -> bool {
        self.visit_str(key)
    }

    fn visit_borrowed_key(&mut self, key: &'de str) -> bool {
        self.visit_borrowed_str(key)
    }

    fn visit_dom_end(&mut self) -> bool {
        false
    }
}
