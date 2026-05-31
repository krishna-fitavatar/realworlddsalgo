import VizPlayer from './VizPlayer';
import { bstInsertSteps } from '../../lib/algorithms/bst';

// Demo input: a classic unbalanced-ish insertion order that shows left/right
// branching clearly. The viz runs the real bstInsertSteps generator.
const DEMO = [8, 3, 10, 1, 6, 14, 4, 7, 13];

export default function BstViz() {
  return <VizPlayer steps={bstInsertSteps(DEMO)} label="BST insertion" />;
}
