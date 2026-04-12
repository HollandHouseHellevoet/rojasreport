'use client';

import { useState } from 'react';
import Link from 'next/link';

const primaryLinks = [
  { href: '/evidence/', label: 'Evidence' },
  { href: '/', label: 'States' },
  { href: '/rankings/', label: 'Rankings' },
];

const toolsLinks = [
  { href: '/scope/', label: 'Scope Matrix' },
  { href: '/compare/', label: 'Compare' },
  { href: '/reform/', label: 'Reform Tracker' },
  { href: '/outcomes/', label: 'Outcomes' },
  { href: '/timeline/', label: 'Timeline' },
  { href: '/methodology/', label: 'Methodology' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <nav className="bg-navy border-b border-orange print:hidden">
      <div className="max-w-content mx-auto px-5 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex flex-col" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-bold text-cream leading-none">
            The Rojas Report
          </span>
          <span className="font-body text-[11px] font-semibold text-orange tracking-[0.15em] uppercase mt-0.5">
            Healthcare Intelligence
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 font-body text-[15px]">
          {primaryLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/60 hover:text-cream transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Tools dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              className="text-cream/60 hover:text-cream transition-colors flex items-center gap-1"
              onClick={() => setToolsOpen(!toolsOpen)}
              aria-expanded={toolsOpen}
            >
              Tools
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 5 6 8 9 5"/></svg>
            </button>
            {toolsOpen && (
              <div className="absolute top-full right-0 mt-1 bg-navy-light border border-white/10 py-2 min-w-[180px] z-20">
                {toolsLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 font-body text-sm text-cream/60 hover:text-cream hover:bg-white/5 transition-colors"
                    onClick={() => setToolsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href="https://read.rojasreport.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange text-cream px-4 py-1.5 font-body text-sm font-semibold hover:bg-orange-light transition-colors rounded-sm"
          >
            Subscribe
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
            {[...primaryLinks, ...toolsLinks].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/60 hover:text-cream transition-colors font-body text-[15px] py-1"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://read.rojasreport.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange text-cream px-4 py-2 font-body text-sm font-semibold hover:bg-orange-light transition-colors rounded-sm self-start mt-2"
              onClick={() => setOpen(false)}
            >
              Subscribe
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
