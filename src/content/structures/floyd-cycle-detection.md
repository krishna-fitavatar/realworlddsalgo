---
name: "Floyd's Cycle Detection (Tortoise & Hare)"
slug: "floyd-cycle-detection"
category: "other"
summary: "A two-pointer algorithm that detects a cycle in a sequence or linked structure by advancing one pointer one step and another two steps per iteration; if they ever meet, a cycle exists, using only constant extra memory."
complexity:
  time:
    "detect cycle": "O(n)"
    "find cycle start": "O(n)"
    "find cycle length": "O(n)"
  space: "O(1)"
viz: null
---

Floyd's cycle detection, popularly called the tortoise and hare algorithm, finds whether a sequence defined by repeatedly applying a "next" function eventually repeats. It runs two pointers through the same sequence: the tortoise advances one node per step, the hare advances two. If the structure terminates (reaches null), there is no cycle; if a cycle exists, the faster hare laps the tortoise and they collide at the same node.

The collision guarantees a cycle but not its starting point. To find where the loop begins, reset one pointer to the head and advance both pointers one step at a time; they meet exactly at the cycle's entry node (a consequence of the modular distance arithmetic between the start, the cycle entry, and the meeting point). Cycle length is then found by counting steps for one pointer to circle back to the meeting node.

The thing that matters in practice is the O(1) space: unlike a hash-set "have I seen this node?" approach, Floyd's needs no auxiliary storage, which is why it shows up in linked-list cycle checks, detecting infinite loops in iterator/pointer chains, pseudorandom-sequence period finding (Pollard's rho factorization), and validating that "next"-style references in serialized data don't form unexpected loops.
