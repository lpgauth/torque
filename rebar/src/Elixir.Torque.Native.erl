%% @private
%% rebar3 builds only: loads the NIF, which registers its functions under this
%% module name (`rustler::init!("Elixir.Torque.Native")'). Mix builds use the
%% Elixir module of the same name instead and never compile this file.
-module('Elixir.Torque.Native').

-export([
    parse/1,
    parse_dirty/1,
    parse_opts/4,
    parse_opts_dirty/4,
    get/2,
    get_many/2,
    decode/1,
    decode_dirty/1,
    decode_opts/3,
    decode_opts_dirty/3,
    encode/1,
    encode_dirty/1,
    encode_opts/3,
    encode_opts_dirty/3,
    encode_iodata/1,
    encode_iodata_dirty/1,
    encode_iodata_opts/2,
    encode_iodata_opts_dirty/2,
    get_many_nil/2,
    compile_paths/5,
    get_many_nil_compiled/2,
    parse_get_many_nil/2,
    parse_get_many_nil_dirty/2,
    array_length/2
]).

-on_load(init/0).

init() ->
    erlang:load_nif(filename:join([code:priv_dir(torque), "native", "torque_nif"]), 0).

parse(_) -> erlang:nif_error(nif_not_loaded).
parse_dirty(_) -> erlang:nif_error(nif_not_loaded).
parse_opts(_, _, _, _) -> erlang:nif_error(nif_not_loaded).
parse_opts_dirty(_, _, _, _) -> erlang:nif_error(nif_not_loaded).
get(_, _) -> erlang:nif_error(nif_not_loaded).
get_many(_, _) -> erlang:nif_error(nif_not_loaded).
decode(_) -> erlang:nif_error(nif_not_loaded).
decode_dirty(_) -> erlang:nif_error(nif_not_loaded).
decode_opts(_, _, _) -> erlang:nif_error(nif_not_loaded).
decode_opts_dirty(_, _, _) -> erlang:nif_error(nif_not_loaded).
encode(_) -> erlang:nif_error(nif_not_loaded).
encode_dirty(_) -> erlang:nif_error(nif_not_loaded).
encode_opts(_, _, _) -> erlang:nif_error(nif_not_loaded).
encode_opts_dirty(_, _, _) -> erlang:nif_error(nif_not_loaded).
encode_iodata(_) -> erlang:nif_error(nif_not_loaded).
encode_iodata_dirty(_) -> erlang:nif_error(nif_not_loaded).
encode_iodata_opts(_, _) -> erlang:nif_error(nif_not_loaded).
encode_iodata_opts_dirty(_, _) -> erlang:nif_error(nif_not_loaded).
get_many_nil(_, _) -> erlang:nif_error(nif_not_loaded).
compile_paths(_, _, _, _, _) -> erlang:nif_error(nif_not_loaded).
get_many_nil_compiled(_, _) -> erlang:nif_error(nif_not_loaded).
parse_get_many_nil(_, _) -> erlang:nif_error(nif_not_loaded).
parse_get_many_nil_dirty(_, _) -> erlang:nif_error(nif_not_loaded).
array_length(_, _) -> erlang:nif_error(nif_not_loaded).
