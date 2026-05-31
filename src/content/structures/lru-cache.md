---
name: "LRU Cache"
slug: "lru-cache"
category: "hash"
summary: "A fixed-capacity cache that evicts the least-recently-used entry when full, combining a hash map for O(1) key lookup with a doubly linked list to track usage recency."
complexity:
  time:
    "get": "O(1)"
    "put": "O(1)"
    "evict": "O(1)"
  space: "O(capacity)"
viz: null
---

An LRU (Least Recently Used) cache stores a bounded number of key-value pairs and, when it reaches capacity, discards the entry that was accessed longest ago. It is the default eviction policy for most application and CPU caches because recency of access is a cheap, effective proxy for future access likelihood.

The canonical implementation pairs a hash map with a doubly linked list. The hash map maps each key to its node, giving O(1) lookup. The linked list orders nodes by recency: every `get` or `put` unlinks the touched node and moves it to the head (most recent), and eviction simply removes the tail node. Because both ends and arbitrary nodes are spliced in constant time, all operations are O(1). Some languages get this for free — Java's `LinkedHashMap` with `accessOrder=true` and Python's `OrderedDict.move_to_end` implement exactly this pattern.

In practice the subtle part is concurrency: a naive LRU serializes every read behind a lock because reads mutate the recency list. High-throughput systems (Caffeine, RocksDB, Redis) avoid this by approximating LRU — sampling a few keys, using CLOCK/second-chance bits, or batching access records in ring buffers — trading exact recency for far better parallelism.
