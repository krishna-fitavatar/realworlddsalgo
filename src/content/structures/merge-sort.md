---
name: "Merge Sort"
slug: "merge-sort"
category: "sort"
summary: "A stable, divide-and-conquer comparison sort that recursively splits an array in half, sorts each half, and merges them in linear time, guaranteeing O(n log n) worst-case performance."
complexity:
  time:
    "best": "O(n log n)"
    "average": "O(n log n)"
    "worst": "O(n log n)"
  space: "O(n)"
viz: null
---

Merge sort is a comparison-based sorting algorithm built on the divide-and-conquer paradigm. It recursively divides the input array into two halves until each subarray holds a single element, then merges those subarrays back together in sorted order. Because every level of recursion touches all n elements and there are log n levels, the running time is O(n log n) in the best, average, and worst cases alike.

The merge step is the heart of the algorithm: given two already-sorted subarrays, it walks both with two pointers, repeatedly copying the smaller front element into an output buffer, producing a single sorted sequence in linear time. By always taking the left element on ties, merge sort is stable, preserving the relative order of equal keys.

In practice, the two things that matter are its guaranteed O(n log n) bound and its stability, which make it the basis of library sorts like Python's Timsort and Java's `Arrays.sort` for objects. The cost is O(n) auxiliary memory for the merge buffer, so cache-unfriendly behavior and extra allocation are why quicksort is often preferred for in-memory primitive arrays, while merge sort dominates external sorting of data too large to fit in RAM.
