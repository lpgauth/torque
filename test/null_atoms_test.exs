defmodule Torque.NullAtomsTest do
  use ExUnit.Case, async: true

  # The NIFs take the term JSON null becomes and the term an absent path
  # returns, so the Erlang API can use `null` and `undefined` where Elixir uses
  # `nil` for both.

  alias Torque.Native

  @json ~s({"n":null,"s":"x","box":[null,1],"deep":{"m":[null]}})

  test "decode turns JSON null into the given atom" do
    assert {:ok, %{"n" => :null, "box" => [:null, 1], "deep" => %{"m" => [:null]}}} =
             Native.decode_opts(@json, false, :null)

    big = "[" <> Enum.map_join(1..3000, ",", fn _ -> "null" end) <> "]"
    assert {:ok, list} = Native.decode_opts_dirty(big, true, :null)
    assert Enum.all?(list, &(&1 == :null))
  end

  test "parsed documents answer with their null and missing atoms" do
    {:ok, doc} = Native.parse_opts(@json, false, :null, :undefined)

    assert {:ok, :null} = Native.get(doc, "/n")
    assert {:ok, %{"m" => [:null]}} = Native.get(doc, "/deep")
    assert {:error, :no_such_field} = Native.get(doc, "/gone")
    assert [{:ok, :null}, {:error, :no_such_field}] = Native.get_many(doc, ["/n", "/gone"])
    assert [:null, "x", :undefined] = Native.get_many_nil(doc, ["/n", "/s", "/gone"])
    assert :undefined = Native.array_length(doc, "/gone")
    assert 2 = Native.array_length(doc, "/box")

    # Lookups on a parsed document use the document's atoms, not the handle's.
    compiled = Native.compile_paths(["/n", "/box", "/gone"], false, true, nil, nil)
    assert [:null, [:null, 1], :undefined] = Native.get_many_nil_compiled(doc, compiled)
  end

  test "fused extraction uses the handle's atoms" do
    paths = ["/n", "/box", "/deep", "/deep/m/0", "/gone"]

    for validate <- [true, false] do
      compiled = Native.compile_paths(paths, false, validate, :null, :undefined)

      assert {:ok, [:null, [:null, 1], %{"m" => [:null]}, :null, :undefined]} =
               Native.parse_get_many_nil(@json, compiled)
    end
  end

  test "encode writes JSON null for the given atom only" do
    assert {:ok, ~s([null,"nil"])} = Native.encode_opts([:null, nil], :null, "")
    assert {:ok, json} = Native.encode_opts(%{a: :null, b: nil}, :null, "")
    assert Torque.decode!(json) == %{"a" => nil, "b" => "nil"}
    assert {:ok, ~s([null,"null"])} = Native.encode_opts_dirty([nil, :null], nil, "")
  end

  test "the Elixir API still uses nil" do
    assert {:ok, %{"n" => nil}} = Torque.decode(@json, strings: :copy)
    {:ok, doc} = Torque.parse(@json, unique_keys: true)
    assert [nil, nil] = Torque.get_many_nil(doc, ["/n", "/gone"])
    assert {:ok, ~s(["null",null])} = Torque.encode([:null, nil])
  end
end
