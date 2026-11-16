import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InsightPage from '@/components/alliance/InsightPage';
import { getInsight, insights } from '@/lib/insights';
import { makeMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const i = getInsight(params.slug);
  if (!i) return {};
  return { ...makeMetadata({ title: i.title, description: i.summary, path: `/insights/${i.slug}/` }), openGraph: { type: 'article', title: i.title, description: i.summary, url: `https://tafhc.org/insights/${i.slug}/` } };
}

export default function Page({ params }: { params: { slug: string } }) {
  const i = getInsight(params.slug);
  if (!i) notFound();
  return <InsightPage insight={i} />;
}
