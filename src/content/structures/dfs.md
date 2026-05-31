---
name: "Depth-First Search"
slug: "dfs"
category: "graph"
summary: "Depth-First Search traverses a graph or tree by going as deep as possible along each branch before backtracking, using a stack (explicit or via recursion) to track the frontier."
complexity:
  time:
    "traversal": "O(V + E)"
    "path-exists": "O(V + E)"
  space: "O(V)"
viz: null
---

Depth-First Search (DFS) is a graph and tree traversal strategy that explores one path to its end before backtracking to explore alternatives. Starting from a source vertex, it visits an unvisited neighbor, then recurses into that neighbor's unvisited neighbors, and so on, only retreating when a vertex has no unexplored adjacent nodes.

Mechanically, DFS is the natural counterpart to BFS: where BFS uses a FIFO queue, DFS uses a LIFO stack — typically the implicit call stack of recursion, or an explicit stack for iterative implementations. A `visited` set prevents revisiting nodes in cyclic graphs. The order in which nodes are finished (post-order) is what makes DFS the backbone of topological sorting, cycle detection, and Tarjan's strongly-connected-components algorithm.

In practice, the thing that matters most is recursion depth: on deep or pathological graphs, recursive DFS can overflow the native stack (e.g., Python's default ~1000-frame limit), so production code on large inputs almost always uses an explicit stack. DFS is also memory-cheap relative to BFS on wide graphs since it only holds the current path plus the visited set, not an entire frontier layer.
