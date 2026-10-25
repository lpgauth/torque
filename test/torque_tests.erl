%% The Erlang API from a rebar3 build (`rebar3 eunit'); Mix covers the same
%% module in test/torque_erlang_test.exs.
-module(torque_tests).

-include_lib("eunit/include/eunit.hrl").

-define(JSON, <<"{\"a\":null,\"b\":[1,2],\"c\":{\"d\":\"x\"}}">>).

%% Past the 20 KB dirty-scheduler threshold.
large() ->
    Records = [io_lib:format("{\"i\":~b,\"n\":null}", [I]) || I <- lists:seq(1, 3000)],
    iolist_to_binary(["[", lists:join(",", Records), "]"]).

decode_test() ->
    ?assertEqual(
        {ok, #{<<"a">> => null, <<"b">> => [1, 2], <<"c">> => #{<<"d">> => <<"x">>}}},
        torque:decode(?JSON)
    ),
    {ok, [First | _]} = torque:decode(large()),
    ?assertEqual(#{<<"i">> => 1, <<"n">> => null}, First),
    Long = binary:copy(<<"s">>, 80),
    {ok, [S]} = torque:decode(<<"[\"", Long/binary, "\"]">>, [{strings, copy}]),
    ?assertEqual(80, binary:referenced_byte_size(S)),
    ?assertMatch({error, Msg} when is_binary(Msg), torque:decode(<<"{oops">>)).

encode_test() ->
    ?assertEqual({ok, <<"[null,\"nil\",true]">>}, torque:encode([null, nil, true])),
    ?assertEqual({ok, <<"{\"k\":null}">>}, torque:encode({[{<<"k">>, null}]})),
    ?assertEqual({ok, <<"[null]">>}, torque:encode([null], [dirty])),
    ?assertEqual({ok, <<"[\n  null\n]">>}, torque:encode([null], [pretty, {dirty, true}])),
    ?assertEqual({error, unsupported_type}, torque:encode(self())).

encode_pretty_test() ->
    ?assertEqual(
        {ok, <<"[\n  null,\n  [\n    1\n  ]\n]">>},
        torque:encode([null, [1]], [pretty])
    ),
    ?assertEqual(
        {ok, <<"{\n\t\"k\": null\n}">>},
        torque:encode({[{k, null}]}, [{pretty, <<"\t">>}])
    ),
    ?assertEqual({ok, <<"[]">>}, torque:encode([], [pretty])),
    ?assertEqual({ok, <<"{\"k\":1}">>}, torque:encode({[{k, 1}]}, [{pretty, <<>>}])),
    ?assertEqual(
        {ok, <<"[\n \t1\n]">>},
        torque:encode([1], [{pretty, <<" \t">>}])
    ),
    ?assertError({invalid_option, {pretty, 1}}, torque:encode(1, [{pretty, 1}])),
    ?assertError({invalid_option, {pretty, <<"x">>}}, torque:encode(1, [{pretty, <<"x">>}])),
    Long = binary:copy(<<" ">>, 17),
    ?assertError({invalid_option, {pretty, Long}}, torque:encode(1, [{pretty, Long}])).

lookups_test() ->
    {ok, Doc} = torque:parse(?JSON),
    ?assertEqual({ok, null}, torque:get(Doc, <<"/a">>)),
    ?assertEqual({error, no_such_field}, torque:get(Doc, <<"/zz">>)),
    ?assertEqual(fallback, torque:get(Doc, <<"/zz">>, fallback)),
    ?assertEqual(
        [{ok, null}, {error, no_such_field}], torque:get_many(Doc, [<<"/a">>, <<"/zz">>])
    ),
    ?assertEqual(
        [null, 2, undefined], torque:get_many_values(Doc, [<<"/a">>, <<"/b/1">>, <<"/zz">>])
    ),
    ?assertEqual(2, torque:length(Doc, <<"/b">>)),
    ?assertEqual(undefined, torque:length(Doc, <<"/zz">>)),
    {ok, Big} = torque:parse(large(), [{unique_keys, true}]),
    ?assertEqual([null, 3000], torque:get_many_values(Big, [<<"/0/n">>, <<"/2999/i">>])).

compiled_pointers_test() ->
    Paths = [<<"/a">>, <<"/c/d">>, <<"/zz">>],
    {ok, Doc} = torque:parse(?JSON),
    lists:foreach(
        fun(Opts) ->
            Ptrs = torque:compile_pointers(Paths, Opts),
            ?assertEqual([null, <<"x">>, undefined], torque:get_many_values(Doc, Ptrs)),
            ?assertEqual(
                {ok, [null, <<"x">>, undefined]}, torque:parse_get_many_values(?JSON, Ptrs)
            )
        end,
        [[], [{validate, false}], [{unique_keys, true}]]
    ),
    Ptrs = torque:compile_pointers([<<"/0/n">>, <<"/2999/i">>]),
    ?assertEqual({ok, [null, 3000]}, torque:parse_get_many_values(large(), Ptrs)),
    ?assertError(badarg, torque:compile_pointers([<<"no-slash">>])).

invalid_options_test() ->
    ?assertError({invalid_option, _}, torque:decode(<<"1">>, [{bogus, 1}])),
    ?assertError({invalid_option, _}, torque:decode(<<"1">>, [{strings, bogus}])),
    ?assertError({invalid_option, _}, torque:encode(1, [bogus])),
    ?assertError({invalid_option, _}, torque:parse(<<"1">>, [{validate, false}])).
