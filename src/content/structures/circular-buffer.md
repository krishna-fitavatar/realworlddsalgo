---
name: "Circular Buffer (Ring Buffer)"
slug: "circular-buffer"
category: "linear"
summary: "A circular buffer is a fixed-size array treated as connected end-to-end, using head and tail indices that wrap modulo capacity to give O(1) enqueue and dequeue without shifting elements or reallocating."
complexity:
  time:
    "push (enqueue)": "O(1)"
    "pop (dequeue)": "O(1)"
    "peek": "O(1)"
    "search": "O(n)"
  space: "O(n)"
viz: null
---

A circular buffer (or ring buffer) is a FIFO queue backed by a fixed-size contiguous array whose ends are logically joined. Two indices, a read/tail position and a write/head position, advance through the array and wrap back to zero when they pass the end, so the structure reuses the same memory cells cyclically rather than growing.

Enqueue writes at the head and increments it modulo capacity; dequeue reads from the tail and increments it the same way. Fullness and emptiness are distinguished either by keeping a separate count, by leaving one slot unused, or by tracking absolute (non-wrapped) sequence numbers and masking on access. When capacity is a power of two, the wrap can be done with a cheap bitwise AND instead of a modulo, which is a common optimization in hot paths.

In practice the defining property is bounded, allocation-free operation: once sized, the buffer never touches the allocator, which is exactly what hard-real-time, audio, networking, and kernel-tracing code need. A single-producer/single-consumer ring can also be made lock-free using only atomic loads/stores on the two indices with appropriate memory ordering, avoiding mutexes entirely. The tradeoff is the fixed capacity — a full buffer must either block, reject writes, or overwrite the oldest data.
