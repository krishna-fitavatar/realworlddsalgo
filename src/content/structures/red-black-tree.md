---
name: "Red-Black Tree"
slug: "red-black-tree"
category: "tree"
summary: "A self-balancing binary search tree that tags each node red or black and enforces color invariants on insertion and deletion to guarantee the longest root-to-leaf path is at most twice the shortest, keeping operations O(log n)."
complexity:
  time:
    "search": "O(log n)"
    "insert": "O(log n)"
    "delete": "O(log n)"
    "min/max": "O(log n)"
    "predecessor/successor": "O(log n)"
  space: "O(n)"
viz: null
---

A red-black tree is a binary search tree where every node carries one extra bit of color information (red or black). Five invariants are maintained: the root is black, leaves (NIL sentinels) are black, red nodes have only black children, and every path from a given node to its descendant leaves contains the same number of black nodes. Together these guarantee that no path is more than twice as long as any other, so the tree height stays O(log n).

After a standard BST insert or delete, the structure may violate the color rules. The tree restores balance through a bounded sequence of recolorings and rotations (left/right), of which there are O(1) rotations per insert and O(1) amortized recolorings, all driven by examining the node's parent, uncle, and grandparent. Because rebalancing touches only a logarithmic-length path and performs constant work per level, every mutation is O(log n) in the worst case.

In practice red-black trees are the workhorse behind ordered in-memory maps and sets because they offer worst-case (not just amortized) logarithmic bounds with relatively few rotations on update, making them cheaper to mutate than AVL trees. They back the Linux kernel scheduler and virtual-memory area tracking, the C++ std::map/std::set, and Java's TreeMap/TreeSet. The main trade-off versus AVL trees is slightly looser balance, which means marginally slower lookups in exchange for faster inserts and deletes.
