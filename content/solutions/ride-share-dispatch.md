---
slug: ride-share-dispatch
---

# Reference Solution — Ride-share Dispatch

## Architecture

- Drivers POST locations every 4s to a regional **Location Ingest** service.
- Updates flow through Kafka into an in-memory **Geo Index** (S2 cells), backed by Redis Geo for crash recovery.
- Riders POST `/ride` to **Match Service**; it queries Geo Index for top-K candidates in expanding rings, scores by ETA, offers to first.
- **Trip Service** owns the lifecycle, persists to a sharded SQL DB.
- WebSocket connections push trip updates to apps.

## Match algorithm
- Greedy nearest in 100m → 250m → 500m rings until found, capped at 5s window.
- In high-density cells, a 1s batch matching window with Hungarian-like assignment for fairness.
- Filter candidates by vehicle type, ETA, recent rejection rate.

## Failure
- Region-isolated: failure of one region only affects trips there; ongoing trips stay on driver apps via cached state.
- Stale locations TTL'd at 12s in geo-index.
