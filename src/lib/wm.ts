import membersData from '@/data/committees/wm/members.json';
import votesData from '@/data/committees/wm/votes.json';
import metaData from '@/data/committees/wm/meta.json';

/**
 * Ways & Means desk: member dossiers and key health votes, compiled by scripts/build_wm.py from
 * research/waysandmeans/data (Clerk roster, FEC bulk files, Clerk roll calls, Clerk PTRs, outcome sources).
 */

export const WM_SLUG = 'ways-and-means';
export const WM_BASE = `/committees/${WM_SLUG}`;

export interface PacRow {
  pacId: string;
  pac: string;
  sector: string;
  amount: number;
}

export interface MoneyCycle {
  total: number;
  bySector: Record<string, number>;
  contributionCount: number;
  topPacs: PacRow[];
  source: string | null;
  sourceLabel: string | null;
  asOf: string | null;
}

export interface Trade {
  owner: string;
  asset: string;
  ticker: string;
  transaction: string;
  transactionDate: string;
  amount: string;
  source: string;
}

export interface WmMember {
  slug: string;
  bioguideId: string;
  name: string;
  officialName: string;
  lastName: string;
  party: 'R' | 'D';
  partyName: string;
  stateCode: string;
  state: string;
  district: string;
  committeeRank: number;
  fullCommitteeRole: string | null;
  viceRankingMember: boolean;
  subcommittees: { name: string; role: string }[];
  healthSubcommittee: boolean;
  firstHouseTerm: number;
  rosterSource: string;
  rosterSourceUrl: string;
  outcome: { status: string; detail: string; date: string | null; source: string; sourceLabel: string };
  money: { '2026': MoneyCycle | null; '2024': MoneyCycle | null; fecCandidateId: string | null };
  votes: { id: string; vote: string }[];
  trades: {
    ptrCount: number | null;
    ptrNote: string | null;
    unreadable: number;
    healthcare: Trade[];
    source: string | null;
    sourceLabel: string;
    asOf: string | null;
  };
}

export interface WmVote {
  id: string;
  year: string;
  rollCall: number;
  date: string;
  legisNum: string;
  question: string;
  description: string;
  why: string | null;
  result: string;
  totals: Record<string, number>;
  byParty: Record<string, { yea: number; nay: number; present: number; notVoting: number }>;
  waysAndMeansTally: Record<string, number>;
  positions: { bioguideId: string; name: string; party: string; vote: string; slug: string | null }[];
  source: string;
  sourceLabel: string;
}

export const wmMembers = membersData as unknown as WmMember[];
export const wmVotes = votesData as unknown as WmVote[];
export const wmMeta = metaData as typeof metaData;

export function getWmMember(slug: string) {
  return wmMembers.find((m) => m.slug === slug);
}
export function getWmVote(id: string) {
  return wmVotes.find((v) => v.id === id);
}

/** "Missouri's 8th District", "the U.S. Virgin Islands (delegate)". */
export function seat(m: WmMember): string {
  if (m.district === 'Delegate') return `${m.state} (delegate)`;
  return `${m.state}'s ${m.district} District`;
}

/** Roles on the committee, most senior first. */
export function roles(m: WmMember): string[] {
  const out: string[] = [];
  if (m.fullCommitteeRole) out.push(m.fullCommitteeRole === 'Chair' ? 'Chairman of the committee' : `${m.fullCommitteeRole} of the committee`);
  if (m.viceRankingMember) out.push('Vice ranking member of the committee');
  for (const s of m.subcommittees) {
    if (s.role === 'Chair') out.push(`Chairman, ${s.name} Subcommittee`);
    else if (s.role === 'Ranking Member') out.push(`Ranking member, ${s.name} Subcommittee`);
  }
  return out;
}

export function usd(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

export function shortUsd(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3).toLocaleString('en-US')}K`;
  return `$${n}`;
}

export function longDate(iso: string): string {
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** "H R 1968" → "H.R. 1968". */
export function billNumber(s: string): string {
  return s.replace(/^H R /, 'H.R. ').replace(/^H RES /, 'H.Res. ').replace(/^H J RES /, 'H.J.Res. ').replace(/^S /, 'S. ');
}

/** PAC names arrive in capitals from the FEC files. */
export function pacName(s: string): string {
  const keep = new Set(['PAC', 'AHIP', 'AMA', 'AAOS', 'ASA', 'DAPAC', 'BCBSA', 'CVS', 'HCA', 'LLC', 'INC', 'II', 'III', 'USA', 'US', 'MD', 'DO', 'ACEP']);
  return s
    .toLowerCase()
    .split(/(\s+|-|\(|\))/)
    .map((w) => {
      const up = w.toUpperCase().replace(/[.,]/g, '');
      if (keep.has(up)) return w.toUpperCase();
      if (/^(of|and|the|for|in|on|to)$/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join('')
    .replace(/^./, (c) => c.toUpperCase());
}
