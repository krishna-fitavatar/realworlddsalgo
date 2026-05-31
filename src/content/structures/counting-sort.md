---
name: "Counting Sort"
slug: "counting-sort"
category: "sort"
summary: "A non-comparison integer sorting algorithm that counts occurrences of each key value and uses prefix sums to place elements in sorted order in linear time when the key range is bounded."
complexity:
  time:
    "best": "O(n + k)"
    "average": "O(n + k)"
    "worst": "O(n + k)"
  space: "O(n + k)"
viz: null
---

Counting sort is a non-comparison sorting algorithm for integers (or items with small integer keys) drawn from a known, bounded range `[0, k)`. Instead of comparing elements, it determines each element's final position by counting how many keys are less than or equal to it, so it sidesteps the `O(n log n)` lower bound that applies to comparison sorts.

The algorithm runs in three passes: first it tallies the frequency of every key into a count array of size `k`; then it converts those counts into prefix sums so `count[v]` becomes the number of elements with key `<= v`; finally it scans the input (typically right-to-left to preserve stability) and places each element into its output slot, decrementing the corresponding count. Total work is `O(n + k)` time and `O(n + k)` space.

In practice the deciding factor is the key range `k`. Counting sort is excellent when `k = O(n)` — for example sorting bytes, ages, or grades — but degrades badly when `k` is large relative to `n` because both time and the count array grow with `k`. It is also the stable subroutine that powers each digit pass of radix sort, which is where it sees the most real-world use.
