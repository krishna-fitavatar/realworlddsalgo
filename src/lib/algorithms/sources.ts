// Raw source of each algorithm module, imported as a string via Vite's `?raw`
// loader. Rendered on the structure page with Astro's <Code> (Shiki) so the
// "code-driven viz" claim is literal: readers see the exact code that produced
// the animation. Keyed by the `source.module` value in structure frontmatter.
import bst from './bst.ts?raw';
import trie from './trie.ts?raw';
import dijkstra from './dijkstra.ts?raw';

export const sources: Record<string, string> = {
  'bst.ts': bst,
  'trie.ts': trie,
  'dijkstra.ts': dijkstra,
};
