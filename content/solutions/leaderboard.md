---
slug: leaderboard
---

# Reference Solution — Real-time Leaderboard

A Redis sorted set per board (`lb:daily:20260503`, `lb:weekly:202618`, `lb:alltime`). Score updates fan out via Lua script (atomic on a single shard). For 100M players, shard by `hash(player_id)` into 8 sorted-set groups; an aggregator job merges per-shard top-K every second.

Rank lookup: top-K is straight ZREVRANGE; non-top approximate via per-shard ZREVRANK + summed counts above threshold.

Cold storage: at window close, top-1000 snapshot serialized to S3 with the date key.
