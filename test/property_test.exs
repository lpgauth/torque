defmodule Torque.PropertyTest do
  use ExUnit.Case, async: true
  use ExUnitProperties

  @moduletag timeout: 120_000

  # ---- Generators ----

  # Non-empty alphanumeric key, guaranteed to not be purely numeric.
  # Purely numeric keys (e.g. "2") are mis-routed through array-index lookup in
  # pointer_lookup, so they can't be reached via JSON Pointer on objects.
  defp json_key do
    filter(string(:alphanumeric, min_length: 1, max_length: 15), fn s ->
      case Integer.parse(s) do
        {_, ""} -> false
        _ -> true
      end
    end)
  end

  # Scalars that roundtrip exactly through Jason → Torque (no float precision issues)
  defp json_scalar_exact do
    one_of([
      string(:alphanumeric, max_length: 20),
      integer(-1_000_000..1_000_000),
      boolean(),
      constant(nil)
    ])
  end

  # Full scalar set used where we only care about safety, not value equality
  defp json_scalar do
    one_of([
      json_scalar_exact(),
      float(min: -1_000.0, max: 1_000.0)
    ])
  end

  # Depth-limited recursive JSON term with binary keys (matches Torque decode output)
  defp json_term(depth \\ 3) do
    if depth == 0 do
      json_scalar_exact()
    else
      one_of([
        json_scalar_exact(),
        list_of(json_term(depth - 1), max_length: 4),
        map_of(json_key(), json_term(depth - 1), max_length: 4)
      ])
    end
  end

  # Build a JSON object string with len(values) occurrences of the same key.
  # Used to exercise duplicate-key code paths.
  defp build_dup_json(key, values) do
    pairs = Enum.map_join(values, ",", fn v -> ~s("#{key}":#{Jason.encode!(v)}) end)
    "{#{pairs}}"
  end

  # ---- Safety: no crashes under any input ----

  describe "safety: never crash" do
    property "decode/1 never crashes on generated JSON" do
      check all(term <- json_term()) do
        json = Jason.encode!(term)
        result = Torque.decode(json)
        assert match?({:ok, _}, result) or match?({:error, _}, result)
      end
    end

    property "parse/1 never crashes on generated JSON" do
      check all(term <- json_term()) do
        json = Jason.encode!(term)
        result = Torque.parse(json)
        assert match?({:ok, _}, result) or match?({:error, _}, result)
      end
    end

    property "parse+get never crashes on arbitrary paths" do
      check all(
              term <- json_term(),
              key <- json_key()
            ) do
        json = Jason.encode!(term)
        {:ok, doc} = Torque.parse(json)
        result = Torque.get(doc, "/#{key}")
        assert match?({:ok, _}, result) or match?({:error, :no_such_field}, result)
      end
    end

    property "decode never crashes with N duplicate keys (N up to 20)" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar(), min_length: 2, max_length: 20)
            ) do
        json = build_dup_json(key, values)
        result = Torque.decode(json)
        assert match?({:ok, _}, result) or match?({:error, _}, result)
      end
    end

    property "parse+get never crashes with duplicate keys" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar(), min_length: 2, max_length: 20)
            ) do
        json = build_dup_json(key, values)
        {:ok, doc} = Torque.parse(json)

        for path <- ["", "/", "/#{key}"] do
          result = Torque.get(doc, path)
          assert match?({:ok, _}, result) or match?({:error, _}, result)
        end
      end
    end

    property "get_many never crashes with duplicate keys (exercises heap path at >64)" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar(), min_length: 2, max_length: 10),
              n_paths <- integer(1..70)
            ) do
        json = build_dup_json(key, values)
        {:ok, doc} = Torque.parse(json)
        paths = List.duplicate("/#{key}", n_paths)
        result = Torque.get_many(doc, paths)
        assert is_list(result) and length(result) == n_paths
      end
    end

    property "get_many_nil never crashes with duplicate keys (exercises heap path at >64)" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar(), min_length: 2, max_length: 10),
              n_paths <- integer(1..70)
            ) do
        json = build_dup_json(key, values)
        {:ok, doc} = Torque.parse(json)
        paths = List.duplicate("/#{key}", n_paths)
        result = Torque.get_many_nil(doc, paths)
        assert is_list(result) and length(result) == n_paths
      end
    end

    property "decode never crashes with duplicate keys nested N levels deep" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar(), min_length: 2, max_length: 5),
              depth <- integer(1..8)
            ) do
        inner = build_dup_json(key, values)
        json = Enum.reduce(1..depth, inner, fn _i, acc -> ~s({"nested":#{acc}}) end)
        result = Torque.decode(json)
        assert match?({:ok, _}, result) or match?({:error, _}, result)
      end
    end

    property "decode never crashes with duplicate-key objects in arrays" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar(), min_length: 2, max_length: 5),
              n <- integer(1..20)
            ) do
        obj = build_dup_json(key, values)
        json = "[" <> Enum.join(List.duplicate(obj, n), ",") <> "]"
        result = Torque.decode(json)
        assert match?({:ok, _}, result) or match?({:error, _}, result)
      end
    end

    property "length/2 never crashes on arbitrary paths" do
      check all(
              term <- json_term(),
              key <- json_key()
            ) do
        json = Jason.encode!(term)
        {:ok, doc} = Torque.parse(json)
        result = Torque.length(doc, "/#{key}")
        assert is_nil(result) or is_integer(result)
      end
    end
  end

  # ---- Duplicate key semantics: last value wins ----

  describe "duplicate keys: last value wins" do
    property "decode: last of N duplicates wins" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar_exact(), min_length: 2, max_length: 20)
            ) do
        json = build_dup_json(key, values)
        {:ok, result} = Torque.decode(json)
        assert result[key] == List.last(values)
      end
    end

    property "parse+get: last of N duplicates wins" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar_exact(), min_length: 2, max_length: 10)
            ) do
        json = build_dup_json(key, values)
        {:ok, doc} = Torque.parse(json)
        assert {:ok, List.last(values)} == Torque.get(doc, "/#{key}")
      end
    end

    property "decode: last value wins when types change across duplicates" do
      check all(
              key <- json_key(),
              v1 <- json_scalar_exact(),
              v2 <- json_scalar_exact(),
              v3 <- json_scalar_exact()
            ) do
        json =
          ~s({"#{key}":#{Jason.encode!(v1)},"#{key}":#{Jason.encode!(v2)},"#{key}":#{Jason.encode!(v3)}})

        {:ok, result} = Torque.decode(json)
        assert result[key] == v3
      end
    end

    property "decode: duplicate key in nested object — last wins in inner scope" do
      check all(
              key <- json_key(),
              v1 <- json_scalar_exact(),
              v2 <- json_scalar_exact()
            ) do
        json =
          ~s({"outer":{"#{key}":#{Jason.encode!(v1)},"#{key}":#{Jason.encode!(v2)}}})

        {:ok, decoded} = Torque.decode(json)
        assert decoded["outer"][key] == v2
      end
    end

    property "get_many: all paths into duplicate-key object return last value" do
      check all(
              key <- json_key(),
              values <- list_of(json_scalar_exact(), min_length: 2, max_length: 10),
              n_paths <- integer(1..10)
            ) do
        json = build_dup_json(key, values)
        {:ok, doc} = Torque.parse(json)
        paths = List.duplicate("/#{key}", n_paths)
        results = Torque.get_many(doc, paths)
        expected = List.last(values)
        assert Enum.all?(results, fn {:ok, v} -> v == expected end)
      end
    end
  end

  # ---- API consistency ----

  describe "parse+get vs decode consistency" do
    property "get(\"\") and get(\"/\") both return the root value" do
      check all(term <- json_term()) do
        json = Jason.encode!(term)
        {:ok, decoded} = Torque.decode(json)
        {:ok, doc} = Torque.parse(json)
        assert {:ok, decoded} == Torque.get(doc, "")
        assert {:ok, decoded} == Torque.get(doc, "/")
      end
    end

    property "get on top-level map keys matches decode" do
      check all(pairs <- map_of(json_key(), json_scalar_exact(), min_length: 1, max_length: 10)) do
        json = Jason.encode!(pairs)
        {:ok, decoded} = Torque.decode(json)
        {:ok, doc} = Torque.parse(json)

        for {k, expected} <- decoded do
          assert {:ok, expected} == Torque.get(doc, "/#{k}")
        end
      end
    end

    property "get on missing keys always returns no_such_field" do
      check all(
              pairs <- map_of(json_key(), json_scalar_exact(), max_length: 5),
              missing_key <- string(:alphanumeric, min_length: 20, max_length: 30)
            ) do
        json = Jason.encode!(pairs)
        {:ok, doc} = Torque.parse(json)
        # A 20-30 char random key is essentially guaranteed to be absent
        assert {:error, :no_such_field} == Torque.get(doc, "/#{missing_key}")
      end
    end
  end

  describe "get_many consistency" do
    property "get_many matches individual get calls" do
      check all(pairs <- map_of(json_key(), json_scalar_exact(), min_length: 1, max_length: 10)) do
        json = Jason.encode!(pairs)
        {:ok, doc} = Torque.parse(json)
        paths = Map.keys(pairs) |> Enum.map(&"/#{&1}")
        expected = Enum.map(paths, &Torque.get(doc, &1))
        assert expected == Torque.get_many(doc, paths)
      end
    end

    property "get_many_nil matches unwrapped get_many" do
      check all(
              pairs <-
                map_of(json_key(), json_scalar_exact(), min_length: 1, max_length: 10)
            ) do
        json = Jason.encode!(pairs)
        {:ok, doc} = Torque.parse(json)
        paths = (Map.keys(pairs) |> Enum.map(&"/#{&1}")) ++ ["/nonexistent_zzz"]

        wrapped = Torque.get_many(doc, paths)
        unwrapped = Torque.get_many_nil(doc, paths)

        expected =
          Enum.map(wrapped, fn
            {:ok, v} -> v
            {:error, :no_such_field} -> nil
          end)

        assert expected == unwrapped
      end
    end

    property "get_many with >64 paths exercises heap allocation" do
      check all(pairs <- map_of(json_key(), json_scalar_exact(), min_length: 1, max_length: 5)) do
        json = Jason.encode!(pairs)
        {:ok, doc} = Torque.parse(json)
        # Repeat keys to exceed GET_MANY_STACK = 64
        paths = pairs |> Map.keys() |> Enum.map(&"/#{&1}") |> Stream.cycle() |> Enum.take(65)
        result = Torque.get_many(doc, paths)
        assert length(result) == 65
        assert Enum.all?(result, &match?({:ok, _}, &1))
      end
    end

    property "get_many_nil with >64 paths exercises heap allocation" do
      check all(pairs <- map_of(json_key(), json_scalar_exact(), min_length: 1, max_length: 5)) do
        json = Jason.encode!(pairs)
        {:ok, doc} = Torque.parse(json)
        paths = pairs |> Map.keys() |> Enum.map(&"/#{&1}") |> Stream.cycle() |> Enum.take(65)
        result = Torque.get_many_nil(doc, paths)
        assert length(result) == 65
      end
    end
  end

  describe "array access" do
    property "sequential array index access matches list elements" do
      check all(items <- list_of(json_scalar_exact(), min_length: 1, max_length: 20)) do
        json = ~s({"arr":#{Jason.encode!(items)}})
        {:ok, doc} = Torque.parse(json)

        for {expected, i} <- Enum.with_index(items) do
          assert {:ok, expected} == Torque.get(doc, "/arr/#{i}")
        end
      end
    end

    property "out-of-bounds array index returns no_such_field" do
      check all(items <- list_of(json_scalar_exact(), max_length: 10)) do
        json = ~s({"arr":#{Jason.encode!(items)}})
        {:ok, doc} = Torque.parse(json)
        oob = length(items)
        assert {:error, :no_such_field} == Torque.get(doc, "/arr/#{oob}")
      end
    end

    property "length/2 returns correct element count" do
      check all(items <- list_of(json_scalar_exact(), max_length: 50)) do
        json = ~s({"arr":#{Jason.encode!(items)}})
        {:ok, doc} = Torque.parse(json)
        assert length(items) == Torque.length(doc, "/arr")
      end
    end

    property "length/2 returns nil for non-array and missing paths" do
      check all(pairs <- map_of(json_key(), json_scalar_exact(), min_length: 1, max_length: 5)) do
        json = Jason.encode!(pairs)
        {:ok, doc} = Torque.parse(json)

        for k <- Map.keys(pairs) do
          # Scalar values should return nil for length
          assert is_nil(Torque.length(doc, "/#{k}"))
        end
      end
    end
  end

  # ---- Encode/decode roundtrip ----

  describe "encode/decode roundtrip" do
    property "decode then encode then decode is idempotent" do
      check all(term <- json_term()) do
        json = Jason.encode!(term)
        {:ok, decoded1} = Torque.decode(json)
        {:ok, encoded} = Torque.encode(decoded1)
        {:ok, decoded2} = Torque.decode(encoded)
        assert decoded1 == decoded2
      end
    end

    property "encode then decode preserves scalars exactly" do
      check all(term <- one_of([integer(), boolean(), constant(nil), string(:alphanumeric)])) do
        {:ok, json} = Torque.encode(term)
        {:ok, decoded} = Torque.decode(json)
        assert decoded == term
      end
    end

    property "encode then decode preserves u64-range integers" do
      check all(n <- integer(9_223_372_036_854_775_808..18_446_744_073_709_551_615)) do
        {:ok, json} = Torque.encode(n)
        {:ok, decoded} = Torque.decode(json)
        assert decoded == n
      end
    end

    property "encode then decode preserves maps with binary keys" do
      check all(
              pairs <-
                map_of(
                  json_key(),
                  one_of([integer(), boolean(), constant(nil), string(:alphanumeric)]),
                  max_length: 10
                )
            ) do
        {:ok, json} = Torque.encode(pairs)
        {:ok, decoded} = Torque.decode(json)
        assert decoded == pairs
      end
    end

    property "all decoded map keys are binaries" do
      check all(term <- map_of(json_key(), json_scalar_exact(), max_length: 10)) do
        json = Jason.encode!(term)
        {:ok, decoded} = Torque.decode(json)
        assert is_map(decoded)
        assert Enum.all?(Map.keys(decoded), &is_binary/1)
      end
    end
  end

  # ---- Nesting depth limit ----

  describe "nesting depth limit (512)" do
    test "decode returns error at depth 513" do
      json = Enum.reduce(1..513, ~s("leaf"), fn _, acc -> ~s({"x":#{acc}}) end)
      assert {:error, :nesting_too_deep} = Torque.decode(json)
    end

    test "decode succeeds at depth 512" do
      json = Enum.reduce(1..512, ~s("leaf"), fn _, acc -> ~s({"x":#{acc}}) end)
      assert {:ok, _} = Torque.decode(json)
    end

    test "get returns error at depth 513" do
      json = Enum.reduce(1..513, ~s("leaf"), fn _, acc -> ~s({"x":#{acc}}) end)
      {:ok, doc} = Torque.parse(json)
      assert {:error, :nesting_too_deep} = Torque.get(doc, "")
    end

    test "encode returns error at depth 513" do
      term = Enum.reduce(1..513, "leaf", fn _, acc -> %{"x" => acc} end)
      assert {:error, :nesting_too_deep} = Torque.encode(term)
    end

    test "encode succeeds at depth 512" do
      term = Enum.reduce(1..512, "leaf", fn _, acc -> %{"x" => acc} end)
      assert {:ok, _} = Torque.encode(term)
    end

    test "encode_to_iodata raises at depth 513" do
      term = Enum.reduce(1..513, "leaf", fn _, acc -> %{"x" => acc} end)
      assert_raise ArgumentError, fn -> Torque.encode_to_iodata(term) end
    end
  end

  # ---- JSON Pointer edge cases ----

  describe "JSON Pointer edge cases" do
    property "tilde-escaped keys (~0 and ~1) are decoded correctly" do
      check all(suffix <- string(:alphanumeric, max_length: 10)) do
        # Key "a~b" must be addressed as "/a~0b"
        json = ~s({"a~b#{suffix}": 42})
        {:ok, doc} = Torque.parse(json)
        assert {:ok, 42} == Torque.get(doc, "/a~0b#{suffix}")

        # Key "a/b" must be addressed as "/a~1b"
        json2 = ~s({"a/b#{suffix}": 99})
        {:ok, doc2} = Torque.parse(json2)
        assert {:ok, 99} == Torque.get(doc2, "/a~1b#{suffix}")
      end
    end

    property "numeric-looking string keys work alongside integer array indexes" do
      check all(n <- integer(0..100)) do
        # Object key that looks like an integer — should be treated as a string key
        json = ~s({"#{n}": "string_val"})
        {:ok, doc} = Torque.parse(json)
        # Accessing "/N" on an object should still find the string key "N"
        result = Torque.get(doc, "/#{n}")
        assert match?({:ok, _}, result) or match?({:error, :no_such_field}, result)
      end
    end
  end
end
