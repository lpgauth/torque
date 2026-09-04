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
MIX_ENV=bench mix run bench/torque_bench.exs  # run benchmarks
```

`TORQUE_BUILD=true` is required for local development to force compilation from Rust source instead of downloading precompiled binaries. Without it, `RustlerPrecompiled` will try to fetch binaries from GitHub releases. The flag is read when `Torque.Native` compiles, so `Torque.Build` (`lib/torque/build.ex`) makes it part of that module's staleness through `__mix_recompile__?/0`: without it a `_build` tree made without the variable keeps loading a downloaded NIF however later commands are invoked, which silently runs a *released* binary against local Rust changes and reports a green suite. The check cannot live in `Torque.Native`, because a module whose `on_load` fails is not loadable and Mix cannot ask it anything.

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

The version lives in **three places**: `@version` in `mix.exs`, `version` in
`native/torque_nif/Cargo.toml` (these two must match — `release.sh` refuses
to tag on a mismatch), and the `{:torque, "~> x.y.z"}` install snippet in
`README.md`. To bump:

1. Edit `@version` in `mix.exs`, `version` in `native/torque_nif/Cargo.toml`,
   and the dep snippet in `README.md`.
2. Run `TORQUE_BUILD=true mix compile` once so `Cargo.lock` picks up the crate
   version.
3. Commit all four files (`mix.exs`, `Cargo.toml`, `Cargo.lock`, `README.md`)
   together as a single `Bump version to x.y.z` commit (see faaa403) before
   running `./scripts/release.sh`.

## Architecture

Torque is a high-performance JSON library for Elixir using Rustler NIFs backed by sonic-rs (SIMD-accelerated JSON). sonic-rs is **vendored** under `native/sonic-rs/` with a minimal patch (see that crate's `Cargo.toml`): its native push-based `JsonVisitor` is made public, and its DOM parser is capped at 128 nesting levels so deeply nested input returns an error instead of overflowing the stack.

### Decoding Strategies

1. **Parse + Get** — `parse/1` returns an opaque reference to a parsed document (`sonic_rs::Value`). `get/2,3` extracts fields by JSON Pointer (RFC 6901) path via `value_to_term`. `get_many/2` extracts multiple fields in a single NIF call. Ideal when only a subset of fields is needed.

2. **Compiled pointers** — for a *fixed* set of paths extracted from every document, `compile_pointers/2` pre-parses the pointer strings once into a `CompiledPaths` resource (`PathSeg::Key` / `PathSeg::Num{idx,key}`, with `~`-unescaping and array-index-vs-object-key resolution done up front). `parse_get_many_nil/2` then fuses the DOM parse and extraction into one NIF call (no document handle, no second boundary crossing), returning `{:ok, values}` with `nil` for missing/`null`. The handle carries the `unique_keys` lookup strategy. ~1.5× faster end-to-end than `parse/2` + `get_many_nil/2` on a typical field set; `get_many_nil/2` also accepts a compiled handle to query an already-parsed doc. Note: a lazy single-pass approach (sonic-rs `get_many` over a `PointerTree`) was measured ~6× *slower* here — per-call `PointerTree` (HashMap + `FastStr`) construction dominates — so the DOM is the right structure for this small-doc / many-short-paths workload.

3. **Full decode** — `decode/1` builds Erlang terms directly during the SIMD parse by implementing sonic-rs's native `JsonVisitor` (`native_decode.rs`): single pass, no intermediate `Value`, zero-copy sub-binaries for unescaped strings, and a per-call key cache that decodes a key repeated across objects (the common array-of-records shape) to one shared term (median −3–4%, p99 −16%, decoded-term heap −37% on record-shaped payloads).

### Encoding

`encode/1` walks Elixir terms directly (no intermediate representation) and writes JSON bytes to a buffer. Supports maps (atom/binary/integer keys — integer keys are stringified, since JSON object names must be strings), lists, numbers, booleans, nil, and jiffy-style `{proplist}` tuples.

Atom names are read as Latin-1 into a stack buffer, because `ERL_NIF_UTF8` needs NIF 2.17 and the NIF still loads on 2.15. A name with any character above U+00FF makes that read fail, so those atoms go through `enif_term_to_binary` and the name is taken from the `SMALL_ATOM_UTF8_EXT` / `ATOM_UTF8_EXT` payload instead. Only the names the Latin-1 read rejects pay for that binary.


### Scheduler Awareness

Decode/parse inputs larger than 20 KB are automatically dispatched to dirty CPU schedulers to avoid blocking normal BEAM schedulers. Encoding cannot cheaply predict output size, so dirty dispatch is opt-in via `dirty: true` on `encode/2`, `encode!/2`, and `encode_to_iodata/2`. The `get/2` NIF always runs on a normal scheduler (sub-microsecond pointer traversal).

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
- `lib/torque/native.ex` — RustlerPrecompiled NIF stubs (set `TORQUE_BUILD=true` to compile from source)
- `lib/torque/build.ex` — captures `TORQUE_BUILD` and makes switching it recompile `Torque.Native`
- `native/torque_nif/src/lib.rs` — NIF registration, `ParsedDocument` + `CompiledPaths` (`PathSeg`) resources
- `native/torque_nif/src/decoder.rs` — parse, get, get_many, get_many_nil, decode NIFs; compiled-pointer + fused `parse_get_many_nil` path
- `native/torque_nif/src/native_decode.rs` — fused decoder; builds terms during the SIMD parse via sonic-rs's `JsonVisitor`
- `native/torque_nif/src/encoder.rs` — direct term-walking JSON encoder
- `native/torque_nif/src/types.rs` — sonic_rs Value → Erlang term conversion (used by get/get_many)
- `native/torque_nif/src/atoms.rs` — cached atoms (ok, error, nil, no_such_field, nesting_too_deep, unsupported_type, non_finite_float, invalid_key, malformed_proplist, invalid_utf8)
- `native/sonic-rs/` — vendored, Torque-patched sonic-rs (native `JsonVisitor` exposed + DOM recursion-depth limit)
