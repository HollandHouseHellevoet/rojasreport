import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getState } from '@/lib/data';
import { stateDossiers } from '@/lib/stateDossiers';
import { makeMetadata, stateJsonLd } from '@/lib/seo';
import StateDossier from '@/components/StateDossier';

/** The CON desk's state page for states whose /states/[state] URL now carries the state dossier. */

interface PageProps {
  params: { state: string };
}

export function generateStaticParams() {
  return stateDossiers.filter((d) => getState(d.slug)).map((d) => ({ state: d.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const state = getState(params.state);
  if (!state) return {};
  return makeMetadata({
    title: `Certificate of Need Laws in ${state.state} | CON Intelligence`,
    description: state.meta_description ||
      `${state.state} CON score ${state.score}/100 (${state.tier}). Full intelligence dossier: scope, market data, case law, reform status.`,
    path: `/con/${state.slug}/`,
    ogImage: `/og/${state.slug}.svg`,
  });
}

export default function ConStatePage({ params }: PageProps) {
  const state = getState(params.state);
  if (!state || !stateDossiers.some((d) => d.slug === params.state)) notFound();

  const jsonLd = stateJsonLd({
    name: state.state,
    slug: state.slug,
    description: state.meta_description || `CON intelligence for ${state.state}`,
    score: state.score,
    tier: state.tier,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StateDossier state={state} />
    </>
  );
}
