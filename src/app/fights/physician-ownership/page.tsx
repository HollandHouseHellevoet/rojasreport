import type { Metadata } from 'next';
import FightPage from '@/components/alliance/FightPage';
import { Compare, Fn, Steps } from '@/components/alliance/ui';
import { POH_COUNT } from '@/lib/fightFigures';
import { makeMetadata } from '@/lib/seo';

// Ported from the Alliance site (tafhc.com) in the November 2026 merge. The hospital count is the Alliance desk
// figure from src/data/poh/meta.json (Dutch, November 16, 2026), replacing the 240+ the Alliance site carried.
const JAMA = 'https://doi.org/10.1001/jamanetworkopen.2023.19980';
const sources = [
  { id: 'statute', text: '42 U.S.C. § 1395nn(i), added by section 6001 of the Patient Protection and Affordable Care Act (2010) and amended by section 10601 of that Act and section 1106 of the Health Care and Education Reconciliation Act of 2010; 42 C.F.R. § 411.362.', url: 'https://www.law.cornell.edu/uscode/text/42/1395nn' },
  { id: 'count', text: `Centers for Medicare & Medicaid Services, FY 2027 inpatient prospective payment system proposed rule, 91 Fed. Reg. 19312, 19668 (April 14, 2026), citing Blumenthal et al., BMJ 2015: "It is estimated that more than 250 acute care hospitals are owned, in part or fully, by physicians." The Alliance tracks 176 of them by name on its physician-owned hospital desk (as of ${POH_COUNT.asOf}).`, url: POH_COUNT.url },
  { id: 'referral', text: '42 C.F.R. § 411.354(d)(4); Centers for Medicare & Medicaid Services, final rule, 85 Fed. Reg. 77550 (Dec. 2, 2020).', url: 'https://www.law.cornell.edu/cfr/text/42/411.354' },
  { id: 'pai', text: 'Physicians Advocacy Institute and Avalere Health, Physician Employment Trends and Practice Acquisitions, 2018 to 2026, May 2026: 82.0 percent of physicians employed by hospitals or corporate entities as of January 1, 2026; 59.7 percent by hospitals and 22.3 percent by corporate entities; 63.9 percent of physician practices owned by them.', url: 'https://www.physiciansadvocacyinstitute.org/PAI-Research/PAI-Avalere-Health-Report-on-Physician-Employment-Trends-and-Practice-Acquisitions-2018-2026' },
  { id: 'sec', text: 'Tenet Healthcare Corporation, Form 8-K, June 16, 2015, Exhibit 99.1 (acquisition of 50.1 percent of United Surgical Partners International); Form 8-K, April 30, 2018, Exhibit 99.1 (ownership raised to 95 percent); Form 8-K, February 11, 2026, Exhibit 99.1 (533 ambulatory surgery centers at December 31, 2025).', url: 'https://www.sec.gov/Archives/edgar/data/70318/000119312515224695/d943349dex991.htm' },
  { id: 'medpac', text: 'Medicare Payment Advisory Commission, Report to the Congress: Physician-Owned Specialty Hospitals, March 2005.', url: 'https://www.medpac.gov/document/report-to-the-congress-physician-owned-specialty-hospitals/' },
  { id: 'msdrg', text: 'Centers for Medicare & Medicaid Services, fiscal year 2008 inpatient prospective payment system final rule, 72 Fed. Reg. 47130 (Aug. 22, 2007), adopting Medicare severity diagnosis-related groups.', url: 'https://www.federalregister.gov/documents/2007/08/22/07-3820/medicare-program-changes-to-the-hospital-inpatient-prospective-payment-systems-and-fiscal-year-2008' },
  { id: 'hhs2005', text: 'U.S. Department of Health and Human Services, Study of Physician-Owned Specialty Hospitals Required in Section 507(c)(2) of the Medicare Prescription Drug, Improvement, and Modernization Act of 2003, 2005.', url: 'https://www.cms.gov/files/document/rtcphysspechosppdf' },
  { id: 'oig', text: 'U.S. Department of Health and Human Services, Office of Inspector General, Physician-Owned Specialty Hospitals’ Ability to Manage Medical Emergencies, OEI-02-06-00310, January 2008.', url: 'https://oig.hhs.gov/oei/reports/oei-02-06-00310.pdf' },
  { id: 'medpac06', text: 'Medicare Payment Advisory Commission, Report to the Congress: Physician-Owned Specialty Hospitals Revisited, August 2006.', url: 'https://www.govinfo.gov/app/details/GOVPUB-Y3_M46_3-PURL-LPS78414' },
  { id: 'jama', text: 'JAMA Network Open, 2023;6(6):e2319980. Commercial negotiated and cash prices at 156 physician-owned hospitals and 1,116 other hospitals in 78 hospital referral regions, January 2023 price-transparency data.', url: JAMA },
  { id: 'hr4002', text: 'H.R. 4002, Patient Access to Higher Quality Health Care Act of 2025, 119th Congress.', url: 'https://www.congress.gov/bill/119th-congress/house-bill/4002' },
  { id: 'asc', text: '42 C.F.R. § 411.351 (definition of designated health services, excluding services paid under the ambulatory surgical center payment system); 42 C.F.R. § 1001.952(r) (ambulatory surgical center safe harbor).', url: 'https://www.law.cornell.edu/cfr/text/42/411.351' },
  { id: 'cms2026', text: 'Centers for Medicare & Medicaid Services, CY 2026 Hospital Outpatient Prospective Payment and Ambulatory Surgical Center Payment Systems final rule, CMS-1834-FC.', url: 'https://www.federalregister.gov/documents/2025/11/25/2025-20907' },
];
const fn = (id: string) => sources.findIndex((s) => s.id === id) + 1;
const F = ({ id }: { id: string }) => <Fn n={fn(id)} id={id} />;

export const metadata: Metadata = makeMetadata({
  title: 'Physician Ownership',
  description: 'Section 6001 shut new physician-owned hospitals out of Medicare in 2010. The Alliance is working to repeal it and to secure physician ownership of surgery centers, imaging centers and other facilities.',
  path: '/fights/physician-ownership/',
});

export default function Page() {
  return (
    <FightPage
      slug="physician-ownership"
      title="Physician Ownership"
      stake="Repeal Section 6001. Secure the right of physicians to own the hospital, the surgery center and the imaging center before the same rule reaches them."
      core={{ value: '33.7%', label: 'Lower median negotiated commercial prices at physician-owned hospitals for the same procedure in the same region', source: 'JAMA Network Open, 2023', url: JAMA }}
      takeaways={[
        'Section 6001 did not outlaw physician ownership. It closed Medicare to new physician-owned hospitals and froze the existing ones at their 2010 size, except by a capped federal exception.',
        'A physician may not own the hospital. Since 2021, under a Medicare rule, the hospital may require the physician it employs to refer patients to its own facilities.',
        'By January 1, 2026, 82.0 percent of physicians worked for hospitals or corporate entities. H.R. 4002 would repeal Section 6001 in full.',
      ]}
      numbers={[
        { value: '2010', label: 'The year Medicare closed to new physician-owned hospitals', source: '42 U.S.C. § 1395nn(i)', url: 'https://www.law.cornell.edu/uscode/text/42/1395nn' },
        { value: POH_COUNT.value, label: POH_COUNT.label, source: POH_COUNT.source, url: POH_COUNT.url },
        { value: '93%', label: 'Physician-owned specialty hospitals that met both Medicare staffing requirements on every day sampled', source: 'HHS Office of Inspector General, 2008', url: 'https://oig.hhs.gov/oei/reports/oei-02-06-00310.pdf' },
        { value: '32.7%', label: 'Lower median cash prices at physician-owned hospitals for the same procedure in the same region', source: 'JAMA Network Open, 2023', url: JAMA },
      ]}
      sources={sources}
      problem={
        <>
          <p><strong>Section 6001 did not outlaw physician ownership.</strong> It shut new physician-owned hospitals out of Medicare and froze the existing ones at their 2010 size, except by a capped federal exception.<F id="statute" /></p>
          <p>A hospital with physician owners may bill Medicare for the patients those owners refer only if it had physician ownership and a Medicare agreement in place by December 31, 2010.<F id="statute" /> For the hospitals that made the deadline, the statute set three limits:<F id="statute" /></p>
          <ul>
            <li>Physician ownership share, capped at its level on March 23, 2010, the day the law was signed.</li>
            <li>Operating rooms, procedure rooms and beds, capped at the count on that day.</li>
            <li>Growth only by asking the federal government for an exception, once every two years at most. The answer is not subject to administrative or judicial review.</li>
          </ul>
          <p>Since that deadline, no new physician-owned hospital has been able to bill Medicare for the patients its owners refer. Sixteen years later, CMS cites an estimate of more than 250 hospitals owned in part or in full by physicians.<F id="count" /> The Alliance tracks 176 of them by name, state by state, on its <a href="/poh/">physician-owned hospital desk</a>.</p>

          <h3>Where the money went</h3>
          <p><strong>The statute barred one financial relationship, ownership, and regulated the other, employment.</strong> A hospital may pay an employed physician on productivity. Since 2021, under a Medicare rule, it may also require that physician to refer patients to the hospital’s own facilities, subject to six conditions. In the preamble to that rule, CMS said a 90 percent directed-referral requirement “would not run afoul” of the rule.<F id="referral" /></p>
          <Compare
            a={{ value: '0%', label: 'The share of a hospital opened after the 2010 deadline that a physician may own while referring Medicare patients to it.' }}
            b={{ value: '90%', label: 'A directed-referral requirement an employer may write into a physician’s contract, subject to six conditions.' }}
            caption="A physician may not own the hospital. The hospital may direct the physician’s referrals."
            source="42 U.S.C. § 1395nn(i); 42 C.F.R. § 411.354(d)(4); 85 Fed. Reg. 77550 (2020)"
            url="https://www.law.cornell.edu/cfr/text/42/411.354"
          />
          <p><strong>Capital followed the rule.</strong> Hospital systems bought the practices, and the referrals came with them. By January 1, 2026:<F id="pai" /></p>
          <ul>
            <li>82.0 percent of physicians were employed by a hospital or a corporate entity.</li>
            <li>59.7 percent were employed by hospitals, 22.3 percent by corporate entities.</li>
            <li>63.9 percent of physician practices were owned by one or the other.</li>
          </ul>
          <p>The ambulatory surgery center (ASC), the facility physicians still own, is being consolidated as well. A hospital company acquired 50.1 percent of the country’s largest ASC platform in 2015 and held 95 percent of it by 2018. That platform held 533 surgery centers at the end of 2025.<F id="sec" /></p>

          <h3>What the record said before the vote</h3>
          <p><strong>Congress had the evidence before it voted.</strong> The record, in order:</p>
          <Steps label="The record, 2005 to 2010" items={[
            { when: 'March 2005', title: 'MedPAC: “too severe a remedy”', text: 'Fix the mispriced payment groups, allow gainsharing, extend the moratorium briefly.' },
            { when: 'August 2006', title: 'MedPAC looks again', text: 'More cardiac surgeries per 1,000 beneficiaries in those markets. Higher Medicare cost per discharge at orthopedic and surgical ones.' },
            { when: 'August 2007', title: 'CMS adopts severity-refined payment groups', text: 'The payment fix MedPAC asked for, in the rule for fiscal 2008.' },
            { when: 'January 2008', title: 'Inspector General: 93 percent met staffing rules', text: 'On every day sampled. Four recommendations, all on conduct and enforcement. None on ownership.' },
            { when: 'March 2010', title: 'Congress: Section 6001', text: 'Ownership and capacity capped, growth by exception only. Medicare closed to hospitals that missed the December 31, 2010 deadline.' },
          ]} />
          <blockquote>
            <p>“too severe a remedy”</p>
            <cite>The Medicare Payment Advisory Commission on removing the whole-hospital exception, Report to the Congress, March 2005<F id="medpac" /></cite>
          </blockquote>
          <p>MedPAC told Congress that removing the exception would be too severe a remedy. It traced the profit incentive to mispriced payment categories and recommended severity-adjusted payment, gainsharing and a short extension of the moratorium then in force.<F id="medpac" /> Medicare adopted severity-adjusted payment categories in fiscal year 2008.<F id="msdrg" /> In 2005 the Department of Health and Human Services found quality at physician-owned specialty hospitals comparable and patient satisfaction very high.<F id="hhs2005" /> In 2008 the HHS Inspector General studied 109 physician-owned specialty hospitals. It found that 93 percent met both staffing requirements on every day sampled.<F id="oig" /></p>
          <p><strong>The record is twenty years old, and it is not one-sided.</strong> The Inspector General had no comparison group of other hospitals, and said so.<F id="oig" /> In 2006 the Commission found more cardiac surgeries per 1,000 beneficiaries in markets with physician-owned hospitals, and higher Medicare cost per discharge at orthopedic and surgical ones.<F id="medpac06" /> The Alliance does not argue that physician-owned hospitals cost Medicare less per case. It argues that the remedy for a payment problem is a payment fix, which Medicare adopted, and that the competition evidence since then runs the other way.</p>

          <h3>What the prices say now</h3>
          <p><strong>Same procedure, same region, lower price.</strong> Median commercial prices at physician-owned hospitals are 33.7 percent lower and cash prices 32.7 percent lower than at other hospitals. The researchers expected the opposite.<F id="jama" /></p>
        </>
      }
      fix={
        <>
          <p>Two changes in federal law. The first undoes 2010. The second stops it from happening again.</p>
          <ol className="plan">
            <li>
              <div>
                <h3>Repeal Section 6001</h3>
                <p>Strike 42 U.S.C. § 1395nn(i) and restore the whole-hospital exception as it stood before March 23, 2010. H.R. 4002, the Patient Access to Higher Quality Health Care Act of 2025, is the full-repeal bill.<F id="hr4002" /> A physician-owned hospital would bill Medicare on the same terms as every other hospital, and the capacity freeze would end.</p>
              </div>
            </li>
            <li>
              <div>
                <h3>Write physician ownership of outpatient facilities into statute</h3>
                <p>Physician ownership of an ASC rests on two regulations: a Medicare rule that leaves ASC services off the self-referral list, and an anti-kickback safe harbor for ASC ownership.<F id="asc" /> Either agency can narrow its rule without a vote of Congress. No bill has been filed to do so, and the regulatory path is open. Medicare added 560 procedures to the list it pays for in an ASC for 2026 alone.<F id="cms2026" /> The Alliance is asking Congress to put physician ownership of surgery centers in statute, beyond the reach of a rulemaking, and to extend the same protection to imaging and radiology centers and the other outpatient facilities physicians build.</p>
              </div>
            </li>
          </ol>
        </>
      }
    />
  );
}
