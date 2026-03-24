# Torque

High-performance JSON library for Elixir via [Rustler](https://github.com/rustler-magic/rustler) NIFs, powered by [sonic-rs](https://github.com/cloudwego/sonic-rs) (SIMD-accelerated).

Torque provides the fastest JSON encoding and decoding available in the BEAM ecosystem, with a selective field extraction API for workloads that only need a subset of fields from each document.

## Features

- SIMD-accelerated decoding (AVX2/SSE4.2 on x86, NEON on ARM)
- Ultra-low memory encoder (64 B per encode vs ~4 KB for OTP `json`/jason)
- Parse-then-get API for selective field extraction via JSON Pointer (RFC 6901)
- Batch field extraction (`get_many/2`) with single NIF call
- Automatic dirty CPU scheduler dispatch for inputs larger than 20 KB
- jiffy-compatible `{proplist}` encoding

## Installation

Add to your `mix.exs`:

```elixir
def deps do
  [
    {:torque, "~> 0.1.7"}
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

### Encoding

```elixir
# Maps with atom or binary keys
{:ok, json} = Torque.encode(%{id: "abc", price: 1.5})
# "{\"id\":\"abc\",\"price\":1.5}"

# Bang variant
json = Torque.encode!(%{id: "abc"})

# iodata variant (fastest, no {:ok, ...} tuple wrapping)
json = Torque.encode_to_iodata(%{id: "abc"})

# jiffy-compatible proplist format
{:ok, json} = Torque.encode({[{:id, "abc"}, {:price, 1.5}]})
```

## API

| Function | Description |
|----------|-------------|
| `Torque.decode(binary)` | Decode JSON to Elixir terms |
| `Torque.decode!(binary)` | Decode JSON, raising on error |
| `Torque.parse(binary)` | Parse JSON into opaque document reference |
| `Torque.get(doc, path)` | Extract field by JSON Pointer path |
| `Torque.get(doc, path, default)` | Extract field with default for missing paths |
| `Torque.get_many(doc, paths)` | Extract multiple fields in one NIF call |
| `Torque.get_many_nil(doc, paths)` | Extract multiple fields, `nil` for missing |
| `Torque.length(doc, path)` | Return length of array at path |
| `Torque.encode(term)` | Encode term to JSON binary |
| `Torque.encode!(term)` | Encode term, raising on error |
| `Torque.encode_to_iodata(term)` | Encode term, returns binary directly (fastest) |

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

For objects with duplicate keys, the last value wins.

### Elixir to JSON

| Elixir | JSON |
|--------|------|
| map (atom/binary keys) | object |
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
| `:nesting_too_deep` | `decode/1`, `get/2`, `get_many/2` | Document exceeds 512 nesting levels |

`parse/1` and `decode/1` also return `{:error, binary}` with a message from sonic-rs for malformed JSON.

### Encode

| Atom | Returned by | Meaning |
|------|-------------|---------|
| `:unsupported_type` | `encode/1` | Term has no JSON representation (PID, reference, port, …) |
| `:invalid_utf8` | `encode/1` | Binary string or map key is not valid UTF-8 |
| `:invalid_key` | `encode/1` | Map key is not an atom or binary (e.g. integer key) |
| `:malformed_proplist` | `encode/1` | `{proplist}` contains a non-`{key, value}` element |
| `:non_finite_float` | `encode/1` | Float is infinity or NaN (unreachable from normal BEAM code) |
| `:nesting_too_deep` | `encode/1` | Term exceeds 512 nesting levels |

## Benchmarks

Apple M2 Pro, OTP 28, Elixir 1.19:

### Decode (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **257.2K** | **3.89 μs** | **3.67 μs** | **8.17 μs** | **1.56 KB** |
| **simdjsone** | 170.0K | 5.88 μs | 5.13 μs | 14.75 μs | 1.59 KB |
| **jiffy** | 146.1K | 6.85 μs | 6.00 μs | 17.08 μs | **1.56 KB** |
| **otp json** | 127.2K | 7.86 μs | 7.29 μs | 18.00 μs | 7.73 KB |
| **jason** | 107.7K | 9.29 μs | 8.71 μs | 18.08 μs | 9.54 KB |

### Decode (750 KB Twitter)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **505.0** | **1.98 ms** | **1.82 ms** | **2.58 ms** | **1.56 KB** |
| **simdjsone** | 415.3 | 2.41 ms | 1.90 ms | 3.82 ms | **1.56 KB** |
| **otp json** | 182.5 | 5.48 ms | 5.45 ms | 6.58 ms | 2.49 MB |
| **jason** | 136.8 | 7.31 ms | 7.13 ms | 12.29 ms | 3.55 MB |
| **jiffy** | 100.7 | 9.93 ms | 10.01 ms | 11.91 ms | 5.53 MB |

### Encode (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** [proplist() :: binary()] | **1274.3K** | **0.78 μs** | **0.71 μs** | **0.92 μs** | 88 B |
| **torque** [proplist() :: iodata()] | 1261.4K | 0.79 μs | **0.71 μs** | 0.96 μs | **64 B** |
| **otp json** [map() :: iodata()] | 1078.0K | 0.93 μs | 0.88 μs | 1.38 μs | 3928 B |
| **torque** [map() :: iodata()] | 1064.8K | 0.94 μs | 0.88 μs | 1.13 μs | **64 B** |
| **torque** [map() :: binary()] | 1053.1K | 0.95 μs | 0.88 μs | 1.17 μs | 88 B |
| **jason** [map() :: iodata()] | 591.3K | 1.69 μs | 1.50 μs | 3.54 μs | 3848 B |
| **jiffy** [proplist() :: iodata()] | 579.2K | 1.73 μs | 1.50 μs | 2.13 μs | 120 B |
| **jiffy** [map() :: iodata()] | 498.1K | 2.01 μs | 1.83 μs | 2.50 μs | 824 B |
| **simdjsone** [proplist() :: iodata()] | 441.6K | 2.26 μs | 2.00 μs | 3.71 μs | 184 B |
| **jason** [map() :: binary()] | 399.7K | 2.50 μs | 2.33 μs | 4.21 μs | 3912 B |
| **simdjsone** [map() :: iodata()] | 386.7K | 2.59 μs | 2.38 μs | 4.54 μs | 888 B |

### Encode (750 KB Twitter)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** [proplist() :: iodata()] | **1272.5** | **0.79 ms** | **0.76 ms** | **0.99 ms** | **64 B** |
| **torque** [proplist() :: binary()] | 1252.1 | 0.80 ms | 0.77 ms | 1.04 ms | 88 B |
| **torque** [map() :: iodata()] | 1102.9 | 0.91 ms | 0.89 ms | 1.09 ms | **64 B** |
| **torque** [map() :: binary()] | 1084.0 | 0.92 ms | 0.89 ms | 1.20 ms | 88 B |
| **jiffy** [proplist() :: iodata()] | 342.0 | 2.92 ms | 2.82 ms | 4.75 ms | 37.7 KB |
| **jiffy** [map() :: iodata()] | 287.1 | 3.48 ms | 3.32 ms | 4.29 ms | 1.06 MB |
| **simdjsone** [proplist() :: iodata()] | 259.7 | 3.85 ms | 3.78 ms | 5.79 ms | 37.7 KB |
| **jason** [map() :: iodata()] | 241.3 | 4.14 ms | 3.94 ms | 6.99 ms | 4.96 MB |
| **simdjsone** [map() :: iodata()] | 216.1 | 4.63 ms | 4.66 ms | 6.51 ms | 1.06 MB |
| **otp json** [map() :: iodata()] | 200.2 | 4.99 ms | 5.10 ms | 6.97 ms | 5.40 MB |
| **jason** [map() :: binary()] | 130.9 | 7.64 ms | 7.53 ms | 9.09 ms | 4.96 MB |

### Parse + Get (5 fields) (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** parse+get_many_nil | **455.8K** | **2.19 μs** | **1.75 μs** | **6.21 μs** | **288 B** |
| **torque** parse+get_many | 431.6K | 2.32 μs | 1.75 μs | 6.33 μs | 408 B |
| **torque** parse+get | 415.5K | 2.41 μs | 1.96 μs | 7.13 μs | 432 B |
| **simdjsone** parse+get | 353.8K | 2.83 μs | 1.71 μs | 7.25 μs | 408 B |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Nesting depth**: JSON documents nested deeper than 512 levels return `{:error, :nesting_too_deep}` from `decode/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF.

## License

MIT
