---
name: "Sliding Window"
slug: "sliding-window"
category: "other"
summary: "A technique that maintains a contiguous sub-range over a sequence and incrementally updates an aggregate as the range's two ends advance, turning many naive O(n*k) scans into a single O(n) pass."
complexity:
  time:
    "fixed-size window scan": "O(n)"
    "variable-size (two-pointer) scan": "O(n)"
    "naive recomputation (no window)": "O(n*k)"
  space: "O(1) for sums/counts, O(k) when tracking window contents (e.g. a hash map or deque)"
viz: null
---

The sliding window technique processes a contiguous segment of an array, string, or time series by moving two boundaries (a left and right index) across the data instead of recomputing each candidate segment from scratch. As the window expands or slides, you add the element entering on the right and subtract the element leaving on the left, so the running aggregate (sum, count, max, distinct-character set) is maintained in O(1) amortized work per step.

There are two common forms. A fixed-size window slides one element at a time and is ideal for problems like "max sum of any k consecutive elements" or a moving average. A variable-size window grows the right edge until a constraint is violated, then shrinks the left edge to restore it; this solves "longest substring without repeating characters" or "smallest subarray with sum >= target." Auxiliary structures often ride along: a hash map for counts, or a monotonic deque to track the window's max/min in amortized O(1).

In practice the technique only stays O(n) if every element enters and leaves the window at most once — the classic bug is re-scanning the window on each shift, which silently reverts to O(n*k). It shows up far beyond interview problems: rate limiters bucket requests into time windows, network protocols use sliding windows for flow control, and monitoring systems (Prometheus rate(), moving averages) evaluate functions over a trailing time window.
