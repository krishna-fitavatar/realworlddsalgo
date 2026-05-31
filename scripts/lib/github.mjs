// Shared GitHub access for the link-checker and the `uses` grounding gate.
//
//   ┌─ fetchWithBackoff ─ authed fetch, retries on 403/429 per rate-limit headers
//   ├─ fetchRepoFile ──── raw file content for a repo+path (cached per run)
//   └─ checkUrlAlive ──── liveness for any URL (used by check-links)
//
// Everything takes injectable `fetchImpl` and `sleepImpl` so tests run offline
// and fast. `GITHUB_TOKEN` (PAT locally / Actions token in CI) lifts the rate
// limit from 60/hr (unauthenticated) to 5000/hr and is required for the
// grounding pass over ~70 structures.

const RAW_HOST = 'https://raw.githubusercontent.com';
const DEFAULT_MAX_RETRIES = 3;
const MAX_BACKOFF_MS = 60_000;

const realSleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function ghHeaders(token = process.env.GITHUB_TOKEN) {
  const h = { 'user-agent': 'realworlddsalgo-tooling', accept: 'application/vnd.github.raw+json' };
  if (token) h.authorization = `Bearer ${token}`;
  return h;
}

/** How long to wait before retrying a 403/429, from Retry-After or X-RateLimit-Reset. */
export function backoffMs(headers, now = Date.now(), attempt = 0) {
  const get = (k) => (typeof headers?.get === 'function' ? headers.get(k) : headers?.[k]);
  const retryAfter = get('retry-after');
  if (retryAfter) return Math.min(Number(retryAfter) * 1000, MAX_BACKOFF_MS);
  const reset = get('x-ratelimit-reset');
  const remaining = get('x-ratelimit-remaining');
  if (remaining === '0' && reset) {
    return Math.min(Math.max(Number(reset) * 1000 - now, 0), MAX_BACKOFF_MS);
  }
  // Fallback: exponential 1s, 2s, 4s…
  return Math.min(1000 * 2 ** attempt, MAX_BACKOFF_MS);
}

export async function fetchWithBackoff(url, opts = {}) {
  const {
    token = process.env.GITHUB_TOKEN,
    fetchImpl = globalThis.fetch,
    sleepImpl = realSleep,
    maxRetries = DEFAULT_MAX_RETRIES,
    method = 'GET',
  } = opts;
  let attempt = 0;
  for (;;) {
    const res = await fetchImpl(url, { method, headers: ghHeaders(token), redirect: 'follow' });
    // 403 is GitHub's rate-limit signal (with x-ratelimit-remaining: 0); 429 is secondary.
    const rateLimited =
      res.status === 429 ||
      (res.status === 403 && String(res.headers?.get?.('x-ratelimit-remaining')) === '0');
    if (!rateLimited || attempt >= maxRetries) return res;
    await sleepImpl(backoffMs(res.headers, Date.now(), attempt));
    attempt += 1;
  }
}

/**
 * Fetch a file's raw text from a repo. Returns {ok, status, text}.
 * Cached per run by `${repo}@${ref}:${path}` so refetches/resumes don't re-hit
 * the API. Pass your own `cache` Map to share it across calls.
 */
export async function fetchRepoFile(repo, path, opts = {}) {
  const { ref = 'HEAD', cache } = opts;
  const key = `${repo}@${ref}:${path}`;
  if (cache?.has(key)) return cache.get(key);
  const url = `${RAW_HOST}/${repo}/${ref}/${path.replace(/^\//, '')}`;
  const res = await fetchWithBackoff(url, opts);
  const result = res.ok
    ? { ok: true, status: res.status, text: await res.text() }
    : { ok: false, status: res.status, text: null };
  cache?.set(key, result);
  return result;
}

/** Liveness for any URL: a non-4xx/5xx status. HEAD with GET fallback on 403/405. */
export async function checkUrlAlive(url, opts = {}) {
  const { fetchImpl = globalThis.fetch, token = process.env.GITHUB_TOKEN } = opts;
  const headers = ghHeaders(token);
  try {
    let res = await fetchWithBackoff(url, { ...opts, method: 'HEAD', fetchImpl, token });
    if (res.status === 405 || res.status === 403) {
      res = await fetchImpl(url, { method: 'GET', headers, redirect: 'follow' });
    }
    return res.status < 400;
  } catch {
    return false;
  }
}

/** True if `url` plausibly points at `repo` (host+path contains the owner/name). */
export function urlMatchesRepo(url, repo) {
  try {
    const u = new URL(url);
    if (!/(^|\.)github\.com$/.test(u.hostname) && u.hostname !== 'raw.githubusercontent.com') {
      return false;
    }
    return u.pathname.toLowerCase().includes(`/${repo.toLowerCase()}/`) ||
      u.pathname.toLowerCase().startsWith(`/${repo.toLowerCase()}`);
  } catch {
    return false;
  }
}
