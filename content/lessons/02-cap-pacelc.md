---
slug: 02-cap-pacelc
title: CAP and PACELC, demystified
category: fundamentals
reading_minutes: 7
sort_order: 20
---

# CAP and PACELC, demystified

CAP is the most-misquoted theorem in distributed systems. The version you'll be asked about in an interview is *not* "pick 2 of 3" — it's a real-world choice between consistency and availability *under partition*.

## The actual theorem

In the presence of a network partition, a distributed system must choose:

- **C — Consistency:** every read returns the latest write (linearizable).
- **A — Availability:** every request gets a (non-error) response.

You cannot have both. **P — Partition tolerance** is not optional in any real network — it's a fact, not a choice. So CAP is really: "when partitioned, do you choose to fail closed (C) or stay up (A)?"

## What it does NOT mean

- It does **not** say a system always sacrifices C or A.
- It does **not** prevent strong consistency in a non-partitioned cluster.
- It does **not** apply to single-node systems.

## PACELC — the more useful frame

PACELC extends CAP: **on Partition (P), choose A or C; **E**lse (no partition), choose **L**atency or **C**onsistency.**

Most production systems make *two* choices:
- **PA/EL** — Cassandra, Dynamo: stay up under partition, fast under no partition (eventual).
- **PC/EC** — HBase, Spanner: refuse work when partitioned, slow but consistent normally.

## How to use this in an interview

When you pick a database, name the PACELC profile:

> "I'm picking Dynamo because the read path is latency-sensitive, and we tolerate eventual consistency on counters — PA/EL. Trips DB stays Postgres for the same reason in reverse — PC/EC."

That sentence shows you understand the trade-off, not just the brand.

## Common confusions

- "Single-leader Postgres is CP." Sort of, but not really — under partition, the leader can still serve writes if it's still a quorum. The conversation is more nuanced than CAP-letters allow.
- "Eventual consistency is bad." It's not — it's a choice. For counters, feeds, and analytics, it's almost always right.
- "Consensus = consistency." Consensus algorithms (Paxos, Raft) give you linearizable replication; "consistency" in CAP is one specific flavor (linearizability), not the only one.

## Memorize this much

| System | PACELC |
|---|---|
| Postgres (single primary) | EC (PC/EC, but availability tunable via failover) |
| MySQL (group replication) | EC |
| Cassandra | PA/EL |
| Dynamo / DynamoDB | PA/EL |
| HBase | PC/EC |
| Spanner | PC/EC |
| Cosmos DB | tunable per-request |
| Redis (single primary) | EC; failover is async |

You don't need more than this.
