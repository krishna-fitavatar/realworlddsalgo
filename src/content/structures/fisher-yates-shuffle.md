---
name: "Fisher-Yates Shuffle"
slug: "fisher-yates-shuffle"
category: "other"
summary: "An in-place algorithm that generates a uniformly random permutation of an array by iterating from the end, swapping each element with a randomly chosen element at or before its position."
complexity:
  time:
    "shuffle": "O(n)"
  space: "O(1)"
viz: null
---

The Fisher-Yates shuffle (also called the Knuth shuffle) produces an unbiased random permutation of a finite sequence: every one of the n! possible orderings is equally likely. It is the standard correct way to shuffle a deck of cards, randomize a playlist, or assign random orderings, and it runs in linear time using only constant extra space.

The modern (Durstenfeld) variant walks the array from the last index `i` down to 1. At each step it picks a random index `j` uniformly in `[0, i]` and swaps `a[i]` with `a[j]`. Once an element is placed at position `i` it is never touched again, so the algorithm builds the shuffled result in place from back to front. The key invariant is that the random index range must include the current position itself, otherwise the distribution becomes biased.

In practice, the most common bug is the naive "shuffle" that picks `j` from the full range `[0, n)` on every iteration: this produces n^n equally likely execution paths, which cannot map evenly onto n! permutations, yielding a measurably biased result (the Microsoft browser-ballot incident is a famous example). Equally important is using an unbiased random-integer generator for the bounded range `[0, i]` rather than `rand() % (i+1)`, which introduces modulo bias when the range does not divide the RNG period evenly.
