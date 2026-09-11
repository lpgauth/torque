//! Vendored, Torque-patched copy of sonic-rs. See native/sonic-rs/Cargo.toml.
//! Upstream third-party code: lints are silenced (we only minimally patch it).
#![allow(warnings)]
#![allow(clippy::all, clippy::pedantic, clippy::nursery, clippy::cargo)]
#![doc(test(attr(warn(unused))))]

mod config;
pub mod error;
mod index;
mod input;
mod pointer;
pub mod reader;
mod util;

pub mod extract;
pub mod format;
pub mod lazyvalue;
pub mod parser;
pub mod serde;
pub mod value;
pub mod writer;

// re-export FastStr
pub use ::faststr::FastStr;
// re-export the serde trait
pub use ::serde::{Deserialize, Serialize};
#[doc(inline)]
pub use reader::Read;

#[doc(inline)]
pub use crate::error::{Error, Result};
#[doc(inline)]
pub use crate::index::Index;
#[doc(inline)]
pub use crate::input::JsonInput;
#[doc(inline)]
pub use crate::lazyvalue::{
    get, get_from_bytes, get_from_bytes_unchecked, get_from_faststr, get_from_faststr_unchecked,
    get_from_slice, get_from_slice_unchecked, get_from_str, get_from_str_unchecked, get_many,
    get_many_unchecked, get_unchecked, to_array_iter, to_array_iter_unchecked, to_object_iter,
    to_object_iter_unchecked, ArrayJsonIter, LazyArray, LazyObject, LazyValue, ObjectJsonIter,
    OwnedLazyValue,
};
#[doc(inline)]
pub use crate::pointer::{JsonPointer, PointerNode, PointerTree};
#[doc(inline)]
pub use crate::serde::de::{MapAccess, SeqAccess};
#[doc(inline)]
pub use crate::serde::{
    from_reader, from_slice, from_slice_unchecked, from_str, to_lazyvalue, to_string,
    to_string_pretty, to_vec, to_vec_pretty, to_writer, to_writer_pretty, Deserializer,
    JsonNumberTrait, Number, RawNumber, Serializer, StreamDeserializer,
};
#[doc(inline)]
pub use crate::value::{
    from_value, get::get_by_schema, to_value, Array, JsonContainerTrait, JsonType,
    JsonValueMutTrait, JsonValueTrait, Object, Value, ValueRef,
};

// --- Torque patch: expose the native push-based visitor parse ---
pub use crate::value::visitor::JsonVisitor;

/// Parse `json` by driving the push-based [`JsonVisitor`] directly over the
/// original input slice (no padding copy), so the borrowed `&str` handed to
/// `visit_str` for unescaped strings points into `json`. Added for Torque's
/// fused term-building decoder.
pub fn parse_into_visitor<'de, V>(json: &'de [u8], visitor: &mut V) -> Result<()>
where
    V: JsonVisitor<'de>,
{
    let mut parser = crate::parser::Parser::new(Read::from(json));
    let mut strbuf = Vec::new();
    parser.parse_dom(visitor, Some(&mut strbuf), 0)?;
    parser.parse_trailing()
}

pub mod prelude;
