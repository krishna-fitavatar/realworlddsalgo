---
name: "Bubble Sort"
slug: "bubble-sort"
category: "sort"
summary: "A comparison sort that repeatedly steps through a list, swapping adjacent out-of-order elements so that larger values \"bubble\" to the end on each pass until no swaps remain."
complexity:
  time:
    "best": "O(n)"
    "average": "O(n^2)"
    "worst": "O(n^2)"
  space: "O(1)"
viz: null
---

Bubble sort is the simplest comparison-based sorting algorithm. It works in place by scanning the array from left to right, comparing each adjacent pair of elements and swapping them when they are out of order. After the first full pass the largest element has been pushed to the final position; the process repeats over the shrinking unsorted prefix until a pass completes with zero swaps.

Mechanically it is a pair of nested loops: the outer loop counts passes and the inner loop performs the adjacent comparisons and swaps. An early-exit flag that detects a swap-free pass gives it a best case of O(n) on already-sorted input, but the average and worst cases are O(n^2). It is a stable sort and uses only O(1) auxiliary space.

In practice bubble sort is almost never used for real workloads — quicksort, mergesort, or insertion sort dominate even at small sizes. Its value is pedagogical: it is the canonical first example for teaching loops, comparisons, swaps, and the difference between best- and worst-case analysis. Reach for insertion sort instead when you genuinely need a tiny, simple, stable sort.
