---
name: "Quick Sort"
slug: "quick-sort"
category: "sort"
summary: "A divide-and-conquer comparison sort that partitions an array around a pivot element so smaller items go left and larger go right, then recursively sorts each partition in place."
complexity:
  time:
    "best": "O(n log n)"
    "average": "O(n log n)"
    "worst": "O(n^2)"
  space: "O(log n)"
viz: null
---

Quick Sort is an in-place, divide-and-conquer comparison sort. It chooses a pivot element, partitions the array so that everything less than the pivot precedes it and everything greater follows it, then recursively applies the same procedure to the two sub-partitions. The partition step is where the actual sorting work happens; the recursion merely positions pivots.

The algorithm's performance hinges entirely on pivot choice. Balanced partitions give the O(n log n) average case, but a consistently bad pivot (e.g., always the smallest element on already-sorted input) degrades it to O(n^2). Real implementations mitigate this with median-of-three or randomized pivots, and switch to insertion sort for small partitions. It is not stable and recurses to O(log n) stack depth when the smaller side is recursed first.

In practice Quick Sort is the default in-memory sort in many standard libraries precisely because its small constant factors and cache-friendly sequential access make it faster than O(n log n) competitors like merge sort. Production libraries typically use introsort, a hybrid that starts with Quick Sort and falls back to heap sort once recursion depth exceeds a threshold, guaranteeing O(n log n) worst case while keeping Quick Sort's typical speed.
