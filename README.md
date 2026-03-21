# Torque

High-performance JSON library for Elixir via [Rustler](https://github.com/rustler-magic/rustler) NIFs, powered by [sonic-rs](https://github.com/cloudwego/sonic-rs) (SIMD-accelerated).

Torque provides the fastest JSON encoding and decoding available in the BEAM ecosystem, with a selective field extraction API for workloads that only need a subset of fields from each document.

## Features

- SIMD-accelerated decoding (AVX2/SSE4.2 on x86, NEON on ARM)
- Ultra-low memory encoder (64 B per encode vs ~4 KB for OTP `json`/jason)
- Parse-then-get API for selective field extraction via JSON Pointer (RFC 6901)
- Batch field extraction (`get_many/2`) with single NIF call
- Automatic dirty CPU scheduler dispatch for large inputs
- jiffy-compatible `{proplist}` encoding

## Installation

Add to your `mix.exs`:

```elixir
def deps do
  [
    {:torque, "~> 0.1.3"}
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

### Decode (1.2 KB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque | **262.0K** | **3.82 μs** | **3.54 μs** | **8.08 μs** | **1.56 KB** |
| simdjsone | 187.7K | 5.33 μs | 4.96 μs | 12.46 μs | 1.59 KB |
| jiffy | 156.1K | 6.41 μs | 5.79 μs | 16.17 μs | **1.56 KB** |
| otp json | 130.9K | 7.64 μs | 7.21 μs | 15.17 μs | 7.73 KB |
| jason | 107.1K | 9.34 μs | 8.54 μs | 20.92 μs | 9.54 KB |

### Parse + Get

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque parse+get_many_nil | **196.5K** | **5.09 μs** | **4.46 μs** | **10.79 μs** | 1.59 KB |
| torque parse+get_many | 190.3K | 5.26 μs | 4.54 μs | 10.88 μs | **1.58 KB** |
| torque parse+get | 155.6K | 6.43 μs | 5.75 μs | 14.29 μs | 2.80 KB |
| simdjsone parse+get | 125.2K | 7.99 μs | 5.83 μs | 30.83 μs | 2.28 KB |

### Encode (1.2 KB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque: proplist => iodata | **1287.4K** | **0.78 μs** | **0.71 μs** | **0.96 μs** | **64 B** |
| torque: proplist => binary | 1259.3K | 0.79 μs | **0.71 μs** | **0.96 μs** | 88 B |
| torque: map => iodata | 1065.7K | 0.94 μs | 0.88 μs | 1.17 μs | **64 B** |
| otp json: map => iodata | 1056.7K | 0.95 μs | 0.88 μs | 1.54 μs | 3928 B |
| torque: map => binary | 1047.9K | 0.95 μs | 0.88 μs | 1.17 μs | 88 B |
| jason: map => iodata | 611.8K | 1.63 μs | 1.50 μs | 3.08 μs | 3848 B |
| otp json: map => binary | 580.6K | 1.72 μs | 1.54 μs | 3.42 μs | 3992 B |
| jiffy: proplist => iodata | 571.2K | 1.75 μs | 1.50 μs | 3.33 μs | 120 B |
| jiffy: map => iodata | 487.5K | 2.05 μs | 1.79 μs | 4.42 μs | 824 B |
| simdjsone: proplist => iodata | 452.6K | 2.21 μs | 2.00 μs | 3.38 μs | 184 B |
| jason: map => binary | 390.7K | 2.56 μs | 2.33 μs | 6.13 μs | 3912 B |
| simdjsone: map => iodata | 384.0K | 2.60 μs | 2.38 μs | 5.50 μs | 888 B |

### Decode (750 KB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque | **525.2** | **1.90 ms** | **1.58 ms** | **2.85 ms** | **1.56 KB** |
| simdjsone | 462.7 | 2.16 ms | 1.82 ms | 3.18 ms | **1.56 KB** |
| otp json | 198.6 | 5.04 ms | 5.08 ms | 5.87 ms | 2.49 MB |
| jason | 145.3 | 6.88 ms | 6.88 ms | 7.28 ms | 3.55 MB |
| jiffy | 109.0 | 9.17 ms | 9.35 ms | 10.05 ms | 5.53 MB |

### Encode (750 KB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque: proplist => iodata | **1274.1** | **0.78 ms** | **0.78 ms** | **0.90 ms** | **64 B** |
| torque: proplist => binary | 1273.9 | 0.79 ms | **0.78 ms** | **0.90 ms** | 88 B |
| torque: map => iodata | 1103.3 | 0.91 ms | 0.90 ms | 1.03 ms | **64 B** |
| torque: map => binary | 1103.2 | 0.91 ms | 0.90 ms | 1.02 ms | 88 B |
| otp json: map => iodata | 522.8 | 1.91 ms | 1.88 ms | 2.20 ms | 5.40 MB |
| jiffy: proplist => iodata | 328.9 | 3.04 ms | 2.79 ms | 4.11 ms | 37.7 KB |
| jiffy: map => iodata | 296.1 | 3.38 ms | 3.28 ms | 3.94 ms | 1.06 MB |
| otp json: map => binary | 262.0 | 3.82 ms | 3.74 ms | 5.36 ms | 5.40 MB |
| simdjsone: proplist => iodata | 238.2 | 4.20 ms | 3.89 ms | 5.19 ms | 37.7 KB |
| simdjsone: map => iodata | 219.5 | 4.55 ms | 4.31 ms | 5.55 ms | 1.06 MB |
| jason: map => iodata | 209.3 | 4.78 ms | 4.77 ms | 5.60 ms | 4.96 MB |
| jason: map => binary | 151.7 | 6.59 ms | 6.57 ms | 7.73 ms | 4.96 MB |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Nesting depth**: JSON documents nested deeper than 512 levels return `{:error, :nesting_too_deep}` from `decode/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF.

## License

MIT
