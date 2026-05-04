---
slug: web-crawler
title: Design a Web Crawler
difficulty: medium
tags: [bfs, politeness, dedup]
estimated_minutes: 45
is_free: false
---

# Web Crawler

Crawl the public web, fetch pages, store them for indexing, respecting robots.txt. Run continuously, prioritizing freshness for important pages.

## Functional
- Seed URL → BFS-like crawl following links.
- Respect robots.txt and `Crawl-delay`.
- Deduplicate (same URL, same content).
- Re-crawl frequency by importance / change rate.
- Store fetched content + metadata.

## Non-functional
- 1B pages/month, ~400 pages/sec.
- Politeness: not more than N RPS to a single domain.
- Survive transient failures of fetcher nodes.

## Focus on
- URL frontier design and prioritization.
- Politeness scheduler.
- Deduplication (URL + content hash).
- Storage of crawled pages.
- Avoiding crawler traps and loops.
