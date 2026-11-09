import Link from 'next/link';
import { NAV, NEWSLETTER_URL, YOUTUBE_URL, ABOUT_URL } from '@/lib/nav';

const col = 'flex flex-col gap-2 font-meta text-[15px]';
const head = 'font-tight text-[13px] font-bold uppercase tracking-[0.12em] text-ink-text';
const link = 'text-ink-text-2 hover:text-paper';

export default function Footer() {
  return (
    <footer className="bg-ink text-ink-text print:hidden">
      <div className="max-w-content mx-auto px-5 md:px-8 pt-[72px] pb-12 flex flex-wrap gap-12 justify-between">
        <div className="flex-[1_1_320px] min-w-0">
          <Link href="/" aria-label="The Rojas Report home" className="inline-block mb-5 bg-paper text-ink font-tight font-extrabold text-[14px] tracking-[0.02em] leading-none px-3 py-2.5">
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
      <div className="max-w-content mx-auto px-5 md:px-8 pb-8"><div className="border-t border-[#3A3833] pt-6 font-meta text-[14px] text-ink-text">
        &copy; 2026 Rojas Media
      </div></div>
    </footer>
  );
}
