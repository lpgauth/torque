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

    test "an atom above Latin-1 encodes as UTF-8 everywhere an atom is accepted" do
      # `enif_get_atom` cannot spell these below NIF 2.17, so they used to come
      # back `:unsupported_type` while `:café` encoded. Cover the boundary in
      # both directions and every position an atom can occupy.
      atoms = [
        :ok,
        :"",
        :"\0",
        :"before\0after",
        :"\u00ff",
        :"\u0100",
        :Ω,
        :"🚀",
        :日本語,
        :"é🚀ü",
        :"a\"b\\c\n",
        String.to_atom(String.duplicate("a", 255)),
        String.to_atom(String.duplicate("ÿ", 255)),
        String.to_atom(String.duplicate("🚀", 255))
      ]

      for atom <- atoms do
        for term <- [atom, [atom], %{atom => 1}, %{"k" => atom}] do
          assert Torque.encode(term) == Jason.encode(term),
                 "#{inspect(atom)} in #{inspect(term) |> String.slice(0, 40)}"
        end

        # Jason has no `{proplist}` form, so hold it to the map's output.
        assert Torque.encode({[{atom, 1}]}) == Torque.encode(%{atom => 1}),
               "#{inspect(atom)} as a proplist key"
      end
    end

    test "the widest atom name survives the Unicode fallback" do
      # 255 characters is the ERTS cap; in UTF-8 that is 1020 bytes, four times
      # what the Latin-1 stack buffer holds.
      wide = String.duplicate("🚀", 255)
      assert byte_size(wide) == 1020
      assert {:ok, json} = Torque.encode(%{String.to_atom(wide) => 1})
      assert %{^wide => 1} = Jason.decode!(json)
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

    test "map with integer keys stringifies them" do
      assert {:ok, json} = Torque.encode(%{0 => "a", 1 => "b"})
      assert Jason.decode!(json) == %{"0" => "a", "1" => "b"}
    end

    test "negative integer map key" do
      assert {:ok, ~s({"-1":"x"})} = Torque.encode(%{-1 => "x"})
    end

    test "integer map key beyond i64 uses the u64 path" do
      assert {:ok, json} = Torque.encode(%{9_223_372_036_854_775_808 => "x"})
      assert Jason.decode!(json) == %{"9223372036854775808" => "x"}
    end

    test "bignum map key encodes exactly" do
      assert {:ok, json} = Torque.encode(%{1_180_591_620_717_411_303_424 => "x"})
      assert Jason.decode!(json) == %{"1180591620717411303424" => "x"}
    end

    test "negative bignum map key encodes exactly" do
      assert {:ok, json} = Torque.encode(%{-1_180_591_620_717_411_303_424 => "x"})
      assert Jason.decode!(json) == %{"-1180591620717411303424" => "x"}
    end

    test "proplist with integer keys stringifies them" do
      assert {:ok, ~s({"1":"a","2":"b"})} = Torque.encode({[{1, "a"}, {2, "b"}]})
    end

    test "integer and binary keys that collide emit duplicate names" do
      assert {:ok, json} = Torque.encode(%{1 => "a", "1" => "b"})
      assert json in [~s({"1":"a","1":"b"}), ~s({"1":"b","1":"a"})]
    end

    test "float map key is still rejected" do
      assert {:error, :invalid_key} = Torque.encode(%{1.5 => "x"})
    end

    test "tuple map key is still rejected" do
      assert {:error, :invalid_key} = Torque.encode(%{{:a, :b} => "x"})
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
  end

  describe "encode_to_iodata!/2" do
    test "matches encode_to_iodata/1 output" do
      term = %{nested: %{list: [1, 2, 3], str: "hello"}}
      assert Torque.encode_to_iodata!(term) == Torque.encode_to_iodata(term)
    end

    test "unsupported term raises ArgumentError" do
      assert_raise ArgumentError, ~r/unsupported_type/, fn ->
        Torque.encode_to_iodata!(self())
      end
    end

    test "accepts dirty: true" do
      term = %{"a" => [1, 2, 3], "b" => "hello"}
      assert Torque.encode_to_iodata!(term, dirty: true) == Torque.encode_to_iodata!(term)
    end

    test "is exported at arity 1 for Phoenix's :json_library contract" do
      Code.ensure_loaded!(Torque)
      assert function_exported?(Torque, :encode_to_iodata!, 1)
      assert function_exported?(Torque, :decode!, 1)
    end
  end

  describe "float formatting" do
    # Formatter spelling is part of the output contract and must round-trip
    # through independent decoders.
    @floats [
      0.0,
      -0.0,
      1.0,
      18.0,
      3.14,
      1.0e-7,
      1.0e15,
      1.0e16,
      2.5e-11,
      5.0e-324,
      1.7976931348623157e308
    ]

    test "every float round-trips through Torque and through Jason" do
      for f <- @floats do
        {:ok, json} = Torque.encode(f)
        assert Jason.decode!(json) === f, "Jason lost #{inspect(f)} as #{json}"
        assert Torque.decode!(json) === f, "Torque lost #{inspect(f)} as #{json}"
      end
    end

    test "notation boundaries and signed zero keep their spelling" do
      assert {:ok, "0.0"} = Torque.encode(0.0)
      assert {:ok, "-0.0"} = Torque.encode(-0.0)
      assert {:ok, "18.0"} = Torque.encode(18.0)
      # Pin the formatter's notation boundary and exponent sign.
      assert {:ok, "1000000000000000.0"} = Torque.encode(1.0e15)
      assert {:ok, "1e+16"} = Torque.encode(1.0e16)
      assert {:ok, "1e-7"} = Torque.encode(1.0e-7)
    end

    test "floats nested in containers format the same way" do
      assert {:ok, ~s({"a":[1e+16,-0.0]})} = Torque.encode(%{"a" => [1.0e16, -0.0]})
    end
  end

  # Exercise every handoff between the prefix, SSE2, and AVX2 escape paths.
  describe "string escaping across SWAR/SIMD length boundaries" do
    @lengths [0, 1, 6, 7, 8, 9, 15, 16, 17, 23, 24, 31, 32, 33, 39, 63, 64, 65, 200]

    # Place special bytes at representative offsets within an 8-byte word.
    defp shapes do
      %{
        plain: fn n -> String.duplicate("a", n) end,
        quote_first: fn n -> if n > 0, do: ~s(") <> String.duplicate("a", n - 1), else: "" end,
        quote_last: fn n -> if n > 0, do: String.duplicate("a", n - 1) <> ~s("), else: "" end,
        backslash_mid: fn n ->
          if n > 8,
            do: String.duplicate("a", 7) <> "\\" <> String.duplicate("a", n - 8),
            else: String.duplicate("a", n)
        end,
        control: fn n -> if n > 0, do: String.duplicate("a", n - 1) <> <<1>>, else: "" end,
        newline_last: fn n -> if n > 0, do: String.duplicate("a", n - 1) <> "\n", else: "" end,
        unicode_last: fn n ->
          if n > 1, do: String.duplicate("a", n - 2) <> "é", else: String.duplicate("a", n)
        end,
        unicode_first: fn n ->
          if n > 1, do: "é" <> String.duplicate("a", n - 2), else: String.duplicate("a", n)
        end,
        unicode_only: fn n -> String.duplicate("é", div(n, 2)) end,
        four_byte: fn n ->
          if n >= 4, do: String.duplicate("a", n - 4) <> "🚀", else: String.duplicate("a", n)
        end
      }
    end

    test "values round-trip at every boundary length and escape position" do
      for {name, build} <- shapes(), n <- @lengths do
        s = build.(n)
        {:ok, json} = Torque.encode(%{"k" => s})

        assert Torque.decode!(json) == %{"k" => s},
               "torque lost #{name}/#{n} (#{inspect(s)}) as #{inspect(json)}"

        assert Jason.decode!(json) == %{"k" => s},
               "jason lost #{name}/#{n} (#{inspect(s)}) as #{inspect(json)}"

        assert json == Jason.encode!(%{"k" => s}),
               "spelling differs from Jason for #{name}/#{n} (#{inspect(s)})"
      end
    end

    test "keys round-trip at every boundary length and escape position" do
      for {name, build} <- shapes(), n <- @lengths do
        s = build.(n)
        {:ok, json} = Torque.encode(%{s => 1})

        assert Torque.decode!(json) == %{s => 1},
               "torque lost key #{name}/#{n} (#{inspect(s)}) as #{inspect(json)}"

        assert json == Jason.encode!(%{s => 1}),
               "key spelling differs from Jason for #{name}/#{n} (#{inspect(s)})"
      end
    end

    test "atom names take the same boundaries through the escape-only path" do
      # Atom names use the non-validating path after Latin-1 conversion.
      for n <- @lengths, n > 0 and n <= 200 do
        for body <- [String.duplicate("a", n), String.duplicate("a", max(n - 2, 0)) <> "é"] do
          atom = String.to_atom(body)
          {:ok, json} = Torque.encode(%{atom => 1})

          assert Torque.decode!(json) == %{body => 1},
                 "atom key lost at #{n} (#{inspect(body)}) as #{inspect(json)}"
        end
      end
    end

    test "invalid UTF-8 is rejected at every boundary, whatever the clean prefix" do
      # The prefix stops before non-ASCII so validation resumes at the lead byte.
      for n <- @lengths,
          bad <- [<<0xFF>>, <<0xC3, 0x28>>, <<0xE2, 0x28, 0xA1>>, <<0xED, 0xA0, 0x80>>] do
        s = String.duplicate("a", n) <> bad

        assert {:error, :invalid_utf8} = Torque.encode(%{"k" => s}),
               "accepted invalid utf8 after #{n} clean bytes: #{inspect(s)}"

        assert {:error, :invalid_utf8} = Torque.encode(%{s => 1}),
               "accepted invalid utf8 key after #{n} clean bytes: #{inspect(s)}"
      end
    end

    test "a clean prefix followed by an escape produces one contiguous string" do
      # A wrong resume offset duplicates or drops the clean prefix.
      for n <- 0..40 do
        s = String.duplicate("x", n) <> ~s(") <> String.duplicate("y", n)
        {:ok, json} = Torque.encode(s)

        assert json ==
                 ~s(") <> String.duplicate("x", n) <> ~s(\\") <> String.duplicate("y", n) <> ~s("),
               "resume offset wrong at #{n}: #{inspect(json)}"
      end
    end
  end
end
