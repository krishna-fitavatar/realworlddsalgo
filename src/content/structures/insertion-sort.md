---
name: "Insertion Sort"
slug: "insertion-sort"
category: "sort"
summary: "A comparison sort that builds the sorted output one element at a time by inserting each new element into its correct position within the already-sorted prefix of the array."
complexity:
  time:
    "best": "O(n)"
    "average": "O(n^2)"
    "worst": "O(n^2)"
  space: "O(1)"
viz: null
---

Insertion sort treats the array as two regions: a sorted prefix and an unsorted suffix. It repeatedly takes the first unsorted element and slides it leftward over the sorted prefix, shifting larger elements right, until it reaches a position where the element on its left is no larger. After processing every element, the whole array is sorted.

Each pass does at most as many comparisons and shifts as the number of elements already placed, giving O(n^2) on average and in the worst case (a reverse-sorted input). On already-sorted or nearly-sorted data it runs in O(n) because each element settles after a single comparison. It is in-place (O(1) extra space) and stable, preserving the relative order of equal keys.

In practice its value is not as a standalone sorter for large inputs but as the base case inside hybrid algorithms: Timsort and introsort/quicksort variants switch to insertion sort once a subarray is small (typically under ~16-64 elements), where its low constant factors and cache-friendly sequential access beat the overhead of recursive divide-and-conquer.
