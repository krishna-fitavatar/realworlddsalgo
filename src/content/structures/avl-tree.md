---
name: "AVL Tree"
slug: "avl-tree"
category: "tree"
summary: "A self-balancing binary search tree in which the heights of the two child subtrees of every node differ by at most one, maintained via rotations to guarantee logarithmic-time search, insertion, and deletion."
complexity:
  time:
    "search": "O(log n)"
    "insert": "O(log n)"
    "delete": "O(log n)"
    "min/max": "O(log n)"
  space: "O(n)"
viz: null
---

An AVL tree (named after inventors Adelson-Velsky and Landis) is the earliest self-balancing binary search tree. Every node stores a balance factor — the difference between the heights of its left and right subtrees — which is constrained to be -1, 0, or +1. This invariant bounds the tree height to roughly 1.44·log₂(n), guaranteeing logarithmic worst-case performance for lookups, insertions, and deletions, unlike a plain BST that can degenerate into a linked list.

Balance is restored after every mutation. When an insertion or deletion causes a node's balance factor to fall outside [-1, +1], the tree performs one of four rotation cases — left (LL), right (RR), left-right (LR), or right-left (RL) — to redistribute nodes and shrink the offending subtree's height. Rotations are local, O(1) pointer rewrites; at most one rotation (or double rotation) is needed per insertion, while a deletion may trigger rebalancing along the entire path back to the root.

In practice AVL trees are more rigidly balanced than red-black trees, so they yield faster lookups but incur more rotations on write-heavy workloads. This makes them a strong fit for read-dominated, in-memory indexes where search latency matters most; for example, many database and filesystem in-memory structures and language standard libraries choose red-black trees instead precisely because they rebalance less aggressively under frequent mutation.
