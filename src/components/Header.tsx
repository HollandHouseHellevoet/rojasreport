'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, UTILITY, SUPPORT } from '@/lib/nav';

const BUILD_DATE = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'America/New_York',
});

const tight = "font-tight";

function Mark({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`inline-block ${tight} font-extrabold text-[14px] tracking-[0.02em] leading-none px-3 py-2.5 ${
        dark ? 'bg-paper text-ink' : 'bg-ink text-paper'
      }`}
    >
      THE ROJAS REPORT
    </span>
  );
}

/** One header site-wide, in the Alliance-style layout: ink utility bar, then the boxed mark and the section nav. */
export default function Header() {
  const pathname = usePathname() || '/';

  return (
    <header className="print:hidden">
      {/* Utility bar */}
      <div className="bg-ink text-paper">
        <div className="max-w-content mx-auto px-4 md:px-8 h-9 flex justify-between items-center gap-6 font-meta text-[13px]">
          <span className="truncate">Healthcare intelligence<span className="hidden sm:inline"> · {BUILD_DATE}</span></span>
          <div className="flex items-center gap-6 shrink-0">
            {UTILITY.map((u) =>
              u.href.startsWith('http') ? (
                <a key={u.href} href={u.href} className="hidden md:inline hover:text-oxblood-text">{u.label}</a>
              ) : (
                <Link key={u.href} href={u.href} className="hidden md:inline hover:text-oxblood-text">{u.label}</Link>
              ),
            )}
            <Link href={SUPPORT.href} className="font-bold hover:text-oxblood-text">Support the Report</Link>
          </div>
        </div>
      </div>

      {/* Mark + nav */}
      <div className="border-b border-hairline bg-paper">
        <div className="max-w-content mx-auto px-4 md:px-8 flex flex-wrap items-center gap-x-10 min-h-[72px]">
          <Link href="/" aria-label="The Rojas Report home" className="py-4">
            <Mark />
          </Link>
          <nav
            aria-label="Primary"
            className="order-3 lg:order-2 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] lg:w-auto flex gap-x-6 xl:gap-x-7 overflow-x-auto -mx-4 md:-mx-8 px-4 md:px-8 lg:mx-0 lg:px-0 border-t border-hairline lg:border-t-0"
          >
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`${tight} font-semibold text-[15px] whitespace-nowrap py-3 lg:py-6 border-b-2 ${
                    active ? 'text-oxblood border-oxblood' : 'text-ink border-transparent hover:text-oxblood'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/search/" aria-label="Search" className="order-2 lg:order-3 ml-auto p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink hover:text-oxblood">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
