import type { Metadata } from 'next';
import Link from 'next/link';
import fights from '@/data/home/fights.json';
import FightsTable from '@/components/home/FightsTable';

export const metadata: Metadata = {
  title: 'The Tracker: where the fights stand',
  description: 'Every rule the hospital lobby is fighting, where it stands, and who is winning. Updated as rules land.',
  alternates: { canonical: 'https://rojasreport.com/tracker/' },
};

/** The full fights tracker. The home page shows the first five rows of the same file. */
export default function TrackerPage() {
  return (
    <div className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-20">
      <nav aria-label="Breadcrumb" className="font-meta text-[13px] tracking-[0.1em] text-muted mb-7">
        <Link href="/" className="hover:text-oxblood">/Home</Link> <span className="text-ink">/The Tracker</span>
      </nav>
      <p className="font-meta text-[13px] uppercase tracking-[0.14em] mb-3 text-oxblood">The Tracker · As of {fights.asOf}</p>
      <h1 className="font-display text-[44px] md:text-[56px] leading-[1.05] mb-5">Where the fights stand</h1>
      <p className="text-[20px] leading-[1.4] text-body max-w-[720px] mb-10">
        Every rule the hospital lobby is fighting, where it stands, and who is winning. Updated as rules land.
      </p>
      <FightsTable rows={fights.rows} />
      <p className="mt-8 font-meta text-[13px] leading-[1.7] text-muted max-w-[720px]">
        Status is the state of the rule on the date shown. Who is winning follows the rule, not the press release: a rule in effect against the lobby&apos;s position counts for reform.
      </p>
    </div>
  );
}
