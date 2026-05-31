import type { TreeStep, TreeNodeView } from './types';

/**
 * Trie (prefix tree) — insertion.
 *
 *        (root)            insert "to", "tea", "ten":
 *          │t                shared prefix "t" is stored once;
 *         (t)                terminal nodes mark complete words.
 *        /   \
 *      o*     e
 *            / \
 *          a*   n*
 *
 * `trieInsertSteps` emits one TreeStep per inserted word, highlighting the path
 * of characters touched. Pure and deterministic. Children are kept in
 * insertion order for stable layout.
 */

interface TrieNode {
  id: string;
  label: string; // single char, or "root"
  children: Map<string, TrieNode>;
  terminal: boolean;
}

function flatten(root: TrieNode): TreeNodeView[] {
  const out: TreeNodeView[] = [];
  const walk = (n: TrieNode) => {
    out.push({
      id: n.id,
      label: n.label,
      children: [...n.children.values()].map((c) => c.id),
      terminal: n.terminal,
    });
    for (const c of n.children.values()) walk(c);
  };
  walk(root);
  return out;
}

export function trieInsertSteps(words: string[]): TreeStep[] {
  let counter = 0;
  const root: TrieNode = {
    id: `n${counter++}`,
    label: 'root',
    children: new Map(),
    terminal: false,
  };

  if (words.length === 0) {
    return [
      {
        kind: 'tree',
        nodes: flatten(root),
        rootId: root.id,
        highlight: [root.id],
        note: 'Empty trie — only the root exists.',
      },
    ];
  }

  const steps: TreeStep[] = [];
  for (const word of words) {
    const path: string[] = [root.id];
    let cur = root;
    for (const ch of word) {
      let next = cur.children.get(ch);
      if (!next) {
        next = { id: `n${counter++}`, label: ch, children: new Map(), terminal: false };
        cur.children.set(ch, next);
      }
      path.push(next.id);
      cur = next;
    }
    cur.terminal = true;
    steps.push({
      kind: 'tree',
      nodes: flatten(root),
      rootId: root.id,
      highlight: [...path],
      note: word.length ? `Inserted "${word}".` : 'Inserted empty string (root marked terminal).',
    });
  }
  return steps;
}

/**
 * Whether `word` is a complete word in the trie built from `words`. Exposed for
 * tests: every inserted word must be retrievable, and prefixes that were not
 * inserted as whole words must not be.
 */
export function trieHas(words: string[], word: string): boolean {
  const root: TrieNode = { id: 'r', label: 'root', children: new Map(), terminal: false };
  for (const w of words) {
    let cur = root;
    for (const ch of w) {
      let next = cur.children.get(ch);
      if (!next) {
        next = { id: 'x', label: ch, children: new Map(), terminal: false };
        cur.children.set(ch, next);
      }
      cur = next;
    }
    cur.terminal = true;
  }
  let cur = root;
  for (const ch of word) {
    const next = cur.children.get(ch);
    if (!next) return false;
    cur = next;
  }
  return cur.terminal;
}
