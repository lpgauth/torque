# Benchmark: Torque vs simdjsone vs jiffy
#
# Run with: mix run bench/torque_bench.exs

# Realistic OpenRTB bid request (~1.3KB)
openrtb_json =
  Jason.encode!(%{
    "id" => "req-#{:rand.uniform(1_000_000)}",
    "site" => %{
      "domain" => "example.com",
      "page" => "https://example.com/articles/some-article-title",
      "ref" => "https://google.com/search?q=something",
      "publisher" => %{"id" => "pub-12345"},
      "cat" => ["IAB1", "IAB2-3"]
    },
    "device" => %{
      "devicetype" => 2,
      "ua" =>
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "ip" => "203.0.113.42",
      "ipv6" => "2001:db8::1",
      "ifa" => "cdda802e-fb9c-47ad-0794d394fbbd",
      "os" => "Apple iOS",
      "geo" => %{
        "country" => "US",
        "lat" => 40.7128,
        "lon" => -74.006,
        "region" => "NY",
        "type" => 2,
        "zip" => "10001"
      },
      "connectiontype" => 2,
      "carrier" => "Verizon",
      "language" => "en"
    },
    "user" => %{
      "id" => "user-abcdef123456",
      "buyeruid" => "buyer-xyz789",
      "ext" => %{
        "eids" => [
          %{"source" => "adserver.org", "uids" => [%{"id" => "uid-tdid-1234"}]},
          %{"source" => "criteo.com", "uids" => [%{"id" => "uid-criteo-5678"}]},
          %{"source" => "uidapi.com", "uids" => [%{"id" => "uid2-raw-token-abcdef"}]}
        ]
      }
    },
    "imp" => [
      %{
        "id" => "imp-1",
        "banner" => %{"w" => 300, "h" => 250, "pos" => 1},
        "bidfloor" => 0.5,
        "pmp" => %{
          "private_auction" => 1,
          "deals" => [
            %{"id" => "deal-abc", "bidfloor" => 1.0},
            %{"id" => "deal-def", "bidfloor" => 0.75}
          ]
        }
      },
      %{
        "id" => "imp-2",
        "video" => %{
          "mimes" => ["video/mp4", "video/webm"],
          "minduration" => 5,
          "maxduration" => 30,
          "protocols" => [2, 5],
          "placement" => 1
        },
        "bidfloor" => 2.0
      }
    ],
    "regs" => %{"coppa" => 0},
    "ext" => %{"appnexus" => %{"seller_member_id" => 1410}}
  })

IO.puts("JSON payload size: #{byte_size(openrtb_json)} bytes\n")

# Fields extracted in the bidder hot path
fields = [
  "/id",
  "/site/domain",
  "/site/page",
  "/site/ref",
  "/site/publisher/id",
  "/site/cat",
  "/device/devicetype",
  "/device/ua",
  "/device/ip",
  "/device/ipv6",
  "/device/ifa",
  "/device/os",
  "/device/geo/country",
  "/device/geo/lat",
  "/device/geo/lon",
  "/device/geo/region",
  "/device/geo/type",
  "/device/geo/zip",
  "/device/connectiontype",
  "/device/carrier",
  "/device/language",
  "/user/id",
  "/user/buyeruid",
  "/user/ext/eids",
  "/imp",
  "/regs/coppa"
]

# Bid response for encoding benchmark
bid_response = %{
  id: "req-123",
  cur: "USD",
  seatbid: [
    %{
      seat: "458",
      bid: [
        %{
          id: "bid-abc",
          impid: "imp-1",
          price: 1.5,
          adomain: ["advertiser.com"],
          adm: "<script src=\"https://tracker.example.com/imp?id=123\"></script>",
          cid: "campaign-1",
          crid: "creative-1",
          burl: "https://tracker.example.com/win?id=123&price=${AUCTION_PRICE}",
          iurl: "https://cdn.example.com/preview.jpg"
        }
      ]
    }
  ],
  ext: %{protocol: "5.3"}
}

# jiffy proplist format (same data)
bid_response_proplist =
  {[
     {:id, "req-123"},
     {:cur, "USD"},
     {:seatbid,
      [
        {[
           {:seat, "458"},
           {:bid,
            [
              {[
                 {:id, "bid-abc"},
                 {:impid, "imp-1"},
                 {:price, 1.5},
                 {:adomain, ["advertiser.com"]},
                 {:adm, "<script src=\"https://tracker.example.com/imp?id=123\"></script>"},
                 {:cid, "campaign-1"},
                 {:crid, "creative-1"},
                 {:burl, "https://tracker.example.com/win?id=123&price=${AUCTION_PRICE}"},
                 {:iurl, "https://cdn.example.com/preview.jpg"}
               ]}
            ]}
         ]}
      ]}
   ]}

IO.puts("=== DECODE BENCHMARK ===\n")

Benchee.run(
  %{
    "torque decode" => fn -> Torque.decode!(openrtb_json) end,
    "simdjsone decode" => fn -> :simdjson.decode(openrtb_json) end,
    "jiffy decode" => fn -> :jiffy.decode(openrtb_json, [:return_maps]) end,
    "jason decode" => fn -> Jason.decode!(openrtb_json) end,
    "otp json decode" => fn -> :json.decode(openrtb_json) end
  },
  warmup: 2,
  time: 5,
  memory_time: 2
)

IO.puts("\n=== PARSE + GET BENCHMARK (bidder hot path) ===\n")

Benchee.run(
  %{
    "torque parse+get" => fn ->
      {:ok, doc} = Torque.parse(openrtb_json)
      for f <- fields, do: Torque.get(doc, f)
    end,
    "torque parse+get_many" => fn ->
      {:ok, doc} = Torque.parse(openrtb_json)
      Torque.get_many(doc, fields)
    end,
    "torque parse+get_many_nil" => fn ->
      {:ok, doc} = Torque.parse(openrtb_json)
      Torque.get_many_nil(doc, fields)
    end,
    "simdjsone parse+get" => fn ->
      ref = :simdjson.parse(openrtb_json)
      for f <- fields, do: :simdjson.get(ref, f)
    end
  },
  warmup: 2,
  time: 5,
  memory_time: 2
)

IO.puts("\n=== ENCODE BENCHMARK ===\n")

Benchee.run(
  %{
    "torque encode (map)" => fn -> Torque.encode!(bid_response) end,
    "torque encode (proplist)" => fn -> Torque.encode!(bid_response_proplist) end,
    "torque iodata (map)" => fn -> Torque.encode_to_iodata(bid_response) end,
    "torque iodata (proplist)" => fn -> Torque.encode_to_iodata(bid_response_proplist) end,
    "jiffy encode (proplist)" => fn -> :jiffy.encode(bid_response_proplist, [:force_utf8]) end,
    "jason encode (map)" => fn -> Jason.encode!(bid_response) end,
    "otp json encode (iodata)" => fn -> :json.encode(bid_response) end,
    "otp json encode (binary)" => fn -> :erlang.iolist_to_binary(:json.encode(bid_response)) end
  },
  warmup: 2,
  time: 5,
  memory_time: 2
)
