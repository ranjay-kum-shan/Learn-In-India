---
slug: 08-failure-modes
title: Designing for failure
category: fundamentals
reading_minutes: 7
sort_order: 80
---

# Designing for failure

The interview question you'll always be asked: "what happens when *this* fails?" If you can't answer, you've failed the round, regardless of how pretty the diagram is.

## The five failures to always have an answer for

1. **A single instance dies.** Trivial: load balancer routes around it; restart on another node. Don't dwell.
2. **A whole AZ dies.** Multi-AZ deploy. Database has cross-AZ replication. Stateless services scale horizontally. State this once and move on.
3. **A region dies.** Multi-region active-active or active-passive. Be explicit about RPO (data loss tolerance) and RTO (downtime tolerance).
4. **A dependency fails or slows down.** Circuit breakers, timeouts, retries with jitter, fallback values, bulkheads. Most graceful degradations live here.
5. **The cache evaporates.** Stampede protection (single-flight, jittered TTL), origin can absorb a cold start, or you accept stale-while-revalidate.

## Patterns that keep coming up

### Circuit breaker
After K consecutive failures or T% error rate, trip open. After cooldown, half-open: try a small number of requests; if good, close. Otherwise re-trip.

### Timeouts and retries
- **Always set explicit timeouts.** Default infinite is a bug.
- Retry with **exponential backoff + jitter**. Lockstep retries are how cascading failures happen.
- **Limit retries.** 3 is usually right; certainly never unbounded.
- Be aware of **retry storms** — a downstream slowdown causes upstream to retry, multiplying load.

### Bulkheading
Separate thread pools / connection pools per dependency. One slow dependency can't exhaust the shared pool and starve everything else.

### Idempotency
Already covered in queues, but: every retryable operation needs an idempotency key.

### Backpressure
Bounded queues, shedding (return 429 / 503 honestly), deferred work, prioritized lanes. **Never block on an unbounded queue.**

### Graceful degradation
Have a "good-enough" answer when the perfect one is unavailable. Stale cache, default value, simplified flow.

## A line that earns one rubric point

> "If Redis goes down, we fail open: serve directly from Postgres, accept 50ms higher latency. We've sized Postgres to handle 30% of traffic without cache for a few minutes."

Specific numbers, named trade-off, named recovery. Senior-engineer behavior.
