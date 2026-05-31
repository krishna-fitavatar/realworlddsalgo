import { describe, it, expect } from 'vitest';
import { bstInsertSteps, bstInOrder } from '../../src/lib/algorithms/bst';

describe('bstInOrder — the core BST invariant', () => {
  it('in-order traversal is sorted ascending', () => {
    const input = [8, 3, 10, 1, 6, 14, 4, 7, 13];
    expect(bstInOrder(input)).toEqual([...input].sort((a, b) => a - b));
  });

  it('handles already-sorted input (degenerate / linked-list shape)', () => {
    expect(bstInOrder([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('empty input → empty traversal', () => {
    expect(bstInOrder([])).toEqual([]);
  });

  it('single element', () => {
    expect(bstInOrder([42])).toEqual([42]);
  });

  it('keeps duplicates (they go right, not dropped)', () => {
    expect(bstInOrder([5, 5, 5])).toEqual([5, 5, 5]);
    expect(bstInOrder([5, 3, 5, 3])).toEqual([3, 3, 5, 5]);
  });
});

describe('bstInsertSteps — frame sequence', () => {
  it('empty input yields one explanatory frame', () => {
    const steps = bstInsertSteps([]);
    expect(steps).toHaveLength(1);
    expect(steps[0].rootId).toBeNull();
    expect(steps[0].nodes).toHaveLength(0);
  });

  it('emits one frame per inserted value', () => {
    const steps = bstInsertSteps([5, 3, 8]);
    expect(steps).toHaveLength(3);
    expect(steps[steps.length - 1].nodes).toHaveLength(3);
    expect(steps[steps.length - 1].rootId).toBe(steps[0].rootId);
  });

  it('every highlighted id exists among the frame nodes (consistency)', () => {
    const steps = bstInsertSteps([8, 3, 10, 1, 6]);
    for (const step of steps) {
      const ids = new Set(step.nodes.map((n) => n.id));
      for (const h of step.highlight) expect(ids.has(h)).toBe(true);
    }
  });

  it('single element produces a one-node tree', () => {
    const steps = bstInsertSteps([7]);
    expect(steps).toHaveLength(1);
    expect(steps[0].nodes).toHaveLength(1);
    expect(steps[0].nodes[0].label).toBe('7');
  });
});
