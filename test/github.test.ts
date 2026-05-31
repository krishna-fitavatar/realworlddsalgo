import { describe, it, expect } from 'vitest';
import {
  backoffMs,
  fetchWithBackoff,
  fetchRepoFile,
  checkUrlAlive,
  urlMatchesRepo,
} from '../scripts/lib/github.mjs';

// Minimal Response-like stub.
function res(status: number, headers: Record<string, string> = {}, body = '') {
  const h = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (k: string) => h.get(k.toLowerCase()) ?? null },
    text: async () => body,
  };
}

describe('backoffMs', () => {
  it('honors Retry-After (seconds → ms, capped)', () => {
    expect(backoffMs({ 'retry-after': '5' })).toBe(5000);
    expect(backoffMs({ 'retry-after': '9999' })).toBe(60_000); // cap
  });

  it('uses X-RateLimit-Reset when remaining is 0', () => {
    const now = 1_000_000;
    const reset = String((now + 3000) / 1000); // 3s out, in epoch seconds
    expect(backoffMs({ 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': reset }, now)).toBe(3000);
  });

  it('falls back to exponential by attempt', () => {
    expect(backoffMs({}, Date.now(), 0)).toBe(1000);
    expect(backoffMs({}, Date.now(), 2)).toBe(4000);
  });
});

describe('fetchWithBackoff', () => {
  it('retries on 429 then succeeds', async () => {
    const calls: number[] = [];
    let n = 0;
    const fetchImpl = async () => {
      n += 1;
      return n === 1 ? res(429, { 'retry-after': '1' }) : res(200, {}, 'ok');
    };
    const r = await fetchWithBackoff('https://x', {
      fetchImpl,
      sleepImpl: async (ms: number) => { calls.push(ms); },
    });
    expect(r.status).toBe(200);
    expect(calls).toEqual([1000]); // slept once
  });

  it('gives up after maxRetries and returns the last response', async () => {
    const fetchImpl = async () => res(429, { 'retry-after': '0' });
    const r = await fetchWithBackoff('https://x', {
      fetchImpl,
      sleepImpl: async () => {},
      maxRetries: 2,
    });
    expect(r.status).toBe(429);
  });

  it('does NOT retry a 403 that is not rate-limited', async () => {
    let n = 0;
    const fetchImpl = async () => { n += 1; return res(403, { 'x-ratelimit-remaining': '4999' }); };
    const r = await fetchWithBackoff('https://x', { fetchImpl, sleepImpl: async () => {} });
    expect(r.status).toBe(403);
    expect(n).toBe(1); // no retry
  });
});

describe('fetchRepoFile', () => {
  it('returns text on 200', async () => {
    const fetchImpl = async () => res(200, {}, 'class Trie {}');
    const r = await fetchRepoFile('owner/repo', 'src/trie.ts', { fetchImpl, sleepImpl: async () => {} });
    expect(r.ok).toBe(true);
    expect(r.text).toContain('Trie');
  });

  it('returns ok:false on 404 (no crash)', async () => {
    const fetchImpl = async () => res(404);
    const r = await fetchRepoFile('owner/repo', 'missing.ts', { fetchImpl, sleepImpl: async () => {} });
    expect(r.ok).toBe(false);
    expect(r.text).toBeNull();
  });

  it('serves from cache without refetching', async () => {
    let n = 0;
    const fetchImpl = async () => { n += 1; return res(200, {}, 'body'); };
    const cache = new Map();
    const opts = { fetchImpl, sleepImpl: async () => {}, cache };
    await fetchRepoFile('o/r', 'a.ts', opts);
    await fetchRepoFile('o/r', 'a.ts', opts);
    expect(n).toBe(1); // second call hit the cache
  });
});

describe('checkUrlAlive', () => {
  it('true for 2xx/3xx', async () => {
    expect(await checkUrlAlive('https://x', { fetchImpl: async () => res(200), sleepImpl: async () => {} })).toBe(true);
  });
  it('false for 404', async () => {
    expect(await checkUrlAlive('https://x', { fetchImpl: async () => res(404), sleepImpl: async () => {} })).toBe(false);
  });
  it('falls back to GET when HEAD returns 405', async () => {
    let method = '';
    const fetchImpl = async (_u: string, o: { method: string }) => {
      method = o.method;
      return o.method === 'HEAD' ? res(405) : res(200);
    };
    expect(await checkUrlAlive('https://x', { fetchImpl, sleepImpl: async () => {} })).toBe(true);
    expect(method).toBe('GET');
  });
});

describe('urlMatchesRepo', () => {
  it('matches a github blob url to its repo', () => {
    expect(urlMatchesRepo('https://github.com/torvalds/linux/blob/master/lib/rbtree.c', 'torvalds/linux')).toBe(true);
  });
  it('rejects a url pointing at a different repo', () => {
    expect(urlMatchesRepo('https://github.com/numpy/numpy', 'networkx/networkx')).toBe(false);
  });
  it('rejects non-github hosts', () => {
    expect(urlMatchesRepo('https://example.com/torvalds/linux', 'torvalds/linux')).toBe(false);
  });
});
