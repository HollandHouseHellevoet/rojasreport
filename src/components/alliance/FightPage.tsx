import type { ReactNode } from 'react';
import Link from 'next/link';
import { Band, Breadcrumb, InsightCard, SectionHead, Sources, Stat, StatBand, Takeaways, eyebrow, lede, wrap, type Figure } from '@/components/alliance/ui';
import StatusTracker from '@/components/alliance/StatusTracker';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { FIGHTS, rowsFor, type FightSlug } from '@/lib/fights';
import { insightsFor } from '@/lib/insights';
import { breadcrumbsJsonLd } from '@/lib/seo';
import { fmtDate } from '@/components/alliance/ui';

/**
 * One template for the three fight pages (ported from the Alliance site's Fight layout). Reading order: title and
 * the core number, the answer in three lines, the numbers, the problem, the fix, where it stands (the Tracker),
 * related insights, the sources, then the Join band.
 */
export default function FightPage({
  slug,
  title,
  stake,
  core,
  takeaways,
  numbers,
  sources,
  problem,
  fix,
  problemTitle = 'The problem',
  fixTitle = 'The fix',
}: {
  slug: FightSlug;
  title: string;
  stake: string;
  core: Figure;
  takeaways: string[];
  numbers: Figure[];
  sources: { id: string; text: string; url?: string }[];
  problem: ReactNode;
  fix: ReactNode;
  problemTitle?: string;
  fixTitle?: string;
}) {
  const issue = FIGHTS.find((f) => f.slug === slug)!.issue;
  const related = insightsFor(issue).slice(0, 3);
  const path = `/fights/${slug}/`;
  const agency = rowsFor(slug).filter((r) => r.lane === 'agency-court' || !r.primary);
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Our Fights', path: '/fights/' }, { name: title, path }])} />
      <section className="pt-14 md:pt-[112px] pb-12 md:pb-20">
        <div className={`${wrap} grid grid-cols-12 gap-y-12 items-end`}>
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
            <Breadcrumb trail={[{ name: 'Our Fights', href: '/fights/' }, { name: title, href: path }]} />
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[64px] lg:text-[80px]">{title}</h1>
            <p className={`${lede} max-w-[48ch]`}>{stake}</p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Stat size="lg" {...core} />
          </div>
        </div>
      </section>

      <Takeaways items={takeaways} />

      <StatBand eyebrow="The numbers" four={numbers.length >= 4}>
        {numbers.map((n) => <Stat key={n.label} {...n} dark />)}
      </StatBand>

      <Band id="problem" label={problemTitle}>
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 prose-site">
            <p className={`${eyebrow} mb-3`}>01</p>
            <h2 className="font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[48px] mb-6">{problemTitle}</h2>
            {problem}
          </div>
        </div>
      </Band>

      <Band dark id="fix" label={fixTitle} className="on-ink">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 prose-site">
            <p className={`${eyebrow} mb-3 text-ink-text`}>02</p>
            <h2 className="font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[48px] mb-6">{fixTitle}</h2>
            {fix}
          </div>
        </div>
      </Band>

      <Band mist id="status" label="Where it stands">
        <SectionHead eyebrow="03" title="Where it stands" text="The current stage of the Alliance's bill, and the date it was last checked. Every row of the Tracker carries its source." link={{ label: 'The Tracker', href: '/tracker/' }} />
        <StatusTracker slug={slug} />
        {agency.length > 0 && (
          <div className="mt-12 border-t border-ink pt-6">
            <h3 className="font-tight font-bold text-[18px] tracking-[-0.01em] mb-4">Rules, cases and other bills in this fight</h3>
            <ul className="grid gap-4 md:grid-cols-2">
              {agency.map((r) => (
                <li key={r.id} className="flex flex-col gap-1 text-[15px] leading-[1.5]">
                  <span className="font-tight font-semibold">{r.issue}</span>
                  <span>
                    <span className="font-tight text-[11px] font-bold uppercase tracking-[0.12em] border border-ink px-1.5 py-[3px] mr-2">{r.stage}</span>
                    {r.vehicle}
                  </span>
                  <span className="text-[13px]">
                    {r.direction === 'open' ? 'Direction open' : r.direction.charAt(0).toUpperCase() + r.direction.slice(1)} · checked {fmtDate(r.as_of)} ·{' '}
                    <a href={r.source} rel="noopener" className="underline underline-offset-[3px]">Source</a>
                    {r.href && <> · <Link href={r.href} className="underline underline-offset-[3px]">Detail</Link></>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Band>

      {related.length > 0 && (
        <Band id="related" label="Related insights">
          <SectionHead eyebrow="04" title="Related insights" link={{ label: `All ${issue} insights`, href: `/insights/?issue=${slug}` }} />
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((i) => (
              <InsightCard key={i.slug} title={i.title} format={i.format} issue={i.issue} date={i.date} readTime={i.readTime} href={`/insights/${i.slug}/`} summary={i.summary} />
            ))}
          </div>
        </Band>
      )}

      <Band tight id="sources" label="Sources">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <Sources items={sources} />
          </div>
        </div>
      </Band>

      <JoinBand />
    </>
  );
}
