---
name: Dynamic Array
slug: dynamic-array
category: linear
summary: A contiguous, automatically-resizing array that gives O(1) amortized append by doubling capacity when full — the workhorse behind most languages' list types.
complexity:
  time:
    index: O(1)
    append: O(1) amortized
    insert-middle: O(n)
  space: O(n)
viz: null
---

A dynamic array stores elements contiguously in memory and grows by allocating a
larger backing buffer (typically 1.5–2×) and copying when it fills. Indexing is
a single pointer offset; appending is `O(1)` *amortized* because the occasional
copy is paid down across many cheap appends.

Almost every high-level language ships one as its default list: Python's `list`,
Go's slices, Rust's `Vec`, C++'s `std::vector`, Java's `ArrayList`. This page has
no visualization (the structure is its memory layout, not a traversal), but the
references show how the standard libraries actually implement the growth policy.
