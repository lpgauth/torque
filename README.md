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
| **torque** | **403.3K** | **2.48 μs** | **2.38 μs** | **2.79 μs** | 1.56 KB |
| **glazer** | 351.5K | 2.85 μs | 2.75 μs | 3.67 μs | 1.56 KB |
| **jiffy** | 205.2K | 4.87 μs | 4.54 μs | 8.25 μs | **1.55 KB** |
| **otp json** | 138.8K | 7.20 μs | 7.00 μs | 10.71 μs | 7.73 KB |
| **jason** | 103.8K | 9.63 μs | 9.13 μs | 15.91 μs | 9.54 KB |

**x86_64**

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **170.8K** | **5.85 μs** | **5.64 μs** | **9.31 μs** | 1.56 KB |
| **glazer** | 167.5K | 5.97 μs | 5.71 μs | 10.04 μs | 1.56 KB |
| **jiffy** | 90.6K | 11.03 μs | 9.57 μs | 21.12 μs | **1.55 KB** |
| **otp json** | 60.1K | 16.63 μs | 16.11 μs | 24.10 μs | 7.73 KB |
| **jason** | 53.0K | 18.87 μs | 18.27 μs | 28.57 μs | 9.46 KB |

### Decode (750 KB Twitter)

**arm64**

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **740.9** | **1.35 ms** | **1.24 ms** | **1.71 ms** | **1.57 KB** |
| **glazer** | 611.9 | 1.63 ms | 1.55 ms | 2.06 ms | 1.58 KB |
| **jiffy** | 298.1 | 3.35 ms | 3.47 ms | 3.81 ms | 2.30 MB |
| **otp json** | 205.2 | 4.87 ms | 4.93 ms | 5.59 ms | 2.48 MB |
| **jason** | 143.2 | 6.99 ms | 6.95 ms | 7.39 ms | 3.54 MB |

**x86_64**

| Library | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|
| **torque** | **357.2** | **2.80 ms** | **2.81 ms** | **3.68 ms** | **1.57 KB** |
| **glazer** | 344.1 | 2.91 ms | 2.91 ms | 3.73 ms | 1.58 KB |
| **jiffy** | 146.5 | 6.82 ms | 6.14 ms | 8.71 ms | 2.30 MB |
| **otp json** | 88.6 | 11.29 ms | 11.41 ms | 14.06 ms | 2.48 MB |
| **jason** | 70.8 | 14.11 ms | 13.99 ms | 16.97 ms | 3.54 MB |

### Encode (1.2 KB OpenRTB)

**Function** is the call benchmarked. Torque's `encode!/1` raises on error
and `encode_to_iodata/1` returns the same binary without the `{:ok, _}` tuple;
Jason's `encode_to_iodata!/1`, jiffy and `json:encode/1` return iodata.
**Input** is the term encoded: this payload is a bid response with atom keys,
the 750 KB one below is decoded JSON, so its keys are binaries.

**arm64**

| Library | Function | Input | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|---|---|
| **torque** | `encode_to_iodata/1` | proplist, atom keys | **2390K** | **0.42 μs** | **0.33 μs** | **0.46 μs** | **64 B** |
| **torque** | `encode!/1` | map, atom keys | 2200K | 0.45 μs | 0.42 μs | 0.50 μs | 88 B |
| **torque** | `encode!/1` | proplist, atom keys | 2150K | 0.46 μs | 0.38 μs | 0.50 μs | 88 B |
| **torque** | `encode_to_iodata/1` | map, atom keys | 2150K | 0.46 μs | 0.38 μs | 0.50 μs | **64 B** |
| **otp json** | `json:encode/1` | map, atom keys | 1120K | 0.89 μs | 0.83 μs | 1.12 μs | 3.84 KB |
| **glazer** | `encode/2` | map, atom keys | 1100K | 0.91 μs | 0.83 μs | 1.00 μs | **64 B** |
| **jiffy** | `encode/2` | proplist, atom keys | 860K | 1.16 μs | 1.04 μs | 1.21 μs | 120 B |
| **jiffy** | `encode/1` | map, atom keys | 680K | 1.46 μs | 1.33 μs | 1.54 μs | 632 B |
| **jason** | `encode_to_iodata!/1` | map, atom keys | 590K | 1.69 μs | 1.62 μs | 2.42 μs | 3.76 KB |
| **jason** | `encode!/1` | map, atom keys | 370K | 2.69 μs | 2.50 μs | 4.08 μs | 3.82 KB |

**x86_64**

| Library | Function | Input | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|---|---|
| **torque** | `encode_to_iodata/1` | proplist, atom keys | **1015K** | **0.99 μs** | **0.85 μs** | **1.18 μs** | **64 B** |
| **torque** | `encode!/1` | proplist, atom keys | 992.8K | 1.01 μs | 0.87 μs | 1.23 μs | 88 B |
| **torque** | `encode_to_iodata/1` | map, atom keys | 923.5K | 1.08 μs | 0.95 μs | 1.22 μs | **64 B** |
| **torque** | `encode!/1` | map, atom keys | 911.3K | 1.10 μs | 0.97 μs | 1.24 μs | 88 B |
| **glazer** | `encode/2` | map, atom keys | 470.8K | 2.12 μs | 1.95 μs | 2.68 μs | **64 B** |
| **otp json** | `json:encode/1` | map, atom keys | 433.3K | 2.31 μs | 2.02 μs | 3.42 μs | 3.84 KB |
| **jiffy** | `encode/2` | proplist, atom keys | 401.9K | 2.49 μs | 2.14 μs | 3.19 μs | 120 B |
| **jiffy** | `encode/1` | map, atom keys | 332.4K | 3.01 μs | 2.66 μs | 3.86 μs | 632 B |
| **jason** | `encode_to_iodata!/1` | map, atom keys | 225.4K | 4.44 μs | 3.51 μs | 7.00 μs | 3.76 KB |
| **jason** | `encode!/1` | map, atom keys | 171.4K | 5.83 μs | 5.10 μs | 10.22 μs | 3.82 KB |

### Encode (750 KB Twitter)

**arm64**

| Library | Function | Input | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|---|---|
| **torque** | `encode!/1` | proplist, binary keys | **1646.1** | **0.61 ms** | **0.59 ms** | 0.69 ms | 88 B |
| **torque** | `encode_to_iodata/1` | proplist, binary keys | 1639.8 | **0.61 ms** | 0.60 ms | **0.68 ms** | **64 B** |
| **torque** | `encode_to_iodata/1` | map, binary keys | 1517.4 | 0.66 ms | 0.65 ms | 0.73 ms | **64 B** |
| **torque** | `encode!/1` | map, binary keys | 1514.0 | 0.66 ms | 0.64 ms | 0.77 ms | 88 B |
| **glazer** | `encode/2` | map, binary keys | 873.8 | 1.14 ms | 1.13 ms | 1.32 ms | **64 B** |
| **jiffy** | `encode/1` | proplist, binary keys | 610.0 | 1.64 ms | 1.62 ms | 1.86 ms | 2.97 KB |
| **jiffy** | `encode/1` | map, binary keys | 463.6 | 2.16 ms | 2.05 ms | 2.66 ms | 803.19 KB |
| **otp json** | `json:encode/1` | map, binary keys | 259.1 | 3.86 ms | 4.23 ms | 5.08 ms | 5.40 MB |
| **jason** | `encode_to_iodata!/1` | map, binary keys | 249.3 | 4.01 ms | 3.71 ms | 5.98 ms | 4.96 MB |
| **jason** | `encode!/1` | map, binary keys | 134.2 | 7.45 ms | 7.31 ms | 8.52 ms | 4.96 MB |

**x86_64**

| Library | Function | Input | ips | mean | median | p99 | memory |
|---|---|---|---|---|---|---|---|
| **torque** | `encode!/1` | proplist, binary keys | **786.2** | **1.27 ms** | **1.34 ms** | **2.30 ms** | 88 B |
| **torque** | `encode_to_iodata/1` | proplist, binary keys | 765.6 | 1.31 ms | 1.35 ms | 2.35 ms | **64 B** |
| **torque** | `encode_to_iodata/1` | map, binary keys | 650.3 | 1.54 ms | 1.58 ms | 2.53 ms | **64 B** |
| **torque** | `encode!/1` | map, binary keys | 649.2 | 1.54 ms | 1.58 ms | 2.54 ms | 88 B |
| **jiffy** | `encode/1` | proplist, binary keys | 376.8 | 2.65 ms | 2.52 ms | 3.53 ms | 2.97 KB |
| **glazer** | `encode/2` | map, binary keys | 368.2 | 2.72 ms | 2.79 ms | 3.59 ms | **64 B** |
| **jiffy** | `encode/1` | map, binary keys | 256.3 | 3.90 ms | 3.68 ms | 5.45 ms | 803.19 KB |
| **otp json** | `json:encode/1` | map, binary keys | 108.2 | 9.25 ms | 8.60 ms | 11.93 ms | 5.40 MB |
| **jason** | `encode_to_iodata!/1` | map, binary keys | 73.4 | 13.62 ms | 13.64 ms | 15.42 ms | 4.96 MB |
| **jason** | `encode!/1` | map, binary keys | 58.4 | 17.12 ms | 17.22 ms | 19.14 ms | 4.96 MB |

### Parse (1.2 KB OpenRTB)

**arm64**

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse | **616.3K** | **1.62 μs** | **1.29 μs** | **2.83 μs** |
| **torque** parse(unique_keys) | 597.1K | 1.67 μs | 1.33 μs | 3.08 μs |

**x86_64**

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse | **243.3K** | **4.11 μs** | **3.31 μs** | 6.96 μs |
| **torque** parse(unique_keys) | 232.6K | 4.30 μs | 3.43 μs | **6.48 μs** |

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
| **torque** parse_get_many_nil unique_keys validate: false | **1339K** | **0.75 μs** | **0.71 μs** | **0.83 μs** |
| **torque** parse_get_many_nil unique_keys | 713.4K | 1.40 μs | 1.38 μs | 1.50 μs |
| **torque** parse_get_many_nil | 709.8K | 1.41 μs | 1.38 μs | 1.54 μs |
| **torque** parse(unique_keys) + get_many | 514.8K | 1.94 μs | 1.75 μs | 3.29 μs |
| **torque** parse + get x5 | 486.6K | 2.05 μs | 1.83 μs | 3.79 μs |
| **torque** parse + get_many | 485.5K | 2.06 μs | 1.71 μs | 3.33 μs |
| **glazer** decode + find x5 | 316.4K | 3.16 μs | 3.08 μs | 4.04 μs |

**x86_64**

| Library | ips | mean | median | p99 |
|---|---|---|---|---|
| **torque** parse_get_many_nil unique_keys validate: false | **917.7K** | **1.09 μs** | **1.00 μs** | **1.63 μs** |
| **torque** parse_get_many_nil | 532.9K | 1.88 μs | 1.78 μs | 2.41 μs |
| **torque** parse_get_many_nil unique_keys | 532.8K | 1.88 μs | 1.77 μs | 2.42 μs |
| **torque** parse(unique_keys) + get_many | 206.7K | 4.84 μs | 3.96 μs | 12.93 μs |
| **torque** parse + get x5 | 204.5K | 4.89 μs | 4.22 μs | 9.29 μs |
| **torque** parse + get_many | 198.0K | 5.05 μs | 3.88 μs | 8.12 μs |
| **glazer** decode + find x5 | 149.9K | 6.67 μs | 6.45 μs | 10.81 μs |

Run benchmarks locally:

```bash
MIX_ENV=bench mix run bench/torque_bench.exs
```

## Limitations

- **Integer map keys are lossy**: JSON object names must be strings (RFC 8259 §4), so `encode/1` stringifies integer keys and `decode/1` gives them back as binaries — `%{1 => "a"}` round-trips to `%{"1" => "a"}`. A map mixing both forms, like `%{1 => "a", "1" => "b"}`, encodes to duplicate names (`{"1":"a","1":"b"}`); RFC 8259 says names *should* be unique, and decoders resolve the collision however they choose. Jason behaves identically.
- **Nesting depth**: JSON documents nested deeper than 128 levels return `{:error, :nesting_too_deep}` from `decode/1`, `parse/1`, `get/2`, `get_many/2`, and `encode/1` rather than crashing the VM. Real-world documents are never this deep; the limit exists to prevent stack overflow in the NIF (the dirty CPU scheduler, used for inputs over 20 KB, has a small stack).

## License

MIT
