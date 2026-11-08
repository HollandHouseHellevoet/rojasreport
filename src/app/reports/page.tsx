import type { Metadata } from 'next';
import Link from 'next/link';
import StatusLabel from '@/components/StatusLabel';

export const metadata: Metadata = {
  title: 'Reports & Data',
  description: 'Read it, download it, own the data: reports and datasets behind every Rojas Report page.',
  alternates: { canonical: 'https://rojasreport.com/reports/' },
};

export default function Page() {
  return (
    <div className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-20">
      <nav aria-label="Breadcrumb" className="font-meta text-[13px] tracking-[0.1em] text-muted mb-7">
        <Link href="/" className="hover:text-oxblood">/Home</Link> <span className="text-ink">/Reports &amp; Data</span>
      </nav>
      <p className="font-meta text-[13px] uppercase tracking-[0.14em] mb-3 text-green">Get the intelligence</p>
      <h1 className="font-display text-[44px] md:text-[56px] leading-[1.05] mb-5">Read it. Download it. Own the data.</h1>
      <p className="italic text-[22px] leading-[1.4] text-body max-w-[720px] mb-10">
        Every page on this site can be read free, downloaded as a PDF, and bought as the dataset behind it.
      </p>
      <div className="border-t border-ink">
        {[
          { name: 'Physician-owned hospitals', blurb: 'Every physician-owned hospital in the country, with ownership, contacts and state context. $300 per state, or $3,500 a year for all access.' },
          { name: 'Health system datasets', blurb: 'The subsidy ledger and key figures behind each profile.' },
          { name: 'State datasets', blurb: 'Every figure on a state dossier, with its source.' },
          { name: 'Committee member datasets', blurb: 'Positions, scored actions and hospital money for every member.' },
        ].map((p) => (
          <div key={p.name} className="py-5 border-b border-hairline">
            <p className="font-display text-[24px] md:text-[26px] leading-tight text-muted">{p.name}</p>
            <p className="mt-1 text-[18px] leading-[1.45] text-muted">{p.blurb}</p>
            <p className="mt-2"><StatusLabel status="pending" note="In preparation" /></p>
          </div>
        ))}
      </div>
    </div>
  );
}
