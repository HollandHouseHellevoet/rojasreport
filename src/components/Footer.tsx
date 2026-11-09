import Link from 'next/link';
import { NAV, NEWSLETTER_URL, YOUTUBE_URL, ABOUT_URL } from '@/lib/nav';

const col = 'flex flex-col gap-2 font-meta text-[15px]';
const head = 'font-meta text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-text-2';
const link = 'text-ink-text-2 hover:text-paper';

export default function Footer() {
  return (
    <footer className="bg-ink text-ink-text print:hidden">
      <div className="max-w-content mx-auto px-5 md:px-8 pt-14 pb-10 flex flex-wrap gap-12 justify-between">
        <div className="flex-[1_1_320px] min-w-0">
          <Link href="/" className="font-display text-[28px] tracking-[0.04em] text-paper inline-block mb-3">
            THE ROJAS REPORT
          </Link>
          <p className="font-meta text-[15px] leading-[1.6] text-ink-text-2">
            Every figure is sourced to public records: IRS Form 990s, Senate lobbying disclosures, FEC filings, CMS, HRSA, court records and state agencies.{' '}
            <Link href="/methodology/" className="text-paper border-b border-muted hover:border-paper">Read the methodology</Link>.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div className={col}>
            <span className={head}>Intelligence</span>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={link}>{n.label}</Link>
            ))}
          </div>
          <div className={col}>
            <span className={head}>The Report</span>
            <a href={NEWSLETTER_URL} className={link}>Newsletter</a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={link}>YouTube</a>
            <Link href="/search/" className={link}>Search</Link>
            <Link href="/reports/" className={link}>Reports &amp; Data</Link>
            <Link href="/support/" className={link}>Support</Link>
            <a href={ABOUT_URL} className={link}>About</a>
          </div>
          <div className={col}>
            <span className={head}>Company</span>
            <a href={ABOUT_URL} className={link}>Contact</a>
            <Link href="/methodology/" className={link}>Methodology</Link>
            <a href={ABOUT_URL} className={link}>Corrections</a>
            <Link href="/privacy/" className={link}>Privacy</Link>
          </div>
        </div>
      </div>
      <div className="max-w-content mx-auto px-5 md:px-8 pb-8 font-meta text-[13px] text-ink-label">
        &copy; 2026 Rojas Media
      </div>
    </footer>
  );
}
