'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/rankings/', label: 'Rankings' },
  { href: '/scope/', label: 'Scope' },
  { href: '/compare/', label: 'Compare' },
  { href: '/evidence/', label: 'Evidence' },
  { href: '/reform/', label: 'Reform' },
  { href: '/timeline/', label: 'Timeline' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-navy border-b border-white/10">
      <div className="max-w-content mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-bold text-cream tracking-wide">
            CON LAWS
          </span>
          <span className="hidden sm:inline text-cream/40 text-xs font-body tracking-widest uppercase">
            The Rojas Report
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-body">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/60 hover:text-cream transition-colors hidden md:inline"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://rojasreport.com"
            className="text-orange hover:text-orange-light transition-colors hidden md:inline"
            target="_blank"
            rel="noopener noreferrer"
          >
            rojasreport.com
          </Link>
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
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-navy-dark">
          <div className="max-w-content mx-auto px-5 py-4 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/60 hover:text-cream transition-colors font-body text-sm py-1"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://rojasreport.com"
              className="text-orange hover:text-orange-light transition-colors font-body text-sm py-1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              rojasreport.com
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
