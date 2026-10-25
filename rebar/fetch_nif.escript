#!/usr/bin/env escript
%% -*- erlang -*-
%%
%% Puts the Torque NIF at priv/native/torque_nif.so: the precompiled release
%% asset for this platform, checked against the checksums shipped in the
%% package, or a cargo build when TORQUE_BUILD=true or no asset fits this
%% platform. A stamp next to the library records which asset (or `source')
%% it came from, so a version or variant change fetches again and anything
%% else is a no-op.
%%
%%   TORQUE_BUILD=true          build from source with cargo
%%   TORQUE_CPU_VARIANT=v3      force an x86_64 variant (v3, v2, or anything else for baseline)
%%   TORQUE_NIF_TARGET=<triple> fetch for another target, e.g. when building a release elsewhere
%%   TORQUE_NIF_VSN=0.4.7       fetch another release's asset (it must be in the checksum file)
%%
%% `escript rebar/fetch_nif.escript --print-asset' prints the asset this host would use.
-mode(compile).

-define(REPO, "https://github.com/lpgauth/torque").
-define(NIF_VERSION, "2.15").
-define(DEST, "priv/native/torque_nif.so").
-define(STAMP, "priv/native/torque_nif.stamp").
-define(TARGETS, [
    "aarch64-apple-darwin",
    "x86_64-apple-darwin",
    "aarch64-unknown-linux-gnu",
    "x86_64-unknown-linux-gnu"
]).
-define(V2_FLAGS, ["pni", "ssse3", "sse4_1", "sse4_2", "popcnt", "cx16", "lahf_lm"]).
-define(V3_FLAGS,
    ?V2_FLAGS ++ ["avx", "avx2", "bmi1", "bmi2", "f16c", "fma", "abm", "movbe", "pclmulqdq"]
).

%% httpc caps response headers at 10 KB from OTP 28.5.0.6 and 29 on, and the
%% redirect to a release asset already sends 10.8 KB of them, most of it a
%% content-security-policy. The limit is per response, not per hop, and older
%% httpc has no limit at all, where the option is ignored.
-define(MAX_HEADER_SIZE, 65536).

main(["--print-asset"]) ->
    case asset() of
        {ok, Asset} -> io:format("~s~n", [Asset]);
        {error, Why} -> io:format("none: ~s~n", [Why])
    end;
main([]) ->
    try
        run()
    catch
        throw:{fail, Fmt, Args} ->
            io:format(standard_error, "torque: " ++ Fmt ++ "~n", Args),
            halt(1)
    end.

run() ->
    case force_build() of
        true ->
            build();
        false ->
            case asset() of
                {ok, Asset} ->
                    case installed() of
                        Asset -> ok;
                        _ -> fetch(Asset)
                    end;
                {error, Why} ->
                    io:format("torque: no precompiled NIF (~s), building from source~n", [Why]),
                    build()
            end
    end.

force_build() ->
    lists:member(os:getenv("TORQUE_BUILD"), ["1", "true"]).

%% What the installed library came from, or `none'.
installed() ->
    case {filelib:is_regular(?DEST), file:read_file(?STAMP)} of
        {true, {ok, Stamp}} -> binary_to_list(Stamp);
        _ -> none
    end.

install(Lib, Stamp) ->
    ok = filelib:ensure_dir(?DEST),
    ok = file:write_file(?DEST, Lib),
    ok = file:write_file(?STAMP, Stamp).

%% --- Choosing the asset ---

asset() ->
    case target() of
        {ok, Target} ->
            {ok,
                lists:flatten([
                    "libtorque_nif-v", vsn(), "-nif-", ?NIF_VERSION, "-", Target,
                    variant_suffix(Target), ".so.tar.gz"
                ])};
        Error ->
            Error
    end.

vsn() ->
    case os:getenv("TORQUE_NIF_VSN") of
        Vsn when is_list(Vsn), Vsn =/= "" ->
            Vsn;
        _ ->
            {ok, [{application, torque, Props}]} = file:consult("src/torque.app.src"),
            proplists:get_value(vsn, Props)
    end.

target() ->
    Target =
        case os:getenv("TORQUE_NIF_TARGET") of
            Override when is_list(Override), Override =/= "" -> Override;
            _ -> host_target()
        end,
    case lists:member(Target, ?TARGETS) of
        true -> {ok, Target};
        false -> {error, "unsupported platform " ++ Target}
    end.

host_target() ->
    SystemArch = erlang:system_info(system_architecture),
    Arch =
        case hd(string:split(SystemArch, "-")) of
            "amd64" -> "x86_64";
            "arm64" -> "aarch64";
            Other -> Other
        end,
    case {string:find(SystemArch, "darwin"), string:find(SystemArch, "linux-gnu")} of
        {nomatch, nomatch} -> SystemArch;
        {nomatch, _} -> Arch ++ "-unknown-linux-gnu";
        {_, _} -> Arch ++ "-apple-darwin"
    end.

variant_suffix("x86_64-" ++ _) ->
    case os:getenv("TORQUE_CPU_VARIANT") of
        "v3" -> "--v3";
        "v2" -> "--v2";
        false ->
            case {has_level(?V3_FLAGS, "hw.optional.avx2_0"), has_level(?V2_FLAGS, "hw.optional.sse4_2")} of
                {true, _} -> "--v3";
                {false, true} -> "--v2";
                {false, false} -> ""
            end;
        _ -> ""
    end;
variant_suffix(_) ->
    "".

%% Every Mac with AVX2 (or SSE4.2) has the rest of that level, so one sysctl
%% stands for it. TORQUE_CPUINFO points the Linux check at another file, so
%% the selection can be tested on any host.
has_level(LinuxFlags, DarwinSysctl) ->
    case {os:getenv("TORQUE_CPUINFO"), os:type()} of
        {CpuInfo, _} when is_list(CpuInfo), CpuInfo =/= "" -> cpuinfo_has(CpuInfo, LinuxFlags);
        {_, {unix, linux}} -> cpuinfo_has("/proc/cpuinfo", LinuxFlags);
        {_, {unix, darwin}} -> os:cmd("sysctl -n " ++ DarwinSysctl ++ " 2>/dev/null") =:= "1\n";
        _ -> false
    end.

cpuinfo_has(Path, Flags) ->
    case file:read_file(Path) of
        {ok, Info} ->
            lists:any(
                fun(Line) ->
                    case string:prefix(Line, "flags") of
                        nomatch -> false;
                        _ -> Flags -- string:lexemes(Line, " \t:") =:= []
                    end
                end,
                string:split(binary_to_list(Info), "\n", all)
            );
        _ ->
            false
    end.

%% --- Fetching and verifying ---

fetch(Asset) ->
    Expected = expected_sha256(Asset),
    Cached = filename:join(filename:basedir(user_cache, "torque"), Asset),
    Tarball =
        case file:read_file(Cached) of
            {ok, Bin} ->
                case sha256(Bin) of
                    Expected -> Bin;
                    _ -> download(Asset, Cached)
                end;
            _ ->
                download(Asset, Cached)
        end,
    case sha256(Tarball) of
        Expected -> ok;
        Got -> throw({fail, "checksum mismatch for ~s: expected ~s, got ~s", [Asset, Expected, Got]})
    end,
    install(extract(Asset, Tarball), Asset),
    io:format("torque: installed ~s~n", [Asset]).

%% checksums.txt is `shasum -a 256' output for the release's assets.
expected_sha256(Asset) ->
    {ok, Checksums} = file:read_file("checksums.txt"),
    Pattern = "^([0-9a-f]{64}) [ *]" ++ re_escape(Asset) ++ "$",
    case re:run(Checksums, Pattern, [multiline, {capture, all_but_first, list}]) of
        {match, [Sha]} -> Sha;
        nomatch -> throw({fail, "~s is not in the shipped checksum file", [Asset]})
    end.

re_escape(String) ->
    lists:flatmap(
        fun(C) ->
            case lists:member(C, ".-+[](){}^$|?*\\") of
                true -> [$\\, C];
                false -> [C]
            end
        end,
        String
    ).

download(Asset, Cached) ->
    Url = ?REPO ++ "/releases/download/v" ++ vsn() ++ "/" ++ Asset,
    io:format("torque: downloading ~s~n", [Url]),
    {ok, _} = application:ensure_all_started(ssl),
    {ok, _} = application:ensure_all_started(inets),
    Request = {Url, [{"user-agent", "torque-fetch-nif"}]},
    HttpOpts = [{ssl, tls_opts()}, {autoredirect, true}, {timeout, 120000}],
    Opts = [{body_format, binary}, {max_header_size, ?MAX_HEADER_SIZE}],
    case httpc:request(get, Request, HttpOpts, Opts) of
        {ok, {{_, 200, _}, _, Body}} ->
            ok = filelib:ensure_dir(Cached),
            _ = file:write_file(Cached, Body),
            Body;
        {ok, {{_, Status, _}, _, _}} ->
            throw({fail, "download of ~s failed with HTTP ~p", [Url, Status]});
        {error, Reason} ->
            throw({fail, "download of ~s failed: ~p", [Url, Reason]})
    end.

%% Verified TLS needs the OS trust store, which public_key reads from OTP 25.
tls_opts() ->
    _ = code:ensure_loaded(public_key),
    case erlang:function_exported(public_key, cacerts_get, 0) of
        true ->
            [
                {verify, verify_peer},
                {cacerts, public_key:cacerts_get()},
                {depth, 4},
                {customize_hostname_check, [
                    {match_fun, public_key:pkix_verify_hostname_match_fun(https)}
                ]}
            ];
        false ->
            throw({fail, "downloading the NIF needs OTP 25 or later; set TORQUE_BUILD=true to build it", []})
    end.

sha256(Bin) ->
    string:lowercase(binary_to_list(binary:encode_hex(crypto:hash(sha256, Bin)))).

%% The archive holds the library under the asset's name without `.tar.gz'.
extract(Asset, Tarball) ->
    Name = lists:flatten(string:replace(Asset, ".tar.gz", "", trailing)),
    {ok, Files} = erl_tar:extract({binary, Tarball}, [compressed, memory]),
    case lists:keyfind(Name, 1, Files) of
        {_, Lib} -> Lib;
        false -> throw({fail, "~s holds no ~s", [Asset, Name]})
    end.

%% --- Building from source ---

%% Runs in the crate directory so a repository checkout picks up its
%% .cargo/config.toml; the package leaves that file out. cargo decides what is
%% stale, the vendored sonic-rs included, so this runs on every compile.
build() ->
    Cargo =
        case os:find_executable("cargo") of
            false -> filename:join([os:getenv("HOME", ""), ".cargo", "bin", "cargo"]);
            Found -> Found
        end,
    filelib:is_regular(Cargo) orelse
        throw({fail, "cargo not found; install a Rust toolchain to build the NIF", []}),
    Port = open_port({spawn_executable, Cargo}, [
        {args, ["build", "--release", "--package", "torque_nif"]},
        {cd, "native/torque_nif"},
        exit_status,
        stderr_to_stdout,
        binary
    ]),
    {Status, Output} = cargo_output(Port, []),
    Status =:= 0 orelse io:put_chars(Output),
    Status =:= 0 orelse throw({fail, "cargo build exited with ~p", [Status]}),
    Ext =
        case os:type() of
            {unix, darwin} -> ".dylib";
            _ -> ".so"
        end,
    {ok, Lib} = file:read_file("target/release/libtorque_nif" ++ Ext),
    case {installed(), file:read_file(?DEST)} of
        {"source", {ok, Lib}} ->
            ok;
        _ ->
            install(Lib, "source"),
            io:format("torque: built the NIF from source~n", [])
    end.

cargo_output(Port, Acc) ->
    receive
        {Port, {data, Data}} -> cargo_output(Port, [Acc, Data]);
        {Port, {exit_status, Status}} -> {Status, Acc}
    end.
