import type { Metadata } from 'next';
import Link from 'next/link';
import StatusLabel from '@/components/StatusLabel';
import { NEWSLETTER_URL } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Support the Report',
  description: 'Reader-supported intelligence on why healthcare costs what it does.',
  alternates: { canonical: 'https://rojasreport.com/support/' },
};

export default function Page() {
  return (
    <div className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-20">
      <nav aria-label="Breadcrumb" className="font-meta text-[12px] tracking-[0.1em] text-muted mb-7">
        <Link href="/" className="hover:text-oxblood">/Home</Link> <span className="text-ink">/Support</span>
      </nav>
      <p className="font-meta text-[12px] uppercase tracking-[0.14em] mb-3 text-green">Support the Report</p>
      <h1 className="font-display text-[44px] md:text-[56px] leading-[1.05] mb-5">Keep the record open.</h1>
      <p className="italic text-[22px] leading-[1.4] text-body max-w-[720px] mb-6">
        Reader-supported intelligence on why healthcare costs what it does. Your support funds the data, the filings and the reporting that keeps every dossier free to read.
      </p>
      <p className="mb-10"><StatusLabel status="pending" note="Reader, Patron and Founder tiers open soon" /></p>
      <p className="text-[18px] leading-[1.5] text-body max-w-[720px]">
        Until then, <a href={NEWSLETTER_URL} className="border-b border-hairline hover:text-oxblood">read the newsletter</a>.
        The Rojas Report is published by Rojas Media; support is not a charitable donation and is not tax-deductible.
      </p>
    </div>
  );
}
