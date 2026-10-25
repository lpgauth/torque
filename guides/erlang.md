# Erlang API

The `torque` module is Torque's Erlang API. It wraps the same NIFs as the
Elixir `Torque` module and follows Erlang conventions:

- JSON null is the atom `null`.
- In the bulk lookups a path the document does not contain returns
  `undefined`, so it stays distinct from a JSON null.
- Results are `{ok, _} | {error, _}` tuples; options are proplists, and an
  unknown option raises `{invalid_option, Opt}`.
- Objects decode to maps with binary keys, arrays to lists and strings to
  binaries. Integers outside the 64-bit range decode as exact bignums.
- Inputs larger than 20 KB run on a dirty CPU scheduler.

Documents and pointer handles answer with the atoms of the API that created
them: use handles from `torque` with `torque`.

In an OTP 27+ shell the same documentation is available with
`h(torque)` and `h(torque, decode)`.

## Installation

```erlang
%% rebar.config
{deps, [torque]}.
```

A rebar3 build fetches the precompiled NIF for the platform from the GitHub
release, checks it against the checksums shipped in the package, and caches it
in the user cache directory. That needs OTP 25 or later. Precompiled NIFs cover
macOS and glibc Linux on `aarch64` and `x86_64`.

| Variable | Effect |
|---|---|
| `TORQUE_BUILD=true` | Build the NIF with cargo instead (any platform, needs a Rust toolchain) |
| `TORQUE_CPU_VARIANT=v3` | Force an x86_64 variant (`v3`, `v2`, anything else for the baseline) |
| `TORQUE_NIF_TARGET=<triple>` | Fetch the NIF for another platform, e.g. `x86_64-unknown-linux-gnu` |

## Decoding

### `decode(Json) -> {ok, json()} | {error, Reason}`

Same as `decode(Json, [])`.

### `decode(Json, Opts) -> {ok, json()} | {error, Reason}`

Decodes a JSON binary. `Reason` is a message binary for malformed input, or
`nesting_too_deep` past 128 levels.

Options: `{strings, reference | copy}`. With `reference` (the default), strings
longer than 64 bytes that needed no unescaping are sub-binaries of `Json`,
which keeps all of it alive while any of them is; `copy` gives every string its
own binary.

```erlang
{ok, #{<<"a">> := null, <<"b">> := [1, 2]}} = torque:decode(<<"{\"a\":null,\"b\":[1,2]}">>).
```

## Encoding

### `encode(Term) -> {ok, binary()} | {error, Reason}`

Same as `encode(Term, [])`.

### `encode(Term, Opts) -> {ok, binary()} | {error, Reason}`

Encodes a term as JSON. `null` encodes as JSON null; `true` and `false` as
booleans; other atoms as strings. Maps take atom, binary or integer keys, and
jiffy-style `{Proplist}` tuples encode as objects.

Options: `dirty` (or `{dirty, true}`) runs the encode on a dirty CPU scheduler,
for terms expected to produce large output; `pretty` (or `{pretty, true}`)
indents nested members by two spaces, and `{pretty, Indent}` uses the binary
`Indent`, up to 16 spaces and tabs, as the indent unit.

`Reason` is one of `unsupported_type`, `invalid_utf8`, `invalid_key`,
`malformed_proplist`, `non_finite_float` or `nesting_too_deep`.

```erlang
{ok, <<"{\"a\":null}">>} = torque:encode(#{a => null}),
{ok, <<"{\"k\":[1,true]}">>} = torque:encode({[{k, [1, true]}]}),
{ok, <<"{\n  \"k\": 1\n}">>} = torque:encode(#{k => 1}, [pretty]),
{ok, <<"{\n\t\"k\": 1\n}">>} = torque:encode(#{k => 1}, [{pretty, <<"\t">>}]).
```

## Querying a parsed document

Paths are JSON Pointers (RFC 6901), such as `<<"/site/domain">>` or
`<<"/imp/0/banner/w">>`. A malformed pointer matches nothing.

### `parse(Json) -> {ok, document()} | {error, Reason}`

Same as `parse(Json, [])`.

### `parse(Json, Opts) -> {ok, document()} | {error, Reason}`

Parses a JSON binary into a document to query. Options: `{unique_keys, true}`
speeds up key lookups when the document has no duplicate keys (the last value
wins by default).

### `get(Doc, Path) -> {ok, json()} | {error, no_such_field | nesting_too_deep}`

Returns the value at `Path`.

### `get(Doc, Path, Default) -> json() | Default`

Returns the value at `Path`, or `Default` when there is none.

### `get_many(Doc, Paths) -> [{ok, json()} | {error, Reason}]`

Looks up several paths in one call, each as `get/2` would.

### `get_many_values(Doc, Paths | Pointers) -> [json() | undefined]`

Looks up several paths in one call, returning bare values: `undefined` for a
path the document does not contain. Takes a list of pointers or a handle from
`compile_pointers/1,2`.

### `length(Doc, Path) -> non_neg_integer() | undefined`

Returns the length of the array at `Path`, or `undefined` when the path does
not exist or is not an array.

```erlang
{ok, Doc} = torque:parse(Json),
{ok, Domain} = torque:get(Doc, <<"/site/domain">>),
[Id, undefined] = torque:get_many_values(Doc, [<<"/id">>, <<"/missing">>]).
```

## Compiled pointers

For a fixed set of paths read from every document, compile them once and
extract them in a single pass, without building the document.

### `compile_pointers(Paths) -> pointers()`

Same as `compile_pointers(Paths, [])`.

### `compile_pointers(Paths, Opts) -> pointers()`

Compiles a fixed set of JSON Pointers once, for `get_many_values/2` and
`parse_get_many_values/2`. Raises `badarg` for a malformed pointer.

Options: `{unique_keys, boolean()}` as in `parse/2`, and `{validate, false}` to
skip regions no path selects without validating their syntax: faster when the
paths select a small part of the document, and only for trusted input.

### `parse_get_many_values(Json, Pointers) -> {ok, [json() | undefined]} | {error, Reason}`

Parses `Json` and returns the values at the compiled pointers in one pass,
without building the document: `undefined` for a path the document does not
contain.

```erlang
Pointers = torque:compile_pointers([<<"/id">>, <<"/site/domain">>], [{unique_keys, true}]),
{ok, [Id, Domain]} = torque:parse_get_many_values(Json, Pointers).
```
