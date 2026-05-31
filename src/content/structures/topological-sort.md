---
name: "Topological Sort"
slug: "topological-sort"
category: "graph"
summary: "Topological sort produces a linear ordering of a directed acyclic graph's vertices such that every edge points from an earlier vertex to a later one, encoding valid orders for tasks with dependencies."
complexity:
  time:
    "kahn_bfs": "O(V + E)"
    "dfs": "O(V + E)"
  space: "O(V + E)"
viz: null
---

Topological sort takes a directed acyclic graph (DAG) and outputs a linear ordering of its vertices where, for every directed edge u -> v, u appears before v. It only exists when the graph has no cycles, so the algorithm doubles as a cycle detector: if no valid ordering can be produced, the graph contains a cycle. The ordering is generally not unique.

Two standard approaches exist. Kahn's algorithm is BFS-based: it computes the in-degree of every vertex, enqueues all vertices with in-degree zero, then repeatedly removes a vertex, appends it to the output, and decrements the in-degrees of its neighbors, enqueuing any that drop to zero. The DFS approach runs depth-first search and prepends each vertex to the result as its recursion finishes (post-order, then reverse). Both run in O(V + E) time and O(V + E) space.

In practice, topological sort is the backbone of dependency resolution: build systems decide compilation order, package managers resolve install order, spreadsheets recompute cells, and task schedulers sequence jobs. The detail that matters most is cycle handling — real inputs frequently contain accidental circular dependencies, so production code must detect them (Kahn's: fewer than V vertices emitted; DFS: a back edge to a node on the current stack) and report the offending cycle rather than silently emitting a partial or wrong order.
