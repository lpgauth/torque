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
    {:torque, "~> 0.1.5"}
  ]
end
```

Precompiled binaries are available for common targets. To compile from source, install a stable Rust toolchain and set `TORQUE_BUILD=true`.

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

### Decode (1.2 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque | **271.9K** | **3.68 μs** | **3.54 μs** | **6.54 μs** | **1.56 KB** |
| simdjsone | 188.9K | 5.29 μs | 5.00 μs | 9.63 μs | 1.59 KB |
| jiffy | 152.4K | 6.56 μs | 5.79 μs | 15.79 μs | **1.56 KB** |
| otp json | 135.0K | 7.41 μs | 7.04 μs | 13.54 μs | 7.73 KB |
| jason | 106.6K | 9.38 μs | 8.54 μs | 21.75 μs | 9.54 KB |

### Decode (750 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque | **513.5** | **1.95 ms** | **1.80 ms** | **2.51 ms** | **1.56 KB** |
| simdjsone | 448.9 | 2.23 ms | 1.89 ms | 3.33 ms | **1.56 KB** |
| otp json | 191.5 | 5.22 ms | 5.20 ms | 6.15 ms | 2.49 MB |
| jason | 142.2 | 7.03 ms | 7.01 ms | 7.70 ms | 3.55 MB |
| jiffy | 112.4 | 8.90 ms | 8.92 ms | 10.00 ms | 5.53 MB |

### Encode (1.2 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque: proplist => binary | **1243.5K** | **0.80 μs** | **0.71 μs** | **1.00 μs** | 88 B |
| torque: proplist => iodata | 1242.6K | 0.80 μs | **0.71 μs** | **1.00 μs** | **64 B** |
| torque: map => iodata | 1046.0K | 0.96 μs | 0.88 μs | 1.17 μs | **64 B** |
| torque: map => binary | 1044.8K | 0.96 μs | 0.88 μs | 1.17 μs | 88 B |
| otp json: map => iodata | 943.3K | 1.06 μs | 0.83 μs | 10.37 μs | 3928 B |
| jason: map => iodata | 625.3K | 1.60 μs | 1.50 μs | 2.63 μs | 3848 B |
| jiffy: proplist => iodata | 563.3K | 1.78 μs | 1.50 μs | 3.83 μs | 120 B |
| otp json: map => binary | 559.1K | 1.79 μs | 1.54 μs | 5.13 μs | 3992 B |
| jiffy: map => iodata | 493.5K | 2.03 μs | 1.83 μs | 2.54 μs | 824 B |
| simdjsone: proplist => iodata | 458.1K | 2.18 μs | 2.04 μs | 2.71 μs | 184 B |
| jason: map => binary | 384.3K | 2.60 μs | 2.38 μs | 6.04 μs | 3912 B |
| simdjsone: map => iodata | 379.8K | 2.63 μs | 2.38 μs | 5.79 μs | 888 B |

### Encode (750 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque: proplist => iodata | **1280.9** | **0.78 ms** | **0.76 ms** | **0.96 ms** | **64 B** |
| torque: proplist => binary | 1270.8 | 0.79 ms | **0.76 ms** | 1.01 ms | 88 B |
| torque: map => iodata | 1109.3 | 0.90 ms | 0.89 ms | 1.10 ms | **64 B** |
| torque: map => binary | 1078.4 | 0.93 ms | 0.90 ms | 1.46 ms | 88 B |
| jiffy: proplist => iodata | 329.1 | 3.04 ms | 2.78 ms | 7.86 ms | 37.7 KB |
| jiffy: map => iodata | 285.8 | 3.50 ms | 3.56 ms | 4.18 ms | 1.06 MB |
| otp json: map => iodata | 263.5 | 3.80 ms | 3.97 ms | 4.91 ms | 5.40 MB |
| simdjsone: proplist => iodata | 257.8 | 3.88 ms | 3.79 ms | 6.54 ms | 37.7 KB |
| jason: map => iodata | 255.5 | 3.91 ms | 3.74 ms | 6.04 ms | 4.96 MB |
| simdjsone: map => iodata | 225.3 | 4.44 ms | 4.31 ms | 5.34 ms | 1.06 MB |
| otp json: map => binary | 180.1 | 5.55 ms | 5.58 ms | 13.46 ms | 5.40 MB |
| jason: map => binary | 141.4 | 7.07 ms | 7.03 ms | 7.94 ms | 4.96 MB |

### Parse + Get (1.2 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque parse+get_many_nil | **478.4K** | **2.09 μs** | **1.75 μs** | **4.83 μs** | **288 B** |
| torque parse+get_many | 471.8K | 2.12 μs | 1.75 μs | 4.83 μs | 408 B |
| torque parse+get | 445.9K | 2.24 μs | 1.96 μs | 5.88 μs | 432 B |
| simdjsone parse+get | 445.5K | 2.24 μs | 1.67 μs | 5.17 μs | 408 B |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Nesting depth**: JSON documents nested deeper than 512 levels return `{:error, :nesting_too_deep}` from `decode/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF.

## License

MIT
