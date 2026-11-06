import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllStateSlugs, getState } from '@/lib/data';
import { getStateDossier, stateDossiers } from '@/lib/stateDossiers';
import { makeMetadata, stateJsonLd } from '@/lib/seo';
import StateDossier from '@/components/StateDossier';
import StateDossierPage from '@/components/states/StateDossierPage';

/**
 * /states/[state]: the state dossier in the brief's format where one is published (src/data/states),
 * otherwise the CON desk's state page. A state with a dossier keeps its CON page at /con/[state].
 */

interface PageProps {
  params: { state: string };
}

export function generateStaticParams() {
  const slugs = getAllStateSlugs();
  for (const d of stateDossiers) if (!slugs.includes(d.slug)) slugs.push(d.slug);
  return slugs.map((slug) => ({ state: slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const dossier = getStateDossier(params.state);
  if (dossier) {
    return {
      title: `${dossier.name} | States`,
      description: dossier.verdict,
      alternates: { canonical: `https://rojasreport.com/states/${dossier.slug}/` },
    };
  }
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
  const dossier = getStateDossier(params.state);
  if (dossier) return <StateDossierPage d={dossier} />;

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
