# Torque

High-performance JSON library for Elixir via [Rustler](https://github.com/rustler-magic/rustler) NIFs, powered by [sonic-rs](https://github.com/cloudwego/sonic-rs) (SIMD-accelerated).

Torque provides the fastest JSON encoding and decoding available in the BEAM ecosystem, with a selective field extraction API for workloads that only need a subset of fields from each document.

## Features

- SIMD-accelerated decoding (AVX2 on x86, NEON on ARM)
- Ultra-low memory encoder (64 B per encode vs ~4 KB for OTP `json`/jason)
- Parse-then-get API for selective field extraction via JSON Pointer (RFC 6901)
- Batch field extraction (`get_many/2`) with single NIF call
- Pre-compiled pointers with fused parse + extract (`parse_get_many_nil/2`)
- Automatic dirty CPU scheduler dispatch for decode/parse inputs larger than 20 KB (opt-in `dirty: true` for encode)
- jiffy-compatible `{proplist}` encoding

## Installation

Add to your `mix.exs`:

```elixir
def deps do
  [
    {:torque, "~> 0.2.7"}
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
pointers once and reuse the handle. `parse_get_many_nil/2` then fuses the parse
and extraction into a single NIF call, skipping all per-request path parsing —
roughly 1.5× faster end-to-end than `parse/2` + `get_many_nil/2`.

```elixir
# Once, at startup (e.g. a module attribute or :persistent_term):
pointers = Torque.compile_pointers(["/id", "/site/domain", "/imp/0/banner/w"], unique_keys: true)

# Per document — parse + extract in one call:
{:ok, ["req-1", "example.com", 300]} = Torque.parse_get_many_nil(json, pointers)
```

Missing fields and JSON `null` both become `nil`. The handle also works with an
already-parsed document via `Torque.get_many_nil(doc, pointers)`.

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

Apple M2 Pro, OTP 29, Elixir 1.20. Both libraries are profile-guided
optimised (PGO) builds: **Torque PGO** (via `scripts/pgo-build.sh`) and
**Glazer PGO** (via `OPTIMIZE=1`).

glazer is benchmarked with UTF-8 validation enabled (`validate_utf8` on
decode, `force_utf8` on encode — both off by default in glazer) so every
library provides the same guarantee Torque always does: JSON strings are
valid UTF-8.

### Decode (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **412.8K** | **2.42 μs** | **2.29 μs** | **4.67 μs** | 1.56 KB |
| **glazer** | 355.5K | 2.81 μs | 2.67 μs | 5.00 μs | 1.56 KB |
| **jiffy** | 200.0K | 5.00 μs | 4.50 μs | 11.00 μs | **1.55 KB** |
| **otp json** | 143.8K | 6.95 μs | 6.71 μs | 12.54 μs | 7.73 KB |
| **jason** | 109.0K | 9.17 μs | 8.54 μs | 20.58 μs | 9.54 KB |

### Decode (750 KB Twitter)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **659.4** | **1.52 ms** | **1.32 ms** | **2.14 ms** | **1.57 KB** |
| **glazer** | 597.0 | 1.68 ms | 1.59 ms | 2.26 ms | 1.58 KB |
| **jiffy** | 298.8 | 3.35 ms | 3.37 ms | 4.52 ms | 2.30 MB |
| **otp json** | 211.3 | 4.73 ms | 4.77 ms | 5.57 ms | 2.48 MB |
| **jason** | 150.2 | 6.66 ms | 6.59 ms | 8.21 ms | 3.54 MB |

### Encode (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **otp json** [map() :: iodata()] | **1174K** | **0.85 μs** | **0.79 μs** | 1.21 μs | 3928 B |
| **torque** [proplist() :: iodata()] | 1084K | 0.92 μs | 0.88 μs | **1.08 μs** | **64 B** |
| **torque** [proplist() :: binary()] | 1048K | 0.95 μs | 0.88 μs | 1.21 μs | 88 B |
| **torque** [map() :: iodata()] | 957K | 1.04 μs | 1.00 μs | 1.25 μs | **64 B** |
| **torque** [map() :: binary()] | 953K | 1.05 μs | 1.00 μs | 1.21 μs | 88 B |
| **glazer** [map() :: binary()] | 932K | 1.07 μs | 1.00 μs | 1.21 μs | **64 B** |
| **jiffy** [proplist() :: iodata()] | 654K | 1.53 μs | 1.33 μs | 1.88 μs | 120 B |
| **jason** [map() :: iodata()] | 598K | 1.67 μs | 1.54 μs | 3.21 μs | 3848 B |
| **jiffy** [map() :: iodata()] | 526K | 1.90 μs | 1.75 μs | 2.17 μs | 824 B |
| **jason** [map() :: binary()] | 401K | 2.49 μs | 2.33 μs | 4.63 μs | 3912 B |

### Encode (750 KB Twitter)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** [proplist() :: iodata()] | **1163.7** | **0.86 ms** | **0.84 ms** | **1.08 ms** | **64 B** |
| **torque** [proplist() :: binary()] | 1143.3 | 0.87 ms | **0.84 ms** | 1.44 ms | 88 B |
| **torque** [map() :: binary()] | 1056.0 | 0.95 ms | 0.93 ms | 1.15 ms | 88 B |
| **torque** [map() :: iodata()] | 1019.0 | 0.98 ms | 0.96 ms | 1.21 ms | **64 B** |
| **glazer** [map() :: binary()] | 843.9 | 1.19 ms | 1.17 ms | 1.38 ms | **64 B** |
| **jiffy** [proplist() :: iodata()] | 473.8 | 2.11 ms | 2.09 ms | 2.31 ms | 37.7 KB |
| **jiffy** [map() :: iodata()] | 357.1 | 2.80 ms | 2.95 ms | 3.26 ms | 1.06 MB |
| **otp json** [map() :: iodata()] | 270.5 | 3.70 ms | 3.93 ms | 4.77 ms | 5.40 MB |
| **jason** [map() :: iodata()] | 261.0 | 3.83 ms | 3.54 ms | 5.86 ms | 4.96 MB |
| **jason** [map() :: binary()] | 138.5 | 7.22 ms | 7.18 ms | 8.09 ms | 4.96 MB |

### Parse (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse(unique_keys) | **556.8K** | **1.80 μs** | 1.46 μs | **5.21 μs** |
| **torque** parse | 555.4K | **1.80 μs** | **1.42 μs** | **5.21 μs** |

### Extract 5 fields from raw JSON (1.2 KB OpenRTB)

End-to-end cost of pulling 5 fields out of a JSON blob: `parse` + `get`
(torque) vs `decode` + `find` (glazer has no lazy handle, so it must
fully decode first). This is the apples-to-apples version of "get" — torque's
selective extraction skips materializing the whole document.

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse(unique_keys) + get_many | **467.3K** | **2.14 μs** | **1.79 μs** | **4.79 μs** |
| **torque** parse + get_many | 455.1K | 2.20 μs | **1.79 μs** | 5.46 μs |
| **torque** parse + get x5 | 420.1K | 2.38 μs | 1.96 μs | 6.08 μs |
| **glazer** decode + find x5 | 315.1K | 3.17 μs | 3.04 μs | 4.88 μs |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Integer map keys are lossy**: JSON object names must be strings (RFC 8259 §4), so `encode/1` stringifies integer keys and `decode/1` gives them back as binaries — `%{1 => "a"}` round-trips to `%{"1" => "a"}`. A map mixing both forms, like `%{1 => "a", "1" => "b"}`, encodes to duplicate names (`{"1":"a","1":"b"}`); RFC 8259 says names *should* be unique, and decoders resolve the collision however they choose. Jason behaves identically.
- **Nesting depth**: JSON documents nested deeper than 128 levels return `{:error, :nesting_too_deep}` from `decode/1`, `parse/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF (the dirty CPU scheduler, used for inputs over 20 KB, has a small stack).

## License

MIT
