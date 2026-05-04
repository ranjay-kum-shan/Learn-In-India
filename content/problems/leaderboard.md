---
slug: leaderboard
title: Design a Real-time Leaderboard
difficulty: easy
tags: [sorted-set, redis, ttl]
estimated_minutes: 30
is_free: false
---

# Real-time Leaderboard

Show the top 100 players for a game (or top sellers, top earners, etc.) in real time. Players want to see their own rank too.

## Functional
- Increment a player's score.
- Get global top-K (K up to 100).
- Get a player's rank and percentile.
- Multiple boards: daily, weekly, all-time.

## Non-functional
- 100M players, 50K updates/sec peak.
- P99 read < 100ms.
- Reasonably accurate; small lag on rank acceptable.

## Focus on
- Sorted-set / skiplist usage.
- Sharding for scale.
- Per-window separation (daily resets).
- Player rank lookup at scale.
