---
name: "Linked List"
slug: "linked-list"
category: "linear"
summary: "A linked list is a linear sequence of nodes where each node holds a value plus one or more pointers to neighboring nodes, allowing O(1) insertion and deletion at a known position without shifting elements."
complexity:
  time:
    "access": "O(n)"
    "search": "O(n)"
    "insert-at-head": "O(1)"
    "insert-after-node": "O(1)"
    "delete-at-head": "O(1)"
    "delete-node": "O(1)"
  space: "O(n)"
viz: null
---

A linked list stores a sequence as a chain of separately allocated nodes. Each node carries its payload and a reference to the next node (singly linked); a doubly linked list adds a back-pointer to the previous node, and a circular list connects the tail back to the head. Unlike an array, elements are not stored contiguously, so there is no random access by index.

Operations work by pointer manipulation. Inserting or deleting once you hold a reference to the relevant node is O(1) — you simply rewire a constant number of `next`/`prev` pointers, with no element shifting. The cost is locating that position: reaching the k-th element or searching for a value requires walking the chain from a known end, which is O(n). Each node also incurs the memory overhead of its pointer fields.

In practice the decisive property is stable O(1) splicing: you can remove or move a node, or merge two lists, without touching the rest of the structure or invalidating references to other nodes. This is why intrusive doubly linked lists are pervasive in systems code — LRU caches, kernel scheduler run-queues, and free-block lists all need to unlink an arbitrary element in constant time. When you mostly index or scan sequentially, a dynamic array is faster and far more cache-friendly, since linked-list traversal chases pointers across scattered memory.
