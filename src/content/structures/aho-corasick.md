---
name: "Aho-Corasick"
slug: "aho-corasick"
category: "string"
summary: "Aho-Corasick is a finite-state automaton that finds all occurrences of a set of keywords in a text in a single linear pass, regardless of how many patterns are searched."
complexity:
  time:
    "build": "O(m)"
    "search": "O(n + z)"
    "total": "O(m + n + z)"
  space: "O(m * |Σ|)"
viz: null
---

Aho-Corasick is a multi-pattern string matching algorithm that searches for every member of a finite dictionary of keywords simultaneously. Where running a single-pattern algorithm like KMP once per keyword would cost time proportional to the text length times the number of patterns, Aho-Corasick matches all of them in one scan, making it the standard choice whenever a fixed set of strings must be located in streaming or bulk text.

It works by building a trie (keyword tree) from all patterns, then adding "failure links" that point each node to the longest proper suffix of its current match that is also a prefix of some pattern — effectively a KMP failure function generalized to a tree. During matching, the automaton consumes one input character at a time, following goto edges on a match and failure links on a mismatch, and reports a hit whenever it reaches a node marked as the end of a keyword (or reachable via output/dictionary links). The construction is a single BFS over the trie, and the search visits each input character a constant number of amortized times.

In practice the dominant concern is memory layout: a naive node-per-character trie with 256-way pointer arrays is cache-hostile, so production implementations compact the automaton (byte-classes, contiguous arrays, or DFA "premultiplication") to trade build time and space for fast, branch-light matching. The output term z (number of matches) matters too — with many overlapping patterns reporting all hits can dominate runtime, so most libraries offer leftmost-longest or non-overlapping match modes.
