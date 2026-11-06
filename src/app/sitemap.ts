import type { MetadataRoute } from 'next';
import { getAllStateSlugs } from '@/lib/data';
import ahaProfiles from '@/data/aha/profiles.json';
import hacMembers from '@/data/hac/members.json';
import fahBoard from '@/data/fah/board.json';
import fahPillars from '@/data/fah/pillars.json';
import { systems } from '@/lib/systems';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rojasreport.com';
  const now = new Date().toISOString();

  const staticPages = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/con/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/academic/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/drivers/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/states/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/systems/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/carriers/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/physician-owned/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/government/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/lobby/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/reports/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/support/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/rankings/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/scope/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/compare/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/evidence/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/reform/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/outcomes/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/timeline/`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.6 },
    { url: `${baseUrl}/methodology/`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 },
  ];

  const systemPages = systems.map((s) => ({
    url: `${baseUrl}/systems/${s.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const stateSlugs = getAllStateSlugs();
  const statePages = stateSlugs.map(slug => ({
    url: `${baseUrl}/states/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const ahaBase = 'https://rojasreport.com/aha';
  const ahaPages = [
    { url: `${ahaBase}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${ahaBase}/powermap/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${ahaBase}/about/`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
    ...(ahaProfiles as { slug: string }[]).map(p => ({
      url: `${ahaBase}/profiles/${p.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const hacBase = 'https://rojasreport.com/hac';
  const hacPages = [
    { url: `${hacBase}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${hacBase}/pattern-analysis/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    ...(hacMembers as { slug: string }[]).map(m => ({
      url: `${hacBase}/members/${m.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const fahBase = 'https://rojasreport.com/fah';
  const fahPages = [
    { url: `${fahBase}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${fahBase}/pillars/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${fahBase}/lobbying/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${fahBase}/pac/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    ...(fahBoard as { slug: string }[]).map(m => ({ url: `${fahBase}/board/${m.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...(fahPillars as { slug: string }[]).map(p => ({ url: `${fahBase}/pillars/${p.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];

  return [...staticPages,
    ...systemPages, ...statePages, ...ahaPages, ...hacPages, ...fahPages];
}
