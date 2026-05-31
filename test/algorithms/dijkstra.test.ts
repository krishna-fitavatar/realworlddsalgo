import { describe, it, expect } from 'vitest';
import { dijkstraSteps, dijkstraDistances, type WeightedGraph } from '../../src/lib/algorithms/dijkstra';

const GRAPH: WeightedGraph = {
  nodes: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
  ],
  edges: [
    { source: 'A', target: 'B', weight: 1 },
    { source: 'B', target: 'C', weight: 2 },
    { source: 'A', target: 'C', weight: 4 },
    { source: 'C', target: 'D', weight: 1 },
  ],
};

describe('dijkstraDistances — correctness', () => {
  it('computes shortest distances, preferring the cheaper multi-hop path', () => {
    // A→C direct is 4, but A→B→C is 1+2=3, so C must be 3 and D=4.
    expect(dijkstraDistances(GRAPH, 'A')).toEqual({ A: 0, B: 1, C: 3, D: 4 });
  });

  it('source distance is 0', () => {
    expect(dijkstraDistances(GRAPH, 'A').A).toBe(0);
  });

  it('unreachable nodes stay Infinity', () => {
    const g: WeightedGraph = {
      nodes: [{ id: 'A', label: 'A' }, { id: 'X', label: 'X' }],
      edges: [],
    };
    expect(dijkstraDistances(g, 'A')).toEqual({ A: 0, X: Infinity });
  });

  it('directed edges are not traversed backwards', () => {
    const g: WeightedGraph = {
      nodes: [{ id: 'A', label: 'A' }, { id: 'B', label: 'B' }],
      edges: [{ source: 'A', target: 'B', weight: 5 }],
      directed: true,
    };
    expect(dijkstraDistances(g, 'B')).toEqual({ A: Infinity, B: 0 });
  });
});

describe('dijkstraSteps — frames + preconditions', () => {
  it('emits the initial frame plus one frame per settled node', () => {
    const steps = dijkstraSteps(GRAPH, 'A');
    // 1 initial + 4 settled = 5
    expect(steps).toHaveLength(5);
    expect(steps[0].current).toBeNull();
    expect(steps[steps.length - 1].visited).toHaveLength(4);
  });

  it('is deterministic — same input, same notes', () => {
    const a = dijkstraSteps(GRAPH, 'A').map((s) => s.note);
    const b = dijkstraSteps(GRAPH, 'A').map((s) => s.note);
    expect(a).toEqual(b);
  });

  it('rejects negative weights (Dijkstra precondition)', () => {
    const bad: WeightedGraph = {
      nodes: [{ id: 'A', label: 'A' }, { id: 'B', label: 'B' }],
      edges: [{ source: 'A', target: 'B', weight: -1 }],
    };
    expect(() => dijkstraSteps(bad, 'A')).toThrow(/non-negative/);
  });

  it('handles a source that is not in the graph', () => {
    const steps = dijkstraSteps(GRAPH, 'Z');
    expect(steps).toHaveLength(1);
    expect(steps[0].note).toMatch(/not in the graph/);
  });
});
