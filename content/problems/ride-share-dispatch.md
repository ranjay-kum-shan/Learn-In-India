---
slug: ride-share-dispatch
title: Design Ride-share Dispatch (Uber)
difficulty: hard
tags: [geohash, mq, realtime]
estimated_minutes: 60
is_free: false
---

# Design Ride-share Dispatch

Riders open the app, request a ride; the system finds and dispatches the nearest available driver. Drivers stream their location to the system continuously.

## Functional

- Driver: heartbeat location every ~4s while online.
- Rider: request a ride at a pickup location.
- System: matches rider to nearest available driver.
- ETA estimation, surge pricing, trip lifecycle (requested → accepted → in-progress → completed).

## Non-functional

- **Match latency:** under 5s from request to driver assignment.
- **Driver location freshness:** within 5s.
- **Scale:** 10M active drivers, 100M riders, 50K matches/min peak in dense cities.
- Fault-tolerant: a region failure shouldn't strand riders globally.

## Focus on

- Geospatial indexing (geohash / S2 / quadtree) for nearest-driver search.
- Driver location ingestion (massive write rate).
- Matching algorithm (greedy vs batch).
- Trip state machine and consistency.
