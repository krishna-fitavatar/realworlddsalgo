---
name: Trie (Prefix Tree)
slug: trie
category: tree
summary: A tree keyed by sequence prefixes, where shared prefixes are stored once — making prefix lookups and autocomplete proportional to key length, not dataset size.
complexity:
  time:
    insert: O(k)
    search: O(k)
    prefix-scan: O(k)
  space: O(total characters)
viz: TrieViz
source:
  lang: ts
  module: trie.ts
---

A trie stores keys by walking one character (or one byte) at a time down a tree,
so every key sharing a prefix shares the path for that prefix. Lookup cost
depends only on the length of the key `k`, never on how many keys are stored —
which is why tries shine for autocomplete, spell-check, and IP routing.

The trade is memory: a naive trie allocates a node per character. Production
variants compress runs of single-child nodes (radix / PATRICIA tries) or pack
children adaptively to cut that cost. The visualization shows a plain
character trie; notice how `to`, `tea`, `ten`, and `ted` reuse the `t` path and
mark only complete words as terminal.
