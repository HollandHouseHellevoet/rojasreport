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

/** Research pages tagged to each fight (MERGER_PLAN.md, section 3.3). Only pages that exist and carry the fight's figures. */
export const RESEARCH_LINKS: Record<FightSlug, { title: string; href: string; text: string }[]> = {
  'site-neutral': [
    { title: 'Where the hospital lobby stands', href: '/aha/powermap/#lobbying-footprint', text: 'The American Hospital Association’s positions on every site-neutral rule, dated.' },
    { title: 'House Ways and Means', href: '/committees/ways-and-means/', text: 'The members with jurisdiction over Medicare payment, their votes and their hospital money.' },
    { title: 'Senate Finance', href: '/committees/senate-finance/', text: 'Where S. 1629 sits. The members, their votes and their hospital money.' },
  ],
  '340b': [
    { title: 'Where the hospital lobby stands', href: '/aha/powermap/#lobbying-footprint', text: 'The hospital lobby’s positions on the 340B payment cut and the rebate pilot.' },
    { title: 'House Ways and Means', href: '/committees/ways-and-means/', text: 'The committee that ordered H.R. 9504 reported, 25 to 15, on July 1, 2026.' },
    { title: 'Health systems', href: '/systems/', text: 'Subsidy ledgers for the systems that buy at 340B prices, read from their own filings.' },
  ],
  'physician-ownership': [
    { title: 'The physician-owned hospital desk', href: '/poh/', text: 'Every physician-owned hospital the Alliance tracks, by state, with its owner and a dated source.' },
    { title: 'Physician-owned hospitals by state', href: '/poh/states/', text: 'Which states have them, which do not, and the certificate-of-need status of each.' },
    { title: 'The Healthcare Advisory Committee', href: '/hac/', text: '18 members. None on record for physician ownership.' },
  ],
};
