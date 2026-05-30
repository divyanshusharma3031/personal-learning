---
title: Workload Identity Federation
date: 2026-05-30
category: cloud
tags:
  - gke
  - azure
  - identity

summary: Removing service principal secrets using workload identity federation.
---

# Problem

Managing service principal secrets is painful.

Secrets expire.

Rotation is manual.

# Solution

Use Workload Identity Federation.

The pod exchanges its identity for a cloud credential.

No secret storage required.

# Benefits

- Better security
- No secret rotation
- Easier operations