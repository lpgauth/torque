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
    {:torque, "~> 0.1.2"}
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
| `:nesting_too_deep` | `decode/1`, `parse/1`, `get/2,3` | Document exceeds 512 nesting levels |

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
| torque | **255.3K** | **3.92 μs** | **3.71 μs** | **8.58 μs** | **1.56 KB** |
| simdjsone | 186.8K | 5.35 μs | 5.08 μs | 9.83 μs | 1.59 KB |
| jiffy | 147.4K | 6.78 μs | 6.04 μs | 21.17 μs | **1.56 KB** |
| otp json | 127.5K | 7.84 μs | 7.50 μs | 13.54 μs | 7.73 KB |
| jason | 104.1K | 9.61 μs | 8.92 μs | 18.96 μs | 9.54 KB |

### Parse + Get

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque parse+get_many_nil | **207.7K** | **4.82 μs** | **4.38 μs** | **8.71 μs** | 1.59 KB |
| torque parse+get_many | 200.2K | 5.00 μs | 4.46 μs | 10.21 μs | **1.58 KB** |
| torque parse+get | 158.0K | 6.33 μs | 5.75 μs | 13.79 μs | 2.80 KB |
| simdjsone parse+get | 124.5K | 8.03 μs | 6.00 μs | 29.29 μs | 2.28 KB |

### Encode (1.2 KB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| otp json: map => iodata | **1078.6K** | **0.93 μs** | **0.88 μs** | 1.42 μs | 3928 B |
| torque: proplist => iodata | 918.3K | 1.09 μs | 1.00 μs | **1.33 μs** | **64 B** |
| torque: proplist => binary | 916.1K | 1.09 μs | 1.00 μs | **1.33 μs** | 88 B |
| torque: map => iodata | 796.2K | 1.26 μs | 1.17 μs | 1.54 μs | **64 B** |
| torque: map => binary | 737.2K | 1.36 μs | 1.21 μs | 1.71 μs | 88 B |
| jason: map => iodata | 606.5K | 1.65 μs | 1.50 μs | 3.04 μs | 3848 B |
| otp json: map => binary | 574.8K | 1.74 μs | 1.54 μs | 4.04 μs | 3992 B |
| jiffy: proplist => iodata | 568.6K | 1.76 μs | 1.54 μs | 2.33 μs | 120 B |
| jiffy: map => iodata | 486.9K | 2.05 μs | 1.88 μs | 2.67 μs | 824 B |
| simdjsone: proplist => iodata | 413.8K | 2.42 μs | 2.13 μs | 3.29 μs | 184 B |
| jason: map => binary | 374.8K | 2.67 μs | 2.38 μs | 6.29 μs | 3912 B |
| simdjsone: map => iodata | 344.9K | 2.90 μs | 2.50 μs | 6.33 μs | 888 B |

### Decode (750 KB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque | **485.3** | **2.06 ms** | **1.59 ms** | 3.11 ms | **1.56 KB** |
| simdjsone | 466.6 | 2.14 ms | 1.81 ms | **3.10 ms** | **1.56 KB** |
| otp json | 194.9 | 5.13 ms | 5.19 ms | 5.87 ms | 2.49 MB |
| jason | 135.5 | 7.38 ms | 7.15 ms | 8.76 ms | 3.55 MB |
| jiffy | 108.1 | 9.25 ms | 9.49 ms | 10.24 ms | 5.53 MB |

### Encode (750 KB)

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| torque: proplist => iodata | **709.9** | **1.41 ms** | **1.40 ms** | **1.53 ms** | **64 B** |
| torque: proplist => binary | 709.4 | **1.41 ms** | 1.41 ms | **1.53 ms** | 88 B |
| torque: map => binary | 637.9 | 1.57 ms | 1.57 ms | 1.69 ms | 88 B |
| torque: map => iodata | 637.5 | 1.57 ms | 1.56 ms | 1.70 ms | **64 B** |
| otp json: map => iodata | 557.6 | 1.79 ms | 1.77 ms | 2.11 ms | 5.40 MB |
| jiffy: proplist => iodata | 328.7 | 3.04 ms | 2.79 ms | 4.01 ms | 37.5 KB |
| jiffy: map => iodata | 289.1 | 3.46 ms | 3.21 ms | 4.48 ms | 1.06 MB |
| otp json: map => binary | 286.8 | 3.49 ms | 3.32 ms | 4.88 ms | 5.40 MB |
| jason: map => iodata | 285.1 | 3.51 ms | 3.49 ms | 4.88 ms | 4.96 MB |
| simdjsone: proplist => iodata | 250.9 | 3.99 ms | 3.75 ms | 4.94 ms | 37.6 KB |
| simdjsone: map => iodata | 232.5 | 4.30 ms | 4.18 ms | 4.84 ms | 1.06 MB |
| jason: map => binary | 191.7 | 5.22 ms | 5.18 ms | 6.90 ms | 4.96 MB |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Nesting depth**: JSON documents nested deeper than 512 levels return `{:error, :nesting_too_deep}` from `decode/1`, `get/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF.
- **Numeric string keys**: Object keys that are pure integers (e.g. `"0"`, `"42"`) cannot be addressed via JSON Pointer because the pointer walker treats numeric path segments as array indices. Use `decode/1` if you need to access such keys.

## License

MIT
