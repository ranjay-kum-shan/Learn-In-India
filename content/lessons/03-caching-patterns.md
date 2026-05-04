---
slug: 03-caching-patterns
title: Caching patterns
category: fundamentals
reading_minutes: 8
sort_order: 30
---

# Caching patterns

If your system can't be cached, it can't be cheap. Caching is the highest-leverage optimization in nearly every interview answer.

## The four shapes

1. **Cache-aside (lazy loading)** — app checks cache first, on miss fetches from origin and populates. **The default.**
2. **Read-through** — cache library fetches from origin on miss. App doesn't see the origin. (Looks identical to cache-aside from the app's POV but library handles it.)
3. **Write-through** — every write hits the cache and the origin synchronously. Strong consistency between them.
4. **Write-back / write-behind** — writes hit cache; flushed to origin async. Fastest writes, weakest durability.

In interviews, pick **cache-aside** for reads and **write-through** for writes unless you have a specific reason otherwise.

## Eviction policies

- **LRU** — least recently used. The default. Simple to implement (HashMap + doubly-linked list).
- **LFU** — least frequently used. Better for skewed workloads, more state.
- **W-TinyLFU** — what Caffeine and Redis 4+ use. LFU with admission filter; near-optimal.
- **TTL-only** — cheapest. Use when access pattern is too random for LRU/LFU to help.

## Three failure modes you must name

### 1. Cache stampede / thundering herd
TTL expires; thousands of requests miss at once and hammer the origin. Mitigate with:
- **Single-flight** at the cache layer: only one request to origin per key.
- **Stale-while-revalidate:** serve stale and refresh in background.
- **Jittered TTL:** add ±10% randomness so caches don't expire in unison.

### 2. Hot keys
One key (a celebrity, a viral URL) takes a disproportionate share of traffic. Mitigate:
- **Replicate** the key across multiple cache shards.
- **Local micro-cache** in the application process.
- **Request coalescing** at the application layer.

### 3. Cache penetration
Attackers query non-existent keys; every request misses and hits origin. Mitigate with:
- **Negative caching:** cache "not found" results with short TTL.
- **Bloom filter** in front of the cache for "definitely doesn't exist" checks.

## Sizing a cache

Hit rate is what matters. Know:

- **Working set size** (the bytes accessed in a representative window).
- **Memory available** (per node × number of nodes).
- **Eviction overhead** (~5-10% headroom).

If working set fits in cache, your hit rate approaches 100%. If it doesn't, you're paying full origin latency on misses — model that explicitly.

## A line you should be able to deliver

> "I'm using cache-aside with Redis. Hot keys get replicated across 3 shards plus an in-process micro-cache. TTL is jittered around 1h, with stale-while-revalidate so a cache miss doesn't block the request."

That single sentence covers four interview points: pattern, hot-key, freshness, latency budget.
