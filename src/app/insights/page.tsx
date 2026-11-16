import type { Metadata } from 'next';
import { Hero } from '@/components/alliance/ui';
import InsightsList from '@/components/alliance/InsightsList';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { insights } from '@/lib/insights';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'Insights',
  description: 'Reports, briefs and data from the Alliance on site-neutral payment, 340B reform and physician ownership. Every figure carries its source.',
  path: '/insights/',
});

export default function Page() {
  const items = insights.map(({ Body: _body, ...rest }) => rest);
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Insights', path: '/insights/' }])} />
      <Hero eyebrow="Insights" title="Data lawmakers and staff can cite." text="Reports, briefs and data, each with its sources listed and a PDF to hand across a desk. Filter by fight or by format." />
      <InsightsList items={items} />
      <JoinBand />
    </>
  );
}
