---
name: "Z-Algorithm"
slug: "z-algorithm"
category: "string"
summary: "The Z-Algorithm computes, for a string, the length of the longest substring starting at each position that matches a prefix of the string, enabling linear-time exact pattern matching and many string-analysis tasks."
complexity:
  time:
    "build (Z-array)": "O(n)"
    "pattern search": "O(n + m)"
  space: "O(n)"
viz: null
---

The Z-Algorithm produces the **Z-array** of a string `s`, where `Z[i]` is the length of the longest substring starting at index `i` that is also a prefix of `s`. For pattern matching you concatenate `pattern + separator + text` and scan for positions where `Z[i]` equals the pattern length — each such position marks an exact occurrence.

It runs in linear time by maintaining a **Z-box**: the interval `[l, r]` with the rightmost endpoint that matches a prefix seen so far. When computing `Z[i]` inside the current box, the algorithm reuses the already-known value `Z[i - l]` to skip comparisons, only extending past `r` with explicit character matching. Because `r` never moves backward and total extension work is bounded by the string length, the whole pass is O(n).

In practice the Z-Algorithm is valued for being simpler to implement and reason about than KMP's failure function while solving the same exact-match problem, and its Z-array directly answers richer questions: counting distinct recurring prefixes, finding string periods, and feeding suffix-automaton constructions. The one gotcha is choosing a separator character guaranteed not to appear in either pattern or text, so a spurious match never spans the boundary.
