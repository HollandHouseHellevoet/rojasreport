import nc from '@/data/states/nc.json';
import type { Basis } from '@/lib/systems';

/** State dossiers in the brief's format (docs/BUILD_BRIEF.md section 4.3), one JSON file per state under src/data/states. */

export type Letter = 'A' | 'B' | 'C' | 'D' | 'F';
export type Tone = 'red' | 'gold' | 'grey' | 'green';

export interface Sourced {
  basis: Basis;
  source: string;
  as_of: string;
}

export interface MoneyItem extends Sourced {
  value: string;
  text: string;
  note: string;
}

export interface Driver extends Sourced {
  num: string;
  label: string;
  key: string;
  /** Share of the state grade, in percent. */
  weight: number;
  title: string;
  grade: Letter | null;
  body: string;
  status: string;
  tone: Tone;
  href: string | null;
  linkText: string | null;
}

export interface SystemRow extends Sourced {
  name: string;
  slug: string | null;
  hospitals: number;
  netPatientRevenue: number;
  netIncome: number;
  otherIncome: number;
}

export interface HospitalRow {
  ccn: string;
  name: string;
  system: string;
  fiscalYearEnd: string;
  netPatientRevenue: number;
  netIncome: number;
  totalAssets: number;
  charityCareAtCost: number;
}

export interface Person {
  name: string;
  role: string;
}

export interface PeopleGroup {
  name: string;
  people: Person[];
  note?: string;
}

export interface Bill {
  id: string;
  title: string;
  body: string;
  status: string;
  tone: Tone;
}

export interface StateDossierRecord {
  slug: string;
  code: string;
  name: string;
  verdict: string;
  asOf: string;
  grade: { note: string };
  money: { asOf: string; items: MoneyItem[] };
  drivers: Driver[];
  systems: { subtitle: string; note: string; rows: SystemRow[] };
  hospitals: { source: string; as_of: string; rows: HospitalRow[] };
  whoDecides: Sourced & {
    subtitle: string;
    groups: PeopleGroup[];
    pac: Sourced & { text: string };
  };
  bills: Sourced & { subtitle: string; rows: Bill[] };
  practicing: { heading: string; text: string; links: { name: string; href: string | null }[] };
  buy: { heading: string; text: string; options: { label: string; price: string | null; perYear: boolean; primary: boolean }[] };
  sourcesLine: string;
}

export const stateDossiers: StateDossierRecord[] = [nc as StateDossierRecord];

export function getStateDossier(slug: string): StateDossierRecord | undefined {
  return stateDossiers.find((s) => s.slug === slug);
}

const POINTS: Record<Letter, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 };

/**
 * The state grade formula from the brief: A=4 to F=0, weighted by each driver's share;
 * ungraded drivers drop out and the remaining weights renormalize. Provisional until all six are graded.
 */
export function stateGrade(d: StateDossierRecord): { letter: Letter | null; graded: number; total: number; provisional: boolean } {
  let weight = 0;
  let points = 0;
  let graded = 0;
  for (const dr of d.drivers) {
    if (!dr.grade) continue;
    weight += dr.weight;
    points += POINTS[dr.grade] * dr.weight;
    graded += 1;
  }
  const total = d.drivers.length;
  if (weight === 0) return { letter: null, graded, total, provisional: true };
  const avg = points / weight;
  const letter: Letter = avg >= 3.5 ? 'A' : avg >= 2.5 ? 'B' : avg >= 1.5 ? 'C' : avg >= 0.5 ? 'D' : 'F';
  return { letter, graded, total, provisional: graded < total };
}

/** $4.32B above a billion, $339.0M below. */
export function money(n: number): string {
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(2)}B`;
  return `${sign}$${(a / 1e6).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
}

/** Total margin as the cost report defines it: net income over net patient revenue plus other income. */
export function margin(r: SystemRow): string {
  const base = r.netPatientRevenue + r.otherIncome;
  if (base === 0) return '—';
  return `${((r.netIncome / base) * 100).toFixed(1)}%`;
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];
export function word(n: number): string {
  return WORDS[n] ?? String(n);
}
