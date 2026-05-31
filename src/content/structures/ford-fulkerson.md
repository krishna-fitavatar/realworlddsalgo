---
name: "Ford-Fulkerson (Max Flow)"
slug: "ford-fulkerson"
category: "graph"
summary: "Ford-Fulkerson computes maximum source-to-sink flow in a capacitated directed graph by repeatedly augmenting flow along residual paths until none remain, realizing the max-flow min-cut theorem."
complexity:
  time:
    "Ford-Fulkerson (DFS, integer capacities)": "O(E * f)"
    "Edmonds-Karp (BFS)": "O(V * E^2)"
    "Find augmenting path (BFS/DFS)": "O(E)"
  space: "O(V + E)"
viz: null
---

**Ford-Fulkerson** computes the maximum flow from a source to a sink in a directed graph with edge capacities. It is the foundational method behind the max-flow min-cut theorem: the value of a maximum flow equals the capacity of the minimum cut separating source from sink.

The method works by repeatedly finding an *augmenting path* from source to sink in the *residual graph* (the network of remaining capacity, including backward edges that allow "undoing" prior flow). It pushes flow equal to the path's bottleneck capacity, updates residual capacities, and repeats until no augmenting path exists. Each backward residual edge lets later augmentations reroute flow, which is what guarantees a globally optimal result rather than a greedy local one.

In practice the way you find augmenting paths is what matters. Plain Ford-Fulkerson with DFS can run in O(E·f) time and may not even terminate on irrational capacities. The Edmonds-Karp refinement picks the *shortest* augmenting path via BFS, giving a capacity-independent O(V·E²) bound, and is what most real libraries ship. For dense or high-throughput graphs, Dinic's blocking-flow variant is the common upgrade.
