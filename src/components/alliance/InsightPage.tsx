import Link from 'next/link';
import { Band, Breadcrumb, InsightCard, Stat, StatBand, Tag, Takeaways, fmtDate, lede, wrap } from '@/components/alliance/ui';
import ShareTools from '@/components/alliance/ShareTools';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { insightsFor, issueSlug, type Insight } from '@/lib/insights';
import { absolute } from '@/lib/site';
import { articleJsonLd, breadcrumbsJsonLd } from '@/lib/seo';

/**
 * Template for one insight (ported from the Alliance site's Insight layout). Reading order: title and dek, the answer
 * in three lines, the numbers, the body with its pictures, the numbered sources, related pieces, the Join band.
 */
export default function InsightPage({ insight: d }: { insight: Insight }) {
  const path = `/insights/${d.slug}/`;
  const url = absolute(path);
  const related = insightsFor(d.issue).filter((i) => i.slug !== d.slug).slice(0, 3);
  const Body = d.Body;
  return (
    <>
      <JsonLd data={[breadcrumbsJsonLd([{ name: 'Insights', path: '/insights/' }, { name: d.title, path }]), articleJsonLd({ title: d.title, description: d.summary, path, date: d.date, author: d.author })]} />
      <article>
        <header className="pt-12 md:pt-24 pb-10 md:pb-16">
          <div className={`${wrap} grid grid-cols-12`}>
            <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">
              <Breadcrumb trail={[{ name: 'Insights', href: '/insights/' }, { name: d.format, href: `/insights/?format=${d.format}` }]} />
              <div className="flex gap-3 items-center text-[13px]">
                <Tag>{d.format}</Tag>
                <Link href={`/insights/?issue=${issueSlug(d.issue)}`} className="hover:underline">{d.issue}</Link>
              </div>
              <h1 className="font-prose font-medium tracking-[-0.015em] text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1]">{d.title}</h1>
              <p className={lede}>{d.summary}</p>
              <p className="text-[15px]"><time dateTime={d.date}>{fmtDate(d.date)}</time> · {d.readTime} min read · {d.author}</p>
            </div>
          </div>
        </header>

        <Takeaways items={d.takeaways} text="Three things to take from this piece." tools={<ShareTools url={url} title={d.title} pdf={d.pdf && !d.pdf.startsWith('[') ? d.pdf : undefined} />} />

        {d.numbers.length > 0 && (
          <StatBand eyebrow="The numbers">
            {d.numbers.map((n) => <Stat key={n.label} {...n} dark />)}
          </StatBand>
        )}

        <Band>
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-8 lg:col-start-3 prose-site">
              <Body />
              {d.sources.length > 0 && (
                <section aria-label="Sources" className="mt-12 pt-6 border-t border-hairline">
                  <h2 className="font-tight font-bold text-[16px] tracking-[0.04em] uppercase !mt-0 mb-4">Sources</h2>
                  <ol className="text-[15px] leading-[1.5] pl-8 grid gap-2">
                    {d.sources.map((s, i) => (
                      <li key={i} id={`src-${i + 1}`} className={`target:bg-accent/20 ${s.label.startsWith('[') ? 'tbd' : ''}`}>
                        {s.url ? <a href={s.url} rel="noopener">{s.label}</a> : s.label}
                        {s.url && <span className="hidden print:inline text-[0.8em] break-all"> {s.url}</span>}
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </div>
          </div>
        </Band>
      </article>

      {related.length > 0 && (
        <Band mist label="Related insights" className="print:hidden">
          <div className="mb-10 flex flex-col gap-3">
            <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Related</p>
            <h2 className="font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[48px]">More on {d.issue}</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((i) => (
              <InsightCard key={i.slug} title={i.title} format={i.format} issue={i.issue} date={i.date} readTime={i.readTime} href={`/insights/${i.slug}/`} summary={i.summary} />
            ))}
          </div>
        </Band>
      )}

      <JoinBand />
    </>
  );
}
