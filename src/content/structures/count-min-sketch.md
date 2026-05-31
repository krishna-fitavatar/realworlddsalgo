---
name: "Count-Min Sketch"
slug: "count-min-sketch"
category: "hash"
summary: "A probabilistic, sublinear-space data structure that estimates the frequency of items in a stream using multiple hash functions and a 2D counter array, returning counts that never underestimate and overestimate only by a bounded error."
complexity:
  time:
    "update": "O(d)"
    "query": "O(d)"
  space: "O(w*d)"
viz: null
---

A Count-Min Sketch (CMS) is a compact, hash-based summary for estimating how often each item appears in a data stream, trading exact accuracy for fixed sublinear memory. It is the counting analog of a Bloom filter: instead of one bit array it keeps a `d x w` table of integer counters and `d` pairwise-independent hash functions, one per row, with the dimensions chosen from the target error `epsilon` and failure probability `delta` (`w = ceil(e/epsilon)`, `d = ceil(ln(1/delta))`).

To update item `x` by count `c`, you hash `x` with each row's function and add `c` to the cell `(i, h_i(x))` for every row `i`. To query the frequency of `x`, you read those same `d` cells and return the minimum. Because hash collisions can only push a counter up, the minimum is never below the true count; the "min" cancels most collision noise, bounding the overestimate by `epsilon * N` (where `N` is the total mass) with probability `1 - delta`. Both operations touch exactly `d` cells, so they run in O(d) time independent of stream length.

In practice CMS shines for heavy-hitter and top-k tracking over high-cardinality streams where keeping an exact per-key counter is too expensive — telemetry, network flow accounting, NLP n-gram counts, and database query planners. The thing to watch is the one-sided error: counts are biased upward and low-frequency items suffer the most relative error, so it is unsuitable when you need exact or under-estimating counts, and skewed data may require a conservative-update variant or a larger `w` to keep collisions tolerable.
