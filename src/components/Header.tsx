'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, UTILITY, JOIN } from '@/lib/nav';
import Wordmark from '@/components/Wordmark';

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="shrink-0">
      <path d="M2 8h11M8 3l5 5-5 5" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * One header site-wide, the Alliance pattern: ink utility bar, the wordmark, seven top items that open a panel of
 * second-level links, the Join button. On phones the burger opens a full-screen accordion.
 */
export default function Header() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const isActive = (href: string) => href !== '/' && pathname.startsWith(href);

  // Close the panel on route change, Escape, outside click or focus leaving the header.
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = mobile ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [mobile]);

  const hover = (i: number | null) => {
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(i), i === null ? 160 : 80);
  };

  return (
    <header ref={ref} className="print:hidden sticky top-0 z-50" onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(null); }}>
      {/* Utility bar */}
      <nav aria-label="Utility" className="hidden lg:block bg-ink text-ink-text-2">
        <div className="max-w-content mx-auto px-4 md:px-8 h-9 flex justify-between items-center gap-6 font-meta text-[13px]">
          <span className="font-tight tracking-[0.04em]">A 501(c)(6) trade association</span>
          <ul className="flex items-center gap-6">
            {UTILITY.map((u) => (
              <li key={u.href}><Link href={u.href} className="hover:text-paper">{u.label}</Link></li>
            ))}
            <li><Link href={JOIN.href} className="font-semibold text-paper">Join</Link></li>
          </ul>
        </div>
      </nav>

      {/* Wordmark, primary nav, Join */}
      <div className="bg-paper border-b border-hairline">
        <div className="max-w-content mx-auto px-4 md:px-8 flex items-center justify-between gap-4 h-16 relative">
          <Wordmark />
          <nav aria-label="Primary" className="hidden lg:block flex-1">
            <ul className="flex justify-center gap-1 h-16">
              {NAV.map((n, i) => {
                const isOpen = open === i;
                return (
                  <li key={n.href} onMouseEnter={() => hover(i)} onMouseLeave={() => hover(null)}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className={`relative inline-flex items-center gap-1.5 h-16 px-2.5 xl:px-3.5 font-tight font-semibold text-[14px] xl:text-[15px] whitespace-nowrap after:content-[''] after:absolute after:left-2.5 after:right-2.5 after:bottom-0 after:h-[2px] after:bg-oxblood after:origin-left after:transition-transform ${
                        isActive(n.href) || isOpen ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                      } ${isActive(n.href) ? 'text-oxblood' : 'text-ink'}`}
                    >
                      {n.label}
                      <Chevron open={isOpen} />
                    </button>
                    <div id={`panel-${i}`} hidden={!isOpen} className="absolute left-0 right-0 top-16 bg-paper border-b border-hairline shadow-[0_24px_40px_-32px_rgba(28,27,25,0.35)]">
                      <div className="max-w-content mx-auto px-4 md:px-8 py-9">
                        <Link href={n.href} className="inline-flex items-center gap-2 font-tight font-bold text-[18px] mb-5 hover:underline">
                          {n.label} overview <Arrow />
                        </Link>
                        <ul className="grid grid-cols-3 gap-6">
                          {n.items.map((it) => (
                            <li key={it.href}>
                              <Link href={it.href} className="group flex flex-col gap-1 pt-3.5 border-t border-hairline">
                                <strong className="font-tight font-semibold text-[16px] group-hover:underline">{it.label}</strong>
                                {it.blurb && <span className="text-[15px] leading-[1.45]">{it.blurb}</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Link href={JOIN.href} className="hidden xl:inline-flex items-center min-h-[44px] px-5 bg-ink text-paper font-tight font-semibold text-[15px] leading-none hover:bg-black whitespace-nowrap">
              {JOIN.label}
            </Link>
            <button
              type="button"
              aria-expanded={mobile}
              aria-controls="mobile-nav"
              onClick={() => setMobile((m) => !m)}
              className="lg:hidden w-11 h-11 inline-flex items-center justify-center -mr-2"
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden="true" className="flex flex-col gap-[5px] w-[22px]">
                <i className={`block h-[2px] bg-ink transition-transform ${mobile ? 'translate-y-[7px] rotate-45' : ''}`} />
                <i className={`block h-[2px] bg-ink transition-opacity ${mobile ? 'opacity-0' : ''}`} />
                <i className={`block h-[2px] bg-ink transition-transform ${mobile ? '-translate-y-[7px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Phones: full-screen accordion */}
        <div id="mobile-nav" hidden={!mobile} className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-paper overflow-y-auto z-40">
          <div className="max-w-content mx-auto px-4 md:px-8 pt-2 pb-10">
            <ul>
              {NAV.map((n) => (
                <li key={n.href} className="border-b border-hairline">
                  <details>
                    <summary className="flex justify-between items-center py-4 font-tight font-bold text-[20px] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      {n.label}
                      <svg width="12" height="12" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                    </summary>
                    <ul className="pb-4 flex flex-col">
                      <li><Link href={n.href} className="block py-2 text-[17px]">{n.label} overview</Link></li>
                      {n.items.map((it) => (
                        <li key={it.href}><Link href={it.href} className="block py-2 text-[17px]">{it.label}</Link></li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-6 mt-6 text-[15px]">
              {UTILITY.map((u) => (
                <li key={u.href}><Link href={u.href}>{u.label}</Link></li>
              ))}
            </ul>
            <Link href={JOIN.href} className="mt-6 flex items-center justify-center min-h-[48px] bg-accent text-ink font-tight font-semibold text-[15px]">
              {JOIN.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
