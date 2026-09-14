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

  defmodule ReturnsSelf do
    defstruct [:a]
  end

  defimpl Torque.Encoder, for: ReturnsSelf do
    def encode(struct), do: struct
  end

  defmodule ContainsSelf do
    defstruct [:id]
  end

  defimpl Torque.Encoder, for: ContainsSelf do
    def encode(s), do: %{id: s.id, node: s}
  end

  defmodule CycleLeft do
    defstruct [:x]
  end

  defmodule CycleRight do
    defstruct [:x]
  end

  defimpl Torque.Encoder, for: CycleLeft do
    def encode(_), do: %CycleRight{}
  end

  defimpl Torque.Encoder, for: CycleRight do
    def encode(_), do: %CycleLeft{}
  end

  # Legitimate recursion: expands to a finite tree.
  defmodule Tree do
    defstruct [:value, :children]
  end

  defimpl Torque.Encoder, for: Tree do
    def encode(t), do: %{value: t.value, children: t.children}
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

    test ":only and :except together raise at compile time" do
      assert_raise ArgumentError, ~r/mutually exclusive/, fn ->
        Code.compile_string("""
        defmodule BothDerive do
          @derive {Torque.Encoder, only: [:id], except: [:secret]}
          defstruct [:id, :secret]
        end
        """)
      end
    end

    test ":__struct__ is not an encodable field" do
      assert_raise ArgumentError, ~r/unknown struct fields/, fn ->
        Code.compile_string("""
        defmodule StructKeyDerive do
          @derive {Torque.Encoder, only: [:__struct__]}
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

  describe "built-in implementations" do
    test "Date, Time, NaiveDateTime and DateTime encode as ISO 8601 strings" do
      term = %{
        d: ~D[2026-09-14],
        t: ~T[12:34:56],
        n: ~N[2026-09-14 12:34:56],
        dt: ~U[2026-09-14 12:34:56Z]
      }

      assert {:ok, json} = Torque.encode(term)

      assert %{
               "d" => "2026-09-14",
               "t" => "12:34:56",
               "n" => "2026-09-14T12:34:56",
               "dt" => "2026-09-14T12:34:56Z"
             } = Jason.decode!(json)
    end

    test "they work nested in lists" do
      assert {:ok, json} = Torque.encode([~D[2026-01-01], ~D[2026-12-31]])
      assert ["2026-01-01", "2026-12-31"] = Jason.decode!(json)
    end
  end

  describe "proplist tuples" do
    test "structs inside proplist values are normalized" do
      assert {:ok, json} = Torque.encode({[{:a, %TestStruct{name: "p", value: 1}}]})
      assert %{"a" => %{"name" => "p", "value" => 1}} = Jason.decode!(json)
    end
  end

  describe "protocol expansion is bounded" do
    # Regression: these used to recurse forever (a silent hang, no error), and
    # then to raise out of `encode/2`, which is documented to return a tuple.
    test "an implementation returning the struct itself reports the bound" do
      assert {:error, :encoder_expansion_too_deep} = Torque.encode(%ReturnsSelf{})
    end

    test "an implementation returning a term containing the struct reports the bound" do
      assert {:error, :encoder_expansion_too_deep} = Torque.encode(%ContainsSelf{id: 1})
    end

    test "mutually recursive implementations report the bound" do
      assert {:error, :encoder_expansion_too_deep} = Torque.encode(%CycleLeft{})
    end

    test "encode!/1 raises on the bound" do
      assert_raise ArgumentError, ~r/encoder_expansion_too_deep/, fn ->
        Torque.encode!(%ReturnsSelf{})
      end
    end

    test "the iodata encoder raises on the bound" do
      assert_raise ArgumentError, ~r/encoder_expansion_too_deep/, fn ->
        Torque.encode_to_iodata(%ReturnsSelf{})
      end

      assert_raise ArgumentError, ~r/encoder_expansion_too_deep/, fn ->
        Torque.encode_to_iodata(%ContainsSelf{id: 1})
      end
    end

    test "dirty: true reports the bound the same way" do
      assert {:error, :encoder_expansion_too_deep} = Torque.encode(%ReturnsSelf{}, dirty: true)
    end

    test "finite recursion through the same struct type still works" do
      tree = %Tree{
        value: 1,
        children: [%Tree{value: 2, children: []}, %Tree{value: 3, children: []}]
      }

      assert {:ok, json} = Torque.encode(tree)

      assert %{
               "value" => 1,
               "children" => [
                 %{"value" => 2, "children" => []},
                 %{"value" => 3, "children" => []}
               ]
             } = Jason.decode!(json)
    end

    test "a struct nested beyond the expansion bound reports the bound, not nesting_too_deep" do
      # 200 nested Tree levels: expansion depth exceeds the bound. The NIF's own
      # MAX_DEPTH would reject this too, but expansion stops first.
      deep =
        Enum.reduce(1..200, %Tree{value: 0, children: []}, fn i, acc ->
          %Tree{value: i, children: [acc]}
        end)

      assert {:error, :encoder_expansion_too_deep} = Torque.encode(deep)
    end

    test "deeply nested plain terms still report nesting_too_deep" do
      deep = Enum.reduce(1..500, :leaf, fn _, acc -> [acc] end)
      assert {:error, :nesting_too_deep} = Torque.encode(deep)
    end
  end

  describe "improper lists" do
    # normalize/1 used to reach Enum.map/2 here, which crashed with an internal
    # FunctionClauseError instead of the documented error tuple.
    test "an improper list containing a struct reports unsupported_type" do
      assert {:error, :unsupported_type} =
               Torque.encode([%TestStruct{name: "a", value: 1} | :tail])
    end

    test "an improper list without structs reports unsupported_type" do
      assert {:error, :unsupported_type} = Torque.encode([%{"a" => 1} | :tail])
      assert {:error, :unsupported_type} = Torque.encode([1 | :tail])
    end

    test "the iodata encoder raises rather than crashing internally" do
      assert_raise ArgumentError, ~r/unsupported_type/, fn ->
        Torque.encode_to_iodata([%TestStruct{name: "a", value: 1} | :tail])
      end
    end
  end

  describe "struct detection edge cases" do
    test "plain map with binary \"__struct__\" key is not a struct" do
      assert {:ok, json} = Torque.encode(%{"__struct__" => "not-a-struct", a: 1})
      assert %{"__struct__" => "not-a-struct", "a" => 1} = Jason.decode!(json)
    end
  end
end
