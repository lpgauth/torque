defmodule Torque.PointerTest do
  use ExUnit.Case, async: true

  @sample_json ~s({
    "id": "req-123",
    "site": {
      "domain": "example.com",
      "page": "https://example.com/page",
      "publisher": {"id": "pub-456"}
    },
    "device": {
      "devicetype": 2,
      "ua": "Mozilla/5.0",
      "ip": "1.2.3.4",
      "geo": {
        "country": "US",
        "lat": 40.7128,
        "lon": -74.006,
        "region": "NY",
        "type": 2,
        "zip": "10001"
      }
    },
    "user": {
      "id": "user-789",
      "buyeruid": "buyer-abc",
      "ext": {
        "eids": [
          {"source": "adserver.org", "uids": [{"id": "uid-1"}]},
          {"source": "criteo.com", "uids": [{"id": "uid-2"}]}
        ]
      }
    },
    "imp": [
      {
        "id": "imp-1",
        "banner": {"w": 300, "h": 250, "pos": 1},
        "bidfloor": 0.5,
        "pmp": {
          "private_auction": 1,
          "deals": [{"id": "deal-1"}, {"id": "deal-2"}]
        }
      }
    ],
    "regs": {"coppa": 0}
  })

  setup do
    {:ok, doc} = Torque.parse(@sample_json)
    %{doc: doc}
  end

  describe "parse/1 + get/2" do
    test "string field", %{doc: doc} do
      assert {:ok, "req-123"} = Torque.get(doc, "/id")
    end

    test "nested string field", %{doc: doc} do
      assert {:ok, "example.com"} = Torque.get(doc, "/site/domain")
    end

    test "deeply nested string", %{doc: doc} do
      assert {:ok, "pub-456"} = Torque.get(doc, "/site/publisher/id")
    end

    test "integer field", %{doc: doc} do
      assert {:ok, 2} = Torque.get(doc, "/device/devicetype")
    end

    test "float field", %{doc: doc} do
      assert {:ok, lat} = Torque.get(doc, "/device/geo/lat")
      assert_in_delta 40.7128, lat, 0.0001
    end

    test "negative float", %{doc: doc} do
      assert {:ok, lon} = Torque.get(doc, "/device/geo/lon")
      assert_in_delta -74.006, lon, 0.001
    end

    test "integer zero", %{doc: doc} do
      assert {:ok, 0} = Torque.get(doc, "/regs/coppa")
    end

    test "array field returns full list", %{doc: doc} do
      assert {:ok, imps} = Torque.get(doc, "/imp")
      assert is_list(imps)
      assert length(imps) == 1
      [imp] = imps
      assert imp["id"] == "imp-1"
    end

    test "array index", %{doc: doc} do
      assert {:ok, imp} = Torque.get(doc, "/imp/0")
      assert imp["id"] == "imp-1"
    end

    test "nested array access", %{doc: doc} do
      assert {:ok, 300} = Torque.get(doc, "/imp/0/banner/w")
      assert {:ok, 250} = Torque.get(doc, "/imp/0/banner/h")
    end

    test "deep nested array", %{doc: doc} do
      assert {:ok, eids} = Torque.get(doc, "/user/ext/eids")
      assert is_list(eids)
      assert length(eids) == 2
    end

    test "array element nested field", %{doc: doc} do
      assert {:ok, "adserver.org"} = Torque.get(doc, "/user/ext/eids/0/source")
    end

    test "missing field returns error", %{doc: doc} do
      assert {:error, :no_such_field} = Torque.get(doc, "/nonexistent")
    end

    test "missing nested field returns error", %{doc: doc} do
      assert {:error, :no_such_field} = Torque.get(doc, "/site/nonexistent/deep")
    end

    test "get/3 returns default for missing field", %{doc: doc} do
      assert nil == Torque.get(doc, "/nonexistent", nil)
      assert "default" == Torque.get(doc, "/missing", "default")
    end

    test "get/3 returns value for existing field", %{doc: doc} do
      assert "example.com" == Torque.get(doc, "/site/domain", nil)
    end

    test "object field returns map", %{doc: doc} do
      assert {:ok, geo} = Torque.get(doc, "/device/geo")
      assert is_map(geo)
      assert geo["country"] == "US"
      assert geo["zip"] == "10001"
    end

    test "numeric string object key is reachable via JSON Pointer" do
      {:ok, doc} = Torque.parse(~s({"2":"two","10":"ten"}))
      assert {:ok, "two"} = Torque.get(doc, "/2")
      assert {:ok, "ten"} = Torque.get(doc, "/10")
    end

    test "nested numeric string object key is reachable via JSON Pointer" do
      {:ok, doc} = Torque.parse(~s({"k1":"v1","k2":{"10":"ten","n1":"nv1"}}))
      assert {:ok, "v1"} = Torque.get(doc, "/k1")
      assert {:ok, %{"10" => "ten", "n1" => "nv1"}} = Torque.get(doc, "/k2")
      assert {:ok, "ten"} = Torque.get(doc, "/k2/10")
      assert {:ok, "nv1"} = Torque.get(doc, "/k2/n1")
    end

    test "numeric segment dispatches on node type" do
      {:ok, obj_doc} = Torque.parse(~s({"0":"from-object"}))
      {:ok, arr_doc} = Torque.parse(~s(["from-array"]))

      assert {:ok, "from-object"} = Torque.get(obj_doc, "/0")
      assert {:ok, "from-array"} = Torque.get(arr_doc, "/0")
    end
  end

  describe "get_many/2" do
    test "returns all values", %{doc: doc} do
      paths = ["/id", "/site/domain", "/device/devicetype", "/nonexistent"]

      assert [
               {:ok, "req-123"},
               {:ok, "example.com"},
               {:ok, 2},
               {:error, :no_such_field}
             ] = Torque.get_many(doc, paths)
    end

    test "empty paths list", %{doc: doc} do
      assert [] = Torque.get_many(doc, [])
    end

    test "numeric string object keys" do
      {:ok, doc} = Torque.parse(~s({"1":"one","2":"two"}))
      assert [{:ok, "one"}, {:ok, "two"}] = Torque.get_many(doc, ["/1", "/2"])
    end

    test "all fields", %{doc: doc} do
      paths = [
        "/id",
        "/site/domain",
        "/site/page",
        "/site/publisher/id",
        "/device/devicetype",
        "/device/ua",
        "/device/ip",
        "/device/geo/country",
        "/device/geo/lat",
        "/device/geo/lon",
        "/device/geo/region",
        "/device/geo/zip",
        "/user/id",
        "/user/buyeruid",
        "/user/ext/eids",
        "/imp",
        "/regs/coppa"
      ]

      results = Torque.get_many(doc, paths)
      assert length(results) == 17
      assert Enum.all?(results, &match?({:ok, _}, &1))
    end
  end

  describe "get_many_nil/2" do
    test "returns values directly with nil for missing", %{doc: doc} do
      paths = ["/id", "/site/domain", "/device/devicetype", "/nonexistent"]
      assert ["req-123", "example.com", 2, nil] = Torque.get_many_nil(doc, paths)
    end

    test "empty paths list", %{doc: doc} do
      assert [] = Torque.get_many_nil(doc, [])
    end

    test "matches get_many unwrapped", %{doc: doc} do
      paths = [
        "/id",
        "/site/domain",
        "/site/page",
        "/site/publisher/id",
        "/device/devicetype",
        "/device/geo/lat",
        "/device/geo/lon",
        "/user/ext/eids",
        "/imp",
        "/nonexistent",
        "/regs/coppa"
      ]

      wrapped = Torque.get_many(doc, paths)
      unwrapped = Torque.get_many_nil(doc, paths)

      expected =
        Enum.map(wrapped, fn
          {:ok, v} -> v
          {:error, :no_such_field} -> nil
        end)

      assert unwrapped == expected
    end
  end

  describe "length/2" do
    test "returns array length", %{doc: doc} do
      assert 1 = Torque.length(doc, "/imp")
      assert 2 = Torque.length(doc, "/user/ext/eids")
    end

    test "returns nil for non-array", %{doc: doc} do
      assert nil == Torque.length(doc, "/id")
      assert nil == Torque.length(doc, "/site")
    end

    test "returns nil for missing path", %{doc: doc} do
      assert nil == Torque.length(doc, "/nonexistent")
    end
  end

  describe "parse/2 unique_keys" do
    test "uses fast lookup path" do
      {:ok, doc} = Torque.parse(~s({"a":1,"b":2}), unique_keys: true)
      assert {:ok, 1} = Torque.get(doc, "/a")
      assert {:ok, 2} = Torque.get(doc, "/b")
      assert {:error, :no_such_field} = Torque.get(doc, "/c")
    end

    test "nested objects" do
      {:ok, doc} = Torque.parse(~s({"x":{"y":"z"}}), unique_keys: true)
      assert {:ok, "z"} = Torque.get(doc, "/x/y")
    end

    test "get_many" do
      {:ok, doc} = Torque.parse(~s({"a":1,"b":2}), unique_keys: true)
      assert [{:ok, 1}, {:ok, 2}] = Torque.get_many(doc, ["/a", "/b"])
    end

    test "get_many_nil" do
      {:ok, doc} = Torque.parse(~s({"a":1,"b":2}), unique_keys: true)
      assert [1, 2, nil] = Torque.get_many_nil(doc, ["/a", "/b", "/c"])
    end

    test "dirty scheduler for large payload" do
      large_map = Map.new(1..500, fn i -> {"key_#{i}", String.duplicate("v", 20)} end)
      json = Jason.encode!(large_map)
      {:ok, doc} = Torque.parse(json, unique_keys: true)
      assert {:ok, _} = Torque.get(doc, "/key_1")
    end
  end

  describe "duplicate keys" do
    test "parse + get on object with duplicate keys - last value wins" do
      {:ok, doc} = Torque.parse(~s({"a":1,"b":2,"a":3}))
      assert {:ok, %{"a" => 3, "b" => 2}} = Torque.get(doc, "")
    end

    test "parse + get nested object with duplicate keys" do
      {:ok, doc} = Torque.parse(~s({"x":{"k":"first","k":"last"}}))
      assert {:ok, %{"k" => "last"}} = Torque.get(doc, "/x")
    end

    test "parse + get_many with duplicate key object" do
      {:ok, doc} = Torque.parse(~s({"a":1,"a":2}))
      assert [{:ok, %{"a" => 2}}] = Torque.get_many(doc, [""])
    end
  end

  describe "get/3 error propagation" do
    test "returns default for missing field" do
      {:ok, doc} = Torque.parse(~s({"a":1}))
      assert "default" == Torque.get(doc, "/b", "default")
    end
  end

  describe "parse/1 errors" do
    test "invalid json" do
      assert {:error, _} = Torque.parse("{invalid}")
    end

    test "empty string" do
      assert {:error, _} = Torque.parse("")
    end
  end

  describe "parse/1 dirty scheduler" do
    test "large payload uses dirty scheduler" do
      large_map = Map.new(1..500, fn i -> {"key_#{i}", String.duplicate("v", 20)} end)
      json = Jason.encode!(large_map)
      assert byte_size(json) > 10_240
      {:ok, doc} = Torque.parse(json)
      assert {:ok, _} = Torque.get(doc, "/key_1")
    end
  end

  describe "non-binary path entries raise" do
    test "get_many raises ArgumentError", %{doc: doc} do
      assert_raise ArgumentError, fn -> Torque.get_many(doc, ["/id", :bad]) end
      assert_raise ArgumentError, fn -> Torque.get_many(doc, [42]) end
    end

    test "get_many_nil raises ArgumentError", %{doc: doc} do
      assert_raise ArgumentError, fn -> Torque.get_many_nil(doc, ["/id", :bad]) end
    end

    test "compile_pointers raises ArgumentError" do
      assert_raise ArgumentError, fn -> Torque.compile_pointers(["/a", 42]) end
      assert_raise ArgumentError, fn -> Torque.compile_pointers([nil]) end
    end

    test "non-UTF-8 binary paths raise ArgumentError", %{doc: doc} do
      assert_raise ArgumentError, fn -> Torque.get_many(doc, [<<0xFF>>]) end
      assert_raise ArgumentError, fn -> Torque.compile_pointers([<<0xFF>>]) end
    end
  end

  describe "unknown options raise" do
    test "a misspelled option is not silently defaulted" do
      # `unique_keys` changes what the caller gets back, so a typo that
      # silently kept the default was a correctness trap.
      assert_raise ArgumentError, fn -> Torque.compile_pointers(["/a"], unique_key: true) end
      assert_raise ArgumentError, fn -> Torque.parse(~s({"a":1}), unique_key: true) end
      assert_raise ArgumentError, fn -> Torque.encode(%{a: 1}, dirtyy: true) end
      assert_raise ArgumentError, fn -> Torque.encode!(%{a: 1}, dirtyy: true) end
      assert_raise ArgumentError, fn -> Torque.encode_to_iodata(%{a: 1}, dirtyy: true) end
    end

    test "the documented options still work" do
      assert Torque.compile_pointers(["/a"], unique_keys: true) |> is_reference()
      assert {:ok, _} = Torque.parse(~s({"a":1}), unique_keys: true)
      assert {:ok, ~s({"a":1})} = Torque.encode(%{a: 1}, dirty: true)
      assert ~s({"a":1}) == Torque.encode_to_iodata(%{a: 1}, dirty: true)
    end
  end

  describe "large subtree extraction" do
    # Exercises the node-count timeslice accounting paths (>512 terms built).
    test "get of a large root returns the full document" do
      large = Map.new(1..2000, fn i -> {"k#{i}", i} end)
      {:ok, doc} = Torque.parse(Jason.encode!(large))
      assert {:ok, ^large} = Torque.get(doc, "")
    end

    test "get_many_nil of large arrays returns full lists" do
      items = Enum.to_list(1..5000)
      {:ok, doc} = Torque.parse(Jason.encode!(%{"arr" => items}))
      assert [^items] = Torque.get_many_nil(doc, ["/arr"])
    end

    test "compiled pointer extraction of a large subtree" do
      items = Enum.to_list(1..5000)
      json = Jason.encode!(%{"arr" => items})
      ptrs = Torque.compile_pointers(["/arr"])
      {:ok, doc} = Torque.parse(json)
      assert [^items] = Torque.get_many_nil(doc, ptrs)
      assert {:ok, [^items]} = Torque.parse_get_many_nil(json, ptrs)
    end
  end

  describe "roundtrip" do
    test "decode then encode preserves data" do
      json = ~s({"a":1,"b":"hello","c":[1,2,3],"d":true,"e":null})
      {:ok, decoded} = Torque.decode(json)
      {:ok, encoded} = Torque.encode(decoded)
      {:ok, decoded2} = Torque.decode(encoded)
      assert decoded == decoded2
    end
  end

  describe "compile_pointers/2 + get_many_nil/2" do
    @ptr_paths [
      "/id",
      "/site/domain",
      "/device/geo/lat",
      "/imp/0/banner/w",
      "/nonexistent"
    ]

    test "matches get_many_nil with raw paths", %{doc: doc} do
      ptrs = Torque.compile_pointers(@ptr_paths)
      assert Torque.get_many_nil(doc, ptrs) == Torque.get_many_nil(doc, @ptr_paths)
    end

    test "extracts scalars, arrays, and nil for missing", %{doc: doc} do
      ptrs = Torque.compile_pointers(@ptr_paths)
      assert ["req-123", "example.com", 40.7128, 300, nil] = Torque.get_many_nil(doc, ptrs)
    end

    test "unique_keys handle matches default for unique-keyed input", %{doc: doc} do
      uniq = Torque.compile_pointers(@ptr_paths, unique_keys: true)
      default = Torque.compile_pointers(@ptr_paths)
      assert Torque.get_many_nil(doc, uniq) == Torque.get_many_nil(doc, default)
    end

    test "empty pointer list" do
      {:ok, doc} = Torque.parse(~s({"a":1}))
      assert [] = Torque.get_many_nil(doc, Torque.compile_pointers([]))
    end

    test "root path returns whole document" do
      {:ok, doc} = Torque.parse(~s({"a":1}))
      ptrs = Torque.compile_pointers([""])
      assert [%{"a" => 1}] = Torque.get_many_nil(doc, ptrs)
    end

    test "numeric segment dispatches on node type via compiled handle" do
      {:ok, obj_doc} = Torque.parse(~s({"0":"from-object"}))
      {:ok, arr_doc} = Torque.parse(~s(["from-array"]))
      ptrs = Torque.compile_pointers(["/0"])
      assert ["from-object"] = Torque.get_many_nil(obj_doc, ptrs)
      assert ["from-array"] = Torque.get_many_nil(arr_doc, ptrs)
    end

    test "tilde escapes are unescaped at compile time" do
      {:ok, doc} = Torque.parse(~s({"a/b":1,"c~d":2}))
      ptrs = Torque.compile_pointers(["/a~1b", "/c~0d"])
      assert [1, 2] = Torque.get_many_nil(doc, ptrs)
    end
  end

  describe "parse_get_many_nil/2" do
    @fused_paths [
      "/id",
      "/site/domain",
      "/device/geo/lat",
      "/imp/0/banner/w",
      "/nonexistent"
    ]

    test "fused parse + extract matches parse + get_many_nil" do
      ptrs = Torque.compile_pointers(@fused_paths)
      {:ok, fused} = Torque.parse_get_many_nil(@sample_json, ptrs)
      {:ok, doc} = Torque.parse(@sample_json)
      assert fused == Torque.get_many_nil(doc, @fused_paths)
    end

    test "returns {:ok, values} with nil for missing and null" do
      ptrs = Torque.compile_pointers(["/id", "/site/domain", "/missing", "/null"])
      json = ~s({"id":"x","site":{"domain":"e.com"},"null":null})
      assert {:ok, ["x", "e.com", nil, nil]} = Torque.parse_get_many_nil(json, ptrs)
    end

    test "honors unique_keys from the handle" do
      ptrs = Torque.compile_pointers(["/a", "/b"], unique_keys: true)
      assert {:ok, [1, 2]} = Torque.parse_get_many_nil(~s({"a":1,"b":2}), ptrs)
    end

    test "returns error tuple for malformed json" do
      ptrs = Torque.compile_pointers(["/a"])
      assert {:error, _} = Torque.parse_get_many_nil("not json", ptrs)
      assert {:error, _} = Torque.parse_get_many_nil("", ptrs)
    end

    test "dirty scheduler for large payload" do
      large_map = Map.new(1..600, fn i -> {"key_#{i}", String.duplicate("v", 40)} end)
      json = Jason.encode!(large_map)
      assert byte_size(json) > 20_480
      ptrs = Torque.compile_pointers(["/key_1", "/key_600", "/missing"])
      assert {:ok, [v1, v600, nil]} = Torque.parse_get_many_nil(json, ptrs)
      assert is_binary(v1) and is_binary(v600)
    end
  end

  describe "parse_get_many_nil/2 path shapes" do
    @doc_json ~s({"user":{"id":"u-7","tags":["a","b"]},"imp":[{"w":300},{"w":250}],"n":{"0":"as-key"}})

    test "a path that is a prefix of another fills both" do
      ptrs = Torque.compile_pointers(["/user", "/user/id", "/user/tags/1", "/user/missing"])

      assert {:ok, [%{"id" => "u-7"}, "u-7", "b", nil]} =
               Torque.parse_get_many_nil(@doc_json, ptrs)
    end

    test "a numeric segment picks array index or object key per node" do
      ptrs = Torque.compile_pointers(["/imp/1/w", "/n/0", "/imp/9/w"])
      assert {:ok, [250, "as-key", nil]} = Torque.parse_get_many_nil(@doc_json, ptrs)
    end

    test "the root path returns the whole document" do
      ptrs = Torque.compile_pointers(["", "/user/id"])
      assert {:ok, [doc, "u-7"]} = Torque.parse_get_many_nil(@doc_json, ptrs)
      assert doc == Torque.decode!(@doc_json)
    end

    test "a path deeper than the nesting limit is absent, not an error" do
      deep = "/" <> Enum.map_join(1..200, "/", &"s#{&1}")
      ptrs = Torque.compile_pointers([deep, "/user/id"])
      assert {:ok, [nil, "u-7"]} = Torque.parse_get_many_nil(@doc_json, ptrs)
    end

    test "unique_keys with validate: false stops at the first match" do
      json = ~s({"a":1,"z":"skipped","a":2})
      ptrs = Torque.compile_pointers(["/a"], unique_keys: true, validate: false)
      assert {:ok, [1]} = Torque.parse_get_many_nil(json, ptrs)
    end
  end

  describe "parse_get_many_nil/2 skipped regions" do
    test "a fault outside every selected path is still reported" do
      ptrs = Torque.compile_pointers(["/keep"])
      assert {:error, _} = Torque.parse_get_many_nil(~s({"keep":1,"other":tru}), ptrs)
      assert {:error, _} = Torque.parse_get_many_nil(~s({"keep":1,"other":[1,,2]}), ptrs)
      assert {:error, _} = Torque.parse_get_many_nil(~s({"keep":1,"other":01}), ptrs)
      assert {:error, _} = Torque.parse_get_many_nil(~s({"keep":1,"other":{"x" 1}}), ptrs)
      assert {:error, _} = Torque.parse_get_many_nil(~s({"keep":1} trailing), ptrs)

      assert {:error, _} =
               Torque.parse_get_many_nil(<<"{\"keep\":1,\"o\":\"", 0xFF, "\"}">>, ptrs)
    end

    test "validated skipped values match full parsing" do
      # Checked extraction must reject malformed values outside selected paths.
      faults = [
        ~s({"keep":1,"drop":"\\uZZZZ"}),
        ~s({"keep":1,"drop":"\\u00zz"}),
        ~s({"keep":1,"drop":"\\ud800"}),
        ~s({"keep":1,"drop":"\\ud800x"}),
        ~s({"keep":1,"drop":1e400}),
        ~s({"keep":1,"drop":[-1e400]}),
        ~s({"keep":1,"drop":{"n":1e400}})
      ]

      clean = [
        ~s({"keep":1,"drop":"\\ud83d\\ude04"}),
        ~s({"keep":1,"drop":"\\u00e9\\n\\t"}),
        ~s({"keep":1,"drop":[1.5e-3,-0.0,18446744073709551616]})
      ]

      strict = Torque.compile_pointers(["/keep"])
      loose = Torque.compile_pointers(["/keep"], validate: false)

      for json <- faults do
        assert {:error, _} = Torque.parse(json), json
        assert {:error, _} = Torque.parse_get_many_nil(json, strict), json
        assert {:ok, [1]} = Torque.parse_get_many_nil(json, loose), json
      end

      for json <- clean do
        assert {:ok, _} = Torque.parse(json), json
        assert {:ok, [1]} = Torque.parse_get_many_nil(json, strict), json
        assert {:ok, [1]} = Torque.parse_get_many_nil(json, loose), json
      end
    end

    test "validate: false answers from the selected paths alone" do
      ptrs = Torque.compile_pointers(["/keep"], validate: false)
      assert {:ok, [1]} = Torque.parse_get_many_nil(~s({"keep":1,"other":[1,,2]}), ptrs)
      assert {:ok, [1]} = Torque.parse_get_many_nil(~s({"keep":1} trailing), ptrs)
      # Selected values are still parsed under the unchecked policy.
      assert {:error, _} = Torque.parse_get_many_nil(~s({"keep":}), ptrs)
    end

    test "validate: false accepts trailing content but not truncation" do
      # Skipping relaxes the trailing-content check, which is the one way an
      # unchecked extraction accepts what `decode/1` refuses. It does not
      # relax truncation: a skip still has to find its closing delimiter, and
      # the early exit under `unique_keys` ends in the same scan.
      for unique <- [false, true] do
        ptrs = Torque.compile_pointers(["/keep"], validate: false, unique_keys: unique)

        assert {:ok, [1]} = Torque.parse_get_many_nil(~s({"keep":1} junk), ptrs)

        for truncated <- [
              ~s({"keep":1,"other":[1,2,),
              ~s({"keep":1,"other":2),
              ~s({"keep":1,"s":"unterminated)
            ] do
          assert {:error, _} = Torque.parse_get_many_nil(truncated, ptrs), truncated
        end
      end
    end

    test "validate: false and unique_keys do not change any answer" do
      # Skipping may relax error reporting, but it must not change selected values.
      json = ~s({"a":{"b":[10,20]},"b":["x"],"0":1,"s":"v"})
      paths = ["/a/b/1", "/b/0", "/0", "/s", "/missing", ""]
      {:ok, doc} = Torque.parse(json)
      expected = Torque.get_many_nil(doc, paths)

      fast = Torque.compile_pointers(paths, unique_keys: true, validate: false)
      strict = Torque.compile_pointers(paths)

      assert {:ok, expected} == Torque.parse_get_many_nil(json, strict)
      assert {:ok, expected} == Torque.parse_get_many_nil(json, fast)
    end

    test "validate: false still reports invalid UTF-8 it walked over" do
      # Structural skipping relaxes syntax checks, not UTF-8 validation.
      ptrs = Torque.compile_pointers(["/keep"], validate: false)
      bad = <<"{\"keep\":1,\"drop\":\"", 0xFF, "\"}">>
      assert {:error, _} = Torque.parse_get_many_nil(bad, ptrs)
    end

    test "validate: false returns the same values as the default for good input" do
      paths = ["/id", "/site/domain", "/imp/0/banner/w", "/nonexistent"]
      strict = Torque.compile_pointers(paths)
      loose = Torque.compile_pointers(paths, validate: false)

      assert Torque.parse_get_many_nil(@sample_json, strict) ==
               Torque.parse_get_many_nil(@sample_json, loose)
    end

    test "duplicate keys resolve the same way as a parsed document" do
      json = ~s({"a":1,"b":{"c":1},"a":2,"b":{"c":2}})
      paths = ["/a", "/b/c"]

      {:ok, doc} = Torque.parse(json)
      assert Torque.get_many_nil(doc, paths) == [2, 2]
      assert {:ok, [2, 2]} = Torque.parse_get_many_nil(json, Torque.compile_pointers(paths))

      uniq = Torque.compile_pointers(paths, unique_keys: true)
      {:ok, doc} = Torque.parse(json, unique_keys: true)
      assert Torque.get_many_nil(doc, uniq) == [1, 1]
      assert {:ok, [1, 1]} = Torque.parse_get_many_nil(json, uniq)
    end

    test "a repeated key does not leave the previous value's fields behind" do
      # A later duplicate must clear descendants supplied only by the old value.
      cases = [
        {~s({"a":{"x":1},"a":{}}), ["/a/x", "/a"], [nil, %{}]},
        {~s({"a":{"x":1},"a":{"y":2}}), ["/a/x", "/a/y"], [nil, 2]},
        {~s({"a":{"x":1},"a":[9]}), ["/a/x", "/a/0", "/a"], [nil, 9, [9]]},
        {~s({"a":{"x":1},"a":5}), ["/a/x", "/a"], [nil, 5]},
        {~s({"a":{"b":{"c":1}},"a":{"b":{}}}), ["/a/b/c"], [nil]},
        {~s({"a":[{"k":1}],"a":[{}]}), ["/a/0/k"], [nil]}
      ]

      for {json, paths, expected} <- cases do
        {:ok, doc} = Torque.parse(json)
        assert Torque.get_many_nil(doc, paths) == expected

        for ptrs <- [
              Torque.compile_pointers(paths),
              Torque.compile_pointers(paths, validate: false)
            ] do
          assert Torque.get_many_nil(doc, ptrs) == expected
          assert {:ok, expected} == Torque.parse_get_many_nil(json, ptrs)
        end
      end
    end

    test "unique_keys keeps the first value's fields under a repeated key" do
      json = ~s({"a":{"x":1},"a":{}})
      paths = ["/a/x", "/a"]
      expected = [1, %{"x" => 1}]

      {:ok, doc} = Torque.parse(json, unique_keys: true)
      ptrs = Torque.compile_pointers(paths, unique_keys: true)

      assert Torque.get_many_nil(doc, ptrs) == expected
      assert {:ok, expected} == Torque.parse_get_many_nil(json, ptrs)
    end

    # One object's tracking of which planned keys it has already supplied used
    # to be a single word, so the 65th key at a node had no bit: `unique_keys`
    # silently became last-wins there, and the unchecked early exit could never
    # fire because its found-count could not reach the node's width.
    test "duplicate keys resolve the same way at every plan width" do
      for width <- [1, 63, 64, 65, 200] do
        keys = for i <- 1..width, do: "k#{i}"
        paths = Enum.map(keys, &"/#{&1}")
        last = "k#{width}"

        # Every key once, then the widest one repeated with a different value.
        json =
          "{" <>
            Enum.map_join(keys, ",", fn k -> ~s("#{k}":1) end) <>
            ~s(,"#{last}":2) <> "}"

        for unique <- [false, true] do
          {:ok, doc} = Torque.parse(json, unique_keys: unique)
          expected = List.duplicate(1, width - 1) ++ [if(unique, do: 1, else: 2)]
          assert Torque.get_many_nil(doc, paths) == expected

          for validate <- [true, false] do
            ptrs = Torque.compile_pointers(paths, unique_keys: unique, validate: validate)

            assert Torque.get_many_nil(doc, ptrs) == expected,
                   "width #{width}, unique_keys: #{unique}, compiled lookup"

            assert {:ok, expected} == Torque.parse_get_many_nil(json, ptrs),
                   "width #{width}, unique_keys: #{unique}, validate: #{validate}"
          end
        end
      end
    end

    test "a repeated key clears descendants at every plan width" do
      for width <- [1, 64, 65, 200] do
        # Pad to `width` planned keys at the root so the repeated key sits past
        # the inline word, then take a field only the dead first value supplies.
        pad = for i <- 1..(width - 1)//1, do: ~s("p#{i}":0)
        json = "{" <> Enum.join(pad ++ [~s("a":{"x":1}), ~s("a":{"y":2})], ",") <> "}"
        paths = Enum.map(1..(width - 1)//1, &"/p#{&1}") ++ ["/a/x"]
        expected = List.duplicate(0, width - 1) ++ [nil]

        {:ok, doc} = Torque.parse(json)
        assert Torque.get_many_nil(doc, paths) == expected

        for validate <- [true, false] do
          ptrs = Torque.compile_pointers(paths, validate: validate)

          assert {:ok, expected} == Torque.parse_get_many_nil(json, ptrs),
                 "width #{width}, validate: #{validate}"
        end
      end
    end

    test "nested replacements invalidate only their own live results across container types" do
      json =
        ~s({"stable":{"z":7},"a":[{"x":1,"x":2},9],) <>
          ~s("a":{"0":{"x":3},"0":{"y":4},"tail":{"z":5}},) <>
          ~s("a":{"0":{"x":6},"1":10},"a":{"0":{"y":12},"1":13}})

      paths = ["/a/0/x", "/a/0/x", "/a/0/y", "/a/1", "/a/tail/z", "/stable/z"]

      for unique <- [false, true], validate <- [true, false] do
        expected = if unique, do: [1, 1, nil, 9, nil, 7], else: [nil, nil, 12, 13, nil, 7]
        ptrs = Torque.compile_pointers(paths, unique_keys: unique, validate: validate)
        assert {:ok, expected} == Torque.parse_get_many_nil(json, ptrs)

        # Selecting a prefix fills descendants from its owned DOM instead of the
        # streaming walk. Both must register live results, including aliases.
        overlapping = paths ++ ["/a/0", "/a/0", "/a"]
        ptrs = Torque.compile_pointers(overlapping, unique_keys: unique, validate: validate)
        {:ok, doc} = Torque.parse(json, unique_keys: unique)
        expected = Torque.get_many_nil(doc, ptrs)
        assert {:ok, expected} == Torque.parse_get_many_nil(json, ptrs)
      end
    end

    test "out-of-order numeric paths preserve duplicates and missing array indices" do
      indices = Enum.to_list(80..0//-1) ++ [0, 40, 999_999]
      paths = Enum.map(indices, &"/a/#{&1}")

      for unique <- [false, true], validate <- [true, false] do
        ptrs = Torque.compile_pointers(paths, unique_keys: unique, validate: validate)
        values = Enum.to_list(0..39)
        array = Jason.encode!(%{"a" => values})
        expected = Enum.map(indices, &Enum.at(values, &1))
        assert {:ok, expected} == Torque.parse_get_many_nil(array, ptrs)

        object = Jason.encode!(%{"a" => Map.new(values, &{Integer.to_string(&1), &1})})
        assert {:ok, expected} == Torque.parse_get_many_nil(object, ptrs)
      end
    end

    test "unique_keys skips the object remainder at every plan width" do
      for width <- [1, 64, 65, 200] do
        keys = for i <- 1..width, do: "k#{i}"
        paths = Enum.map(keys, &"/#{&1}")

        # A member the plan walk cannot parse. Reaching the closing brace means
        # the whole remainder was skipped once every requested key was found.
        json =
          "{" <> Enum.map_join(keys, ",", fn k -> ~s("#{k}":1) end) <> ~s(,"z" 5) <> "}"

        ptrs = Torque.compile_pointers(paths, unique_keys: true, validate: false)

        assert {:ok, List.duplicate(1, width)} == Torque.parse_get_many_nil(json, ptrs),
               "width #{width} did not stop after the last requested key"
      end
    end

    test "the array remainder is skipped once every index is found" do
      # An element the plan walk cannot parse, past the last requested index.
      # Reaching the closing bracket means the remainder was skipped rather
      # than walked. Unlike an object this needs no uniqueness promise: an
      # array cannot repeat an index, so nothing later can replace a result.
      json = ~s({"a":[10,20,30 40,,]})
      paths = ["/a/1", "/a/0"]

      for unique <- [false, true] do
        loose = Torque.compile_pointers(paths, unique_keys: unique, validate: false)
        assert {:ok, [20, 10]} == Torque.parse_get_many_nil(json, loose)

        strict = Torque.compile_pointers(paths, unique_keys: unique)
        assert {:error, _} = Torque.parse_get_many_nil(json, strict)

        # An index the array never reaches keeps the walk going, since absence
        # is only established by reaching the end.
        open = Torque.compile_pointers(paths ++ ["/a/9"], unique_keys: unique, validate: false)
        assert {:error, _} = Torque.parse_get_many_nil(json, open)
      end
    end

    test "nesting deeper than the limit is refused, not crashed" do
      deep = String.duplicate("[", 200) <> String.duplicate("]", 200)
      json = ~s({"keep":1,"other":) <> deep <> "}"
      ptrs = Torque.compile_pointers(["/keep"])
      assert {:error, :nesting_too_deep} = Torque.parse_get_many_nil(json, ptrs)

      # Structural skipping is iterative and does not consume the nesting budget.
      loose = Torque.compile_pointers(["/keep"], validate: false)
      assert {:ok, [1]} = Torque.parse_get_many_nil(json, loose)
    end

    test "a selected value deeper than the limit is refused" do
      deep = String.duplicate("[", 200) <> String.duplicate("]", 200)
      json = ~s({"keep":) <> deep <> "}"

      for ptrs <- [
            Torque.compile_pointers(["/keep"]),
            Torque.compile_pointers(["/keep"], validate: false)
          ] do
        assert {:error, :nesting_too_deep} = Torque.parse_get_many_nil(json, ptrs)
      end
    end

    test "the nesting limit spans the plan and the value it selects" do
      # Plan descent and selected-value parsing share one nesting budget.
      path = "/" <> Enum.map_join(1..100, "/", fn _ -> "a" end)
      strict = Torque.compile_pointers([path])
      loose = Torque.compile_pointers([path], validate: false)

      nest = fn arrays ->
        String.duplicate(~s({"a":), 100) <>
          String.duplicate("[", arrays) <>
          "1" <>
          String.duplicate("]", arrays) <> String.duplicate("}", 100)
      end

      # Pin the boundary with nesting split across the plan and selected value.
      assert {:ok, _} = Torque.parse(nest.(28))
      assert {:error, :nesting_too_deep} = Torque.parse(nest.(29))

      for ptrs <- [strict, loose] do
        assert {:ok, [selected]} = Torque.parse_get_many_nil(nest.(28), ptrs)
        assert is_list(selected)
        assert {:error, :nesting_too_deep} = Torque.parse_get_many_nil(nest.(29), ptrs)
      end
    end
  end

  # A string the parser never had to unescape comes back as a sub-binary of the
  # caller's JSON rather than a copy, the way `decode/1` has always returned
  # string values. What has to hold is that the bytes are the same ones a
  # parsed document answers with, and that they survive the input going away.
  describe "extracted strings" do
    test "every way of writing a string answers what a parsed document does" do
      json =
        ~s({"plain":"hello","esc":"a\\nb\\"c\\\\d","uni":"caf\\u00e9",) <>
          ~s("empty":"","tail":"at the very end"})

      paths = ["/plain", "/esc", "/uni", "/empty", "/tail"]
      {:ok, doc} = Torque.parse(json)
      expected = ["hello", "a\nb\"c\\d", "café", "", "at the very end"]
      assert Torque.get_many_nil(doc, paths) == expected

      for ptrs <- [
            Torque.compile_pointers(paths),
            Torque.compile_pointers(paths, validate: false),
            Torque.compile_pointers(paths, unique_keys: true)
          ] do
        assert {:ok, ^expected} = Torque.parse_get_many_nil(json, ptrs)
      end
    end

    test "an extracted string keeps its bytes after the input is dropped" do
      ptrs = Torque.compile_pointers(["/ua"])
      ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0"

      extracted =
        (fn ->
           json = :binary.copy(~s({"pad":"#{String.duplicate("x", 512)}","ua":"#{ua}"}))
           {:ok, [v]} = Torque.parse_get_many_nil(json, ptrs)
           v
         end).()

      :erlang.garbage_collect()
      for _ <- 1..50, do: :binary.copy(<<0::size(8192)>>)
      :erlang.garbage_collect()

      assert extracted == ua
    end

    # Pointing a term at the input keeps the whole input alive behind it, which
    # is the wrong trade for the one call whose purpose is to answer a few
    # paths and drop the document: a 100-byte user agent taken from a 400 KB
    # feed held all 400 KB. Measured in a process of its own, since
    # `process_info(:binary)` reports what the *caller* still references and
    # the test's own scope holds the input.
    test "a small field taken from a large input does not keep it alive" do
      ptrs = Torque.compile_pointers(["/ua"])
      ua = String.duplicate("u", 100)
      parent = self()

      spawn(fn ->
        json = ~s({"pad":"#{String.duplicate("x", 400_000)}","ua":"#{ua}"})
        {:ok, [v]} = Torque.parse_get_many_nil(json, ptrs)
        :erlang.garbage_collect()
        {:binary, refs} = :erlang.process_info(self(), :binary)
        send(parent, {v, Enum.sum(Enum.map(refs, fn {_, size, _} -> size end))})
        # Hold until the assertions run, so nothing above can be collected.
        receive do: (:done -> :ok)
      end)

      assert_receive {^ua, retained}
      assert retained < 4096, "a 100-byte field kept #{retained} bytes of input alive"
    end
  end
end
