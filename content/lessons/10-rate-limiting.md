---
slug: 10-rate-limiting
title: Rate limiting
category: fundamentals
reading_minutes: 6
sort_order: 100
---

# Rate limiting

Rate limiters protect a service from being overwhelmed. They also draw lines around tenants in a multi-tenant system. They're not optional in any production design.

## Four algorithms

### Token bucket
A bucket holds tokens; you consume one per request. Tokens refill at rate R, capped at capacity C. **Allows bursts up to C, smooths over time.** The default. Most useful for API quotas.

### Leaky bucket
Requests go into a queue; processed at fixed rate. Smoothing — no bursts. Used when you must protect a downstream from spikes (e.g., outbound to a third-party).

### Fixed window
Count requests per second / minute window. Cheap. **Suffers boundary bursts** (requests at the end of one window + start of the next can double the rate).

### Sliding window log / counter
Tracks request timestamps in a window or weighted average across two windows. Smoother than fixed; more state.

## Distributed implementation

For 1M QPS, you have two camps:

### Central counter (Redis + Lua)
Atomic check-and-decrement via Lua. Accurate to one op. Bottlenecked by Redis throughput per shard. Mitigate with sharding by tenant.

### Local counters with reconciliation
Each gateway instance has its own bucket; periodically reconciles with a central tally. Fast, allows ~10% drift. The right choice when accuracy is less important than latency.

## The fail-open vs fail-closed question

When the rate-limiter store (Redis) is down, what do you do?

- **Fail open** — accept all requests. The site stays up; the protection is lost. Right for most consumer flows.
- **Fail closed** — reject all requests. Right for billing, login, anything where unauthorized writes are catastrophic.

Make the choice **per-route**, not globally. State this in the interview.

## Headers to remember

A polite rate limiter returns:
- `X-RateLimit-Limit: 1000`
- `X-RateLimit-Remaining: 42`
- `X-RateLimit-Reset: 1700000000`
- On 429: `Retry-After: 10`

These signal to clients to back off without trial-and-error.

## In an interview

> "I'd put a token-bucket library at the gateway, backed by a Lua script in Redis. Sharded by tenant. Fail-open for product routes, fail-closed for auth. Per-tenant cells when one tenant is consistently noisy."

That sentence gives the interviewer six rubric points.
