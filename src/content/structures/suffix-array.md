---
name: "Suffix Array"
slug: "suffix-array"
category: "string"
summary: "A suffix array is a sorted array of all suffix starting positions of a string, supporting fast substring search and full-text indexing in far less space than a suffix tree."
complexity:
  time:
    "construction (SA-IS, linear)": "O(n)"
    "construction (naive sort)": "O(n^2 log n)"
    "substring search (with binary search)": "O(m log n)"
    "substring search (+LCP array)": "O(m + log n)"
  space: "O(n)"
viz: null
---

A suffix array is the lexicographically sorted list of the starting indices of every suffix of a string. For a text of length n it is just an integer array of n entries, which makes it a compact stand-in for a suffix tree: it answers the same "does this pattern occur, and where" questions while using roughly 4n bytes instead of the 15n-40n bytes a pointer-heavy suffix tree typically needs.

Naively you could sort all suffixes directly, but comparing suffixes costs O(n) each, so practical libraries use induced-sorting algorithms. SA-IS and the related DC3/skew algorithm build the array in O(n) time by classifying suffixes (e.g. into S-type and L-type), sorting a sampled subset, and then inducing the order of the rest in a couple of linear passes. To search for a pattern of length m, you binary-search the array, comparing the pattern against the suffix at each probed index.

In practice the suffix array is almost always paired with an LCP (longest common prefix) array, which records how many leading characters each adjacent pair of sorted suffixes shares. The LCP array turns the array from a plain sorted list into a substitute for the suffix tree's internal structure, enabling O(m + log n) search and constant-extra-work solutions to longest-repeated-substring and longest-common-substring problems. This SA+LCP combination, together with the Burrows-Wheeler Transform derived from it, is the backbone of compressed full-text indexes and modern bioinformatics aligners.
