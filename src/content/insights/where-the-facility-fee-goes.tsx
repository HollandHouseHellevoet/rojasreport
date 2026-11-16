import { Compare, Steps } from '@/components/alliance/ui';
import type { InsightMeta } from '@/lib/insights';

const HCCI = 'https://healthcostinstitute.org/all-hcci-reports/facility-fees-what-are-they-and-how-do-they-impact-health-care-prices/';

export const meta: InsightMeta = {
  slug: 'where-the-facility-fee-goes',
  title: 'Where the facility fee goes',
  date: '2026-11-09',
  issue: 'Site-Neutral',
  format: 'Report',
  summary: 'Medicare and private insurers pay more for a visit, an infusion or a scan when a hospital owns the office. This report follows the fee from the statute to the patient’s bill, and to the bills in Congress that would end it.',
  readTime: 7,
  pdf: '/downloads/where-the-facility-fee-goes.pdf',
  featured: true,
  takeaways: [
    'A primary care visit billed through a hospital outpatient department cost $217 in 2022 commercial claims. The same visit in a physician office cost $116, so the hospital setting cost 87 percent more.',
    'Congress equalized payment for new off-campus departments in 2015 and exempted every department already billing, so the fee survived at the sites that generate it.',
    'CMS has equalized three services by rule since 2019. MedPAC’s 66 service groups would have saved $7.5 billion on 2021 data. CBO scores the full policy at $156.9 billion over ten years.',
  ],
  numbers: [
    { value: '87%', label: 'More for the same primary care visit in a hospital outpatient department than in a physician office, 2022 commercial claims', source: 'Health Care Cost Institute, 2025', url: HCCI },
    { value: '$7.5B', label: 'One-year saving if Medicare paid the same rate across settings for MedPAC’s 66 service groups, 2021 data', source: 'MedPAC, June 2023', url: 'https://www.medpac.gov/wp-content/uploads/2023/06/Jun23_Ch8_MedPAC_Report_To_Congress_SEC.pdf' },
    { value: '$156.9B', label: 'Federal saving over 2025 to 2034 from site-neutral rates for most services at all hospital outpatient departments', source: 'Congressional Budget Office, December 2024', url: 'https://www.cbo.gov/budget-options/60908' },
  ],
  sources: [
    { label: '42 U.S.C. § 1395l(t), the hospital outpatient prospective payment system, and 42 U.S.C. § 1395w-4, the physician fee schedule. Medicare pays for the same outpatient service under two systems depending on who owns the site of care.', url: 'https://www.law.cornell.edu/uscode/text/42/1395l' },
    { label: 'Health Care Cost Institute, Facility Fees: What are they and how do they impact health care prices?, May 6, 2025. Commercial claims, 2022: a primary care visit cost $116 in a physician office and $217 in a hospital outpatient setting, 87 percent higher.', url: HCCI },
    { label: 'Bipartisan Budget Act of 2015, Pub. L. 114-74, § 603, 129 Stat. 584, 597 (Nov. 2, 2015), codified at 42 U.S.C. § 1395l(t)(21); 42 C.F.R. § 413.65(a)(2) (campus means the main buildings and the area within 250 yards of them); 21st Century Cures Act, Pub. L. 114-255, §§ 16001 and 16002 (Dec. 13, 2016).', url: 'https://www.govinfo.gov/content/pkg/PLAW-114publ74/html/PLAW-114publ74.htm' },
    { label: 'CMS, CY 2019 hospital outpatient payment final rule, CMS-1695-FC, 83 Fed. Reg. 58818, 59013 to 59014 (Nov. 21, 2018); CY 2020 final rule, 84 Fed. Reg. 61142, 61365, 61369 (Nov. 12, 2019): the clinic visit at excepted off-campus departments paid at the physician fee schedule rate, phased in over 2019 and 2020; estimated 2020 savings $800 million, $640 million to Medicare and $160 million to beneficiaries in reduced copayments. Upheld, American Hospital Association v. Azar, No. 19-5352 (D.C. Cir. July 17, 2020); certiorari denied June 28, 2021.', url: 'https://www.federalregister.gov/documents/2018/11/21/2018-24243' },
    { label: 'CMS, CY 2026 hospital outpatient payment final rule, CMS-1834-FC, 90 Fed. Reg. 53448, 53808, 53821 (Nov. 25, 2025): drug administration at excepted off-campus departments paid at the physician fee schedule rate from January 1, 2026; estimated savings $290 million, $220 million to Medicare and $70 million to beneficiaries in reduced coinsurance; rural sole community hospitals exempt.', url: 'https://www.federalregister.gov/documents/2025/11/25/2025-20907' },
    { label: 'CMS, CY 2027 hospital outpatient payment final rule, CMS-1850-FC, 91 Fed. Reg. 70284, 70589, 70607, 70611, 70739 (Nov. 6, 2026): imaging without contrast at excepted off-campus departments paid at the physician fee schedule rate from January 1, 2027; estimated savings $260 million, $190 million to Medicare and $70 million to beneficiaries; rural sole community hospitals exempt.', url: 'https://www.federalregister.gov/documents/2026/11/06/2026-22739' },
    { label: 'Medicare Payment Advisory Commission, Report to the Congress: Medicare and the Health Care Delivery System, June 2023, ch. 8, Aligning fee-for-service payment rates across ambulatory settings, pp. 352, 360 to 369. Recommendation 8; 66 of 169 service groups; on 2021 data, Medicare outlays $6.0 billion lower and beneficiary cost sharing $1.5 billion lower.', url: 'https://www.medpac.gov/wp-content/uploads/2023/06/Jun23_Ch8_MedPAC_Report_To_Congress_SEC.pdf' },
    { label: 'Congressional Budget Office, Options for Reducing the Deficit: 2025 to 2034, Dec. 12, 2024, Option 16, Reduce Payments for Hospital Outpatient Departments, p. 23: site-neutral rates for most services at all off-campus and on-campus hospital outpatient departments, $156.9 billion in reduced federal spending over 2025 to 2034.', url: 'https://www.cbo.gov/budget-options/60908' },
    { label: 'Young G. J., Zepeda E. D., Flaherty S., Thai N., Hospital Employment Of Physicians In Massachusetts Is Associated With Inappropriate Diagnostic Imaging, Health Affairs 40(5):710 to 718 (May 2021), doi:10.1377/hlthaff.2020.01183. Massachusetts claims, 2009 to 2016.', url: 'https://www.healthaffairs.org/doi/10.1377/hlthaff.2020.01183' },
    { label: 'Consolidated Appropriations Act, 2026, Pub. L. 119-75, div. J, title II, § 6225 (Feb. 3, 2026), adding 42 U.S.C. § 1395l(t)(23): from January 1, 2028, Medicare pays an off-campus hospital outpatient department only for claims billed under its own NPI, the identifier Medicare assigns to each billing entity, separate from the hospital’s, with hospital attestations.', url: 'https://www.govinfo.gov/content/pkg/PLAW-119publ75/html/PLAW-119publ75.htm' },
    { label: 'S. 1629, Same Care, Lower Cost Act, 119th Congress, introduced May 6, 2025, referred to the Committee on Finance; H.R. 3023, Preventing Hospital Overbilling of Medicare Act, introduced April 24, 2025, referred to the Committees on Energy and Commerce and Ways and Means. Neither has advanced past referral as of November 2026.', url: 'https://www.congress.gov/bill/119th-congress/senate-bill/1629' },
  ],
};

const S = ({ n }: { n: number }) => <sup><a href={`#src-${n}`}>{n}</a></sup>;

export function Body() {
  return (
    <>
      <h2>The fee in one visit</h2>
      <p><strong>One visit, two prices.</strong> In 2022 commercial claims, a primary care visit cost $116 in a physician office. In a hospital outpatient setting, the same visit cost $217.<S n={2} /></p>
      <Compare
        a={{ value: '$116', label: 'Primary care visit, physician office' }}
        b={{ value: '$217', label: 'The same visit, hospital outpatient department' }}
        caption="87 percent more for the same visit. The difference is the facility fee, a second charge for the building on top of the physician’s fee."
        source="Health Care Cost Institute, 2022 commercial claims, May 2025"
        url={HCCI}
      />

      <h2>Two payment systems for one service</h2>
      <p><strong>Medicare built the structure.</strong> A physician office is paid under the physician fee schedule. A hospital outpatient department is paid under the hospital outpatient prospective payment system.<S n={1} /> The two systems price the same service differently, and the hospital system pays more.</p>
      <p>When a hospital buys a practice and designates it a department, the practice crosses from one system to the other without moving. The physician’s fee is unchanged. The facility fee is new. Private insurers are billed the same way, which is why the 87 percent gap above is a commercial figure.<S n={2} /></p>

      <h2>What Congress did in 2015, and what it left out</h2>
      <p><strong>Congress fixed the fee for new sites and kept it for every old one.</strong> Section 603 of the Bipartisan Budget Act of 2015 ended the two-system arrangement for new off-campus departments. From January 1, 2017, an off-campus department is paid as if it were a physician office. Off-campus means outside the hospital’s main buildings and more than 250 yards from them.<S n={3} /></p>
      <p>The law then exempted everything that already existed:<S n={3} /></p>
      <ul>
        <li>any department billing before November 2, 2015, which kept the hospital rate</li>
        <li>dedicated emergency departments</li>
        <li>departments under a binding construction agreement signed before the 2015 date, added by the 21st Century Cures Act</li>
        <li>departments of cancer hospitals, added by the same Act</li>
      </ul>
      <p>The result is a fee that no new off-campus site can earn and every established site keeps. The practices bought before 2015 still bill it.</p>

      <h2>What has been equalized, and when</h2>
      <p><strong>Where Congress stopped, CMS has moved one service at a time.</strong> It has used its authority to control unnecessary volume at the exempted departments.</p>
      <Steps items={[
        { when: '2015', title: 'Congress: new off-campus departments', text: 'Paid at the physician-office rate from 2017. Existing departments exempt.' },
        { when: '2019 to 2020', title: 'CMS: the clinic visit', text: '$800 million saved in 2020, $160 million of it by beneficiaries in lower copayments.' },
        { when: '2026', title: 'CMS: drug administration', text: 'Infusions and injections. $290 million in 2026, $70 million of it by beneficiaries.' },
        { when: '2027', title: 'CMS: imaging without contrast', text: '$260 million in the first year, $70 million of it by beneficiaries.' },
        { when: '2028', title: 'Congress: a separate identifier', text: 'Each off-campus department bills under its own identifier, with hospital attestations.' },
      ]} />
      <p>Hospitals sued over the clinic-visit rule. The D.C. Circuit upheld it in July 2020 and the Supreme Court declined review in June 2021.<S n={4} /> The drug administration rule took effect January 1, 2026.<S n={5} /> The imaging rule, published November 6, 2026, takes effect January 1, 2027.<S n={6} /> Rural sole community hospitals are exempt from both recent rules.<S n={5} /><S n={6} /> The identifier requirement is law, effective January 1, 2028.<S n={10} /></p>
      <blockquote><p>Three services in eight years. Every other service at the grandfathered clinics still carries the fee.</p></blockquote>

      <h2>What is left on the table</h2>
      <p><strong>The federal advisers have already drawn the list.</strong> MedPAC identified 66 of the 169 outpatient service groups that are safe to provide in any setting and recommended that Congress align their rates. On 2021 data, the alignment would have lowered Medicare spending by $6.0 billion and beneficiary cost sharing by $1.5 billion, $7.5 billion in one year.<S n={7} /></p>
      <p>CBO scored the broader policy, site-neutral rates for most services at all off-campus and on-campus departments. The saving: $156.9 billion in federal spending over 2025 to 2034.<S n={8} /></p>

      <h2>Where the fee goes</h2>
      <p><strong>The fee changes what gets ordered.</strong> A Massachusetts study followed physicians who moved into hospital employment. After the move, the odds that a patient received an inappropriate MRI referral rose by more than 20 percent. Most of those scans were done at the employing hospital.<S n={9} /> A payment that rewards the building rewards sending patients to the building.</p>
      <p>The fee also prices the practice. A hospital that buys an independent office gains a charge the office could never bill on its own. The independent physician across the street competes against that charge every day.</p>

      <h2>The fix</h2>
      <p><strong>Congress has the text in front of it.</strong> S. 1629, the Same Care, Lower Cost Act, would apply site-neutral payment to at least 66 service groups from 2027. H.R. 3023, the Preventing Hospital Overbilling of Medicare Act, would end the 2015 exemptions and require a unique identifier on commercial claims. Both were referred to committee in spring 2025. Neither has advanced.<S n={11} /></p>
      <p>The Alliance’s position is the plain one. Same service, same price, regardless of who owns the building. Every service, every site. The rules CMS has written show the mechanism works. Putting it in statute finishes the job.</p>
    </>
  );
}
