defmodule Torque.Native do
  @moduledoc false

  version = Mix.Project.config()[:version]

  use RustlerPrecompiled,
    otp_app: :torque,
    crate: "torque_nif",
    base_url: "https://github.com/lpgauth/torque/releases/download/v#{version}",
    force_build: System.get_env("TORQUE_BUILD") in ["1", "true"],
    targets: ~w(
      aarch64-apple-darwin
      aarch64-unknown-linux-gnu
      x86_64-apple-darwin
      x86_64-unknown-linux-gnu
    ),
    nif_versions: ["2.15"],
    version: version

  def parse(_json), do: :erlang.nif_error(:nif_not_loaded)
  def parse_dirty(_json), do: :erlang.nif_error(:nif_not_loaded)
  def get(_doc, _path), do: :erlang.nif_error(:nif_not_loaded)
  def get_many(_doc, _paths), do: :erlang.nif_error(:nif_not_loaded)
  def decode(_json), do: :erlang.nif_error(:nif_not_loaded)
  def decode_dirty(_json), do: :erlang.nif_error(:nif_not_loaded)
  def encode(_term), do: :erlang.nif_error(:nif_not_loaded)
  def encode_iodata(_term), do: :erlang.nif_error(:nif_not_loaded)
  def get_many_nil(_doc, _paths), do: :erlang.nif_error(:nif_not_loaded)
  def array_length(_doc, _path), do: :erlang.nif_error(:nif_not_loaded)
end
