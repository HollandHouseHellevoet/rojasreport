'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import type { SearchEntry } from '@/lib/searchIndex';
import { search } from '@/lib/search';

const TRY = [
  { label: 'North Carolina', href: '/states/north-carolina/' },
  { label: 'American Hospital Association', href: '/aha/' },
  { label: 'Ways and Means', href: '/committees/ways-and-means/' },
  { label: 'Physician-owned hospitals', href: '/physician-owned/' },
];

function Smart({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith('http') ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );
}

/** Search across everything: a client-side filter over the build-time index. The page around it carries the heading. */
export default function Search({ index }: { index: SearchEntry[] }) {
  const [q, setQ] = useState('');
  const id = useId();
  const results = useMemo(() => search(index, q, 8), [q, index]);

  return (
    <section className="max-w-content mx-auto px-4 md:px-8 pt-8 md:pt-10" aria-label="Search">
      <form
        role="search"
        action="/search/"
        method="get"
        onSubmit={(e) => {
          if (q.trim().length < 2) e.preventDefault();
        }}
        className="relative max-w-[760px]"
      >
        <label htmlFor={id} className="sr-only">Search the record</label>
        <div className="flex flex-wrap gap-3">
          <input
            id={id}
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the research: a health system, hospital, lawmaker or state"
            autoComplete="off"
            className="flex-[1_1_320px] min-w-0 min-h-[52px] bg-[#FBF8F2] border-[1.5px] border-ink rounded-none px-4 font-body text-[17px] text-ink placeholder:text-ink placeholder:opacity-70 outline-none focus:outline focus:outline-[3px] focus:outline-ink focus:outline-offset-1"
          />
          <button type="submit" className="min-h-[52px] inline-flex items-center gap-2.5 px-6 bg-oxblood text-paper border-[1.5px] border-oxblood font-tight font-semibold text-[15px] hover:bg-oxblood-hover">
            Search
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" /></svg>
          </button>
        </div>
        {results.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-20 bg-paper border-[1.5px] border-ink border-t-0 text-left">
            {results.map((r) => (
              <li key={r.href + r.title} className="border-b border-hairline last:border-b-0">
                <Smart href={r.href} className="flex flex-wrap justify-between gap-x-6 gap-y-1 px-4 py-3 hover:text-oxblood">
                  <span className="text-[17px]">{r.title}</span>
                  <span className="font-tight text-[13px] font-semibold uppercase tracking-[0.1em] self-center">{r.kind}</span>
                </Smart>
              </li>
            ))}
          </ul>
        )}
      </form>
      <div className="mt-5 text-[15px] flex flex-wrap gap-x-5 gap-y-2 items-baseline">
        <span className="font-semibold">Try:</span>
        {TRY.map((t) => (
          <Smart key={t.label} href={t.href} className="underline underline-offset-[3px] decoration-hairline hover:text-oxblood">{t.label}</Smart>
        ))}
      </div>
    </section>
  );
}
