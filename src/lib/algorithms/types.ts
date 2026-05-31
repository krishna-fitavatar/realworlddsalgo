/**
 * LOGIC LAYER — step contracts.
 *
 * A "step" is one frame of an algorithm's execution: enough state to render a
 * single picture plus a human note. There is NO universal step shape — each
 * topology family has its own, because a sort frame (array + swap) and a
 * Dijkstra frame (graph + frontier + distances) are genuinely different things.
 *
 *   ArrayStep  — linear structures (sorts, scans)
 *   TreeStep   — rooted trees and tries (BST, trie, heap)
 *   GraphStep  — general graphs (Dijkstra, BFS/DFS)
 *
 * Generators are pure: (input) -> Step[]. No DOM, no framework. That makes the
 * algorithm unit-testable on its step sequence, and lets the Preact island stay
 * a dumb renderer of the current frame.
 */

export interface ArrayStep {
  kind: 'array';
  values: number[];
  /** indices to emphasize this frame (compared, swapped, settled) */
  highlight: number[];
  note: string;
}

/** A node in a rendered tree/trie. `children` holds child node ids in order. */
export interface TreeNodeView {
  id: string;
  label: string;
  children: string[];
  /** true for trie nodes that terminate a word */
  terminal?: boolean;
}

export interface TreeStep {
  kind: 'tree';
  nodes: TreeNodeView[];
  rootId: string | null;
  /** node ids to emphasize this frame (path being walked, node inserted) */
  highlight: string[];
  note: string;
}

export interface GraphNodeView {
  id: string;
  label: string;
}

export interface GraphEdgeView {
  source: string;
  target: string;
  weight: number;
}

export interface GraphStep {
  kind: 'graph';
  nodes: GraphNodeView[];
  edges: GraphEdgeView[];
  /** best-known distance from the source; Infinity until reached */
  distances: Record<string, number>;
  /** node ids whose shortest path is finalized */
  visited: string[];
  /** node being settled this frame */
  current: string | null;
  note: string;
}

export type Step = ArrayStep | TreeStep | GraphStep;
