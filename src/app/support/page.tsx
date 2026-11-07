import type { Metadata } from 'next';
import Link from 'next/link';
import Tiers from '@/components/support/Tiers';
import { checkoutOpen } from '@/lib/support';
import { NEWSLETTER_URL, ABOUT_URL } from '@/lib/nav';

/** /support: the Support page (docs/BUILD_BRIEF.md sections 4 and 7). Green band, Stripe tiers, never "donate". */

export const metadata: Metadata = {
  title: 'Support the Report',
  description: 'Reader-supported intelligence on why healthcare costs what it does. Support keeps every dossier free to read.',
  alternates: { canonical: 'https://rojasreport.com/support/' },
};

const eyebrow = 'font-meta text-[12px] uppercase tracking-[0.14em]';
const h2 = 'font-display font-normal leading-[1.1]';
const prose = 'text-[19px] leading-[1.55] text-body';
const link = 'text-ink border-b border-hairline hover:text-oxblood hover:border-oxblood';

export default function Page() {
  return (
    <>
      <section className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-14">
        <nav aria-label="Breadcrumb" className="font-meta text-[12px] tracking-[0.1em] text-muted mb-7">
          <Link href="/" className="hover:text-oxblood">/Home</Link> <span className="text-ink">/Support</span>
        </nav>
        <p className={`${eyebrow} text-green mb-3`}>Support the Report</p>
        <h1 className="font-display font-normal text-[48px] md:text-[64px] lg:text-[72px] leading-[1]">Keep the record open.</h1>
        <p className="mt-5 max-w-[720px] italic text-[23px] leading-[1.45] text-body">
          Reader-supported intelligence on why healthcare costs what it does. Your support funds the data, the filings and the reporting that keeps every dossier free to read.
        </p>
      </section>

      <section className="bg-green text-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 py-[72px] md:py-[88px] flex flex-wrap gap-14 items-center">
          <div className="flex-[1_1_380px] min-w-0">
            <h2 className={`${h2} text-[36px] md:text-[44px] mb-5`}>{checkoutOpen ? 'Choose a level.' : 'Four levels.'}</h2>
            <p className="text-[20px] leading-[1.5] text-green-text-2">
              Monthly support at any level, or a one-time amount you set. Every level reads the same site. Every page is free to read.
            </p>
          </div>
          <div className="flex-[1_1_460px] min-w-0">
            <Tiers />
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto px-5 md:px-8 py-20">
        <div className="border-t border-ink pt-5 mb-10 flex flex-wrap justify-between items-baseline gap-3">
          <h2 className={`${h2} text-[34px] md:text-[40px]`}>What support pays for</h2>
          <span className="italic text-[18px] text-muted">Three costs behind every dossier</span>
        </div>
        <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {[
            {
              title: 'The filings',
              body: 'Form 990s, Medicare cost reports, bond disclosures and lobbying registrations, pulled in full and read line by line.',
            },
            {
              title: 'The data',
              body: 'Every figure checked against its filing, labeled reported or estimated, and published with its source and date.',
            },
            {
              title: 'The reporting',
              body: 'Health system profiles, state dossiers and committee scorecards, written to be read by anyone and free to everyone.',
            },
          ].map((c) => (
            <div key={c.title} className="flex flex-col gap-2.5">
              <h3 className="font-display font-normal text-[26px]">{c.title}</h3>
              <p className={prose}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 border-y border-hairline">
        <div className="max-w-content mx-auto px-5 md:px-8 py-16 flex flex-wrap gap-14">
          <div className="flex-[1_1_320px] min-w-0">
            <h2 className={`${h2} text-[30px] md:text-[34px] mb-4`}>What stays free</h2>
            <p className={prose}>
              Every page on this site. Every profile, dossier, scorecard and methodology page.{' '}
              <a href={NEWSLETTER_URL} className={link}>The newsletter</a> is free as well.
            </p>
          </div>
          <div className="flex-[1_1_320px] min-w-0">
            <h2 className={`${h2} text-[30px] md:text-[34px] mb-4`}>Other ways in</h2>
            <ul className={`${prose} flex flex-col gap-3`}>
              <li>
                <Link href="/reports/" className={link}>Reports and datasets</Link>: the data behind each page, for people who work with it.
              </li>
              <li>
                The Builders Table: membership by application, for physician owners, operators, founders and investors.{' '}
                <a href={ABOUT_URL} className={link}>Apply</a>.
              </li>
              <li>
                <a href={ABOUT_URL} className={link}>Request custom data</a> when a page does not carry what you need.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto px-5 md:px-8 py-16">
        <p className={`${prose} max-w-[720px]`}>
          Questions about support, receipts or a subscription go to <a href={ABOUT_URL} className={link}>Rojas Media</a>.
          The Rojas Report is published by Rojas Media; support is not a charitable donation and is not tax-deductible.
        </p>
      </section>
    </>
  );
}
