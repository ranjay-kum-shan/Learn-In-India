---
slug: news-feed
title: Design a Newsfeed (Twitter-style)
difficulty: hard
tags: [fanout, cache, timeline]
estimated_minutes: 60
is_free: false
---

# Design a Newsfeed

Design a Twitter/X-style timeline. Users follow other users; when someone posts, their followers should see it on their home feed quickly.

## Functional requirements

- Post a tweet (text + media reference).
- Follow / unfollow.
- Home timeline: ordered list of posts from people you follow.
- User profile timeline: posts by a specific user.
- Likes & retweets (just counts on the feed are fine).

## Non-functional

- **Latency:** home timeline P99 < 200ms.
- **Read-heavy.** ~1000:1 read:post ratio.
- **Scale:** 500M DAU, 200M posts/day, 30B feed reads/day.
- Eventual consistency on the feed is acceptable (a tweet showing up 5s late is fine).

## Scale

- Posts/sec: ~2,300 average, ~25K peak.
- Feed reads/sec: ~350K average, ~3M peak.
- Avg followers: 200; **celebrities: 10M+** (the hard part).

## What to focus on

1. **Push (fanout-on-write)** vs **pull (fanout-on-read)** vs **hybrid**.
2. Celebrity / hot-user handling.
3. Storage layout for timelines (per-user inbox in Redis vs DB).
4. Media + counts.
5. Ranking (out of scope for v0; assume reverse-chronological).
