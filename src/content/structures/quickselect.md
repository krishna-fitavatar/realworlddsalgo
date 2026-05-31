---
name: "Quickselect"
slug: "quickselect"
category: "search"
summary: "Quickselect finds the k-th smallest element of an unordered list in expected O(n) time by partitioning around a pivot and recursing into only the side that contains the target rank."
complexity:
  time:
    "average": "O(n)"
    "best": "O(n)"
    "worst": "O(n^2)"
  space: "O(1)"
viz: null
---

Quickselect is a selection algorithm that returns the element that would sit at index k if the array were sorted, without paying the full O(n log n) cost of sorting. It was devised by Tony Hoare and shares its partitioning core with quicksort, which is why it is sometimes called Hoare's selection algorithm.

It works by choosing a pivot and partitioning the array so that elements smaller than the pivot come before it and larger ones come after. After partitioning, the pivot lands at its final sorted position p. If p equals k the search is done; otherwise the algorithm recurses into just the single subarray that must contain rank k, discarding the other half. Because each step processes only one partition, the expected work shrinks geometrically to O(n), versus quicksort's O(n log n).

In practice the pivot choice is everything: a naive or adversarial pivot degrades to O(n^2). Real implementations use randomized pivots or the median-of-medians rule (introselect) to guarantee linear worst-case behavior; this is exactly why C++ std::nth_element and similar library routines are built on quickselect rather than partial sorts.
