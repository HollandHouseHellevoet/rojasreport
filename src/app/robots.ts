import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Held off the site or not for indexing: Reports & Data (D7), the post-payment thanks pages.
      disallow: ['/reports/', '/physicians/join/thanks/', '/give/thanks/'],
    },
    sitemap: 'https://tafhc.org/sitemap.xml',
  };
}
