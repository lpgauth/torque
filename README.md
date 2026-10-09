# Torque

High-performance JSON library for Elixir and Erlang via [Rustler](https://github.com/rustler-magic/rustler) NIFs, powered by [sonic-rs](https://github.com/cloudwego/sonic-rs) (SIMD-accelerated).

Torque provides the fastest JSON encoding and decoding available in the BEAM ecosystem, with a selective field extraction API for workloads that only need a subset of fields from each document.

Documentation: [hexdocs.pm/torque](https://hexdocs.pm/torque) (Elixir `Torque` and Erlang `torque` APIs).

## Features

- SIMD-accelerated decoding (AVX2 on x86, NEON on ARM)
- Ultra-low memory encoder (64 B per encode vs ~4 KB for OTP `json`/jason)
- Parse-then-get API for selective field extraction via JSON Pointer (RFC 6901,
  with one documented deviation: `"/"` selects the root, not the empty key)
- Batch field extraction (`get_many/2`) with single NIF call
- Pre-compiled pointers with fused parse + extract (`parse_get_many_nil/2`)
- Automatic dirty CPU scheduler dispatch for decode/parse inputs larger than 20 KB (opt-in `dirty: true` for encode)
- jiffy-compatible `{proplist}` encoding
- Opt-in `Torque.Encoder` protocol for encoding structs, with `@derive`

## Installation

Add to your `mix.exs`:

```elixir
def deps do
  [
    {:torque, "~> 0.5.0"}
  ]
end
```

or, with rebar3, to your `rebar.config` (see [Erlang](#erlang)):

```erlang
{deps, [{torque, "~> 0.5.0"}]}.
```

Precompiled binaries are available for macOS and glibc Linux on `aarch64` and `x86_64` (with CPU-optimized variants on `x86_64`, below). Anything else, such as musl (Alpine) or Windows, builds from source: install a stable Rust toolchain and set `TORQUE_BUILD=true`.

A source build targets the platform's baseline CPU, so the binary runs on any machine of that architecture. On x86_64 that baseline is SSE2, which leaves the AVX2 parser paths out: set `RUSTFLAGS="-C target-cpu=x86-64-v3 -C target-feature=+pclmulqdq"` to match the precompiled v3 variant, or `-C target-cpu=native` only when the binary will run on the machine that built it.

### CPU-optimized variants

On x86_64, precompiled binaries are available for three CPU feature levels:

| Variant | CPU features | `target-cpu` |
|---------|-------------|--------------|
| baseline | SSE2 | `x86-64` |
| v2 | SSE4.2, SSSE3, POPCNT | `x86-64-v2` |
| v3 | AVX2, AVX, BMI1, BMI2, FMA, PCLMULQDQ | `x86-64-v3` + `pclmulqdq` |

At compile time, Torque auto-detects the host CPU and downloads the best matching variant, checked against the checksums shipped in the package and cached in the user cache directory. To override detection (e.g., when cross-compiling for a different target):

```bash
TORQUE_CPU_VARIANT=v2 mix compile  # force SSE4.2 variant
TORQUE_CPU_VARIANT=v3 mix compile  # force AVX2 variant
TORQUE_CPU_VARIANT=base mix compile  # force baseline
```

To build on one platform for another (a release built on macOS for Linux, say), set `TORQUE_NIF_TARGET` to the target's triple, e.g. `x86_64-unknown-linux-gnu`.

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
everything else, without building an intermediate document. Against
`parse/2` + `get_many_nil/2` with the same handle, on PGO builds:

| | arm64 (M1 Pro) | x86_64 (Xeon E5-2630 v3) |
|---|---|---|
| 1.2 KB bid request, all 51 fields | ~3× faster | ~3.6× faster |
| 1.2 KB bid request, 3 fields | ~1.3× faster | ~3× faster |
| 776 KB feed, 3 fields | parity | ~3.2× faster |

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
behind, so the win tracks how little of the document the paths select.
Against a validated handle, on both machines, 3 paths run ~1.9× faster
unvalidated on the 1.2 KB request and ~4× faster on the 776 KB feed, while all
51 fields of the request run 3-7% slower. Measure your own path set.

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

`Date`, `Time`, `NaiveDateTime`, and `DateTime` ship with implementations and
encode as ISO 8601 strings.

> **Breaking change in 0.4.0.** Structs previously encoded as raw maps, leaking
> the struct marker into the output: `~D[2026-09-14]` produced
> `{"calendar":"Elixir.Calendar.ISO","month":9,"__struct__":"Elixir.Date",...}`.
> They now error unless the protocol is implemented.

Unlike decoding, encoding cannot cheaply predict its output size, so dirty
scheduler dispatch is opt-in. Pass `dirty: true` (accepted by `encode/2`,
`encode!/2`, `encode_to_iodata/2`, and `encode_to_iodata!/2`) when terms are
expected to encode to large output (more than roughly 20 KB):

```elixir
{:ok, json} = Torque.encode(big_term, dirty: true)
```

## Using with Phoenix, Plug and Postgrex

Torque provides the functions these libraries call on a JSON module
(`encode_to_iodata!/1`, `encode!/1`, `decode!/1`), so it can replace Jason in
their configuration:

```elixir
# config/config.exs
config :phoenix, :json_library, Torque
config :postgrex, :json_library, Torque

# endpoint.ex
plug Plug.Parsers,
  parsers: [:urlencoded, :multipart, :json],
  json_decoder: Torque
```

Structs, Ecto schemas included, must implement `Torque.Encoder` (for example
`@derive {Torque.Encoder, only: [:id, :name]}`): a struct without an
implementation raises rather than encoding its raw fields.

## Erlang

The `torque` module is the Erlang API. It follows Erlang conventions: JSON
null is `null`, and the bulk lookups return `undefined` for a path the document
does not contain, so it stays distinct from a JSON null. Results are
`{ok, _} | {error, _}` tuples and options are proplists.

```erlang
{ok, #{<<"a">> := null}} = torque:decode(<<"{\"a\":null}">>),
{ok, <<"{\"a\":null}">>} = torque:encode(#{a => null}),

{ok, Doc} = torque:parse(Json),
{ok, Domain} = torque:get(Doc, <<"/site/domain">>),
[Id, undefined] = torque:get_many_values(Doc, [<<"/id">>, <<"/missing">>]),

%% Compile fixed paths once, then extract them in one pass per document:
Pointers = torque:compile_pointers([<<"/id">>, <<"/site/domain">>], [{unique_keys, true}]),
{ok, [Id, Domain]} = torque:parse_get_many_values(Json, Pointers).
```

The [Erlang API guide](guides/erlang.md) documents every function and option.

A rebar3 build fetches the precompiled NIF for the platform from the GitHub
release, checks it against the checksums shipped in the package, and caches it
in the user cache directory. That needs OTP 25 or later; with
`TORQUE_BUILD=true` the NIF is built with cargo instead, which works on any
platform. `TORQUE_CPU_VARIANT` picks the x86_64 variant as it does for Mix.

## API

| Function | Description |
|----------|-------------|
| `Torque.compile_pointers(paths, opts)` | Pre-compile a fixed path set into a reusable handle |
| `Torque.decode(binary, opts)` | Decode JSON to Elixir terms (`strings: :copy` to detach strings from the input) |
| `Torque.decode!(binary, opts)` | Decode JSON, raising on error |
| `Torque.encode(term, opts)` | Encode term to JSON binary |
| `Torque.encode!(term, opts)` | Encode term, raising on error |
| `Torque.encode_to_iodata(term, opts)` | Encode term, returns binary directly (fastest) |
| `Torque.encode_to_iodata!(term, opts)` | Alias for `encode_to_iodata/2` (Phoenix `:json_library`) |
| `Torque.get(doc, path)` | Extract field by JSON Pointer path |
| `Torque.get(doc, path, default)` | Extract field with default for missing paths |
| `Torque.get_many(doc, paths)` | Extract multiple fields in one NIF call |
| `Torque.get_many_nil(doc, paths)` | Extract multiple fields, `nil` for missing |
| `Torque.get_many_defaults(doc, defaults)` | Extract fields with per-path defaults (`%{path => default}`) |
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

Integers outside the signed/unsigned 64-bit range decode as exact arbitrary-precision integers (Erlang bignums) rather than degrading to lossy floats, from `decode/1` and from every `get` and `parse_get_many_nil` lookup alike. One exception: a `compile_pointers/2` handle with the default `validate: true` rejects an integer beyond the `f64` range (about 1.8e308) in a region no path selects.

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
| struct implementing `Torque.Encoder` | whatever `encode/1` returns |

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
| `:unhandled_struct` | `encode/1` | Struct has no `Torque.Encoder` implementation |
| `:encoder_expansion_too_deep` | `encode/1` | A `Torque.Encoder` implementation expands the same struct again, or structs nest past 128 levels |

## Benchmarks

Per-commit trends and the full cross-library comparison are published at
[lpgauth.github.io/torque/dev/bench](https://lpgauth.github.io/torque/dev/bench/).

Every table below comes from one run of `bench/torque_bench.exs`, against
glazer 1.1.5, on each of two machines:

- **arm64**: Apple M1 Pro, macOS, OTP 29, Elixir 1.20.3, Apple clang 21, rustc 1.98.1
- **x86_64**: Intel Xeon E5-2630 v3 (Haswell, 2.4 GHz), Ubuntu 22.04 container pinned to one core of a shared server, OTP 29, Elixir 1.20.2, GCC 13.4, rustc 1.99.0

Both libraries are profile-guided optimised (PGO) builds on both machines:
**Torque PGO** (via `scripts/pgo-build.sh`, which builds with
`-C target-cpu=native`) and **Glazer PGO** (via
`make -C deps/glazer/c_src PGO=generate`, the workload in
`bench/glazer_pgo_workload.exs`, then `PGO=use`). Glazer's Makefile writes that
flow for GCC; under clang the raw counters need an explicit
`llvm-profdata merge -o obj/pgo/default.profdata obj/pgo/*.profraw` between
those two steps.

glazer is benchmarked with UTF-8 validation enabled (`validate_utf8` on
decode, `force_utf8` on encode — both off by default in glazer) so every
library provides the same guarantee Torque always does: JSON strings are
valid UTF-8.

### Decode (1.2 KB OpenRTB)

**arm64**

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **400.0K** | **2.50 μs** | **2.38 μs** | **2.88 μs** | 1.56 KB |
| **glazer** | 349.1K | 2.86 μs | 2.75 μs | 4.04 μs | 1.56 KB |
| **jiffy** | 202.4K | 4.94 μs | 4.58 μs | 8.75 μs | **1.55 KB** |
| **otp json** | 137.8K | 7.25 μs | 7.00 μs | 12.17 μs | 7.73 KB |
| **jason** | 103.2K | 9.69 μs | 9.17 μs | 16.04 μs | 9.54 KB |

**x86_64**

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **glazer** | **171.1K** | **5.84 μs** | **5.61 μs** | **9.25 μs** | 1.56 KB |
| **torque** | 168.4K | 5.94 μs | 5.68 μs | 11.17 μs | 1.56 KB |
| **jiffy** | 89.8K | 11.14 μs | 9.64 μs | 21.54 μs | **1.55 KB** |
| **otp json** | 59.0K | 16.94 μs | 16.13 μs | 24.15 μs | 7.73 KB |
| **jason** | 52.7K | 18.97 μs | 18.31 μs | 29.86 μs | 9.46 KB |

### Decode (750 KB Twitter)

**arm64**

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **685.2** | **1.46 ms** | **1.34 ms** | **1.91 ms** | **1.57 KB** |
| **glazer** | 577.3 | 1.73 ms | 1.65 ms | 2.15 ms | 1.58 KB |
| **jiffy** | 294.8 | 3.39 ms | 3.49 ms | 3.85 ms | 2.30 MB |
| **otp json** | 202.2 | 4.94 ms | 4.94 ms | 5.97 ms | 2.48 MB |
| **jason** | 122.1 | 8.19 ms | 8.17 ms | 8.74 ms | 3.52 MB |

**x86_64**

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **354.6** | **2.82 ms** | **2.86 ms** | **3.58 ms** | **1.57 KB** |
| **glazer** | 341.0 | 2.93 ms | 3.01 ms | 3.72 ms | 1.58 KB |
| **jiffy** | 145.6 | 6.87 ms | 6.16 ms | 8.82 ms | 2.30 MB |
| **otp json** | 89.1 | 11.23 ms | 11.40 ms | 14.51 ms | 2.44 MB |
| **jason** | 71.4 | 14.01 ms | 13.76 ms | 16.48 ms | 3.54 MB |

### Encode (1.2 KB OpenRTB)

**Function** is the call benchmarked. Torque's `encode!/1` raises on error
and `encode_to_iodata/1` returns the same binary without the `{:ok, _}` tuple;
Jason's `encode_to_iodata!/1`, jiffy and `json:encode/1` return iodata.
**Input** is the term encoded: this payload is a bid response with atom keys,
the 750 KB one below is decoded JSON, so its keys are binaries.

**arm64**

| Library | Function | Input | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|---|---|
| **torque** | `encode!/1` | proplist, atom keys | **1460K** | **0.68 μs** | **0.63 μs** | **0.75 μs** | 88 B |
| **torque** | `encode_to_iodata/1` | proplist, atom keys | 1430K | 0.70 μs | **0.63 μs** | 0.79 μs | **64 B** |
| **torque** | `encode!/1` | map, atom keys | 1390K | 0.72 μs | 0.67 μs | 0.79 μs | 88 B |
| **torque** | `encode_to_iodata/1` | map, atom keys | 1370K | 0.73 μs | 0.67 μs | **0.75 μs** | **64 B** |
| **otp json** | `json:encode/1` | map, atom keys | 1110K | 0.90 μs | 0.83 μs | 1.17 μs | 3.84 KB |
| **glazer** | `encode/2` | map, atom keys | 1010K | 0.99 μs | 0.83 μs | 1.04 μs | **64 B** |
| **jiffy** | `encode/2` | proplist, atom keys | 830K | 1.20 μs | 1.04 μs | 1.29 μs | 120 B |
| **jiffy** | `encode/1` | map, atom keys | 670K | 1.50 μs | 1.33 μs | 1.63 μs | 632 B |
| **jason** | `encode_to_iodata!/1` | map, atom keys | 580K | 1.72 μs | 1.63 μs | 2.67 μs | 3.76 KB |
| **jason** | `encode!/1` | map, atom keys | 380K | 2.65 μs | 2.50 μs | 4.50 μs | 3.82 KB |

**x86_64**

| Library | Function | Input | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|---|---|
| **torque** | `encode_to_iodata/1` | proplist, atom keys | **1047K** | **0.95 μs** | **0.81 μs** | **1.15 μs** | **64 B** |
| **torque** | `encode!/1` | proplist, atom keys | **1047K** | 0.96 μs | **0.81 μs** | 1.20 μs | 88 B |
| **torque** | `encode_to_iodata/1` | map, atom keys | 942.3K | 1.06 μs | 0.92 μs | 1.18 μs | **64 B** |
| **torque** | `encode!/1` | map, atom keys | 926.1K | 1.08 μs | 0.95 μs | 1.17 μs | 88 B |
| **glazer** | `encode/2` | map, atom keys | 488.7K | 2.05 μs | 1.88 μs | 2.58 μs | **64 B** |
| **otp json** | `json:encode/1` | map, atom keys | 431.8K | 2.32 μs | 2.03 μs | 3.39 μs | 3.84 KB |
| **jiffy** | `encode/2` | proplist, atom keys | 420.4K | 2.38 μs | 2.02 μs | 2.82 μs | 120 B |
| **jiffy** | `encode/1` | map, atom keys | 347.2K | 2.88 μs | 2.54 μs | 3.54 μs | 632 B |
| **jason** | `encode_to_iodata!/1` | map, atom keys | 222.0K | 4.50 μs | 3.46 μs | 6.83 μs | 3.76 KB |
| **jason** | `encode!/1` | map, atom keys | 182.8K | 5.47 μs | 4.96 μs | 10.15 μs | 3.82 KB |

### Encode (750 KB Twitter)

**arm64**

| Library | Function | Input | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|---|---|
| **torque** | `encode_to_iodata/1` | proplist, binary keys | **1640.2** | **0.61 ms** | **0.60 ms** | **0.72 ms** | **64 B** |
| **torque** | `encode!/1` | proplist, binary keys | 1629.3 | **0.61 ms** | **0.60 ms** | 0.75 ms | 88 B |
| **torque** | `encode_to_iodata/1` | map, binary keys | 1511.6 | 0.66 ms | 0.65 ms | 0.76 ms | **64 B** |
| **torque** | `encode!/1` | map, binary keys | 1509.7 | 0.66 ms | 0.65 ms | 0.78 ms | 88 B |
| **glazer** | `encode/2` | map, binary keys | 857.7 | 1.17 ms | 1.16 ms | 1.36 ms | **64 B** |
| **jiffy** | `encode/1` | proplist, binary keys | 614.5 | 1.63 ms | 1.62 ms | 1.85 ms | 2.97 KB |
| **jiffy** | `encode/1` | map, binary keys | 504.0 | 1.98 ms | 1.97 ms | 2.15 ms | 803.19 KB |
| **otp json** | `json:encode/1` | map, binary keys | 263.6 | 3.79 ms | 3.81 ms | 5.04 ms | 5.40 MB |
| **jason** | `encode_to_iodata!/1` | map, binary keys | 248.4 | 4.03 ms | 3.74 ms | 6.28 ms | 4.96 MB |
| **jason** | `encode!/1` | map, binary keys | 132.8 | 7.53 ms | 7.46 ms | 8.58 ms | 4.96 MB |

**x86_64**

| Library | Function | Input | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|---|---|
| **torque** | `encode!/1` | proplist, binary keys | **782.0** | **1.28 ms** | 1.34 ms | **2.38 ms** | 88 B |
| **torque** | `encode_to_iodata/1` | proplist, binary keys | 780.4 | **1.28 ms** | **1.33 ms** | 2.55 ms | **64 B** |
| **torque** | `encode!/1` | map, binary keys | 657.2 | 1.52 ms | 1.58 ms | 2.81 ms | 88 B |
| **torque** | `encode_to_iodata/1` | map, binary keys | 648.9 | 1.54 ms | 1.57 ms | 2.79 ms | **64 B** |
| **jiffy** | `encode/1` | proplist, binary keys | 379.7 | 2.63 ms | 2.60 ms | 3.31 ms | 2.97 KB |
| **glazer** | `encode/2` | map, binary keys | 371.4 | 2.69 ms | 2.76 ms | 3.89 ms | **64 B** |
| **jiffy** | `encode/1` | map, binary keys | 253.5 | 3.95 ms | 3.73 ms | 5.54 ms | 803.19 KB |
| **otp json** | `json:encode/1` | map, binary keys | 108.5 | 9.22 ms | 8.56 ms | 11.56 ms | 5.40 MB |
| **jason** | `encode_to_iodata!/1` | map, binary keys | 73.1 | 13.67 ms | 13.66 ms | 15.88 ms | 4.96 MB |
| **jason** | `encode!/1` | map, binary keys | 58.6 | 17.05 ms | 17.23 ms | 18.69 ms | 4.96 MB |

### Parse (1.2 KB OpenRTB)

**arm64**

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse | **633.7K** | **1.58 μs** | **1.33 μs** | **3.08 μs** |
| **torque** parse(unique_keys) | 593.1K | 1.69 μs | 1.38 μs | **3.08 μs** |

**x86_64**

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse | **234.6K** | **4.26 μs** | **3.47 μs** | 7.42 μs |
| **torque** parse(unique_keys) | 224.3K | 4.46 μs | 3.54 μs | **7.31 μs** |

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

**arm64**

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse_get_many_nil unique_keys validate: false | **1379K** | **0.73 μs** | **0.71 μs** | **0.83 μs** |
| **torque** parse_get_many_nil unique_keys | 723.8K | 1.38 μs | 1.33 μs | 1.50 μs |
| **torque** parse_get_many_nil | 694.5K | 1.44 μs | 1.33 μs | 1.67 μs |
| **torque** parse(unique_keys) + get_many | 504.8K | 1.98 μs | 1.75 μs | 3.58 μs |
| **torque** parse + get x5 | 482.6K | 2.07 μs | 1.83 μs | 4.00 μs |
| **torque** parse + get_many | 482.4K | 2.07 μs | 1.71 μs | 3.33 μs |
| **glazer** decode + find x5 | 315.7K | 3.17 μs | 3.08 μs | 4.33 μs |

**x86_64**

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse_get_many_nil unique_keys validate: false | **887.7K** | **1.13 μs** | **1.01 μs** | **1.78 μs** |
| **torque** parse_get_many_nil | 533.3K | 1.88 μs | 1.78 μs | 2.54 μs |
| **torque** parse_get_many_nil unique_keys | 528.2K | 1.89 μs | 1.79 μs | 2.55 μs |
| **torque** parse(unique_keys) + get_many | 202.8K | 4.93 μs | 4.04 μs | 13.55 μs |
| **torque** parse + get x5 | 201.8K | 4.96 μs | 4.27 μs | 9.40 μs |
| **torque** parse + get_many | 195.6K | 5.11 μs | 3.95 μs | 8.24 μs |
| **glazer** decode + find x5 | 152.5K | 6.56 μs | 6.34 μs | 10.28 μs |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Integer map keys are lossy**: JSON object names must be strings (RFC 8259 §4), so `encode/1` stringifies integer keys and `decode/1` gives them back as binaries — `%{1 => "a"}` round-trips to `%{"1" => "a"}`. A map mixing both forms, like `%{1 => "a", "1" => "b"}`, encodes to duplicate names (`{"1":"a","1":"b"}`); RFC 8259 says names *should* be unique, and decoders resolve the collision however they choose. Jason behaves identically.
- **Nesting depth**: JSON documents nested deeper than 128 levels return `{:error, :nesting_too_deep}` from `decode/1`, `parse/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF (the dirty CPU scheduler, used for inputs over 20 KB, has a small stack).

## License

MIT
