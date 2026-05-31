---
name: "Prefix Sum"
slug: "prefix-sum"
category: "other"
summary: "A precomputed cumulative-sum array (prefix[i] = sum of the first i elements) that answers any contiguous range-sum query in constant time after a single linear-time build pass."
complexity:
  time:
    "build": "O(n)"
    "range query": "O(1)"
    "point update (static array)": "O(n)"
  space: "O(n)"
viz: null
---

A prefix sum (also called a cumulative sum or scan) is an auxiliary array where each entry holds the running total of all elements up to that index. Given an array `a`, you build `prefix` such that `prefix[i] = a[0] + a[1] + ... + a[i-1]`, with `prefix[0] = 0`. This single O(n) pass turns the array into a structure that answers questions about any contiguous segment without re-scanning it.

The key identity is that the sum of `a[l..r]` equals `prefix[r+1] - prefix[l]`. Because each range query reduces to one subtraction, you trade O(n) preprocessing and O(n) extra memory for O(1) lookups. The same idea generalizes to 2D (integral images / summed-area tables) where a rectangle sum is computed from four corner values, and to any associative operation via the parallel-friendly inclusive/exclusive scan primitive.

In practice the win is amortization: prefix sums only pay off when you issue many queries against data that does not change, since any element update invalidates the suffix of the table and forces an O(n) rebuild. When values mutate between queries, reach for a Fenwick (binary indexed) tree or segment tree instead, which keep both updates and queries logarithmic.
