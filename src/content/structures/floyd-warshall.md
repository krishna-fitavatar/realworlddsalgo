---
name: "Floyd-Warshall"
slug: "floyd-warshall"
category: "graph"
summary: "A dynamic-programming algorithm that computes shortest-path distances between every pair of vertices in a weighted directed graph in O(V^3) time, handling negative edge weights and detecting negative cycles."
complexity:
  time:
    "all_pairs_shortest_path": "O(V^3)"
    "negative_cycle_detection": "O(V)"
  space: "O(V^2)"
viz: null
---

Floyd-Warshall solves the all-pairs shortest path problem: given a weighted directed graph, it finds the shortest distance between every pair of vertices. Unlike running Dijkstra from each source, it tolerates negative edge weights, and it can report whether the graph contains a negative-weight cycle (a negative value appears on the diagonal of the distance matrix).

It works by maintaining a V x V distance matrix and iterating over an intermediate vertex `k` in the outer loop. For each pair `(i, j)` it asks whether routing through `k` is cheaper: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`. After considering every vertex as a potential intermediate, every entry holds the true shortest distance. The three nested loops give the characteristic O(V^3) running time, and the loop order (k outermost) is what makes the dynamic program correct.

In practice it shines on small, dense graphs where you need all pairs at once — typically a few hundred vertices — because its O(V^2) memory and cubic time become prohibitive beyond that. The tight, branch-free triple loop is extremely cache-friendly and trivially parallelizable, often beating asymptotically smarter algorithms on real hardware. To recover actual paths (not just distances) you keep a parallel predecessor/next matrix updated alongside the distances.
