import Link from 'next/link';
import { MARK, ORG } from '@/lib/site';

/** The Alliance wordmark: the boxed mark and the two-line name. Swap this file for the final logo. */
export default function Wordmark({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center gap-3 font-tight ${dark ? 'text-paper' : 'text-ink'}`}>
      <span
        className={`inline-flex items-center justify-center h-9 px-2.5 font-extrabold text-[13px] tracking-[0.06em] leading-none ${
          dark ? 'bg-paper text-ink' : 'bg-ink text-paper'
        }`}
      >
        {MARK}
      </span>
      <span className="sr-only">{ORG}, home</span>
      {!compact && (
        <span aria-hidden="true" className="hidden sm:flex lg:hidden xl:flex flex-col whitespace-nowrap leading-[1.05] font-bold text-[12px] tracking-[0.1em] uppercase">
          <span>The Alliance for</span>
          <span>Healthcare Competition</span>
        </span>
      )}
    </Link>
  );
}
