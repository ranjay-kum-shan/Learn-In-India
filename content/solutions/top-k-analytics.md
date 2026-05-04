---
slug: top-k-analytics
---

# Reference Solution — Top-K Analytics

Two-stage Flink job:
1. Per-shard sketch + heap (Count-Min + min-heap of size 1000).
2. Global merge job consumes per-shard top-K every window-close, materializes the global top-K.

Results land in Redis sorted sets keyed `topk:{window}:{ts_bucket}`. Queries read with O(K).

Skew: hot items get partition salts; we accept slight inflation in CMS error in exchange for parallel ingest.

Trade-offs: small error (~ε * total) acceptable; memory budget per worker is 64MB sketch.
