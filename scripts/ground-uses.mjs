// THE TRUST GATE. A `uses` reference is only allowed to ship if we can prove,
// mechanically, that the named repo actually contains the structure — by
// fetching the cited file and finding a matching token in it. No LLM judgment:
// the generation agent only PROPOSES {repo, url, path, tokens}; this script is
// the gate that confirms or rejects.
//
//   propose ──▶ groundUsesRef ──▶ { ok, reason, path }
//                  │
//                  ├─ no path?                  → reject (uses requires a path)
//                  ├─ url doesn't match repo?   → reject (wrong-repo link)
//                  ├─ file 404 / fetch failed?  → reject (path not real)
//                  └─ none of tokens in file?   → reject (claim unproven)
//                     else                      → confirm + return path
//
// If the REJECT path is ever wrong (passes an unproven claim), the whole
// "no manual review" guarantee collapses — hence the dedicated reject tests.

import { fetchRepoFile, urlMatchesRepo } from './lib/github.mjs';

/**
 * Build the set of tokens that prove a structure is present in source.
 * Conservative: the structure's display name words (len ≥ 4) + camel/Pascal/
 * snake variants of the slug. Caller can pass extra `hints`.
 */
export function structureTokens({ name, slug, hints = [] }) {
  const tokens = new Set();
  const add = (t) => t && t.length >= 3 && tokens.add(t.toLowerCase());
  // slug variants: red-black-tree → redblacktree, red_black_tree, redBlackTree, RedBlackTree
  const parts = slug.split('-');
  add(parts.join(''));
  add(parts.join('_'));
  add(parts.join(' '));
  add(parts[0]);
  // name words ≥ 4 chars (drop "tree", "sort"? keep — they're meaningful here)
  for (const w of (name || '').replace(/[()]/g, ' ').split(/\s+/)) add(w);
  for (const h of hints) add(h);
  return [...tokens];
}

/**
 * Ground a single `uses` reference. Returns { ok, reason, path }.
 * `ref` = { repo, url, path, tokens? }. `opts` is forwarded to fetchRepoFile
 * (token, fetchImpl, sleepImpl, cache, ref/branch).
 */
export async function groundUsesRef(ref, opts = {}) {
  const { repo, url, path } = ref;
  if (!repo || !url) return { ok: false, reason: 'missing repo or url' };
  if (!path) return { ok: false, reason: 'uses ref has no path (path is required and verified)' };
  if (!urlMatchesRepo(url, repo)) {
    return { ok: false, reason: `url does not point at repo ${repo}` };
  }
  const tokens = (ref.tokens && ref.tokens.length ? ref.tokens : opts.tokens) || [];
  if (!tokens.length) return { ok: false, reason: 'no structure tokens to verify against' };

  const file = await fetchRepoFile(repo, path, opts);
  if (!file.ok) return { ok: false, reason: `could not fetch ${repo}:${path} (status ${file.status})` };

  const hay = file.text.toLowerCase();
  const hit = tokens.find((t) => hay.includes(t.toLowerCase()));
  if (!hit) return { ok: false, reason: `none of [${tokens.join(', ')}] found in ${path}` };

  return { ok: true, reason: `confirmed "${hit}" in ${path}`, path };
}

/**
 * Ground every `uses` ref for a structure. Returns { kept, dropped } where
 * dropped carries reasons (for the held-manifest). `implements` refs are NOT
 * grounded here (they're gated by url↔repo + link-liveness elsewhere).
 */
export async function groundStructure({ refs, tokens }, opts = {}) {
  const kept = [];
  const dropped = [];
  for (const ref of refs) {
    if (ref.type !== 'uses') {
      // implements: cross-field check only (cheap), liveness handled by check-links
      if (urlMatchesRepo(ref.url, ref.repo)) kept.push(ref);
      else dropped.push({ ...ref, reason: `implements url does not match repo ${ref.repo}` });
      continue;
    }
    const verdict = await groundUsesRef({ ...ref, tokens: ref.tokens ?? tokens }, opts);
    if (verdict.ok) kept.push({ ...ref, path: verdict.path });
    else dropped.push({ ...ref, reason: verdict.reason });
  }
  return { kept, dropped };
}
