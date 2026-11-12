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

    test "every decoding strategy keeps the sign of a negative zero" do
      # sonic-number loses the sign; every conversion path must restore it.
      json = ~s({"z":-0.0})
      neg = <<-0.0::float-64>>

      assert <<Torque.decode!(json)["z"]::float-64>> == neg

      {:ok, doc} = Torque.parse(json)
      assert {:ok, got} = Torque.get(doc, "/z")
      assert <<got::float-64>> == neg

      ptrs = Torque.compile_pointers(["/z"])
      assert [from_doc] = Torque.get_many_nil(doc, ptrs)
      assert <<from_doc::float-64>> == neg
      assert {:ok, [fused]} = Torque.parse_get_many_nil(json, ptrs)
      assert <<fused::float-64>> == neg
    end

    test "duplicate keys - last value wins" do
      assert {:ok, %{"a" => 2}} = Torque.decode(~s({"a":1,"a":2}))
    end

    test "duplicate keys in nested object - last value wins" do
      assert {:ok, %{"x" => %{"a" => 2}}} = Torque.decode(~s({"x":{"a":1,"a":2}}))
    end

    test "duplicate keys with different value types" do
      assert {:ok, %{"k" => "str"}} = Torque.decode(~s({"k":1,"k":true,"k":"str"}))
    end

    # Above 32 members ERTS builds a hash map. Before erlang/otp#10976,
    # enif_make_map_from_arrays reported success for duplicate keys there and
    # returned an invalid map, so both conversion paths check the map size and
    # rebuild by insertion. Pattern-matching against a VM-built map catches a
    # wrong representation that equality alone would miss.
    test "duplicate keys in a hashmap-sized object still give the Erlang map" do
      pairs = for i <- 1..40, do: {"k#{String.pad_leading(Integer.to_string(i), 2, "0")}", i}
      dup = pairs ++ [{"k01", 999}, {"k40", 998}]
      json = "{" <> Enum.map_join(dup, ",", fn {k, v} -> ~s("#{k}":#{v}) end) <> "}"
      expected = Map.new(dup)

      decoded = Torque.decode!(json)
      assert decoded == expected
      assert map_size(decoded) == 40
      assert ^expected = decoded

      {:ok, doc} = Torque.parse(json)
      assert {:ok, got} = Torque.get(doc, "")
      assert got == expected
      assert ^expected = got
    end

    # The decoder orders flatmap-sized objects by raw key bytes before ERTS
    # sees them. These keys tie on their first 8 bytes, are prefixes of one
    # another, or hold NUL and multi-byte characters.
    test "members out of term order give the Erlang map in every order" do
      keys = [
        "profile_background_image_url_https",
        "profile_background_image_url",
        "profile_banner_url",
        "aaaaaaaaY",
        "aaaaaaaaX",
        "aaaaaaaa",
        "ab",
        "a",
        "\\u0000",
        "a\\u0000b",
        "é",
        "日本",
        "Z"
      ]

      for order <- [keys, Enum.reverse(keys), Enum.shuffle(keys)] do
        json = "{" <> Enum.map_join(order, ",", &~s("#{&1}":"#{&1}")) <> "}"
        expected = Jason.decode!(json)

        decoded = Torque.decode!(json)
        assert map_size(decoded) == length(keys)
        assert ^expected = decoded
      end
    end

    test "duplicate keys out of term order - last value wins" do
      assert {:ok, %{"a" => 3, "b" => 2, "c" => 1, "d" => 1}} =
               Torque.decode(~s({"d":1,"a":1,"c":1,"b":1,"a":2,"b":2,"a":3}))
    end

    test "escaped keys in an out-of-order object" do
      json = ~s({"d":1,"\\u0063":2,"b":3,"\\u0061":4})
      assert %{"a" => 4, "b" => 3, "c" => 2, "d" => 1} = decoded = Torque.decode!(json)
      assert map_size(decoded) == 4
    end

    # The decoder's key cache matches keys on their first and last 8 bytes and
    # length, comparing the middle only for longer keys. These share all three
    # and land in the same slot, so only the middle tells them apart.
    test "repeated keys that differ only in the middle keep their own terms" do
      keys = ["abcdefgh_one__stuvwxyz", "abcdefgh_two__stuvwxyz", "abcdefgh_six__stuvwxyz"]
      record = "{" <> Enum.map_join(keys, ",", &~s("#{&1}":"#{&1}")) <> "}"
      expected = Map.new(keys, &{&1, &1})

      decoded = Torque.decode!("[" <> Enum.join(List.duplicate(record, 50), ",") <> "]")
      assert length(decoded) == 50
      assert Enum.all?(decoded, &(&1 == expected))
    end

    # On OTP 27 :binary.referenced_byte_size/1 reports a heap binary's size in
    # bits, so compare against the input rather than the key.
    test "cached keys never reference the input" do
      keys = ["k", String.duplicate("m", 16), String.duplicate("l", 64)]
      record = "{" <> Enum.map_join(keys, ",", &~s("#{&1}":1)) <> "}"
      json = "[" <> record <> "," <> record <> "]"

      for opts <- [[], [strings: :copy]] do
        decoded = Torque.decode!(json, opts)
        decoded_keys = Enum.flat_map(decoded, &Map.keys/1)
        assert Enum.sort(decoded_keys) == Enum.sort(keys ++ keys)
        refute Enum.any?(decoded_keys, &(:binary.referenced_byte_size(&1) == byte_size(json)))
      end
    end

    # parse/1 scans keys of up to 24 bytes without the string parser, so cover
    # keys on either side of that, with and without input after them.
    test "invalid UTF-8 in a key is rejected" do
      tail = String.duplicate(" ", 40)

      for key <- [<<"a", 0xFF, "b">>, <<String.duplicate("k", 30)::binary, 0xFF>>],
          pad <- ["", tail] do
        json = ~s({"#{key}":1}) <> pad
        assert {:error, message} = Torque.decode(json)
        assert message =~ "Invalid UTF-8"
        assert {:error, _} = Torque.parse(json)
      end
    end

    test "invalid json returns error" do
      assert {:error, _reason} = Torque.decode("{invalid}")
    end

    test "error messages give the position without quoting the input" do
      assert {:error, message} = Torque.decode(~s({"password":"hunter2", oops}))
      assert message =~ ~r/ at line 1 column 24$/
      refute message =~ "hunter2"
      refute message =~ "oops"
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

  describe "decode/2 strings option" do
    defp document(records) do
      long = String.duplicate("s", 80)

      "[" <>
        Enum.map_join(1..records, ",", fn i ->
          ~s({"id":#{i},"text":"#{long}#{i}","esc":"line\\n#{long}","nested":{"k":"#{long}"}})
        end) <> "]"
    end

    defp long_strings(term) when is_map(term),
      do: Enum.flat_map(term, fn {_, v} -> long_strings(v) end)

    defp long_strings(term) when is_list(term), do: Enum.flat_map(term, &long_strings/1)
    defp long_strings(term) when is_binary(term) and byte_size(term) > 64, do: [term]
    defp long_strings(_), do: []

    # Two records stay on the normal scheduler; 200 cross the 20 KB dirty limit.
    test "strings: :copy decodes the same terms with every string detached" do
      for records <- [2, 200] do
        json = document(records)
        reference = Torque.decode!(json)
        assert {:ok, ^reference} = Torque.decode(json, strings: :copy)
        assert ^reference = Torque.decode!(json, strings: :copy)

        copied = long_strings(Torque.decode!(json, strings: :copy))
        assert copied != []
        assert Enum.all?(copied, &(:binary.referenced_byte_size(&1) == byte_size(&1)))

        # The default keeps unescaped strings as sub-binaries of the input.
        assert Enum.any?(
                 long_strings(reference),
                 &(:binary.referenced_byte_size(&1) == byte_size(json))
               )
      end
    end

    test "strings: :reference is the default" do
      json = document(2)
      assert Torque.decode(json, strings: :reference) == Torque.decode(json)
    end

    test "invalid options raise" do
      assert_raise ArgumentError, fn -> Torque.decode("1", strings: :bogus) end
      assert_raise ArgumentError, fn -> Torque.decode("1", bogus: true) end
    end
  end

  describe "decode/2 keys option" do
    defp atomize(term) when is_map(term),
      do: Map.new(term, fn {k, v} -> {String.to_atom(k), atomize(v)} end)

    defp atomize(term) when is_list(term), do: Enum.map(term, &atomize/1)
    defp atomize(term), do: term

    defp records(n) do
      "[" <>
        Enum.map_join(1..n, ",", fn i ->
          ~s({"id":#{i},"name":"n#{i}","tags":[{"k":"v"}],"meta":{},"one":{"x":null}})
        end) <> "]"
    end

    defp fresh_key(prefix), do: "#{prefix}_#{System.unique_integer([:positive])}"

    # Two records stay on the normal scheduler; 500 cross the 20 KB dirty limit.
    test "keys: :atoms and :atoms! decode keys to atoms" do
      for n <- [2, 500] do
        json = records(n)
        expected = atomize(Torque.decode!(json))
        assert {:ok, ^expected} = Torque.decode(json, keys: :atoms)
        assert {:ok, ^expected} = Torque.decode(json, keys: :atoms!)
        assert {:ok, ^expected} = Torque.decode(json, keys: :atoms, strings: :copy)
      end
    end

    test "keys: :strings is the default" do
      json = records(2)
      assert Torque.decode(json, keys: :strings) == Torque.decode(json)
    end

    test "escaped and non-ASCII keys" do
      assert {:ok, %{ab: 1, é: 2, 日本: 3, "": 4}} =
               Torque.decode(~s({"a\\u0062":1,"é":2,"\\u65e5本":3,"":4}), keys: :atoms)
    end

    # The key cache holds keys of 1 to 64 bytes; the rest bypass it.
    test "keys on either side of the key cache's length limit" do
      keys = [String.duplicate("q", 64), String.duplicate("r", 65)]
      record = "{" <> Enum.map_join(keys, ",", &~s("#{&1}":1)) <> "}"
      expected = Map.new(keys, &{String.to_atom(&1), 1})
      assert {:ok, [^expected, ^expected]} = Torque.decode("[#{record},#{record}]", keys: :atoms)
    end

    test "an atom name has at most 255 characters, whatever their encoding" do
      for char <- ["a", "é", "😀"] do
        key = String.duplicate(char, 255)
        assert {:ok, %{} = map} = Torque.decode(~s({"#{key}":1}), keys: :atoms)
        assert [atom] = Map.keys(map)
        assert Atom.to_string(atom) == key

        long = key <> char
        assert {:error, :atom_too_long} = Torque.decode(~s({"#{long}":1}), keys: :atoms)
        assert {:error, :nonexistent_atom} = Torque.decode(~s({"#{long}":1}), keys: :atoms!)
      end
    end

    test "keys: :atoms! rejects a key that names no atom" do
      for key <- [fresh_key("ascii"), fresh_key("ünïcode")] do
        assert {:error, :nonexistent_atom} = Torque.decode(~s({"id":{"#{key}":1}}), keys: :atoms!)

        assert_raise ArgumentError, ~r/nonexistent_atom/, fn ->
          Torque.decode!(~s({"#{key}":1}), keys: :atoms!)
        end

        assert {:ok, %{}} = Torque.decode(~s({"#{key}":1}), keys: :atoms)
        assert {:ok, %{}} = Torque.decode(~s({"#{key}":1}), keys: :atoms!)
      end

      escaped = fresh_key("\\u00e9")
      assert {:error, :nonexistent_atom} = Torque.decode(~s({"#{escaped}":1}), keys: :atoms!)
    end

    test "the last of duplicate keys wins" do
      assert {:ok, %{a: 3, b: 2, c: 4, d: 5}} =
               Torque.decode(~s({"a":1,"b":2,"a":3,"c":4,"d":5}), keys: :atoms)

      pairs = Enum.map_join(1..40, ",", &~s("k#{&1}":#{&1})) <> ~s(,"k7":0)
      assert {:ok, map} = Torque.decode("{#{pairs}}", keys: :atoms)
      assert map_size(map) == 40
      assert map.k7 == 0
    end

    # Small maps keep their keys sorted. A map whose atoms were created in an
    # order other than the document's, mixed with long-standing atoms, has to
    # come out sorted for lookups to find them.
    test "maps answer lookups for every key whatever the atoms' creation order" do
      fresh = for _ <- 1..6, do: fresh_key("order")
      Enum.each(Enum.reverse(fresh), &String.to_atom/1)

      for keys <- [fresh ++ ["id", "name", "error"], Enum.reverse(fresh) ++ ["ok", "id"]],
          count <- [4, length(keys)] do
        keys = Enum.take(keys, count)

        json =
          "{" <>
            Enum.map_join(Enum.with_index(keys), ",", fn {k, i} -> ~s("#{k}":#{i}) end) <> "}"

        assert {:ok, map} = Torque.decode(json, keys: :atoms!)

        for {key, i} <- Enum.with_index(keys) do
          assert Map.fetch!(map, String.to_existing_atom(key)) == i
        end

        assert map == Map.new(Enum.with_index(keys), fn {k, i} -> {String.to_atom(k), i} end)
      end
    end

    test "invalid values raise" do
      assert_raise ArgumentError, fn -> Torque.decode("1", keys: :bogus) end
      assert_raise ArgumentError, fn -> Torque.decode("1", keys: "atoms") end
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
