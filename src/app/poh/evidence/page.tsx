import type { Metadata } from 'next';
import Link from 'next/link';
import { POH_BASE } from '@/lib/poh';
import { wrap, eyebrow, Crumbs } from '@/components/poh/ui';

/**
 * /poh/evidence/: the studies and the payer record on physician-owned hospitals. Every finding was
 * checked against the paper or filing in November 2026; findings that could not be confirmed were dropped.
 */

export const metadata: Metadata = {
  title: 'The evidence on physician-owned hospitals | Physician-Owned',
  description: 'Prices, quality and Medicare costs at physician-owned hospitals: what the peer-reviewed studies and the insurers found.',
  alternates: { canonical: `https://rojasreport.com${POH_BASE}/evidence/` },
};

interface Finding {
  kicker: string;
  figure?: string;
  figureLabel?: string;
  title: string;
  body: string[];
  source: string;
  href: string;
}

const FINDINGS: Finding[] = [
  {
    kicker: 'Prices',
    figure: '33.7%',
    figureLabel: 'lower median commercial price for the same procedure in the same region',
    title: 'Physician-owned hospitals charge commercial insurers less.',
    body: [
      'The study compared 156 physician-owned hospitals with 1,116 other hospitals in 78 regions, using January 2023 price-transparency data.',
      'For the same procedure in the same hospital referral region, median negotiated prices were 33.7% lower at physician-owned hospitals. In a hospital-plan model, physician ownership went with 17.5% lower prices.',
    ],
    source: 'Wang Y, Plummer E, Wang Y, Cram P, Bai G. JAMA Network Open 2023;6(6):e2319980',
    href: 'https://doi.org/10.1001/jamanetworkopen.2023.19980',
  },
  {
    kicker: 'Quality',
    figure: '219',
    figureLabel: 'physician-owned hospitals studied',
    title: 'Quality and patient experience on par.',
    body: [
      'A 2015 BMJ study found physician-owned and other hospitals performed similarly on patient experience, quality, costs and payments.',
      'It found they "may treat slightly healthier patients."',
      'But they "do not seem to systematically select more profitable or less disadvantaged patients or to provide lower value care."',
    ],
    source: 'Blumenthal DM, Orav EJ, Jena AB, Dudzinski DM, Le ST, Jha AK. BMJ 2015;351:h4466',
    href: 'https://doi.org/10.1136/bmj.h4466',
  },
  {
    kicker: 'Medicare value',
    figure: '64.4',
    figureLabel: 'total performance score, above the all-hospital mean',
    title: 'Surgical hospitals scored higher on Medicare value-based purchasing.',
    body: ["Physician-owned surgical hospitals scored higher than other hospitals on Medicare's 2015 value-based purchasing total performance score."],
    source: 'Ramirez AG et al. Journal of the American College of Surgeons 2016;223(4):559-67',
    href: 'https://doi.org/10.1016/j.jamcollsurg.2016.07.014',
  },
  {
    kicker: 'Outcomes',
    title: 'Shorter stays and fewer complications in orthopedics.',
    body: [
      'A 2021 systematic review found orthopedic patients at physician-owned hospitals "experienced shorter stays and lower risk-adjusted complication rates."',
      'It found orthopedic and cardiac physician-owned hospitals "offered consumers comparable or lower costs and higher quality care compared to other hospitals."',
    ],
    source: 'Cho, Meshnick, Ehrenfeld and Miller, Cost and Quality of Care in Physician-Owned Hospitals: A Systematic Review, Mercatus Center at George Mason University, September 7, 2021',
    href: 'https://mercatus.org/publications/healthcare/cost-and-quality-care-physician-owned-hospitals-systematic-review',
  },
  {
    kicker: 'Medicare spending',
    figure: '$1.1B',
    figureLabel: 'less Medicare spending in 2019, estimated',
    title: 'What Medicare would have saved.',
    body: [
      'A 2023 analysis estimated Medicare would have paid $1.1 billion less in 2019 if 20 high-cost inpatient procedures had been done at physician-owned hospitals.',
      'The Physicians Advocacy Institute and the Physicians Foundation commissioned it from researchers at UConn Health.',
    ],
    source: 'Physicians Advocacy Institute, Physician Owned Hospital Cost Savings Analysis, October 19, 2023',
    href: 'https://www.physiciansadvocacyinstitute.org/PAI-Research/Physician-Owned-Hospital-Cost-Savings-Analysis',
  },
  {
    kicker: 'The insurers',
    figure: '118M',
    figureLabel: 'members covered by the 33 Blue Cross Blue Shield companies',
    title: 'The Blues asked for exceptions.',
    body: [
      "In May 2025 the Blue Cross Blue Shield Association wrote to the Justice Department's Anticompetitive Regulations Task Force.",
      '"Congress should consider exceptions to restrictions on physician-owned hospitals (POHs) when the goal is to improve competition and patient choice."',
      'Its examples: community and general hospitals but not surgical-specialty ones, hospitals in underserved regions, and hospitals in highly concentrated markets.',
    ],
    source: 'Blue Cross Blue Shield Association, comment to the DOJ Antitrust Division Anticompetitive Regulations Task Force, docket ATR-2025-0001-0328, May 27, 2025, Recommendation #5; membership: bcbs.com, The Blue Cross and Blue Shield System',
    href: 'https://downloads.regulations.gov/ATR-2025-0001-0328/attachment_1.pdf',
  },
];

export default function Evidence() {
  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-12`}>
        <Crumbs items={[{ label: 'Home', href: '/' }, { label: 'Physician-Owned', href: '/physician-owned/' }, { label: 'Physician-owned hospitals', href: `${POH_BASE}/` }, { label: 'The evidence' }]} />
        <p className={`${eyebrow} text-oxblood mb-4`}>Physician-owned hospitals · The evidence</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em] max-w-[1000px]" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>Lower prices. Same quality.</h1>
        <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">
          What peer-reviewed studies and the largest insurer association found about physician-owned hospitals. Each finding links to the paper or the filing.
        </p>
      </section>

      <section className="pb-20 md:pb-[104px]">
        <div className={`${wrap} grid gap-6 grid-cols-1 md:grid-cols-2`}>
          {FINDINGS.map((f) => (
            <article key={f.kicker} className="bg-paper-2 border-t-2 border-ink p-7 md:p-8 flex flex-col gap-4">
              <p className={`${eyebrow} text-oxblood`}>{f.kicker}</p>
              {f.figure && (
                <div>
                  <div className="font-tight font-extrabold text-[48px] md:text-[60px] leading-none tracking-[-0.04em]">{f.figure}</div>
                  <div className="mt-2 text-[15px] font-semibold">{f.figureLabel}</div>
                </div>
              )}
              <h2 className="font-tight font-bold text-[24px] leading-[1.15] tracking-[-0.02em]">{f.title}</h2>
              {f.body.map((p) => (
                <p key={p} className="text-[17px] leading-[1.55]">{p}</p>
              ))}
              <p className="mt-auto pt-2 text-[14px] leading-[1.55] border-t border-hairline">
                <span className="font-semibold">Source: </span>
                <a href={f.href} className="underline underline-offset-[3px] decoration-hairline hover:text-oxblood break-words">{f.source}</a>
              </p>
            </article>
          ))}
        </div>
        <div className={wrap}>
          <p className="mt-10 text-[15px]">
            <Link href={`${POH_BASE}/investigation/`} className="font-tight font-semibold border-b-[1.5px] border-current pb-0.5 hover:text-oxblood">How the ban came to be →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
