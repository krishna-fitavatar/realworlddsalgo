---
name: "Breadth-First Search"
slug: "bfs"
category: "graph"
summary: "Breadth-First Search explores a graph level by level from a source vertex using a FIFO queue, visiting all neighbors at the current distance before moving deeper, which yields shortest paths in unweighted graphs."
complexity:
  time:
    "traversal": "O(V + E)"
    "shortest_path_unweighted": "O(V + E)"
  space: "O(V)"
viz: null
---

Breadth-First Search (BFS) is a graph traversal algorithm that visits vertices in order of their distance from a chosen source. It maintains a FIFO queue of frontier nodes and a visited set; it dequeues a node, marks and enqueues each unvisited neighbor, and repeats until the queue empties. Because nodes are expanded in non-decreasing order of edge count from the source, BFS naturally discovers shortest paths in unweighted graphs.

The algorithm runs in O(V + E) time on a graph with V vertices and E edges, since every vertex is enqueued once and every edge is examined once (twice for an undirected adjacency list). Auxiliary space is O(V) for the queue and visited markers. Using an explicit queue is essential — unlike DFS, BFS cannot be expressed with simple recursion because it requires level-order, not depth-order, expansion.

In practice BFS is the go-to method whenever the answer is "fewest steps" rather than "lowest cost": unweighted shortest paths, social-network degrees of separation, web crawling by link depth, bipartiteness checking, connected-component labeling, and finding augmenting paths in max-flow (Edmonds-Karp). For weighted graphs it generalizes to Dijkstra's algorithm; on uniform-cost grids it remains the simplest correct choice.
