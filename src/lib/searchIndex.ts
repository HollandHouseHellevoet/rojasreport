import { sections } from '@/lib/home';
import { getAllStates } from '@/lib/data';
import ahaProfiles from '@/data/aha/profiles.json';
import hacMembers from '@/data/hac/members.json';
import fahBoard from '@/data/fah/board.json';
import { STATE_TILES } from '@/lib/stateMap';
import { systems } from '@/lib/systems';
import { stateDossiers } from '@/lib/stateDossiers';
import { committees } from '@/lib/committees';

export interface SearchEntry {
  title: string;
  kind: string;
  href: string;
}

/** Client-side search index, built at build time from the data files. */
export function buildSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  const conStates = new Map(getAllStates().map((s) => [s.abbreviation, s.slug]));

  const dossierCodes = new Set(stateDossiers.map((d) => d.code));
  for (const [abbr, , , name] of STATE_TILES) {
    if (dossierCodes.has(abbr)) continue;
    const slug = conStates.get(abbr);
    out.push({ title: name, kind: 'State', href: slug ? `/states/${slug}/` : '/states/' });
  }
  for (const d of stateDossiers) {
    out.push({ title: `${d.name} state dossier`, kind: 'State dossier', href: `/states/${d.slug}/` });
    if (conStates.has(d.code)) out.push({ title: `${d.name} certificate of need`, kind: 'CON state page', href: `/con/${d.slug}/` });
  }
  for (const c of committees) {
    out.push({ title: `${c.name} committee`, kind: 'Committee dossier', href: `/committees/${c.slug}/` });
    for (const m of c.scorecard.members) {
      out.push({ title: m.name, kind: `${m.party} · ${c.name}`, href: `/committees/${c.slug}/#scorecard` });
    }
  }
  out.push({ title: 'Reports and data', kind: 'Datasets', href: '/reports/' });
  out.push({ title: 'Support the Report', kind: 'Support', href: '/support/' });
  out.push({ title: 'Methodology', kind: 'Methodology', href: '/methodology/' });
  out.push({ title: 'The Subsidy Ledger', kind: 'Methodology', href: '/methodology/subsidy-ledger/' });
  out.push({ title: 'The State Grade', kind: 'Methodology', href: '/methodology/state-grade/' });
  out.push({ title: 'The Machine Score', kind: 'Methodology', href: '/methodology/machine-score/' });
  out.push({ title: 'CON classification methodology', kind: 'Methodology', href: '/con/methodology/' });
  for (const sys of systems) {
    out.push({ title: sys.name, kind: 'Health system', href: `/systems/${sys.slug}/` });
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
