mod atoms;
mod decoder;
mod encoder;
mod escape;
pub(crate) mod nif_util;
pub(crate) mod serde_decode;
mod types;

pub struct ParsedDocument {
    pub value: sonic_rs::Value,
}

#[rustler::resource_impl]
impl rustler::Resource for ParsedDocument {}

rustler::init!("Elixir.Torque.Native");
