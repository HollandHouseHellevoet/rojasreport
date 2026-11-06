import commonspirit from '@/data/systems/commonspirit.json';

/** Health system profiles, one JSON file per system under src/data/systems. */

export type Basis = 'reported' | 'estimated' | 'pending';

export interface Figure {
  value: string | null;
  basis: Basis;
  source: string;
  as_of: string;
}

export interface KeyFigure extends Figure {
  label: string;
  value: string;
}

export interface MoneyItem extends Figure {
  value: string;
  text: string;
  note: string;
}

export interface LedgerLine {
  name: string;
  payer: string;
  basis: Basis;
  /** Dollars. Null while the line is still being built from source filings. */
  amount: number | null;
  source: string;
  as_of: string;
}

export interface LedgerGroup {
  name: string;
  lines: LedgerLine[];
}

export interface Row extends Figure {
  name: string;
}

export interface BuyOption {
  label: string;
  price: string | null;
  primary?: boolean;
  perYear?: boolean;
}

export interface SystemProfile {
  slug: string;
  name: string;
  kind: string;
  taxStatus: string;
  hq: string;
  footprint: string;
  ein: string;
  fiscalYear: string;
  fiscalYearEnd: string;
  verdict: string;
  keyFigures: KeyFigure[];
  money: { asOf: string; items: MoneyItem[] };
  freeCare: { amount: number; label: string; basis: Basis; source: string; as_of: string };
  costReportFreeCare: { amount: number; basis: Basis; source: string; as_of: string };
  ledger: { caption: string; groups: LedgerGroup[]; note: string };
  fairShareNote: string;
  pay: { rows: Row[]; sourceLine: string };
  lobbying: { rows: Row[]; sourceLine: string };
  market: { rows: Row[]; sourceLine: string };
  buy: { text: string; options: BuyOption[] };
  sourcesLine: string;
}

export const systems: SystemProfile[] = [commonspirit as SystemProfile];

export function getSystem(slug: string): SystemProfile | undefined {
  return systems.find((s) => s.slug === slug);
}

/** Everything the Fair Share Test shows, computed from the ledger so the page and the data never drift. */
export function fairShare(p: SystemProfile) {
  const lines = p.ledger.groups.flatMap((g) => g.lines);
  const filled = lines.filter((l) => l.amount != null && l.amount > 0);
  const total = filled.reduce((s, l) => s + (l.amount ?? 0), 0);
  const ratio = total / p.freeCare.amount;
  const ratioCostReport = total / p.costReportFreeCare.amount;
  return {
    total,
    filled: filled.length,
    lines: lines.length,
    ratio,
    ratioCostReport,
    freeCareShare: p.freeCare.amount / total,
  };
}

/** $1,999.1M style: millions with one decimal. */
export function millions(n: number): string {
  return `$${(n / 1e6).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
}

/** $6.16B style for the bars. */
export function short(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  return millions(n);
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

export function words(n: number): string {
  return WORDS[n] ?? String(n);
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function filledSentence(filled: number, lines: number): string {
  return `At least. ${cap(words(filled))} of ${words(lines)} ledger lines filled so far.`;
}
