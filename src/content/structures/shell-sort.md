---
name: "Shell Sort"
slug: "shell-sort"
category: "sort"
summary: "Shell sort is an in-place comparison sort that generalizes insertion sort by comparing and exchanging elements separated by a diminishing gap, letting items move long distances early so the final gap-1 pass faces a nearly sorted array."
complexity:
  time:
    "best": "O(n log n)"
    "average": "depends on gap sequence (e.g. O(n^1.25) to O(n^1.5))"
    "worst": "O(n^2) (or O(n log^2 n) with Ciura/Pratt-style gaps)"
  space: "O(1)"
viz: null
---

Shell sort, invented by Donald Shell in 1959, is an in-place comparison sort that extends insertion sort. Plain insertion sort only swaps adjacent elements, so an item far from its sorted position needs many one-step moves. Shell sort fixes this by sorting elements that are a fixed *gap* apart, then repeatedly shrinking the gap until it reaches 1.

For each gap value `h`, the algorithm performs an insertion sort on every interleaved subsequence of elements `h` positions apart (an "h-sort"). Large gaps let out-of-place elements jump most of the way to their destination cheaply; by the time the gap is 1, the array is already almost ordered, so the final ordinary insertion-sort pass does little work. The whole sort runs in constant extra space.

The one thing that matters in practice is the gap sequence: it dominates performance and is the only real tuning knob. Shell's original `n/2, n/4, ...` sequence degrades to O(n^2), while Ciura's empirically tuned gaps (1, 4, 10, 23, 57, 132, 301, 701) or Sedgewick's sequences give the best measured results. Because it is simple, in-place, non-recursive, and has no large constant overhead, shell sort is a common choice in embedded systems, bootloaders, and small libraries (such as uClibc's qsort) where code size and stack usage matter more than asymptotic optimality.
