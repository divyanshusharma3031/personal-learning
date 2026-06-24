---

title: Tree Queries
date: 2026-06-24
tags:

- trees
- Rangequeries
- codeforces
- competitive-programming

summary: A comprehensive guide on how to approach tree path queries and range queries problem.

---


# Tree Queries: Euler Tour, Segment Tree, Binary Lifting, HLD

## Mental Model

Before choosing a data structure, identify the shape of the query:

| Query Type                 | Typical Technique                 |
| -------------------------- | --------------------------------- |
| Subtree Query              | Euler Tour + Segment Tree         |
| Root → Node Path Query     | Euler Tour + BIT/Segment Tree     |
| Arbitrary Path (u,v) Query | HLD + Segment Tree                |
| Static Max/Min/GCD on Path | Binary Lifting                    |
| LCA Query                  | Binary Lifting / Euler Tour + RMQ |

---

# 1. Euler Tour + Segment Tree (Subtree Queries)

## Key Observation

During DFS, all nodes of a subtree appear consecutively in entry order.

Example:

```text
1
├── 2
│   ├── 4
│   └── 5
└── 3
```

DFS Entry Order:

```text
1 2 4 5 3
```

Assign:

```cpp
tin[u]
tout[u]
```

Result:

```text
tin[1]=0 tout[1]=4
tin[2]=1 tout[2]=3
tin[3]=4 tout[3]=4
tin[4]=2 tout[4]=2
tin[5]=3 tout[5]=3
```

---

## Flatten Tree

```cpp
flat[tin[u]] = value[u];
```

Example:

```text
Node  : 1 2 4 5 3
Value : 5 7 3 9 2

Flat  : [5,7,3,9,2]
```

Build Segment Tree on `flat`.

---

## Query

Subtree of `u` becomes:

```cpp
[tin[u], tout[u]]
```

Therefore:

```cpp
maxSubtree(u)
=
seg.query(tin[u], tout[u]);
```

Complexities:

```text
Build : O(n)
Query : O(log n)
Update: O(log n)
```

---

# 2. Euler Tour for LCA

Store complete Euler traversal:

```text
1 2 4 2 5 2 1 3 1
```

Store depth of each occurrence:

```text
0 1 2 1 2 1 0 1 0
```

Then:

```text
LCA(u,v)
=
minimum depth node
between first(u) and first(v)
```

Solved using:

* Sparse Table
* Segment Tree

Complexities:

```text
Build : O(n log n)
Query : O(1) with Sparse Table
```

---

# 3. Binary Lifting

Useful for static path queries.

Store:

```cpp
up[v][j]
```

Meaning:

```text
2^j-th ancestor of v
```

---

## LCA

Lift deeper node.

Then lift both nodes simultaneously.

Complexity:

```text
O(log n)
```

---

## Maximum Edge on Path

Store:

```cpp
mx[v][j]
```

Meaning:

```text
Maximum edge weight while moving
2^j steps upward from v
```

Transition:

```cpp
up[v][j]
=
up[ up[v][j-1] ][j-1];

mx[v][j]
=
max(
    mx[v][j-1],
    mx[ up[v][j-1] ][j-1]
);
```

Query:

```text
Lift deeper node
+
Lift both nodes
```

Complexity:

```text
O(log n)
```

Works for:

* Max
* Min
* GCD
* AND
* OR
* XOR

on static paths.

---

# 4. Why Ordinary Euler Tour Fails for Path Queries

Example:

```text
      1
     / \
    2   3
   /
  4
```

Euler Entry Order:

```text
1 2 4 3
```

Path:

```text
4 -> 2 -> 1 -> 3
```

Not contiguous.

Therefore:

```text
One segment tree range
cannot represent an arbitrary path.
```

Need HLD.

---

# 5. Heavy-Light Decomposition (HLD)

Idea:

Break tree into heavy chains.

Assign:

```cpp
head[u]
pos[u]
```

so that every heavy chain becomes contiguous.

Example flattened order:

```text
1 2 4 7 5 3 6
```

Build segment tree on:

```cpp
base[pos[u]]
```

---

## Path Query

While chain heads differ:

```cpp
query(
    pos[head[u]],
    pos[u]
)
```

Move upward.

Finally both nodes belong to same chain.

Query final segment.

Complexity:

```text
O(log² n)
```

---

## HLD Supports

* Path Sum
* Path Maximum
* Path Minimum
* Path XOR
* Edge Updates
* Node Updates

---

# Quick Selection Guide

## Subtree Query

```text
Euler Tour + Segment Tree
```

Examples:

* Sum in subtree
* Max in subtree
* Count colors in subtree

---

## Root → Node Path Query

```text
Euler Tour + BIT
```

Examples:

* Prefix path sum
* Add to subtree, query node

---

## Static Path Query

```text
Binary Lifting
```

Examples:

* Max edge on path
* Min edge on path
* GCD on path

---

## Dynamic Path Query

```text
HLD + Segment Tree
```

Examples:

* Update edge weight
* Max path query
* Sum path query

---

# One-Line Rule

```text
Subtree  -> Euler Tour
Path     -> HLD
Ancestor -> Binary Lifting
LCA      -> Binary Lifting / RMQ
```
