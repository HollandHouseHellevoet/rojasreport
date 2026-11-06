import orgData from "@/data/fah/org.json";
import boardData from "@/data/fah/board.json";
import pillarsData from "@/data/fah/pillars.json";

export interface Source { label: string; url: string }
export interface Development { date: string; text: string; url: string }
export interface Stat { value: string; label: string }

export interface Officer { name: string; company: string; slug?: string }

export interface Org {
  asOf: string;
  name: string;
  shortName: string;
  tagline: string;
  keyStats: Stat[];
  leadership: { name: string; title: string; since: string; prior: string; source: string }[];
  board: {
    chair: Officer;
    chairElect: Officer;
    pastChair: Officer;
    treasurer: Officer;
    directorsCount: string;
    note: string;
    source: string;
  };
  lobbying: {
    narrative: string;
    annual: { year: string; amount: string }[];
    ytd2026: { amount: string; through: string };
    inHouseLobbyists: { count: string; asOf: string };
    retainedFirms: { firm: string; amount2025: string; amount2026ytd: string; issues: string; notable: string }[];
    sources: Source[];
  };
  revolvingDoor: { narrative: string; people: { name: string; current: string; prior: string }[]; sources: Source[] };
  pahcf: {
    narrative: string;
    founded: string;
    memberCount: string;
    cumulativeSpend: string;
    byYear: { year: string; revenue: string; expenses: string }[];
    status2026: string;
    sources: Source[];
  };
  pac: {
    fecId: string;
    name: string;
    narrative: string;
    cycle2026: { receipts: string; disbursements: string; contributions: string; cashOnHand: string; asOf: string; demShare: string; repShare: string };
    cycle2024: { receipts: string; disbursements: string; contributions: string; demShare: string; repShare: string };
    topRecipients: { name: string; office: string; party: string; amount: string }[];
    sources: Source[];
  };
  developments: Development[];
  bottomLine: string;
  sources: Source[];
}

export interface BoardMember {
  slug: string;
  name: string;
  nickname: string;
  title: string;
  company: string;
  ticker?: string;
  owner?: string;
  fahRole: string;
  sector: string;
  overview: string;
  keyStats: Stat[];
  companyRecord: string[];
  ownership: string[];
  litigation: string[];
  compensation: { year: string; total: string; payRatio: string }[];
  deals: string[];
  politicalGiving: string[];
  developments: Development[];
  redFlags: string[];
  pohRelevance: string;
  sources: Source[];
  lastVerified: string;
}

export interface Pillar {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  threat: "Low" | "Moderate" | "High" | "Critical";
  threatReason: string;
  fahPosition: string;
  summary: string;
  status2026: { text: string; date: string; url: string }[];
  bills: { bill: string; title: string; sponsor: string; cosponsors: string; status: string; asOf: string; url: string }[];
  fahActions: Development[];
  keyFacts: { text: string; url: string }[];
  whatItMeans: string;
  sources: Source[];
  lastVerified: string;
}

export const org = orgData as Org;
export const board = boardData as BoardMember[];
export const pillars = pillarsData as Pillar[];

export function getMember(slug: string): BoardMember | undefined {
  return board.find((m) => m.slug === slug);
}
export function getPillar(slug: string): Pillar | undefined {
  return pillars.find((p) => p.slug === slug);
}
export function getAdjacentMember(slug: string): { prev: BoardMember | null; next: BoardMember | null } {
  const i = board.findIndex((m) => m.slug === slug);
  return { prev: i > 0 ? board[i - 1] : null, next: i >= 0 && i < board.length - 1 ? board[i + 1] : null };
}
export function getAdjacentPillar(slug: string): { prev: Pillar | null; next: Pillar | null } {
  const i = pillars.findIndex((p) => p.slug === slug);
  return { prev: i > 0 ? pillars[i - 1] : null, next: i >= 0 && i < pillars.length - 1 ? pillars[i + 1] : null };
}
export function fmtDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
export const threatTone: Record<Pillar["threat"], string> = {
  Low: "border-cream/30 text-cream/70",
  Moderate: "border-orange/50 text-orange",
  High: "border-orange text-orange",
  Critical: "border-red-500 text-red-400",
};
