---
slug: url-shortener
title: Design a URL Shortener (TinyURL)
difficulty: easy
tags: [kv, cache, encoding]
estimated_minutes: 45
is_free: true
---

# Design a URL Shortener

You are designing a service like **bit.ly** or **TinyURL**. Users submit a long URL and receive a short alias (e.g., `https://t.iy/aBc123`). When anyone visits the alias, they're redirected to the original URL.

## Functional requirements

- **Shorten:** `POST /api/shorten` — accepts a long URL, returns a short URL.
- **Redirect:** `GET /:code` — 301/302 redirects to the original.
- **Custom aliases (optional):** users may supply their preferred slug.
- **Expiry (optional):** users may set a TTL (default: 1 year).
- **Analytics:** count clicks per short URL; eventually break down by geography/referrer.

## Non-functional requirements

- **Read-heavy.** ~100:1 read:write ratio.
- **Low latency on redirect.** P99 < 100 ms server-side.
- **High availability.** 99.99% — every minute of downtime is a missed redirect.
- **Durability.** Never lose a created short URL.
- **Scale.** 100M new URLs per month, 10B redirects per month.

## Scale assumptions to lock in

- 100M / month writes ≈ **40 writes/sec** average, ~400/sec peak.
- 10B / month reads ≈ **3,800 reads/sec** average, ~10K/sec peak.
- Avg URL length 100 bytes; metadata ~200 bytes per record.
- 5 years of data: 100M × 12 × 5 ≈ **6B rows**, ~1.5 TB raw.

## What to focus on

1. The **encoding scheme** for the short code (length, character set, collision strategy).
2. The **read path** (cache-first, fallback to durable store).
3. The **write path** (id generation, atomicity, custom alias collisions).
4. **Hot keys** — celebrity short URLs that get hammered.
5. **Failure modes** (cache miss storm, ID server outage, eventual consistency on analytics).
6. The **analytics pipeline** (don't block the redirect on counting).

## What you do NOT need to design

- The marketing site, billing, account management.
- Image / asset handling.
- DNS for the short domain.
