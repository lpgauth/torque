defmodule Torque.DecodeTest do
  use ExUnit.Case, async: true

  describe "decode/1" do
    test "string" do
      assert {:ok, "hello"} = Torque.decode(~s("hello"))
    end

    test "integer" do
      assert {:ok, 42} = Torque.decode("42")
    end

    test "negative integer" do
      assert {:ok, -1} = Torque.decode("-1")
    end

    test "float" do
      assert {:ok, 3.14} = Torque.decode("3.14")
    end

    test "true" do
      assert {:ok, true} = Torque.decode("true")
    end

    test "false" do
      assert {:ok, false} = Torque.decode("false")
    end

    test "null" do
      assert {:ok, nil} = Torque.decode("null")
    end

    test "empty object" do
      assert {:ok, %{}} = Torque.decode("{}")
    end

    test "empty array" do
      assert {:ok, []} = Torque.decode("[]")
    end

    test "object with string values" do
      assert {:ok, %{"a" => "b", "c" => "d"}} = Torque.decode(~s({"a":"b","c":"d"}))
    end

    test "nested object" do
      json = ~s({"site":{"domain":"example.com"}})
      assert {:ok, %{"site" => %{"domain" => "example.com"}}} = Torque.decode(json)
    end

    test "array of integers" do
      assert {:ok, [1, 2, 3]} = Torque.decode("[1,2,3]")
    end

    test "array of objects" do
      json = ~s([{"id":1},{"id":2}])
      assert {:ok, [%{"id" => 1}, %{"id" => 2}]} = Torque.decode(json)
    end

    test "unicode string" do
      assert {:ok, "\u00e9\u00e8\u00ea"} = Torque.decode(~s("\u00e9\u00e8\u00ea"))
    end

    test "escaped characters" do
      assert {:ok, "line1\nline2"} = Torque.decode(~s("line1\\nline2"))
    end

    test "large integer (i64 max)" do
      assert {:ok, 9_223_372_036_854_775_807} = Torque.decode("9223372036854775807")
    end

    test "large integer (u64)" do
      assert {:ok, 9_223_372_036_854_775_808} = Torque.decode("9223372036854775808")
    end

    test "invalid json returns error" do
      assert {:error, _reason} = Torque.decode("{invalid}")
    end

    test "large payload uses dirty scheduler" do
      # Generate a payload > 10KB to exercise the dirty scheduler path
      large_map = Map.new(1..500, fn i -> {"key_#{i}", String.duplicate("v", 20)} end)
      json = Jason.encode!(large_map)
      assert byte_size(json) > 10_240
      assert {:ok, decoded} = Torque.decode(json)
      assert decoded == large_map
    end
  end

  describe "decode!/1" do
    test "valid json" do
      assert %{"a" => 1} = Torque.decode!(~s({"a":1}))
    end

    test "invalid json raises" do
      assert_raise ArgumentError, fn ->
        Torque.decode!("{invalid}")
      end
    end
  end
end
