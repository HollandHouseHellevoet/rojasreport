import type { SearchEntry } from '@/lib/searchIndex';

/** Shared ranking for the home search box and /search: title prefix first, then title match, then kind match. */

function norm(s: string): string {
  return s.toLowerCase().replace(/[’']/g, '').replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
}

export function rank(entry: SearchEntry, q: string): number {
  const t = norm(entry.title);
  const k = norm(entry.kind);
  if (t === q) return 0;
  if (t.startsWith(q)) return 1;
  if (t.split(' ').some((w) => w.startsWith(q))) return 2;
  if (t.includes(q)) return 3;
  if (k.includes(q)) return 4;
  return -1;
}

export function search(index: SearchEntry[], query: string, limit = 50): SearchEntry[] {
  const q = norm(query);
  if (q.length < 2) return [];
  return index
    .map((e, i) => ({ e, i, r: rank(e, q) }))
    .filter((x) => x.r >= 0)
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.e);
}
