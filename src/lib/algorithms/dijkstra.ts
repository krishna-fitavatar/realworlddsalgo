import type { GraphStep, GraphEdgeView, GraphNodeView } from './types';

/**
 * Dijkstra's shortest paths from a single source over a weighted graph.
 *
 *      (A)──4──(B)          settle order is by smallest tentative distance.
 *       │      /            each frame: one node finalized, neighbors relaxed.
 *       1    2
 *       │  /
 *      (C)──5──(D)
 *
 * `dijkstraSteps` emits the initial frame plus one frame per settled node.
 * Pure and deterministic: ties are broken by node id so the sequence is stable.
 * Negative weights are rejected (Dijkstra's precondition).
 */

export interface WeightedGraph {
  nodes: GraphNodeView[];
  edges: GraphEdgeView[];
  /** treat edges as directed source→target; default false (undirected) */
  directed?: boolean;
}

function adjacency(graph: WeightedGraph): Map<string, { to: string; weight: number }[]> {
  const adj = new Map<string, { to: string; weight: number }[]>();
  for (const n of graph.nodes) adj.set(n.id, []);
  for (const e of graph.edges) {
    if (e.weight < 0) throw new Error(`Dijkstra requires non-negative weights; got ${e.weight}`);
    adj.get(e.source)?.push({ to: e.target, weight: e.weight });
    if (!graph.directed) adj.get(e.target)?.push({ to: e.source, weight: e.weight });
  }
  return adj;
}

export function dijkstraSteps(graph: WeightedGraph, sourceId: string): GraphStep[] {
  const ids = graph.nodes.map((n) => n.id);
  if (!ids.includes(sourceId)) {
    return [
      {
        kind: 'graph',
        nodes: graph.nodes,
        edges: graph.edges,
        distances: Object.fromEntries(ids.map((id) => [id, Infinity])),
        visited: [],
        current: null,
        note: `Source "${sourceId}" is not in the graph.`,
      },
    ];
  }

  const adj = adjacency(graph);
  const dist: Record<string, number> = Object.fromEntries(ids.map((id) => [id, Infinity]));
  dist[sourceId] = 0;
  const visited: string[] = [];
  const steps: GraphStep[] = [];

  const frame = (current: string | null, note: string): GraphStep => ({
    kind: 'graph',
    nodes: graph.nodes,
    edges: graph.edges,
    distances: { ...dist },
    visited: [...visited],
    current,
    note,
  });

  steps.push(frame(null, `Start: distance to ${sourceId} is 0, all others ∞.`));

  for (;;) {
    // Pick the unvisited node with the smallest tentative distance.
    // Ties broken by id for determinism.
    let next: string | null = null;
    let best = Infinity;
    for (const id of ids) {
      if (visited.includes(id)) continue;
      const d = dist[id];
      if (d < best || (d === best && next !== null && id < next)) {
        best = d;
        next = id;
      }
    }
    if (next === null || best === Infinity) break; // remaining nodes unreachable

    visited.push(next);
    const relaxed: string[] = [];
    for (const { to, weight } of adj.get(next) ?? []) {
      if (visited.includes(to)) continue;
      const cand = dist[next] + weight;
      if (cand < dist[to]) {
        dist[to] = cand;
        relaxed.push(`${to}=${cand}`);
      }
    }
    steps.push(
      frame(
        next,
        relaxed.length
          ? `Settle ${next} (dist ${dist[next]}); relax ${relaxed.join(', ')}.`
          : `Settle ${next} (dist ${dist[next]}); no improvements.`,
      ),
    );
  }
  return steps;
}

/**
 * Final shortest-path distances from `sourceId`. Exposed for tests:
 * unreachable nodes are Infinity, the source is 0.
 */
export function dijkstraDistances(graph: WeightedGraph, sourceId: string): Record<string, number> {
  const steps = dijkstraSteps(graph, sourceId);
  return steps[steps.length - 1].distances;
}
