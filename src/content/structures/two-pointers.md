---
name: "Two Pointers"
slug: "two-pointers"
category: "other"
summary: "The two-pointer technique walks two indices through a sequence — converging from both ends or advancing at different speeds — to solve search, partition, and trimming problems in linear time without extra storage."
complexity:
  time:
    "pair-sum on sorted array": "O(n)"
    "partition / dedup in place": "O(n)"
    "fast-slow cycle detection": "O(n)"
  space: "O(1)"
viz: null
---

The two-pointer technique uses two indices into a linear structure (array, string, or linked list) instead of a single scanning index. The pointers move under rules tied to the data's order or to a target condition, replacing an otherwise nested loop with a single pass.

Two patterns dominate. In the **opposing-ends** pattern, one pointer starts at the front and one at the back, then they move toward each other: on a sorted array you grow the left pointer when the current sum is too small and shrink the right when it is too large, solving pair-sum and palindrome checks in O(n). In the **fast-slow** pattern both pointers start together but advance at different rates, which detects linked-list cycles (Floyd's algorithm), finds midpoints, and powers in-place dedup or partition where a slow write-pointer trails a fast read-pointer.

The thing that matters in practice is the precondition: the converging variant is only correct when the input is sorted (or otherwise monotonic in the quantity you compare), so the real cost is often the O(n log n) sort you pay first. Once that holds, two pointers turn quadratic brute force into a tight linear scan with O(1) extra space — which is exactly why standard libraries use it for string trimming, partitioning in quicksort, and merge steps.
