---
name: "Coin Change (DP)"
slug: "coin-change"
category: "other"
summary: "Coin Change is a dynamic-programming technique that computes either the minimum number of coins or the number of distinct ways to form a target amount from a set of denominations, by building up answers for every sub-amount from 0 to the target."
complexity:
  time:
    "min coins (amount, n denominations)": "O(amount * n)"
    "count ways": "O(amount * n)"
  space: "O(amount)"
viz: null
---

Coin Change is the canonical introduction to one-dimensional dynamic programming. Given coin denominations and a target amount, two variants dominate: the **minimum-coins** problem (fewest coins summing to the amount) and the **counting** problem (how many distinct combinations sum to the amount). Both are unbounded knapsack problems — each coin may be reused any number of times.

The solution fills a table `dp[0..amount]` where each entry depends on smaller amounts already computed. For minimum coins, `dp[a] = min(dp[a], dp[a - coin] + 1)` over every coin; `dp[0] = 0` and unreachable amounts stay at infinity. For counting ways, `dp[a] += dp[a - coin]` with `dp[0] = 1`. The runtime is the product of the amount and the number of denominations, with linear space in the amount.

The detail that matters in practice is **loop ordering in the counting variant**: iterating coins on the outer loop and amounts on the inner loop counts unordered combinations (treating {1,2} and {2,1} as one), while swapping the loops counts ordered permutations. Choosing the wrong order is the most common bug. Note that the obvious greedy approach (always take the largest coin) only gives the optimal minimum for canonical coin systems like USD; arbitrary denominations require the DP.
