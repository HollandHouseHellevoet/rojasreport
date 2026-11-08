import type { Metadata } from 'next';
import Link from 'next/link';
import { MethodPage, Section, Formula, Defs, Band, Pending, Est, prose, small, th, td } from '@/components/methodology/Method';

/** /methodology/subsidy-ledger: the ledger rule, the Fair Share Test and every "est." method used on system profiles and state dossiers. */

export const metadata: Metadata = {
  title: 'The Subsidy Ledger | Methodology',
  description: 'How The Rojas Report builds the subsidy ledger for a hospital system. Which lines count, where each comes from, and how every estimate is calculated.',
  alternates: { canonical: 'https://rojasreport.com/methodology/subsidy-ledger/' },
};

type Line = { name: string; payer: string; from: string; basis: 'Reported' | 'Estimated' | 'Pending method' };

const groups: { name: string; lines: Line[] }[] = [
  {
    name: 'Federal programs',
    lines: [
      { name: 'The 340B program: drug discount spread', payer: 'Drug manufacturers', from: 'HRSA 340B OPAIS export: registrations, child sites and contract pharmacy arrangements on the export date; spread pending a method decision', basis: 'Pending method' },
      { name: 'Graduate medical education: direct', payer: 'Medicare', from: 'CMS Medicare cost report, Worksheet E-4', basis: 'Reported' },
      { name: 'Graduate medical education: indirect (IME)', payer: 'Medicare', from: 'CMS hospital cost report summary file, Total IME Payment, latest report per hospital', basis: 'Reported' },
      { name: 'Medicare DSH adjustment', payer: 'Medicare', from: 'CMS hospital cost report summary file, Disproportionate Share Adjustment, latest report per hospital', basis: 'Reported' },
      { name: 'Medicare uncompensated care payments', payer: 'Medicare', from: 'CMS IPPS Medicare DSH supplemental data file, FY2027 (correction notice), Total Uncompensated Care Payment by hospital', basis: 'Reported' },
      { name: 'Medicaid DSH', payer: 'Federal and state Medicaid', from: 'State Medicaid DSH audit reports (medicaid.gov)', basis: 'Reported' },
      { name: 'Medicare bad debt reimbursement', payer: 'Medicare', from: 'CMS Medicare cost report, Worksheet E Part A, reimbursable bad debts', basis: 'Reported' },
    ],
  },
  {
    name: 'Tax exemptions',
    lines: [
      { name: 'Federal income tax exemption', payer: 'U.S. taxpayers', from: 'Audited statements or CMS cost reports; method below', basis: 'Estimated' },
      { name: 'Tax-exempt bond financing: interest savings', payer: 'U.S. and state taxpayers', from: 'Form 990 Part X Line 20, tax-exempt bond liabilities; MSRB EMMA for the yield spread', basis: 'Pending method' },
      { name: 'Property tax exemption', payer: 'County and school district', from: 'CMS cost reports for the property base; Lincoln Institute study for the rate; method below', basis: 'Estimated' },
      { name: 'State income tax exemption', payer: 'State taxpayers', from: 'Same base as the federal line, at the state rate; method below', basis: 'Estimated' },
      { name: 'Charitable contribution deduction', payer: 'U.S. taxpayers', from: 'Form 990 Schedule B contribution totals', basis: 'Pending method' },
    ],
  },
  {
    name: 'State Medicaid financing',
    lines: [
      { name: 'Medicaid supplemental and state-directed payments', payer: 'Federal and state Medicaid', from: 'CMS state-directed payment approvals; state supplemental payment (UPL) reports', basis: 'Reported' },
      { name: 'Provider tax: net gain after tax paid', payer: 'Federal Medicaid match', from: 'State hospital provider tax program reports', basis: 'Pending method' },
    ],
  },
  {
    name: 'The community benefit write-off',
    lines: [
      { name: 'Charity care, as claimed', payer: 'Patients and taxpayers', from: 'Form 990 Schedule H Part I Line 7a column (e), financial assistance at cost, net', basis: 'Reported' },
      { name: 'Medicaid shortfall claimed as community benefit', payer: 'Taxpayers', from: 'Schedule H Part I Lines 7b and 7c column (e)', basis: 'Reported' },
      { name: 'Medicare shortfall touted as community benefit', payer: 'Taxpayers', from: 'Schedule H Part III Line 7, Medicare surplus or shortfall', basis: 'Reported' },
      { name: 'Bad debt written off', payer: 'Patients and payers', from: 'Schedule H Part III Line 2, bad debt expense', basis: 'Reported' },
      { name: 'Events, education, research, sponsorships and contributions', payer: 'Taxpayers', from: 'Schedule H Part I Line 7k column (e), total community benefit, less Lines 7a to 7c', basis: 'Reported' },
    ],
  },
];

function basisTag(b: Line['basis']) {
  if (b === 'Estimated') return <Est />;
  if (b === 'Pending method') return <Pending>Pending method</Pending>;
  return <span className="font-meta text-[13px] uppercase tracking-[0.12em] text-muted">Reported</span>;
}

export default function SubsidyLedgerMethod() {
  return (
    <MethodPage
      crumb="The Subsidy Ledger"
      title="The Subsidy Ledger"
      lede="Every dollar a tax-exempt hospital system takes from taxpayers, drug makers and patients, set against the free care a patient actually received."
      asOf="Methodology version 1, November 2026. In use on health system profiles and state dossiers."
    >
      <Section title="The rule">
        <Formula>
          Charity care, Medicaid and Medicare shortfalls, bad debt and other community benefit claims are write-offs on the subsidy side, not offsets.
        </Formula>
        <div className={`${prose} max-w-[760px] space-y-5`}>
          <p>
            Hospital systems present community benefit as money given away. Each claimed shortfall is a line the hospital itself reports on Schedule H.
          </p>
          <p>
            So the ledger counts those claims where they belong: as benefits the system writes off against the public. The only line kept apart is free care actually delivered to a patient, at cost.
          </p>
          <p>
            That line is Schedule H Part I Line 7a, column (e): financial assistance at cost, net of any offsetting revenue. Where the system&rsquo;s Medicare cost reports put the figure higher, the Worksheet S-10 cost of charity care appears in the note.
          </p>
        </div>
      </Section>

      <Band tone="oxblood">
        <h2 className="font-display font-normal leading-[1.1] text-[32px] md:text-[40px] text-paper mb-6">The Fair Share Test</h2>
        <p className="font-display text-[26px] md:text-[32px] leading-[1.3] text-paper max-w-[900px]">
          Ratio = the filled ledger lines, added up, divided by free care actually delivered.
        </p>
        <div className="mt-8 grid gap-8 text-oxblood-text text-[18px] leading-[1.5]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <p className="border-t border-oxblood-rule pt-4">The result reads &ldquo;$X in subsidies and write-offs for every $1 of free care a patient actually received.&rdquo;</p>
          <p className="border-t border-oxblood-rule pt-4">Only filled lines count. The ratio is marked &ldquo;at least&rdquo; with the number of lines filled, because every open line can only raise it.</p>
          <p className="border-t border-oxblood-rule pt-4">The note gives a second ratio using the Worksheet S-10 cost of charity care from the Medicare cost reports.</p>
        </div>
      </Band>

      <Section title="The lines" aside="Four groups, nineteen lines">
        <p className={`${prose} max-w-[760px] mb-2`}>
          Each profile carries the same ledger. A line stays a dash until its source file is read for that system. Nothing is prorated or imputed to fill a gap.
        </p>
        {groups.map((g) => (
          <div key={g.name} className="table-scroll max-w-[1100px] mt-8">
            <h3 className="font-display italic text-[24px] text-oxblood mb-1">{g.name}</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={`${th} w-[30%]`}>Line</th>
                  <th className={`${th} w-[18%]`}>Who pays</th>
                  <th className={th}>Where it comes from</th>
                  <th className={`${th} w-[12%]`}>Basis</th>
                </tr>
              </thead>
              <tbody>
                {g.lines.map((l) => (
                  <tr key={l.name}>
                    <td className={`${td} pr-5`}>{l.name}</td>
                    <td className={`${td} italic text-muted pr-5`}>{l.payer}</td>
                    <td className={`${td} text-body pr-5`}>{l.from}</td>
                    <td className={td}>{basisTag(l.basis)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Section>

      <Section title="How each estimate is made" aside="Every est. figure on the site">
        <p className={`${prose} max-w-[760px] mb-6`}>
          An estimate uses reported inputs and a stated rate. The source line on the page repeats the inputs and the arithmetic, so any reader can redo it.
        </p>
        <Defs
          items={[
            {
              term: <>Federal income tax exemption <Est /></>,
              body: (
                <>
                  <p>Base times the 21 percent federal corporate rate.</p>
                  <p className="mt-3">On a health system profile, the base is the excess of revenues over expenses attributable to the system in its audited statements. One-time gains, such as a gain on early extinguishment of debt, are taken out.</p>
                  <p className="mt-3">On a state dossier, the base is net income from the CMS cost report, summed over the state&rsquo;s hospitals with positive net income. Losses are not netted against profits.</p>
                </>
              ),
            },
            {
              term: <>State income tax exemption <Est /></>,
              body: (
                <>
                  <p>The same base at the state&rsquo;s corporate income tax rate for the tax year, cited to its source. Sales and use tax exemptions are not estimated.</p>
                  <p className="mt-3">On a system profile the headquarters state&rsquo;s rate is applied to the whole base, without apportionment to other states. The line says so.</p>
                </>
              ),
            },
            {
              term: <>Property tax exemption <Est /></>,
              body: (
                <>
                  <p>Land, land improvements and buildings at gross historical cost, from each hospital&rsquo;s latest CMS cost report, times a commercial property tax rate.</p>
                  <p className="mt-3">The rate is from the Lincoln Institute of Land Policy and Minnesota Center for Fiscal Excellence 50-State Property Tax Comparison Study, stated by edition.</p>
                  <p className="mt-3">A system profile uses each state&rsquo;s published rural commercial rate and shows a low and a high case; the ledger line carries the low case. A state dossier uses the state&rsquo;s commercial effective rate, high case.</p>
                </>
              ),
            },
            {
              term: <>Estimated tax breaks on a state dossier <Est /></>,
              body: 'The federal income tax, state income tax and property tax (high case) lines above, added up for the state’s 340B hospitals. The total is shown against charity care at cost from the same cost reports.',
            },
            {
              term: <>Years of free care <Est /></>,
              body: 'Cash and investments from the audited balance sheet, divided by one year of free care at cost. Free care is Schedule H Line 7a, summed over the hospital filers. The result is rounded to the nearest year.',
            },
            {
              term: <>Margin on a state dossier <Est /></>,
              body: 'A system’s net income divided by its net patient revenue plus other income, from the cost reports of its hospitals in the state.',
            },
          ]}
        />
      </Section>

      <Section title="Methods still being set" aside="Shown as a dash until decided">
        <Defs
          items={[
            { term: <>The 340B program spread <Pending>Pending method</Pending></>, body: 'The gap between the discounted purchase price and the reimbursed price on drugs bought through the 340B program. The spread is pending a method decision.' },
            { term: <>Bond interest savings <Pending>Pending method</Pending></>, body: 'Tax-exempt bond balances come from Form 990 Part X Line 20. The savings line needs a sourced spread between taxable and tax-exempt yields for the system’s own issues on MSRB EMMA.' },
            { term: <>Charitable deduction <Pending>Pending method</Pending></>, body: 'Schedule B gives the contributions received. The deduction’s cost to the Treasury needs an assumed donor tax rate, which is not yet set.' },
            { term: <>Provider tax net gain <Pending>Pending method</Pending></>, body: 'The federal match a state’s hospitals draw through a provider tax, less the tax they pay. It needs each state program’s report, starting with California’s Hospital Quality Assurance Fee.' },
          ]}
        />
      </Section>

      <Section title="Where the money sits" aside="The green band on every profile">
        <Defs
          items={[
            { term: 'Cash and investments', body: 'Cash and cash equivalents, short-term investments and long-term investments from the audited consolidated balance sheet, added up.' },
            { term: 'Held in offshore insurance companies', body: 'Form 990 Schedule R, for each captive or self-insurance entity organized outside the United States. Part I gives end-of-year assets and Part IV gives the share of end-of-year assets. Labeled with the country, exactly as filed.' },
            { term: 'Sent abroad for investments', body: 'Form 990 Schedule F Part I, activity type Investments, summed over the regions and the filers for the year.' },
            { term: <>Years of free care <Est /></>, body: 'The estimate described above.' },
          ]}
        />
        <p className="mt-10 font-meta text-[13px] leading-[1.7] text-muted max-w-[720px]">
          Worked on <Link href="/systems/commonspirit/" className="text-ink border-b border-hairline hover:text-oxblood">CommonSpirit Health</Link> and{' '}
          <Link href="/states/north-carolina/" className="text-ink border-b border-hairline hover:text-oxblood">North Carolina</Link>.{' '}
          <Link href="/methodology/" className="text-ink border-b border-hairline hover:text-oxblood">All methods</Link> ·{' '}
          <a href="https://read.rojasreport.com/about" className="text-ink border-b border-hairline hover:text-oxblood">Report a correction</a>
        </p>
      </Section>
    </MethodPage>
  );
}
