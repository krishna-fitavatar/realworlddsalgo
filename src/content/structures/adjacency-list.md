---
name: "Adjacency List"
slug: "adjacency-list"
category: "graph"
summary: "An adjacency list represents a graph as an array (or map) of per-vertex lists, where each list holds the neighbors of one vertex, giving compact storage proportional to the number of edges."
complexity:
  time:
    "add_vertex": "O(1)"
    "add_edge": "O(1)"
    "remove_edge": "O(degree(v))"
    "has_edge": "O(degree(v))"
    "iterate_neighbors": "O(degree(v))"
    "iterate_all_edges": "O(V+E)"
  space: "O(V+E)"
viz: null
---

An **adjacency list** stores a graph as a collection of lists, one per vertex. The list for vertex `v` contains exactly the vertices adjacent to `v` (and often the edge weights). The whole structure is typically an array indexed by vertex id, or a hash map from vertex to a list/set of neighbors, consuming O(V + E) space — far less than an adjacency matrix's O(V²) for the sparse graphs that dominate real workloads.

Adding a vertex or appending an edge is O(1); enumerating a vertex's neighbors is O(degree(v)), which makes it the natural backing store for traversals like BFS and DFS that walk outward from each node. The trade-off is membership: answering "is there an edge u→v?" requires scanning u's list in O(degree(u)), whereas an adjacency matrix answers it in O(1). When fast edge lookups matter, the per-vertex list is often replaced by a hash set, recovering expected O(1) `has_edge` while keeping O(V + E) space.

In practice the decisive factor is **density**: real graphs (social networks, road maps, web link graphs, dependency trees) are sparse, so the adjacency list's linear space and cache-friendly neighbor iteration win decisively over a matrix. Choose the matrix only for small or near-complete graphs where constant-time edge queries and dense linear-algebra operations pay off.
