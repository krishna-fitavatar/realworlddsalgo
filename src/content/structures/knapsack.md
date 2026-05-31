---
name: "0/1 Knapsack (DP)"
slug: "knapsack"
category: "other"
summary: "A dynamic-programming algorithm that selects a subset of items, each taken at most once, to maximize total value without exceeding a weight capacity, by building an optimal-value table over capacities and items."
complexity:
  time:
    "build": "O(n*W)"
    "query": "O(1)"
    "reconstruct": "O(n)"
  space: "O(n*W)"
viz: null
---

The 0/1 knapsack problem asks: given n items, each with a weight and a value, and a knapsack that holds at most W total weight, which subset maximizes value when each item is either fully taken or left out? It is the canonical NP-hard combinatorial optimization problem that nonetheless admits a clean pseudo-polynomial DP solution.

The standard solution fills a table dp[i][w] = the best value achievable using the first i items within capacity w. For each item you take the better of skipping it (dp[i-1][w]) or including it (dp[i-1][w - weight[i]] + value[i]), provided it fits. The answer is dp[n][W], and the chosen items are recovered by walking the table backward. A common optimization collapses the table to a single 1D array of size W+1 iterated right-to-left, cutting space to O(W).

The practical catch is that O(n*W) is pseudo-polynomial: it scales with the numeric capacity W, not its bit-length, so it blows up when weights or capacity are large or fractional. Real systems handle that by scaling/rounding weights to bound W, switching to branch-and-bound or an FPTAS for approximate answers, or handing the model to a general MILP/CP-SAT solver when constraints grow beyond a single capacity dimension.
