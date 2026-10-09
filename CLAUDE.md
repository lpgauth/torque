# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
TORQUE_BUILD=true mix deps.get     # fetch deps + force local Rust build
TORQUE_BUILD=true mix compile      # build (includes Rust NIF compilation)
TORQUE_BUILD=true mix test         # run all tests
mix test test/pointer_test.exs:42  # run single test by line number
mix compile --warnings-as-errors   # build with strict warnings
mix format                         # format Elixir code
mix format --check-formatted       # check Elixir formatting
mix dialyzer                       # static type analysis
cargo fmt                          # format Rust code (run from repo root)
cargo fmt --check                  # check Rust formatting
cargo clippy -- -D warnings        # Rust linter
TORQUE_BUILD=true rebar3 eunit     # Erlang API under a rebar3 build (builds into _build/rebar3)
MIX_ENV=bench mix run bench/torque_bench.exs  # run benchmarks
```

`TORQUE_BUILD=true` is required for local development. Both build tools get the NIF from `rebar/fetch_nif.escript`: Mix through the `:torque_nif` compiler defined at the top of `mix.exs`, which runs before the Elixir compiler on every `mix compile`, and rebar3 through a pre-compile hook. With the variable set the script runs `cargo build --release` in `native/torque_nif` (so the repository's `.cargo/config.toml` and its `target-cpu=native` apply) and reinstalls `priv/native/torque_nif.so` only when the bytes change; cargo decides what is stale, the vendored sonic-rs included. Without it the script downloads the release asset for the app file's version, which exists only for published versions. `priv/native/torque_nif.stamp` records where the installed library came from (an asset name or `source`), so switching between the two never leaves a released binary running against local Rust changes.

## Profile-Guided Optimisation (PGO)

```bash
./scripts/pgo-build.sh   # instrument -> run workload -> merge -> rebuild optimised
```

Produces an optimised `priv/native/torque_nif.so` (typically 5-15% faster on
JSON-heavy work than plain `-O3`). The script builds an instrumented NIF, runs
`bench/pgo_workload.exs` to collect branch/call-frequency data, merges the raw
`*.profraw` counters with `llvm-profdata`, then rebuilds with `-Cprofile-use`.
Like any `TORQUE_BUILD` build it overwrites `priv/native/torque_nif.so`. Run
`TORQUE_BUILD=true mix compile --force` to restore a plain build: the variable
selects the source build, and `--force` replaces the profiled artifact even when
the sources are unchanged.

Notes:
- rustc is LLVM-based, so PGO uses the same `llvm-profdata merge` step as a
  Clang PGO build. The merge tool's LLVM major version **must** match rustc's
  (`rustc -vV`); the script auto-detects a matching one (rustup
  `llvm-tools-preview`, Homebrew `llvm@<major>`, or PATH) — override with
  `LLVM_PROFDATA=...` if detection misses.
- Setting `RUSTFLAGS` replaces `native/torque_nif/.cargo/config.toml`'s
  rustflags rather than merging, so the script re-states `-C target-cpu=native`.
  Keep `BASE_RUSTFLAGS` in `scripts/pgo-build.sh` in sync with that config.
- Point the script at a different workload with `WORKLOAD=path/to.exs`.

The release workflow (`release.yml`) applies the same profile → rebuild step to
the targets it builds on a native runner (`aarch64-apple-darwin`,
`x86_64-unknown-linux-gnu`): it builds an instrumented NIF, runs
`bench/pgo_workload.exs` through the BEAM to collect a same-arch profile, then
rebuilds with `-Cprofile-use`. The cross-compiled targets (`x86_64-apple-darwin`
built on the arm runner, and `aarch64-unknown-linux-gnu` via `cross`) build
plain `-O3`, because PGO needs to *run* the instrumented binary and there's no
native runner for them. Trigger `release.yml` via `workflow_dispatch` to
build-and-profile every target without publishing (create/upload are gated on a
tag).

## Releasing

```bash
export HEX_API_KEY=...   # key with api:write permission
./scripts/release.sh     # tag, wait for CI, checksums, commit, publish
```

The script reads the version from `mix.exs`, creates a git tag, waits for the
release workflow to build precompiled NIFs for all targets, generates checksums,
commits and pushes them, then runs `mix hex.publish --yes`.

`HEX_API_KEY` is Hex's unencrypted write key: setting it skips the local-password
prompt, which is what makes the publish step non-interactive. Mint one with
`mix hex.user key generate --key-name torque-release --permission api:write`.
The script fails up front (before tagging) if it's missing. To stop after
checksums and publish by hand instead, run with `SKIP_PUBLISH=1`.

### Version bumping

The version lives in **four files**: `@version` in `mix.exs`, `version` in
`native/torque_nif/Cargo.toml`, `vsn` in `src/torque.app.src` (all three must
match: `release.sh` refuses to tag on a mismatch, and a rebar3 build fetches
the NIF for the app file's version), and the two install snippets (Mix and
rebar3) in `README.md`. To bump:

1. Edit `@version` in `mix.exs`, `version` in `native/torque_nif/Cargo.toml`,
   `vsn` in `src/torque.app.src`, and both dep snippets in `README.md`.
2. Run `TORQUE_BUILD=true mix compile` once so `Cargo.lock` picks up the crate
   version.
3. Commit all five files (`mix.exs`, `Cargo.toml`, `Cargo.lock`,
   `src/torque.app.src`, `README.md`) together as a single
   `Bump version to x.y.z` commit (see faaa403) before running
   `./scripts/release.sh`.

## Architecture

Torque is a high-performance JSON library for Elixir using Rustler NIFs backed by sonic-rs (SIMD-accelerated JSON). sonic-rs is **vendored** under `native/sonic-rs/` with Torque patches, each listed in that crate's `Cargo.toml`. The main ones: its native push-based `JsonVisitor` is made public, its parser is capped at 128 nesting levels so deeply nested input returns an error instead of overflowing the stack, an `extract` module walks a compiled path set in one pass, and integers beyond 64 bits stay exact on every path (raw-number DOM nodes, `Extracted::BigInt`, and `Parser::huge_int` recovering integers too large even for `f64` from `parse_number`'s error branch). Two skip-path fixes ride along: checked `skip_string` scans with `StringBlock` instead of the generic 32-lane bitmask NEON has to emulate, and `Read` caches the pinned input's slice pointer because the enum lookup stopped inlining inside the skip path.

### Decoding Strategies

1. **Parse + Get** — `parse/1` returns an opaque reference to a parsed document (`sonic_rs::Value`). `get/2,3` extracts fields by JSON Pointer (RFC 6901) path via `value_to_term`. `get_many/2` extracts multiple fields in a single NIF call. Ideal when only a subset of fields is needed.

2. **Compiled pointers** — for a *fixed* set of paths extracted from every document, `compile_pointers/2` pre-parses the pointer strings once into a `CompiledPaths` resource (`PathSeg::Key` / `PathSeg::Num{idx,key}`, with `~`-unescaping and array-index-vs-object-key resolution done up front) and an `ExtractPlan` trie (`native/sonic-rs/src/extract.rs`). `parse_get_many_nil/2` walks the document once through that plan: values are built only where a path ends, everything else is skipped, and no `Value` DOM is materialized. Unescaped strings longer than 64 bytes come back as sub-binaries of the input when the input is small or the strings cover enough of it (`borrow_input` in `decoder.rs`), so a short field pulled from a large feed does not pin the feed; shorter ones are copied straight into heap binaries, which is what ERTS would do with the sub-binary anyway. Scalars come back as bare `Extracted` variants, and a selected container is validated by the checked skip and returned as its byte span (`Extracted::Raw`), which the NIF decodes with the fused decoder (`native_decode::decode_span`) instead of building a `Value` arena; only a container that a longer path descends into still goes through `Value`. Checked skipping keeps `parse_number` rather than the SIMD `do_skip_number` because it is what rejects non-finite floats such as `1e400`. Result lists are consed from the back rather than staged in a buffer. The handle carries `unique_keys` and `validate`: with `validate: false` unselected regions are skipped structurally (bracket and quote scan) instead of tokenized, so syntax errors inside them and trailing content go unreported; truncation, invalid UTF-8 in consumed bytes, and errors in selected values are still rejected. Measured 2026-10-06 on PGO builds with the `bench/torque_bench.exs` payloads, against `parse/2` + `get_many_nil/2` with the same handle: on an M1 Pro ~3× on the 1.2 KB request read through all 51 of its fields, ~1.3× through 3 paths, parity on the 776 KB feed; on the x86 bench host (Xeon E5-2630 v3) ~3.6×, ~3× and ~3.2×, because building the `Value` DOM is relatively much slower there (1.46 ms for the feed vs 0.43 ms on the M1). `validate: false` against a validated handle, on both: ~1.9× for 3 paths on the request, ~3.8-4.1× on the feed, 3-7% slower for all 51 fields. `get_many_nil/2` also accepts a compiled handle to query an already-parsed doc. Note: sonic-rs's own lazy `get_many` over a `PointerTree` was measured ~6× *slower* here because per-call `PointerTree` construction dominates.

3. **Full decode** — `decode/1` builds Erlang terms directly during the SIMD parse by implementing sonic-rs's native `JsonVisitor` (`native_decode.rs`): single pass, no intermediate `Value`, zero-copy sub-binaries for unescaped strings, and a per-call key cache that decodes a key repeated across objects (the common array-of-records shape) to one shared term (median −3–4%, p99 −16%, decoded-term heap −37% on record-shaped payloads).

### Encoding

`encode/1` walks Elixir terms directly (no intermediate representation) and writes JSON bytes to a buffer. Supports maps (atom/binary/integer keys — integer keys are stringified, since JSON object names must be strings), lists, numbers, booleans, nil, and jiffy-style `{proplist}` tuples.

Structs go through the optional `Torque.Encoder` protocol, and the split between NIF and BEAM is deliberate: the NIF cannot call an Elixir protocol, so `encode_map` fails the whole encode with `:unhandled_struct` the moment a key compares equal to the `__struct__` atom, and `Torque.normalize/1` then walks the term on the BEAM, replaces every struct with its protocol output, and retries the NIF once. Detection rides on the key iteration the encoder already does rather than a per-map `enif_get_map_value`, which would rescan the flatmap key array the loop is about to walk (measured 2-3% on map-heavy payloads, 3-5% on arrays of tiny maps). `normalize/1` returns containers untouched when nothing inside them changed, so one struct in a large document does not rebuild the whole document. Expansion is bounded at 128 struct levels and reports `:encoder_expansion_too_deep`, because an implementation returning the struct itself would otherwise expand forever; the bound is thrown from inside the walk and caught at the entry point so `encode/2` can stay a non-raising function. Protocol consolidation is off in `:test` only (`mix.exs`), because test fixtures define implementations after consolidation would have run.

Strings go through `escape.rs`'s `write_json_string`, which reserves once for the quotes and worst-case body and scans strings shorter than `SHORT_STRING` (32 bytes) eight bytes at a time before handing the first special byte to the SIMD kernels. It returns a resume offset rather than a clean/dirty verdict, so a late escape does not rescan the clean prefix. The six SIMD kernels repeat the same emit blocks by hand on purpose: factoring them into helpers changes how they inline under the fat-LTO build and measured slower on escape-heavy and UTF-8-heavy input. An escape is emitted as two fixed-width stores, the whole input chunk and all 8 bytes of its `QUOTE_TAB` entry, each later partly overwritten; the variable-length copies they replaced were `memcpy` calls (-13% instructions, -8% cycles on escape-heavy records). The worst-case reservation is what makes the overrun safe.

Atom names are read as Latin-1 into a stack buffer, because `ERL_NIF_UTF8` needs NIF 2.17 and the NIF still loads on 2.15. A name with any character above U+00FF makes that read fail, so those atoms go through `enif_term_to_binary` and the name is taken from the `SMALL_ATOM_UTF8_EXT` / `ATOM_UTF8_EXT` payload instead. Only the names the Latin-1 read rejects pay for that binary.

A name that fits in 32 quoted, escaped bytes is read once per scheduler thread: `AtomNames` in `encoder.rs` keeps that spelling in a 512-slot table indexed by atom-table index and keyed by the raw term. Atoms are never garbage collected, so an entry stays valid for the life of the VM, and raw terms of different types never compare equal, so a hit needs no type check. It took atom keys from ~62% slower than binary keys to ~15% faster than them. The table rides in the same thread-local `Scratch` as the output buffer, and the encoder passes `&mut Scratch` down the recursion rather than the buffer and the table separately: the extra argument spilled the map iterator's terms around `enif_map_iterator_next` and cost 18% on small binary-keyed maps.

### Erlang and rebar3

One Hex package serves both build tools. rebar3 prefers a rebar3-buildable app when a package also has `mix.exs`, so `src/torque.app.src` and `rebar.config` make it build Torque itself rather than through rebar_mix. Mix compiles `src/` too (the `torque` Erlang API module), so an Erlang library depending on Torque works inside an Elixir project; it never compiles `rebar/src/`, which holds the rebar3-only `Elixir.Torque.Native` loader (the NIF registers under that name). `rebar/fetch_nif.escript` serves both build tools: it maps `system_architecture` (or `TORQUE_NIF_TARGET`) and the x86 flag sets to a release asset, downloads it over verified TLS, checks it against `checksums.txt` (`shasum -a 256` output that `release.sh` generates from the release's assets), and caches it under the user cache directory, or runs cargo with `TORQUE_BUILD=true`. Sharing it is what keeps the package free of Hex dependencies: rebar3 resolves a package's dependencies from its Hex metadata and cannot build Mix projects, so the 0.5.0 that still depended on `rustler_precompiled` was pulled from Hex before it could be fixed. A published binary only loads into a build of the same NIF sources, so CI's download step stops at a verified install. `rebar.config` sets `base_dir` to `_build/rebar3` because Mix also builds into `_build/test/lib/torque`.

The Erlang API wants `null` for JSON null and `undefined` for a missing path where Elixir uses `nil` for both, so the NIFs take those atoms as arguments rather than hardcoding `nil`: `ParsedDocument` and `CompiledPaths` store them (lookups use the document's, fused extraction the handle's), `decode_opts` takes the null atom, and the encoder keeps the atom that encodes as JSON null in the `Scratch` it already carries, set on entry to each call. The null check comes before the atom-name cache, so a name cached while that atom was an ordinary one never decides what a later call writes. Elixir passes `nil` everywhere, through the same NIFs.

### Panic Strategy

The release profile keeps `panic = "abort"`, so a panic anywhere in the NIF (including the vendored sonic-rs, which parses untrusted input) takes down the whole node instead of becoming an Erlang exception through Rustler's `catch_unwind`. Measured on PGO builds (2026-10-06, Apple M1 Pro, two builds per setting): unwinding costs 7-8% on large encodes and 2-3% on small ones; decode, parse and extraction are unchanged. Dropping the `Drop` impl from `MapEntries` so `encode_map` needs no unwind cleanup won back only ~1.5 points, within noise, so the cost is spread across the encoder rather than in one landing pad. Revisit with fresh measurements before switching.

### Scheduler Awareness

Decode/parse inputs larger than 20 KB are automatically dispatched to dirty CPU schedulers to avoid blocking normal BEAM schedulers. Encoding cannot cheaply predict output size, so dirty dispatch is opt-in via `dirty: true` on `encode/2`, `encode!/2`, and `encode_to_iodata/2`. The `get` family always runs on a normal scheduler. Its pointer traversal is sub-microsecond, but building the result costs as much as the selected subtree, so `get(doc, "")` on a large document blocks a normal scheduler for that long: `consume_timeslice` only reports the work afterwards. A term budget with a dirty retry was designed and deferred.

### Type Conversion

| JSON | Elixir |
|------|--------|
| object | map with binary keys |
| array | list |
| string | binary |
| integer | integer (i64/u64) |
| float | float |
| true/false | true/false |
| null | nil |

### Key Files

- `lib/torque.ex` — public API with `@doc`, typespecs, dirty scheduler dispatch
- `lib/torque/native.ex`: NIF stubs and the `@on_load` that loads `priv/native/torque_nif`
- `src/torque.erl`: Erlang API (`null` / `undefined` conventions); compiled by both Mix and rebar3
- `rebar/fetch_nif.escript`: installs the NIF for both build tools (precompiled download with x86 variant selection and checksum check, or cargo); `mix.exs` runs it through `Mix.Tasks.Compile.TorqueNif`
- `src/torque.app.src`, `rebar.config`, `rebar/src/Elixir.Torque.Native.erl`: the rebar3 build (app file, pre-compile hook, rebar3-only NIF loader)
- `lib/torque/encoder.ex`: `Torque.Encoder` protocol, `@derive` support via `__deriving__/3` on the `Any` impl, built-in `Date`/`Time`/`NaiveDateTime`/`DateTime` implementations
- `native/torque_nif/src/lib.rs` — NIF registration, `ParsedDocument` + `CompiledPaths` (`PathSeg`) resources
- `native/torque_nif/src/decoder.rs` — parse, get, get_many, get_many_nil, decode NIFs; compiled-pointer + fused `parse_get_many_nil` path
- `native/torque_nif/src/native_decode.rs` — fused decoder; builds terms during the SIMD parse via sonic-rs's `JsonVisitor`
- `native/torque_nif/src/encoder.rs` — direct term-walking JSON encoder
- `native/torque_nif/src/types.rs` — sonic_rs Value → Erlang term conversion (used by get/get_many)
- `native/torque_nif/src/escape.rs`: SIMD string escaping and UTF-8 validation for the encoder (NEON, AVX2, SSE2 and scalar kernels)
- `native/torque_nif/src/nif_util.rs`: map building with the duplicate-key fallback, forward map iterator, timeslice accounting
- `native/torque_nif/src/atoms.rs` — cached atoms (ok, error, nil, no_such_field, nesting_too_deep, unsupported_type, non_finite_float, invalid_key, malformed_proplist, invalid_utf8, unhandled_struct, `__struct__`)
- `native/sonic-rs/`: vendored, Torque-patched sonic-rs (patch list in its `Cargo.toml`)
