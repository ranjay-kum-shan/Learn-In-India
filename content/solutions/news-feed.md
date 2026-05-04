---
slug: news-feed
---

# Reference Solution — Newsfeed

## Architecture (hybrid fanout)

- **Posts table** (durable, sharded by user_id) — source of truth.
- **Per-user inbox** in Redis sorted set: `inbox:{user_id}` → `(post_id, score=ts)`. Capped at ~800 entries.
- **Posts cache** in Redis: `post:{post_id}` for hydration.
- **Fanout worker pool** consuming Kafka, reading author's followers, writing to inboxes.
- **Celebrity table** flag: skip fanout, read merges last-N from celeb's posts at read time.

## Read path (home timeline)
1. Read inbox (Redis sorted set, range by score).
2. For each followed celebrity, read their recent posts (Redis: `recent:{user_id}`).
3. Merge & deduplicate; cursor-based pagination.
4. Hydrate post bodies from Posts cache; cache miss falls through to Posts table.

## Write path (post)
1. Insert into Posts (durable).
2. Update author's `recent:{user_id}` cap-N list.
3. If non-celeb, enqueue fanout job to Kafka.
4. Workers fan out to follower inboxes (Redis ZADD with TTL on the set).

## Trade-offs
- A few seconds of feed lag is acceptable.
- Storage cost: 200M users × 800 entries × ~16 B ≈ 2.5 TB Redis, sharded.
- Hybrid complexity is real — celeb threshold tuning matters.
