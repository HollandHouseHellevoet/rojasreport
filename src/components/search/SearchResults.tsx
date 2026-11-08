'use client';

import { Suspense, useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { SearchEntry } from '@/lib/searchIndex';
import { search } from '@/lib/search';

function Smart({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith('http') ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );
}

function Results({ index }: { index: SearchEntry[] }) {
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  const [q, setQ] = useState(initial);
  const id = useId();
  const results = useMemo(() => search(index, q, 60), [q, index]);
  const trimmed = q.trim();

  return (
    <>
      <form role="search" action="/search/" method="get" className="mb-10">
        <label htmlFor={id} className="sr-only">Search</label>
        <div className="flex items-center gap-4 border-b-2 border-ink pb-3">
          <input
            id={id}
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a health system, hospital, lawmaker or state"
            autoComplete="off"
            autoFocus={!initial}
            className="flex-1 min-w-0 bg-transparent border-0 outline-none font-body text-[22px] md:text-[26px] text-ink placeholder:text-[#6B665D] py-2"
          />
          <button type="submit" aria-label="Search" className="p-2.5 min-w-[44px] min-h-[44px] text-ink hover:text-oxblood">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </button>
        </div>
      </form>

      {trimmed.length < 2 ? (
        <p className="italic text-[20px] text-muted">Type at least two letters.</p>
      ) : results.length === 0 ? (
        <div className="max-w-[720px]">
          <p className="italic text-[22px] text-body">Nothing on the site matches “{trimmed}” yet.</p>
          <p className="mt-4 text-[19px] leading-[1.55] text-body">
            The index covers every published page, health system, state and lawmaker. Pages in preparation are not listed until they go live.
            Browse <Link href="/systems/" className="border-b border-hairline hover:text-oxblood">health systems</Link>,{' '}
            <Link href="/states/" className="border-b border-hairline hover:text-oxblood">states</Link> or{' '}
            <Link href="/government/" className="border-b border-hairline hover:text-oxblood">government</Link> instead.
          </p>
        </div>
      ) : (
        <>
          <p className="italic text-[18px] text-muted mb-2" aria-live="polite">
            {results.length === 60 ? 'First 60 results' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`} for “{trimmed}”
          </p>
          <ul className="border-t border-ink">
            {results.map((r) => (
              <li key={r.href + r.title} className="border-b border-hairline">
                <Smart href={r.href} className="flex flex-wrap justify-between items-baseline gap-x-6 gap-y-1 py-4 hover:text-oxblood">
                  <span className="font-display text-[22px] md:text-[24px]">{r.title}</span>
                  <span className="font-meta text-[13px] uppercase tracking-[0.1em] text-muted">{r.kind}</span>
                </Smart>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

/** /search: the whole build-time index, filtered on the client from ?q=. */
export default function SearchResults({ index }: { index: SearchEntry[] }) {
  return (
    <Suspense fallback={<p className="italic text-[20px] text-muted">Loading the index.</p>}>
      <Results index={index} />
    </Suspense>
  );
}
