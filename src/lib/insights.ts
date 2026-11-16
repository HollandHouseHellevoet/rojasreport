import type { ComponentType } from 'react';
import { ORG } from '@/lib/site';
import * as facilityFee from '@/content/insights/where-the-facility-fee-goes';
import * as section6001 from '@/content/insights/what-independent-practice-lost-after-section-6001';
import * as purchases340b from '@/content/insights/340b-purchases-by-hospital-type';

/**
 * The Alliance's insights: reports, briefs and data, each a module in src/content/insights with `meta` and a `Body`.
 * Ported from the Alliance site's content collection. Add a piece by adding a module and listing it here.
 */

export const ISSUES = ['Site-Neutral', '340B', 'Physician Ownership'] as const;
export const FORMATS = ['Report', 'Brief', 'Data', 'Testimony', 'Op-ed'] as const;
export type Issue = (typeof ISSUES)[number];
export type Format = (typeof FORMATS)[number];

export interface InsightMeta {
  slug: string;
  title: string;
  date: string;
  issue: Issue;
  format: Format;
  author?: string;
  summary: string;
  readTime: number;
  takeaways: string[];
  numbers: { value: string; label: string; source: string; url?: string }[];
  sources: { label: string; url?: string }[];
  pdf?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface Insight extends InsightMeta {
  author: string;
  Body: ComponentType;
}

const modules: { meta: InsightMeta; Body: ComponentType }[] = [facilityFee, section6001, purchases340b];

export const insights: Insight[] = modules
  .map((m) => ({ ...m.meta, author: m.meta.author ?? ORG, Body: m.Body }))
  .filter((i) => !i.draft)
  // Newest first; on the same date the featured piece leads.
  .sort((a, b) => b.date.localeCompare(a.date) || Number(!!b.featured) - Number(!!a.featured));

for (const i of insights) {
  for (const n of i.numbers) if (!n.source) throw new Error(`insight "${i.slug}": number "${n.label}" has no source.`);
  if (i.takeaways.length < 1) throw new Error(`insight "${i.slug}": no takeaways.`);
}

export const getInsight = (slug: string) => insights.find((i) => i.slug === slug);
export const insightsFor = (issue: Issue) => insights.filter((i) => i.issue === issue);

export const issueSlug = (issue: string) =>
  (({ 'Site-Neutral': 'site-neutral', '340B': '340b', 'Physician Ownership': 'physician-ownership' }) as Record<string, string>)[issue] ?? issue;
export const slugIssue = (slug: string) =>
  (({ 'site-neutral': 'Site-Neutral', '340b': '340B', 'physician-ownership': 'Physician Ownership' }) as Record<string, string>)[slug] ?? slug;
