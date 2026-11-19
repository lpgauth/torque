defmodule Torque.DecodeDecimalsTest do
  use ExUnit.Case, async: true
  use ExUnitProperties

  defp decimals(json, opts \\ []), do: Torque.decode(json, [floats: :decimals] ++ opts)

  defp digits(range) do
    gen all(ds <- list_of(integer(?0..?9), length: range)) do
      List.to_string(ds)
    end
  end

  defp float_token do
    gen all(
          sign <- member_of(["", "-"]),
          integer <- one_of([constant("0"), map({integer(?1..?9), digits(0..25)}, &join/1)]),
          fraction <- one_of([constant(""), map(digits(1..25), &("." <> &1))]),
          exponent <-
            one_of([
              constant(""),
              map({member_of(~w(e E)), member_of(["", "+", "-"]), digits(1..4)}, &join/1)
            ]),
          fraction != "" or exponent != ""
        ) do
      sign <> integer <> fraction <> exponent
    end
  end

  defp join({first, rest}), do: <<first>> <> rest
  defp join({e, sign, digits}), do: e <> sign <> digits

  property "a float decodes to what Decimal.new/1 makes of its text" do
    check all(token <- float_token()) do
      assert decimals(token) == {:ok, Decimal.new(token)}
    end
  end

  test "keeps the digits a float would lose" do
    assert decimals("1.10") == {:ok, %Decimal{sign: 1, coef: 110, exp: -2}}
    assert decimals("-0.0") == {:ok, %Decimal{sign: -1, coef: 0, exp: -1}}

    assert decimals("0.1234567890123456789012345678901234567890") ==
             {:ok, Decimal.new("0.1234567890123456789012345678901234567890")}
  end

  test "accepts a value beyond a float's range" do
    assert {:error, _} = Torque.decode("1e400")
    assert decimals("1e400") == {:ok, %Decimal{sign: 1, coef: 1, exp: 400}}
    assert decimals("-1.5E-400") == {:ok, %Decimal{sign: -1, coef: 15, exp: -401}}
  end

  test "leaves integers as integers" do
    assert decimals("5") == {:ok, 5}
    assert decimals("-0") == {:ok, 0}

    assert decimals("123456789012345678901234567890") ==
             {:ok, 123_456_789_012_345_678_901_234_567_890}
  end

  test "rejects an exponent beyond 64 bits" do
    assert decimals("1e99999999999999999999") == {:error, :exponent_too_large}
    assert decimals("[1.0e-99999999999999999999]") == {:error, :exponent_too_large}
  end

  test "still rejects a malformed number" do
    for json <- ~w(1. 1.e5 1e 1e+ -.5 01.5) do
      assert {:error, message} = decimals(json)
      assert is_binary(message)
    end
  end

  test "rejects a malformed number beyond a float's range" do
    long = String.duplicate("1234567890", 5)

    for json <- [
          "1.e400",
          "-e400",
          "1e400.5",
          "1e400 1",
          "[1e400,",
          long <> ".e400",
          "0#{long}.5e400"
        ] do
      assert {:error, message} = decimals(json)
      assert is_binary(message)
    end

    assert decimals(" #{long}.5e400 ") == {:ok, Decimal.new("#{long}.5e400")}
  end

  test "works inside containers, with every key kind and on a dirty scheduler" do
    json = ~s({"price":1.10,"n":2,"items":[{"price":-2.50}]})
    price = Decimal.new("1.10")
    item = Decimal.new("-2.50")

    assert decimals(json) == {:ok, %{"price" => price, "n" => 2, "items" => [%{"price" => item}]}}

    for keys <- [:atoms, :atoms!] do
      assert decimals(json, keys: keys) == {:ok, %{price: price, n: 2, items: [%{price: item}]}}
    end

    big = "[" <> Enum.map_join(1..5000, ",", &"#{&1}.#{&1}0") <> "]"
    assert byte_size(big) > 20_000
    assert {:ok, list} = decimals(big, strings: :copy)
    assert List.last(list) == Decimal.new("5000.50000")
  end

  test "rejects an unknown :floats value" do
    assert_raise ArgumentError, ~r/:floats/, fn -> Torque.decode("1.5", floats: :decimal) end
  end
end
