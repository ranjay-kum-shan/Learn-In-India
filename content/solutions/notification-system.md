---
slug: notification-system
---

# Reference Solution — Notification System

Outbox pattern: callers POST to Notification API; we write to a `notifications` row + enqueue. Channel-specific workers (Email/SMS/Push) drain per-channel SQS queues, render templates, call providers via adapters, record results.

Idempotency via Redis dedup keys (24h TTL). Failover: each adapter has primary/secondary; circuit breaker per provider. Bounded retries with jitter; DLQ for permanent failures.

Trade-offs: at-least-once + dedup is cheaper than exactly-once. Marketing traffic uses lower-priority queues so transactional sends don't starve.
