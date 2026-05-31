---
name: "Queue"
slug: "queue"
category: "linear"
summary: "A queue is a linear, first-in-first-out (FIFO) collection where elements are added at the back and removed from the front, with both operations running in constant time."
complexity:
  time:
    "enqueue": "O(1)"
    "dequeue": "O(1)"
    "peek": "O(1)"
    "search": "O(n)"
  space: "O(n)"
viz: null
---

A **queue** is a linear data structure that enforces first-in-first-out (FIFO) ordering: the element that has been waiting longest is the next one served. The two core operations are *enqueue* (append to the tail) and *dequeue* (remove from the head), mirroring a line of people waiting their turn.

Queues are typically backed by either a singly linked list with head and tail pointers, or a circular buffer over a fixed-size array. Both give O(1) enqueue and dequeue. A naive array implementation that shifts every element on dequeue degrades to O(n); the circular-buffer trick (advancing head/tail indices modulo capacity) avoids this and is what most production ring buffers use.

In practice, queues are the backbone of decoupling producers from consumers: task schedulers, message brokers, breadth-first search frontiers, and request buffers all rely on FIFO semantics. The detail that matters most is bounded capacity and backpressure — an unbounded queue under a fast producer and slow consumer will exhaust memory, so real systems cap size and either block, drop, or reject when full.
