---
name: "Kruskal's Minimum Spanning Tree"
slug: "kruskal-mst"
category: "graph"
summary: "A greedy algorithm that builds a minimum spanning tree of a weighted undirected graph by sorting all edges by weight and adding each edge that does not form a cycle, using a disjoint-set (union-find) structure to detect cycles."
complexity:
  time:
    "sort edges": "O(E log E)"
    "union-find operations": "O(E α(V))"
    "overall": "O(E log E) = O(E log V)"
  space: "O(V + E)"
viz: null
---

Kruskal's algorithm finds a minimum spanning tree (MST): the subset of edges connecting all vertices of a weighted, undirected graph with the smallest possible total edge weight and no cycles. It is one of the two classic greedy MST algorithms, alongside Prim's.

It works by sorting every edge in ascending order of weight, then scanning them from cheapest to most expensive. Each edge is added to the tree only if its two endpoints lie in different connected components; otherwise it would close a cycle and is skipped. A disjoint-set (union-find) data structure tracks components, with `find` checking membership and `union` merging them. The algorithm stops once V-1 edges have been accepted.

In practice the dominant cost is the initial edge sort, so Kruskal's shines on sparse graphs and when edges are already sorted or cheap to sort. The union-find must use both union by rank/size and path compression to reach the near-constant inverse-Ackermann amortized cost; without them, cycle detection degrades and the asymptotic guarantee is lost. Kruskal's is also a natural fit when edges arrive as a flat list rather than an adjacency structure.
