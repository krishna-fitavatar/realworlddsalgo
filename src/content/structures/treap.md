---
name: "Treap"
slug: "treap"
category: "tree"
summary: "A randomized binary search tree that assigns each node a random priority and maintains heap order on priorities while keeping BST order on keys, giving expected O(log n) search, insert, and delete without explicit rebalancing logic."
complexity:
  time:
    "search": "O(log n)"
    "insert": "O(log n)"
    "delete": "O(log n)"
    "split": "O(log n)"
    "merge": "O(log n)"
  space: "O(n)"
viz: null
---

A treap is a binary search tree whose shape is governed by a second, randomly assigned key called a priority. Nodes obey BST ordering on their search keys and simultaneously obey max-heap (or min-heap) ordering on their priorities. Because the priorities are drawn at random, the tree is, with high probability, balanced to expected height O(log n) — the randomness substitutes for the careful invariants of AVL or red-black trees.

Insertion places a node by key as in an ordinary BST, then rotates it upward until its priority satisfies the heap property; deletion rotates the target down to a leaf and removes it. The implementation is short because there is no color bookkeeping or balance-factor tracking — just rotations driven by priority comparisons. Treaps also support split (partition by key) and merge (join two key-disjoint treaps) in expected O(log n), which makes them a natural basis for ordered sequences and persistent/functional variants.

In practice the appeal is simplicity plus a powerful split/merge interface: implicit treaps (keyed by subtree size rather than value) give an array-like structure supporting O(log n) insert-at-index, delete-range, reverse-range, and order-statistics — operations that are awkward in red-black trees. The cost is that bounds are probabilistic, performance depends on a good PRNG, and constant factors are typically worse than a tuned B-tree for cache-bound workloads.
