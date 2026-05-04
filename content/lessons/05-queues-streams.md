---
slug: 05-queues-streams
title: Queues and streams
category: fundamentals
reading_minutes: 7
sort_order: 50
---

# Queues and streams

Async messaging is how senior engineers buy themselves time. Need to do something expensive? Put it on a queue. Need to absorb a spike? Queue it. The difference between a junior and senior design is often "this work is async."

## Two flavors

- **Queues (SQS, RabbitMQ)** — point-to-point. One producer puts a message; one consumer takes it. Visibility timeout, ack, redrive.
- **Streams (Kafka, Kinesis, Redpanda)** — log of events; multiple consumer groups can read the same partition independently from their own offset.

When in doubt: **queue for tasks** (jobs), **stream for events** (state changes).

## Delivery semantics

Three flavors, in increasing difficulty:
- **At-most-once** — fire and forget. Cheap; loses messages on consumer crash.
- **At-least-once** — default for SQS/Kafka. Delivers ≥ 1 time. Consumers must be idempotent.
- **Exactly-once** — needs careful coordination (transactional Kafka, Flink) or idempotent consumers + dedup.

In interviews, name **at-least-once + idempotent consumers** unless you have a specific reason for the others.

## Idempotency in 90 seconds

- Generate an idempotency key on the producer side (UUID, business id).
- Consumer maintains a dedup table (Redis with TTL works).
- On message receipt: check dedup; if seen, ack and skip; if new, process + write key.

This is the most important async pattern. Memorize it.

## Backpressure

When producers outpace consumers:
- **Bounded queue** — producer blocks (good) or sheds (bad-but-honest).
- **Auto-scaling consumers** — react to queue depth; budget-bound.
- **Priority lanes** — separate queues for urgent vs background.
- **Dead-letter queue (DLQ)** — for messages that fail repeatedly. Inspect manually.

## Partitioning

In Kafka, partition keys determine ordering. Rules:
- All messages with the same key go to the same partition (so they're ordered).
- Pick a partition key that **co-locates** events that need ordering (e.g., `chat_id`, `user_id`).
- Hot partitions are the same problem as hot DB shards — name the mitigation explicitly.

## A pattern you'll use in 5 problems

> Service writes durable record → publishes event to Kafka → workers consume → fan out / aggregate / index.

This decouples user-facing latency from heavy work, lets you absorb spikes, and gives you a clean retry surface. If you can defend "why async" in three sentences, you'll out-design half your competition.
