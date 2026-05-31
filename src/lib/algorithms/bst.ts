import type { TreeStep, TreeNodeView } from './types';

/**
 * Binary Search Tree — insertion.
 *
 *        (8)              insert 3:  8 > 3 → go left
 *       /   \             insert 10: 8 < 10 → go right
 *     (3)   (10)          duplicates go right (stable)
 *
 * `bstInsertSteps` emits one TreeStep per inserted value, highlighting the
 * comparison path walked to reach the insertion point. Pure and deterministic.
 */

interface BstNode {
  id: string;
  value: number;
  left: BstNode | null;
  right: BstNode | null;
}

function flatten(root: BstNode | null): TreeNodeView[] {
  const out: TreeNodeView[] = [];
  const walk = (n: BstNode | null) => {
    if (!n) return;
    const children: string[] = [];
    if (n.left) children.push(n.left.id);
    if (n.right) children.push(n.right.id);
    out.push({ id: n.id, label: String(n.value), children });
    walk(n.left);
    walk(n.right);
  };
  walk(root);
  return out;
}

export function bstInsertSteps(values: number[]): TreeStep[] {
  if (values.length === 0) {
    return [
      {
        kind: 'tree',
        nodes: [],
        rootId: null,
        highlight: [],
        note: 'Empty tree — nothing to insert.',
      },
    ];
  }

  const steps: TreeStep[] = [];
  let root: BstNode | null = null;
  let counter = 0;

  for (const value of values) {
    const path: string[] = [];
    if (root === null) {
      root = { id: `n${counter++}`, value, left: null, right: null };
      path.push(root.id);
    } else {
      let cur: BstNode = root;
      // Walk down comparing; duplicates take the right branch.
      for (;;) {
        path.push(cur.id);
        if (value < cur.value) {
          if (cur.left === null) {
            cur.left = { id: `n${counter++}`, value, left: null, right: null };
            path.push(cur.left.id);
            break;
          }
          cur = cur.left;
        } else {
          if (cur.right === null) {
            cur.right = { id: `n${counter++}`, value, left: null, right: null };
            path.push(cur.right.id);
            break;
          }
          cur = cur.right;
        }
      }
    }
    steps.push({
      kind: 'tree',
      nodes: flatten(root),
      rootId: root.id,
      highlight: [...path],
      note: `Inserted ${value}.`,
    });
  }
  return steps;
}

/**
 * In-order traversal of the BST built from `values`. Exposed for tests: a BST's
 * in-order traversal must be sorted ascending — the core invariant.
 */
export function bstInOrder(values: number[]): number[] {
  let root: BstNode | null = null;
  let counter = 0;
  for (const value of values) {
    if (root === null) {
      root = { id: `n${counter++}`, value, left: null, right: null };
      continue;
    }
    let cur: BstNode = root;
    for (;;) {
      if (value < cur.value) {
        if (cur.left === null) {
          cur.left = { id: `n${counter++}`, value, left: null, right: null };
          break;
        }
        cur = cur.left;
      } else {
        if (cur.right === null) {
          cur.right = { id: `n${counter++}`, value, left: null, right: null };
          break;
        }
        cur = cur.right;
      }
    }
  }
  const out: number[] = [];
  const walk = (n: BstNode | null) => {
    if (!n) return;
    walk(n.left);
    out.push(n.value);
    walk(n.right);
  };
  walk(root);
  return out;
}
