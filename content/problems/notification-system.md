---
slug: notification-system
title: Design a Notification System
difficulty: medium
tags: [queues, workers, idempotency]
estimated_minutes: 45
is_free: false
---

# Notification System

A multi-channel notification platform: trigger an event → deliver as email, SMS, push, or in-app. Used by every product team.

## Functional
- Submit a notification: `{user_id, channel, template_id, payload, dedup_key}`.
- Render template with payload.
- Deliver via the chosen channel (or all of user's preferences).
- Track delivery status; surface to caller.
- Per-user preferences and quiet hours.

## Non-functional
- 1B notifications/day, ~50K/sec peak.
- At-least-once delivery; deduped per `dedup_key` for 24h.
- Email/SMS providers fail and rate-limit; we must absorb that.

## Focus on
- Reliable async delivery.
- Provider abstraction & failover.
- Templates, preferences, opt-outs.
- Idempotency.
- Backpressure.
