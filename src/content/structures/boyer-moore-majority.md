---
name: "Boyer-Moore Majority Vote"
slug: "boyer-moore-majority"
category: "other"
summary: "A single-pass, constant-space algorithm that finds the majority element (one appearing more than n/2 times) in a sequence by maintaining a running candidate and a counter."
complexity:
  time:
    "find_candidate": "O(n)"
    "verify": "O(n)"
  space: "O(1)"
viz: null
---

The Boyer-Moore Majority Vote algorithm answers a deceptively simple question: which element, if any, appears in strictly more than half the positions of a sequence? It does so in a single linear scan using only two variables, beating the naive hash-map tally on memory and the sort-and-count approach on time.

The mechanism is a pairing argument. Keep a `candidate` and a `count`. For each element, if `count` is zero adopt the current element as the candidate; then increment `count` if the element equals the candidate, otherwise decrement it. Conceptually, every non-candidate element cancels out one candidate occurrence; a true majority survives because it has more occurrences than everything else combined. The survivor is only a *candidate* — a mandatory second pass must confirm it actually exceeds n/2, since on inputs with no majority the algorithm still returns some element.

In practice the second verification pass is the part people forget, and it is non-negotiable: skip it and you silently report garbage on majority-less inputs. A natural generalization (Boyer-Moore / Misra-Gries) tracks k-1 candidates to find all elements occurring more than n/k times, the backbone of streaming "heavy hitters" detection where storing every distinct key is infeasible.
