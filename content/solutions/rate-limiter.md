---
slug: rate-limiter
---

# Reference Solution — Distributed Rate Limiter

## Numbers

- 1M QPS aggregate; assume 100K active keys, top tenant ~10% of traffic.
- P99 budget: 5ms inline; 1–2 ms at the limiter is the realistic ceiling.

## Algorithm

**Token bucket** by default. Lua script in Redis does atomic refill + decrement:

```lua
-- KEYS[1] = bucket, ARGV[1] = capacity, ARGV[2] = refill_per_sec, ARGV[3] = now_ms, ARGV[4] = cost
-- Returns: { allowed, remaining }
```

- Sliding window log for tenants who pay extra for accuracy.
- Fixed window for ultra-cheap edge limits (DDoS shield).

## Architecture

`Gateway → Limiter Library (in-process) → Redis Cluster`

- Library at the gateway keeps RTT low (no service hop).
- Redis Cluster sharded by `hash(tenant)` so one tenant's bucket is hot but not the whole cluster.
- For very hot tenants: local pre-allocation (10% of bucket) so 90% of requests skip Redis entirely; reconcile every 100ms.

## Failure mode

- Redis unreachable: fail-open by default at the route level (configurable per route — auth gets fail-closed).
- Local last-known-good counter buys 60s of stale-but-safe enforcement.
- Circuit breaker trips after 3 consecutive timeouts; half-opens after 5s.

## Trade-offs we accept

- ~1% over-allow on bucket boundaries during refill — fine for almost any product use case.
- Hot-key tenants pay extra latency on first request after cold-start (Redis fetch).
- Accuracy trade-off encoded per route, not globally.
