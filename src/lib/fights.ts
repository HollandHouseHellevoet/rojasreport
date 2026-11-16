import data from '@/data/tracker.json';

/**
 * The three fights and the Tracker (MERGER_PLAN.md, section 3.5): one data file, two lanes.
 * The congress lane carries the Alliance's bill for each fight; the agency-court lane carries the rules and cases.
 */

export type FightSlug = 'site-neutral' | '340b' | 'physician-ownership';
export const FIGHTS: { slug: FightSlug; name: string; issue: 'Site-Neutral' | '340B' | 'Physician Ownership' }[] = [
  { slug: 'site-neutral', name: 'Site-Neutral Payment', issue: 'Site-Neutral' },
  { slug: '340b', name: '340B Reform', issue: '340B' },
  { slug: 'physician-ownership', name: 'Physician Ownership', issue: 'Physician Ownership' },
];
export const STAGES = ['Drafted', 'Introduced', 'Committee', 'Floor', 'Law'] as const;
export const AGENCY_STAGES = ['Proposed', 'Final', 'In effect', 'In court', 'Vacated', 'State by state'] as const;

export interface TrackerRow {
  id: string;
  issue: string;
  fight: FightSlug | 'research';
  lane: 'congress' | 'agency-court';
  stage: string;
  vehicle: string;
  direction: 'toward competition' | 'away from competition' | 'open';
  date: string;
  as_of: string;
  source: string;
  note: string;
  href?: string;
  /** The Alliance's own bill for the fight; one per fight in the congress lane. */
  primary?: boolean;
}

export const tracker = data.rows as TrackerRow[];
export const trackerAsOf = data.asOf as string;

for (const r of tracker) {
  if (!r.source) throw new Error(`tracker.json: row "${r.issue}" has no source. Every row carries one.`);
  if (r.lane === 'congress' && !(STAGES as readonly string[]).includes(r.stage)) throw new Error(`tracker.json: congress row "${r.issue}" has stage "${r.stage}"`);
  if (r.lane === 'agency-court' && !(AGENCY_STAGES as readonly string[]).includes(r.stage)) throw new Error(`tracker.json: agency row "${r.issue}" has stage "${r.stage}"`);
}

/** The congress-lane row that is the Alliance's bill for the fight. */
export function getFight(slug: FightSlug) {
  const row = tracker.find((r) => r.fight === slug && r.lane === 'congress' && r.primary);
  if (!row) throw new Error(`tracker.json: no primary congress row for ${slug}`);
  return row;
}

export function rowsFor(slug: FightSlug) {
  return tracker.filter((r) => r.fight === slug);
}

export function fightName(slug: FightSlug | 'research') {
  return FIGHTS.find((f) => f.slug === slug)?.name ?? 'Research';
}
