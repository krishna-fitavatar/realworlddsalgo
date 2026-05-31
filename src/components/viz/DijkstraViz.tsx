import VizPlayer from './VizPlayer';
import { dijkstraSteps, type WeightedGraph } from '../../lib/algorithms/dijkstra';

// A small undirected weighted graph. Runs the real dijkstraSteps generator
// from source A.
const GRAPH: WeightedGraph = {
  nodes: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
    { id: 'E', label: 'E' },
    { id: 'F', label: 'F' },
  ],
  edges: [
    { source: 'A', target: 'B', weight: 7 },
    { source: 'A', target: 'C', weight: 9 },
    { source: 'A', target: 'F', weight: 14 },
    { source: 'B', target: 'C', weight: 10 },
    { source: 'B', target: 'D', weight: 15 },
    { source: 'C', target: 'D', weight: 11 },
    { source: 'C', target: 'F', weight: 2 },
    { source: 'D', target: 'E', weight: 6 },
    { source: 'E', target: 'F', weight: 9 },
  ],
};

export default function DijkstraViz() {
  return <VizPlayer steps={dijkstraSteps(GRAPH, 'A')} label="Dijkstra shortest paths" />;
}
