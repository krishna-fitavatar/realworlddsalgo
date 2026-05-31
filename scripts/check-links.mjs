#!/usr/bin/env node
// Reference link checker. Two passes:
//   1. well-formed: every reference URL parses as an absolute http(s) URL
//   2. liveness:    HEAD (GET fallback) returns a non-4xx/5xx status
//
// Pass 1 always runs (offline-safe). Pass 2 runs unless --offline is passed.
// Intended to run from day one (a dead flagship link hurts more at 10 pages
// than at 60), on a schedule via .github/workflows/linkcheck.yml.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { checkUrlAlive } from './lib/github.mjs';

const REF_DIR = 'src/content/references';
const OFFLINE = process.argv.includes('--offline');

async function collectUrls() {
  const files = (await readdir(REF_DIR)).filter((f) => f.endsWith('.json'));
  const urls = [];
  for (const file of files) {
    const data = JSON.parse(await readFile(path.join(REF_DIR, file), 'utf8'));
    for (const ref of data.refs ?? []) urls.push({ file, url: ref.url, repo: ref.repo });
  }
  return urls;
}

function wellFormed(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Liveness via the shared GitHub-aware helper: authenticated (lifts the 403/429
// rate-limit blind spot the standalone checker had) with HEAD→GET fallback.
function alive(url) {
  return checkUrlAlive(url);
}

const urls = await collectUrls();
const failures = [];

for (const { file, url, repo } of urls) {
  if (!wellFormed(url)) {
    failures.push(`${file}: malformed URL for ${repo}: ${url}`);
    continue;
  }
  if (!OFFLINE) {
    if (!(await alive(url))) failures.push(`${file}: dead link for ${repo}: ${url}`);
  }
}

console.log(`Checked ${urls.length} reference link(s)${OFFLINE ? ' (well-formed only)' : ''}.`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('All good.');
