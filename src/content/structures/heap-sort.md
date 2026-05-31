---
name: "Heap Sort"
slug: "heap-sort"
category: "sort"
summary: "Heap Sort is an in-place comparison sort that builds a binary max-heap from the array and repeatedly extracts the maximum, achieving guaranteed O(n log n) time with no extra memory and no worst-case degradation."
complexity:
  time:
    "best": "O(n log n)"
    "average": "O(n log n)"
    "worst": "O(n log n)"
  space: "O(1)"
viz: null
---

Heap Sort is a comparison-based sorting algorithm that treats the input array as a complete binary tree and reorganizes it into a binary heap. Unlike quicksort, its worst-case running time is bounded at O(n log n), and unlike merge sort, it sorts in place using only O(1) auxiliary memory.

The algorithm runs in two phases. First it "heapifies" the array bottom-up, sifting each internal node down so every parent dominates its children, producing a valid max-heap in O(n) time. Then it repeatedly swaps the root (the maximum element) with the last element of the heap, shrinks the heap by one, and sifts the new root down to restore the heap property. After n-1 extractions the array is fully sorted in ascending order.

In practice Heap Sort is valued for its predictable guarantees rather than raw speed: it has no pathological inputs and needs no recursion or extra buffers, which makes it ideal as a fallback. This is exactly why introsort (used by many C++ STL `std::sort` implementations) switches to Heap Sort once quicksort's recursion depth grows too large, preventing the O(n^2) blowup while keeping cache behavior acceptable. Its main weakness is that it is not a stable sort and has poor locality of reference compared to quicksort.
