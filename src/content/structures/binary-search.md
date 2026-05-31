---
name: "Binary Search"
slug: "binary-search"
category: "search"
summary: "Binary search locates a target in a sorted array by repeatedly halving the search interval, achieving O(log n) lookups instead of O(n) linear scanning."
complexity:
  time:
    "search": "O(log n)"
    "insertion_point": "O(log n)"
    "worst_case": "O(log n)"
  space: "O(1)"
viz: null
---

Binary search is a divide-and-conquer algorithm that finds the position of a target value within a **sorted** sequence. It assumes the data is ordered and exploits that ordering to discard half of the remaining candidates at every step, turning a linear scan into a logarithmic one.

It works by tracking a `[lo, hi]` window over the array. Each iteration computes the midpoint, compares the element there against the target, and then keeps either the left or right half depending on whether the midpoint is too large or too small. The window shrinks geometrically, so after at most ⌈log2(n)⌉ comparisons the element is found or the window is empty. A common generalization is finding an insertion point (`lower_bound`/`bisect`), which returns where a key would go to keep the array sorted.

The one thing that matters in practice: correctness lives in the boundary conditions. Computing the midpoint as `lo + (hi - lo) / 2` avoids integer overflow (the bug that lurked in `java.util.Arrays.binarySearch` for years), and getting the half-open vs. closed interval invariants right is what separates a working implementation from an off-by-one infinite loop. Beyond array lookups, the same halving logic powers "binary search on the answer" for monotonic predicates.
