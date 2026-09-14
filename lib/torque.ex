defmodule Torque do
  @moduledoc """
  High-performance JSON library powered by sonic-rs via Rustler NIFs.

  ## Decoding strategies

    * **Parse + Get** — `parse/2` returns an opaque document reference.
      `get/2`, `get/3`, `get_many/2`, `get_many_nil/2` and
      `get_many_defaults/2` extract fields by JSON Pointer (RFC 6901) paths
      without materializing the full Elixir term tree. Ideal when the *same*
      document is queried more than once, which is what the handle is for.

    * **Compiled pointers** — when the same fixed set of paths is extracted
      from every document, `compile_pointers/2` pre-parses the paths once and
      `parse_get_many_nil/2` reads the document in a single pass, building
      values only where a path ends and skipping everything else. For one-shot
      extraction — parse a payload, take a few fields, discard it — prefer this
      over `parse/2` + `get/2`: it never builds the document it is about to
      throw away. That is worth ~1.4× on a request-shaped payload and fades to
      parity as the document grows, since on a large one the plan walk costs
      about what the document build it replaces did. The bigger lever is
      `validate: false` on the handle, worth ~7× on a 450 KB feed read through
      a handful of paths, but read its note in `compile_pointers/2` first: it
      is only a win when the paths select a small part of the document.

    * **Full decode** — `decode/1` converts an entire JSON binary into
      Elixir terms in one pass.

  ## Encoding

  `encode/1` serializes Elixir terms to JSON. Supports maps (atom,
  binary, or integer keys), lists, binaries, numbers, booleans, `nil`,
  and jiffy-style `{proplist}` tuples.

  Structs are rejected with `{:error, :unhandled_struct}` unless they
  implement `Torque.Encoder` (see the protocol docs for deriving with
  `:only` / `:except`). Torque ships implementations for `Date`, `Time`,
  `NaiveDateTime`, and `DateTime`, which encode as ISO 8601 strings.

  ## Scheduler awareness

  Decoding and parsing automatically dispatch inputs larger than 20 KB to a
  dirty CPU scheduler to avoid blocking normal BEAM schedulers. Encoding
  cannot cheaply predict its output size up front, so dirty dispatch is
  opt-in there: pass `dirty: true` to `encode/2`, `encode!/2`,
  `encode_to_iodata/2`, or `encode_to_iodata!/2` when terms are expected
  to produce large output.

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

  # Bounds protocol expansion, mirroring the NIF's own MAX_DEPTH
  # (native/torque_nif/src/types.rs). Only struct expansions decrement it, so
  # ordinary nesting still reaches the NIF, which owns the `:nesting_too_deep`
  # verdict. Without a bound, an implementation returning the struct itself,
  # or any term containing it, expands forever.
  @max_expansion_depth 128

  @typedoc """
  An opaque handle to a set of pre-compiled JSON Pointer paths, returned by
  `compile_pointers/2`. Pass it to `parse_get_many_nil/2` or `get_many_nil/2`
  in place of a path list to skip per-call path parsing.
  """
  @opaque pointers :: reference()

  # --- Decoding ---

  @doc """
  Decodes a JSON binary into Elixir terms.

  JSON objects become maps with binary keys, arrays become lists, strings
  become binaries, numbers become integers or floats, booleans become
  `true`/`false`, and `null` becomes `nil`.

  Integers outside the signed/unsigned 64-bit range decode as exact
  arbitrary-precision integers (Erlang bignums) rather than lossy floats.

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

    * Maps with atom, binary, or integer keys (integer keys are
      stringified — JSON object names must be strings)
    * Lists (JSON arrays)
    * Binaries (JSON strings)
    * Integers and floats
    * `true`, `false`, `nil` (JSON `null`)
    * Other atoms (encoded as JSON strings)
    * `{keyword_list}` tuples (jiffy-style proplist objects)
    * Structs implementing `Torque.Encoder` (any other struct fails
      with `{:error, :unhandled_struct}`). A `Torque.Encoder` implementation
      that expands the same struct again fails with
      `{:error, :encoder_expansion_too_deep}`.

  ## Options

    * `:dirty` — when `true`, runs the encode on a dirty CPU scheduler.
      Unlike `decode/1`, which dispatches on input byte size, encoding
      cannot cheaply predict its output size up front, so large encodes
      are opt-in. Enable when terms are expected to produce large output
      (more than roughly 20 KB). Defaults to `false`.

  Any other option raises `ArgumentError`.

  ## Examples

      iex> Torque.encode(%{id: "abc", price: 1.5})
      {:ok, ~s({"id":"abc","price":1.5})}

      iex> Torque.encode({[{:id, "abc"}]})
      {:ok, ~s({"id":"abc"})}

      iex> Torque.encode(%{id: "abc"}, dirty: true)
      {:ok, ~s({"id":"abc"})}
  """
  @doc group: :encode
  @spec encode(term(), keyword()) ::
          {:ok, binary()}
          | {:error,
             binary()
             | :nesting_too_deep
             | :unhandled_struct
             | :encoder_expansion_too_deep}
  def encode(term, opts \\ [])

  def encode(term, []) do
    case Torque.Native.encode(term) do
      {:error, :unhandled_struct} -> encode_retry(term, false)
      other -> other
    end
  end

  def encode(term, opts) do
    dirty = Keyword.validate!(opts, dirty: false)[:dirty]

    case encode_native(term, dirty) do
      {:error, :unhandled_struct} -> encode_retry(term, dirty)
      other -> other
    end
  end

  @doc """
  Encodes an Elixir term into a JSON binary, raising on error.

  Accepts the same options as `encode/2`.

  ## Examples

      iex> Torque.encode!(%{ok: true})
      ~s({"ok":true})
  """
  @doc group: :encode
  @spec encode!(term(), keyword()) :: binary()
  def encode!(term, opts \\ []) do
    case encode(term, opts) do
      {:ok, json} -> json
      {:error, reason} -> raise ArgumentError, "encode error: #{reason}"
    end
  end

  @doc """
  Encodes an Elixir term into a JSON binary (iodata-compatible).

  Returns the binary directly without `{:ok, ...}` tuple wrapping.
  Raises on error. This is the fastest encoding path when the result
  is passed directly to I/O (e.g. as an HTTP response body).

  Accepts the same options as `encode/2`. Structs go through
  `Torque.Encoder` exactly as they do there; a struct without an
  implementation raises `ArgumentError`.

  ## Examples

      iex> Torque.encode_to_iodata(%{ok: true})
      ~s({"ok":true})
  """
  @doc group: :encode
  @spec encode_to_iodata(term(), keyword()) :: binary()
  def encode_to_iodata(term, opts \\ [])

  def encode_to_iodata(term, []) do
    encode_iodata_native(term, false)
  catch
    :error, :unhandled_struct ->
      encode_iodata_retry(term, false)

    :error, value ->
      raise ArgumentError, "encode error: #{inspect(value)}"
  end

  def encode_to_iodata(term, opts) do
    dirty = Keyword.validate!(opts, dirty: false)[:dirty]

    try do
      encode_iodata_native(term, dirty)
    catch
      :error, :unhandled_struct ->
        encode_iodata_retry(term, dirty)

      :error, value ->
        raise ArgumentError, "encode error: #{inspect(value)}"
    end
  end

  @doc """
  Alias for `encode_to_iodata/2`, which already raises on error.

  Exists to satisfy Phoenix's `:json_library` contract, which calls
  `encode_to_iodata!/1` from its socket serializers, controllers, and
  longpoll transport. Set `config :phoenix, :json_library, Torque` to use
  Torque there.

  ## Examples

      iex> Torque.encode_to_iodata!(%{ok: true})
      ~s({"ok":true})
  """
  @doc group: :encode
  @spec encode_to_iodata!(term(), keyword()) :: binary()
  def encode_to_iodata!(term, opts \\ []), do: encode_to_iodata(term, opts)

  defp encode_native(term, dirty) do
    if dirty, do: Torque.Native.encode_dirty(term), else: Torque.Native.encode(term)
  end

  defp encode_retry(term, dirty) do
    case normalize(term) do
      {:ok, normalized} -> encode_native(normalized, dirty)
      {:error, reason} -> {:error, reason}
    end
  end

  defp encode_iodata_native(term, true), do: Torque.Native.encode_iodata_dirty(term)
  defp encode_iodata_native(term, false), do: Torque.Native.encode_iodata(term)

  # Retry path: a struct that still has no protocol implementation fails
  # with the same ArgumentError as every other encode error.
  defp encode_iodata_retry(term, dirty) do
    case normalize(term) do
      {:ok, normalized} -> encode_iodata_native_rescued(normalized, dirty)
      {:error, reason} -> raise ArgumentError, "encode error: #{reason}"
    end
  end

  defp encode_iodata_native_rescued(term, dirty) do
    encode_iodata_native(term, dirty)
  catch
    :error, value -> raise ArgumentError, "encode error: #{inspect(value)}"
  end

  # Returns `{:error, :encoder_expansion_too_deep}` rather than raising: `encode/2`
  # is a non-bang function and its callers, `encode!/2` included, expect a tuple.
  # The bound is thrown from deep inside the walk, where returning a result tuple
  # would mean threading it through every container helper.
  defp normalize(term) do
    {:ok, normalize(term, @max_expansion_depth)}
  catch
    :encoder_expansion_too_deep -> {:error, :encoder_expansion_too_deep}
  end

  defp normalize(%_{} = struct, depth) do
    # The bound lives inside this branch rather than in a clause guard: dialyzer
    # resolves `impl_for/1` against the implementations visible in this
    # application (only the Any fallback), so it treats the branch as dead and
    # reports any clause guard here as unreachable.
    if Torque.Encoder.impl_for(struct) != Torque.Encoder.Any do
      if depth <= 0 do
        throw(:encoder_expansion_too_deep)
      end

      normalize(Torque.Encoder.encode(struct), depth - 1)
    else
      struct
    end
  end

  defp normalize(list, depth) when is_list(list), do: normalize_list(list, depth)
  defp normalize(tuple, depth) when is_tuple(tuple), do: normalize_tuple(tuple, depth)
  defp normalize(map, depth) when is_map(map), do: normalize_map(map, depth)
  defp normalize(term, _depth), do: term

  # The container helpers below keep the original term whenever nothing inside
  # it changed. Struct-free subtrees are the common case in a payload that
  # contains one struct, and rebuilding them is what makes the retry expensive:
  # measured at roughly half to two thirds of normalize/1's total cost on
  # map-heavy input. `===` against the value we just normalized is free when
  # nothing changed — the BEAM compares equal pointers in constant time, so a
  # 100k-element list costs the same 7ns as a two-key map.

  defp normalize_list([head | tail] = list, depth) do
    new_head = normalize(head, depth)
    new_tail = normalize_list(tail, depth)

    if new_head === head and new_tail === tail do
      list
    else
      [new_head | new_tail]
    end
  end

  defp normalize_list([], _depth), do: []

  # Improper list tail: hand it back to normalize/2, which rejects it.
  defp normalize_list(other, depth), do: normalize(other, depth)

  defp normalize_tuple(tuple, depth) do
    size = tuple_size(tuple)

    if size == 0 do
      tuple
    else
      Enum.reduce(0..(size - 1), tuple, fn index, acc ->
        value = elem(tuple, index)

        case normalize(value, depth) do
          ^value -> acc
          new_value -> put_elem(acc, index, new_value)
        end
      end)
    end
  end

  defp normalize_map(map, depth) do
    Enum.reduce(map, map, fn {key, value}, acc ->
      case normalize(value, depth) do
        ^value -> acc
        new_value -> Map.put(acc, key, new_value)
      end
    end)
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

  Any other option raises `ArgumentError`.

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
  @spec parse(binary(), keyword()) :: {:ok, reference()} | {:error, binary() | :nesting_too_deep}
  def parse(json, opts \\ [])

  def parse(json, []) when is_binary(json) and byte_size(json) > @timeslice_bytes do
    Torque.Native.parse_dirty(json)
  end

  def parse(json, []) when is_binary(json) do
    Torque.Native.parse(json)
  end

  def parse(json, opts) when is_binary(json) and byte_size(json) > @timeslice_bytes do
    Torque.Native.parse_opts_dirty(json, unique_keys!(opts))
  end

  def parse(json, opts) when is_binary(json) do
    Torque.Native.parse_opts(json, unique_keys!(opts))
  end

  defp unique_keys!(opts), do: Keyword.validate!(opts, unique_keys: false)[:unique_keys]

  @doc """
  Extracts a value from a parsed document using a JSON Pointer path (RFC 6901).

  Paths must start with `"/"`. Array elements are addressed by index
  (e.g. `"/imp/0/banner/w"`). An empty path `""` returns the root value.

  One deviation from RFC 6901: `"/"` also returns the root value, where the
  RFC reads it as the member whose key is the empty string. Every pointer
  entry point in Torque agrees on that, and changing it would silently move
  existing callers' lookups, so it stands until a breaking release.

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
  the NIF boundary only once. For a request-shaped document you query once and
  then discard, `compile_pointers/2` + `parse_get_many_nil/2` is usually faster
  still, since it never builds the document at all, though that advantage
  narrows to nothing as the document grows.

  Raises `ArgumentError` if any path is not a valid UTF-8 binary.

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

  Accepts either a list of JSON Pointer path strings or a `t:pointers/0` handle
  built by `compile_pointers/2`. The compiled form skips all per-call path
  parsing and is the recommended option for a fixed, repeatedly-queried path
  set.

  Raises `ArgumentError` if any path is not a valid UTF-8 binary.

  ## Examples

      iex> {:ok, doc} = Torque.parse(~s({"a":1,"b":null}))
      iex> Torque.get_many_nil(doc, ["/a", "/b", "/c"])
      [1, nil, nil]

      iex> {:ok, doc} = Torque.parse(~s({"a":1,"b":null}))
      iex> ptrs = Torque.compile_pointers(["/a", "/b", "/c"])
      iex> Torque.get_many_nil(doc, ptrs)
      [1, nil, nil]
  """
  @doc group: :parse_get
  @spec get_many_nil(reference(), [binary()] | pointers()) :: [term()]
  def get_many_nil(doc, paths) when is_reference(doc) and is_list(paths) do
    Torque.Native.get_many_nil(doc, paths)
  end

  def get_many_nil(doc, pointers) when is_reference(doc) and is_reference(pointers) do
    Torque.Native.get_many_nil_compiled(doc, pointers)
  end

  @doc """
  Pre-compiles a list of JSON Pointer paths into a reusable handle.

  Workloads that parse many documents and extract the *same* fixed set of fields
  re-split and unescape those pointer strings on every call — wasted work, since
  they never change. `compile_pointers/2` does it once and returns an opaque
  `t:pointers/0` handle that `parse_get_many_nil/2` and `get_many_nil/2` accept
  in place of a path list, eliminating all per-call path parsing (≈2× faster
  extraction on a typical field set).

  Compile once at startup (e.g. into `:persistent_term`, application state or
  the process holding the documents) and reuse the handle for every document.
  A `t:pointers/0` is a NIF resource reference, so it cannot be built at
  compile time into a module attribute.

  Raises `ArgumentError` if any path is not a valid UTF-8 binary or JSON Pointer.
  A JSON Pointer is either empty or begins with `/`.

  ## Options

    * `:unique_keys` — when `true`, object key lookups use a forward scan that
      stops at the first match (faster). Defaults to `false` (reverse scan,
      last-value-wins for duplicate keys), matching `parse/2`. Safe to enable
      when keys are known to be unique.

    * `:validate` — controls validation of regions not selected by any path.
      The default, `true`, reports malformed input anywhere in the document.
      When `false`, unselected regions are skipped without syntax validation;
      selected values and every byte the walk consumes are still validated,
      UTF-8 included. The check for content *after* the document is skipped
      too, so `~s({"a":1} junk)` succeeds where `decode/1` and the default
      reject it, and trailing bytes are not UTF-8 checked either, being bytes
      the walk never reached. Truncated input is still rejected, because
      skipping has to find the closing delimiter. Use it only with trusted
      input.

      Measure before enabling it. Skipping a region structurally is a bracket
      scan over 64-byte blocks, which beats tokenizing a large subtree and
      loses to it on the few-byte scalars left over when the paths select most
      of the document. Reading 3 paths out of a 2 KB request is ~3.6× faster
      unvalidated; reading 146 of its fields is ~1.2× *slower*.

  Any other option raises `ArgumentError`.

  Extraction results are returned in the same order as `paths`.

  ## Examples

      iex> ptrs = Torque.compile_pointers(["/a", "/b/0"], unique_keys: true)
      iex> {:ok, doc} = Torque.parse(~s({"a":1,"b":[2,3]}))
      iex> Torque.get_many_nil(doc, ptrs)
      [1, 2]
  """
  @doc group: :parse_get
  @spec compile_pointers([binary()], keyword()) :: pointers()
  def compile_pointers(paths, opts \\ []) when is_list(paths) do
    opts = Keyword.validate!(opts, unique_keys: false, validate: true)
    Torque.Native.compile_paths(paths, opts[:unique_keys], opts[:validate])
  end

  @doc """
  Parses a JSON binary and extracts pre-compiled pointers in a single NIF call.

  Fuses `parse/2` and `get_many_nil/2` for the common parse-once-extract-once
  case: it walks the document once, building a value only where a compiled
  pointer ends and skipping the rest, without materializing a document, a
  reusable handle, or a second NIF boundary crossing. Missing fields and JSON
  `null` both become `nil`. Both the lookup strategy (`:unique_keys`) and the
  validation policy (`:validate`) come from the `t:pointers/0` handle.

  Returns `{:ok, values}` (in the same order as the paths given to
  `compile_pointers/2`) or `{:error, reason}` if the JSON is malformed. A
  handle compiled with `validate: false` reports faults only in the regions it
  reads, so some malformed documents return `{:ok, values}` instead — see
  `compile_pointers/2`. Automatically uses a dirty CPU scheduler for inputs
  larger than 20 KB.

  ## Examples

      iex> ptrs = Torque.compile_pointers(["/id", "/site/domain", "/missing"])
      iex> Torque.parse_get_many_nil(~s({"id":"x","site":{"domain":"e.com"}}), ptrs)
      {:ok, ["x", "e.com", nil]}

      iex> ptrs = Torque.compile_pointers(["/a"])
      iex> match?({:error, _}, Torque.parse_get_many_nil("not json", ptrs))
      true
  """
  @doc group: :parse_get
  @spec parse_get_many_nil(binary(), pointers()) ::
          {:ok, [term()]} | {:error, binary() | :nesting_too_deep}
  def parse_get_many_nil(json, pointers)
      when is_binary(json) and is_reference(pointers) and byte_size(json) > @timeslice_bytes do
    Torque.Native.parse_get_many_nil_dirty(json, pointers)
  end

  def parse_get_many_nil(json, pointers) when is_binary(json) and is_reference(pointers) do
    Torque.Native.parse_get_many_nil(json, pointers)
  end

  @doc """
  Extracts multiple values from a parsed document with per-path defaults.

  Takes a map of `%{path => default}` and returns a map of the same shape
  where each value is either the parsed value or the supplied default (if
  the path is missing).

  More ergonomic than the two-call `get_many_nil/2` + `Enum.map` pattern
  when consumers need defaults at the call site.

  Equivalent to:

      get_many_nil(doc, Map.keys(defaults))
      |> then(&Enum.zip(Map.keys(defaults), &1))
      |> Map.new(fn {p, nil} -> {p, Map.get(defaults, p)}; pv -> pv end)

  Note: a parsed JSON `null` at the path is indistinguishable from a missing
  field (same as `get_many_nil/2`) — both substitute the default.

  ## Examples

      iex> {:ok, doc} = Torque.parse(~s({"a":1,"b":null}))
      iex> Torque.get_many_defaults(doc, %{"/a" => 0, "/b" => 0, "/c" => "missing"})
      %{"/a" => 1, "/b" => 0, "/c" => "missing"}
  """
  @doc group: :parse_get
  @spec get_many_defaults(reference(), %{binary() => term()}) ::
          %{binary() => term()}
  def get_many_defaults(doc, defaults)
      when is_reference(doc) and is_map(defaults) do
    paths = Map.keys(defaults)
    values = Torque.Native.get_many_nil(doc, paths)

    paths
    |> Enum.zip(values)
    |> Map.new(fn
      {path, nil} -> {path, Map.get(defaults, path)}
      pv -> pv
    end)
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
