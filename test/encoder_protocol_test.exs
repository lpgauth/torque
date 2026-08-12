defmodule Torque.EncoderProtocolTest do
  use ExUnit.Case, async: true

  defmodule TestStruct do
    defstruct [:name, :value]
  end

  defimpl Torque.Encoder, for: TestStruct do
    def encode(s), do: %{name: s.name, value: s.value}
  end

  defmodule OtherStruct do
    defstruct [:x]
  end

  defmodule Nested do
    defstruct [:inner]
  end

  defimpl Torque.Encoder, for: Nested do
    def encode(n), do: %{inner: n.inner}
  end

  defmodule DerivedOnly do
    @derive {Torque.Encoder, only: [:id, :name]}
    defstruct [:id, :name, :secret]
  end

  defmodule DerivedExcept do
    @derive {Torque.Encoder, except: [:secret]}
    defstruct [:id, :name, :secret]
  end

  defmodule DerivedAll do
    @derive Torque.Encoder
    defstruct [:id, :name]
  end

  defmodule DerivedNested do
    @derive {Torque.Encoder, only: [:inner]}
    defstruct [:inner, :tag]
  end

  defmodule DerivedInner do
    @derive {Torque.Encoder, only: [:v]}
    defstruct [:v, :secret]
  end

  describe "encode/1 with structs" do
    test "plain terms are unaffected" do
      assert {:ok, json} = Torque.encode(%{a: 1})
      assert %{"a" => 1} = Jason.decode!(json)
    end

    test "struct implementing Torque.Encoder is encoded via the protocol" do
      assert {:ok, json} = Torque.encode(%TestStruct{name: "hi", value: 42})
      assert %{"name" => "hi", "value" => 42} = Jason.decode!(json)
    end

    test "struct without implementation returns {:error, :unhandled_struct}" do
      assert {:error, :unhandled_struct} = Torque.encode(%OtherStruct{x: 1})
    end

    test "nested structs in maps and lists" do
      input = %{list: [%TestStruct{name: "a", value: 1}, %TestStruct{name: "b", value: 2}]}
      assert {:ok, json} = Torque.encode(input)

      assert %{"list" => [%{"name" => "a", "value" => 1}, %{"name" => "b", "value" => 2}]} =
               Jason.decode!(json)
    end

    test "protocol output containing another struct is normalized recursively" do
      assert {:ok, json} = Torque.encode(%Nested{inner: %TestStruct{name: "n", value: 7}})
      assert %{"inner" => %{"name" => "n", "value" => 7}} = Jason.decode!(json)
    end

    test "encode!/1 raises on struct without implementation" do
      assert_raise ArgumentError, ~r/unhandled_struct/, fn ->
        Torque.encode!(%OtherStruct{x: 1})
      end
    end

    test "encode_to_iodata!/1 raises on struct without implementation" do
      assert_raise ArgumentError, ~r/unhandled_struct/, fn ->
        Torque.encode_to_iodata!(%OtherStruct{x: 1})
      end
    end

    test "encode_to_iodata!/1 encodes via protocol" do
      assert ~s({"m":{"name":"x","value":1}}) =
               Torque.encode_to_iodata!(%{m: %TestStruct{name: "x", value: 1}})
    end
  end

  describe "encode/2 with dirty: true" do
    test "structs are handled the same" do
      assert {:ok, json} = Torque.encode(%TestStruct{name: "d", value: 3}, dirty: true)
      assert %{"name" => "d", "value" => 3} = Jason.decode!(json)

      assert {:error, :unhandled_struct} = Torque.encode(%OtherStruct{x: 1}, dirty: true)
    end

    test "encode_to_iodata/2 with dirty: true" do
      assert ~s({"name":"d2","value":4}) =
               Torque.encode_to_iodata(%TestStruct{name: "d2", value: 4}, dirty: true)
    end
  end

  describe "deriving with :only / :except" do
    test ":only encodes the listed fields" do
      assert {:ok, json} = Torque.encode(%DerivedOnly{id: 1, name: "a", secret: "s"})
      assert %{"id" => 1, "name" => "a"} = Jason.decode!(json)
      refute json =~ "secret"
    end

    test ":except drops the listed fields" do
      assert {:ok, json} = Torque.encode(%DerivedExcept{id: 1, name: "a", secret: "s"})
      assert %{"id" => 1, "name" => "a"} = Jason.decode!(json)
      refute json =~ "secret"
    end

    test "no options encodes all fields" do
      assert {:ok, json} = Torque.encode(%DerivedAll{id: 1, name: "a"})
      assert %{"id" => 1, "name" => "a"} = Jason.decode!(json)
    end

    test "derived struct fields containing structs are normalized recursively" do
      assert {:ok, json} =
               Torque.encode(%DerivedNested{inner: %TestStruct{name: "n", value: 7}, tag: "t"})

      assert %{"inner" => %{"name" => "n", "value" => 7}} = Jason.decode!(json)
    end

    test "nested derived structs apply their own :only filters" do
      assert {:ok, json} =
               Torque.encode(%DerivedNested{
                 inner: %DerivedInner{v: 1, secret: "s"},
                 tag: "t"
               })

      assert %{"inner" => %{"v" => 1}} = Jason.decode!(json)
    end

    test "unknown fields in :only raise at compile time" do
      assert_raise ArgumentError, ~r/unknown struct fields/, fn ->
        Code.compile_string("""
        defmodule BadDerive do
          @derive {Torque.Encoder, only: [:nope]}
          defstruct [:id]
        end
        """)
      end
    end

    test "unknown fields in :except raise at compile time" do
      assert_raise ArgumentError, ~r/unknown struct fields/, fn ->
        Code.compile_string("""
        defmodule BadDeriveExcept do
          @derive {Torque.Encoder, except: [:nope]}
          defstruct [:id]
        end
        """)
      end
    end
  end

  describe "proplist tuples" do
    test "structs inside proplist values are normalized" do
      assert {:ok, json} = Torque.encode({[{:a, %TestStruct{name: "p", value: 1}}]})
      assert %{"a" => %{"name" => "p", "value" => 1}} = Jason.decode!(json)
    end
  end

  describe "struct detection edge cases" do
    test "plain map with binary \"__struct__\" key is not a struct" do
      assert {:ok, json} = Torque.encode(%{"__struct__" => "not-a-struct", a: 1})
      assert %{"__struct__" => "not-a-struct", "a" => 1} = Jason.decode!(json)
    end
  end
end
