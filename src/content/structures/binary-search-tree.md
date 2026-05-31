---
name: Binary Search Tree
slug: binary-search-tree
category: tree
summary: An ordered tree where every left descendant is smaller and every right descendant is larger, giving logarithmic search, insert, and delete when balanced.
complexity:
  time:
    search: O(log n) avg / O(n) worst
    insert: O(log n) avg / O(n) worst
    delete: O(log n) avg / O(n) worst
  space: O(n)
viz: BstViz
source:
  lang: ts
  module: bst.ts
---

A binary search tree keeps elements in sorted order by invariant: for any node,
everything in its left subtree is smaller and everything in its right subtree is
larger. That ordering is what makes lookup a series of left/right decisions
instead of a linear scan.

The catch is balance. A naive BST built from already-sorted input degrades into
a linked list — `O(n)` per operation. Real systems therefore use **self-balancing**
variants (red-black trees, AVL trees) that rotate on insert/delete to keep height
at `O(log n)`. The visualization below shows plain insertion so you can see the
ordering invariant directly; production code adds the rebalancing on top.
