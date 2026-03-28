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

    test "raises ArgumentError on nesting_too_deep" do
      json = Enum.reduce(1..513, ~s("leaf"), fn _, acc -> ~s({"x":#{acc}}) end)
      {:ok, doc} = Torque.parse(json)

      assert_raise ArgumentError, ~r/nesting_too_deep/, fn ->
        Torque.get(doc, "", "default")
      end
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

  describe "roundtrip" do
    test "decode then encode preserves data" do
      json = ~s({"a":1,"b":"hello","c":[1,2,3],"d":true,"e":null})
      {:ok, decoded} = Torque.decode(json)
      {:ok, encoded} = Torque.encode(decoded)
      {:ok, decoded2} = Torque.decode(encoded)
      assert decoded == decoded2
    end
  end
end
