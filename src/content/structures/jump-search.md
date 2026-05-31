---
name: "Jump Search"
slug: "jump-search"
category: "search"
summary: "Jump Search finds a target in a sorted array by jumping ahead in fixed blocks of size sqrt(n), then doing a linear scan within the block where the value must lie, giving O(sqrt(n)) time."
complexity:
  time:
    "best": "O(1)"
    "average": "O(sqrt(n))"
    "worst": "O(sqrt(n))"
  space: "O(1)"
viz: null
---

Jump Search is a search algorithm for **sorted** arrays that sits between linear search and binary search. Instead of checking every element (linear) or repeatedly halving (binary), it skips ahead by a fixed block size, checking only the block boundaries until it overshoots the target.

The optimal block size is `floor(sqrt(n))`: with `n/m` jumps to find the right block and up to `m-1` comparisons in the final linear backscan, total work is minimized when the block size `m = sqrt(n)`, yielding O(sqrt(n)) comparisons. The algorithm jumps forward while `arr[min(jump, n)-1] < target`, then linearly scans the previous block to locate (or rule out) the value.

In practice Jump Search is rarely the first choice for in-memory arrays, where binary search's O(log n) wins. Its niche is systems where jumping *backward* is costly or impossible — for example data on magnetic tape, paged/blocked storage, or skip-list-like structures — because it only ever scans forward in small bounded segments, never seeking back across the whole range.
