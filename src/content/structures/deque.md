---
name: "Deque"
slug: "deque"
category: "linear"
summary: "A double-ended queue that supports amortized O(1) insertion and removal at both the front and the back, generalizing both stacks and FIFO queues."
complexity:
  time:
    "push_front": "O(1)"
    "push_back": "O(1)"
    "pop_front": "O(1)"
    "pop_back": "O(1)"
    "peek_front": "O(1)"
    "peek_back": "O(1)"
    "random_access": "O(1)"
    "search": "O(n)"
  space: "O(n)"
viz: null
---

A deque (double-ended queue, pronounced "deck") is a linear sequence that allows elements to be added or removed efficiently from both ends. It subsumes the stack (LIFO) and queue (FIFO) abstractions: by restricting operations to one end you get a stack, and by pushing on one end while popping the other you get a queue.

Implementations typically take one of two forms. A doubly linked list gives true O(1) insertion and removal at both ends with no resizing, at the cost of a pointer pair per node and poor cache locality. The more common high-performance approach, used by CPython's `collections.deque` and C++'s `std::deque`, is a block (chunked) array: a sequence of fixed-size buffers tracked by an index, giving O(1) amortized end operations plus reasonable cache behavior and, in the C++ case, O(1) indexed access.

In practice the deciding factor is whether you need fast random access. A linked-list deque is fine for pure FIFO/LIFO workloads (work queues, BFS frontiers, sliding-window algorithms), but if you also index into the middle, a block-array deque like `std::deque` is the right choice. Be aware that growing a block-array deque can invalidate iterators even when references to elements stay valid.
