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

# Real feeds carry much of their string data as multi-byte UTF-8, plus strings
# that need escaping (quoted HTML attributes, line breaks). Without this shape
# the encoder's UTF-8 and escape kernels go unprofiled.
unicode_record = fn i ->
  ~s({"metadata":{"result_type":"recent","iso_language_code":"ja"},"id":#{505_874_924_000_000_000 + i},"id_str":"#{505_874_924_000_000_000 + i}","text":"\\u3010\\u5b9a\\u671f\\u3011\\u65e5\\u672c\\u8a9e\\u306e\\u30c4\\u30a4\\u30fc\\u30c8 #{i} \\u3067\\u3059\\u3002\\n\\u4eca\\u65e5\\u3082\\u4e00\\u65e5\\u304a\\u75b2\\u308c\\u69d8\\u3067\\u3057\\u305f \\u2728\\ud83d\\ude0a \\"\\u5f15\\u7528\\" http:\\/\\/t.co\\/#{i}","source":"<a href=\\"http:\\/\\/twitter.com\\/download\\/iphone\\" rel=\\"nofollow\\">Twitter for iPhone<\\/a>","truncated":false,"in_reply_to_status_id":null,"user":{"id":#{1_000_000 + i},"name":"\\u3086\\u3046\\u3053 #{i}","screen_name":"yuuko_#{i}","location":"\\u6771\\u4eac\\u90fd","description":"\\u30a2\\u30cb\\u30e1\\u3068\\u30b2\\u30fc\\u30e0\\u304c\\u597d\\u304d\\u3067\\u3059\\u3002\\r\\n\\u30d5\\u30a9\\u30ed\\u30fc\\u6b53\\u8fce\\uff01\\t\\u2192 @yuuko_#{i}","url":null,"followers_count":#{rem(i * 1337, 100_000)},"verified":false,"lang":"ja"},"geo":null,"retweet_count":#{rem(i * 3, 1000)},"favorite_count":#{rem(i * 7, 2000)},"entities":{"hashtags":[{"text":"\\u65e5\\u672c","indices":[15,17]}],"urls":[],"user_mentions":[]},"favorited":false,"lang":"ja"})
end

large_json =
  ~s({"statuses":[) <>
    Enum.map_join(1..200, ",", fn i ->
      if rem(i, 2) == 0, do: record.(i), else: unicode_record.(i)
    end) <>
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

# Elixir callers mostly encode atom-keyed maps, whose names come from the
# encoder's per-thread atom-name cache instead of the binary-key path.
to_atom_keys = fn f, v ->
  cond do
    is_map(v) -> Map.new(v, fn {k, val} -> {String.to_atom(k), f.(f, val)} end)
    is_list(v) -> Enum.map(v, &f.(f, &1))
    true -> v
  end
end

small_atoms = to_atom_keys.(to_atom_keys, small_term)
large_atoms = to_atom_keys.(to_atom_keys, large_term)

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

# A selected container with no deeper pointer is built through the term
# builder during the walk; train that on the large document's containers too.
large_fields = ~w(/statuses /statuses/1/user /search_metadata /statuses/2/text)
compiled_large = Torque.compile_pointers(large_fields)
compiled_root = Torque.compile_pointers([""])

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
  Torque.encode!(small_atoms)
  Torque.encode!(large_atoms)
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

large_extract = fn ->
  {:ok, _} = Torque.parse_get_many_nil(large_json, compiled_large)
  {:ok, _} = Torque.parse_get_many_nil(large_json, compiled_root)
end

Enum.each(1..5_000, fn _ -> decode.() end)
Enum.each(1..5_000, fn _ -> encode.() end)
Enum.each(1..10_000, fn _ -> parse_get.() end)
Enum.each(1..10_000, fn _ -> compiled_get.() end)
# Kept light: weighted much heavier, a large-document pass pushes the encoder
# out of the profile's hot set and changes its codegen.
Enum.each(1..500, fn _ -> large_extract.() end)

IO.puts("PGO workload complete")
