import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { committees, getCommittee } from '@/lib/committees';
import CommitteeDossierPage from '@/components/committees/CommitteeDossierPage';
import { WM_BASE, WM_SLUG, wmMembers, wmVotes, wmMeta } from '@/lib/wm';

/** /committees/[slug]: committee dossiers in the brief's format (section 4.4). Senate Finance first. */

export function generateStaticParams() {
  return committees.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCommittee(params.slug);
  if (!c) return {};
  return {
    title: `${c.name} | Government`,
    description: c.verdict,
    alternates: { canonical: `https://rojasreport.com/committees/${c.slug}/` },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const c = getCommittee(params.slug);
  if (!c) notFound();
  const desk =
    c.slug === WM_SLUG
      ? { base: WM_BASE, memberSlugs: wmMembers.map((m) => m.slug), members: wmMembers.length, votes: wmVotes.length, notReturning: wmMeta.notReturning }
      : undefined;
  return <CommitteeDossierPage c={c} desk={desk} />;
}
