defmodule Torque do
  @moduledoc """
  High-performance JSON library powered by sonic-rs via Rustler NIFs.

  ## Decoding strategies

    * **Parse + Get** — `parse/2` returns an opaque document reference.
      `get/2`, `get/3`, `get_many/2`, and `get_many_nil/2` extract fields
      by JSON Pointer (RFC 6901) paths without materializing the full
      Elixir term tree. Ideal when only a subset of fields is needed.

    * **Full decode** — `decode/1` converts an entire JSON binary into
      Elixir terms in one pass.

  ## Encoding

  `encode/1` serializes Elixir terms to JSON. Supports maps (atom or
  binary keys), lists, binaries, numbers, booleans, `nil`, and
  jiffy-style `{proplist}` tuples.

  ## Scheduler awareness

  Inputs larger than 20 KB are automatically dispatched to a dirty CPU
  scheduler to avoid blocking normal BEAM schedulers.

  ## Type conversion

  | JSON | Elixir |
  |------|--------|
  | object | map with binary keys |
  | array | list |
  | string | binary |
  | integer | integer |
  | float | float |
  | `true` / `false` | `true` / `false` |
  | `null` | `nil` |

  For objects with duplicate keys, the last value wins (unless
  `unique_keys: true` is passed to `parse/2`).
  """

  @timeslice_bytes 20_480

  # --- Decoding ---

  @doc """
  Decodes a JSON binary into Elixir terms.

  JSON objects become maps with binary keys, arrays become lists, strings
  become binaries, numbers become integers or floats, booleans become
  `true`/`false`, and `null` becomes `nil`.

  Automatically uses a dirty CPU scheduler for inputs larger than 20 KB.

  ## Examples

      iex> Torque.decode(~s({"a":1,"b":"hello"}))
      {:ok, %{"a" => 1, "b" => "hello"}}

      iex> Torque.decode(~s([1,2,3]))
      {:ok, [1, 2, 3]}

      iex> match?({:error, _}, Torque.decode("invalid"))
      true
  """
  @doc group: :decode
  @spec decode(binary()) :: {:ok, term()} | {:error, binary() | :nesting_too_deep}
  def decode(json) when is_binary(json) and byte_size(json) > @timeslice_bytes do
    Torque.Native.decode_dirty(json)
  end

  def decode(json) when is_binary(json) do
    Torque.Native.decode(json)
  end

  @doc """
  Decodes a JSON binary into Elixir terms, raising on error.

  ## Examples

      iex> Torque.decode!(~s({"a":1}))
      %{"a" => 1}
  """
  @doc group: :decode
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

  ## Supported terms

    * Maps with atom or binary keys
    * Lists (JSON arrays)
    * Binaries (JSON strings)
    * Integers and floats
    * `true`, `false`, `nil` (JSON `null`)
    * Other atoms (encoded as JSON strings)
    * `{keyword_list}` tuples (jiffy-style proplist objects)

  ## Examples

      iex> Torque.encode(%{id: "abc", price: 1.5})
      {:ok, ~s({"id":"abc","price":1.5})}

      iex> Torque.encode({[{:id, "abc"}]})
      {:ok, ~s({"id":"abc"})}
  """
  @doc group: :encode
  @spec encode(term()) :: {:ok, binary()} | {:error, binary() | :nesting_too_deep}
  def encode(term) do
    Torque.Native.encode(term)
  end

  @doc """
  Encodes an Elixir term into a JSON binary, raising on error.

  ## Examples

      iex> Torque.encode!(%{ok: true})
      ~s({"ok":true})
  """
  @doc group: :encode
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

  ## Examples

      iex> Torque.encode_to_iodata(%{ok: true})
      ~s({"ok":true})
  """
  @doc group: :encode
  @spec encode_to_iodata(term()) :: binary()
  def encode_to_iodata(term) do
    Torque.Native.encode_iodata(term)
  catch
    :error, value -> raise ArgumentError, "encode error: #{inspect(value)}"
  end

  # --- Parse + Get ---

  @doc """
  Parses a JSON binary into an opaque document reference.

  The returned reference can be passed to `get/2`, `get/3`, `get_many/2`,
  `get_many_nil/2`, or `length/2` for efficient repeated field extraction
  without re-parsing.

  ## Options

    * `:unique_keys` — when `true`, assumes object keys are unique and uses
      a faster lookup path. Defaults to `false` (last-value-wins for
      duplicate keys).

  Automatically uses a dirty CPU scheduler for inputs larger than 20 KB.

  ## Examples

      iex> {:ok, doc} = Torque.parse(~s({"a":1}))
      iex> is_reference(doc)
      true

      iex> {:ok, doc} = Torque.parse(~s({"a":1}), unique_keys: true)
      iex> Torque.get(doc, "/a")
      {:ok, 1}
  """
  @doc group: :parse_get
  @spec parse(binary(), keyword()) :: {:ok, reference()} | {:error, binary()}
  def parse(json, opts \\ [])

  def parse(json, []) when is_binary(json) and byte_size(json) > @timeslice_bytes do
    Torque.Native.parse_dirty(json)
  end

  def parse(json, []) when is_binary(json) do
    Torque.Native.parse(json)
  end

  def parse(json, opts) when is_binary(json) and byte_size(json) > @timeslice_bytes do
    Torque.Native.parse_opts_dirty(json, Keyword.get(opts, :unique_keys, false))
  end

  def parse(json, opts) when is_binary(json) do
    Torque.Native.parse_opts(json, Keyword.get(opts, :unique_keys, false))
  end

  @doc """
  Extracts a value from a parsed document using a JSON Pointer path (RFC 6901).

  Paths must start with `"/"`. Array elements are addressed by index
  (e.g. `"/imp/0/banner/w"`). An empty path `""` returns the root value.

  ## Examples

      iex> {:ok, doc} = Torque.parse(~s({"site":{"domain":"example.com"}}))
      iex> Torque.get(doc, "/site/domain")
      {:ok, "example.com"}

      iex> {:ok, doc} = Torque.parse(~s({"site":{"domain":"example.com"}}))
      iex> Torque.get(doc, "/missing")
      {:error, :no_such_field}
  """
  @doc group: :parse_get
  @spec get(reference(), binary()) ::
          {:ok, term()} | {:error, :no_such_field | :nesting_too_deep}
  def get(doc, path) when is_reference(doc) and is_binary(path) do
    Torque.Native.get(doc, path)
  end

  @doc """
  Extracts a value from a parsed document, returning `default` when the path
  does not exist.

  Raises `ArgumentError` for errors other than `:no_such_field`
  (e.g. `:nesting_too_deep`).

  ## Examples

      iex> {:ok, doc} = Torque.parse(~s({"a":1}))
      iex> Torque.get(doc, "/a", nil)
      1

      iex> {:ok, doc} = Torque.parse(~s({"a":1}))
      iex> Torque.get(doc, "/b", :default)
      :default
  """
  @doc group: :parse_get
  @compile {:inline, get: 3}
  @spec get(reference(), binary(), term()) :: term()
  def get(doc, path, default) when is_reference(doc) and is_binary(path) do
    case Torque.Native.get(doc, path) do
      {:ok, value} -> value
      {:error, :no_such_field} -> default
      {:error, reason} -> raise ArgumentError, "get error: #{reason}"
    end
  end

  @doc """
  Extracts multiple values from a parsed document in a single NIF call.

  Returns a list of results in the same order as `paths`, each being
  `{:ok, value}` or `{:error, :no_such_field}`.

  More efficient than calling `get/2` in a loop because it crosses
  the NIF boundary only once.

  ## Examples

      iex> {:ok, doc} = Torque.parse(~s({"a":1,"b":2}))
      iex> Torque.get_many(doc, ["/a", "/b", "/c"])
      [{:ok, 1}, {:ok, 2}, {:error, :no_such_field}]
  """
  @doc group: :parse_get
  @spec get_many(reference(), [binary()]) ::
          [{:ok, term()} | {:error, :no_such_field | :nesting_too_deep}]
  def get_many(doc, paths) when is_reference(doc) and is_list(paths) do
    Torque.Native.get_many(doc, paths)
  end

  @doc """
  Extracts multiple values from a parsed document, returning `nil` for missing
  fields.

  Like `get_many/2` but returns bare values instead of `{:ok, value}` tuples.
  Missing fields return `nil` (indistinguishable from JSON `null`).

  Faster than `get_many/2` when you don't need to distinguish between
  missing fields and null values, as it avoids allocating wrapper tuples.

  ## Examples

      iex> {:ok, doc} = Torque.parse(~s({"a":1,"b":null}))
      iex> Torque.get_many_nil(doc, ["/a", "/b", "/c"])
      [1, nil, nil]
  """
  @doc group: :parse_get
  @spec get_many_nil(reference(), [binary()]) :: [term()]
  def get_many_nil(doc, paths) when is_reference(doc) and is_list(paths) do
    Torque.Native.get_many_nil(doc, paths)
  end

  @doc """
  Returns the length of an array at the given JSON Pointer path, or `nil` if
  the path does not exist or does not point to an array.

  ## Examples

      iex> {:ok, doc} = Torque.parse(~s({"a":[1,2,3]}))
      iex> Torque.length(doc, "/a")
      3

      iex> {:ok, doc} = Torque.parse(~s({"a":[1,2,3]}))
      iex> Torque.length(doc, "/missing")
      nil
  """
  @doc group: :parse_get
  @spec length(reference(), binary()) :: non_neg_integer() | nil
  def length(doc, path) when is_reference(doc) and is_binary(path) do
    Torque.Native.array_length(doc, path)
  end
end
