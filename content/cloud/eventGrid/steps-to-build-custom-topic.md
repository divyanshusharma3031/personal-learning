---
title: Creating Custom Topic in Azure Event Grid
date: 2026-07-11
category: cloud
tags:
    - azure
    - event Driven Architecture

summary: Highlighting the steps to create Custom topic in Azure event Grid.
---

**Before we begin**, let's first build a solid understanding of Azure Event Grid so there is no confusion later.

If you're already familiar with these concepts, feel free to **jump directly to Step 1**.

## Event Grid is a Managed Service

One important thing to understand is that **Azure Event Grid is not a physical Azure resource that you provision or own**. Instead, it is a **fully managed event routing service** provided by Azure.

Unlike services such as **Service Bus**, **Storage Accounts**, or **Logic Apps**, you never create an "Event Grid" instance.

### What you create

Instead of creating Event Grid itself, you create resources that use the Event Grid service:

- **Custom Topic**
- **Event Subscription**

For example, when creating a **Custom Topic**, you specify the **Resource Group** where that topic should reside.

> **Remember:** The **Topic** is an Azure resource. **Event Grid** is the managed service that routes events.

---

### A common misconception

You never say:

> "Create an Event Grid."

Instead, you say:

- "Create a Custom Topic."
- "Create an Event Subscription."

Behind the scenes, Azure's **Event Grid service** is responsible for receiving events, evaluating all matching **Event Subscriptions**, and routing those events to the configured **Event Handlers**.

---

### Mental Model

```text
                Azure Event Grid Service
                         │
         (Managed by Microsoft Azure)
                         │
        ┌────────────────┴────────────────┐
        │                                 │
  Custom Topic                   System Topic
        │                                 │
        └──────────────┬──────────────────┘
                       │
               Event Subscription
                       │
                       ▼
                Event Handler
      (Logic App / Function / Service Bus)
```

The key takeaway is that **Event Grid is the routing engine**, while **Topics** and **Event Subscriptions** are the Azure resources you create and manage.


**Onwards To the steps**


## Step 1: Search for Azure Event Grid in the Search Bar


![Azure Event Grid](blog/eventGrid/event_grid.png)



## Step2. : Look for Topic and click Create .

![Custom Topic Bar](blog/eventGrid/custom_Topic.png)

## Step3. : Fill in your details 

![Custom Topic Details](blog/eventGrid/custom_topic_details.png)

Now you can add Subscription to this topic . Also , when you go to the created topic you will find the 
endpoint of your topic , this will be the end point to which you will send your events . ( Look for the image in step 4)

## Step4.: Create Event Subscriptiop

Click on Event Subscription:

![Add Event](blog/eventGrid/Event_subscription_and_Topic_url.png)


Fill in the necessary details :

You will require to give a name to your subscription and it will ask for end point , In this example we will be using a web hook so we will put the webhook url hete .

![Details Subscription](blog/eventGrid/details_event_subscription.png)

You can configure then By adding your webhook url here like this :

![WebHook Configuration](blog/eventGrid/event_subscription_webHook_endpoint.png)