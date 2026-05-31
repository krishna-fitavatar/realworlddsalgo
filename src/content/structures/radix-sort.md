---
name: "Radix Sort"
slug: "radix-sort"
category: "sort"
summary: "A non-comparison sorting algorithm that orders integers (or fixed-length keys) by processing them digit by digit, using a stable counting sort as a subroutine for each digit position."
complexity:
  time:
    "best": "O(d*(n+b))"
    "average": "O(d*(n+b))"
    "worst": "O(d*(n+b))"
  space: "O(n+b)"
viz: null
---

Radix sort is a non-comparison-based integer sorting algorithm. Instead of comparing keys directly, it distributes elements into buckets according to the value of individual digits, sharing the same significant position. Because it sidesteps the comparison lower bound of O(n log n), it can sort fixed-width keys in linear time relative to the number of elements.

The common LSD (least significant digit) variant makes one pass per digit, from the least to the most significant. Each pass uses a stable counting sort over the radix `b` (e.g., base 10 or base 256), which preserves the relative order established by earlier, less significant digits. After `d` passes — where `d` is the number of digits in the largest key — the array is fully sorted. An MSD variant works from the most significant digit and recurses, which suits variable-length keys like strings.

In practice the key insight is that radix sort only wins when `d` is small and bounded. Its cost is O(d*(n+b)), so for 32- or 64-bit integers processed a byte at a time (b=256, d=4 or 8) it is extremely fast and cache-friendly, but the underlying counting-sort passes require O(n+b) auxiliary memory and stability, so the digit subroutine must be stable or the result is wrong.
