#!/usr/bin/env node
// Phase 3-4 of the generation workflow, run deterministically OUTSIDE the agent
// sandbox: take the workflow's generated structures, GROUND their `uses`
// reference candidates (fetch + token check via ground-uses.mjs), write the
// verified pages, and emit a held-manifest for anything that doesn't survive.
//
//   node scripts/apply-generated.mjs <workflow-output.json>
//
// Requires GITHUB_TOKEN for the grounding fetches. A structure that ends with
// 0 surviving references is HELD (not written) and listed in the manifest —
// "cover every" never silently becomes "cover the ones that passed".
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { structureTokens, groundStructure } from './ground-uses.mjs';
import { checkUrlAlive } from './lib/github.mjs';

const STRUCT_DIR = 'src/content/structures';
const REF_DIR = 'src/content/references';
const MANIFEST = 'data/held-manifest.json';

const q = (s) => JSON.stringify(String(s)); // JSON string = valid double-quoted YAML scalar

function frontmatter(s) {
  const lines = [
    '---',
    `name: ${q(s.name)}`,
    `slug: ${q(s.slug)}`,
    `category: ${q(s.category)}`,
    `summary: ${q(s.summary)}`,
    'complexity:',
    '  time:',
    ...Object.entries(s.complexity.time).map(([k, v]) => `    ${q(k)}: ${q(v)}`),
    `  space: ${q(s.complexity.space)}`,
    'viz: null',
    '---',
  ];
  return lines.join('\n');
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node scripts/apply-generated.mjs <workflow-output.json>');
    process.exit(1);
  }
  const raw = JSON.parse(await readFile(file, 'utf8'));
  const structures = Array.isArray(raw) ? raw : raw.result;
  if (!Array.isArray(structures)) throw new Error('expected an array or { result: [...] }');

  const token = process.env.GITHUB_TOKEN;
  if (!token) console.warn('WARNING: no GITHUB_TOKEN — grounding fetches will be rate-limited/unauthenticated.');
  const cache = new Map();

  await mkdir(STRUCT_DIR, { recursive: true });
  await mkdir(REF_DIR, { recursive: true });

  const written = [];
  const held = [];
  const droppedAll = [];

  for (const s of structures) {
    const tokens = structureTokens({ name: s.name, slug: s.slug });
    const ground = await groundStructure({ refs: s.references, tokens }, { token, cache });
    const dropped = [...ground.dropped];
    // Liveness pass: every surviving ref's URL must resolve (catches dead
    // `implements` links the url↔repo check can't — moved/renamed files).
    const kept = [];
    for (const ref of ground.kept) {
      if (await checkUrlAlive(ref.url, { token })) kept.push(ref);
      else dropped.push({ ...ref, reason: 'dead link (url did not resolve)' });
    }
    for (const d of dropped) droppedAll.push({ slug: s.slug, repo: d.repo, type: d.type, reason: d.reason });

    if (kept.length === 0) {
      held.push({ slug: s.slug, reason: 'no references survived grounding' });
      continue;
    }
    // strip the per-ref `tokens` helper field before writing
    const refs = kept.map(({ tokens: _t, ...r }) => r);
    await writeFile(path.join(STRUCT_DIR, `${s.slug}.md`), `${frontmatter(s)}\n\n${s.body}\n`);
    await writeFile(
      path.join(REF_DIR, `${s.slug}.json`),
      JSON.stringify({ structure: s.slug, refs }, null, 2) + '\n',
    );
    written.push({ slug: s.slug, kept: kept.length, dropped: dropped.length });
  }

  await writeFile(MANIFEST, JSON.stringify({ generatedAt: null, written, held, dropped: droppedAll }, null, 2) + '\n');

  console.log(`\n=== apply-generated summary ===`);
  console.log(`written: ${written.length}`);
  for (const w of written) console.log(`  ✓ ${w.slug} (${w.kept} refs kept, ${w.dropped} dropped)`);
  if (held.length) {
    console.log(`HELD (not shipped): ${held.length}`);
    for (const h of held) console.log(`  ⚠ ${h.slug} — ${h.reason}`);
  }
  if (droppedAll.length) {
    console.log(`dropped refs: ${droppedAll.length}`);
    for (const d of droppedAll) console.log(`  - ${d.slug}: ${d.repo} (${d.type}) — ${d.reason}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
