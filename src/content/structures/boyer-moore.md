---
name: "Boyer-Moore"
slug: "boyer-moore"
category: "string"
summary: "A substring search algorithm that scans the pattern right-to-left and uses bad-character and good-suffix heuristics to skip large chunks of text, achieving sublinear time on typical inputs."
complexity:
  time:
    "preprocessing": "O(m + k)"
    "search_best": "O(n/m)"
    "search_worst": "O(n*m)"
  space: "O(m + k)"
viz: null
---

Boyer-Moore finds occurrences of a pattern of length `m` inside a text of length `n` over an alphabet of size `k`. Unlike naive or Knuth-Morris-Pratt scanning, it aligns the pattern with the text and compares characters from the *right end* of the pattern backward, which lets a single mismatch justify a large forward jump.

The jump distance comes from two precomputed tables. The **bad-character rule** says: when the text character that caused the mismatch does not occur in the pattern (or occurs only to the left of the current alignment), shift the pattern past it. The **good-suffix rule** uses the already-matched suffix to align with its next occurrence (or a matching prefix) further along. At each mismatch the algorithm takes the larger of the two shifts, so it often inspects far fewer than `n` characters — sublinear, roughly `O(n/m)`, on natural-language text.

In practice the bad-character rule alone (the Boyer-Moore-Horspool simplification) captures most of the speedup with far less code, while the full good-suffix table is what guards against pathological inputs. The classic worst case is still `O(n*m)`; production string searchers (Go's `strings.Index`, glibc, CPython) therefore blend Boyer-Moore-style skipping with linear-time fallbacks like Two-Way to bound the worst case while keeping the common case fast.
