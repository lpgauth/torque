defmodule Torque.EncodeTest do
  use ExUnit.Case, async: true

  describe "encode/1" do
    test "map with atom keys" do
      assert {:ok, json} = Torque.encode(%{id: "abc", cur: "USD"})
      assert %{"id" => "abc", "cur" => "USD"} = Jason.decode!(json)
    end

    test "map with binary keys" do
      assert {:ok, json} = Torque.encode(%{"key" => "value"})
      assert %{"key" => "value"} = Jason.decode!(json)
    end

    test "nested map" do
      input = %{a: %{b: %{c: 1}}}
      assert {:ok, json} = Torque.encode(input)
      assert %{"a" => %{"b" => %{"c" => 1}}} = Jason.decode!(json)
    end

    test "list" do
      assert {:ok, "[1,2,3]"} = Torque.encode([1, 2, 3])
    end

    test "empty list" do
      assert {:ok, "[]"} = Torque.encode([])
    end

    test "empty map" do
      assert {:ok, "{}"} = Torque.encode(%{})
    end

    test "string" do
      assert {:ok, ~s("hello")} = Torque.encode("hello")
    end

    test "string with escapes" do
      assert {:ok, json} = Torque.encode("line1\nline2")
      assert "line1\nline2" = Jason.decode!(json)
    end

    test "string with quotes" do
      assert {:ok, json} = Torque.encode(~s(say "hi"))
      assert ~s(say "hi") = Jason.decode!(json)
    end

    test "integer" do
      assert {:ok, "42"} = Torque.encode(42)
    end

    test "negative integer" do
      assert {:ok, "-1"} = Torque.encode(-1)
    end

    test "u64 range integer (i64 max + 1)" do
      assert {:ok, "9223372036854775808"} = Torque.encode(9_223_372_036_854_775_808)
    end

    test "u64 max" do
      assert {:ok, "18446744073709551615"} = Torque.encode(18_446_744_073_709_551_615)
    end

    test "float" do
      assert {:ok, json} = Torque.encode(3.14)
      assert_in_delta 3.14, String.to_float(json), 0.001
    end

    test "true" do
      assert {:ok, "true"} = Torque.encode(true)
    end

    test "false" do
      assert {:ok, "false"} = Torque.encode(false)
    end

    test "nil" do
      assert {:ok, "null"} = Torque.encode(nil)
    end

    test "jiffy proplist format" do
      input = {[{:id, "abc"}, {:price, 1.5}]}
      assert {:ok, json} = Torque.encode(input)
      assert %{"id" => "abc", "price" => 1.5} = Jason.decode!(json)
    end

    test "nested proplist" do
      input = {[{:seatbid, [{[{:bid, [1, 2]}]}]}]}
      assert {:ok, json} = Torque.encode(input)
      decoded = Jason.decode!(json)
      assert [%{"bid" => [1, 2]}] = decoded["seatbid"]
    end

    test "list of maps" do
      input = [%{id: 1}, %{id: 2}]
      assert {:ok, json} = Torque.encode(input)
      assert [%{"id" => 1}, %{"id" => 2}] = Jason.decode!(json)
    end

    test "atom values encoded as strings" do
      assert {:ok, json} = Torque.encode(%{status: :active})
      assert %{"status" => "active"} = Jason.decode!(json)
    end
  end

  describe "encode!/1" do
    test "valid term" do
      assert is_binary(Torque.encode!(%{a: 1}))
    end

    test "unsupported term raises" do
      assert_raise ArgumentError, fn ->
        Torque.encode!(self())
      end
    end
  end

  describe "encode_to_iodata/1" do
    test "returns binary directly" do
      json = Torque.encode_to_iodata(%{a: 1})
      assert is_binary(json)
      assert %{"a" => 1} = Jason.decode!(json)
    end

    test "encodes list" do
      assert "[1,2,3]" = Torque.encode_to_iodata([1, 2, 3])
    end

    test "unsupported term raises ArgumentError" do
      assert_raise ArgumentError, fn ->
        Torque.encode_to_iodata(self())
      end
    end
  end
end
