import type { Metadata } from 'next';
import FightPage from '@/components/alliance/FightPage';
import { Compare, Fn, Steps } from '@/components/alliance/ui';
import { makeMetadata } from '@/lib/seo';

// Ported from the Alliance site (tafhc.com) in the November 2026 merge. Every number below is quoted as its primary
// source prints it. Sources are listed in order of first appearance.
const HCCI = 'https://healthcostinstitute.org/all-hcci-reports/facility-fees-what-are-they-and-how-do-they-impact-health-care-prices/';
const sources = [
  { id: 'opps', text: '42 U.S.C. § 1395l(t) (hospital outpatient prospective payment system) and 42 U.S.C. § 1395w-4 (physician fee schedule). Medicare pays for the same outpatient service under two different systems depending on who owns the site of care.', url: 'https://www.law.cornell.edu/uscode/text/42/1395l' },
  { id: 'g0463', text: 'CMS, CY 2019 hospital outpatient payment final rule, CMS-1695-FC, 83 Fed. Reg. 58818, 59013 to 59014 (Nov. 21, 2018): the clinic visit (HCPCS G0463) at excepted off-campus departments is paid at the physician fee schedule equivalent rate, 40 percent of the hospital outpatient rate, phased in over 2019 and 2020. CMS, CY 2020 final rule, 84 Fed. Reg. 61142, 61365, 61369 (Nov. 12, 2019): estimated savings of $800 million in 2020, $640 million to Medicare and $160 million to beneficiaries in reduced copayments. Upheld against the hospital association’s challenge, No. 19-5352 (D.C. Cir. July 17, 2020); certiorari denied June 28, 2021.', url: 'https://www.federalregister.gov/documents/2018/11/21/2018-24243' },
  { id: 'hcci', text: 'Health Care Cost Institute, "Facility Fees: What are they and how do they impact health care prices?," May 6, 2025. Commercial claims, 2022: a primary care visit cost $116 in a physician office and $217 in a hospital outpatient setting, 87 percent higher.', url: HCCI },
  { id: 'bba', text: 'Bipartisan Budget Act of 2015, Pub. L. 114-74, § 603, 129 Stat. 584, 597 (Nov. 2, 2015), codified at 42 U.S.C. § 1395l(t)(21). An off-campus department is one not on the hospital campus, defined at 42 C.F.R. § 413.65(a)(2) as the main buildings and the area within 250 yards of them. Departments billing before November 2, 2015 are excepted, as are dedicated emergency departments. The 21st Century Cures Act, Pub. L. 114-255, §§ 16001 and 16002 (Dec. 13, 2016), added exceptions for departments with a binding written construction agreement signed before November 2, 2015, and for cancer hospitals.', url: 'https://www.govinfo.gov/content/pkg/PLAW-114publ74/html/PLAW-114publ74.htm' },
  { id: 'cbo', text: 'Congressional Budget Office, Options for Reducing the Deficit: 2025 to 2034, Dec. 12, 2024, Option 16, "Reduce Payments for Hospital Outpatient Departments," p. 23. Paying site-neutral rates for most services at all off-campus and on-campus hospital outpatient departments: $156.9 billion in reduced federal spending over 2025 to 2034.', url: 'https://www.cbo.gov/budget-options/60908' },
  { id: 'medpac', text: 'Medicare Payment Advisory Commission, Report to the Congress: Medicare and the Health Care Delivery System, June 2023, ch. 8, "Aligning fee-for-service payment rates across ambulatory settings," pp. 352, 360 to 369. Recommendation 8 and the estimate for 66 of 169 service groups on 2021 data: Medicare outlays $6.0 billion lower and beneficiary cost sharing $1.5 billion lower.', url: 'https://www.medpac.gov/wp-content/uploads/2023/06/Jun23_Ch8_MedPAC_Report_To_Congress_SEC.pdf' },
  { id: 'rules', text: 'CMS, CY 2026 hospital outpatient payment final rule, CMS-1834-FC, 90 Fed. Reg. 53448, 53808, 53821 (Nov. 25, 2025): drug administration at excepted off-campus departments paid at the physician fee schedule equivalent rate from January 1, 2026; estimated savings $290 million, $220 million to Medicare and $70 million to beneficiaries in reduced coinsurance. CMS, CY 2027 final rule, CMS-1850-FC, 91 Fed. Reg. 70284, 70589, 70607, 70611, 70739 (Nov. 6, 2026): imaging without contrast at excepted off-campus departments paid the same way from January 1, 2027; estimated savings $260 million, $190 million to Medicare and $70 million to beneficiaries. Rural sole community hospitals are exempt from both.', url: 'https://www.federalregister.gov/documents/2026/11/06/2026-22739' },
  { id: 'caa', text: 'Consolidated Appropriations Act, 2026, Pub. L. 119-75, div. J, title II, § 6225 (Feb. 3, 2026), adding 42 U.S.C. § 1395l(t)(23): from January 1, 2028, Medicare pays an off-campus hospital outpatient department only for claims billed under a national billing identifier (NPI) separate from the hospital’s, with initial and periodic attestations by the hospital.', url: 'https://www.govinfo.gov/content/pkg/PLAW-119publ75/html/PLAW-119publ75.htm' },
  { id: 'hr3023', text: 'H.R. 3023, Preventing Hospital Overbilling of Medicare Act, 119th Congress, introduced April 24, 2025 and referred to the Committees on Energy and Commerce and Ways and Means. It would end the grandfather, mid-build and off-campus emergency department exceptions and require a unique identifier on commercial claims. S. 1629, Same Care, Lower Cost Act, introduced May 6, 2025 and referred to the Committee on Finance, would apply site-neutral payment to at least 66 service groups from 2027. Neither has advanced past referral.', url: 'https://www.congress.gov/bill/119th-congress/house-bill/3023' },
];
const fn = (id: string) => sources.findIndex((s) => s.id === id) + 1;
const F = ({ id }: { id: string }) => <Fn n={fn(id)} id={id} />;

export const metadata: Metadata = makeMetadata({
  title: 'Site-Neutral Payment',
  description: 'Medicare pays a hospital-owned clinic more than an independent physician office for the same service. The Alliance is working to end the facility fee: same service, same price, regardless of who owns the building.',
  path: '/fights/site-neutral/',
});

export default function Page() {
  return (
    <FightPage
      slug="site-neutral"
      title="Site-Neutral Payment"
      stake="Same service, same price, regardless of who owns the building. End the facility fee that pays a hospital-owned clinic more than an independent office for identical care."
      core={{ value: '87%', label: 'More for the same primary care visit in a hospital outpatient department than in a physician office, 2022 commercial claims', source: 'Health Care Cost Institute, 2025', url: HCCI }}
      takeaways={[
        'Medicare runs two price lists for the same outpatient care. A clinic a hospital owns is paid a facility fee on top of the physician’s payment.',
        'In 2015 Congress made new off-campus clinics site-neutral and excepted every clinic already billing, every campus clinic and every emergency department.',
        'CMS has equalized three services by rule since 2019. CBO scores site-neutral rates for most services at every department at $156.9 billion over ten years.',
      ]}
      numbers={[
        { value: '$156.9B', label: 'Federal savings over ten years from paying site-neutral rates for most services at every hospital outpatient department', source: 'CBO, Option 16, December 2024', url: 'https://www.cbo.gov/budget-options/60908' },
        { value: '$1.5B', label: 'What beneficiaries would have saved in cost sharing in 2021 from aligning 66 service groups, if the savings were kept', source: 'MedPAC, June 2023, ch. 8', url: 'https://www.medpac.gov/wp-content/uploads/2023/06/Jun23_Ch8_MedPAC_Report_To_Congress_SEC.pdf' },
        { value: '40%', label: 'The physician fee schedule equivalent rate Medicare pays an excepted off-campus clinic for a clinic visit, as a share of the hospital outpatient rate', source: 'CMS, CY 2020 OPPS final rule, 84 Fed. Reg. 61365', url: 'https://www.federalregister.gov/documents/2019/11/12/2019-24138' },
        { value: '2015', label: 'The year Congress made new off-campus hospital clinics site-neutral, and grandfathered every existing one', source: 'Bipartisan Budget Act of 2015, § 603', url: 'https://www.govinfo.gov/content/pkg/PLAW-114publ74/html/PLAW-114publ74.htm' },
      ]}
      sources={sources}
      problem={
        <>
          <p><strong>Medicare runs two price lists for the same outpatient care.</strong> A visit in a physician’s office is paid under the physician fee schedule. The same visit, with the same physician, in a clinic a hospital bills as one of its outpatient departments is paid under the hospital outpatient system. That system adds a facility fee on top of the physician’s payment.<F id="opps" /> The service did not change. The label on the building did.</p>
          <p>For the clinic visit, the one service Medicare equalized first at the grandfathered clinics, the physician fee schedule equivalent rate is 40 percent of the hospital outpatient rate.<F id="g0463" /> Commercial prices show the same gap.<F id="hcci" /></p>
          <Compare
            a={{ value: '$116', label: 'Primary care visit, physician office, 2022 commercial claims' }}
            b={{ value: '$217', label: 'The same visit, hospital outpatient department' }}
            caption="87 percent more for the same visit. A patient’s coinsurance is calculated on the higher total."
            source="Health Care Cost Institute, 2022 commercial claims, May 2025"
            url={HCCI}
          />

          <h3>Where the money goes</h3>
          <p><strong>When the price depends on the label, the owner of the higher price list has a reason to buy the site.</strong> A hospital system that acquires an independent practice on its campus and re-labels it as an outpatient department bills the hospital rate once the practice is enrolled as one. The same physicians see the same patients in the same rooms. For a practice farther away, the 2015 law limits Medicare’s payment but leaves commercial contracts untouched.<F id="bba" /> The facility fee is not a payment for better care. It is a payment for the acquisition.</p>

          <h3>What Congress has already done, and left undone</h3>
          <p><strong>In 2015 Congress agreed with the principle.</strong> Section 603 of the Bipartisan Budget Act removed new off-campus hospital clinics from the hospital outpatient payment system. It excepted:<F id="bba" /></p>
          <ul>
            <li>Every off-campus clinic that was billing before November 2, 2015.</li>
            <li>Every clinic on the campus, which the rules define as the main buildings and the area within 250 yards of them.</li>
            <li>Every emergency department.</li>
          </ul>
          <p>For most services, the excepted clinics keep the hospital rate. The incumbents kept most of the facility fee. The rule bound the competitors who came later. Medicare has since equalized three services by rule at the excepted off-campus clinics, and Congress has required a separate identifier on their claims.<F id="g0463" /><F id="rules" /><F id="caa" /></p>
          <Steps label="The record, 2015 to 2028" items={[
            { when: '2015', title: 'Congress: new off-campus clinics', text: 'Section 603. Every clinic already billing, every campus clinic and every emergency department excepted.' },
            { when: '2019 to 2020', title: 'CMS: the clinic visit', text: 'Paid at 40 percent of the hospital rate at excepted clinics. Upheld on appeal in 2020.' },
            { when: '2026', title: 'CMS: drug administration', text: 'The same rate at excepted off-campus departments. Rural sole community hospitals exempt.' },
            { when: '2027', title: 'CMS: imaging without contrast', text: 'Final rule November 2026, effective January 1, 2027. The same exemption.' },
            { when: '2028', title: 'Congress: a separate identifier', text: 'Off-campus departments paid only when billing under their own NPI, from January 1, 2028.' },
          ]} />
          <blockquote><p>Three services in eight years. Every other service at the grandfathered clinics still carries the fee.</p></blockquote>

          <h3>What is left on the table</h3>
          <p><strong>The savings are on the record.</strong></p>
          <ul>
            <li>In December 2024 the Congressional Budget Office scored site-neutral rates for most services at every hospital outpatient department, on campus and off: $156.9 billion over ten years.<F id="cbo" /></li>
            <li>MedPAC estimated that aligning 66 service groups would have lowered Medicare outlays by $6.0 billion and beneficiary cost sharing by $1.5 billion in 2021, had the savings been kept rather than redistributed.<F id="medpac" /></li>
            <li>In June 2023 MedPAC recommended that Congress more closely align payment rates across ambulatory settings for selected services that are safe and appropriate in every setting, where access is not at risk.<F id="medpac" /></li>
          </ul>
        </>
      }
      fix={
        <>
          <p>One rule, applied to every site: Medicare pays the same amount for the same service, regardless of who owns the building.</p>
          <ol className="plan">
            <li>
              <div>
                <h3>End the grandfather clause</h3>
                <p>Pay every hospital outpatient department, on campus or off, at the physician fee schedule rate for services that are routinely and safely performed in a physician’s office. The 2015 law already removed new off-campus clinics from the hospital rate. Medicare has equalized three services by rule at the excepted clinics: the clinic visit from 2019, drug administration in 2026 and imaging without contrast in 2027.<F id="g0463" /><F id="rules" /> Finish the job, in statute, for every service and every site.</p>
              </div>
            </li>
            <li>
              <div>
                <h3>Separate the clinic from the hospital on the claim</h3>
                <p>Require each off-campus department to bill under its own identifier and address, so that payers, employers and patients can see where care was delivered and what was charged for the site. Congress enacted this for Medicare in February 2026. From January 1, 2028, an off-campus department is paid only when it bills under its own identifier, separate from the hospital’s.<F id="caa" /> Extend the same identifier to commercial claims, as H.R. 3023 would, so employers can see the fee before they pay it.<F id="hr3023" /></p>
              </div>
            </li>
          </ol>
        </>
      }
    />
  );
}
