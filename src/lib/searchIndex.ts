import { sections } from '@/lib/home';
import { getAllStates } from '@/lib/data';
import ahaProfiles from '@/data/aha/profiles.json';
import hacMembers from '@/data/hac/members.json';
import fahBoard from '@/data/fah/board.json';
import { STATE_TILES } from '@/lib/stateMap';

export interface SearchEntry {
  title: string;
  kind: string;
  href: string;
}

/** Client-side search index, built at build time from the data files. */
export function buildSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  const conStates = new Map(getAllStates().map((s) => [s.abbreviation, s.slug]));

  for (const [abbr, , , name] of STATE_TILES) {
    const slug = conStates.get(abbr);
    out.push({ title: name, kind: 'State', href: slug ? `/states/${slug}/` : '/states/' });
  }
  for (const s of sections) {
    out.push({ title: s.name, kind: 'Section', href: `/${s.slug}/` });
    for (const d of s.desks) {
      if (d.status === 'live' && d.href) out.push({ title: d.name.replace(/^[IVX]+ · /, ''), kind: s.name, href: d.href });
    }
  }
  for (const p of ahaProfiles as { slug: string; name: string; organization?: string }[]) {
    out.push({ title: p.name, kind: `AHA board · ${p.organization ?? ''}`.replace(/ · $/, ''), href: `/aha/profiles/${p.slug}/` });
  }
  for (const m of fahBoard as { slug: string; name: string; title?: string }[]) {
    out.push({ title: m.name, kind: 'FAH board', href: `/fah/board/${m.slug}/` });
  }
  for (const m of hacMembers as { slug: string; name: string }[]) {
    out.push({ title: m.name, kind: 'Healthcare Advisory Committee', href: `/hac/members/${m.slug}/` });
  }
  return out;
}
