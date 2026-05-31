---
name: "Bucket Sort"
slug: "bucket-sort"
category: "sort"
summary: "Bucket sort distributes elements into a fixed number of buckets by value range, sorts each bucket individually, then concatenates them — achieving linear average time when the input is uniformly distributed over a known range."
complexity:
  time:
    "best": "O(n + k)"
    "average": "O(n + k)"
    "worst": "O(n^2)"
  space: "O(n + k)"
viz: null
---

Bucket sort is a distribution-based sorting algorithm. Given `n` elements drawn from a known range, it allocates `k` buckets, each covering a contiguous slice of that range, and scatters every element into the bucket matching its value. Because placement is computed directly from the value (not from comparisons), the scatter pass is `O(n)`.

Each bucket is then sorted independently — typically with insertion sort, which is fast on the small, near-sorted runs that uniformly distributed data produces — and the buckets are read back in order to form the sorted output. When the `n` inputs spread evenly across the `k` buckets, each bucket holds roughly `n/k` items and the whole thing runs in `O(n + k)` average time.

The practical catch is distribution sensitivity: if the data is skewed so that most elements land in a few buckets, those buckets degrade to their inner sort's worst case, pushing the total toward `O(n^2)`. Bucket sort shines for floating-point keys in `[0, 1)` or other data with a known, roughly uniform spread; for arbitrary integer keys it is usually beaten by radix sort, and for general data by comparison sorts.
