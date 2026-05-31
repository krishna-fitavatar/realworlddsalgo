---
name: "A* Search"
slug: "a-star"
category: "graph"
summary: "A* is a best-first graph search that finds a shortest path from a start node to a goal by expanding nodes in order of f(n) = g(n) + h(n), where g is the cost so far and h is an admissible heuristic estimate of the remaining cost."
complexity:
  time:
    "search": "O(b^d)"
    "search_with_consistent_heuristic": "O(E)"
  space: "O(b^d)"
viz: null
---

A* Search is a pathfinding and graph-traversal algorithm that finds the lowest-cost path between two nodes. It generalizes Dijkstra's algorithm by adding a heuristic h(n) that estimates the cost from a node to the goal, focusing the search toward the destination instead of expanding uniformly in all directions.

The algorithm maintains a priority queue (the open set) ordered by f(n) = g(n) + h(n). At each step it pops the node with the lowest f, relaxes its neighbors by updating their g-values and parent pointers, and pushes them onto the queue. When the goal is popped, the path is reconstructed by following parent pointers backward. If the heuristic is admissible (never overestimates the true remaining cost), A* is guaranteed to return an optimal path; if it is also consistent (monotone), each node is expanded at most once.

In practice the heuristic is everything: a perfect heuristic makes A* expand only nodes on the optimal path, while h = 0 degrades it to Dijkstra. For grid maps, Manhattan or octile distance are common choices, and weighting the heuristic (Weighted A*) trades optimality for large speedups. The open set should be a binary heap, and a closed set (or per-node visited flag) avoids reprocessing already-finalized nodes.
