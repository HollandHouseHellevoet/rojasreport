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

/** Search across everything: a client-side filter over the build-time index. */
export default function Search({ index }: { index: SearchEntry[] }) {
  const [q, setQ] = useState('');
  const id = useId();
  const results = useMemo(() => search(index, q, 8), [q, index]);

  return (
    <section className="max-w-[880px] mx-auto px-5 md:px-8 pt-16 pb-[72px] text-center">
      <label htmlFor={id} className="block font-display text-[30px] md:text-[34px] mb-7">
        Follow the money in healthcare.
      </label>
      <form
        role="search"
        action="/search/"
        method="get"
        onSubmit={(e) => {
          if (q.trim().length < 2) e.preventDefault();
        }}
        className="relative"
      >
        <div className="flex items-center gap-4 border-b-2 border-ink pb-3">
          <input
            id={id}
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a health system, hospital, lawmaker or state"
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none font-body text-[20px] md:text-[24px] text-ink placeholder:text-[#6B665D] py-2"
          />
          <button type="submit" aria-label="Search" className="p-2.5 min-w-[44px] min-h-[44px] text-ink hover:text-oxblood">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </button>
        </div>
        {results.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-20 bg-paper border border-hairline border-t-0 text-left shadow-none">
            {results.map((r) => (
              <li key={r.href + r.title} className="border-b border-hairline last:border-b-0">
                <Smart href={r.href} className="flex flex-wrap justify-between gap-x-6 gap-y-1 px-5 py-3 hover:text-oxblood">
                  <span className="text-[19px]">{r.title}</span>
                  <span className="font-meta text-[12px] uppercase tracking-[0.1em] text-muted self-center">{r.kind}</span>
                </Smart>
              </li>
            ))}
          </ul>
        )}
      </form>
      <div className="mt-4 font-meta text-[13px] text-muted flex flex-wrap gap-x-5 gap-y-2 justify-center">
        <span>Try:</span>
        {TRY.map((t) => (
          <Smart key={t.label} href={t.href} className="text-muted border-b border-hairline hover:text-oxblood">{t.label}</Smart>
        ))}
      </div>
    </section>
  );
}
