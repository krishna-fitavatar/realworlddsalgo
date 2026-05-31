---
name: "Edit Distance (DP)"
slug: "edit-distance"
category: "other"
summary: "Edit (Levenshtein) distance is a dynamic-programming algorithm that computes the minimum number of single-character insertions, deletions, and substitutions to turn one string into another, powering spell check, fuzzy matching, and diffs."
complexity:
  time:
    "build_table": "O(m*n)"
    "query_distance": "O(1) after build"
    "reconstruct_path": "O(m+n)"
  space: "O(m*n), reducible to O(min(m,n)) for distance only"
viz: null
---

**What it is.** Edit distance (Levenshtein distance) measures the minimum number of single-character insertions, deletions, and substitutions needed to transform one string into another. It is a classic dynamic-programming problem and the backbone of approximate string matching, spell checking, and diffing.

**How it works.** Build a table `dp[i][j]` holding the edit distance between the first `i` characters of string A and the first `j` characters of B. Base cases are `dp[i][0] = i` and `dp[0][j] = j` (delete/insert everything). For each cell, if the characters match, `dp[i][j] = dp[i-1][j-1]`; otherwise take `1 + min` of the three neighbors representing delete (`dp[i-1][j]`), insert (`dp[i][j-1]`), and substitute (`dp[i-1][j-1]`). The answer is `dp[m][n]`, and backtracking through the table reconstructs the actual edit script.

**What matters in practice.** The naive table costs O(m*n) space, which is the binding constraint on long inputs; since each row depends only on the previous row, you can roll it down to O(min(m,n)) space when you only need the distance. When you need bounded matching (e.g., "within 2 edits"), Ukkonen's band restricts computation to a diagonal stripe for near-linear time, and weighted/transposition variants (Damerau-Levenshtein) adapt the recurrence for typo correction.
