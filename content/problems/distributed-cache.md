---
slug: distributed-cache
title: Design a Distributed Cache
difficulty: medium
tags: [consistent-hash, eviction, cache]
estimated_minutes: 45
is_free: false
---

# Distributed Cache

Build a Memcached/Redis-like in-memory KV store distributed across N nodes. Used as a cache in front of an OLTP database. Read-heavy.

## Functional
- `get(key)`, `set(key, value, ttl)`, `delete(key)`.
- TTL-based expiry.
- LRU eviction when full.

## Non-functional
- 1M QPS with P99 < 1ms in-cluster.
- ~1 TB hot dataset across 50 nodes (20 GB/node).
- Survive single-node failure with at most a brief stall.

## Focus on
- Sharding (consistent hashing).
- Replication (or not).
- Eviction policy.
- Membership / failure detection.
- Client routing (smart client vs proxy).
