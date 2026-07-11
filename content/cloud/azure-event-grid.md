---
title: Azure Event Grid
date: 2026-07-11
category: cloud
tags:
    - azure
    - event Driven Architecture

summary: Learnings Regarding Azure Event Grid, Key terminologies and mental model To Follow.
---


# Azure Event Grid


What is event Grid ?

Light weight pushed based event routing service designed for reactive, pub-sub programming .
In simplere terms , it is an event **routing** service.

Whenever an Event Happens , the subscribers gets notified.

### Purpose
It is used to build Serverless event driven Architecture.


Image Describing Event Grid :






Some Important Terminologies :

1) Event - An Event is the actual message that something happened.

    Examples:
    - Blob Created( Systen Generated)
    - Blob Deleted ( System Generated)
    - OrderCreated ( Custom)

    Example of how an event Look:

    ```json
    {
    "eventType": "OrderCreated",
    "subject": "Orders/123",
    "data": {
        "orderId": 123
    }
    }
    ```

2) Topic - This is the end point where the events are sent/ published.

Many events can be in the same topic .

Flow is like this :

Event Publisher ------> Event Created ----> Topic 


## System Topics V/s Custom Topic

**System Topic:**

- Created and managed by Azure by default 
- In this Publisher is an Azure service.
- Used for Azure resources.

For example : Azure Resource Group , Storage Account , Key vault.

**Custom Topic:**

- Created by Your service .
- You create the Topic
- Used for Busioness Events.

*Example* :

OrderService ---> OrderCreated---->Custom Topic ---> Event Grid.

In summary ,

Azure publishes → System Topic

Your application publishes → Custom Topic

3) Event Subsciption - This is not your typical Azure subscription.
Not a Code , Not a Listener.

It is simply just a Routing configuration inside event Grid.

It looks Like this -


Source - From where it originated

Event types - Which type of event you want on source( BlobCreated,Blob deleted etc in case of storage Account)

Filters - Any Filter ( Any type of filter)

Destination (event handler)- The actual processor

Retry policy- How many times to retry sending just in case Destination is unavailable.

Dead-letter destination (optional)- Suppose the Azure Function stays unavailable long enough that all retries are exhausted.
Without a dead-letter destination, the events will get lost .

With a dead-letter destination configured,

The undelivered event is stored so you can inspect it and potentially replay or process it later.

## Important 

When an event arrives, **Event Grid checks all subscriptions**(all subscriptions are checked event grid sends the event , subscribers are not listening to event Grid.):

Does this subscription match?

If yes, it forwards the event.


4) Event Handler 

An Event Handler is the destination that actually receives the event.

Examples - Azure Function , Logic App, WebHook,etc

# Azure Event Grid


What is event Grid ?

Light weight pushed based event routing service designed for reactive, pub-sub programming .
In simplere terms , it is an event **routing** service.

Whenever an Event Happens , the subscribers gets notified.

### Purpose
It is used to build Serverless event driven Architecture.


Image Describing Event Grid :




Some Important Terminologies :

1) Event - An Event is the actual message that something happened.

    Examples:
    - Blob Created( Systen Generated)
    - Blob Deleted ( System Generated)
    - OrderCreated ( Custom)


2) Topic - This is the end point where the events are sent/ published.

Many events can be in the same topic .

Flow is like this :

Event Publisher ------> Event Created ----> Topic 


## System Topics V/s Custom Topic

**System Topic:**

- Created and managed by Azure by default 
- In this Publisher is an Azure service.
- Used for Azure resources.

For example : Azure Resource Group , Storage Account , Key vault.

**Custom Topic:**

- Created by Your service .
- You create the Topic
- Used for Busioness Events.

*Example* :

OrderService ---> OrderCreated---->Custom Topic ---> Event Grid.

In summary ,

Azure publishes → System Topic

Your application publishes → Custom Topic

3) Event Subsciption - This is not your typical Azure subscription.
Not a Code , Not a Listener.

It is simply just a Routing configuration inside event Grid.

It looks Like this -


Source - From where it originated

Event types - Which type of event you want on source( BlobCreated,Blob deleted etc in case of storage Account)

Filters - Any Filter ( Any type of filter)

Destination (event handler)- The actual processor

Retry policy- How many times to retry sending just in case Destination is unavailable.

Dead-letter destination (optional)- Suppose the Azure Function stays unavailable long enough that all retries are exhausted.
Without a dead-letter destination, the events will get lost .

With a dead-letter destination configured,

The undelivered event is stored so you can inspect it and potentially replay or process it later.

## Important 

When an event arrives, **Event Grid checks all subscriptions**(all subscriptions are checked event grid sends the event , subscribers are not listening to event Grid.):

Does this subscription match?

If yes, it forwards the event.


# 4. Event Handler

An **Event Handler** is the destination that actually receives the event.

Examples:

* Azure Function
* Logic App
* Webhook
* Service Bus Queue
* Event Hub
* Storage Queue

The handler executes business logic.

Example:

```
BlobCreated
      │
      ▼
Azure Function
      │
Create thumbnail
```

---

# 5. Complete Event Grid Flow

Example:

Blob uploaded to Storage Account.

```
Storage Account
      │
BlobCreated
      ▼
System Topic
      │
Event Grid
      │
 ┌────┼────────┐
 ▼    ▼        ▼
Subscription A
Subscription B
Subscription C
      │
      ▼
Function
Logic App
Service Bus
```

Each subscription decides where the event should go.

Each destination is an event handler.

---

# 6. Resource Group Example

Suppose:

RG A

* Storage Account

RG B

* Azure Function

RG C

* Logic App

RG D

* Service Bus Queue

Flow:

```
Blob Uploaded
      │
      ▼
Storage Account (RG A)
      │
      ▼
Event Grid
      │
 ┌────┼────────┐
 ▼    ▼        ▼
Subscription
Subscription
Subscription
 │      │        │
 ▼      ▼        ▼
Function LogicApp ServiceBus
RG B    RG C      RG D
```

Storage Account knows nothing about RG B, C or D.

Event Grid performs the routing.

---

# 7. Event Grid vs Service Bus

They solve different problems.

## Event Grid

Purpose:

Notify interested systems that something happened.

Example:

```
OrderCreated
```

Many subscribers can receive the same event.

```
Order Service
      │
      ▼
Event Grid
 ┌────┼────────┐
 ▼    ▼        ▼
Inventory
Email
Analytics
```

Event Grid is about **event routing and fan-out**.

---

## Service Bus

Purpose:

Reliably deliver work/messages.

Example:

```
Order Service
      │
      ▼
Service Bus Queue
      │
      ▼
Inventory Service
```

Message stays in queue until processed.

Supports:

* Durable storage
* FIFO (sessions)
* Transactions
* Dead-letter queue
* Duplicate detection
* Scheduled messages

Service Bus is about **reliable messaging**.

---

# 8. Event Grid + Service Bus Together

Very common architecture.

```
Storage Account
      │
BlobCreated
      ▼
Event Grid
      │
      ▼
Service Bus Queue
      │
      ▼
Worker Service
```

Why?

Event Grid distributes events.

Service Bus guarantees reliable processing.

---

# 9. Is Event Grid Reliable?

Yes.

But differently from Service Bus.

Event Grid provides:

* Reliable delivery
* Automatic retries
* Exponential backoff
* Optional dead-letter destination

Its responsibility ends once the event has been successfully delivered to the destination.

Service Bus provides durable storage until the consumer successfully processes the message.

---

# 10. Commands vs Events

This is one of the biggest conceptual differences.

### Event

Means:

> Something happened.

Example:

```
OrderCreated
```

Publisher does not care who receives it.

---

### Command

Means:

> Please do this.

Example:

```
ProcessOrder
```

Usually sent through Service Bus.

---

# 11. Simple Mental Models

### Event

Something happened.

### Topic

Where events are published.

### Event Subscription

Routing rule.

"If this event occurs, send it here."

### Event Handler

Destination that receives the event and performs work.

### Event Grid

Who should know that something happened?

### Service Bus

How do we ensure this work gets completed reliably?

### System Topic

Azure service publishes events.

### Custom Topic

Your application publishes events.

---

# Final Architecture

```
Publisher
    │
    ▼
Topic
    │
    ▼
Event Grid
    │
Checks Event Subscriptions
    │
 ┌────┼───────────┐
 ▼    ▼           ▼
Function LogicApp Service Bus
(Event Handlers)
```

One event can be delivered to multiple handlers.

Event Grid handles routing.

Handlers perform business logic.

Service Bus can be used as a handler when reliable, durable processing is required.
