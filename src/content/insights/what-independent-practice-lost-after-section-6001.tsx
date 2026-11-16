import { Compare, Steps } from '@/components/alliance/ui';
import type { InsightMeta } from '@/lib/insights';

const JAMA = 'https://doi.org/10.1001/jamanetworkopen.2023.19980';
const PAI = 'https://www.physiciansadvocacyinstitute.org/PAI-Research/PAI-Avalere-Health-Report-on-Physician-Employment-Trends-and-Practice-Acquisitions-2018-2026';

export const meta: InsightMeta = {
  slug: 'what-independent-practice-lost-after-section-6001',
  title: 'What independent practice lost after Section 6001',
  date: '2026-11-09',
  issue: 'Physician Ownership',
  format: 'Brief',
  summary: 'Congress closed Medicare to new physician-owned hospitals in 2010 to remove a financial incentive. Sixteen years later, 82 percent of physicians are employees, and the incentive sits on the employer’s balance sheet.',
  readTime: 7,
  pdf: '/downloads/what-independent-practice-lost-after-section-6001.pdf',
  takeaways: [
    'Federal investigators found that 93 percent of physician-owned specialty hospitals met both Medicare staffing requirements on every day sampled. They recommended rules on conduct, not on ownership.',
    'By January 1, 2026, 82.0 percent of physicians worked for hospitals or corporate entities. Independent practice lost 152,200 physicians and 81,100 practices between 2018 and 2026.',
    'For the same procedure in the same region, median commercial negotiated prices at physician-owned hospitals were 33.7 percent lower in 2023.',
  ],
  numbers: [
    { value: '93%', label: 'Physician-owned specialty hospitals that met both Medicare staffing requirements on every day sampled, before Congress acted', source: 'HHS Office of Inspector General, 2008', url: 'https://oig.hhs.gov/oei/reports/oei-02-06-00310.pdf' },
    { value: '82.0%', label: 'Physicians employed by hospitals or corporate entities on January 1, 2026', source: 'Physicians Advocacy Institute and Avalere Health, May 2026', url: PAI },
    { value: '33.7%', label: 'Lower median commercial negotiated prices at physician-owned hospitals for the same procedure in the same region, 2023', source: 'JAMA Network Open, 2023', url: JAMA },
  ],
  sources: [
    { label: '42 U.S.C. § 1395nn(i), added by section 6001 of the Patient Protection and Affordable Care Act (2010) and amended by section 10601 of that Act and section 1106 of the Health Care and Education Reconciliation Act of 2010; 42 C.F.R. § 411.362.', url: 'https://www.law.cornell.edu/uscode/text/42/1395nn' },
    { label: 'Medicare Payment Advisory Commission, Report to the Congress: Physician-Owned Specialty Hospitals, March 2005.', url: 'https://www.medpac.gov/document/report-to-the-congress-physician-owned-specialty-hospitals/' },
    { label: 'U.S. Department of Health and Human Services, Office of Inspector General, Physician-Owned Specialty Hospitals’ Ability to Manage Medical Emergencies, OEI-02-06-00310, January 2008: 109 hospitals studied; 93 percent met both staffing requirements on all eight sampled days; four recommendations, all on conduct and enforcement, with which CMS concurred.', url: 'https://oig.hhs.gov/oei/reports/oei-02-06-00310.pdf' },
    { label: 'Centers for Medicare & Medicaid Services, fiscal year 2008 inpatient prospective payment system final rule, 72 Fed. Reg. 47130 (Aug. 22, 2007), adopting Medicare severity diagnosis-related groups.', url: 'https://www.federalregister.gov/documents/2007/08/22/07-3820/medicare-program-changes-to-the-hospital-inpatient-prospective-payment-systems-and-fiscal-year-2008' },
    { label: 'Medicare Payment Advisory Commission, Report to the Congress: Physician-Owned Specialty Hospitals Revisited, August 2006.', url: 'https://www.govinfo.gov/app/details/GOVPUB-Y3_M46_3-PURL-LPS78414' },
    { label: 'Physicians Advocacy Institute and Avalere Health, Physician Employment Trends and Practice Acquisitions, 2018 to 2026, May 2026: 82.0 percent of physicians employed by hospitals or corporate entities as of January 1, 2026, 59.7 percent by hospitals and 22.3 percent by corporate entities; 253,000 additional employed physicians over eight years; 152,200 fewer in independent practice; 157,200 practices, 63.9 percent, owned by hospitals or corporate entities; 85,000 practices acquired; 81,100 fewer physician-owned practices.', url: PAI },
    { label: '42 U.S.C. § 1395nn(e)(2), the bona fide employment exception; 42 C.F.R. § 411.354(d)(4), directed-referral requirements, effective January 19, 2021; Centers for Medicare & Medicaid Services, final rule, 85 Fed. Reg. 77492, 77550 (Dec. 2, 2020).', url: 'https://www.law.cornell.edu/cfr/text/42/411.354' },
    { label: '42 C.F.R. § 411.351, the definition of designated health services, which excludes services paid under the ambulatory surgical center payment system; 42 C.F.R. § 1001.952(r), the ambulatory surgical center safe harbor.', url: 'https://www.law.cornell.edu/cfr/text/42/411.351' },
    { label: 'Tenet Healthcare Corporation, Form 8-K, June 16, 2015, Exhibit 99.1 (acquisition of 50.1 percent of United Surgical Partners International); Form 8-K, April 30, 2018, Exhibit 99.1 (ownership raised to 95 percent); Form 8-K, February 11, 2026, Exhibit 99.1 (533 ambulatory surgery centers at December 31, 2025).', url: 'https://www.sec.gov/Archives/edgar/data/70318/000119312515224695/d943349dex991.htm' },
    { label: 'JAMA Network Open, 2023;6(6):e2319980. Commercial negotiated and cash prices at 156 physician-owned hospitals and 1,116 other hospitals in 78 hospital referral regions, January 2023 price-transparency data: median negotiated prices 33.7 percent lower and cash prices 32.7 percent lower for the same procedure in the same region.', url: JAMA },
    { label: 'Centers for Medicare & Medicaid Services, FY 2027 inpatient prospective payment system final rule, 91 Fed. Reg. 49570, 50104 and n. 572 (Aug. 4, 2026): more than 240 hospitals owned and operated by physicians, citing Physician-Led Healthcare for America, Physician-Led Hospitals (2026); CMS intends to propose a policy for physician-owned hospital participation in the TEAM model.', url: 'https://www.govinfo.gov/content/pkg/FR-2026-08-04/pdf/2026-15833.pdf' },
    { label: 'H.R. 4002, Patient Access to Higher Quality Health Care Act of 2025, 119th Congress, introduced June 12, 2025 and referred to the Committees on Energy and Commerce and Ways and Means.', url: 'https://www.congress.gov/bill/119th-congress/house-bill/4002' },
  ],
};

const S = ({ n }: { n: number }) => <sup><a href={`#src-${n}`}>{n}</a></sup>;

export function Body() {
  return (
    <>
      <h2>The law</h2>
      <p><strong>Section 6001 of the Affordable Care Act did not outlaw physician ownership of hospitals. It closed Medicare to new ones.</strong> To keep billing Medicare for its owners’ referrals, a physician-owned hospital needed physician ownership and a Medicare agreement in effect by December 31, 2010. Its physician ownership share, its beds, its operating rooms and its procedure rooms are frozen at their March 23, 2010 levels. Expansion requires a federal exception, at most once every two years, on the main campus only, with no administrative or judicial review.<S n={1} /></p>
      <p>The stated concern was a financial incentive. A physician who owns part of a hospital has a reason to send patients there. Congress answered the concern by restricting the ownership.</p>

      <h2>What the record said before the vote</h2>
      <p><strong>The federal advisers had looked at the same incentive and reached a different answer.</strong></p>
      <Steps items={[
        { when: 'March 2005', title: 'MedPAC: “too severe a remedy”', text: 'Fix the mispriced payment groups, allow gainsharing, extend the moratorium briefly.' },
        { when: 'October 2007', title: 'CMS adopts severity-refined payment groups', text: 'The payment fix MedPAC asked for, in the fiscal 2008 rule.' },
        { when: 'January 2008', title: 'Inspector General: 93 percent compliant', text: 'Four recommendations, all on conduct and enforcement. None on ownership.' },
        { when: 'March 2010', title: 'Congress: Section 6001', text: 'Ownership and capacity frozen. Medicare closed to new physician-owned hospitals.' },
      ]} />
      <p>In March 2005, MedPAC told Congress that removing the whole-hospital exception would be “too severe a remedy.” It traced the profit incentive to mispriced inpatient payment groups. It recommended severity-refined payment groups, gainsharing and a short extension of the moratorium then in effect.<S n={2} /> CMS adopted the severity-refined groups for fiscal 2008, the payment fix MedPAC had asked for.<S n={4} /></p>
      <p>In January 2008, at the request of the Senate Finance Committee, the HHS Office of Inspector General studied 109 physician-owned specialty hospitals. It found that 93 percent met both Medicare staffing requirements on all eight days sampled. It found gaps: 55 percent had an emergency department, and 34 percent had used 911 to stabilize a patient. It made four recommendations, every one on conduct and enforcement. None touched ownership. CMS concurred with all four.<S n={3} /></p>
      <p>The record was not one-sided. MedPAC’s 2006 follow-up found Medicaid shares of 2 to 3 percent at physician-owned heart and orthopedic hospitals, against 13 percent at their competitors. It found 6 percent more cardiac surgeries per 1,000 beneficiaries in markets with physician-owned hospitals. It also found that competing community hospitals’ margins appeared stable.<S n={5} /> Those are conduct and payment findings. Congress regulated ownership.</p>

      <h2>Where the physicians went</h2>
      <p><strong>As of January 1, 2026, 82.0 percent of American physicians were employees of hospitals or corporate entities.</strong><S n={6} /></p>
      <ul>
        <li>Hospitals employed 59.7 percent. Corporate entities, which include insurers and private equity firms, employed 22.3 percent.</li>
        <li>Over the eight years from 2018, 253,000 more physicians became employees. Independent practice lost 152,200.</li>
        <li>Hospitals and corporate entities acquired 85,000 practices and now own 157,200 of them, 63.9 percent of the total. Physicians lost 81,100 practices.</li>
      </ul>

      <h2>Where the incentive went</h2>
      <p><strong>The Stark law reaches two kinds of financial relationship, ownership and compensation, and it treats them differently.</strong> The bona fide employment exception permits an employer to pay a physician on productivity. Since January 19, 2021, federal regulation also permits an employer to require, in writing, that the physician refer patients within the system, under six conditions. CMS wrote the worked example itself: a 90 percent requirement “would not run afoul” of the rule.<S n={7} /></p>
      <Compare
        a={{ value: '0%', label: 'The share of a hospital opened after the 2010 deadline that a physician may own while referring Medicare patients to it.' }}
        b={{ value: '90%', label: 'A directed-referral requirement an employer may write into a physician’s contract, subject to six conditions.' }}
        caption="The incentive Congress named did not disappear. It changed balance sheets."
        source="42 U.S.C. § 1395nn(i); 42 C.F.R. § 411.354(d)(4); 85 Fed. Reg. 77550 (2020)"
        url="https://www.law.cornell.edu/cfr/text/42/411.354"
      />

      <h2>The surgery center</h2>
      <p><strong>The door that stayed open is now the one being bought.</strong> Ambulatory surgery center (ASC) services are not designated health services under the Stark law. They are excluded by regulation, and physician ownership of an ASC runs under a separate safe harbor.<S n={8} /> Physician capital went there after 2010, and so did the buyers. A hospital company bought 50.1 percent of the largest surgery-center platform in 2015 and raised its stake to 95 percent in 2018. It reported 533 centers at the end of 2025.<S n={9} /> Section 6001 already bars an ASC from converting into a physician-owned hospital.<S n={1} /></p>

      <h2>What the hospitals that survived show</h2>
      <p><strong>The hospitals that made the 2010 deadline are a natural experiment.</strong> A 2023 study compared 156 physician-owned hospitals with 1,116 other hospitals in 78 regions, using January 2023 price-transparency data. For the same procedure in the same region, median commercial negotiated prices at the physician-owned hospitals were 33.7 percent lower. Cash prices were 32.7 percent lower.<S n={10} /></p>
      <p>CMS cites an estimate of more than 240 such hospitals. In its fiscal 2027 inpatient rule, CMS said it intends to propose letting them join the TEAM payment model, because it believes doing so “will promote greater choice and competition.”<S n={11} /></p>

      <h2>The fix</h2>
      <p><strong>H.R. 4002, the Patient Access to Higher Quality Health Care Act of 2025, would repeal Section 6001 in full.</strong> It was introduced June 12, 2025 and referred to the Committees on Energy and Commerce and Ways and Means. It has not advanced.<S n={12} /></p>
      <p>The Alliance’s position follows the record. Repeal the ownership restriction. Then apply the conduct rules the Inspector General recommended, on emergency capability, disclosure and staffing, to every hospital regardless of who owns it. Regulate what hospitals do, not who is allowed to own them.</p>
    </>
  );
}
