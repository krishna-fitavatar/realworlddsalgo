---
name: "Prim's MST"
slug: "prim-mst"
category: "graph"
summary: "Prim's algorithm builds a minimum spanning tree of a weighted undirected graph by greedily growing a single tree, repeatedly adding the cheapest edge that connects a tree vertex to a non-tree vertex."
complexity:
  time:
    "binary heap + adjacency list": "O(E log V)"
    "Fibonacci heap": "O(E + V log V)"
    "adjacency matrix (no heap)": "O(V^2)"
  space: "O(V + E)"
viz: null
---

Prim's algorithm finds a minimum spanning tree (MST): a subset of edges connecting all vertices of a weighted, connected, undirected graph with the lowest possible total edge weight. Unlike Kruskal's, which grows a forest by globally sorting edges, Prim's grows one connected tree outward from an arbitrary start vertex.

It maintains a frontier of candidate edges crossing from the in-tree set to the out-of-tree set, typically stored in a priority queue keyed by edge weight. Each step extracts the minimum-weight crossing edge, adds its endpoint to the tree, and relaxes that vertex's neighbors by updating their best connecting edge. By the cut property, the lightest edge crossing any cut is safe to include, which is what makes the greedy choice optimal.

In practice the data structure choice dominates performance: a binary heap gives O(E log V) and is the standard pick, while an adjacency-matrix scan at O(V^2) is actually faster on dense graphs where E approaches V^2. Prim's also tends to win over Kruskal's on dense graphs because it avoids sorting all edges, whereas Kruskal's is preferable for sparse graphs and when edges arrive pre-sorted.
