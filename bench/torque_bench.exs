# Benchmark: Torque vs simdjsone, jiffy, Jason, OTP JSON
#
# Run with: MIX_ENV=bench mix run bench/torque_bench.exs

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
  memory_time: 2,
  percentiles: [50, 95, 99],
  formatters: [
    {Benchee.Formatters.Console, percentiles: [50, 95, 99]}
  ]
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
  memory_time: 2,
  percentiles: [50, 95, 99],
  formatters: [
    {Benchee.Formatters.Console, percentiles: [50, 95, 99]}
  ]
)

IO.puts("\n=== ENCODE BENCHMARK ===\n")

Benchee.run(
  %{
    "torque: map => binary" => fn -> Torque.encode!(bid_response) end,
    "torque: proplist => binary" => fn -> Torque.encode!(bid_response_proplist) end,
    "torque: map => iodata" => fn -> Torque.encode_to_iodata(bid_response) end,
    "torque: proplist => iodata" => fn -> Torque.encode_to_iodata(bid_response_proplist) end,
    "jiffy: proplist => iodata" => fn -> :jiffy.encode(bid_response_proplist, [:force_utf8]) end,
    "jiffy: map => iodata" => fn -> :jiffy.encode(bid_response) end,
    "jason: map => binary" => fn -> Jason.encode!(bid_response) end,
    "jason: map => iodata" => fn -> Jason.encode_to_iodata!(bid_response) end,
    "simdjsone: map => iodata" => fn -> :simdjson.encode(bid_response) end,
    "simdjsone: proplist => iodata" => fn -> :simdjson.encode(bid_response_proplist) end,
    "otp json: map => iodata" => fn -> :json.encode(bid_response) end,
    "otp json: map => binary" => fn -> :erlang.iolist_to_binary(:json.encode(bid_response)) end
  },
  warmup: 2,
  time: 5,
  memory_time: 2,
  percentiles: [50, 95, 99],
  formatters: [
    {Benchee.Formatters.Console, percentiles: [50, 95, 99]}
  ]
)

IO.puts("\n=== LARGE JSON DECODE BENCHMARK ===\n")

# Generate a synthetic ~750 KB JSON payload resembling a Twitter API response.
# Each status entry contains a full user object, entities, and metadata (~2.4 KB/entry).
large_json =
  Jason.encode!(%{
    "statuses" =>
      Enum.map(1..320, fn i ->
        uid = rem(i, 200)

        %{
          "metadata" => %{"result_type" => "recent", "iso_language_code" => "en"},
          "created_at" => "Sun Aug 31 00:29:15 +0000 2014",
          "id" => 505_874_924_000_000_000 + i,
          "id_str" => Integer.to_string(505_874_924_000_000_000 + i),
          "text" =>
            "Sample tweet #{i} #elixir #benchmark @user_#{uid} lorem ipsum dolor sit amet " <>
              "consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
          "source" =>
            "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
          "truncated" => false,
          "in_reply_to_status_id" => nil,
          "in_reply_to_status_id_str" => nil,
          "in_reply_to_user_id" => nil,
          "in_reply_to_user_id_str" => nil,
          "in_reply_to_screen_name" => nil,
          "user" => %{
            "id" => 1_000_000 + uid,
            "id_str" => Integer.to_string(1_000_000 + uid),
            "name" => "User Name #{uid}",
            "screen_name" => "username_#{uid}",
            "location" => "San Francisco, CA",
            "description" =>
              "Software engineer and open source contributor. Building things at the intersection of technology and creativity.",
            "url" => nil,
            "entities" => %{"description" => %{"urls" => []}},
            "protected" => false,
            "followers_count" => rem(i * 1337, 100_000),
            "friends_count" => rem(i * 42, 5_000),
            "listed_count" => rem(i * 7, 500),
            "created_at" => "Mon Jan 01 00:00:00 +0000 2010",
            "favourites_count" => rem(i * 13, 50_000),
            "utc_offset" => nil,
            "time_zone" => nil,
            "geo_enabled" => false,
            "verified" => false,
            "statuses_count" => rem(i * 17, 10_000),
            "lang" => "en",
            "contributors_enabled" => false,
            "is_translator" => false,
            "is_translation_enabled" => false,
            "profile_background_color" => "C0DEED",
            "profile_background_image_url" =>
              "http://pbs.twimg.com/profile_background_images/#{uid}/bg.png",
            "profile_background_image_url_https" =>
              "https://pbs.twimg.com/profile_background_images/#{uid}/bg.png",
            "profile_background_tile" => false,
            "profile_image_url" => "http://pbs.twimg.com/profile_images/#{uid}/photo_normal.jpeg",
            "profile_image_url_https" =>
              "https://pbs.twimg.com/profile_images/#{uid}/photo_normal.jpeg",
            "profile_banner_url" => "https://pbs.twimg.com/profile_banners/#{uid}/1409318784",
            "profile_link_color" => "0084B4",
            "profile_sidebar_border_color" => "C0DEED",
            "profile_sidebar_fill_color" => "DDEEF6",
            "profile_text_color" => "333333",
            "profile_use_background_image" => true,
            "default_profile" => true,
            "default_profile_image" => false,
            "following" => false,
            "follow_request_sent" => false,
            "notifications" => false
          },
          "geo" => nil,
          "coordinates" => nil,
          "place" => nil,
          "contributors" => nil,
          "retweet_count" => rem(i * 3, 1000),
          "favorite_count" => rem(i * 7, 2000),
          "entities" => %{
            "hashtags" => [
              %{"text" => "elixir", "indices" => [15, 22]},
              %{"text" => "benchmark", "indices" => [23, 33]}
            ],
            "symbols" => [],
            "urls" => [],
            "user_mentions" => [
              %{
                "screen_name" => "user_#{uid}",
                "name" => "User #{uid}",
                "id" => 2_000_000 + uid,
                "id_str" => Integer.to_string(2_000_000 + uid),
                "indices" => [34, 42]
              }
            ]
          },
          "favorited" => false,
          "retweeted" => false,
          "lang" => "en"
        }
      end),
    "search_metadata" => %{
      "count" => 320,
      "completed_in" => 0.035,
      "max_id" => 505_874_924_095_815_681,
      "since_id" => 0,
      "query" => "%23elixir",
      "refresh_url" => "?since_id=505874924095815681&q=%23elixir&include_entities=1"
    }
  })

IO.puts("JSON payload size: #{byte_size(large_json)} bytes\n")

Benchee.run(
  %{
    "torque decode" => fn -> Torque.decode!(large_json) end,
    "simdjsone decode" => fn -> :simdjson.decode(large_json) end,
    "jiffy decode" => fn -> :jiffy.decode(large_json, [:return_maps]) end,
    "jason decode" => fn -> Jason.decode!(large_json) end,
    "otp json decode" => fn -> :json.decode(large_json) end
  },
  warmup: 2,
  time: 5,
  memory_time: 2,
  percentiles: [50, 95, 99],
  formatters: [
    {Benchee.Formatters.Console, percentiles: [50, 95, 99]}
  ]
)

IO.puts("\n=== LARGE JSON ENCODE BENCHMARK ===\n")

large_decoded_json = Torque.decode!(large_json)

# Convert to proplist format (binary keys) for libraries that support it
to_proplist = fn f, v ->
  cond do
    is_map(v) -> {Enum.map(v, fn {k, val} -> {k, f.(f, val)} end)}
    is_list(v) -> Enum.map(v, &f.(f, &1))
    true -> v
  end
end

large_decoded_proplist = to_proplist.(to_proplist, large_decoded_json)

Benchee.run(
  %{
    "torque: map => binary" => fn -> Torque.encode!(large_decoded_json) end,
    "torque: proplist => binary" => fn -> Torque.encode!(large_decoded_proplist) end,
    "torque: map => iodata" => fn -> Torque.encode_to_iodata(large_decoded_json) end,
    "torque: proplist => iodata" => fn -> Torque.encode_to_iodata(large_decoded_proplist) end,
    "jiffy: proplist => iodata" => fn -> :jiffy.encode(large_decoded_proplist) end,
    "jiffy: map => iodata" => fn -> :jiffy.encode(large_decoded_json) end,
    "jason: map => binary" => fn -> Jason.encode!(large_decoded_json) end,
    "jason: map => iodata" => fn -> Jason.encode_to_iodata!(large_decoded_json) end,
    "simdjsone: map => iodata" => fn -> :simdjson.encode(large_decoded_json) end,
    "simdjsone: proplist => iodata" => fn -> :simdjson.encode(large_decoded_proplist) end,
    "otp json: map => iodata" => fn -> :json.encode(large_decoded_json) end,
    "otp json: map => binary" => fn ->
      :erlang.iolist_to_binary(:json.encode(large_decoded_json))
    end
  },
  warmup: 2,
  time: 5,
  memory_time: 2,
  percentiles: [50, 95, 99],
  formatters: [
    {Benchee.Formatters.Console, percentiles: [50, 95, 99]}
  ]
)
