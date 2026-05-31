---
name: "Skip List"
slug: "skip-list"
category: "other"
summary: "A probabilistic, layered linked list that maintains sorted order and supports search, insertion, and deletion in expected O(log n) time by adding express lanes that let traversals skip over many nodes at once."
complexity:
  time:
    "search": "O(log n)"
    "insert": "O(log n)"
    "delete": "O(log n)"
    "space": "O(n)"
  space: "O(n)"
viz: null
---

A skip list is an ordered, multi-level linked list invented by William Pugh in 1989 as a simpler probabilistic alternative to balanced trees. The bottom level (level 0) is an ordinary sorted linked list containing every element; each higher level is a sparser "express lane" that links a randomly chosen subset of the nodes below it, so a search can drop down levels and skip past large runs of elements.

When a node is inserted, its height is chosen randomly — typically with probability p = 1/2 of being promoted to each successive level — which keeps roughly half the nodes at level 1, a quarter at level 2, and so on. A search starts at the topmost level of the head node, moves right until the next node would overshoot the target, then drops down a level and repeats. Because the expected number of levels is O(log n) and each level traverses a constant expected number of nodes, search, insert, and delete are all expected O(log n).

In practice the appeal of skip lists is implementation simplicity and concurrency: there is no rotation or rebalancing logic as in red-black or AVL trees, and lock-free / fine-grained-locking concurrent variants are far easier to build correctly. This is why Java's ConcurrentSkipListMap and Redis's sorted-set type use skip lists rather than balanced trees. The trade-off is that the bounds are probabilistic (worst case is O(n), though astronomically unlikely) and per-node pointer overhead is higher than a flat array.
