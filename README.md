# Torque

High-performance JSON library for Elixir via [Rustler](https://github.com/rustler-magic/rustler) NIFs, powered by [sonic-rs](https://github.com/cloudwego/sonic-rs) (SIMD-accelerated).

Torque provides the fastest JSON encoding and decoding available in the BEAM ecosystem, with a selective field extraction API for workloads that only need a subset of fields from each document.

## Features

- SIMD-accelerated decoding (AVX2/SSE4.2 on x86, NEON on ARM)
- Fastest encoder in the BEAM ecosystem (beats OTP `json`, jiffy, jason)
- Parse-then-get API for selective field extraction via JSON Pointer (RFC 6901)
- Batch field extraction (`get_many/2`) with single NIF call
- Automatic dirty CPU scheduler dispatch for large inputs
- jiffy-compatible `{proplist}` encoding
- Minimal memory footprint (88 bytes per encode vs ~4 KB for OTP `json`/jason)

## Requirements

- Elixir >= 1.15
- Rust toolchain (stable)

## Installation

Add to your `mix.exs`:

```elixir
def deps do
  [
    {:torque, "~> 0.1.0"}
  ]
end
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

| Library | ips | median | memory |
|---|---|---|---|
| **torque** | **251.5K** | **3.75 us** | **1.56 KB** |
| jiffy | 144.2K | 6.21 us | 1.56 KB |
| simdjsone | 140.8K | 5.71 us | 1.59 KB |
| otp json | 132.0K | 7.25 us | 7.73 KB |
| jason | 106.2K | 8.58 us | 9.54 KB |

### Encode

| Library | ips | median | memory |
|---|---|---|---|
| **torque iodata (proplist)** | **932.9K** | **1.00 us** | **64 B** |
| torque iodata (map) | 805.8K | 1.17 us | 64 B |
| otp json (iodata) | 695.7K | 0.96 us | 3840 B |
| jiffy | 564.4K | 1.50 us | 120 B |
| otp json (binary) | 441.5K | 1.58 us | 3900 B |
| jason | 279.9K | 2.46 us | 3912 B |

Run benchmarks locally:

```bash
mix run bench/torque_bench.exs
```

## License

MIT
