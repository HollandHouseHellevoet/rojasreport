import type { Metadata } from 'next';

const SITE_URL = 'https://conlaws.rojasreport.com';
const SITE_NAME = 'The Rojas Report — CON Intelligence';

export function makeMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function stateJsonLd(state: {
  name: string;
  slug: string;
  description: string;
  score: number;
  tier: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Certificate of Need Data: ${state.name}`,
    description: state.description,
    url: `${SITE_URL}/states/${state.slug}/`,
    creator: {
      '@type': 'Organization',
      name: 'The Rojas Report',
      url: 'https://rojasreport.com',
    },
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'CON Restrictiveness Score', value: state.score },
      { '@type': 'PropertyValue', name: 'Tier Classification', value: state.tier },
    ],
  };
}
