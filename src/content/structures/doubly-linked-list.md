---
name: "Doubly Linked List"
slug: "doubly-linked-list"
category: "linear"
summary: "A linear list of nodes where each node holds pointers to both its predecessor and successor, enabling O(1) insertion and removal at either end and bidirectional traversal without re-scanning from the head."
complexity:
  time:
    "access": "O(n)"
    "search": "O(n)"
    "insert_at_known_node": "O(1)"
    "delete_at_known_node": "O(1)"
    "push_front": "O(1)"
    "push_back": "O(1)"
  space: "O(n)"
viz: null
---

A doubly linked list stores elements in separate node objects, each carrying the element plus two links: `prev` to the previous node and `next` to the next. The list itself usually keeps references to both the head and the tail, so operations can start from either end. Unlike an array, nodes are not contiguous in memory, so there is no constant-time indexing — reaching the k-th element requires walking the chain.

The defining advantage is the back-pointer: given a reference to any node, you can splice it out or insert beside it in O(1) by rewiring four pointers (the neighbors' `next`/`prev` and the new node's links), with no need to first traverse to find the predecessor. This is why it backs LRU caches, scheduler run-queues, and any structure that hands out node handles and later removes them in arbitrary order. A sentinel/dummy head-tail node is a common implementation trick that eliminates null-checks at the boundaries.

In practice the cost is memory and locality: two pointers per node plus allocator overhead, and traversal that thrashes the cache because nodes are scattered. Prefer a doubly linked list only when you genuinely need O(1) removal from the middle via a held reference or stable iterators that survive insertions/deletions; otherwise a dynamic array (vector) is usually faster despite worse asymptotic bounds for middle operations.
