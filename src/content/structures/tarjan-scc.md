---
name: "Tarjan's SCC"
slug: "tarjan-scc"
category: "graph"
summary: "Tarjan's algorithm finds all strongly connected components of a directed graph in a single depth-first traversal using discovery indices and low-link values, running in linear time."
complexity:
  time:
    "all_sccs": "O(V + E)"
  space: "O(V)"
viz: null
---

Tarjan's strongly connected components (SCC) algorithm partitions a directed graph into maximal sets of vertices where every vertex is reachable from every other vertex in the same set. It is a cornerstone of cycle detection and dependency analysis: contracting each SCC into a single node yields the condensation, a directed acyclic graph (DAG).

The algorithm performs one depth-first search, assigning each vertex an increasing discovery index and a "low-link" value — the smallest index reachable through the DFS subtree and at most one back-edge. Vertices are pushed onto an explicit stack as they are visited and kept marked as on-stack. When DFS finishes a vertex whose low-link equals its own index, that vertex is the root of an SCC, and everything above it on the stack (down to and including it) is popped off as one component.

In practice the subtle part is the low-link update rule: when relaxing an edge to an already-visited neighbor, you only fold in its index if that neighbor is still on the stack (cross-edges to finished SCCs must be ignored). Tarjan finds SCCs in a single pass with one stack, making it more cache-friendly and constant-factor faster than the two-pass Kosaraju algorithm, though it needs careful iterative rewriting to avoid stack overflow on deep graphs.
