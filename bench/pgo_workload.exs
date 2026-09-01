# PGO training workload for the torque NIF.
#
# Not a benchmark — it exercises every hot path (decode, encode, parse, get,
# and the fused compiled-pointer extraction) over representative small and
# large payloads so the Profile-Guided Optimisation build (scripts/pgo-build.sh,
# and the release CI) can collect realistic branch and call-frequency data. Run
# via that tooling with an instrumented NIF; running it directly does nothing
# useful.
#
# It deliberately has NO external dependencies (JSON is built as strings rather
# than via an encoder), so it runs in a bare mix environment — important for CI
# where pulling the full bench dep tree would be heavy and fragile.
#
# Both a small (<20 KB, normal scheduler) and a large (>20 KB, dirty CPU
# scheduler) payload are covered, since torque dispatches on input size.

# Unicode is expressed as JSON \u escapes (ASCII source) so the file stays
# parse-clean while still exercising the decoder's unescape and the encoder's
# escape paths.
small_json =
  ~s({"id":"req-0001","site":{"domain":"example.com","page":"https://example.com/articles/x","cat":["IAB1","IAB2-3"],"publisher":{"id":"pub-12345"}},"device":{"devicetype":2,"ua":"Mozilla/5.0 Macintosh; Intel Mac OS X 10_15_7 Chrome/120.0.0.0","ip":"203.0.113.42","geo":{"country":"US","lat":40.7128,"lon":-74.006,"zip":"10001"},"connectiontype":2},"user":{"id":"u-abcdef","name":"caf\\u00e9 r\\u00e9sum\\u00e9 \\u2728"},"imp":[{"id":"imp-1","banner":{"w":300,"h":250},"bidfloor":0.5},{"id":"imp-2","video":{"mimes":["video/mp4"],"maxduration":30},"bidfloor":2.0}],"regs":{"coppa":0},"ext":null,"test":true})

record = fn i ->
  ~s({"metadata":{"result_type":"recent","iso_language_code":"en"},"id":#{505_874_924_000_000_000 + i},"id_str":"#{505_874_924_000_000_000 + i}","text":"Sample tweet #{i} lorem ipsum dolor sit amet consectetur adipiscing elit","truncated":false,"in_reply_to_status_id":null,"user":{"id":#{1_000_000 + i},"screen_name":"username_#{i}","location":"San Francisco, CA","url":null,"followers_count":#{rem(i * 1337, 100_000)},"verified":false,"lang":"en","profile_image_url":"http://pbs.twimg.com/profile_images/#{i}/photo.jpeg"},"geo":null,"retweet_count":#{rem(i * 3, 1000)},"favorite_count":#{rem(i * 7, 2000)},"entities":{"hashtags":[{"text":"elixir","indices":[15,22]}],"urls":[],"user_mentions":[{"screen_name":"user_#{i}","id":#{2_000_000 + i}}]},"favorited":false,"lang":"en"})
end

large_json =
  ~s({"statuses":[) <>
    Enum.map_join(1..200, ",", record) <>
    ~s(],"search_metadata":{"count":200,"completed_in":0.035,"max_id":505874924095815681,"query":"%23elixir"}})

small_term = Torque.decode!(small_json)
large_term = Torque.decode!(large_json)

to_proplist = fn f, v ->
  cond do
    is_map(v) -> {Enum.map(v, fn {k, val} -> {k, f.(f, val)} end)}
    is_list(v) -> Enum.map(v, &f.(f, &1))
    true -> v
  end
end

small_proplist = to_proplist.(to_proplist, small_term)
large_proplist = to_proplist.(to_proplist, large_term)

fields = ~w(/id /site/domain /site/page /site/publisher/id /site/cat
            /device/devicetype /device/ua /device/ip /device/geo/country
            /device/geo/lat /device/connectiontype /user/id /imp /regs/coppa)

# Array indexes use a distinct extraction-plan path not reached by `fields`.
indexed_fields = ~w(/imp/0/id /imp/0/banner/w /site/cat/0 /id)

# Compiled-pointer handles are built once at startup in real use, so compile
# them outside the loop and exercise only the per-request extraction below.
compiled = Torque.compile_pointers(fields)
compiled_uk = Torque.compile_pointers(fields, unique_keys: true)
compiled_idx = Torque.compile_pointers(indexed_fields)
# Train structural skipping as well as fully validated extraction.
compiled_fast = Torque.compile_pointers(fields, unique_keys: true, validate: false)

IO.puts("PGO workload: small=#{byte_size(small_json)}B large=#{byte_size(large_json)}B")

decode = fn ->
  Torque.decode!(small_json)
  Torque.decode!(large_json)
end

encode = fn ->
  Torque.encode!(small_term)
  Torque.encode!(large_term)
  Torque.encode_to_iodata(small_term)
  Torque.encode_to_iodata(large_term)
  Torque.encode!(small_proplist)
  Torque.encode!(large_proplist)
end

parse_get = fn ->
  {:ok, doc} = Torque.parse(small_json)
  {:ok, doc_uk} = Torque.parse(small_json, unique_keys: true)
  Enum.each(fields, &Torque.get(doc, &1))
  Torque.get_many(doc, fields)
  Torque.get_many_nil(doc, fields)
  Torque.get_many(doc_uk, fields)
end

compiled_get = fn ->
  # Fused parse+extract on both schedulers (small = normal, large = dirty CPU).
  {:ok, _} = Torque.parse_get_many_nil(small_json, compiled)
  {:ok, _} = Torque.parse_get_many_nil(large_json, compiled)
  {:ok, _} = Torque.parse_get_many_nil(small_json, compiled_uk)
  # Array-index and unchecked paths.
  {:ok, _} = Torque.parse_get_many_nil(small_json, compiled_idx)
  {:ok, _} = Torque.parse_get_many_nil(small_json, compiled_fast)
  {:ok, _} = Torque.parse_get_many_nil(large_json, compiled_fast)
  # Compiled-pointer extraction against an already-parsed handle.
  {:ok, doc} = Torque.parse(small_json)
  Torque.get_many_nil(doc, compiled)
end

Enum.each(1..5_000, fn _ -> decode.() end)
Enum.each(1..5_000, fn _ -> encode.() end)
Enum.each(1..10_000, fn _ -> parse_get.() end)
Enum.each(1..10_000, fn _ -> compiled_get.() end)

IO.puts("PGO workload complete")
