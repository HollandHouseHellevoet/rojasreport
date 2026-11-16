'use client';

import { useEffect, useState } from 'react';
import { InsightCard, wrap } from '@/components/alliance/ui';
import { FORMATS, ISSUES, issueSlug, slugIssue, type InsightMeta } from '@/lib/insights';

/** The insights list with its filters. Reads ?issue= and ?format= on load and keeps the address in step. */
export default function InsightsList({ items }: { items: InsightMeta[] }) {
  const [issue, setIssue] = useState<string>('');
  const [format, setFormat] = useState<string>('');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const i = slugIssue(q.get('issue') ?? '');
    const f = q.get('format') ?? '';
    if ((ISSUES as readonly string[]).includes(i)) setIssue(i);
    if ((FORMATS as readonly string[]).includes(f)) setFormat(f);
  }, []);

  const update = (nextIssue: string, nextFormat: string) => {
    setIssue(nextIssue);
    setFormat(nextFormat);
    const q = new URLSearchParams();
    if (nextIssue) q.set('issue', issueSlug(nextIssue));
    if (nextFormat) q.set('format', nextFormat);
    const s = q.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${s ? `?${s}` : ''}`);
  };

  const shown = items.filter((i) => (!issue || i.issue === issue) && (!format || i.format === format));
  const featured = !issue && !format ? shown.find((i) => i.featured) : undefined;
  const rest = featured ? shown.filter((i) => i.slug !== featured.slug) : shown;
  const chip = (on: boolean) => `font-tight text-[13px] font-semibold px-3 py-1.5 border-[1.5px] ${on ? 'bg-ink text-paper border-ink' : 'border-ink hover:bg-paper-2'}`;

  return (
    <section className="py-12 md:py-20">
      <div className={wrap}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10 mb-10" aria-label="Filters">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-tight text-[12px] font-semibold uppercase tracking-[0.12em] mr-1">Fight</span>
            <button type="button" className={chip(!issue)} onClick={() => update('', format)}>All</button>
            {ISSUES.map((i) => <button key={i} type="button" className={chip(issue === i)} onClick={() => update(i, format)} aria-pressed={issue === i}>{i}</button>)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-tight text-[12px] font-semibold uppercase tracking-[0.12em] mr-1">Format</span>
            <button type="button" className={chip(!format)} onClick={() => update(issue, '')}>All</button>
            {FORMATS.map((f) => <button key={f} type="button" className={chip(format === f)} onClick={() => update(issue, f)} aria-pressed={format === f}>{f}</button>)}
          </div>
        </div>

        {featured && (
          <article className="grid gap-6 lg:grid-cols-12 bg-mist p-7 md:p-10 mb-10">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <p className="font-tight text-[12px] font-semibold uppercase tracking-[0.12em]">Featured · {featured.format} · {featured.issue}</p>
              <h2 className="font-tight font-bold leading-[1.1] tracking-[-0.025em] text-[28px] md:text-[40px]"><a href={`/insights/${featured.slug}/`} className="hover:underline">{featured.title}</a></h2>
              <p className="text-[17px] leading-[1.5]">{featured.summary}</p>
              <p className="text-[13px]">{featured.readTime} min read</p>
            </div>
          </article>
        )}

        {rest.length === 0 && !featured ? (
          <p className="text-[17px]">No piece matches that filter yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {rest.map((i) => <InsightCard key={i.slug} title={i.title} format={i.format} issue={i.issue} date={i.date} readTime={i.readTime} href={`/insights/${i.slug}/`} summary={i.summary} />)}
          </div>
        )}
      </div>
    </section>
  );
}
