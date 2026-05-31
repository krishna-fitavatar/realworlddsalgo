---
name: "Longest Common Subsequence (DP)"
slug: "longest-common-subsequence"
category: "other"
summary: "A dynamic programming algorithm that finds the longest sequence of characters appearing in the same relative order (not necessarily contiguously) in two strings, forming the backbone of diff tools and version control."
complexity:
  time:
    "build dp table (two strings of length m, n)": "O(m*n)"
    "backtrack to recover one subsequence": "O(m+n)"
  space: "O(m*n)"
viz: null
---

The Longest Common Subsequence (LCS) problem asks for the longest sequence that appears in two inputs in the same relative order, allowing gaps. Unlike substrings, the characters need not be contiguous: the LCS of `ABCBDAB` and `BDCAB` is `BCAB` (length 4). It is the canonical example of two-dimensional dynamic programming and the formal basis for measuring how similar two sequences are.

The standard solution fills an `(m+1) x (n+1)` table where `dp[i][j]` is the LCS length of the first `i` and first `j` characters. When the current characters match, `dp[i][j] = dp[i-1][j-1] + 1`; otherwise it is `max(dp[i-1][j], dp[i][j-1])`. The length is read from the bottom-right cell, and the actual subsequence is recovered by walking back through the table. A symmetric variant—shortest edit script / Myers diff—is what powers line-level diffing.

In practice the `O(m*n)` memory is the binding constraint: diffing large files quadratically is infeasible, so real tools use Hirschberg's algorithm (linear space) or Myers' O(ND) diff, which is fast when the two inputs are similar (small edit distance D). Computing only the length needs just two rows, but recovering the sequence requires either the full table or a divide-and-conquer recursion.
