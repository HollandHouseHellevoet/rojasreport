import type { Metadata } from 'next';
import { Band, Breadcrumb, eyebrow, lede } from '@/components/alliance/ui';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'Founder',
  description: 'The founder’s column: Dutch Rojas on competition in American healthcare. The one place the Alliance speaks in the first person.',
  path: '/founder/',
});

// The column (MERGER_PLAN.md, section 5.3): bylined Dutch Rojas, first person allowed here and nowhere else. Columns are
// added to this list as Dutch writes them; the page never links to his personal newsletter. The first text is his to supply.
const columns: { slug: string; date: string; title: string; dek: string }[] = [];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'About', path: '/about/' }, { name: 'Founder', path: '/founder/' }])} />
      <Band>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Breadcrumb trail={[{ name: 'About', href: '/about/' }, { name: 'Founder', href: '/founder/' }]} />
            <p className={eyebrow}>The founder’s column</p>
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[64px]">Dutch Rojas.</h1>
            <p className={lede}>
              The Alliance speaks in the third person everywhere on this site but here. This column is bylined to its founder, a healthcare entrepreneur and Marine veteran who has spent two decades building physician-led companies and writing about the rules that keep a hospital from facing a competitor.
            </p>
          </div>
        </div>
      </Band>
      <Band tight mist label="Columns">
        <h2 className="font-tight font-bold text-[28px] tracking-[-0.02em] mb-6">Columns</h2>
        {columns.length === 0 && <p className="text-[16px]">The first column follows the public launch.</p>}
        <div className="grid gap-8">
          {columns.map((c) => (
            <article key={c.slug} className="flex flex-col gap-2 pt-5 border-t border-hairline">
              <p className="text-[13px]">{c.date}</p>
              <h3 className="font-tight font-bold text-[22px]"><a href={`/founder/${c.slug}/`} className="hover:underline">{c.title}</a></h3>
              <p className="text-[15px]">{c.dek}</p>
            </article>
          ))}
        </div>
      </Band>
      <JoinBand />
    </>
  );
}
