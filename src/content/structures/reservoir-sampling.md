---
name: "Reservoir Sampling"
slug: "reservoir-sampling"
category: "other"
summary: "A family of randomized algorithms that selects a uniform random sample of k items from a stream of unknown or unbounded length in a single pass using O(k) memory."
complexity:
  time:
    "process item (Algorithm R)": "O(1)"
    "process n items (Algorithm R)": "O(n)"
    "process n items (Algorithm L)": "O(k(1 + log(n/k)))"
  space: "O(k)"
viz: null
---

Reservoir sampling solves a deceptively hard problem: pick k items uniformly at random from a stream whose total length n you do not know in advance and cannot fully store. It only needs a reservoir of k slots, so it runs in O(k) space regardless of how large the stream grows. This makes it the standard tool for sampling logs, clickstreams, or any feed too big to materialize.

The classic Algorithm R fills the reservoir with the first k items, then for each subsequent item i (1-indexed beyond k) keeps it with probability k/i, evicting a uniformly chosen existing element if kept. A simple induction shows every item seen so far survives with probability exactly k/i, guaranteeing uniformity. Vitter's Algorithm L improves this by computing how many items to skip before the next acceptance via a geometric jump, cutting the number of random draws from O(n) to O(k log(n/k)).

In practice the thing that matters most is that the per-item work is constant and online: you never rewind, never need the count up front, and the sample stays valid at every prefix of the stream. Production engines (Spark, Flink) use it for sampling RDDs/partitions, and weighted variants (A-Res, A-ExpJ) extend it to non-uniform sampling when items carry weights.
