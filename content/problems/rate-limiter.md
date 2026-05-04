---
slug: rate-limiter
title: Design a Distributed Rate Limiter
difficulty: medium
tags: [token-bucket, redis, distributed]
estimated_minutes: 45
is_free: true
---

# Design a Distributed Rate Limiter

A reusable rate limiter sits in front of an API gateway. It allows or rejects requests based on per-user / per-API-key / per-IP quotas. Many backend services check it.

## Functional requirements

- Define per-key quotas (e.g., 1,000 requests / minute / API key).
- Multiple algorithms: **token bucket**, **leaky bucket**, **fixed window**, **sliding window**.
- Returns: allow (with remaining count) or 429 (with `Retry-After`).
- Configurable per route / per tenant.
- Distributed: enforced across all gateway instances.

## Non-functional

- **Low latency**, P99 < 5 ms; on the hot path of every request.
- **Highly available** — failure must not 4xx the world (fail-open vs fail-closed is a choice).
- **Accurate enough** — small over/undercount under burst is acceptable.
- **Scale**: 1M QPS aggregate.

## What to focus on

- Algorithm choice and trade-offs.
- The distributed counter store (Redis script vs Redis cluster vs cell-based).
- Hot keys (one tenant burning 80% of quota).
- Failure modes — what happens when Redis falls over?
- Synchronization — do you need atomicity on the counter?
