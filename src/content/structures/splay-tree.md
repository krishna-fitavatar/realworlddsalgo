---
name: "Splay Tree"
slug: "splay-tree"
category: "tree"
summary: "A self-adjusting binary search tree that moves every accessed node to the root via rotations, giving O(log n) amortized operations and fast repeated access to recently used keys."
complexity:
  time:
    "search": "O(log n) amortized"
    "insert": "O(log n) amortized"
    "delete": "O(log n) amortized"
    "access": "O(log n) amortized"
  space: "O(n)"
viz: null
---

A splay tree is a binary search tree with no explicit balance metadata (no colors, no height fields). After every access, insert, or delete, the touched node is "splayed" to the root through a sequence of rotations, restructuring the tree so frequently and recently used keys stay near the top.

Splaying uses three rotation cases applied bottom-up: zig (node's parent is the root), zig-zig (node and parent are both left or both right children), and zig-zag (one left, one right). This pairwise restructuring is what guarantees O(log n) amortized cost per operation even though a single operation can be O(n) on a degenerate tree, and it gives splay trees strong working-set and static-optimality properties.

In practice the win is locality: workloads with skewed access patterns (a few hot keys among many) run faster than on a strictly balanced tree because hot keys sit shallow. The tradeoffs are that even read-only lookups mutate the structure (hostile to concurrent readers and cache lines) and worst-case single operations are linear, so they suit single-threaded, access-skewed uses like caches, the BSD kernel's generic tree containers, and rope/text-buffer indexes rather than latency-bounded systems.
