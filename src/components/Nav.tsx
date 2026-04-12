'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'States' },
  { href: '/rankings/', label: 'Rankings' },
  { href: '/scope/', label: 'Scope Matrix' },
  { href: '/compare/', label: 'Compare' },
  { href: '/reform/', label: 'Reform Tracker' },
  { href: '/evidence/', label: 'Evidence' },
  { href: 'https://read.rojasreport.com', label: 'Subscribe', external: true },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-navy border-b border-white/10">
      <div className="max-w-content mx-auto px-5 py-4 flex items-center justify-between">
        {/* Left: brand */}
        <Link href="/" className="flex flex-col" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-bold text-cream leading-none">
            The Rojas Report
          </span>
          <span className="font-body text-[11px] text-cream/40 tracking-wide mt-0.5">
            Healthcare Intelligence
          </span>
        </Link>

        {/* Right: desktop links */}
        <div className="hidden md:flex items-center gap-6 font-body text-[15px]">
          {navLinks.map(link =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="text-cream/50 hover:text-cream transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/50 hover:text-cream transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <a
            href="https://rojasreport.com"
            className="text-orange hover:text-orange-light transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            rojasreport.com
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-cream/60 hover:text-cream p-1"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-navy-dark">
          <div className="max-w-content mx-auto px-5 py-4 flex flex-col gap-3">
            {navLinks.map(link =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-cream/60 hover:text-cream transition-colors font-body text-[15px] py-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-cream/60 hover:text-cream transition-colors font-body text-[15px] py-1"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="https://rojasreport.com"
              className="text-orange hover:text-orange-light transition-colors font-body text-[15px] py-1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              rojasreport.com
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
