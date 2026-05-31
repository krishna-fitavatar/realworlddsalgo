---
name: "Ternary Search"
slug: "ternary-search"
category: "search"
summary: "A divide-and-conquer search that finds the extremum of a unimodal function (or a key in a sorted array) by splitting the interval into three parts and discarding the third that cannot contain the answer."
complexity:
  time:
    "search (sorted array)": "O(log n)"
    "extremum (continuous, to precision eps)": "O(log((r-l)/eps))"
    "extremum (integer domain)": "O(log n)"
  space: "O(1) iterative, O(log n) recursive"
viz: null
---

Ternary search narrows a search interval by evaluating two interior points, `m1` and `m2`, that divide it into three roughly equal segments. Its primary use is optimizing a **unimodal** function — one that strictly increases then strictly decreases (or vice versa). By comparing `f(m1)` and `f(m2)`, the algorithm can prove that the extremum lies in only two of the three segments and discards the outer third on each step. It can also locate a key in a sorted array, though there it performs strictly more comparisons than binary search.

Each iteration shrinks the interval by a factor of about 2/3, so the count of remaining candidates falls geometrically and the method converges in O(log n) (or O(log((r-l)/eps)) for a continuous domain searched to tolerance `eps`). The key correctness requirement is strict unimodality: if the function has flat plateaus where `f(m1) == f(m2)`, naively discarding a side can drop the true optimum, so implementations must handle ties carefully (or restrict to strictly unimodal inputs).

In practice the dominant cost is the function evaluation, not the bookkeeping, and ternary search's two evaluations per step make it slower than the golden-section search, which reuses one evaluation per iteration. For competitive programming and numerical optimization a fixed iteration budget (commonly 200-300 iterations for floating-point) is preferred over an epsilon-based loop to avoid precision-driven infinite loops; for integer domains, the interval is reduced until only a few candidates remain and the rest are checked directly.
