---

title: Anton and Tree - Component Compression and Tree Diameter
date: 2026-06-07
tags:

* trees
* diameter
* dsu
* graph-theory
* codeforces
* competitive-programming
  summary: A beautiful problem where color components are compressed into a new tree, reducing the task to finding the diameter and answering ceil(diameter / 2).

---

# Anton and Tree

One of those problems where the implementation is simple once the correct observation is found.

At first glance, the problem looks like a simulation problem involving recoloring vertices. However, the real challenge is understanding what effect a paint operation has on the structure of the tree.

---

# Problem Restatement

We are given a tree where each vertex is colored either black or white.

Operation:

* Choose a vertex `v`.
* Repaint all vertices reachable from `v` through a path consisting entirely of vertices having the same color as `v`.

Goal:

Make the entire tree have a single color using the minimum number of operations.

---

# First Observation

Consider the tree:

```text
W - W - W - B - B - W
```

Notice that the first three white vertices always behave as a single unit.

No operation can distinguish between them because they already belong to the same connected monochromatic component.

Instead of thinking about individual vertices, we should think about **connected components of the same color**.

---

# Component Compression

Compress every maximal connected same-colored component into a single node.

Example:

```text
W - W - W - B - B - W
```

becomes:

```text
A(W) - B(B) - C(W)
```

Important observations:

* Adjacent compressed nodes always have different colors.
* Since the original graph was a tree, the compressed graph is also a tree.

This compressed tree contains all information relevant to the problem.

---

# Understanding a Paint Operation

Suppose we have:

```text
A(W) - B(B) - C(W)
```

Paint `B` white.

Now:

```text
A(W) - B(W) - C(W)
```

All three components merge into:

```text
X(W)
```

A single operation can absorb multiple neighboring components.

This is the key reason why solving on the compressed tree becomes much easier.

---

# The Diameter Insight

Let the diameter of the compressed tree be `d`.

Recall:

* Diameter = longest shortest path in the tree.

Example:

```text
A - B - C - D - E
```

Diameter = 4.

---

# Why Can't We Do Better Than ceil(d / 2)?

Consider the two endpoints of the diameter.

A single operation can shrink the diameter by at most 2:

* One layer disappears from the left side.
* One layer disappears from the right side.

Therefore:

```text
After one operation:
d -> d - 2
```

To reduce diameter to zero:

```math
k >= ceil(d / 2)
```

This gives a lower bound.

---

# Why Is ceil(d / 2) Always Achievable?

Take the center of the diameter.

Example:

```text
A - B - C - D - E
        ^
      Center
```

The farthest node from the center is at distance:

```math
ceil(d / 2)
```

Now repeatedly perform paint operations on the center component.

Each operation absorbs one additional BFS layer around the center.

After:

```math
1 operation
```

all nodes at distance 1 are absorbed.

After:

```math
2 operations
```

all nodes at distance 2 are absorbed.

After:

```math
k operations
```

all nodes at distance `k` are absorbed.

Since every node is at distance at most:

```math
ceil(d / 2)
```

from the center, the whole tree is absorbed after exactly:

```math
ceil(d / 2)
```

operations.

Thus:

```math
Answer = ceil(d / 2)
```

---

# Final Algorithm

### Step 1

Compress all connected same-colored vertices using DSU.

### Step 2

Build the compressed tree.

### Step 3

Find the diameter of the compressed tree.

Use the standard two DFS technique:

1. DFS from any node to find the farthest node `A`.
2. DFS from `A` to find the farthest node `B`.
3. Distance `A -> B` is the diameter.

### Step 4

Output:

```cpp
(diameter + 1) / 2
```

---

# Complexity

DSU Construction:

```math
O(n α(n))
```

Building Compressed Tree:

```math
O(n)
```

Diameter Computation:

```math
O(n)
```

Total:

```math
O(n)
```

---

# Takeaway

The difficult part of this problem is not the implementation.

The real insight is realizing that:

> Vertices inside the same monochromatic connected component are indistinguishable.

Once we compress these components, the recoloring process becomes a problem about shrinking a tree from its center.

The answer then naturally becomes:

```math
\boxed{\left\lceil \frac{\text{diameter}}{2} \right\rceil}
```

which is computed as:

```cpp
(diameter + 1) / 2
```
