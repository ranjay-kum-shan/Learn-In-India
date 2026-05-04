---
slug: url-shortener
---

# Reference Solution — URL Shortener

A canonical answer that scores ~92/100. Yours doesn't have to look exactly like this — but you should be able to defend every choice yours makes against this one.

## Capacity numbers we lock in

- **Writes:** 100M/mo ≈ 40/s average, 400/s peak.
- **Reads:** 10B/mo ≈ 3,800/s average, 10K/s peak.
- **Hot ratio:** assume Pareto — top 1% of codes take 50% of redirects.
- **Storage:** 6B records × ~250 B = ~1.5 TB. Easily fits a sharded KV.
- **Redirect budget:** P99 < 100 ms total — leaves us ~50 ms in the service after network.

## Encoding

**Base62** (`a-zA-Z0-9`) on a monotonic 64-bit ID. 7 characters → 62⁷ ≈ 3.5 trillion codes, ample.

- Allocate IDs from a counter service (Twitter Snowflake-style, or a Redis `INCR` shard with pre-allocated ranges per shortener instance).
- Custom aliases live in the same table with a flag; on conflict, return 409.

## Architecture

```
Client → CDN → API Gateway → Shortener Service ──┬─► KV Store (Dynamo/Cassandra)
                                                  └─► Redis (read cache, write-through)
                                                  └─► Kafka (async click events)
                                                          ↓
                                                  Click Aggregator
                                                          ↓
                                              Warehouse (Snowflake / BigQuery)
```

### Read path (the hot one)
1. Service receives `GET /:code`.
2. Check Redis. **Hit (~95% target):** return 301 redirect.
3. **Miss:** read from KV by partition key `code`.
4. Populate Redis with TTL (e.g., 24h, randomized to avoid sync expiry).
5. Emit a click event to Kafka.
6. Return 301.

### Write path
1. Service receives long URL.
2. (Optional) Hash long URL → check dedup table; if exists, return existing code.
3. Allocate next ID from counter service; encode base62.
4. Insert row in KV; on conflict, retry once (extremely rare).
5. Return 201 with the short URL. Don't write Redis here — let the first read populate it.

### Hot keys
- Celebrity short URLs (e.g., a viral tweet) get hammered. Strategies:
  - Redis cluster with replication; reads pinned to nearest replica.
  - **Request coalescing** at the service: in-flight reads to the same code de-dupe before hitting KV on miss.
  - Local LRU in the service process (small, e.g., 10K codes) for the hottest tail.
  - CDN-level 301 caching with conservative TTL — many redirects can be served at the edge.

### Analytics
- Click events go to Kafka (partitioned by `code` to keep per-code ordering trivial).
- Aggregator workers tumble events into 1-minute / 1-hour buckets, write to a warehouse.
- The user-facing analytics dashboard reads from the warehouse, not the KV.
- Counters in the KV (if any) are eventually consistent and updated in batch — never on the hot path.

## Trade-offs we explicitly accept

- **301 vs 302:** we use 301 (permanent) so browsers and CDNs cache it. Cost: per-user click count is approximate (CDN absorbs some). We recover precision in the warehouse via referrer/user-agent + sampling.
- **Eventual consistency on counts.** Acceptable; the redirect is what we sell.
- **Eventual consistency on dedup.** If two writers create the same dedup hash within the millisecond window, we'll have two codes for one URL. Fine.
- **Region failure.** Cross-region async replication on KV; CDN serves stale 301s during failover.

## What good looks like in your design

- Every component has a labeled capacity number.
- Cache + KV is clearly separated; you can name what happens on a cache miss.
- Analytics is async; it's drawn off the hot path, not in line with it.
- You've named at least one failure mode and how you'd handle it.
- You've named one trade-off you accepted (e.g., picked 301 over 302).
