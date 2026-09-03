defmodule Torque.Native do
  @moduledoc false

  version = Mix.Project.config()[:version]

  # `Torque.Build` owns this flag so that switching TORQUE_BUILD recompiles
  # this module; see the note there.
  use RustlerPrecompiled,
    otp_app: :torque,
    crate: "torque_nif",
    base_url: "https://github.com/lpgauth/torque/releases/download/v#{version}",
    force_build: Torque.Build.force_build?(),
    targets: ~w(
      aarch64-apple-darwin
      aarch64-unknown-linux-gnu
      x86_64-apple-darwin
      x86_64-unknown-linux-gnu
    ),
    nif_versions: ["2.15"],
    version: version,
    variants: %{
      "x86_64-unknown-linux-gnu" => [
        v3: &Torque.CPU.avx2?/0,
        v2: &Torque.CPU.sse42?/0
      ],
      "x86_64-apple-darwin" => [
        v3: &Torque.CPU.avx2?/0,
        v2: &Torque.CPU.sse42?/0
      ]
    }

  def parse(_json), do: :erlang.nif_error(:nif_not_loaded)
  def parse_dirty(_json), do: :erlang.nif_error(:nif_not_loaded)
  def parse_opts(_json, _unique_keys), do: :erlang.nif_error(:nif_not_loaded)
  def parse_opts_dirty(_json, _unique_keys), do: :erlang.nif_error(:nif_not_loaded)
  def get(_doc, _path), do: :erlang.nif_error(:nif_not_loaded)
  def get_many(_doc, _paths), do: :erlang.nif_error(:nif_not_loaded)
  def decode(_json), do: :erlang.nif_error(:nif_not_loaded)
  def decode_dirty(_json), do: :erlang.nif_error(:nif_not_loaded)
  def encode(_term), do: :erlang.nif_error(:nif_not_loaded)
  def encode_dirty(_term), do: :erlang.nif_error(:nif_not_loaded)
  def encode_iodata(_term), do: :erlang.nif_error(:nif_not_loaded)
  def encode_iodata_dirty(_term), do: :erlang.nif_error(:nif_not_loaded)
  def get_many_nil(_doc, _paths), do: :erlang.nif_error(:nif_not_loaded)
  def compile_paths(_paths, _unique_keys), do: :erlang.nif_error(:nif_not_loaded)
  def get_many_nil_compiled(_doc, _compiled), do: :erlang.nif_error(:nif_not_loaded)
  def parse_get_many_nil(_json, _compiled), do: :erlang.nif_error(:nif_not_loaded)
  def parse_get_many_nil_dirty(_json, _compiled), do: :erlang.nif_error(:nif_not_loaded)
  def array_length(_doc, _path), do: :erlang.nif_error(:nif_not_loaded)
end
