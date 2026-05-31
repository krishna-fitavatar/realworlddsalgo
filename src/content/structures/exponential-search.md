---
name: "Exponential Search"
slug: "exponential-search"
category: "search"
summary: "A search algorithm for sorted arrays that finds a bounded range by repeatedly doubling an index, then binary-searches within that range, excelling on unbounded or very large inputs where the target is near the start."
complexity:
  time:
    "best": "O(1)"
    "average": "O(log i)"
    "worst": "O(log i)"
  space: "O(1)"
viz: null
---

Exponential search (also called doubling search or galloping search) locates a target in a sorted, randomly-accessible sequence. It is most useful when the array is unbounded in size or when the target is likely to be near the beginning, since its cost depends on the position of the result rather than the total length of the array.

The algorithm works in two phases. First, it probes indices 1, 2, 4, 8, 16, ... — doubling each step — until it finds an index whose value is greater than or equal to the target (or reaches the array end). This brackets the target between index i/2 and i. Second, it runs an ordinary binary search over that bounded sub-range. If the target sits at position i, the doubling phase takes O(log i) steps and the binary search over the range of size i also takes O(log i), giving O(log i) overall.

In practice the key advantage is that the running time is a function of the distance to the element, not the array size, so it beats plain binary search when matches cluster near the front or when the upper bound is unknown (e.g. searching a stream or a lazily-materialized list). It also underlies "galloping mode" in merge algorithms like Timsort, where one run repeatedly overtakes another and exponential probing finds the insertion point faster than linear scanning.
