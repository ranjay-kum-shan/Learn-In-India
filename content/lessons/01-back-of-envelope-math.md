---
slug: 01-back-of-envelope-math
title: Back-of-envelope math
category: fundamentals
reading_minutes: 6
sort_order: 10
---

# Back-of-envelope math

Every system design conversation starts the same way: "what are we sizing for?" If you can't put real numbers on traffic, storage, and latency, every choice you make downstream is unfounded.

## The numbers a senior engineer carries in their head

| Order of magnitude | What it costs |
|---|---|
| 1 ns | L1 cache reference |
| 100 ns | L2 cache reference |
| 100 µs | RAM access on a remote machine |
| 1 ms | NVMe SSD random read |
| 10 ms | DC-local round trip |
| 100 ms | trans-continental round trip |
| 1 s | reading 1 MB sequentially from RAM |

Internalize these. When someone says "sub-100ms," you should immediately know they're saying "no cross-continental hops on the hot path."

## Rules of thumb

- **Seconds in a day:** 86,400. Memorize this.
- **Daily-to-per-second:** divide by 100,000. Easy mental math.
- **Peak vs average:** assume peak is **2-5×** average for consumer traffic; 10× for tax-deadline-style spikes.
- **Read vs write ratio:** state it explicitly. "100:1 reads:writes" frames every storage choice.

## A worked example

> *Problem: 100 million tweets per day. Sized for what?*

- 100M / 86400 ≈ **1,200 writes/sec average**.
- Assume 5× peak → **6,000 writes/sec peak**.
- Avg tweet body 280 bytes; metadata ~500 bytes; total ~1 KB.
- 100M × 1KB = **100 GB/day** of new posts.
- Reads: assume 1000:1 ratio → 100B reads/day → ~1.2M reads/sec average.

That alone tells you:
- Reads dominate. Cache aggressively.
- 1.2M reads/sec needs sharding *and* replication; one node won't do it.
- 100 GB/day → 36 TB/year of post bodies. Plan for sharded storage from day one.

## What to do during the interview

1. State your assumptions out loud. Even wrong assumptions are graded fairly when stated.
2. Pick a peak factor and stick with it.
3. Don't get fancy with units; rounding is fine.
4. Translate every assumption into one consequence: a QPS, a storage number, a cache size.

If you're not stating numbers in the first 5 minutes, you're already off track.
