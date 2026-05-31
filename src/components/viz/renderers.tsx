import { useMemo } from 'preact/hooks';
import { hierarchy, tree } from 'd3-hierarchy';
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  type SimulationNodeDatum,
} from 'd3-force';
import type { ArrayStep, GraphStep, TreeStep, TreeNodeView } from '../../lib/algorithms/types';

/**
 * TEMPLATE LAYER (viz renderers). d3 does the layout MATH; Preact does the DOM.
 * No d3 selections — positions are computed, then rendered declaratively, which
 * keeps rendering reactive and testable-by-inspection.
 *
 * One renderer per topology family (the step "kind"):
 *   array → ArrayView   tree → TreeView   graph → GraphView
 */

const HL = '#f59e0b'; // highlight (amber)
const VISITED = '#16a34a'; // settled (green)
const BASE = '#e5e7eb'; // node fill
const STROKE = '#374151';

export function ArrayView({ step }: { step: ArrayStep }) {
  const w = 60;
  return (
    <svg viewBox={`0 0 ${Math.max(step.values.length * w, w)} 90`} role="img" aria-label="array state">
      {step.values.map((v, i) => {
        const on = step.highlight.includes(i);
        return (
          <g transform={`translate(${i * w + 4}, 20)`} key={i}>
            <rect width={w - 8} height={44} rx={6} fill={on ? HL : BASE} stroke={STROKE} />
            <text x={(w - 8) / 2} y={28} text-anchor="middle" font-size="16">{v}</text>
            <text x={(w - 8) / 2} y={62} text-anchor="middle" font-size="11" fill="#6b7280">{i}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function TreeView({ step }: { step: TreeStep }) {
  const layout = useMemo(() => {
    if (!step.rootId || step.nodes.length === 0) return null;
    const byId = new Map(step.nodes.map((n) => [n.id, n]));
    const rootNode = byId.get(step.rootId);
    if (!rootNode) return null;
    const root = hierarchy<TreeNodeView>(rootNode, (n) =>
      n.children.map((id) => byId.get(id)).filter((c): c is TreeNodeView => Boolean(c)),
    );
    const layoutTree = tree<TreeNodeView>().nodeSize([56, 78]);
    // layoutTree() assigns x/y and returns the node typed as a point node
    // (x/y: number), unlike the pre-layout HierarchyNode (x/y: number|undefined).
    const positioned = layoutTree(root);
    const xs = positioned.descendants().map((n) => n.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const offsetX = -minX + 30;
    const width = maxX - minX + 60;
    const height = (positioned.height + 1) * 78 + 20;
    return { positioned, offsetX, width, height };
  }, [step]);

  if (!layout) return <p class="viz-empty">{step.note}</p>;
  const { positioned, offsetX, width, height } = layout;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="tree state">
      {positioned.links().map((l, i) => (
        <line
          key={i}
          x1={l.source.x + offsetX}
          y1={l.source.y + 30}
          x2={l.target.x + offsetX}
          y2={l.target.y + 30}
          stroke={STROKE}
          stroke-width={1.5}
        />
      ))}
      {positioned.descendants().map((n) => {
        const on = step.highlight.includes(n.data.id);
        const terminal = n.data.terminal;
        return (
          <g transform={`translate(${n.x + offsetX}, ${n.y + 30})`} key={n.data.id}>
            {terminal && <circle r={22} fill="none" stroke={VISITED} stroke-width={2} />}
            <circle r={18} fill={on ? HL : BASE} stroke={STROKE} stroke-width={1.5} />
            <text text-anchor="middle" dy={5} font-size="14">{n.data.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

interface SimNode extends SimulationNodeDatum {
  id: string;
  label: string;
}

export function GraphView({ step }: { step: GraphStep }) {
  // Layout is computed once from the (constant) node/edge set and reused across
  // frames. d3-force initial positions are deterministic, so the layout is
  // stable across reloads. Memo key is the node/edge identity, which is the
  // same array reference for every frame from dijkstraSteps.
  const layout = useMemo(() => {
    const W = 420;
    const H = 320;
    const nodes: SimNode[] = step.nodes.map((n) => ({ id: n.id, label: n.label }));
    const links = step.edges.map((e) => ({ source: e.source, target: e.target, weight: e.weight }));
    const sim = forceSimulation<SimNode>(nodes)
      .force('charge', forceManyBody().strength(-400))
      .force(
        'link',
        forceLink<SimNode, (typeof links)[number]>(links)
          .id((d) => d.id)
          .distance(110),
      )
      .force('center', forceCenter(W / 2, H / 2))
      .stop();
    for (let i = 0; i < 300; i++) sim.tick();
    const pos = new Map(nodes.map((n) => [n.id, { x: n.x ?? W / 2, y: n.y ?? H / 2 }]));
    return { W, H, pos };
  }, [step.nodes, step.edges]);

  const { W, H, pos } = layout;
  const fmt = (d: number) => (d === Infinity ? '∞' : String(d));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="graph state">
      {step.edges.map((e, i) => {
        const a = pos.get(e.source)!;
        const b = pos.get(e.target)!;
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={STROKE} stroke-width={1.5} />
            <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} text-anchor="middle" font-size="12" fill="#2563eb">
              {e.weight}
            </text>
          </g>
        );
      })}
      {step.nodes.map((n) => {
        const p = pos.get(n.id)!;
        const settled = step.visited.includes(n.id);
        const current = step.current === n.id;
        const fill = current ? HL : settled ? VISITED : BASE;
        return (
          <g transform={`translate(${p.x}, ${p.y})`} key={n.id}>
            <circle r={20} fill={fill} stroke={STROKE} stroke-width={1.5} />
            <text text-anchor="middle" dy={5} font-size="14">{n.label}</text>
            <text text-anchor="middle" dy={36} font-size="12" fill="#6b7280">
              {fmt(step.distances[n.id])}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
