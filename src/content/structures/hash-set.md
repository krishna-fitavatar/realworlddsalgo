---
name: "Hash Set"
slug: "hash-set"
category: "hash"
summary: "A hash set stores unique elements with no associated values, using a hash function to give average O(1) membership testing, insertion, and deletion at the cost of unordered iteration."
complexity:
  time:
    "search": "O(1)"
    "insert": "O(1)"
    "delete": "O(1)"
    "iterate": "O(n)"
  space: "O(n)"
viz: null
---

A hash set is a collection of distinct elements that supports fast "is this value present?" queries. Unlike a hash map, it stores only keys, not key-value pairs. It is the canonical structure for deduplication, set membership, and computing intersections, unions, and differences between collections.

Internally it is almost always a hash map whose values are ignored (or a single shared sentinel). Each element is run through a hash function to pick a bucket; collisions are resolved by chaining (a linked list/tree per bucket) or open addressing (probing for the next free slot). When the load factor exceeds a threshold the backing array is resized and every element is rehashed, which makes individual inserts amortized O(1) rather than strictly constant.

In practice the two things that matter are hash quality and equality semantics: a weak hash function degrades operations toward O(n) under collisions, and custom element types must implement consistent hash and equality (e.g., `hashCode`/`equals` in Java, `__hash__`/`__eq__` in Python) or lookups silently fail. Hash sets also give no ordering guarantee, so use a tree-based or insertion-ordered variant when iteration order matters.
