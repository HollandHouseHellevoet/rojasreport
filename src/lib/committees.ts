import senateFinance from '@/data/committees/senate-finance.json';
import type { Basis } from '@/lib/systems';
import type { Tone } from '@/lib/stateDossiers';

/** Committee dossiers in the brief's format (docs/BUILD_BRIEF.md section 4.4), one JSON file per committee under src/data/committees. */

export interface Sourced {
  source: string;
  as_of?: string;
}

export interface Tab {
  slug: string;
  name: string;
  status: 'live' | 'planned';
}

export interface Point {
  title: string;
  body: string;
}

export interface Control {
  title: string;
  body: string;
  note: string;
}

export interface Leader {
  label: string;
  name: string;
  line: string;
  text: string;
  source: string;
}

export interface Departure {
  name: string;
  party: string;
  why: string;
  tone: Tone;
  loss: string;
  source: string;
}

export interface MoneyFigure {
  value: number | null;
  basis: Basis;
  source: string;
  as_of: string;
}

export interface Member {
  slug: string;
  name: string;
  party: string;
  role: string;
  records: Record<string, string | null>;
  machineScore: number | null;
  hospitalMoney: MoneyFigure;
}

export interface DocketItem {
  title: string;
  body: string;
  status: string;
  tone: Tone;
  source: string;
}

export interface CommitteeRecord {
  slug: string;
  name: string;
  chamber: string;
  congress: string;
  verdict: string;
  verdictSource: string;
  tabs: Tab[];
  plainEnglish: Sourced & { kicker: string; heading: string; intro: string; points: Point[] };
  controls: Sourced & { subtitle: string; items: Control[] };
  whoRuns: Sourced & { heading: string; subtitle: string; people: Leader[] };
  leaving: { heading: string; asOf: string; intro: string; introSource: string; rows: Departure[] };
  scorecard: Sourced & { heading: string; subtitle: string; intro: string; note: string; columns: string[]; members: Member[] };
  docket: { heading: string; subtitle: string; items: DocketItem[] };
  staff: { heading: string; text: string; options: { label: string; price: string | null; primary: boolean; href: string }[] };
  sourcesLine: string;
}

export const committees: CommitteeRecord[] = [senateFinance as CommitteeRecord];

export function getCommittee(slug: string): CommitteeRecord | undefined {
  return committees.find((c) => c.slug === slug);
}

/** $36.5K, $1.2M. */
export function compact(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString('en-US')}`;
}
