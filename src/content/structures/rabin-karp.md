---
name: "Rabin-Karp"
slug: "rabin-karp"
category: "string"
summary: "A string-search algorithm that finds a pattern in text by comparing a rolling polynomial hash of each text window against the pattern's hash, only doing a full character check when hashes collide."
complexity:
  time:
    "preprocessing": "O(m)"
    "average": "O(n + m)"
    "worst": "O(n*m)"
    "multi-pattern (k patterns)": "O(n + km)"
  space: "O(1)"
viz: null
---

Rabin-Karp searches for a length-`m` pattern inside a length-`n` text by treating each substring as a number under a polynomial hash modulo a prime. It computes the pattern's hash once, then slides a window across the text comparing hashes; characters are only compared directly when two hashes match, filtering out the vast majority of positions cheaply.

The key trick is the rolling hash: when the window advances by one character, the new hash is derived from the old one in O(1) by subtracting the contribution of the outgoing character (scaled by the high-order power), multiplying by the alphabet base, and adding the incoming character, all under the modulus. This keeps each step constant-time rather than rehashing the whole window. A spurious hit (hash match but unequal strings) forces an O(m) verification, which is why the worst case degrades to O(n*m).

In practice the algorithm shines when searching for many patterns at once (e.g. plagiarism or duplicate detection): hashing all patterns into a set lets you check every text window against all of them in roughly O(n + km) time. The one thing that matters is picking a large prime modulus and good base to make collisions rare; a poor choice (or an adversarial input crafting collisions) collapses performance to the quadratic worst case, so production uses often pair it with double hashing or randomized moduli.
