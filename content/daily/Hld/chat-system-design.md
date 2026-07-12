---
title: Billion Scale Chat System Design (Final Stream-First Architecture)
date: 2026-06-04
tags:
  - system-design
  - chat-system
  - redis-streams
  - kafka
  - cassandra
  - websocket
  - distributed-systems
  - high-scale-architecture
summary: End-to-end design of a billion-scale chat system covering WebSocket routing, Redis presence, stream-first ingestion, Cassandra batching, delivery guarantees, deduplication, latency tradeoffs, and direct vs event-driven delivery decisions.
---

# Billion Scale Chat System Design (Final Stream-First Architecture)

This document is the consolidated version of everything we discussed around designing a scalable chat system that can support ~1B users with low latency (<500ms), high throughput, and reliable message delivery.

The key evolution in thinking was:

> Redis Streams/Kafka are not just queues — they are ingestion buffers that reduce database write pressure via batching.

---

# 1. System Overview

Final architecture:

```text
Client
  ↓
WebSocket Gateway (WS Servers)
  ↓
Chat Service
  ↓
Redis Stream (Ingestion + Buffer Layer)
  ↓
Message Consumer Service
   ├── Batch Write → Cassandra
   ├── Check Presence → Redis
   └── Deliver → WebSocket Server
````

---

# 2. Core Idea Shift (Important Insight)

## Old Mental Model

```text
Request → DB → Delivery
```

Problems:

* DB becomes bottleneck at scale
* No natural batching
* Hard to handle spikes

---

## Final Mental Model

```text
Request → Stream → Consumers → (DB + Delivery)
```

This introduces:

* Natural buffering
* Batch processing
* Horizontal scaling
* Failure isolation

---

# 3. WebSocket Connection Model

Each user connects to a WebSocket server:

```text
user1 → ws3
user4 → ws7
```

Stored in Redis:

```text
Presence Map:
user1 -> ws3
user4 -> ws7
```

### Why Redis Presence?

* Fast lookup (<1ms)
* Shared across all WS servers
* Enables routing decisions

---

# 4. Message Flow (End-to-End)

## Step 1: User sends message

```text
User1 → WS3 → Chat Service
```

Chat Service responsibilities:

* Validate request
* Generate `messageId`
* Push event to Redis Stream
* No DB write
* No delivery logic

---

## Step 2: Redis Stream ingestion

```text
Chat Service → Redis Stream
```

Redis Stream acts as:

* Durable buffer
* Traffic spike absorber
* Replayable event log

Important realization:

> Redis Stream is not just a queue — it smooths traffic and enables batching downstream.

---

## Step 3: Consumer processing

Message Consumer reads stream:

```text
Redis Stream → Consumer
```

Consumer responsibilities:

### 1. Batch persistence

Instead of:

```text
1 message → 1 DB write
```

We do:

```text
100–1000 messages → batch Cassandra write
```

This significantly reduces DB load and improves throughput.

---

### 2. Presence check

```text
Redis Presence Lookup
```

```text
user4 → ws7
```

---

### 3. Delivery

If user is online:

```text
Consumer → WS7 → User4
```

If offline:

* Message remains in Cassandra
* Delivered later on reconnect

---

# 5. Cassandra Role

Cassandra is:

* Final message store
* Source of truth for chat history
* Written in batches (not per request)

This is critical for scaling to billion users.

---

# 6. Offline Message Handling

If user is offline:

1. Message still goes through stream
2. Consumer persists it to Cassandra
3. Delivery is skipped
4. On reconnect:

   * Fetch from Cassandra
   * Deliver missed messages

---

# 7. Direct Push vs Stream-Based Delivery

We explored an alternative design:

## Direct Push (NOT used in final design)

```text
WS3 → WS7 → User4
```

Pros:

* Lowest latency

Cons:

* Cross-server complexity
* Retry logic distributed
* Hard to scale
* No central delivery control

---

## Final Choice: Stream-Based Delivery

```text
Chat Service → Stream → Consumer → WS
```

Pros:

* Centralized delivery logic
* Reliable retries
* Easy scaling
* Clean separation of concerns

Cons:

* Slight additional latency

---

# 8. Latency Analysis

Even with stream-first architecture:

| Component             | Latency   |
| --------------------- | --------- |
| WS → Chat Service     | 5–20 ms   |
| Redis Stream write    | 1–10 ms   |
| Consumer pickup       | 5–50 ms   |
| Cassandra batch write | amortized |
| WS delivery           | 1–10 ms   |

### Final SLA:

```text
P50: 50–150 ms
P99: <500 ms
```

---

# 9. Message Deduplication

Since stream + consumer systems are:

> At-least-once delivery systems

Duplicates can occur.

Solution:

### Message ID based deduplication

```text
messageId: UUID
```

Client stores:

```text
seenMessages = {m1, m2, m3}
```

If duplicate arrives:

```text
if messageId already seen → ignore
```

This ensures correctness without needing exactly-once delivery.

---

# 10. Delivery Guarantees Model

We accept:

```text
At-least-once delivery
+ Client-side idempotency
```

Instead of trying:

```text
Exactly-once delivery (very hard and expensive)
```

This is standard in large-scale systems.

---

# 11. Presence + Routing Strategy

Routing decision:

```text
Consumer checks Redis:
   user4 → ws7
```

Then:

```text
Send message to correct WS server
```

If user is on multiple devices:

```text
user4 → ws7, ws9, mobile_ws2
```

Fanout delivery occurs.

---

# 12. Why This Architecture Scales to 1B Users

Key scaling factors:

### 1. Stream absorbs traffic spikes

No direct DB pressure.

### 2. Cassandra writes are batched

Massively reduces write amplification.

### 3. Stateless chat service

Easily horizontally scalable.

### 4. Consumer-based delivery

Independent scaling of ingestion vs delivery.

### 5. Redis presence cache

Fast routing without DB lookup.

---

# 13. Final Mental Model

## Old thinking

```text
Chat = request → DB → push
```

## Final thinking

```text
Chat = event ingestion + stream processing system
```

Where:

* Redis Stream = ingestion + buffer + durability
* Consumer = brain of system
* Cassandra = long-term storage
* WebSocket = delivery layer

---

# 14. Key Takeaways

* Redis Streams are NOT just queues — they are a scaling buffer layer
* Cassandra load is reduced via batch writes from consumers
* Chat service should remain extremely thin
* Delivery is handled by stream consumers, not chat service
* At-scale systems prefer event-driven ingestion over direct DB writes
* At-least-once + idempotency is the correct reliability model
* Entire system comfortably achieves <500ms p99 latency

---

# Final Conclusion

This architecture is optimized for:

* Billion-scale traffic
* High throughput messaging
* Low database pressure
* Horizontal scalability
* Reliable delivery

The most important insight:

> Moving from request-driven architecture to stream-driven architecture fundamentally changes how scaling is achieved — from “database scaling” to “event processing scaling”.