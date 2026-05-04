---
slug: 06-load-balancing
title: Load balancing
category: fundamentals
reading_minutes: 5
sort_order: 60
---

# Load balancing

A load balancer (LB) takes incoming requests and distributes them across a pool of backends. It's the bedrock of horizontal scale.

## L4 vs L7

- **L4 (transport)** — operates on TCP/UDP. Doesn't understand HTTP. Fast and simple. AWS NLB.
- **L7 (application)** — understands HTTP, can route by path/header, terminate TLS, do A/B traffic split. AWS ALB, Nginx, Envoy.

Default: **L7** for HTTP services. **L4** for raw TCP (databases behind a fronting LB, gRPC streaming).

## Algorithms

| Algorithm | When |
|---|---|
| **Round-robin** | Backends are roughly identical, requests are roughly identical |
| **Least-connections** | Long-lived connections (websockets, gRPC) |
| **Weighted** | Mixed instance sizes |
| **Hash (consistent)** | Session affinity needed; cache locality |
| **Power-of-two-choices** | Better than RR with cheap implementation |

## Health checks

- Active probes (HTTP GET /health every N seconds).
- Passive (mark unhealthy after K consecutive failed real requests).
- Connection draining on instance removal.

## What to mention in interviews

- Use a **managed LB** (ALB, GCLB) over running your own Nginx fleet unless you have a specific reason.
- For WebSockets, **least-connections + sticky sessions** (or hash by user_id).
- Geographic load balancing via **DNS / Anycast** (Route53, Cloudflare) for multi-region.
- Don't put a "load balancer" between every two services — service mesh / sidecar handles intra-service balancing.

## A nuance worth one extra sentence

> "Behind the LB, services should be stateless. State lives in shared stores. This makes the LB algorithm choice a footnote, not a critical path."

Saying that line in an interview demonstrates that you understand horizontal scale isn't an LB feature — it's an architectural property.
