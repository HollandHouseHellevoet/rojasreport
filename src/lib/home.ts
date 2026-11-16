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

export function getSection(slug: string): Section {
  const s = sections.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown section: ${slug}`);
  return s;
}
