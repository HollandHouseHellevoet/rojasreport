'use client';

import { usePathname } from 'next/navigation';
import { ORG } from '@/lib/site';

/** Shown only when a page is printed or saved as a PDF: the masthead line and the page's address. */
export default function PrintHeader() {
  const pathname = usePathname() || '/';
  return (
    <div className="print-header hidden print:flex justify-between items-baseline gap-6 border-b border-ink pb-2 mb-6 font-meta text-[10pt]">
      <span className="font-tight font-extrabold text-[12pt] tracking-[0.04em] uppercase">{ORG}</span>
      <span>tafhc.org{pathname === '/' ? '' : pathname}</span>
    </div>
  );
}
