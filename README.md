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
    {:torque, "~> 0.1.8"}
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
| `Torque.parse(binary, opts)` | Parse JSON into opaque document reference |
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

For objects with duplicate keys, the last value wins (unless `unique_keys: true` is passed to `parse/2`).

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
| **torque** | **262.5K** | **3.81 μs** | **3.63 μs** | **7.83 μs** | **1.56 KB** |
| **simdjsone** | 182.7K | 5.47 μs | 5.13 μs | 11.88 μs | 1.59 KB |
| **jiffy** | 144.6K | 6.92 μs | 6.21 μs | 17.17 μs | **1.56 KB** |
| **otp json** | 129.6K | 7.72 μs | 7.21 μs | 16.50 μs | 7.73 KB |
| **jason** | 103.6K | 9.65 μs | 8.71 μs | 22.75 μs | 9.54 KB |

### Decode (750 KB Twitter)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **476.0** | **2.10 ms** | **1.87 ms** | **4.73 ms** | **1.56 KB** |
| **simdjsone** | 459.4 | 2.18 ms | 1.85 ms | 3.20 ms | **1.56 KB** |
| **otp json** | 195.1 | 5.13 ms | 5.12 ms | 6.16 ms | 2.49 MB |
| **jason** | 142.0 | 7.04 ms | 6.91 ms | 11.47 ms | 3.55 MB |
| **jiffy** | 115.9 | 8.63 ms | 8.72 ms | 9.94 ms | 5.53 MB |

### Encode (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **otp json** [map() :: iodata()] | **1091.6K** | **0.92 μs** | **0.83 μs** | 1.46 μs | 3928 B |
| **torque** [proplist() :: binary()] | 1073.6K | 0.93 μs | 0.88 μs | **1.13 μs** | 88 B |
| **torque** [proplist() :: iodata()] | 1069.3K | 0.94 μs | 0.88 μs | 1.17 μs | **64 B** |
| **torque** [map() :: binary()] | 917.5K | 1.09 μs | 1.00 μs | 1.33 μs | 88 B |
| **torque** [map() :: iodata()] | 914.6K | 1.09 μs | 1.00 μs | 1.42 μs | **64 B** |
| **jason** [map() :: iodata()] | 571.8K | 1.75 μs | 1.54 μs | 3.75 μs | 3848 B |
| **jiffy** [proplist() :: iodata()] | 518.4K | 1.93 μs | 1.67 μs | 2.75 μs | 120 B |
| **jiffy** [map() :: iodata()] | 427.6K | 2.34 μs | 2.08 μs | 4.33 μs | 824 B |
| **simdjsone** [proplist() :: iodata()] | 415.4K | 2.41 μs | 2.21 μs | 3.96 μs | 184 B |
| **jason** [map() :: binary()] | 385.1K | 2.60 μs | 2.38 μs | 5.00 μs | 3912 B |
| **simdjsone** [map() :: iodata()] | 346.8K | 2.88 μs | 2.67 μs | 4.33 μs | 888 B |

### Encode (750 KB Twitter)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** [proplist() :: iodata()] | **1026.4** | **0.97 ms** | **0.96 ms** | **1.18 ms** | **64 B** |
| **torque** [proplist() :: binary()] | 983.5 | 1.02 ms | 0.98 ms | 1.69 ms | 88 B |
| **torque** [map() :: binary()] | 918.5 | 1.09 ms | 1.08 ms | 1.31 ms | 88 B |
| **torque** [map() :: iodata()] | 905.4 | 1.10 ms | 1.09 ms | 1.35 ms | **64 B** |
| **jiffy** [proplist() :: iodata()] | 342.6 | 2.92 ms | 2.86 ms | 4.35 ms | 37.7 KB |
| **jiffy** [map() :: iodata()] | 270.8 | 3.69 ms | 3.53 ms | 5.94 ms | 1.06 MB |
| **jason** [map() :: iodata()] | 254.9 | 3.92 ms | 3.70 ms | 6.50 ms | 4.96 MB |
| **simdjsone** [proplist() :: iodata()] | 247.4 | 4.04 ms | 3.98 ms | 5.63 ms | 37.7 KB |
| **otp json** [map() :: iodata()] | 246.9 | 4.05 ms | 4.13 ms | 5.64 ms | 5.40 MB |
| **simdjsone** [map() :: iodata()] | 210.5 | 4.75 ms | 4.78 ms | 5.41 ms | 1.06 MB |
| **jason** [map() :: binary()] | 141.1 | 7.09 ms | 7.02 ms | 8.40 ms | 4.96 MB |

### Parse (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse(unique_keys) | **596.6K** | **1.68 μs** | **1.33 μs** | **3.13 μs** |
| **torque** parse | 579.2K | 1.73 μs | **1.33 μs** | 3.88 μs |
| **simdjsone** parse | 364.9K | 2.74 μs | 1.17 μs | 4.92 μs |

### Get (5 fields) (1.2 KB OpenRTB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** get_many_nil (unique_keys) | **2.49M** | **402 ns** | **375 ns** | **500 ns** | **240 B** |
| **torque** get_many (unique_keys) | 2.37M | 422 ns | **375 ns** | **500 ns** | 360 B |
| **torque** get_many_nil | 2.16M | 463 ns | 458 ns | 583 ns | **240 B** |
| **torque** get_many | 2.07M | 483 ns | 458 ns | 584 ns | 360 B |
| **simdjsone** get | 1.77M | 564 ns | 458 ns | 1083 ns | 384 B |
| **torque** get (unique_keys) | 1.67M | 601 ns | 583 ns | 709 ns | 384 B |
| **torque** get | 1.50M | 669 ns | 625 ns | 792 ns | 384 B |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Nesting depth**: JSON documents nested deeper than 512 levels return `{:error, :nesting_too_deep}` from `decode/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF.

## License

MIT
