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
    {:torque, "~> 0.1.1"}
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

For objects with duplicate keys, the last key wins.

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

## Benchmarks

1.2 KB OpenRTB payload, Apple M2 Pro, OTP 28, Elixir 1.19:

### Decode

| Library | ips | mean | median | p95 | p99 | memory |
|---|---|---|---|---|---|---|
| torque | **255.8K** | **3.91 us** | **3.58 us** | **4.54 us** | **9.21 us** | **1.56 KB** |
| simdjsone | 185.9K | 5.38 us | 5.00 us | 6.38 us | 12.67 us | 1.59 KB |
| jiffy | 152.4K | 6.56 us | 5.83 us | 8.58 us | 15.75 us | **1.56 KB** |
| otp json | 130.9K | 7.64 us | 7.17 us | 9.33 us | 16.50 us | 7.73 KB |
| jason | 109.1K | 9.17 us | 8.54 us | 11.04 us | 18.13 us | 9.54 KB |

### Parse + Get (bidder hot path, 26 fields)

| Library | ips | mean | median | p95 | p99 | memory |
|---|---|---|---|---|---|---|
| torque parse+get_many_nil | **205.8K** | **4.86 us** | **4.29 us** | 5.54 us | **8.88 us** | 1.59 KB |
| torque parse+get_many | 201.2K | 4.97 us | 4.38 us | **5.50 us** | 10.54 us | **1.58 KB** |
| torque parse+get | 159.2K | 6.28 us | 5.67 us | 7.83 us | 13.46 us | 2.80 KB |
| simdjsone parse+get | 126.4K | 7.91 us | 5.88 us | 10.33 us | 30.67 us | 2.28 KB |

### Encode

| Library | ips | mean | median | p95 | p99 | memory |
|---|---|---|---|---|---|---|
| torque encode (proplist) | **869.6K** | **1.15 us** | 1.04 us | 1.29 us | **1.42 us** | 88 B |
| torque iodata (proplist) | 854.7K | 1.17 us | 1.08 us | 1.33 us | 1.46 us | **64 B** |
| torque iodata (map) | 775.2K | 1.29 us | 1.17 us | 1.46 us | 1.63 us | **64 B** |
| torque encode (map) | 800.0K | 1.25 us | 1.17 us | **1.25 us** | 1.50 us | 88 B |
| otp json (iodata) | 735.3K | 1.36 us | **0.83 us** | **1.25 us** | 13.54 us | 3928 B |
| jiffy | 537.6K | 1.86 us | 1.63 us | 2.00 us | 2.29 us | 120 B |
| otp json (binary) | 448.4K | 2.23 us | 1.58 us | 2.63 us | 15.00 us | 3992 B |
| jason | 284.9K | 3.51 us | 2.42 us | 14.63 us | 16.63 us | 3912 B |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## License

MIT
