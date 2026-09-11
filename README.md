# Torque

High-performance JSON library for Elixir via [Rustler](https://github.com/rustler-magic/rustler) NIFs, powered by [sonic-rs](https://github.com/cloudwego/sonic-rs) (SIMD-accelerated).

Torque provides the fastest JSON encoding and decoding available in the BEAM ecosystem, with a selective field extraction API for workloads that only need a subset of fields from each document.

## Features

- SIMD-accelerated decoding (AVX2 on x86, NEON on ARM)
- Ultra-low memory encoder (64 B per encode vs ~4 KB for OTP `json`/jason)
- Parse-then-get API for selective field extraction via JSON Pointer (RFC 6901,
  with one documented deviation: `"/"` selects the root, not the empty key)
- Batch field extraction (`get_many/2`) with single NIF call
- Pre-compiled pointers with fused parse + extract (`parse_get_many_nil/2`)
- Automatic dirty CPU scheduler dispatch for decode/parse inputs larger than 20 KB (opt-in `dirty: true` for encode)
- jiffy-compatible `{proplist}` encoding

## Installation

Add to your `mix.exs`:

```elixir
def deps do
  [
    {:torque, "~> 0.3.1"}
  ]
end
```

Precompiled binaries are available for common targets. To compile from source, install a stable Rust toolchain and set `TORQUE_BUILD=true`.

### CPU-optimized variants

On x86_64, precompiled binaries are available for three CPU feature levels:

| Variant | CPU features | `target-cpu` |
|---------|-------------|--------------|
| baseline | SSE2 | `x86-64` |
| v2 | SSE4.2, SSSE3, POPCNT | `x86-64-v2` |
| v3 | AVX2, AVX, BMI1, BMI2, FMA | `x86-64-v3` |

At compile time, Torque auto-detects the host CPU and downloads the best matching variant. To override detection (e.g., when cross-compiling for a different target):

```bash
TORQUE_CPU_VARIANT=v2 mix compile  # force SSE4.2 variant
TORQUE_CPU_VARIANT=v3 mix compile  # force AVX2 variant
TORQUE_CPU_VARIANT=base mix compile  # force baseline
```

## Usage

### Decoding

```elixir
{:ok, data} = Torque.decode(~s({"name":"Alice","age":30}))
# %{"name" => "Alice", "age" => 30}

data = Torque.decode!(json)
```

### Selective Field Extraction

Parse once, extract many fields without building the full Elixir term tree:

```elixir
{:ok, doc} = Torque.parse(json)

{:ok, "example.com"} = Torque.get(doc, "/site/domain")
nil = Torque.get(doc, "/missing/field", nil)

# Batch extraction (single NIF call, fastest path)
results = Torque.get_many(doc, ["/id", "/site/domain", "/device/ip"])
# [{:ok, "req-1"}, {:ok, "example.com"}, {:ok, "1.2.3.4"}]
```

When your JSON is known to have no duplicate object keys, pass `unique_keys: true`
for faster field lookups (uses sonic-rs internal indexing instead of linear scan):

```elixir
{:ok, doc} = Torque.parse(json, unique_keys: true)
```

### Compiled Pointers

When the same fixed set of paths is extracted from every document, compile the
pointers once and reuse the handle. `parse_get_many_nil/2` then reads the
document in a single pass, building values only where a path ends and skipping
everything else, without building an intermediate document. On a 1.2 KB bid
request with 26 fields that is ~1.35× the previous fused parse; with 3 paths
and `validate: false` (below) it is ~2.6×.

```elixir
# Once, at startup (e.g. into :persistent_term or application state; the
# handle is a NIF resource, so it cannot live in a module attribute):
pointers = Torque.compile_pointers(["/id", "/site/domain", "/imp/0/banner/w"], unique_keys: true)

# Per document — parse + extract in one call:
{:ok, ["req-1", "example.com", 300]} = Torque.parse_get_many_nil(json, pointers)
```

Missing fields and JSON `null` both become `nil`. The handle also works with an
already-parsed document via `Torque.get_many_nil(doc, pointers)`.

By default a malformed document is reported wherever the fault is, as `parse/2`
would report it, even in a region no path selects. `validate: false` skips
unselected regions with a structural bracket scan instead of tokenizing them,
but a malformed number, literal, or separator inside one of them goes
unreported, and so does anything after the document, which is therefore not
UTF-8 checked either. Truncated input, invalid UTF-8 in any byte the walk
consumed, and errors in selected values are still rejected. Use it only with
trusted input.

It is not a free speed-up. A bracket scan over 64-byte blocks beats tokenizing
a large subtree and loses to it on the few-byte scalars a dense path set leaves
behind, so the win tracks how little of the document the paths select. Three
paths out of a 2 KB request run ~3.6× faster unvalidated; 146 fields of the
same request run ~1.2× slower. Measure your own path set.

```elixir
pointers = Torque.compile_pointers(paths, unique_keys: true, validate: false)
```

### Encoding

```elixir
# Maps with atom or binary keys
{:ok, json} = Torque.encode(%{id: "abc", price: 1.5})
# "{\"id\":\"abc\",\"price\":1.5}"

# Integer keys are stringified — JSON object names must be strings
{:ok, json} = Torque.encode(%{0 => "a", 1 => "b"})
# "{\"0\":\"a\",\"1\":\"b\"}"

# Bang variant
json = Torque.encode!(%{id: "abc"})

# iodata variant (fastest, no {:ok, ...} tuple wrapping)
json = Torque.encode_to_iodata(%{id: "abc"})

# jiffy-compatible proplist format
{:ok, json} = Torque.encode({[{:id, "abc"}, {:price, 1.5}]})
```

Structs are rejected with `{:error, :unhandled_struct}` unless they implement
`Torque.Encoder`. Implement the protocol for custom types, or derive it to
encode a subset of fields:

```elixir
defimpl Torque.Encoder, for: Decimal do
  def encode(decimal), do: Decimal.to_string(decimal)
end

# or, on the struct itself:
@derive {Torque.Encoder, only: [:id, :name]}
defstruct [:id, :name, :secret]
```

Unlike decoding, encoding cannot cheaply predict its output size, so dirty
scheduler dispatch is opt-in. Pass `dirty: true` (accepted by `encode/2`,
`encode!/2`, `encode_to_iodata/2`, and `encode_to_iodata!/2`) when terms are
expected to encode to large output (more than roughly 20 KB):

```elixir
{:ok, json} = Torque.encode(big_term, dirty: true)
```

## API

| Function | Description |
|----------|-------------|
| `Torque.compile_pointers(paths, opts)` | Pre-compile a fixed path set into a reusable handle |
| `Torque.decode(binary)` | Decode JSON to Elixir terms |
| `Torque.decode!(binary)` | Decode JSON, raising on error |
| `Torque.encode(term, opts)` | Encode term to JSON binary |
| `Torque.encode!(term, opts)` | Encode term, raising on error |
| `Torque.encode_to_iodata(term, opts)` | Encode term, returns binary directly (fastest) |
| `Torque.encode_to_iodata!(term, opts)` | Alias for `encode_to_iodata/2` (Phoenix `:json_library`) |
| `Torque.get(doc, path)` | Extract field by JSON Pointer path |
| `Torque.get(doc, path, default)` | Extract field with default for missing paths |
| `Torque.get_many(doc, paths)` | Extract multiple fields in one NIF call |
| `Torque.get_many_nil(doc, paths)` | Extract multiple fields, `nil` for missing |
| `Torque.length(doc, path)` | Return length of array at path |
| `Torque.parse(binary, opts)` | Parse JSON into opaque document reference |
| `Torque.parse_get_many_nil(binary, pointers)` | Fused parse + extract of compiled pointers in one NIF call |

## Type Conversion

### JSON to Elixir

| JSON | Elixir |
|------|--------|
| object | map (binary keys) |
| array | list |
| string | binary |
| integer | integer |
| float | float |
| `true`, `false` | `true`, `false` |
| `null` | `nil` |

For objects with duplicate keys, the last value wins (unless `unique_keys: true` is passed to `parse/2`).

Integers outside the signed/unsigned 64-bit range decode as exact arbitrary-precision integers (Erlang bignums) via `decode/1`, rather than degrading to lossy floats. The `parse/2` + `get/2` path returns them as floats, since the parsed document cannot hold a bignum.

### Elixir to JSON

| Elixir | JSON |
|--------|------|
| map (atom/binary/integer keys) | object |
| list | array |
| binary | string |
| integer | number |
| float | number |
| `true`, `false` | `true`, `false` |
| `nil` | `null` |
| atom | string |
| `{keyword_list}` | object |

## Errors

Functions return `{:error, reason}` tuples (or raise `ArgumentError` for bang/iodata variants). Possible `reason` atoms:

### Decode / Parse

| Atom | Returned by | Meaning |
|------|-------------|---------|
| `:nesting_too_deep` | `decode/1`, `parse/1`, `get/2`, `get_many/2`, `parse_get_many_nil/2` | Document exceeds 128 nesting levels |

`parse/1`, `decode/1`, and `parse_get_many_nil/2` also return `{:error, binary}` with a message from sonic-rs for malformed JSON.

### Encode

| Atom | Returned by | Meaning |
|------|-------------|---------|
| `:unsupported_type` | `encode/1` | Term has no JSON representation (PID, reference, port, …) |
| `:invalid_utf8` | `encode/1` | Binary string or map key is not valid UTF-8 |
| `:invalid_key` | `encode/1` | Map key is not an atom, binary, or integer (e.g. float or tuple key) |
| `:malformed_proplist` | `encode/1` | `{proplist}` contains a non-`{key, value}` element |
| `:non_finite_float` | `encode/1` | Float is infinity or NaN (unreachable from normal BEAM code) |
| `:nesting_too_deep` | `encode/1` | Term exceeds 128 nesting levels |

## Benchmarks

Per-commit trends and the full cross-library comparison are published at
[lpgauth.github.io/torque/dev/bench](https://lpgauth.github.io/torque/dev/bench/).

Apple M1 Pro, OTP 29, Elixir 1.20. Both libraries are profile-guided
optimised (PGO) builds: **Torque PGO** (via `scripts/pgo-build.sh`) and
**Glazer PGO** (via `make -C deps/glazer/c_src PGO=generate`, the workload in
`bench/glazer_pgo_workload.exs`, then `PGO=use`). Every table below comes from
one run of `bench/torque_bench.exs`.

glazer is benchmarked with UTF-8 validation enabled (`validate_utf8` on
decode, `force_utf8` on encode — both off by default in glazer) so every
library provides the same guarantee Torque always does: JSON strings are
valid UTF-8.

### Decode (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **405.6K** | **2.47 μs** | **2.42 μs** | **2.79 μs** | 1.56 KB |
| **glazer** | 336.5K | 2.97 μs | 2.79 μs | 5.13 μs | 1.56 KB |
| **jiffy** | 204.9K | 4.88 μs | 4.58 μs | 9.21 μs | **1.55 KB** |
| **otp json** | 136.7K | 7.31 μs | 7.17 μs | 9.63 μs | 7.73 KB |
| **jason** | 103.5K | 9.66 μs | 9.25 μs | 12.67 μs | 9.54 KB |

### Decode (750 KB Twitter)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **719.2** | **1.39 ms** | **1.25 ms** | **1.88 ms** | **1.57 KB** |
| **glazer** | 591.4 | 1.69 ms | 1.61 ms | 2.06 ms | 1.58 KB |
| **jiffy** | 308.6 | 3.24 ms | 3.40 ms | 3.74 ms | 2.30 MB |
| **otp json** | 205.0 | 4.88 ms | 4.94 ms | 5.51 ms | 2.48 MB |
| **jason** | 135.0 | 7.41 ms | 7.42 ms | 7.74 ms | 3.54 MB |

### Encode (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** [proplist() :: iodata()] | **1430K** | **0.70 μs** | **0.63 μs** | 0.75 μs | **64 B** |
| **torque** [proplist() :: binary()] | 1420K | **0.70 μs** | **0.63 μs** | 0.79 μs | 88 B |
| **torque** [map() :: iodata()] | 1240K | 0.81 μs | 0.75 μs | 0.88 μs | **64 B** |
| **torque** [map() :: binary()] | 1220K | 0.82 μs | 0.75 μs | 0.96 μs | 88 B |
| **otp json** [map() :: iodata()] | 1100K | 0.91 μs | 0.83 μs | 1.13 μs | 3928 B |
| **glazer** [map() :: binary()] | 1000K | 1.00 μs | 0.88 μs | 2.38 μs | **64 B** |
| **jiffy** [proplist() :: iodata()] | 660K | 1.51 μs | 1.25 μs | 2.79 μs | 120 B |
| **jason** [map() :: iodata()] | 580K | 1.73 μs | 1.63 μs | 2.58 μs | 3848 B |
| **jiffy** [map() :: iodata()] | 560K | 1.79 μs | 1.54 μs | 3.08 μs | 824 B |
| **jason** [map() :: binary()] | 370K | 2.67 μs | 2.54 μs | 4.17 μs | 3912 B |

### Encode (750 KB Twitter)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** [proplist() :: iodata()] | **1631.3** | **0.61 ms** | **0.60 ms** | 0.70 ms | **64 B** |
| **torque** [proplist() :: binary()] | 1627.9 | **0.61 ms** | 0.61 ms | **0.68 ms** | 88 B |
| **torque** [map() :: iodata()] | 1432.7 | 0.70 ms | 0.68 ms | 0.80 ms | **64 B** |
| **torque** [map() :: binary()] | 1425.6 | 0.70 ms | 0.69 ms | 0.83 ms | 88 B |
| **glazer** [map() :: binary()] | 860.1 | 1.16 ms | 1.15 ms | 1.37 ms | **64 B** |
| **jiffy** [proplist() :: iodata()] | 494.8 | 2.02 ms | 1.96 ms | 3.78 ms | 37.7 KB |
| **jiffy** [map() :: iodata()] | 373.4 | 2.68 ms | 2.57 ms | 3.40 ms | 1.06 MB |
| **otp json** [map() :: iodata()] | 268.2 | 3.73 ms | 3.77 ms | 4.91 ms | 5.40 MB |
| **jason** [map() :: iodata()] | 220.7 | 4.53 ms | 4.18 ms | 6.84 ms | 4.96 MB |
| **jason** [map() :: binary()] | 113.1 | 8.84 ms | 8.86 ms | 9.71 ms | 4.96 MB |

### Parse (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse | **609.6K** | **1.64 μs** | **1.38 μs** | 2.92 μs |
| **torque** parse(unique_keys) | 599.0K | 1.67 μs | **1.38 μs** | **2.88 μs** |

### Extract 5 fields from raw JSON (1.2 KB OpenRTB)

End-to-end cost of pulling 5 fields out of a JSON blob: `parse` + `get`
(torque) vs `decode` + `find` (glazer has no lazy handle, so it must
fully decode first). This is the apples-to-apples version of "get" — torque's
selective extraction skips materializing the whole document.

`parse_get_many_nil` goes further. Given a handle compiled once at startup
(like glazer's compiled jq paths), it walks the document a single time and
builds a value only where a path ends, so no document is built at all.
`validate: false` also skips validating the regions no path selects, which on
a document this small is most of what is left.

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse_get_many_nil unique_keys validate: false | **1253K** | **0.80 μs** | **0.71 μs** | **0.88 μs** |
| **torque** parse_get_many_nil unique_keys | 694.3K | 1.44 μs | 1.42 μs | 1.58 μs |
| **torque** parse_get_many_nil | 688.1K | 1.45 μs | 1.42 μs | 1.58 μs |
| **torque** parse(unique_keys) + get_many | 493.9K | 2.02 μs | 1.79 μs | 3.75 μs |
| **torque** parse + get_many | 460.5K | 2.17 μs | 1.79 μs | 3.96 μs |
| **torque** parse + get x5 | 458.7K | 2.18 μs | 1.96 μs | 4.04 μs |
| **glazer** decode + find x5 | 316.8K | 3.16 μs | 3.08 μs | 3.54 μs |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Integer map keys are lossy**: JSON object names must be strings (RFC 8259 §4), so `encode/1` stringifies integer keys and `decode/1` gives them back as binaries — `%{1 => "a"}` round-trips to `%{"1" => "a"}`. A map mixing both forms, like `%{1 => "a", "1" => "b"}`, encodes to duplicate names (`{"1":"a","1":"b"}`); RFC 8259 says names *should* be unique, and decoders resolve the collision however they choose. Jason behaves identically.
- **Nesting depth**: JSON documents nested deeper than 128 levels return `{:error, :nesting_too_deep}` from `decode/1`, `parse/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF (the dirty CPU scheduler, used for inputs over 20 KB, has a small stack).

## License

MIT
