---
name: "Binary Heap"
slug: "binary-heap"
category: "tree"
summary: "A binary heap is a complete binary tree stored in an array that maintains the heap property—every parent dominates its children—giving O(1) access to the min or max element and O(log n) insertion and removal."
complexity:
  time:
    "peek": "O(1)"
    "insert": "O(log n)"
    "extract-min/max": "O(log n)"
    "decrease-key": "O(log n)"
    "build-heap": "O(n)"
    "search": "O(n)"
  space: "O(n)"
viz: null
---

A binary heap is a complete binary tree—every level is full except possibly the last, which fills left to right—that satisfies the heap property: in a min-heap every node is less than or equal to its children, in a max-heap greater than or equal. Because the tree is complete, it is stored implicitly in a flat array with no pointers: the children of index `i` live at `2i+1` and `2i+2`, and the parent at `(i-1)/2`.

Operations restore the heap property by swapping elements along a single root-to-leaf path. `insert` appends to the end and "sift-up" the new element until its parent dominates it; `extract` swaps the root with the last element, removes it, and "sift-down" the new root. Each path has height O(log n), so both cost O(log n) while peeking at the extremum is O(1). Building a heap from an unordered array bottom-up is O(n), not O(n log n), because most nodes sit near the leaves.

The one thing that matters in practice: a binary heap is the canonical priority queue. It powers Dijkstra's and Prim's shortest-path/MST algorithms, event-driven simulations, OS task schedulers, timer/timeout management, and heapsort. It does not support efficient search or ordered iteration—if you need to find or delete an arbitrary element quickly you also need an index map, or you should reach for a balanced BST instead.
