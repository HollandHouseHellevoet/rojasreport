import { Compare } from '@/components/alliance/ui';
import type { InsightMeta } from '@/lib/insights';

const HRSA25 = 'https://www.hrsa.gov/opa/updates/2025-340b-covered-entity-purchases';

export const meta: InsightMeta = {
  slug: '340b-purchases-by-hospital-type',
  title: '340B purchases by hospital type',
  date: '2026-11-09',
  issue: '340B',
  format: 'Data',
  summary: 'Covered entities bought $100.0 billion in drugs through the 340B program in 2025. Disproportionate share hospitals bought $79.2 billion of it. This brief lays out the series, the split by hospital type, and what the program does not track.',
  readTime: 6,
  pdf: '/downloads/340b-purchases-by-hospital-type.pdf',
  takeaways: [
    '340B purchases reached $100.0 billion in 2025, from $6.6 billion in 2010 and $16.2 billion in 2016.',
    'Disproportionate share hospitals bought $79.2 billion of the 2025 total. The three rural hospital categories together bought $3.58 billion in 2024, under 5 percent of that year’s total.',
    'Neither the statute nor the agency requires that any of it reach a patient. Fifteen of GAO’s 20 recommendations since 2011 remain open.',
  ],
  numbers: [
    { value: '$100.0B', label: '340B drug purchases by covered entities in 2025, from $6.6 billion in 2010', source: 'HRSA covered-entity purchase data, 2025; CBO, 2025', url: HRSA25 },
    { value: '$79.2B', label: 'Of the 2025 total bought by disproportionate share hospitals, one covered-entity category', source: 'HRSA covered-entity purchase data, 2025', url: HRSA25 },
    { value: '3.08x', label: 'Median markup to private insurers on 340B drugs, against acquisition cost', source: 'Robinson et al., New England Journal of Medicine, 2024', url: 'https://doi.org/10.1056/NEJMsa2306609' },
  ],
  sources: [
    { label: 'Health Resources and Services Administration, Office of Pharmacy Affairs, 340B covered-entity purchases, calendar year 2025: $100.0 billion in total; $79.2 billion at disproportionate share hospitals; 87 percent at hospitals of all categories.', url: HRSA25 },
    { label: 'Health Resources and Services Administration, 340B covered-entity purchases, calendar year 2024: $81.4 billion in total; disproportionate share hospitals $64.1 billion; rural referral centers $1,843,455,444; critical access hospitals $1,185,097,145; sole community hospitals $549,703,626. Shares in the table are computed from these totals.', url: 'https://www.hrsa.gov/opa/updates/2024-340b-covered-entity-purchases' },
    { label: 'Congressional Budget Office, Growth in the 340B Drug Pricing Program, September 9, 2025 (publication 60661): purchases $6.6 billion in 2010 and $43.9 billion in 2021, $38.2 billion of it at hospitals; cancer drugs 41 percent of 2021 purchases, 99 percent of them at hospitals; contract pharmacy arrangements from about 2,000 in 2010 to nearly 130,000 in 2021; about two-thirds of growth from structural factors.', url: 'https://www.cbo.gov/publication/60661' },
    { label: 'U.S. Government Accountability Office, GAO-26-108784, testimony before the Senate Committee on Health, Education, Labor, and Pensions, October 23, 2025: about 14,000 covered entities and more than 55,000 sites in 2023, up from about 20,000 sites in 2013; the program does not require that the discounts reach patients; 15 of 20 recommendations since 2011 remain open.', url: 'https://www.gao.gov/products/gao-26-108784' },
    { label: '42 U.S.C. § 256b (section 340B of the Public Health Service Act). The statute sets no limit on what a covered entity charges a commercial payer or a patient, and does not address how the revenue is used.', url: 'https://www.law.cornell.edu/uscode/text/42/256b' },
    { label: 'Wang Y., Perkins J., Whaley C. M., Bai G., Sharp Rise in Urban Hospitals With Rural Status in Medicare, 2017 to 23, Health Affairs, August 2025, doi:10.1377/hlthaff.2025.00019: 3 hospitals in 2017, 425 in 2023; the rural status lowers the 340B eligibility threshold to 8 percent from 11.75 percent.', url: 'https://doi.org/10.1377/hlthaff.2025.00019' },
    { label: 'Robinson S. W., Whaley C. M., Dhruva S. S., Hospital Prices for Physician-Administered Drugs for Patients with Private Insurance, New England Journal of Medicine 390:338 to 345 (Jan. 25, 2024): median markup to private insurers on 340B drugs of 3.08 times acquisition cost; top quartile above 6.38 times; 340B-eligible hospitals retained 64.3 percent of insurer drug spending.', url: 'https://doi.org/10.1056/NEJMsa2306609' },
    { label: 'Centers for Medicare & Medicaid Services, CY 2027 Hospital Outpatient Prospective Payment System final rule, CMS-1850-FC, 91 Fed. Reg. 70284, 70534, 70550, 70552, 70740 (Nov. 6, 2026): 340B-acquired drugs paid at average sales price minus 28 percent from January 1, 2027; CMS press release, Nov. 4, 2026: $4.35 billion for taxpayers and $1.1 billion for people with Original Medicare, $5.45 billion in 2027.', url: 'https://www.federalregister.gov/documents/2026/11/06/2026-22739' },
    { label: 'Health Resources and Services Administration, Office of Pharmacy Affairs, program integrity audit results, fiscal year 2024: 172 audits finalized, 64 percent with adverse findings, about 24 percent requiring repayment. Audit volume and the $12.2 million fiscal year 2024 appropriation from CBO, 2025.', url: 'https://www.hrsa.gov/opa/program-integrity/fy-24-audit-results' },
    { label: 'H.R. 9504, Tax-Exempt Hospital Transparency Act, 119th Congress, introduced June 29, 2026; ordered reported by the Committee on Ways and Means, July 1, 2026, by a vote of 25 to 15.', url: 'https://www.congress.gov/bill/119th-congress/house-bill/9504' },
    { label: 'Minnesota Department of Health, 340B covered-entity data for 2024, released February 27, 2026: payments $3.04 billion, acquisition cost $1.53 billion, net $1.34 billion, 44 cents per dollar, hospitals over 80 percent. State reporting laws: Washington, Minnesota and Maine (2023); Colorado, Idaho, Indiana, Ohio, Rhode Island and Vermont (2025); Hawaii for health centers only.', url: 'https://www.health.state.mn.us/data/340b' },
    { label: 'Health Resources and Services Administration, Office of Pharmacy Affairs, 340B covered-entity purchases, calendar years 2016 ($16.2 billion) and 2023 ($66.3 billion).' },
  ],
};

const S = ({ n }: { n: number }) => <sup><a href={`#src-${n}`}>{n}</a></sup>;

export function Body() {
  return (
    <>
      <h2>The series</h2>
      <p><strong>These are purchases at 340B prices, the amount covered entities paid for the drugs.</strong> They are not the list price and they are not the margin.</p>
      <table>
        <thead><tr><th>Year</th><th className="r">340B purchases</th><th>Reported by</th></tr></thead>
        <tbody>
          <tr><td>2010</td><td className="r">$6.6 billion</td><td>CBO<S n={3} /></td></tr>
          <tr><td>2016</td><td className="r">$16.2 billion</td><td>HRSA<S n={12} /></td></tr>
          <tr><td>2021</td><td className="r">$43.9 billion</td><td>CBO<S n={3} /></td></tr>
          <tr><td>2023</td><td className="r">$66.3 billion</td><td>HRSA<S n={12} /></td></tr>
          <tr><td>2024</td><td className="r">$81.4 billion</td><td>HRSA<S n={2} /></td></tr>
          <tr><td>2025</td><td className="r">$100.0 billion</td><td>HRSA<S n={1} /></td></tr>
        </tbody>
      </table>
      <p>Congress voted on one step of that curve, the 2010 addition of rural hospital categories. CBO attributes about two-thirds of the growth to structural factors, clinic acquisitions, eligibility expansion and contract pharmacies, rather than to drug prices.<S n={3} /></p>

      <h2>By hospital type</h2>
      <p><strong>Hospitals of every category together bought 87 percent of the 2025 total.</strong> Disproportionate share hospitals bought $79.2 billion of the $100.0 billion on their own.<S n={1} /> HRSA’s 2024 data separate the smaller hospital categories.</p>
      <table>
        <thead><tr><th>Covered entity type</th><th className="r">2024 purchases</th><th className="r">Share</th></tr></thead>
        <tbody>
          <tr><td>Disproportionate share hospitals</td><td className="r">$64.1 billion</td><td className="r">78.7 percent</td></tr>
          <tr><td>Rural referral centers</td><td className="r">$1.84 billion</td><td className="r">2.3 percent</td></tr>
          <tr><td>Critical access hospitals</td><td className="r">$1.19 billion</td><td className="r">1.5 percent</td></tr>
          <tr><td>Sole community hospitals</td><td className="r">$0.55 billion</td><td className="r">0.7 percent</td></tr>
          <tr><td>All other covered entities, including children’s and cancer hospitals, health centers and clinics (computed)</td><td className="r">$13.7 billion</td><td className="r">16.9 percent</td></tr>
          <tr><td>Total</td><td className="r">$81.4 billion</td><td className="r">100 percent</td></tr>
        </tbody>
      </table>
      <p>Shares and the all-other row are computed from HRSA’s totals and rounded.<S n={2} /> The three rural hospital categories were added to the program by the Affordable Care Act in 2010. Together they bought $3.58 billion in 2024, under 5 percent of the year. By dollars, the 340B program is a program of disproportionate share hospitals.</p>

      <h2>What is bought, and where</h2>
      <p><strong>The growth has a shape: cancer drugs, acquired clinics and retail pharmacies.</strong></p>
      <ul>
        <li>Cancer drugs were 41 percent of 2021 purchases, $18.1 billion, and 99 percent of that was bought by hospitals.<S n={3} /></li>
        <li>About 14,000 covered entities operated more than 55,000 sites in 2023, up from about 20,000 sites in 2013.<S n={4} /></li>
        <li>Contract pharmacy arrangements grew from about 2,000 in 2010 to nearly 130,000 in 2021 after the agency’s 2010 guidance.<S n={3} /></li>
        <li>Hospitals holding both urban and rural status in Medicare rose from 3 in 2017 to 425 in 2023. The rural status lowers the disproportionate share threshold for the 340B program to 8 percent from 11.75 percent. No vote was involved.<S n={6} /></li>
      </ul>

      <h2>What the money does</h2>
      <p><strong>Nothing in the law ties the purchase to the patient.</strong> The statute sets no limit on what a covered entity charges a commercial payer or a patient.<S n={5} /></p>
      <blockquote>
        <p>The program does not “require that these drug discounts be passed on to patients.”</p>
        <cite>Government Accountability Office, testimony to the Senate, October 2025<S n={4} /></cite>
      </blockquote>
      <p>The fullest public accounting is one state’s. Minnesota, one of nine states with a hospital reporting law, published its covered entities’ 2024 figures.<S n={11} /></p>
      <Compare
        a={{ value: '$1.53B', label: 'What Minnesota covered entities paid for 340B drugs, 2024' }}
        b={{ value: '$3.04B', label: 'What they were paid for the same drugs' }}
        caption="After operating costs, the net was $1.34 billion, 44 cents of every dollar, more than 80 percent of it at hospitals."
        source="Minnesota Department of Health, 340B covered-entity data for 2024, February 2026"
        url="https://www.health.state.mn.us/data/340b"
      />
      <p>The national price data point the same way. For physician-administered drugs billed to private insurers, the median markup at 340B hospitals was 3.08 times acquisition cost, and the top quartile exceeded 6.38 times. The hospitals retained 64.3 percent of insurer drug spending.<S n={7} /></p>
      <p>Medicare is the one payer that has acted. From January 1, 2027, Medicare pays 340B hospitals for the drugs at average sales price minus 28 percent. CMS puts the 2027 effect at $4.35 billion for taxpayers and $1.1 billion for people with Original Medicare.<S n={8} /> That is the only mechanism in law that puts the 340B price on a patient’s bill, and it cannot reach a commercial patient.</p>

      <h2>What is not tracked</h2>
      <p><strong>No federal report states how any hospital uses its 340B revenue, because no law requires one.</strong> HRSA finalized 172 audits in fiscal 2024 on a $12.2 million appropriation, and 64 percent of them had adverse findings.<S n={9} /> Fifteen of GAO’s 20 recommendations since 2011 remain open.<S n={4} /></p>
      <p>The first federal disclosure requirement cleared a committee in July 2026. H.R. 9504, the Tax-Exempt Hospital Transparency Act, covers tax-exempt hospitals with net patient revenue above $100 million. They would report their 340B patients by insurance type and their aggregate net 340B payment. Ways and Means ordered it reported on July 1, 2026, 25 to 15. It awaits floor action.<S n={10} /></p>

      <h2>What the Alliance asks</h2>
      <p><strong>Two things the data make obvious.</strong></p>
      <ul>
        <li><strong>Report it.</strong> Every hospital’s purchases, payments received and patients served by insurance type.</li>
        <li><strong>Pay for the drugs on acquisition cost,</strong> as Medicare will from 2027.</li>
      </ul>
    </>
  );
}
