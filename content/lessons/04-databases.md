---
slug: 04-databases
title: Picking a database
category: fundamentals
reading_minutes: 9
sort_order: 40
---

# Picking a database

The biggest mistake in interviews: picking a database by name ("I'll use Mongo") instead of by access pattern. The correct decision is "Mongo because…".

## The five shapes

| Shape | When | Examples |
|---|---|---|
| **SQL / RDBMS** | You need joins, transactions, secondary indexes; data fits one shard | Postgres, MySQL |
| **Wide-column** | Time-series, append-mostly, range scans by time | Cassandra, Scylla, Bigtable |
| **Key-value** | Single-key lookup at massive scale, no joins | Dynamo, Redis (as KV), RocksDB |
| **Document** | Heterogeneous nested objects, flexible schema | MongoDB, Couchbase, Firestore |
| **Search / inverted index** | Full-text and faceted queries | Elasticsearch, Opensearch, Vespa |

Plus specialty stores: graph (Neo4j), vector (pgvector, Pinecone), time-series (Prometheus, InfluxDB).

## How to choose

Ask three questions, in order:

1. **What is the access pattern?** Read-by-id? Range scan? Multi-attribute query? Full-text? The shape follows from this.
2. **How big does it grow?** If it fits one node now and forever, prefer SQL. If you'll outgrow one node, you need horizontal sharding semantics built-in.
3. **What's the consistency requirement?** Money / billing → ACID transactions, SQL. Counters / feeds → eventually consistent is fine.

## Sharding mental model

When data outgrows one node, you shard. Rules:

- Pick a shard key that **distributes evenly** (most queries hit a balanced subset).
- Pick a key that **co-locates the queries you actually run** (e.g., `user_id` if all reads are per-user).
- Avoid **hot keys** — celebrity users mean a single shard absorbs disproportionate load.
- **Resharding is hard.** Pick a strategy that allows growth (consistent hashing + virtual nodes).

## Replication

- **Single primary, async replicas** — default for SQL. Reads scale; writes don't. Some lag.
- **Multi-primary** — write anywhere, conflicts resolved via CRDTs or app-level. Operationally complex.
- **Quorum read / write (Cassandra/Dynamo)** — tunable: R + W > N for strong-ish consistency.

## A pattern to remember

For most services in an interview, you can reach for this:

```
Postgres (primary + 2 read replicas, sharded by tenant_id) for transactional state
+ Redis (cache-aside) for hot reads
+ S3 for blobs
+ Kafka for events
+ Cassandra/Dynamo for write-heavy or massively sharded data
+ Elasticsearch when search shows up
```

Combine, don't overcomplicate. The interviewer wants to hear "I picked X because Y, and accept Z trade-off." Always finish with the trade-off.
