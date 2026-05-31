---
name: "Kadane's Algorithm"
slug: "kadane"
category: "other"
summary: "A dynamic-programming algorithm that finds the maximum-sum contiguous subarray of a one-dimensional numeric array in a single linear pass."
complexity:
  time:
    "max_subarray_sum": "O(n)"
  space: "O(1)"
viz: null
---

Kadane's algorithm solves the maximum subarray problem: given an array of numbers (which may be negative), find the contiguous slice whose elements sum to the largest possible value. It is a textbook example of dynamic programming reduced to a constant-space scan.

The core insight is that the best subarray ending at index `i` is either the element at `i` alone, or that element extended by the best subarray ending at `i-1`. So you maintain a running `current` sum: at each step set `current = max(arr[i], current + arr[i])`, and track the global `best = max(best, current)`. Whenever the running sum dips below zero it is discarded, because a negative prefix can only hurt any subarray extending past it.

The one thing that matters in practice is handling the all-negative case: initialize `best` to the first element (or negative infinity), not to zero, or the algorithm will wrongly return 0 for an array with no positive numbers. To recover the actual subarray bounds rather than just the sum, record the start index whenever `current` resets and the end index whenever `best` updates.
