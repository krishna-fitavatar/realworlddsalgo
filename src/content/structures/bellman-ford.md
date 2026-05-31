---
name: "Bellman-Ford"
slug: "bellman-ford"
category: "graph"
summary: "A single-source shortest-path algorithm that handles negative edge weights and detects negative-weight cycles by repeatedly relaxing every edge V-1 times."
complexity:
  time:
    "shortest_paths": "O(V*E)"
    "negative_cycle_detection": "O(V*E)"
  space: "O(V)"
viz: null
---

Bellman-Ford computes shortest paths from a single source to all other vertices in a weighted, directed graph. Unlike Dijkstra's algorithm, it correctly handles negative edge weights, and it can report when no shortest path exists because the graph contains a reachable negative-weight cycle.

It works by repeated edge relaxation. After initializing the source distance to 0 and all others to infinity, it makes V-1 passes over the entire edge list, updating `dist[v] = min(dist[v], dist[u] + w(u,v))` for each edge. Because any shortest path has at most V-1 edges, V-1 passes suffice to converge. A final V-th pass that still relaxes some edge proves a negative cycle is reachable.

In practice the O(V·E) cost makes it slower than Dijkstra, so it is used specifically where negative weights or cycle detection matter — most notably as the first phase of Johnson's all-pairs algorithm and in distance-vector routing protocols like RIP. A common optimization is to stop early once a full pass relaxes no edge.
