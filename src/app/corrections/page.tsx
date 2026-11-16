import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Breadcrumb, eyebrow, fmtDate, lede } from '@/components/alliance/ui';
import JsonLd from '@/components/alliance/JsonLd';
import { CONTACT } from '@/lib/site';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'Corrections',
  description: 'How to report an error on tafhc.org, how it is reviewed, and the public log of corrections made.',
  path: '/corrections/',
});

// The public log, newest first. A correction is logged within five business days of a sourced report (MERGER_PLAN.md, section 5.4).
const log: { date: string; page: string; href: string; was: string; now: string; source: string }[] = [];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Corrections', path: '/corrections/' }])} />
      <Band>
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <Breadcrumb trail={[{ name: 'Corrections', href: '/corrections/' }]} />
            <p className={eyebrow}>Corrections</p>
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[56px]">Report an error.</h1>
            <p className={lede}>
              Corrections are reviewed against the filing and logged here. Every figure on this site carries its as-of date. To report an error, write to{' '}
              <a href={`mailto:${CONTACT.corrections}`} className="underline underline-offset-[3px]">{CONTACT.corrections}</a> with the page, the figure and the filing you are reading from.
            </p>
            <ul className="list-disc pl-5 grid gap-2.5 text-[16px] leading-[1.5]">
              <li>A sourced report is answered within five business days. A correction is made on the page and logged below with the date, what the page said and what it says now.</li>
              <li>Anyone named on this site may ask for a correction. The dossiers are built from public filings, votes, rosters and disclosures; a figure stands or falls on its source.</li>
              <li>The <Link href="/methodology/" className="underline underline-offset-[3px]">methodology page</Link> says how each figure is labeled and checked before it is published.</li>
            </ul>
          </div>
        </div>
      </Band>
      <Band mist tight label="Corrections log">
        <h2 className="font-tight font-bold text-[28px] tracking-[-0.02em] mb-6">Corrections log</h2>
        {log.length === 0 && <p className="text-[16px]">No correction has been logged since the site moved to tafhc.org.</p>}
        {log.length > 0 && (
          <div className="table-scroll">
            <table className="w-full min-w-[640px] border-collapse border-t-2 border-ink text-[15px]">
              <thead><tr>{['Date', 'Page', 'Was', 'Now', 'Source'].map((h) => <th key={h} className="font-tight text-[12px] font-semibold uppercase tracking-[0.12em] text-left py-3 pr-5 border-b border-ink">{h}</th>)}</tr></thead>
              <tbody>
                {log.map((c) => (
                  <tr key={`${c.date}-${c.href}`}>
                    <td className="py-4 pr-5 border-b border-hairline whitespace-nowrap">{fmtDate(c.date)}</td>
                    <td className="py-4 pr-5 border-b border-hairline"><Link href={c.href} className="underline">{c.page}</Link></td>
                    <td className="py-4 pr-5 border-b border-hairline">{c.was}</td>
                    <td className="py-4 pr-5 border-b border-hairline">{c.now}</td>
                    <td className="py-4 border-b border-hairline">{c.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Band>
    </>
  );
}
