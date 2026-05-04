---
slug: 07-consistency-and-replication
title: Consistency and replication
category: fundamentals
reading_minutes: 8
sort_order: 70
---

# Consistency and replication

Replication is how distributed systems survive failures. Consistency is the price you pay when copies disagree.

## The spectrum

From strongest to weakest:
1. **Linearizable** — reads see the latest committed write, in real time. Spanner, etcd, ZooKeeper.
2. **Sequential** — operations appear in the same order to all clients, but might lag real time.
3. **Causal** — if A causally precedes B (one reads the other), all clients see A before B.
4. **Read-your-writes** — a client sees its own writes; others may not yet.
5. **Monotonic reads** — once you've seen value V, you don't go back to V-1.
6. **Eventual** — replicas converge. No timing guarantee.

In interviews, name the **specific** flavor you need, not "consistency" alone. "We need read-your-writes for the user's own dashboard, eventual is fine for follower feeds."

## Replication strategies

### Single-leader (a.k.a. primary-replica)
- All writes hit the leader; reads can hit replicas with replication lag.
- Default for most SQL deployments.
- Trade-off: write throughput capped at the leader's capacity.

### Multi-leader
- Writes can hit any leader; conflicts resolved on read or write.
- Common for multi-region active-active.
- Trade-off: conflict resolution is hard. Use only when you must.

### Leaderless (Dynamo-style)
- Coordinator forwards writes to N replicas; quorum on reads (R) and writes (W) where R + W > N.
- Tunable consistency per request.
- Trade-off: no single source of truth; needs read repair / anti-entropy.

## Replication lag — concrete numbers

- LAN: typically <10ms.
- Cross-AZ: 1-5ms.
- Cross-region: 50-200ms (US East ↔ US West).

State this if you're claiming "read replicas are fine."

## A trap to avoid

"Strongly consistent" doesn't mean "no failures." It means "if we respond, the answer is correct." A linearizable system *will* refuse work under partition (CP in CAP). That's a feature, not a bug — but you must say it.

## What to bring into an interview

- Default to **single-leader Postgres + async read replicas** for transactional state.
- Default to **eventual consistency** for: counters, feeds, search indexes, analytics, notifications.
- Default to **strong consistency / quorum** for: payments, account balances, leases.
- Always articulate the trade-off as a sentence.
