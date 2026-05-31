---
name: "Segment Tree"
slug: "segment-tree"
category: "tree"
summary: "A binary tree over an array that stores aggregate values (sum, min, max, gcd) for contiguous segments, enabling range queries and point/range updates in logarithmic time."
complexity:
  time:
    "build": "O(n)"
    "range query": "O(log n)"
    "point update": "O(log n)"
    "range update (lazy)": "O(log n)"
  space: "O(n)"
viz: null
---

A segment tree is a balanced binary tree built over an array, where each leaf holds one element and each internal node stores an aggregate (sum, minimum, maximum, GCD, etc.) of the range its subtree covers. The root represents the whole array; its two children split it in half, recursively down to single-element leaves. For an array of n elements it uses O(n) nodes and is typically stored in a flat array of size 2n or 4n with implicit child indexing (2i, 2i+1).

A range query walks down from the root, fully including nodes whose range lies inside the query, recursing into partially overlapping ones, and pruning disjoint ones; only O(log n) nodes are ever touched. Point updates modify one leaf and refresh aggregates along the path back to the root. Range updates use lazy propagation: an update is recorded at the highest covering nodes and pushed down to children only when a later query needs to descend, keeping range modifications logarithmic too.

In practice, the structure matters most where you mix frequent updates with frequent range aggregate queries — a Fenwick (BIT) tree is smaller and faster for plain prefix sums, but segment trees win when you need arbitrary associative operations, range assignment via lazy propagation, or "merge two child results" logic (like counting, max-subarray, or interval coverage) that a BIT can't express.
