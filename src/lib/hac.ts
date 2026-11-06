import membersData from "@/data/hac/members.json";
import committeeData from "@/data/hac/committee.json";

export interface Source { label: string; url: string }
export interface CareerStop { role: string; org?: string; period?: string }
export interface Development { date: string; text: string; url: string }
export interface Member {
  slug: string;
  name: string;
  nickname: string;
  title: string;
  org: string;
  sector: string;
  base?: string;
  overview: string;
  careerArc: CareerStop[];
  businessDetails?: string[];
  redFlags: string[];
  pohRelevance: string;
  sources: Source[];
  lastVerified?: string;
  committeeStatus?: string;
  developments?: Development[];
}
export interface Committee {
  name: string;
  shortName: string;
  announced: string;
  authority: string;
  reportsTo: string;
  focusAreas: string;
  memberCount: number;
  nominations: string;
  asOf: string;
  thesis: string;
  thesisDate: string;
  chair: string;
  dfo: string;
  charter: string;
  nextMeeting: { date: string; text: string; url: string };
  meetings: { date: string; label: string; text: string; url: string }[];
  workingGroups: { name: string; lead: string; members: string }[];
  workProducts: string;
  scrutiny: { date: string; text: string; url: string }[];
  sectorBreakdown: { sector: string; count: number; members: string }[];
  notAtTable: string[];
  sources: Source[];
}

export const members = membersData as Member[];
export const committee = committeeData as Committee;
export const current = members.filter((m) => !(m.committeeStatus || "").toLowerCase().startsWith("former"));

export function getMember(slug: string): Member | undefined {
  return members.find((m) => m.slug === slug);
}
export function getAdjacent(slug: string): { prev: Member | null; next: Member | null } {
  const i = members.findIndex((m) => m.slug === slug);
  return { prev: i > 0 ? members[i - 1] : null, next: i >= 0 && i < members.length - 1 ? members[i + 1] : null };
}
export function fmtDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
