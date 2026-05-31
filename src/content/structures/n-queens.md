---
name: "N-Queens (Backtracking)"
slug: "n-queens"
category: "other"
summary: "N-Queens places N chess queens on an N×N board so none attack each other, solved by depth-first backtracking that places one queen per row and prunes branches that violate column or diagonal constraints."
complexity:
  time:
    "find one / count all solutions (worst case)": "O(N!)"
    "constraint check per placement (with column/diagonal sets)": "O(1)"
  space: "O(N)"
viz: null
---

N-Queens is the classic constraint-satisfaction puzzle: place N queens on an N×N chessboard so that no two share a row, column, or diagonal. It is the canonical teaching example for backtracking, and it generalizes the original 8-queens problem, which has exactly 92 solutions.

The standard approach assigns exactly one queen per row and recurses row by row. For each row it tries every column, checks whether that square conflicts with any already-placed queen, and if safe, recurses to the next row; on a dead end it removes the queen and tries the next column (backtracking). Conflict checks become O(1) by tracking occupied columns and the two diagonal directions (encoded as row+col and row−col) in boolean arrays or bitmasks, rather than rescanning the board.

In practice the algorithm's value is the pruning: a naive generate-all-placements approach is astronomically large, but abandoning a partial board the instant a constraint breaks collapses the search dramatically. The bitmask variant (one integer each for columns, left diagonals, right diagonals) is the fast production form, since the "available squares" mask and its lowest set bit drive placement with cheap bitwise ops and excellent cache behavior.
