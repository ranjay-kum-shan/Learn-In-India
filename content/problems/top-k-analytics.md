---
slug: top-k-analytics
title: Design a Top-K Analytics System
difficulty: medium
tags: [stream, heap, aggregation]
estimated_minutes: 45
is_free: false
---

# Top-K Analytics

Compute **top 100** trending items (e.g., songs, videos, search queries) over **rolling windows** (1 min, 5 min, 1 hour, 1 day) at scale.

## Functional
- Ingest a stream of `(item_id, ts)` events.
- Query: `top_k(window, k)` for a few canonical windows.
- Optional: per-region top-K.

## Non-functional
- Stream rate: 1M events/sec.
- Query latency: <100ms.
- Slight inaccuracy acceptable (top-K, not exact counts).

## Focus on
- Approximate vs exact counting (Count-Min Sketch + min-heap).
- Stream processing (Flink / Spark Streaming / Kinesis).
- Window aggregation patterns.
- Storage of windowed results.
