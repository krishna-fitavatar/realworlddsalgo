---
name: "Dutch National Flag"
slug: "dutch-national-flag"
category: "other"
summary: "A single-pass, in-place partitioning algorithm that sorts an array of three distinct categories (e.g. low/equal/high relative to a pivot) into three contiguous groups using three pointers."
complexity:
  time:
    "partition": "O(n)"
    "worst_case": "O(n)"
  space: "O(1)"
viz: null
---

The Dutch National Flag problem, posed by Edsger Dijkstra, asks you to rearrange an array containing three kinds of elements (classically red, white, blue — like the Dutch flag) so all elements of each kind are grouped together in order. The canonical modern use is three-way partitioning: given a pivot, split values into those less than, equal to, and greater than it. This is the heart of three-way quicksort, which avoids quadratic blowup on inputs with many duplicate keys.

The algorithm maintains three indices over a single pass: `low` (boundary of the "less-than" region), `mid` (the current element under inspection), and `high` (boundary of the "greater-than" region). When `arr[mid]` is less than the pivot, swap it into the low region and advance both `low` and `mid`; when it equals the pivot, just advance `mid`; when it is greater, swap it with `arr[high]` and decrement `high` only — because the swapped-in element is unexamined. The scan ends when `mid` passes `high`.

The one subtlety that matters in practice: do not advance `mid` after a swap with the `high` end, since the value pulled from `high` hasn't been classified yet. This is the most common bug. The payoff is a stable O(n) time, O(1) space, single-pass partition with at most n swaps — strictly better than two separate passes, and the standard answer to "sort an array of 0s, 1s, and 2s" interview problems.
