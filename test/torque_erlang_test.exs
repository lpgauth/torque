defmodule Torque.ErlangTest do
  use ExUnit.Case, async: true

  # The Erlang API in src/torque.erl, which Mix compiles alongside the Elixir
  # modules.

  @json ~s({"a":null,"b":[1,2],"c":{"d":"x"}})
  # Past the 20 KB dirty-scheduler threshold.
  @large "[" <> Enum.map_join(1..3000, ",", fn i -> ~s({"i":#{i},"n":null}) end) <> "]"

  describe "decode" do
    test "uses null for JSON null" do
      assert {:ok, %{"a" => :null, "b" => [1, 2], "c" => %{"d" => "x"}}} = :torque.decode(@json)
      assert {:ok, [%{"i" => 1, "n" => :null} | _]} = :torque.decode(@large)
    end

    test "accepts the strings option" do
      long = String.duplicate("s", 80)
      assert {:ok, [s]} = :torque.decode(~s(["#{long}"]), strings: :copy)
      assert :binary.referenced_byte_size(s) == 80
      assert {:ok, _} = :torque.decode(@json, strings: :reference)
    end

    test "returns errors as tuples" do
      assert {:error, message} = :torque.decode("{oops")
      assert is_binary(message)
    end
  end

  describe "encode" do
    test "writes null for the null atom and a string for nil" do
      assert {:ok, ~s([null,"nil",true])} = :torque.encode([:null, nil, true])
      assert {:ok, ~s({"k":null})} = :torque.encode({[{"k", :null}]})
      assert {:ok, ~s([null])} = :torque.encode([:null], [:dirty])
      assert {:ok, ~s([null])} = :torque.encode([:null], dirty: true)
    end

    test "returns errors as tuples" do
      assert {:error, :unsupported_type} = :torque.encode(self())
    end

    test "pretty prints with the two-space default or a custom indent" do
      assert {:ok, "{\n  \"k\": [\n    1\n  ]\n}"} = :torque.encode({[{"k", [1]}]}, pretty: true)
      assert {:ok, "{\n\t\"k\": 1\n}"} = :torque.encode({[{"k", 1}]}, pretty: "\t")
      assert {:ok, "{\n\t\"k\": 1\n}"} = :torque.encode({[{"k", 1}]}, [{:pretty, "\t"}])
      assert {:ok, ~s({"k":1})} = :torque.encode({[{"k", 1}]}, pretty: false)
    end
  end

  describe "parse and lookups" do
    test "answer with null and undefined" do
      {:ok, doc} = :torque.parse(@json)
      assert {:ok, :null} = :torque.get(doc, "/a")
      assert {:error, :no_such_field} = :torque.get(doc, "/zz")
      assert :fallback = :torque.get(doc, "/zz", :fallback)
      assert "x" = :torque.get(doc, "/c/d", :fallback)
      assert [{:ok, :null}, {:error, :no_such_field}] = :torque.get_many(doc, ["/a", "/zz"])
      assert [:null, 2, :undefined] = :torque.get_many_values(doc, ["/a", "/b/1", "/zz"])
      assert 2 = :torque.length(doc, "/b")
      assert :undefined = :torque.length(doc, "/zz")
    end

    test "large documents and unique_keys" do
      {:ok, doc} = :torque.parse(@large, unique_keys: true)
      assert [:null, 3000] = :torque.get_many_values(doc, ["/0/n", "/2999/i"])
    end
  end

  describe "compiled pointers" do
    test "work with documents and fused extraction" do
      for opts <- [[], [validate: false], [unique_keys: true]] do
        ptrs = :torque.compile_pointers(["/a", "/c/d", "/zz"], opts)
        {:ok, doc} = :torque.parse(@json)
        assert [:null, "x", :undefined] = :torque.get_many_values(doc, ptrs)
        assert {:ok, [:null, "x", :undefined]} = :torque.parse_get_many_values(@json, ptrs)
      end

      ptrs = :torque.compile_pointers(["/0/n", "/2999/i"])
      assert {:ok, [:null, 3000]} = :torque.parse_get_many_values(@large, ptrs)
    end

    test "reject malformed pointers" do
      assert_raise ArgumentError, fn -> :torque.compile_pointers(["no-slash"]) end
    end
  end

  test "unknown options raise" do
    for call <- [
          fn -> :torque.decode("1", bogus: 1) end,
          fn -> :torque.decode("1", strings: :bogus) end,
          fn -> :torque.encode(1, [:bogus]) end,
          fn -> :torque.encode(1, pretty: 1) end,
          fn -> :torque.parse("1", validate: false) end,
          fn -> :torque.compile_pointers([], strings: :copy) end
        ] do
      assert {:invalid_option, _} = catch_error(call.())
    end
  end
end
