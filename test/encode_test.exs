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

    test "positive bignum (beyond u64)" do
      assert {:ok, "123456789012345678901234567890"} =
               Torque.encode(123_456_789_012_345_678_901_234_567_890)
    end

    test "negative bignum (beyond i64)" do
      assert {:ok, "-123456789012345678901234567890"} =
               Torque.encode(-123_456_789_012_345_678_901_234_567_890)
    end

    test "bignum round-trips through decode" do
      n = 10 ** 100 + 7
      assert {:ok, json} = Torque.encode(n)
      assert {:ok, ^n} = Torque.decode(json)
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

    test "atom map values encoded as strings" do
      assert {:ok, json} = Torque.encode(%{status: :active})
      assert %{"status" => "active"} = Jason.decode!(json)
    end

    test "non-ASCII Latin-1 atom encodes as valid UTF-8" do
      assert {:ok, json} = Torque.encode(:café)
      assert String.valid?(json)
      assert {:ok, "café"} = Torque.decode(json)
    end

    test "non-ASCII Latin-1 atom map key encodes as valid UTF-8" do
      assert {:ok, json} = Torque.encode(%{café: 1})
      assert String.valid?(json)
      assert %{"café" => 1} = Jason.decode!(json)
    end

    test "non-ASCII Latin-1 atom in proplist key encodes as valid UTF-8" do
      assert {:ok, json} = Torque.encode({[{:café, 1}]})
      assert String.valid?(json)
      assert %{"café" => 1} = Jason.decode!(json)
    end

    test "improper list returns error" do
      assert {:error, :unsupported_type} = Torque.encode([1 | 2])
      assert {:error, :unsupported_type} = Torque.encode(%{"a" => [1 | 2]})
    end

    test "improper proplist returns malformed_proplist" do
      assert {:error, :malformed_proplist} = Torque.encode({[{:a, 1} | :b]})
    end

    test "invalid UTF-8 binary returns error" do
      assert {:error, :invalid_utf8} = Torque.encode(<<0x80>>)
    end

    test "invalid UTF-8 binary map key returns error" do
      assert {:error, :invalid_utf8} = Torque.encode(%{<<0x80>> => "value"})
    end
  end

  describe "encode/2 with dirty: true" do
    test "matches default scheduler output" do
      input = %{"a" => [1, 2, 3], "b" => "hello", "c" => %{d: 1.5}}
      assert Torque.encode(input, dirty: true) == Torque.encode(input)
    end

    test "large payload round-trips" do
      large = Map.new(1..2000, fn i -> {"key_#{i}", String.duplicate("v", 40)} end)
      assert {:ok, json} = Torque.encode(large, dirty: true)
      assert byte_size(json) > 20_480
      assert {:ok, decoded} = Torque.decode(json)
      assert decoded == large
    end

    test "errors propagate" do
      assert {:error, :unsupported_type} = Torque.encode(self(), dirty: true)
    end

    test "encode!/2 accepts dirty option" do
      assert Torque.encode!(%{a: 1}, dirty: true) == Torque.encode!(%{a: 1})
    end

    test "encode_to_iodata/2 accepts dirty option" do
      assert Torque.encode_to_iodata(%{a: 1}, dirty: true) == Torque.encode_to_iodata(%{a: 1})
    end

    test "encode_to_iodata/2 with dirty option raises on error" do
      assert_raise ArgumentError, ~r/unsupported_type/, fn ->
        Torque.encode_to_iodata(self(), dirty: true)
      end
    end
  end

  describe "encode!/1" do
    test "valid term" do
      assert is_binary(Torque.encode!(%{a: 1}))
    end

    test "unsupported term raises" do
      assert_raise ArgumentError, ~r/unsupported_type/, fn ->
        Torque.encode!(self())
      end
    end

    test "invalid UTF-8 binary raises" do
      assert_raise ArgumentError, ~r/invalid_utf8/, fn ->
        Torque.encode!(<<0x80>>)
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
      assert_raise ArgumentError, ~r/unsupported_type/, fn ->
        Torque.encode_to_iodata(self())
      end
    end

    test "invalid UTF-8 binary raises ArgumentError" do
      assert_raise ArgumentError, ~r/invalid_utf8/, fn ->
        Torque.encode_to_iodata(<<0x80>>)
      end
    end

    test "integer keys are stringified" do
      json = Torque.encode_to_iodata(%{0 => "a", 1 => "b"})
      assert %{"0" => "a", "1" => "b"} = Jason.decode!(json)
    end

    test "negative integer keys are stringified" do
      json = Torque.encode_to_iodata(%{-1 => "x"})
      assert %{"-1" => "x"} = Jason.decode!(json)
    end
  end

  describe "encode_to_iodata!/1" do
    test "returns binary directly" do
      json = Torque.encode_to_iodata!(%{a: 1})
      assert is_binary(json)
      assert %{"a" => 1} = Jason.decode!(json)
    end

    test "encodes list" do
      assert "[1,2,3]" = Torque.encode_to_iodata!([1, 2, 3])
    end

    test "unsupported term raises ArgumentError" do
      assert_raise ArgumentError, ~r/unsupported_type/, fn ->
        Torque.encode_to_iodata!(self())
      end
    end

    test "matches encode_to_iodata/1 output" do
      term = %{nested: %{list: [1, 2, 3], str: "hello"}}
      assert Torque.encode_to_iodata!(term) == Torque.encode_to_iodata(term)
    end
  end
end
