import hospitalsData from '@/data/poh/hospitals.json';
import metaData from '@/data/poh/meta.json';

/**
 * Physician-owned hospitals desk. src/data/poh is compiled by scripts/build_poh.py from
 * research/poh (each hospital re-verified in November 2026 against CMS ownership data,
 * hospital sites, filings and news, one dated source per hospital).
 */

export const POH_BASE = '/poh';

export type PohStatus = 'Physician-owned' | 'Joint venture' | 'Sold or acquired' | 'Closed' | 'Under development' | 'NOT FOUND';

export const STATUS_ORDER: PohStatus[] = ['Physician-owned', 'Joint venture', 'Sold or acquired', 'Closed', 'Under development', 'NOT FOUND'];

export const STATUS_TEXT: Record<PohStatus, { label: string; plural: string; blurb: string; tone: string; dot: string }> = {
  'Physician-owned': { label: 'Physician-owned', plural: 'Still physician-owned', blurb: 'Operating, and owned by physicians with no hospital system, corporate chain or outside investor among the owners.', tone: 'text-green', dot: 'bg-green' },
  'Joint venture': { label: 'Joint venture', plural: 'Joint ventures', blurb: 'Operating, with physicians sharing ownership with a hospital system, corporate chain or outside investor holding 5% or more.', tone: 'text-gold', dot: 'bg-gold' },
  'Sold or acquired': { label: 'Sold or acquired', plural: 'Sold or acquired', blurb: 'Operating under a non-physician owner.', tone: 'text-oxblood', dot: 'bg-oxblood' },
  Closed: { label: 'Closed', plural: 'Closed', blurb: 'No longer operating as a hospital.', tone: 'text-ink', dot: 'bg-ink' },
  'Under development': { label: 'Under development', plural: 'Under development', blurb: 'Not yet open.', tone: 'text-ink', dot: 'bg-hairline' },
  'NOT FOUND': { label: 'Not confirmed', plural: 'Not confirmed', blurb: 'No source confirms who owns it now, or whether it still operates.', tone: 'text-ink', dot: 'bg-placeholder' },
};

export interface PohHospital {
  id: string;
  name: string;
  originalName: string;
  city: string;
  state: string;
  stateName: string;
  stateSlug: string;
  specialty: string;
  status: PohStatus;
  owner: string;
  ccn: string | null;
  fact: string;
  source: string;
  sourceLabel: string;
  sourceDate: string;
}

export interface PohState {
  code: string;
  name: string;
  slug: string;
  total: number;
  byStatus: Record<string, number>;
  conTier: string | null;
  conStatus: string | null;
  statePage: string | null;
}

export const pohHospitals = hospitalsData as unknown as PohHospital[];
export const pohMeta = metaData as typeof metaData;
export const pohStates = (metaData as unknown as { states: PohState[] }).states;

export function getPohState(slug: string) {
  return pohStates.find((s) => s.slug === slug);
}

export function hospitalsIn(code: string) {
  return pohHospitals.filter((h) => h.state === code);
}

export function countBy(list: PohHospital[]) {
  const c: Record<string, number> = {};
  for (const s of STATUS_ORDER) c[s] = 0;
  for (const h of list) c[h.status] = (c[h.status] ?? 0) + 1;
  return c;
}

export function longDate(iso: string): string {
  if (!/^\d{4}-\d{2}(-\d{2})?$/.test(iso)) return iso;
  const [y, mo, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d || 1));
  return dt.toLocaleDateString('en-US', d ? { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' } : { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
