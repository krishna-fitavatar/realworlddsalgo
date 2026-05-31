---
name: "Monotonic Stack"
slug: "monotonic-stack"
category: "other"
summary: "A stack maintained in sorted (monotonic increasing or decreasing) order by popping elements that violate the invariant on each push, enabling linear-time answers to \"nearest greater/smaller element\" queries."
complexity:
  time:
    "push": "O(1) amortized"
    "pop": "O(1)"
    "process all n elements": "O(n)"
  space: "O(n)"
viz: null
---

A monotonic stack is an ordinary stack with one extra invariant: its contents are always kept either non-increasing or non-decreasing from bottom to top. Before pushing a new element, you pop every element that would break that order. The elements you pop are exactly the ones for which the incoming element is their "next greater" (or "next smaller") neighbor, which is what makes the structure so useful.

Although a single push may trigger many pops, every element is pushed and popped at most once across the whole pass, so processing n elements is O(n) total even though it looks like a nested loop. The classic applications are Next Greater Element, Largest Rectangle in a Histogram, Stock Span, Trapping Rain Water, and the sliding-window maximum (where a monotonic deque generalizes the idea). Many of these problems have an obvious O(n^2) brute force that the monotonic stack collapses to O(n).

In practice the one thing to get right is the comparison and what you store: push indices rather than values when you need distances or widths, and decide carefully whether the invariant is strict (<) or non-strict (<=), since that determines how ties are handled and whether duplicates produce correct widths. A common trick is appending a sentinel (e.g. a height of 0) so the stack is guaranteed to fully drain at the end.
