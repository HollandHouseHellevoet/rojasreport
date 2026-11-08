import type { Metadata } from 'next';
import Link from 'next/link';
import { MethodPage, Section, Defs, Band, prose, small, th, td } from '@/components/methodology/Method';

/** /methodology: how every figure on the site is built, and the three methods that produce our own numbers. */

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'How every figure on The Rojas Report is sourced and labeled. How the subsidy ledger, the state grade and the Machine Score are calculated.',
  alternates: { canonical: 'https://rojasreport.com/methodology/' },
};

const methods = [
  {
    href: '/methodology/subsidy-ledger/',
    title: 'The Subsidy Ledger',
    text: 'What counts as a subsidy and what counts as a write-off. How each line is read from the filings, and how the Fair Share Test ratio is formed.',
    status: 'In use on health system profiles and state dossiers',
  },
  {
    href: '/methodology/state-grade/',
    title: 'The State Grade',
    text: 'Six cost drivers, one letter each, weighted into a single grade. The weights, the cutoffs and what makes a grade provisional.',
    status: 'In use on state dossiers',
  },
  {
    href: '/methodology/machine-score/',
    title: 'The Machine Score',
    text: 'A 0 to 100 measure of how independent a member of Congress is from the hospital lobby. Judged only against the lobby’s own written positions.',
    status: 'Draft rules; no scores published yet',
  },
];

const sources = [
  ['IRS Form 990 e-file XML (Schedules B, H, J, F, R; Part X)', 'Charity care, community benefit, bad debt, Medicare shortfall, executive pay, offshore entities, foreign investments, tax-exempt bonds, contributions'],
  ['Audited financial statements (EMMA, system sites)', 'Cash and investments, net assets, debt, operating results'],
  ['CMS hospital cost reports (summary files and HCRIS)', 'DSH, IME, direct GME, Medicare bad debt, cost of charity care, property base, net income by hospital'],
  ['CMS IPPS DSH supplemental file', 'Medicare uncompensated care payments'],
  ['HRSA 340B OPAIS export', 'Registrations, child sites, contract pharmacy arrangements'],
  ['Medicaid DSH audits; state-directed payment and provider tax reports', 'State Medicaid financing lines'],
  ['Lincoln Institute of Land Policy, 50-State Property Tax Comparison Study', 'Property tax exemption estimates'],
  ['FEC and state campaign filings', 'Hospital money'],
  ['Congress.gov, Senate and House roll calls, AHA and FAH letters', 'Machine Score actions'],
  ['State legislatures, statutes and boards of elections', 'State bills, certificate of need law, officials'],
];

export default function MethodologyIndex() {
  return (
    <MethodPage
      title="How the numbers are built."
      lede="Every figure on this site links to a public filing or is calculated from one by a method written down here. Nothing is invented."
      asOf="Methodology version 1, November 2026"
    >
      <Section title="Three labels on every figure">
        <p className={`${prose} max-w-[760px] mb-6`}>
          Each number on the site carries one of three labels. The label, the source and the as-of date travel with the figure wherever it appears.
        </p>
        <Defs
          items={[
            {
              term: 'Reported',
              body: 'The figure appears in a public filing exactly as shown, or is a plain sum of such figures across a system’s filers. The source names the form, the schedule and the line.',
            },
            {
              term: <>Estimated <span className="font-meta text-[13px] uppercase tracking-[0.12em] text-oxblood">est.</span></>,
              body: 'A Rojas Report calculation from reported inputs. The method is on one of the three pages below, and the source line shows the inputs and the arithmetic.',
            },
            {
              term: <>Pending <span className="font-display text-[22px] text-muted">&mdash;</span></>,
              body: 'A line still being built from source filings. It shows as a dash, never as a guess, and it is left out of every total until it is filled.',
            },
          ]}
        />
      </Section>

      <Section title="The three methods">
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {methods.map((m) => (
            <Link key={m.href} href={m.href} className="group border border-ink p-7 flex flex-col gap-3 hover:border-oxblood">
              <h3 className="font-display text-[30px] leading-[1.1] group-hover:text-oxblood">{m.title}</h3>
              <p className={small}>{m.text}</p>
              <p className="mt-auto pt-3 font-meta text-[13px] tracking-[0.06em] text-muted">{m.status}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Band tone="paper-2">
        <h2 className="font-display font-normal leading-[1.1] text-[32px] md:text-[40px] mb-6">Where the data comes from</h2>
        <p className={`${prose} max-w-[760px] mb-4`}>
          All sources are public. Files are refreshed from the agency. A sample of figures is checked by hand against the filing.
        </p>
        <div className="table-scroll max-w-[1000px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={th}>Source</th>
                <th className={th}>What it feeds</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(([s, f]) => (
                <tr key={s}>
                  <td className={`${td} pr-6 w-[45%]`}>{s}</td>
                  <td className={`${td} text-body`}>{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>

      <Section title="Rules that apply everywhere">
        <Defs
          items={[
            { term: 'Fiscal years', body: 'Each figure carries the fiscal year or the as-of date of its filing.' },
            { term: 'Systems', body: 'A health system’s figure is the sum over its hospital filers, counted in the source line. Where the audited consolidated statement is cited instead, the source line says so.' },
            { term: 'Rounding', body: 'Dollar figures on the page are rounded. Ratios display to the cent. The source line carries each figure as filed or as calculated.' },
            { term: 'The 340B program', body: 'Registration, child site and contract pharmacy counts are HRSA’s listed arrangements as exported on the stated date.' },
            { term: 'Corrections', body: 'Corrections are reviewed against the filing and logged publicly. Every figure carries its as-of date.' },
            {
              term: 'Certificate of need',
              body: (
                <>
                  The CON desk uses the Cicero Institute’s 0 to 100 restrictiveness score. Its tiers and reform-momentum rules are on the{' '}
                  <Link href="/con/methodology/" className="text-ink border-b border-hairline hover:text-oxblood">CON classification methodology</Link> page.
                </>
              ),
            },
          ]}
        />
        <p className="mt-10 font-meta text-[13px] leading-[1.7] text-muted max-w-[720px]">
          Questions about a figure or a method:{' '}
          <a href="https://read.rojasreport.com/about" className="text-ink border-b border-hairline hover:text-oxblood">Report a correction</a>
        </p>
      </Section>
    </MethodPage>
  );
}
