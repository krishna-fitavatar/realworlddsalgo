import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runIntegrityCheck } from '../integrations/integrity-check';

/**
 * Each test builds a throwaway project root with the directory layout the
 * integration expects, then asserts which joins pass or fail. This proves the
 * safety net catches the exact bug classes it was designed for.
 */

let root: string;

async function structure(
  slug: string,
  opts: { frontmatterSlug?: string; viz?: string | null } = {},
) {
  const fmSlug = opts.frontmatterSlug ?? slug;
  const viz = 'viz' in opts ? opts.viz : null;
  const fm = [
    '---',
    `name: ${slug}`,
    `slug: ${fmSlug}`,
    'category: tree',
    'summary: test',
    `viz: ${viz === null ? 'null' : viz}`,
    '---',
    'body',
  ].join('\n');
  await writeFile(path.join(root, 'src/content/structures', `${slug}.md`), fm);
}

async function reference(fileSlug: string, structureField: string) {
  await writeFile(
    path.join(root, 'src/content/references', `${fileSlug}.json`),
    JSON.stringify({ structure: structureField, refs: [] }),
  );
}

async function vizComponent(name: string) {
  await writeFile(path.join(root, 'src/components/viz', `${name}.tsx`), 'export default () => null;');
}

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'rwda-integrity-'));
  await mkdir(path.join(root, 'src/content/structures'), { recursive: true });
  await mkdir(path.join(root, 'src/content/references'), { recursive: true });
  await mkdir(path.join(root, 'src/components/viz'), { recursive: true });
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('runIntegrityCheck', () => {
  it('passes a valid, fully-joined set', async () => {
    await structure('trie', { viz: 'TrieViz' });
    await reference('trie', 'trie');
    await vizComponent('TrieViz');
    const { errors, warnings } = await runIntegrityCheck(root);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('passes a viz:null structure with references and no component', async () => {
    await structure('dynamic-array', { viz: null });
    await reference('dynamic-array', 'dynamic-array');
    const { errors } = await runIntegrityCheck(root);
    expect(errors).toEqual([]);
  });

  it('fails an orphan reference file (no matching structure)', async () => {
    await reference('ghost', 'ghost');
    const { errors } = await runIntegrityCheck(root);
    expect(errors.some((e) => /unknown structure "ghost"/.test(e))).toBe(true);
  });

  it('fails when frontmatter slug drifts from the filename', async () => {
    await structure('trie', { frontmatterSlug: 'tri', viz: null });
    const { errors } = await runIntegrityCheck(root);
    expect(errors.some((e) => /must equal filename/.test(e))).toBe(true);
  });

  it('fails on a duplicate slug across two files', async () => {
    // two files, same frontmatter slug "dup" — filename drift triggers, and the
    // duplicate-slug guard also fires.
    await structure('dup', { viz: null });
    await writeFile(
      path.join(root, 'src/content/structures', 'dup2.md'),
      '---\nname: x\nslug: dup\ncategory: tree\nsummary: t\nviz: null\n---\nb',
    );
    const { errors } = await runIntegrityCheck(root);
    expect(errors.some((e) => /Duplicate structure slug "dup"/.test(e))).toBe(true);
  });

  it('fails when viz names a missing component', async () => {
    await structure('trie', { viz: 'NopeViz' });
    await reference('trie', 'trie');
    const { errors } = await runIntegrityCheck(root);
    expect(errors.some((e) => /NopeViz\.tsx does not exist/.test(e))).toBe(true);
  });

  it('warns (does not fail) when a structure has no reference file', async () => {
    await structure('lonely', { viz: null });
    const { errors, warnings } = await runIntegrityCheck(root);
    expect(errors).toEqual([]);
    expect(warnings.some((w) => /has no reference file/.test(w))).toBe(true);
  });

  it('fails when a reference filename does not match its structure field', async () => {
    await structure('trie', { viz: null });
    await reference('trie', 'binary-search-tree'); // file trie.json claims structure bst
    const { errors } = await runIntegrityCheck(root);
    expect(errors.some((e) => /filename is "trie"/.test(e))).toBe(true);
  });
});
