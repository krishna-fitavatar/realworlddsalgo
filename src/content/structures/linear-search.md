---
name: "Linear Search"
slug: "linear-search"
category: "search"
summary: "Linear search scans a collection element by element, comparing each against a target until a match is found or the end is reached, requiring no ordering or preprocessing of the data."
complexity:
  time:
    "best": "O(1)"
    "average": "O(n)"
    "worst": "O(n)"
  space: "O(1)"
viz: null
---

Linear search (also called sequential search) is the simplest search algorithm: it walks through a collection one item at a time, comparing each element to the search key. If a match is found it returns the position; if it reaches the end without a match, it reports failure. It makes no assumptions about the data — the elements need not be sorted, indexed, or hashed.

Because it touches every element in the worst case, linear search runs in O(n) time, but it uses only O(1) extra space and works on any iterable, including linked lists and streams where random access is unavailable. A best case of O(1) occurs when the target sits at the first position. Variants like the sentinel search remove the bounds check inside the loop for a small constant-factor speedup.

In practice, linear search is the right tool for small collections, unsorted data, or one-off lookups where building an index (sorting for binary search, or hashing) would cost more than the search saves. It is what `Array.prototype.indexOf`, Python's `in` operator on lists, and `std::find` all do under the hood, and CPUs scan contiguous arrays so efficiently that linear search often beats asymptotically faster structures for small n.
