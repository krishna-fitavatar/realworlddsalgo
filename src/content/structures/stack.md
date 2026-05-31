---
name: "Stack"
slug: "stack"
category: "linear"
summary: "A stack is a last-in-first-out (LIFO) linear collection where elements are added and removed only from one end (the top), giving constant-time push and pop."
complexity:
  time:
    "push": "O(1)"
    "pop": "O(1)"
    "peek": "O(1)"
    "search": "O(n)"
  space: "O(n)"
viz: null
---

A **stack** is a linear data structure that follows the Last-In-First-Out (LIFO) principle: the most recently added element is the first one removed. It exposes a deliberately narrow interface — `push` to add an element to the top, `pop` to remove and return the top, and `peek` (or `top`) to inspect it without removing. This restricted access is the whole point; it makes the structure simple to reason about and trivially fast.

Stacks are typically backed by either a dynamic array or a singly linked list. With an array, the top is the last index, so `push` and `pop` are amortized O(1) (occasionally O(n) when the array resizes); with a linked list, you prepend/remove at the head for true O(1) operations. Either way, only the top element is directly reachable — searching for an arbitrary value is O(n) because you must pop or scan through elements.

In practice, the stack's defining role is managing nested or reversible work. The call stack tracks function invocations and local frames; compilers and parsers use stacks for expression evaluation, bracket matching, and recursive-descent parsing; depth-first search and backtracking algorithms use an explicit stack to remember where to resume; and undo/redo history is a stack of states. The key practical caveat is bounded depth — unbounded recursion or unchecked growth leads to stack overflow.
