import type { Metadata } from 'next';
import FightPage from '@/components/alliance/FightPage';
import { Compare, Fn } from '@/components/alliance/ui';
import { makeMetadata } from '@/lib/seo';

// Ported from the Alliance site (tafhc.com) in the November 2026 merge. Public framing: reform, transparency and
// accountability. Every figure is quoted as its source prints it.
const sources = [
  { id: 'hrsa', text: 'Health Resources and Services Administration, Office of Pharmacy Affairs, 340B covered-entity purchase data, calendar year 2025 ($100.0B total; $79.2B at disproportionate share hospitals).', url: 'https://www.hrsa.gov/opa/updates/2025-340b-covered-entity-purchases' },
  { id: 'cbo', text: 'Congressional Budget Office, Growth in the 340B Drug Pricing Program, September 9, 2025.', url: 'https://www.cbo.gov/publication/60661' },
  { id: 'gao', text: 'U.S. Government Accountability Office, GAO-26-108784, testimony before the Senate Committee on Health, Education, Labor, and Pensions, October 23, 2025.', url: 'https://www.gao.gov/products/gao-26-108784' },
  { id: 'statute', text: '42 U.S.C. § 256b (section 340B of the Public Health Service Act).', url: 'https://www.law.cornell.edu/uscode/text/42/256b' },
  { id: 'bai', text: 'Robinson S. W., Whaley C. M., Dhruva S. S., “Hospital Prices for Physician-Administered Drugs for Patients with Private Insurance,” New England Journal of Medicine 390:338 to 345 (Jan. 25, 2024): median markup to private insurers on 340B drugs of 3.08 times acquisition cost; top quartile above 6.38 times; 340B-eligible hospitals retained 64.3 percent of insurer drug spending.', url: 'https://doi.org/10.1056/NEJMsa2306609' },
  { id: 'wang', text: 'Wang Y., Perkins J., Whaley C. M., Bai G., “Sharp Rise in Urban Hospitals With Rural Status in Medicare, 2017 to 23,” Health Affairs, August 2025, doi:10.1377/hlthaff.2025.00019.', url: 'https://doi.org/10.1377/hlthaff.2025.00019' },
  { id: 'kff', text: 'KFF, Employer Health Benefits Survey, 2025: 67 percent of covered workers are in self-funded plans.', url: 'https://www.kff.org/health-costs/report/2025-employer-health-benefits-survey/' },
  { id: 'cms', text: 'Centers for Medicare & Medicaid Services, CY 2027 Hospital Outpatient Prospective Payment System final rule, CMS-1850-FC, 91 Fed. Reg. 70284, 70534, 70550, 70552, 70740 (Nov. 6, 2026); CMS press release, Nov. 4, 2026 ($4.35 billion for taxpayers, $1.1 billion for people with Original Medicare, $5.45 billion in 2027). The proposed rule, CMS-1850-P, 91 Fed. Reg. 41734 (July 7, 2026), had proposed average sales price minus 33.4 percent; its July 2, 2026 fact sheet put the first-year reductions at $4.55 billion for Medicare and $1.15 billion for beneficiaries, figures the final rule superseded.', url: 'https://www.federalregister.gov/documents/2026/11/06/2026-22739' },
  { id: 'hrsaaudit', text: 'Health Resources and Services Administration, Office of Pharmacy Affairs, program integrity audit results, fiscal year 2024; audit volume and the fiscal year 2024 appropriation from CBO, 2025.', url: 'https://www.hrsa.gov/opa/program-integrity/fy-24-audit-results' },
  { id: 'hr9504', text: 'H.R. 9504, Tax-Exempt Hospital Transparency Act, 119th Congress; ordered reported by the Committee on Ways and Means, July 1, 2026, by a vote of 25 to 15.', url: 'https://www.congress.gov/bill/119th-congress/house-bill/9504' },
  { id: 'states', text: 'State covered-entity reporting laws: Washington, Minnesota and Maine (2023); Colorado, Idaho, Indiana, Ohio, Rhode Island and Vermont (2025); Hawaii (health centers only). Minnesota Department of Health, 340B covered-entity data for 2024, released February 27, 2026.', url: 'https://www.health.state.mn.us/data/340b' },
];
const fn = (id: string) => sources.findIndex((s) => s.id === id) + 1;
const F = ({ id }: { id: string }) => <Fn n={fn(id)} id={id} />;

export const metadata: Metadata = makeMetadata({
  title: '340B Reform',
  description: 'Drugs bought at 340B prices reached $100.0 billion in 2025. The statute requires no report of where the discount goes and does not require that it reach a patient. The Alliance is working for transparency and accountability.',
  path: '/fights/340b/',
});

export default function Page() {
  return (
    <FightPage
      slug="340b"
      title="340B Reform"
      stake="$100 billion in drugs bought at 340B prices, and no requirement to say where the discount went. Require every hospital in the program to report it, and make the discount reach the patient’s bill."
      core={{ value: '$100.0B', label: 'Drugs bought at 340B prices in 2025, up from $6.6B in 2010', source: 'HRSA, 2025 covered-entity purchases; CBO, 2025', url: 'https://www.cbo.gov/publication/60661' }}
      takeaways={[
        'Drugs bought at 340B prices reached $100.0 billion in 2025, from $6.6 billion in 2010. Disproportionate share hospitals bought $79.2 billion of it.',
        'The statute names no purpose for the discount, no limit on what a hospital may charge, and no duty to report where the money goes.',
        'The median markup to private insurers on a 340B drug is 3.08 times what the hospital paid. A patient’s coinsurance is calculated on the price charged.',
      ]}
      numbers={[
        { value: '$79.2B', label: 'Of the $100.0B in 2025 was bought by disproportionate share hospitals', source: 'HRSA covered-entity purchase data, 2025', url: 'https://www.hrsa.gov/opa/updates/2025-340b-covered-entity-purchases' },
        { value: '3.08x', label: 'Median markup to private insurers on 340B drugs, against acquisition cost', source: 'Robinson et al., New England Journal of Medicine, 2024', url: 'https://doi.org/10.1056/NEJMsa2306609' },
        { value: '425', label: 'Urban hospitals holding rural status in Medicare in 2023, up from 3 in 2017', source: 'Wang et al., Health Affairs, August 2025', url: 'https://doi.org/10.1377/hlthaff.2025.00019' },
        { value: '15 of 20', label: 'GAO recommendations on the 340B program since 2011 that remain open', source: 'GAO-26-108784, October 2025', url: 'https://www.gao.gov/products/gao-26-108784' },
      ]}
      sources={sources}
      problem={
        <>
          <p><strong>The 340B program lets a hospital that qualifies buy outpatient drugs at a federally set discount, then bill insurers, employers and patients at a price the hospital sets.</strong> The statute:<F id="statute" /></p>
          <ul>
            <li>Names no purpose for the discount.</li>
            <li>Says nothing about what a hospital may charge for the drug.</li>
            <li>Contains no requirement to report where the money goes.</li>
          </ul>
          <blockquote>
            <p>The program does not “require that these drug discounts be passed on to patients.”</p>
            <cite>Government Accountability Office, testimony to the Senate, October 2025<F id="gao" /></cite>
          </blockquote>
          <p><strong>Those are the government’s own findings.</strong> The Government Accountability Office told the Senate in October 2025 that the program does not dictate how covered entities use the revenue.<F id="gao" /> The purpose often attributed to the program, stretching scarce federal resources, comes from a 1992 committee report on a similar bill, not from the statute.<F id="gao" /> The Congressional Budget Office reported in 2025 that it “cannot assess how participants use net revenues or which patients benefit from them.”<F id="cbo" /> Nothing in the law limits what a covered entity charges a commercial payer or a patient.<F id="statute" /></p>

          <h3>How a discount becomes a margin</h3>
          <p><strong>Purchases at 340B prices grew from $6.6 billion in 2010 to $43.9 billion in 2021, with hospitals accounting for 87 percent of the 2021 total.</strong><F id="cbo" /> They reached $100.0 billion in 2025.<F id="hrsa" /> Disproportionate share hospitals, which qualify through their share of Medicaid and low-income Medicare patients, bought $79.2 billion of it.<F id="hrsa" /> The Congressional Budget Office’s model attributes about two-thirds of the growth to structural factors, clinic acquisitions, expanded eligibility and contract pharmacies, rather than to drug prices.<F id="cbo" /></p>
          <p><strong>The margin is in the bill.</strong> The median markup a hospital charges a private insurer on a 340B drug is 3.08 times what the hospital paid for it, and the top quartile exceeds 6.38 times.<F id="bai" /> On the Medicare side, the federal government’s own acquisition-cost survey led CMS to propose paying for 340B drugs at average sales price minus 33.4 percent. In November 2026 it finalized minus 28 percent for 2027 and later, after commenters said the full figure would cut too deep and limit patients’ access to the drugs.<F id="cms" /></p>
          <Compare
            a={{ value: '+6%', label: 'Medicare’s payment for a 340B drug, relative to average sales price, 2023 to 2026' }}
            b={{ value: '-28%', label: 'Medicare’s payment for a 340B drug from 2027, after CMS surveyed what hospitals paid' }}
            caption="The survey figure, minus 33.4 percent, is the size of the spread on the Medicare side, measured by the agency that pays it. Rural sole community, cancer and children’s hospitals are exempt."
            source="CMS, CY 2027 hospital outpatient payment final rule, 91 Fed. Reg. 70284 (Nov. 6, 2026)"
            url="https://www.federalregister.gov/documents/2026/11/06/2026-22739"
          />

          <h3>Who pays</h3>
          <ul>
            <li><strong>Patients.</strong> A patient’s coinsurance is calculated on the price the hospital charges, not the price it paid.<F id="statute" /></li>
            <li><strong>Employers.</strong> 67 percent of covered workers are in self-funded plans, where the employer pays the hospital bill as priced.<F id="kff" /></li>
            <li><strong>Medicare and its beneficiaries.</strong> CMS estimates that its final 2027 payment change will lower drug costs for people with Original Medicare by $1.1 billion in its first year.<F id="cms" /> That rule is the only federal mechanism that puts a 340B saving on a patient’s bill, and it cannot reach a commercially insured patient.</li>
          </ul>

          <h3>How much of the growth came without a vote</h3>
          <p><strong>Contract pharmacy arrangements, which the statute does not address, multiplied after agency guidance.</strong><F id="cbo" /></p>
          <Compare
            a={{ value: '2,000', label: 'Contract pharmacy arrangements in 2010' }}
            b={{ value: '130,000', label: 'Contract pharmacy arrangements in 2021' }}
            caption="CBO’s figures: about 2,000 in 2010 and nearly 130,000 in 2021, after agency guidance. The statute does not address them."
            source="Congressional Budget Office, Growth in the 340B Drug Pricing Program, September 2025"
            url="https://www.cbo.gov/publication/60661"
          />
          <ul>
            <li>The number of urban hospitals holding rural status in Medicare rose from 3 in 2017 to 425 in 2023, after a 2016 payment rule. The status lowers the 340B eligibility threshold from 11.75 percent to 8 percent, and Congress never voted on it.<F id="wang" /></li>
            <li>The program’s administrator audits about 200 covered entities a year on a $12.2 million appropriation for fiscal year 2024. 64 percent of that year’s audits had adverse findings.<F id="hrsaaudit" /></li>
            <li>Fifteen of the twenty recommendations GAO has made on the 340B program since 2011 remain open.<F id="gao" /></li>
          </ul>
        </>
      }
      fix={
        <>
          <p>Two requirements that the law has never contained: report the money, and make the discount reach the patient.</p>
          <ol className="plan">
            <li>
              <div>
                <h3>Require every hospital in the program to report it</h3>
                <p>Annual, public reporting by each hospital covered entity: 340B purchases, payments received for 340B drugs, net 340B revenue, and the patients served by insurance type. The Tax-Exempt Hospital Transparency Act, H.R. 9504, would require hospitals with net patient revenue above $100 million to report 340B patients by insurance type, aggregate net 340B payment and compliance costs. On July 1, 2026 it became the first federal 340B disclosure requirement to clear a congressional committee, 25 to 15.<F id="hr9504" /> Nine states, plus Hawaii for health centers, already require covered-entity reports; Minnesota’s shows that facilities there netted 44 cents on every 340B dollar in 2024, with hospitals taking more than 80 percent.<F id="states" /></p>
              </div>
            </li>
            <li>
              <div>
                <h3>Make the discount reach the patient’s bill</h3>
                <p>A statutory definition of the 340B patient, and a requirement that a patient’s cost-sharing on a 340B drug be calculated on the price the hospital paid, not the price it charges. CMS estimates that its final 2027 rule will lower drug costs for people with Original Medicare by $1.1 billion in its first year.<F id="cms" /> The Alliance is asking Congress to write it into the statute for every patient the program claims to serve.</p>
              </div>
            </li>
          </ol>
        </>
      }
    />
  );
}
