---
slug: distributed-cache
---

# Reference Solution — Distributed Cache

## Sharding & routing
Consistent hashing ring with 200 virtual nodes per physical node. Smart client library carries a copy of the ring; refreshes via gossip events. Adding a node moves ~K/N keys.

## Storage
Each node holds an in-memory hash table + W-TinyLFU eviction (better than vanilla LRU on skewed real-world traffic). Approximate-LRU sampling N=8 for cheap eviction.

## Replication
Hot-key shadow replicas on demand: when a key crosses a per-shard QPS threshold, the smart client splits reads across two replicas. Cache is otherwise stateless and accepts cold-start cost on rare node failure.

## Membership
SWIM gossip; phi-accrual detector. Failed node removed from ring after 5s of suspect; a 1-min grace period before garbage collection.

## Stampede protection
Single-flight at the smart client: on miss, take a per-key lock, fetch from origin once, populate.
