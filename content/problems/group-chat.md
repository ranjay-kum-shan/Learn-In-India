---
slug: group-chat
title: Design a Group Chat (WhatsApp-style)
difficulty: hard
tags: [pubsub, presence, storage]
estimated_minutes: 60
is_free: false
---

# Design a Group Chat

WhatsApp-style messaging: 1-1 and group chats, delivery receipts, typing indicators, presence, message history sync across devices.

## Functional

- Send / receive messages (text + media).
- Group chats up to 1,024 members.
- Read receipts (sent / delivered / read).
- Online presence + typing indicators.
- Push notifications on offline.
- Message history sync to new devices.

## Non-functional

- **Latency:** message delivery < 200 ms P99.
- **Durable:** never lose a message.
- **End-to-end encrypted** (out of scope to implement, but the design must accommodate it).
- **Scale:** 2B users, 100B messages/day, 100M concurrent connections.

## Focus on

- Connection management (long-lived WebSocket / MQTT).
- Message persistence vs transient delivery.
- Group fanout.
- Push for offline.
- Multi-device sync.
