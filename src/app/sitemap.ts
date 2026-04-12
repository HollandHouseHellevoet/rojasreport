import type { MetadataRoute } from 'next';
import { getAllStateSlugs } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://conlaws.rojasreport.com';
  const now = new Date().toISOString();

  const staticPages = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/rankings/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/scope/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/compare/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/evidence/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/reform/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/outcomes/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/timeline/`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.6 },
    { url: `${baseUrl}/methodology/`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 },
  ];

  const stateSlugs = getAllStateSlugs();
  const statePages = stateSlugs.map(slug => ({
    url: `${baseUrl}/states/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...statePages];
}
