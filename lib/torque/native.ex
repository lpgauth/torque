defmodule Torque.Native do
  @moduledoc false

  # rebar/fetch_nif.escript puts the library in priv/native, run by the
  # :torque_nif compiler (mix.exs) or rebar3's pre-compile hook.
  @on_load :load_nif

  @doc false
  def load_nif do
    path = Path.join(:code.priv_dir(:torque), "native/torque_nif")
    :erlang.load_nif(String.to_charlist(path), 0)
  end

  def parse(_json), do: :erlang.nif_error(:nif_not_loaded)
  def parse_dirty(_json), do: :erlang.nif_error(:nif_not_loaded)
  def parse_opts(_json, _unique_keys, _null, _missing), do: :erlang.nif_error(:nif_not_loaded)

  def parse_opts_dirty(_json, _unique_keys, _null, _missing),
    do: :erlang.nif_error(:nif_not_loaded)

  def get(_doc, _path), do: :erlang.nif_error(:nif_not_loaded)
  def get_many(_doc, _paths), do: :erlang.nif_error(:nif_not_loaded)
  def decode(_json), do: :erlang.nif_error(:nif_not_loaded)
  def decode_dirty(_json), do: :erlang.nif_error(:nif_not_loaded)
  def decode_opts(_json, _copy_strings, _null), do: :erlang.nif_error(:nif_not_loaded)
  def decode_opts_dirty(_json, _copy_strings, _null), do: :erlang.nif_error(:nif_not_loaded)
  def encode(_term), do: :erlang.nif_error(:nif_not_loaded)
  def encode_dirty(_term), do: :erlang.nif_error(:nif_not_loaded)
  def encode_opts(_term, _null, _indent), do: :erlang.nif_error(:nif_not_loaded)
  def encode_opts_dirty(_term, _null, _indent), do: :erlang.nif_error(:nif_not_loaded)
  def encode_iodata(_term), do: :erlang.nif_error(:nif_not_loaded)
  def encode_iodata_dirty(_term), do: :erlang.nif_error(:nif_not_loaded)
  def encode_iodata_opts(_term, _indent), do: :erlang.nif_error(:nif_not_loaded)
  def encode_iodata_opts_dirty(_term, _indent), do: :erlang.nif_error(:nif_not_loaded)
  def get_many_nil(_doc, _paths), do: :erlang.nif_error(:nif_not_loaded)

  def compile_paths(_paths, _unique_keys, _validate, _null, _missing),
    do: :erlang.nif_error(:nif_not_loaded)

  def get_many_nil_compiled(_doc, _compiled), do: :erlang.nif_error(:nif_not_loaded)
  def parse_get_many_nil(_json, _compiled), do: :erlang.nif_error(:nif_not_loaded)
  def parse_get_many_nil_dirty(_json, _compiled), do: :erlang.nif_error(:nif_not_loaded)
  def array_length(_doc, _path), do: :erlang.nif_error(:nif_not_loaded)
end
