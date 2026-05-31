---
name: "Hash Table"
slug: "hash-table"
category: "hash"
summary: "A hash table stores key-value pairs in an array of buckets indexed by a hash of the key, giving expected constant-time insert, lookup, and delete at the cost of unordered storage and worst-case linear behavior under collisions."
complexity:
  time:
    "search": "O(1)"
    "insert": "O(1)"
    "delete": "O(1)"
    "search_worst": "O(n)"
    "insert_worst": "O(n)"
    "delete_worst": "O(n)"
  space: "O(n)"
viz: null
---

A hash table (hash map) maps keys to values by applying a hash function to each key to compute an index into an array of buckets. Because the index is derived directly from the key rather than from a comparison or position, the average cost of inserting, finding, or removing an entry is O(1), independent of the number of stored items. The trade-off is that elements are stored in an effectively arbitrary order, so it offers no efficient way to traverse keys in sorted order or find a range.

Two keys can hash to the same bucket — a collision — and the resolution strategy defines the implementation. Separate chaining stores a linked list (or tree) per bucket, while open addressing (linear probing, quadratic probing, Robin Hood, cuckoo) keeps everything in the array and probes for the next free slot. As the load factor (entries / buckets) rises, collisions grow and operations degrade toward O(n), so real implementations resize and rehash once the load factor crosses a threshold (commonly ~0.7), amortizing the cost across insertions.

In practice the thing that matters most is that the O(1) guarantee is only expected, not worst case: a poor hash function or adversarially chosen keys can collapse every key into one bucket, turning lookups linear and enabling hash-flooding denial-of-service attacks. Production hash tables therefore use well-distributed, often seeded/randomized hash functions (e.g. SipHash in Python, Rust, and Perl) and high-quality mixing, and prefer power-of-two or prime bucket counts to keep distribution even.
