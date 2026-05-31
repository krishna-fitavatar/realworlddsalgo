---
name: "Union-Find (Disjoint Set)"
slug: "union-find"
category: "graph"
summary: "A disjoint-set forest that tracks elements partitioned into non-overlapping groups, supporting near-constant-time union of two groups and find of which group an element belongs to."
complexity:
  time:
    "find": "O(α(n))"
    "union": "O(α(n))"
    "makeSet": "O(1)"
  space: "O(n)"
viz: null
---

Union-Find (a Disjoint Set Union, or DSU) maintains a collection of disjoint sets over `n` elements and answers two questions fast: which set does element `x` belong to (`find`), and merge the sets containing `x` and `y` (`union`). Each set is represented as a tree where every node points to a parent, and the root acts as the canonical representative of the set; two elements are in the same set iff they share a root.

Two optimizations make it efficient. *Path compression* flattens the tree during `find` by re-pointing visited nodes directly at the root, and *union by rank/size* always attaches the smaller tree under the larger one to keep trees shallow. Applied together, the amortized cost per operation is O(α(n)), where α is the inverse Ackermann function — effectively a small constant (≤ 5) for any practical input.

In practice DSU is the backbone of Kruskal's minimum-spanning-tree algorithm, detecting cycles in undirected graphs, and counting/merging connected components incrementally as edges arrive. The one gotcha: it does not support efficient deletion or splitting of sets — it is fundamentally an incremental merge structure, so problems requiring edge removal usually need offline tricks (process queries in reverse) or a different data structure.
