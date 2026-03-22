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
| torque | **264.1K** | **3.79 μs** | **3.63 μs** | **6.83 μs** | **1.56 KB** |
| simdjsone | 182.8K | 5.47 μs | 5.21 μs | 10.00 μs | 1.59 KB |
| jiffy | 145.1K | 6.89 μs | 6.25 μs | 14.50 μs | **1.56 KB** |
| otp json | 132.5K | 7.55 μs | 7.25 μs | 13.21 μs | 7.73 KB |
| jason | 107.9K | 9.26 μs | 8.58 μs | 19.25 μs | 9.54 KB |

### Decode (750 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque | **536.0** | **1.87 ms** | **1.67 ms** | **2.22 ms** | **1.56 KB** |
| simdjsone | 435.1 | 2.30 ms | 1.80 ms | 3.31 ms | **1.56 KB** |
| otp json | 199.4 | 5.02 ms | 5.07 ms | 5.83 ms | 2.49 MB |
| jason | 147.2 | 6.80 ms | 6.77 ms | 7.17 ms | 3.55 MB |
| jiffy | 116.6 | 8.58 ms | 8.69 ms | 9.78 ms | 5.53 MB |

### Encode (1.2 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque: proplist => binary | **1075.2K** | **0.93 μs** | **0.88 μs** | **1.04 μs** | 88 B |
| otp json: map => iodata | 1074.0K | 0.93 μs | **0.88 μs** | 1.29 μs | 3928 B |
| torque: proplist => iodata | 1069.6K | 0.93 μs | **0.88 μs** | 1.08 μs | **64 B** |
| torque: map => iodata | 924.8K | 1.08 μs | 1.04 μs | 1.21 μs | **64 B** |
| torque: map => binary | 914.6K | 1.09 μs | 1.04 μs | 1.25 μs | 88 B |
| otp json: map => binary | 584.0K | 1.71 μs | 1.58 μs | 3.04 μs | 3992 B |
| jiffy: proplist => iodata | 523.8K | 1.91 μs | 1.71 μs | 2.25 μs | 120 B |
| jason: map => iodata | 515.0K | 1.94 μs | 1.54 μs | 14.17 μs | 3848 B |
| jiffy: map => iodata | 431.4K | 2.32 μs | 2.13 μs | 2.83 μs | 824 B |
| simdjsone: proplist => iodata | 424.3K | 2.36 μs | 2.25 μs | 2.83 μs | 184 B |
| jason: map => binary | 352.6K | 2.84 μs | 2.42 μs | 15.13 μs | 3912 B |
| simdjsone: map => iodata | 352.2K | 2.84 μs | 2.71 μs | 3.46 μs | 888 B |

### Encode (750 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque: proplist => iodata | **1058.7** | **0.94 ms** | **0.93 ms** | **1.06 ms** | **64 B** |
| torque: proplist => binary | 1048.4 | 0.95 ms | 0.93 ms | 1.09 ms | 88 B |
| torque: map => iodata | 937.0 | 1.07 ms | 1.05 ms | 1.21 ms | **64 B** |
| torque: map => binary | 933.8 | 1.07 ms | 1.05 ms | 1.22 ms | 88 B |
| jiffy: proplist => iodata | 341.4 | 2.93 ms | 2.87 ms | 4.41 ms | 37.7 KB |
| otp json: map => iodata | 278.9 | 3.59 ms | 3.66 ms | 4.69 ms | 5.40 MB |
| jiffy: map => iodata | 275.8 | 3.63 ms | 3.74 ms | 4.17 ms | 1.06 MB |
| jason: map => iodata | 268.0 | 3.73 ms | 3.43 ms | 5.65 ms | 4.96 MB |
| simdjsone: proplist => iodata | 249.4 | 4.01 ms | 3.95 ms | 5.58 ms | 37.7 KB |
| simdjsone: map => iodata | 211.6 | 4.73 ms | 4.81 ms | 5.44 ms | 1.06 MB |
| otp json: map => binary | 210.7 | 4.75 ms | 4.85 ms | 6.57 ms | 5.40 MB |
| jason: map => binary | 137.9 | 7.25 ms | 6.84 ms | 8.85 ms | 4.96 MB |

### Parse + Get (1.2 KB JSON)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque parse+get_many_nil | **493.2K** | **2.03 μs** | **1.75 μs** | **3.21 μs** | **288 B** |
| torque parse+get_many | 472.3K | 2.12 μs | 1.79 μs | 3.67 μs | 408 B |
| torque parse+get | 428.3K | 2.34 μs | 2.00 μs | 5.75 μs | 432 B |
| simdjsone parse+get | 385.0K | 2.60 μs | 1.79 μs | 6.71 μs | 408 B |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Nesting depth**: JSON documents nested deeper than 512 levels return `{:error, :nesting_too_deep}` from `decode/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF.

## License

MIT
