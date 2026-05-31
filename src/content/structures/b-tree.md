---
name: "B-Tree"
slug: "b-tree"
category: "tree"
summary: "A self-balancing search tree that keeps multiple keys per node and stays shallow, minimizing disk/page reads — the backbone of database indexes and filesystems."
complexity:
  time:
    "search": "O(log n)"
    "insert": "O(log n)"
    "delete": "O(log n)"
  space: "O(n)"
viz: null
---

A B-Tree is a balanced search tree generalized so that each node holds many keys (between t-1 and 2t-1 for a minimum degree t) and many children, rather than just one key and two children like a binary search tree. All leaves sit at the same depth, so the tree is always perfectly height-balanced. Because each node packs a large, contiguous block of keys, the tree stays extremely shallow even for billions of entries — typically just 3-4 levels.

Search, insertion, and deletion all walk from root to leaf in O(log n) time, but the constant factor is what matters: the high fan-out means the base of the logarithm is large (hundreds or thousands), so the number of levels is tiny. Insertion splits a full node before descending; deletion merges or borrows from siblings to keep nodes at least half-full. A common variant, the B+Tree, stores all values in the leaves and links them, making range scans a sequential leaf traversal.

In practice the B-Tree's defining win is that one node maps to one disk page or block, so traversing the tree costs the minimum number of I/O operations — the dominant cost when data lives on disk or SSD. This is why virtually every relational database index (PostgreSQL, MySQL/InnoDB, SQLite) and several filesystems (Btrfs, XFS) are built on B-Trees or B+Trees rather than in-memory binary trees.
