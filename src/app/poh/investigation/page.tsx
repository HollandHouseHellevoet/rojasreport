import type { Metadata } from 'next';
import Link from 'next/link';
import { POH_BASE, pohMeta } from '@/lib/poh';
import { wrap, eyebrow, h2, Crumbs } from '@/components/poh/ui';

/**
 * /poh/investigation/: Section 6001, who pushed it, and where it stands. Every claim was checked
 * against a primary record in November 2026; claims that could not be confirmed were dropped.
 */

export const metadata: Metadata = {
  title: 'Section 6001: the ban on physician-owned hospitals | Physician-Owned',
  description: 'What Section 6001 of the Affordable Care Act does, who lobbied for it, what happened to the hospitals it froze, and the bills and rules that could change it.',
  alternates: { canonical: `https://rojasreport.com${POH_BASE}/investigation/` },
};

type Src = { label: string; href: string };

function Section({ n, title, children, sources }: { n: string; title: string; children: React.ReactNode; sources: Src[] }) {
  return (
    <section className="py-14 md:py-16 border-t border-hairline">
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <p className={`${eyebrow} text-oxblood mb-3`}>{n}</p>
          <h2 className={h2}>{title}</h2>
        </div>
        <div className="text-[18px] leading-[1.6] max-w-[760px] [&_p+p]:mt-4">
          {children}
          <ul className="mt-6 text-[14px] leading-[1.6] border-t border-hairline pt-4">
            {sources.map((s) => (
              <li key={s.href + s.label}>
                <span className="font-semibold">Source: </span>
                <a href={s.href} className="underline underline-offset-[3px] decoration-hairline hover:text-oxblood break-words">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const STATUTE: Src = { label: '42 U.S.C. 1395nn(i) (Social Security Act section 1877(i)), added by Pub. L. 111-148, section 6001, as amended', href: 'https://www.law.cornell.edu/uscode/text/42/1395nn' };

export default function Investigation() {
  const by = pohMeta.byStatus as Record<string, number>;
  const operating = by['Physician-owned'] + by['Joint venture'];
  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-12`}>
        <Crumbs items={[{ label: 'Home', href: '/' }, { label: 'Physician-Owned', href: '/physician-owned/' }, { label: 'Physician-owned hospitals', href: `${POH_BASE}/` }, { label: 'The investigation' }]} />
        <p className={`${eyebrow} text-oxblood mb-4`}>Physician-owned hospitals · The investigation</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em] max-w-[1000px]" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>Section 6001.</h1>
        <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">
          One provision of the Affordable Care Act closed Medicare to new physician-owned hospitals. It has no end date. This is what it does, who asked for it, and where it stands.
        </p>
      </section>

      <div className={wrap}>
        <Section n="01 · The ban" title="What the law does." sources={[{ label: 'Congress.gov, H.R. 3590 (111th Congress), signed into law as Pub. L. 111-148 on March 23, 2010', href: 'https://www.congress.gov/bill/111th-congress/house-bill/3590' }, STATUTE, { label: '42 U.S.C. 1396b(s) (applies the referral bar to Medicaid)', href: 'https://www.law.cornell.edu/uscode/text/42/1396b' }]}>
          <p>Section 6001 became law on March 23, 2010, as part of the Affordable Care Act.</p>
          <p>A hospital needed physician owners and a Medicare provider agreement in effect by December 31, 2010. Any hospital that missed the date cannot bill Medicare for patients its physician owners refer. The same bar reaches Medicaid.</p>
          <p>Hospitals that made the date are frozen. They keep the operating rooms, procedure rooms and beds licensed on March 23, 2010.</p>
          <p>They can grow only through a federal exception. A hospital may apply once every two years, up to 200 percent of its 2010 baseline, on its main campus. No exception lets a new physician-owned hospital qualify.</p>
          <p>The statute sets no date to revisit the ban. It also bars administrative or judicial review of the expansion exception process.</p>
        </Section>

        <Section
          n="02 · Who asked for it"
          title="The hospital lobby."
          sources={[
            { label: 'Federation of American Hospitals, Lobbying Disclosure Act report, fourth quarter 2009', href: 'https://lda.gov/filings/public/filing/d19f15b9-d045-4eb4-bee8-290a542e6f2b/print/' },
            { label: 'Federation of American Hospitals, statement of October 20, 2023', href: 'https://fah.org/blog/fah-leader-comments-on-ma-abuses-lifting-ban-on-pohs-after-hearing/' },
            { label: 'Federation of American Hospitals, About FAH', href: 'https://www.fah.org/about-fah/' },
          ]}
        >
          <p>
            The Federation of American Hospitals lobbied for the ban. Its lobbying report for the fourth quarter of 2009 lists &ldquo;Ban on Self-Referral to Physician-Owned Hospitals.&rdquo;
          </p>
          <p>
            The report describes it as a &ldquo;Provision that will prospectively ban the practice of physicians referring patients to hospitals that are owned by the physician.&rdquo;
          </p>
          <p>
            The FAH calls itself &ldquo;the national representative of more than 1,000 tax-paying community hospitals and health systems.&rdquo; In 2023 it still said physician-owned hospitals &ldquo;cherry-pick healthy and wealthy patients and provide limited emergency services.&rdquo;
          </p>
          <p>
            <Link href="/fah/" className="font-tight font-semibold border-b-[1.5px] border-current pb-0.5 hover:text-oxblood">The FAH desk →</Link>
          </p>
        </Section>

        <Section
          n="03 · The case against them"
          title="What the studies found."
          sources={[
            { label: 'Blumenthal DM et al., Access, quality, and costs of care at physician owned hospitals in the United States, BMJ 2015;351:h4466', href: 'https://doi.org/10.1136/bmj.h4466' },
            { label: 'Wang Y et al., JAMA Network Open 2023;6(6):e2319980', href: 'https://doi.org/10.1001/jamanetworkopen.2023.19980' },
          ]}
        >
          <p>
            The ban rested on a claim that physician owners pick the easy, profitable patients. A 2015 BMJ study of 219 physician-owned hospitals tested it.
          </p>
          <p>
            It found they &ldquo;may treat slightly healthier patients.&rdquo; But they &ldquo;do not seem to systematically select more profitable or less disadvantaged patients or to provide lower value care.&rdquo;
          </p>
          <p>
            A 2023 study in JAMA Network Open found lower commercial prices at physician-owned hospitals than at other hospitals in the same region.
          </p>
          <p>
            <Link href={`${POH_BASE}/evidence/`} className="font-tight font-semibold border-b-[1.5px] border-current pb-0.5 hover:text-oxblood">All the evidence →</Link>
          </p>
        </Section>

        <Section
          n="04 · What happened to them"
          title={`${by['Physician-owned']} left on their own.`}
          sources={[
            { label: 'Cole CM, Physician-owned hospitals and self-referral, Virtual Mentor (AMA Journal of Ethics) 2013;15(2):150-155', href: 'https://doi.org/10.1001/virtualmentor.2013.15.2.hlaw1-1302' },
            { label: `Rojas Report physician-owned hospital list, ${pohMeta.tracked} hospitals re-checked in November 2026, one source per hospital`, href: `${POH_BASE}/hospitals/` },
          ]}
        >
          <p>By 2010, about 265 U.S. hospitals were owned in whole or in part by physicians.</p>
          <p>
            The Rojas Report list tracks {pohMeta.tracked} of them, each re-checked in November 2026. {operating} still operate with physician owners. Only {by['Physician-owned']} have no hospital system, corporate chain or outside investor among their owners.
          </p>
          <p>
            {by['Joint venture']} are joint ventures, where a system, chain or outside investor holds 5 percent or more. {by['Sold or acquired']} were sold outright. {by['Closed']} closed.
          </p>
          <p>The survivors cannot add beds or operating rooms past their 2010 count without the federal exception.</p>
          <p>
            <Link href={`${POH_BASE}/hospitals/`} className="font-tight font-semibold border-b-[1.5px] border-current pb-0.5 hover:text-oxblood">Every hospital, with its source →</Link>
          </p>
        </Section>

        <Section
          n="05 · Where it stands"
          title="Bills in Congress, a door at CMS."
          sources={[
            { label: 'Congress.gov, H.R. 4002, Patient Access to Higher Quality Health Care Act of 2025 (119th Congress)', href: 'https://www.congress.gov/bill/119th-congress/house-bill/4002' },
            { label: 'Congress.gov, H.R. 2191, Physician Led and Rural Access to Quality Care Act (119th Congress)', href: 'https://www.congress.gov/bill/119th-congress/house-bill/2191' },
            { label: 'Congress.gov, S. 1390 (119th Congress)', href: 'https://www.congress.gov/bill/119th-congress/senate-bill/1390' },
            { label: 'CMS, FY 2027 IPPS proposed rule, 91 Fed. Reg. 19312, 19668 (April 14, 2026)', href: 'https://www.federalregister.gov/d/2026-07203' },
            { label: 'CMS, FY 2027 IPPS final rule, 91 Fed. Reg. 49570, 50104 and 50107 (August 4, 2026)', href: 'https://www.federalregister.gov/d/2026-15833' },
          ]}
        >
          <p>
            H.R. 4002 would repeal the Section 6001 limits outright. Rep. Beth Van Duyne of Texas introduced it on June 12, 2025. It has 12 cosponsors and no Senate companion.
          </p>
          <p>
            H.R. 2191, from Rep. Morgan Griffith of Virginia, is narrower. It would allow new physician-owned hospitals in rural areas more than 35 miles from another hospital, and lift the expansion cap. Sen. James Lankford of Oklahoma filed the Senate version, S. 1390.
          </p>
          <p>Neither chamber has held a hearing, markup or vote on any of the three bills as of November 2026.</p>
          <p>
            CMS opened a door in April 2026. Its proposed inpatient rule asked whether physician-owned hospitals could join its TEAM payment model. It estimated &ldquo;more than 250 acute care hospitals are owned, in part or fully, by physicians.&rdquo;
          </p>
          <p>
            The August final rule set no policy. CMS said it intends to propose one, adding that more physician-owned hospitals in TEAM &ldquo;will promote greater choice and competition.&rdquo;
          </p>
        </Section>

        <Section
          n="06 · A new one anyway"
          title="ReCenter, Baton Rouge."
          sources={[
            { label: 'ReCenter Hospital, About', href: 'https://recenterhospital.com/about-us/' },
            { label: 'Baton Rouge Business Report, July 24, 2025', href: 'https://www.businessreport.com/article/hospital-specializing-in-surgical-care-for-breast-cancer-opens-in-baton-rouge' },
          ]}
        >
          <p>
            ReCenter Hospital opened in Baton Rouge in May 2025. It calls itself &ldquo;a physician-owned acute-care breast cancer hospital licensed with the Louisiana Department of Health.&rdquo;
          </p>
          <p>Surgeons Luke Cusimano III and Taylor Theunissen founded it with surgical breast oncologist Everett Bonner. It has 10 inpatient rooms and 4 operating rooms.</p>
        </Section>
      </div>
      <div className="pb-16" />
    </>
  );
}
