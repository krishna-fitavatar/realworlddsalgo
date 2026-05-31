---
name: "Selection Sort"
slug: "selection-sort"
category: "sort"
summary: "An in-place comparison sort that repeatedly selects the smallest remaining element and swaps it into its final position, performing at most n-1 swaps regardless of input order."
complexity:
  time:
    "best": "O(n^2)"
    "average": "O(n^2)"
    "worst": "O(n^2)"
    "swaps": "O(n)"
  space: "O(1)"
viz: null
---

Selection sort divides the array into a sorted prefix and an unsorted suffix. On each pass it scans the entire unsorted region to find the minimum (or maximum) element, then swaps that element with the first unsorted slot, growing the sorted prefix by one.

The comparison count is always Θ(n²) — even on already-sorted input — because every pass must scan the full remaining suffix; there is no early-exit shortcut like insertion sort or bubble sort have. What sets it apart is that it makes at most n−1 swaps total, the minimum among the simple quadratic sorts.

In practice selection sort is chosen almost exclusively when writes are far more expensive than reads (e.g. wearing out flash memory or EEPROM cells), because it minimizes the number of element moves. It is otherwise dominated by insertion sort, and the basic version is not stable. It also has no adaptive behavior, so it is rarely used for general-purpose sorting.
