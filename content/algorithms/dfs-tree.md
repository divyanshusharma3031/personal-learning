---
title: DFS Trees - Intuition, Bridges and Back Edges
date: 2026-06-02
tags:
  - graph-theory
  - dfs
  - dfs-tree
  - bridges
  - competitive-programming
  - algorithms
summary: Understanding DFS Trees from first principles, including ancestors, descendants, back edges, bridge detection, the dp-based bridge algorithm, and the intuition behind low-link values.
---

# DFS Trees: Intuition, Bridges and Back Edges

> If I understand the DFS Tree, I can derive the algorithm.
>
> If I only remember the algorithm, I will eventually forget it.

---

## The Goal

When I run DFS on an undirected graph, I am secretly transforming:

```text
Graph
```

into

```text
DFS Tree
+
Back Edges
```

The DFS Tree is the real object I should think about.

Most graph problems become significantly easier once viewed through the DFS Tree.

---

## DFS Tree Construction

Whenever DFS discovers a new vertex:

```cpp
if (!vis[v]) {
    dfs(v);
}
```

the edge

```text
u - v
```

becomes a **Tree Edge**.

These tree edges form a rooted tree.

---

## Parent and Child

Whenever DFS goes:

```text
u -> v
```

for the first time,

```text
u = parent
v = child
```

Example:

```text
1
|
2
|
4
|
5
```

Parents:

```cpp
parent[2] = 1;
parent[4] = 2;
parent[5] = 4;
```

---

## Ancestor and Descendant

Exactly the same definitions as in any rooted tree.

Example:

```text
1
|
2
|
4
|
5
```

### Ancestors of 5

```text
4
2
1
```

### Descendants of 2

```text
4
5
```

---

## The Most Important DFS Tree Property

> In an undirected graph, every non-tree edge connects a node with one of its ancestors.

These edges are called **Back Edges**.

Example:

```text
1
|
2
|
3
|
4
```

Extra edge:

```text
4 --- 1
```

Tree:

```text
1
|
2
|
3
|
4
```

Back edge:

```text
4 --- 1
```

This connects:

```text
descendant -> ancestor
```

---

## Why No Cross Edges Exist?

Suppose:

```text
    1
   / \
  2   3
```

and the edge

```text
2 --- 3
```

exists.

If DFS reaches 2 first, DFS immediately visits 3.

Therefore, 3 can never become a separate DFS branch.

Hence:

```text
non-tree edge
=
ancestor-descendant edge
```

always.

This is the reason DFS Trees are so powerful.

---

## My DFS Template

```cpp
void dfs(int u, int par)
{
    vis[u] = 1;

    for(auto v : adj[u])
    {
        if(!vis[v])
        {
            depth[v] = depth[u] + 1;

            dfs(v,u);

            dp[u] += dp[v];
        }
        else if(depth[v] < depth[u] && v != par)
        {
            dp[u]++;
            dp[v]--;
        }
    }
}
```

---

## Meaning of `depth[]`

```cpp
depth[v] = depth[u] + 1;
```

This stores depth inside the DFS Tree.

Example:

```text
1 depth = 0
|
2 depth = 1
|
4 depth = 2
|
5 depth = 3
```

---

## Meaning of `depth[v] < depth[u]`

This means:

```text
v is an ancestor of u
```

because ancestors always have smaller depth.

Example:

```text
1
|
2
|
3
|
4
```

At node 4:

```cpp
depth[1] < depth[4]
```

So:

```text
4 --- 1
```

is a back edge.

---

## What Does "Passing Over" Mean?

Tree:

```text
1
|
2
|
3
|
4
```

Back edge:

```text
4 --- 1
```

Consider tree edge:

```text
2 --- 3
```

Cut the tree:

```text
1
|
2

-----CUT-----

3
|
4
```

The back edge:

```text
4 --- 1
```

has:

```text
one endpoint above
one endpoint below
```

Therefore it **passes over**

```text
2 --- 3
```

---

## Bridge Intuition

Consider the tree edge:

```text
parent[u]
    |
    u
```

Remove it.

The graph splits into:

```text
Ancestors Side

and

Subtree(u)
```

The key question is:

> Can a back edge reconnect them?

If YES:

```text
Not a Bridge
```

If NO:

```text
Bridge
```

---

## Bridge Characterization

> A tree edge is a bridge iff no back edge passes over it.

This is the entire bridge algorithm.

Everything else is implementation.

---

## Understanding `dp[]`

This is the most important idea in my template.

Definition:

```cpp
dp[u]
```

=

```text
Number of back edges
passing over
(parent[u], u)
```

Example:

```text
1
|
2
|
3
|
4
```

Back edge:

```text
4 --- 1
```

Then:

```cpp
dp[4] = 1
dp[3] = 1
dp[2] = 1
```

because that back edge passes over:

```text
(3,4)
(2,3)
(1,2)
```

---

## Why `dp[u]++` and `dp[v]--` Works

Suppose:

```text
u ---- v
```

is a back edge where

```text
v is ancestor of u
```

Example:

```text
1
|
2
|
3
|
4
```

Back edge:

```text
4 --- 1
```

We do:

```cpp
dp[4]++;
dp[1]--;
```

Later:

```cpp
dp[u] += dp[child];
```

propagates the information upward.

Result:

```cpp
dp[4] = 1
dp[3] = 1
dp[2] = 1
dp[1] = 0
```

Exactly the tree edges crossed by the back edge.

---

## Why `dp[u] += dp[v]` Works

Every child reports:

```text
How many back edges
leave my subtree?
```

The parent accumulates contributions from all children.

Eventually:

```cpp
dp[u]
```

becomes:

```text
Number of back edges crossing
(parent[u], u)
```

---

## Bridge Condition

If:

```cpp
dp[u] == 0
```

then:

```text
No back edge crosses
(parent[u], u)
```

Therefore:

```text
(parent[u], u)
```

is a bridge.

---

## Why `depth[v] < depth[u]` Detects Back Edges

At node:

```text
u
```

if:

```cpp
vis[v]
```

and

```cpp
depth[v] < depth[u]
```

then:

```text
v is an ancestor
```

Thus:

```text
u -> v
```

is a back edge.

---

## DFS State Interpretation

Useful alternative mental model:

```cpp
0 = unvisited
1 = in recursion stack
2 = completely processed
```

When:

```cpp
vis[v] == 1
```

then:

```text
v is currently on the DFS path
```

Therefore:

```text
v is an ancestor
```

and

```text
u -> v
```

is a back edge.

---

## Important Insight

The bridge condition:

```cpp
dp[u] == 0
```

and the classical condition:

```cpp
low[v] > tin[u]
```

are checking exactly the same thing.

Both ask:

```text
Does any back edge pass over
(parent[v], v)?
```

Difference:

```text
low[]
```

stores the highest ancestor reachable.

```text
dp[]
```

stores how many back edges cross the cut.

Same information.

Different implementation.

---

## Problems Where the DFS Tree Is the Real Solution

1. Bridges
2. Articulation Points
3. Biconnected Components
4. Block-Cut Tree
5. Cactus Graphs
6. Edge Orientation Problems
7. Strong Connectivity Construction
8. Cycle Detection
9. SCC Intuition
10. Dominator Tree (Advanced)

---

## Final Mental Model

Whenever I see a graph problem:

### Do NOT Think

```text
Graph
```

### Think

```text
DFS Tree
+
Ancestor-Descendant Edges
```

Most structural graph problems become dramatically easier after this transformation.