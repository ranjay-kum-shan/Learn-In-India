---
slug: web-crawler
---

# Reference Solution — Web Crawler

Frontier service shards by `hash(domain)` so all URLs for a domain land on one worker, simplifying per-domain politeness. Workers fetch with respect to robots cache + per-domain token-bucket. Pages stored raw in S3, metadata in HBase, simhashed for content dedup. Bloom filter (in-memory + Redis) for URL dedup.

Re-crawl: pages tagged with importance (PageRank-ish) and observed change rate; scheduled in priority queue. Fail-fast on bad hosts; circuit breakers per domain; depth caps to avoid traps.
