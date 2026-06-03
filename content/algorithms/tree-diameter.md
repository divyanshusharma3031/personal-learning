---

title: Tree Diameter - Intuition, Proofs, Eccentricity and Applications
date: 2026-06-03
tags:
    - graph-theory
    - trees
    - diameter
    - dfs
    - eccentricity
    - competitive-programming
    - algorithms

summary: Understanding tree diameters from first principles, including double DFS, diameter DP, weighted diameters, eccentricity, proofs of correctness, and practical competitive programming applications.

---

# Tree Diameter - Intuition, Proofs, Eccentricity and Applications

Finding the diameter is one of the most common techniques in tree problems.

A surprising number of tree problems become much simpler once you identify and exploit the properties of the diameter.

This article covers:

* What a diameter is
* How to find it
* Double DFS proof
* Diameter DP
* Weighted diameters
* Eccentricity
* Important observations used in competitive programming

---

# What is a Diameter?

Given a tree, define:

```text
dist(a, b)
```

as the distance between nodes `a` and `b`.

For an unweighted tree, this is simply the number of edges on the path.

For a weighted tree, it is the sum of edge weights along the path.

A diameter is the longest path in the tree.

Formally:

```text
Diameter = max(dist(u, v))
```

over all pairs of vertices.

If multiple longest paths exist, any of them can be chosen as a diameter.

---

# Finding a Diameter using Double DFS

One of the most famous tree algorithms is the Double DFS/BFS method.

## Algorithm

1. Start DFS from any node `p`.
2. Let `A` be the farthest node from `p`.
3. Start DFS from `A`.
4. Let `B` be the farthest node from `A`.
5. Path `A → B` is a diameter.

## Complexity

```text
O(N)
```

for unweighted trees.

```text
O(N)
```

for weighted trees as well.

---

# Diameter DP (Single DFS)

Many editorials only show Double DFS.

In competitive programming it is often useful to directly compute the diameter using a tree DP.

The idea:

For every node maintain the two largest downward paths.

If:

```cpp
mx.first
```

is the largest downward path and

```cpp
mx2.first
```

is the second largest downward path,

then the best diameter passing through this node is:

```cpp
mx.first + mx2.first
```

Taking the maximum over all nodes gives the diameter.

---

## Unweighted Diameter

```cpp
int ans = 0;
pair<int, int> dia;

pair<int, int> dfs(int node, int par, vector<int> adj[])
{
    pair<int, int> mx = {0, node};
    pair<int, int> mx2 = {0, node};

    for (auto it : adj[node])
    {
        if (it == par)
            continue;

        auto [d, ch] = dfs(it, node, adj);

        int len = d + 1;

        if (len >= mx.first)
        {
            mx2 = mx;
            mx = {len, ch};
        }
        else if (len > mx2.first)
        {
            mx2 = {len, ch};
        }
    }

    int curr = mx.first + mx2.first;

    if (curr > ans)
    {
        ans = curr;
        dia = {mx.second, mx2.second};
    }

    return mx;
}
```

This returns:

* Diameter length
* Diameter endpoints

in a single DFS.

---

## Weighted Diameter

Exactly the same idea works.

Instead of adding `1` for every edge, add the edge weight.

```cpp
pair<long long,int> dfsDiameter(
    int node,
    int par,
    vector<pair<int,int>> adj[],
    long long &diameter,
    pair<int,int> &diaEnds)
{
    pair<long long,int> mx = {0, node};
    pair<long long,int> mx2 = {0, node};

    for(auto [child, wt] : adj[node])
    {
        if(child == par) continue;

        auto [d, ch] = dfsDiameter(child, node, adj, diameter, diaEnds);

        long long len = d + wt;

        if(len >= mx.first)
        {
            mx2 = mx;
            mx = {len, ch};
        }
        else if(len > mx2.first)
        {
            mx2 = {len, ch};
        }
    }

    long long curr = mx.first + mx2.first;

    if(curr > diameter)
    {
        diameter = curr;
        diaEnds = {mx.second, mx2.second};
    }

    return mx;
}
```

---

# Understanding the Structure of a Diameter

Suppose the diameter endpoints are:

```text
A and B
```

Imagine drawing the diameter as a straight line.

Now remove all diameter edges.

The remaining graph becomes a collection of smaller trees attached to the diameter.

Every such component has exactly one node on the diameter through which it is connected.

Think of the diameter as the backbone of the tree.

Everything else hangs off this backbone.

---

# Important Observation

Consider a component attached to the diameter at node `X`.

The height of this component cannot exceed the distance from `X` to the nearest diameter endpoint.

Why?

Because otherwise we could construct a path longer than the diameter.

That would contradict the definition of a diameter.

This observation is the foundation behind most diameter proofs.

---

# Farthest Node from Any Vertex

One of the most important facts:

> For every node in a tree, one of the diameter endpoints is a farthest node.

If the diameter endpoints are `A` and `B`, then for every node `u`:

```text
maxDistance(u) = max(dist(u, A), dist(u, B))
```

This fact appears everywhere in competitive programming.

---

# Intuitive Proof (Unweighted)

Let the diameter endpoints be `A` and `B`.

Take any node `u`.

## Case 1

`u` lies on a branch attached to `A` or `B`.

Then clearly moving toward one of the diameter endpoints produces the longest possible path.

Since `A-B` is already the longest path in the tree, no other destination can beat it.

---

## Case 2

`u` is attached somewhere in the middle of the diameter.

Let `X` be the first node on the diameter encountered while moving upward from `u`.

```text
u
|
|
X====================A
 \
  \
   ==================B
```

The branch length:

```text
X → u
```

must be smaller than the corresponding diameter segment.

Otherwise:

```text
u -> X -> A
```

or

```text
u -> X -> B
```

would create a path longer than the current diameter.

Contradiction.

Therefore the farthest node from `u` must be one of:

```text
A or B
```

---

# Intuitive Proof (Weighted)

The weighted version is identical.

Replace:

```text
length
```

with

```text
total weight
```

throughout the proof.

Suppose a branch hanging from the diameter has greater weight than the diameter segment attached to it.

Then replacing that diameter segment with the branch creates a heavier path.

That means the original diameter was not actually the maximum-weight path.

Contradiction.

Therefore every branch attached to the diameter is bounded by the corresponding diameter segment.

Hence the farthest weighted node from any vertex is still one of the diameter endpoints.

---

# Formal Proof of Double DFS

Suppose:

```text
U → V
```

is an actual diameter.

The previous result tells us that for node `U`, one of the diameter endpoints found by the algorithm must be a farthest node.

Therefore:

```text
dist(U, A) ≥ dist(U, V)
```

or

```text
dist(U, B) ≥ dist(U, V)
```

Assume:

```text
dist(U, B) ≥ dist(U, V)
```

Since `B` is the farthest node from `A`:

```text
dist(A, B) ≥ dist(U, B)
```

Combining:

```text
dist(A, B)
≥ dist(U, B)
≥ dist(U, V)
```

But `U → V` is already a diameter.

Therefore:

```text
dist(A, B) = dist(U, V)
```

and `A → B` is also a diameter.

Hence Double DFS is correct.

---

# Eccentricity

This concept appears in a large number of tree problems.

## Definition

The eccentricity of a node `u` is:

```text
ecc(u) = max dist(u, v)
```

over all vertices `v`.

In simple words:

> Eccentricity is the distance to the farthest node.

---

## Diameter Property

Let:

```text
A and B
```

be diameter endpoints.

Then:

```cpp
ecc(u) = max(distA[u], distB[u]);
```

where:

```cpp
distA[u]
```

is the distance from `A` to `u` and

```cpp
distB[u]
```

is the distance from `B` to `u`.

This follows immediately from:

> The farthest node from every vertex is one of the diameter endpoints.

---

## Computing Eccentricity of Every Node

Run DFS/BFS from `A`.

Store:

```cpp
distA[]
```

Run DFS/BFS from `B`.

Store:

```cpp
distB[]
```

Then:

```cpp
for(int i = 1; i <= n; i++)
{
    ecc[i] = max(distA[i], distB[i]);
}
```

Complexity:

```text
O(N)
```

---

# Why Eccentricity Matters

Many problems reduce to computing eccentricities.

Common examples:

* Farthest node from every node
* Maximum distance from every node
* Tree centers
* Tree radius
* Tree DP rerooting problems
* Facility placement problems
* Dynamic tree distance problems

Whenever you see:

```text
maximum distance from every node
```

you should immediately think:

```cpp
ecc(u) = max(distA[u], distB[u]);
```

---

# Competitive Programming Applications

The following observations solve a huge number of problems.

## Observation 1

For every node:

```text
FarthestNode(u) ∈ {A, B}
```

where `A` and `B` are diameter endpoints.

---

## Observation 2

Every subtree hanging off the diameter is bounded by the diameter itself.

---

## Observation 3

For every node:

```cpp
ecc(u) = max(distA[u], distB[u]);
```

---

## Observation 4

Many optimization problems can be transformed into questions about distances from the diameter endpoints.

Instead of considering all nodes, we often only need:

```cpp
distA[]
distB[]
```

which can be computed in linear time.

---

# Mental Model

Whenever you encounter a tree problem:

Think of the diameter as the backbone of the tree.

```text
A========================B
      |      |
      |      |
     sub    sub
    tree   tree
```

Everything else hangs off this backbone.

The endpoints `A` and `B` are the extreme points of the tree.

Most distance-related problems eventually reduce to comparing distances to these two nodes.

This single idea is responsible for solving a surprisingly large number of tree problems in competitive programming.
