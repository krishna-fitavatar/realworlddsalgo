---
name: "Bloom Filter"
slug: "bloom-filter"
category: "hash"
summary: "A space-efficient probabilistic set membership structure that answers \"is x in the set?\" with no false negatives but a tunable rate of false positives, using a bit array and several independent hash functions."
complexity:
  time:
    "insert": "O(k)"
    "query": "O(k)"
  space: "O(m)"
viz: null
---

A Bloom filter is a compact probabilistic data structure for testing whether an element is a member of a set. It stores no elements themselves, only a bit array of `m` bits and `k` hash functions. A negative answer is always correct (no false negatives), but a positive answer may be wrong with a small, configurable false-positive probability. Standard variants do not support deletion.

To insert an element, you hash it with each of the `k` hash functions to produce `k` positions in the bit array and set all of those bits to 1. To query, you hash the element the same way and check those `k` bits: if any is 0 the element is definitely absent; if all are 1 the element is probably present. Both operations are O(k), independent of the number of stored items, and the structure uses only `m` bits regardless of element size.

In practice the key is sizing: for `n` items the optimal bit count is `m = -n·ln(p)/(ln 2)^2` and the optimal hash count `k = (m/n)·ln 2`, where `p` is the target false-positive rate. Filters are used as a cheap pre-check in front of expensive lookups (disk, network, distributed stores) so most negatives are answered instantly without touching the slow backend.
