---
name: Dijkstra's Algorithm
slug: dijkstra
category: graph
summary: Finds shortest paths from one source to all nodes in a graph with non-negative edge weights by always settling the closest unsettled node next.
complexity:
  time:
    "with binary heap": O((V + E) log V)
    "with array": O(V^2)
  space: O(V)
viz: DijkstraViz
source:
  lang: ts
  module: dijkstra.ts
---

Dijkstra's algorithm computes the shortest path from a source node to every
other node, as long as no edge has negative weight. It works greedily: repeatedly
take the unsettled node with the smallest tentative distance, finalize it, and
relax its neighbors. Once a node is settled, its distance is provably optimal.

The performance hinges on how you pick "the closest unsettled node." A linear
scan gives `O(V^2)`; a binary heap (priority queue) gives `O((V + E) log V)`,
and a Fibonacci heap improves the theoretical bound further. Real routing
engines layer additional tricks (A\*, contraction hierarchies) on top for
continent-scale maps. The visualization settles one node per step from source
**A** and shows distances tightening as neighbors are relaxed.
