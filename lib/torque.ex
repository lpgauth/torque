defmodule Torque do
  @moduledoc """
  High-performance JSON library powered by sonic-rs via Rustler NIFs.

  Provides two decoding strategies:

    * **Parse + Get** — `parse/1` followed by `get/2,3` or `get_many/2` for
      selective field extraction via JSON Pointer (RFC 6901) paths. Ideal when
      only a subset of fields is needed.

    * **Full decode** — `decode/1` converts an entire JSON binary into Elixir
      terms in one pass.

  And encoding:

    * `encode/1` serializes Elixir terms to JSON. Supports maps (atom or binary
      keys), lists, binaries, numbers, booleans, `nil`, and jiffy-style
      `{proplist}` tuples.

  Inputs larger than 10 KB are automatically scheduled on a dirty CPU scheduler
  to avoid blocking normal BEAM schedulers.
  """

  @timeslice_bytes 10_240

  # --- Decoding ---

  @doc """
  Parses a JSON binary into an opaque document reference.

  The returned reference can be passed to `get/2`, `get/3`, or `get_many/2`
  for efficient repeated field extraction without re-parsing.

  Automatically uses a dirty CPU scheduler for inputs larger than 10 KB.
  """
  @spec parse(binary()) :: {:ok, reference()} | {:error, binary()}
  def parse(json) when is_binary(json) and byte_size(json) > @timeslice_bytes do
    Torque.Native.parse_dirty(json)
  end

  def parse(json) when is_binary(json) do
    Torque.Native.parse(json)
  end

  @doc """
  Extracts a value from a parsed document using a JSON Pointer path (RFC 6901).

  Paths must start with `"/"`. Array elements are addressed by index
  (e.g. `"/imp/0/banner/w"`).

  ## Examples

      {:ok, doc} = Torque.parse(~s({"site":{"domain":"example.com"}}))
      {:ok, "example.com"} = Torque.get(doc, "/site/domain")
      {:error, :no_such_field} = Torque.get(doc, "/missing")
  """
  @spec get(reference(), binary()) :: {:ok, term()} | {:error, :no_such_field}
  def get(doc, path) when is_reference(doc) and is_binary(path) do
    Torque.Native.get(doc, path)
  end

  @doc """
  Extracts a value from a parsed document, returning `default` when the path
  does not exist.

  ## Examples

      {:ok, doc} = Torque.parse(~s({"a":1}))
      1 = Torque.get(doc, "/a", nil)
      nil = Torque.get(doc, "/b", nil)
  """
  @compile {:inline, get: 3}
  @spec get(reference(), binary(), term()) :: term()
  def get(doc, path, default) when is_reference(doc) and is_binary(path) do
    case Torque.Native.get(doc, path) do
      {:ok, value} -> value
      {:error, :no_such_field} -> default
    end
  end

  @doc """
  Extracts multiple values from a parsed document in a single NIF call.

  Returns a list of results in the same order as `paths`, each being
  `{:ok, value}` or `{:error, :no_such_field}`.

  This is more efficient than calling `get/2` in a loop because it crosses
  the NIF boundary only once.

  ## Examples

      {:ok, doc} = Torque.parse(~s({"a":1,"b":2}))
      [{:ok, 1}, {:ok, 2}, {:error, :no_such_field}] =
        Torque.get_many(doc, ["/a", "/b", "/c"])
  """
  @spec get_many(reference(), [binary()]) :: [{:ok, term()} | {:error, :no_such_field}]
  def get_many(doc, paths) when is_reference(doc) and is_list(paths) do
    Torque.Native.get_many(doc, paths)
  end

  @doc """
  Extracts multiple values from a parsed document, returning `nil` for missing fields.

  Like `get_many/2` but returns bare values instead of `{:ok, value}` tuples.
  Missing fields return `nil` (indistinguishable from JSON `null`).

  This is faster than `get_many/2` when you don't need to distinguish between
  missing fields and null values, as it avoids allocating wrapper tuples.

  ## Examples

      {:ok, doc} = Torque.parse(~s({"a":1,"b":null}))
      [1, nil, nil] = Torque.get_many_nil(doc, ["/a", "/b", "/c"])
  """
  @spec get_many_nil(reference(), [binary()]) :: [term()]
  def get_many_nil(doc, paths) when is_reference(doc) and is_list(paths) do
    Torque.Native.get_many_nil(doc, paths)
  end

  @doc """
  Returns the length of an array at the given JSON Pointer path, or `nil` if
  the path does not exist or does not point to an array.

  ## Examples

      {:ok, doc} = Torque.parse(~s({"a":[1,2,3]}))
      3 = Torque.length(doc, "/a")
      nil = Torque.length(doc, "/missing")
  """
  @spec length(reference(), binary()) :: non_neg_integer() | nil
  def length(doc, path) when is_reference(doc) and is_binary(path) do
    Torque.Native.array_length(doc, path)
  end

  @doc """
  Decodes a JSON binary into Elixir terms.

  JSON objects become maps with binary keys, arrays become lists, strings become
  binaries, numbers become integers or floats, booleans become `true`/`false`,
  and `null` becomes `nil`.

  Automatically uses a dirty CPU scheduler for inputs larger than 10 KB.
  """
  @spec decode(binary()) :: {:ok, term()} | {:error, binary()}
  def decode(json) when is_binary(json) and byte_size(json) > @timeslice_bytes do
    Torque.Native.decode_dirty(json)
  end

  def decode(json) when is_binary(json) do
    Torque.Native.decode(json)
  end

  @doc """
  Decodes a JSON binary into Elixir terms, raising on error.
  """
  @spec decode!(binary()) :: term()
  def decode!(json) when is_binary(json) do
    case decode(json) do
      {:ok, term} -> term
      {:error, reason} -> raise ArgumentError, "decode error: #{reason}"
    end
  end

  # --- Encoding ---

  @doc """
  Encodes an Elixir term into a JSON binary.

  Supported terms:

    * Maps with atom or binary keys
    * Lists (JSON arrays)
    * Binaries (JSON strings)
    * Integers and floats
    * `true`, `false`, `nil` (JSON `null`)
    * Other atoms (encoded as JSON strings)
    * `{keyword_list}` tuples (jiffy-style proplist objects)
  """
  @spec encode(term()) :: {:ok, binary()} | {:error, binary()}
  def encode(term) do
    Torque.Native.encode(term)
  end

  @doc """
  Encodes an Elixir term into a JSON binary, raising on error.
  """
  @spec encode!(term()) :: binary()
  def encode!(term) do
    case encode(term) do
      {:ok, json} -> json
      {:error, reason} -> raise ArgumentError, "encode error: #{reason}"
    end
  end

  @doc """
  Encodes an Elixir term into a JSON binary (iodata-compatible).

  Returns the binary directly without `{:ok, ...}` tuple wrapping.
  Raises on error. This is the fastest encoding path when the result
  is passed directly to I/O (e.g. as an HTTP response body).
  """
  @spec encode_to_iodata(term()) :: binary()
  def encode_to_iodata(term) do
    Torque.Native.encode_iodata(term)
  catch
    :error, value -> raise ArgumentError, "encode error: #{inspect(value)}"
  end
end
