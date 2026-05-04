---
slug: group-chat
---

# Reference Solution — Group Chat

## Architecture

Clients hold long-lived WebSockets to a tier of **Connection Servers** (CS) sharded by `hash(user_id)`. A **Routing Service** maps user → CS. **Message Service** persists durable copies to Cassandra. **Push Gateway** handles APNs/FCM.

Outline:
```
Client ⇄ Connection Server ⇄ Message Bus (Kafka)
                              ↘  Cassandra (messages, chats)
                              ↘  Redis (presence, routing)
                              ↘  Push Gateway → APNs/FCM
```

## Send path

1. Client sends `{client_msg_id, chat_id, body}` over WebSocket.
2. CS validates, idempotency-checks `client_msg_id`, persists to Cassandra (quorum write).
3. Publishes to Kafka topic `chat.{chat_id}`.
4. Group-fanout workers expand recipient list, lookup each user's CS via Redis.
5. CS pushes to online recipients; offline → enqueue push notification.

## Receive path

- Online: server pushes message frame.
- Offline: push notification + on-foreground sync.
- Multi-device: each device tracks its own cursor (`last_msg_id`). On reconnect, fetches `since(cursor)`.

## Trade-offs

- E2EE: server stores ciphertext only; no full-text search server-side.
- Receipts: separate small events (compaction-friendly).
- Presence: Redis TTL — eventual within ~30s.
