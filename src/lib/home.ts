import sectionsData from '@/data/home/sections.json';

export interface Desk {
  name: string;
  href?: string;
  status: 'live' | 'planned';
  blurb?: string;
  stat?: string;
  statLabel?: string;
  /** Optional heading the desk is listed under on its section page. */
  group?: string;
}

export type Band = 'green' | 'oxblood';

export interface Section {
  slug: string;
  name: string;
  question: string;
  /** Color rule from the brief: green = where the money sits, oxblood = who holds power. */
  band: Band;
  intro?: string;
  desks: Desk[];
}

export const sections = sectionsData as Section[];

/** A desk name without its section numeral ("III · Certificate of need" → "Certificate of need"). */
export const deskTitle = (name: string) => name.replace(/^[IVX]+ · /, '');

/** Build-time guard: a desk marked live must link somewhere, or the home page would drop it without a trace. */
for (const s of sections) {
  for (const d of s.desks) {
    if (d.status === 'live' && !d.href) throw new Error(`Live desk without href: ${s.slug} / ${d.name}`);
  }
}

export function getSection(slug: string): Section {
  const s = sections.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown section: ${slug}`);
  return s;
}
