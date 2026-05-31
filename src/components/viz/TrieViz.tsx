import VizPlayer from './VizPlayer';
import { trieInsertSteps } from '../../lib/algorithms/trie';

// Words chosen to share prefixes ("t", "te") so the prefix-tree structure is
// visible. Runs the real trieInsertSteps generator.
const DEMO = ['to', 'tea', 'ten', 'ted', 'i', 'in', 'inn'];

export default function TrieViz() {
  return <VizPlayer steps={trieInsertSteps(DEMO)} label="Trie insertion" />;
}
