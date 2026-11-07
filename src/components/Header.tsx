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

const label = 'font-meta uppercase tracking-[0.12em]';

function NavLinks({ pathname, size }: { pathname: string; size: 'home' | 'compact' }) {
  const cls = size === 'home' ? 'text-[13px]' : 'text-[12px]';
  return (
    <>
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`${label} ${cls} py-4 border-b ${
              active ? 'text-oxblood border-oxblood' : 'text-ink border-transparent hover:text-oxblood'
            }`}
          >
            {size === "home" ? ((item as { homeLabel?: string }).homeLabel ?? item.label) : item.label}
          </Link>
        );
      })}
    </>
  );
}

function SupportButton({ text }: { text: string }) {
  return (
    <Link
      href={SUPPORT.href}
      className={`${label} text-[12px] tracking-[0.1em] bg-oxblood text-paper px-4 py-2.5 hover:bg-oxblood-hover`}
    >
      {text}
    </Link>
  );
}

/** Full masthead on the home page; one-line compact masthead everywhere else. */
export default function Header() {
  const pathname = usePathname() || '/';
  const home = pathname === '/';

  if (home) {
    return (
      <header>
        {/* Utility bar */}
        <div className="border-b border-hairline">
          <div className={`max-w-content mx-auto px-5 md:px-8 py-2.5 flex flex-wrap gap-x-6 gap-y-2 justify-between items-center ${label} text-[12px] tracking-[0.08em] text-muted`}>
            <span>{BUILD_DATE}</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
              {UTILITY.map((u) =>
                u.href.startsWith('http') ? (
                  <a key={u.href} href={u.href} className="hover:text-oxblood">{u.label}</a>
                ) : (
                  <Link key={u.href} href={u.href} className="hover:text-oxblood">{u.label}</Link>
                ),
              )}
              <SupportButton text="Support the Report" />
            </div>
          </div>
        </div>

        {/* Masthead */}
        <div className="max-w-content mx-auto px-5 md:px-8 pt-12 pb-7 text-center">
          <p className={`${label} text-[11px] tracking-[0.32em] text-muted mb-4`}>Healthcare Intelligence</p>
          <Link href="/" className="inline-block">
            <h1
              className="font-display font-medium text-oxblood leading-[0.92] tracking-[0.04em]"
              style={{ fontSize: 'clamp(3rem, 7.5vw, 5.5rem)' }}
            >
              THE ROJAS<br />REPORT
            </h1>
          </Link>
          <p className="mt-6 mx-auto max-w-[640px] italic text-[22px] leading-[1.4] text-body">
            Why healthcare costs what it does, who profits, and how physicians take it back.
          </p>
        </div>

        {/* Nav */}
        <nav aria-label="Primary" className="border-t border-ink border-b border-b-hairline">
          <div className="max-w-content mx-auto px-5 md:px-8 flex flex-wrap justify-center gap-x-8 lg:gap-x-10">
            <NavLinks pathname={pathname} size="home" />
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="border-b border-ink">
      <div className="max-w-content mx-auto px-5 md:px-8 py-2 flex flex-wrap gap-x-8 gap-y-1 justify-between items-center">
        <Link href="/" className="font-display font-medium text-[24px] md:text-[26px] tracking-[0.04em] text-oxblood py-2">
          THE ROJAS REPORT
        </Link>
        <nav aria-label="Primary" className="order-3 lg:order-2 w-full lg:w-auto flex flex-wrap gap-x-6 xl:gap-x-7 -mt-1">
          <NavLinks pathname={pathname} size="compact" />
        </nav>
        <div className="order-2 lg:order-3 flex items-center gap-5">
          <Link href="/search/" aria-label="Search" className="text-ink hover:text-oxblood p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </Link>
          <Link href="/reports/" className={`${label} text-[12px] text-muted hover:text-oxblood hidden sm:inline`}>
            Reports &amp; Data
          </Link>
          <SupportButton text="Support" />
        </div>
      </div>
    </header>
  );
}
