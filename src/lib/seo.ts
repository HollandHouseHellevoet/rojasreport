import type { Metadata } from 'next';
import { ORG, SITE_URL, SOCIAL, CONTACT, absolute } from '@/lib/site';

export { SITE_URL };
export const SITE_NAME = ORG;

export function makeMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  const ogImageUrl = opts.ogImage ? `${SITE_URL}${opts.ogImage}` : `${SITE_URL}/og/home.svg`;

  return {
    title: opts.title,
    description: opts.description,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [ogImageUrl],
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
  /** The page's own path; defaults to the state dossier path. */
  path?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Certificate of Need Data: ${state.name}`,
    description: state.description,
    url: `${SITE_URL}${state.path ?? `/states/${state.slug}/`}`,
    creator: {
      '@type': 'Organization',
      name: ORG,
      url: SITE_URL,
    },
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'CON Restrictiveness Score', value: state.score },
      { '@type': 'PropertyValue', name: 'Tier Classification', value: state.tier },
    ],
  };
}

/** Organization and WebSite entities for the root layout. */
export function siteJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: ORG,
      alternateName: 'TAFHC',
      url: SITE_URL,
      logo: absolute('/images/mark.png'),
      nonprofitStatus: 'https://schema.org/Nonprofit501c6',
      description:
        'A 501(c)(6) trade association of independent physicians, employers, payers and manufacturers working to restore competition in American healthcare.',
      sameAs: Object.values(SOCIAL).filter(Boolean),
      contactPoint: [{ '@type': 'ContactPoint', contactType: 'press', email: CONTACT.press }],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#site`,
      url: SITE_URL,
      name: ORG,
      publisher: { '@id': `${SITE_URL}/#org` },
    },
  ];
}

export function breadcrumbsJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: absolute(t.path),
    })),
  };
}

export function articleJsonLd(a: { title: string; description: string; path: string; date: string; author: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    mainEntityOfPage: absolute(a.path),
    datePublished: a.date,
    dateModified: a.date,
    author: { '@type': 'Organization', name: a.author },
    publisher: { '@id': `${SITE_URL}/#org` },
    image: absolute(a.image ?? '/og/home.svg'),
  };
}
