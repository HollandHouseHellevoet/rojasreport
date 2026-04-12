import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllStateSlugs, getState } from '@/lib/data';
import { makeMetadata, stateJsonLd } from '@/lib/seo';
import StateDossier from '@/components/StateDossier';

interface PageProps {
  params: { state: string };
}

export function generateStaticParams() {
  return getAllStateSlugs().map((slug) => ({ state: slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const state = getState(params.state);
  if (!state) return {};

  const title = `Certificate of Need Laws in ${state.state} | CON Intelligence`;
  const description = state.meta_description ||
    `${state.state} CON score ${state.score}/100 (${state.tier}). Full intelligence dossier: scope, market data, case law, reform status.`;

  return makeMetadata({
    title,
    description,
    path: `/states/${state.slug}/`,
    ogImage: `/og/${state.slug}.svg`,
  });
}

export default function StatePage({ params }: PageProps) {
  const state = getState(params.state);
  if (!state) notFound();

  const jsonLd = stateJsonLd({
    name: state.state,
    slug: state.slug,
    description: state.meta_description || `CON intelligence for ${state.state}`,
    score: state.score,
    tier: state.tier,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StateDossier state={state} />
    </>
  );
}
