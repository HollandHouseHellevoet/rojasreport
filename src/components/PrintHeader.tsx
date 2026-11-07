'use client';

import { usePathname } from 'next/navigation';

/** Shown only when a page is printed or saved as a PDF: the masthead line and the page's address. */
export default function PrintHeader() {
  const pathname = usePathname() || '/';
  return (
    <div className="print-header hidden print:flex justify-between items-baseline gap-6 border-b border-ink pb-2 mb-6 font-meta text-[10pt]">
      <span className="font-display text-[14pt] tracking-[0.04em]">THE ROJAS REPORT</span>
      <span>rojasreport.com{pathname === '/' ? '' : pathname}</span>
    </div>
  );
}
