---
name: "Fenwick Tree (Binary Indexed Tree)"
slug: "fenwick-tree"
category: "tree"
summary: "A Fenwick tree is an array-backed structure that maintains prefix sums (or any invertible group operation) over a sequence, supporting both point updates and prefix-range queries in O(log n) time."
complexity:
  time:
    "point_update": "O(log n)"
    "prefix_query": "O(log n)"
    "range_query": "O(log n)"
    "build": "O(n)"
    "space": "O(n)"
  space: "O(n)"
viz: null
---

A Fenwick tree, or Binary Indexed Tree (BIT), is a flat array of size n+1 that answers cumulative (prefix-sum) queries and applies point updates, both in O(log n) time. It is far simpler and more cache-friendly than a segment tree for the common case of prefix aggregation, using only a single array and bit arithmetic rather than an explicit tree of nodes.

The mechanism rests on the lowest set bit. Each index `i` is responsible for a range of `i & (-i)` elements ending at `i`. To query a prefix sum up to index `i`, you accumulate `tree[i]` then strip the lowest set bit (`i -= i & -i`) and repeat until zero. To update, you add the delta to `tree[i]` then move upward via `i += i & -i`. Both loops touch at most log n cells. An in-place O(n) build propagates each cell to its parent in one linear pass.

In practice the key constraint is that the operation must be invertible to get arbitrary range queries: a range [l, r] sum is `prefix(r) - prefix(l-1)`, which works for addition but not for min/max — use a segment tree for those. Fenwick trees are 1-indexed by convention (index 0 is a sentinel), and a "range-update + point-query" variant uses a difference array, while range-update + range-query needs two BITs.
