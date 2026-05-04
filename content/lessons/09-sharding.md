---
slug: 09-sharding
title: Sharding
category: fundamentals
reading_minutes: 6
sort_order: 90
---

# Sharding

Sharding is splitting one big dataset across multiple servers so each holds a slice. It's how you scale beyond one machine's RAM, disk, or CPU.

## Three strategies

### Range-based
Each shard owns a contiguous range of keys. Easy to query ranges; **rebalancing is painful**, and you risk hot ranges (e.g., all new users hitting the latest shard).

### Hash-based (modulo)
`shard = hash(key) % N`. Good distribution. **Adding/removing a node moves nearly all keys.** Avoid in production.

### Consistent hashing
Map keys and nodes onto a ring; each key goes to the next node clockwise. Add a node → only K/N keys move. Add **virtual nodes** (~150 per physical node) for smoother distribution. The default for caches and Dynamo-style systems.

### Directory / lookup
A separate service maps key → shard. Most flexible (you can move individual keys), but adds a hop. Used by Vitess and some sharded MySQL setups.

## Picking a shard key

Three properties:
1. **Even distribution.** If 80% of traffic queries one tenant, that's a hot shard. Pick again.
2. **Co-location.** Most queries should hit one shard. If your access pattern is "all posts by user X," shard by `user_id`. If it's "all posts in 30 minutes," shard by time.
3. **No skew.** Celebrity users and viral content break naive shard keys. Plan for them.

## Resharding

Inevitable. Make it easier:
- **Pre-shard** into many logical shards (e.g., 1024) on far fewer physical nodes. Move logical shards to new physical nodes when needed.
- **Double-write** during migration; cut over reads when caught up.
- **Test it before you need it.** A reshard at 3am with no rehearsal is a career limiting event.

## Hot key handling

Even with great sharding, *some* keys will be hot. Strategies:
- **Replicate** the hot key across multiple shards.
- **Cache** the hot key locally per service instance.
- **Salt** the partition key (`hot:${key}:${rand(0,9)}`), then merge at read time.
- **Rate limit** the hot key.

You cannot scale a single hot key with sharding alone. State this.

## A two-sentence pitch you should have ready

> "I shard by tenant_id with consistent hashing and 256 virtual nodes. Hot tenants get an in-process cache plus a replicated cache key; the very hottest get rate-limited at the gateway."

Three specific decisions. One for each of distribution, hot-key, and pathological-case.
