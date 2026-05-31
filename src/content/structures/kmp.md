---
name: "Knuth-Morris-Pratt (KMP)"
slug: "kmp"
category: "string"
summary: "Knuth-Morris-Pratt finds all occurrences of a pattern in a text in linear time by precomputing a failure table that lets the search skip rechecking characters it already matched, never moving the text pointer backward."
complexity:
  time:
    "preprocess pattern (build LPS table)": "O(m)"
    "search": "O(n)"
    "total": "O(n + m)"
  space: "O(m)"
viz: null
---

Knuth-Morris-Pratt (KMP) is an exact substring search algorithm that locates every occurrence of a pattern of length `m` inside a text of length `n` in `O(n + m)` time. Its key idea is that when a mismatch happens after matching several characters, those matched characters already tell you something about the text, so there is no need to re-examine them. Naive search throws that information away and backtracks; KMP keeps it.

The algorithm first preprocesses the pattern into a "longest proper prefix that is also a suffix" table (the LPS or failure function), computed in `O(m)`. During the scan, the text pointer only ever moves forward. On a mismatch the algorithm consults the LPS table to slide the pattern to the next-best aligned position rather than restarting at the previous text index, which is what guarantees the linear bound and worst-case immunity that naive search lacks (e.g. pattern `aaaab` against `aaaaaaaab`).

In practice KMP shines when you cannot afford backtracking or random access into the text — most notably streaming input, where bytes arrive once and must be matched on the fly, and any adversarial input where worst-case guarantees matter. For typical short patterns over large alphabets, Boyer-Moore or memchr-style SIMD scanning is usually faster because they skip ahead; KMP's value is its strict linear-time guarantee and single-pass, no-rewind property.
