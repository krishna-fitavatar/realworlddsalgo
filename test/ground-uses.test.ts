import { describe, it, expect } from 'vitest';
import { structureTokens, groundUsesRef, groundStructure } from '../scripts/ground-uses.mjs';

// Fetch stub: maps "repo:path" → file body (or undefined → 404).
function fakeFetch(files: Record<string, string | undefined>) {
  return async (url: string) => {
    // url is https://raw.githubusercontent.com/<repo>/<ref>/<path>
    const m = url.match(/raw\.githubusercontent\.com\/([^/]+\/[^/]+)\/[^/]+\/(.+)$/);
    const key = m ? `${m[1]}:${m[2]}` : '';
    const body = files[key];
    const ok = body !== undefined;
    return {
      status: ok ? 200 : 404,
      ok,
      headers: { get: () => null },
      text: async () => body ?? '',
    };
  };
}
const opts = (files: Record<string, string | undefined>) => ({
  fetchImpl: fakeFetch(files),
  sleepImpl: async () => {},
});

describe('structureTokens', () => {
  it('derives slug + name variants', () => {
    const t = structureTokens({ name: 'Red-Black Tree', slug: 'red-black-tree' });
    expect(t).toContain('redblacktree');
    expect(t).toContain('red_black_tree');
    expect(t).toContain('red-black-tree'.split('-').join(' '));
    expect(t).toContain('tree');
  });
});

describe('groundUsesRef — CONFIRM path', () => {
  it('confirms when a token is present in the fetched file', async () => {
    const ref = {
      repo: 'torvalds/linux',
      url: 'https://github.com/torvalds/linux/blob/master/lib/rbtree.c',
      path: 'lib/rbtree.c',
      tokens: ['rbtree', 'red_black'],
    };
    const v = await groundUsesRef(ref, opts({ 'torvalds/linux:lib/rbtree.c': '/* rbtree implementation */' }));
    expect(v.ok).toBe(true);
    expect(v.path).toBe('lib/rbtree.c');
  });
});

describe('groundUsesRef — REJECT paths (the trust gate)', () => {
  it('REJECTS when the token is ABSENT from the file (false uses claim)', async () => {
    const ref = {
      repo: 'torvalds/linux',
      url: 'https://github.com/torvalds/linux/blob/master/lib/rbtree.c',
      path: 'lib/rbtree.c',
      tokens: ['splaytree'],
    };
    // file exists but contains no matching token → must reject
    const v = await groundUsesRef(ref, opts({ 'torvalds/linux:lib/rbtree.c': 'int main() { return 0; }' }));
    expect(v.ok).toBe(false);
    expect(v.reason).toMatch(/found in/);
  });

  it('REJECTS a uses ref with no path', async () => {
    const v = await groundUsesRef(
      { repo: 'a/b', url: 'https://github.com/a/b', tokens: ['x'] },
      opts({}),
    );
    expect(v.ok).toBe(false);
    expect(v.reason).toMatch(/path is required/);
  });

  it('REJECTS when the url points at a different repo', async () => {
    const v = await groundUsesRef(
      { repo: 'networkx/networkx', url: 'https://github.com/numpy/numpy/blob/main/x.py', path: 'x.py', tokens: ['dijkstra'] },
      opts({ 'networkx/networkx:x.py': 'dijkstra' }),
    );
    expect(v.ok).toBe(false);
    expect(v.reason).toMatch(/does not point at repo/);
  });

  it('REJECTS when the file 404s (path not real)', async () => {
    const v = await groundUsesRef(
      { repo: 'a/b', url: 'https://github.com/a/b/blob/main/ghost.py', path: 'ghost.py', tokens: ['x'] },
      opts({}), // no files → 404
    );
    expect(v.ok).toBe(false);
    expect(v.reason).toMatch(/could not fetch/);
  });

  it('REJECTS when there are no tokens to verify against', async () => {
    const v = await groundUsesRef(
      { repo: 'a/b', url: 'https://github.com/a/b/blob/main/x.py', path: 'x.py', tokens: [] },
      opts({ 'a/b:x.py': 'anything' }),
    );
    expect(v.ok).toBe(false);
    expect(v.reason).toMatch(/no structure tokens/);
  });
});

describe('groundStructure', () => {
  it('keeps grounded uses + valid implements, drops the rest with reasons', async () => {
    const refs = [
      { type: 'uses', repo: 'torvalds/linux', url: 'https://github.com/torvalds/linux/blob/master/lib/rbtree.c', path: 'lib/rbtree.c' },
      { type: 'uses', repo: 'fake/repo', url: 'https://github.com/fake/repo/blob/main/none.c', path: 'none.c' },
      { type: 'implements', repo: 'w8r/avl', url: 'https://github.com/w8r/avl' },
      { type: 'implements', repo: 'w8r/avl', url: 'https://github.com/someone/else' },
    ];
    const { kept, dropped } = await groundStructure(
      { refs, tokens: ['rbtree'] },
      opts({ 'torvalds/linux:lib/rbtree.c': 'rbtree code' }), // fake/repo:none.c → 404
    );
    const keptRepos = kept.map((r) => r.repo);
    expect(keptRepos).toContain('torvalds/linux'); // grounded uses
    expect(keptRepos).toContain('w8r/avl'); // valid implements (url matches)
    expect(kept).toHaveLength(2);
    expect(dropped).toHaveLength(2); // 404 uses + mismatched implements
    expect(dropped.every((d) => d.reason)).toBe(true);
  });
});
