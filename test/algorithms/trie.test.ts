import { describe, it, expect } from 'vitest';
import { trieInsertSteps, trieHas } from '../../src/lib/algorithms/trie';

describe('trieHas — retrieval invariant', () => {
  const words = ['to', 'tea', 'ten', 'ted', 'i', 'in', 'inn'];

  it('finds every inserted word', () => {
    for (const w of words) expect(trieHas(words, w)).toBe(true);
  });

  it('does NOT report a prefix that was not inserted as a whole word', () => {
    expect(trieHas(words, 't')).toBe(false);
    expect(trieHas(words, 'te')).toBe(false);
    expect(trieHas(words, 'te')).toBe(false);
  });

  it('does report a prefix that WAS inserted as a word', () => {
    expect(trieHas(words, 'in')).toBe(true);
    expect(trieHas(words, 'i')).toBe(true);
  });

  it('rejects absent keys', () => {
    expect(trieHas(words, 'xyz')).toBe(false);
    expect(trieHas([], 'a')).toBe(false);
  });
});

describe('trieInsertSteps — frame sequence', () => {
  it('empty word list yields a single root-only frame', () => {
    const steps = trieInsertSteps([]);
    expect(steps).toHaveLength(1);
    expect(steps[0].nodes).toHaveLength(1); // root
    expect(steps[0].rootId).toBe(steps[0].nodes[0].id);
  });

  it('emits one frame per inserted word', () => {
    const steps = trieInsertSteps(['a', 'ab', 'abc']);
    expect(steps).toHaveLength(3);
  });

  it('shared prefixes reuse nodes (te-a / te-n share the "te" path)', () => {
    const steps = trieInsertSteps(['tea', 'ten']);
    const last = steps[steps.length - 1];
    // root + t + e + a + n = 5 nodes (NOT 6 — the "te" prefix is shared)
    expect(last.nodes).toHaveLength(5);
  });

  it('marks terminal nodes for complete words', () => {
    const steps = trieInsertSteps(['ab']);
    const last = steps[steps.length - 1];
    const terminals = last.nodes.filter((n) => n.terminal);
    expect(terminals).toHaveLength(1);
    expect(terminals[0].label).toBe('b');
  });

  it('every highlighted id exists among the frame nodes', () => {
    const steps = trieInsertSteps(['to', 'tea', 'ten']);
    for (const step of steps) {
      const ids = new Set(step.nodes.map((n) => n.id));
      for (const h of step.highlight) expect(ids.has(h)).toBe(true);
    }
  });
});
