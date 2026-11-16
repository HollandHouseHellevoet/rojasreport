import type { Metadata } from 'next';
import Link from 'next/link';
import { Arrow, Band, Hero, SectionHead, Stat, StatBand, btnInk, textlink } from '@/components/alliance/ui';
import FaqList, { faqJsonLd } from '@/components/alliance/FaqList';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import membership from '@/data/alliance/membership.json';
import { JOIN } from '@/lib/nav';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'For Independent Physicians',
  description: 'Independent physicians have lost ground for 25 years. The Alliance for Healthcare Competition is the organization built to fight back for them: lobbying on three federal fights, data and progress reports, and a seat in the fight. Join for $50 a month or $600 a year.',
  path: '/physicians/',
});

const level = membership.levels[0];
const council = membership.levels[1];
const faqs = [
  { q: 'What do my dues fund?', a: '<p>Lobbying on the three fights: site-neutral payment, 340B reform and physician ownership. That means the staff and counsel who draft, the data work behind every report, and the briefings that put those reports in front of committee staff. Members receive every report and a dated progress report each quarter.</p>' },
  { q: 'Are dues tax deductible?', a: `<p>Dues to a 501(c)(6) are not charitable contributions. The portion of dues attributable to lobbying is not deductible as a business expense under IRC §162(e). The Alliance estimates that ${membership.deductibleShare} of dues are deductible as a business expense, and it reports the exact share to members each year as IRC §6033(e) requires.</p>` },
  { q: 'Monthly or annual?', a: `<p>Either. ${level.monthly} a month or ${level.annual} a year, billed by Stripe. Cancel anytime; your membership remains active through the end of your current billing period.</p>` },
  { q: 'Who can join?', a: '<p>Physicians in independent practice, in any specialty and any state. Employed physicians who support the fights are welcome too. Membership is counted toward the goal of 200,000 independent physicians.</p>' },
  { q: 'What is the Council?', a: `<p>One hundred physicians, by invitation, at ${council.monthly} a month or ${council.annual} a year. Council members set the Alliance’s priorities each year and are briefed by the research arm before publication. The <a href="/physicians/council/">Council page</a> says how invitations work.</p>` },
  { q: 'Does the Alliance publish my name?', a: '<p>No. The Alliance publishes no member list. It reports membership to lawmakers only in aggregate, by specialty and state.</p>' },
  { q: 'Is the Alliance partisan?', a: '<p>No. It is pro-competition and works with members of both parties.</p>' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={[breadcrumbsJsonLd([{ name: 'For Physicians', path: '/physicians/' }]), faqJsonLd(faqs)]} />
      <Hero eyebrow="For independent physicians" title="Twenty-five years of losing ground. One organization built to fight back." text="Paid less than the hospital down the street for the same visit. Shut out of Medicare if you build the hospital that competes with it. Watching $100 billion in drugs move at 340B prices while the discount never reaches your patients. This is the trade association for the physicians who stayed independent." primary={JOIN} secondary={{ label: 'What membership does', href: '#what' }} />

      <StatBand eyebrow="The stakes, in the record">
        <Stat dark value="2010" label="The year Medicare closed to new physician-owned hospitals" source="42 U.S.C. § 1395nn(i)" url="https://www.law.cornell.edu/uscode/text/42/1395nn" />
        <Stat dark value="$100.0B" label="Drugs bought at 340B prices in 2025, with no requirement that the discount reach a patient" source="HRSA, 2025; GAO-26-108784" url="https://www.hrsa.gov/opa/updates/2025-340b-covered-entity-purchases" />
        <Stat dark value="33.7%" label="Lower median negotiated commercial prices at physician-owned hospitals for the same procedure in the same region" source="JAMA Network Open, 2023" url="https://doi.org/10.1001/jamanetworkopen.2023.19980" />
      </StatBand>

      <Band id="what" label="What membership does">
        <SectionHead eyebrow="What membership does" title="Three things, and nothing else." text="The Alliance does not run conferences, sell insurance or publish a journal. Dues go to the fights and keep the research free." />
        <ol className="grid gap-8 lg:grid-cols-3 list-none m-0 p-0">
          {level.benefits.map((b, i) => (
            <li key={b} className="flex flex-col gap-3.5 pt-5 border-t-2 border-ink">
              <span className="num text-[14px] tracking-[0.08em]" aria-hidden="true">0{i + 1}</span>
              <p className="font-tight font-semibold text-[19px] leading-[1.3] tracking-[-0.01em]">{b}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center gap-5 mt-12 text-[15px]">
          <Link href={JOIN.href} className={btnInk}>{JOIN.label}</Link>
          <span>Dues <strong className="font-tight">{level.monthly} a month</strong> or <strong className="font-tight">{level.annual} a year</strong>. Cancel anytime.</span>
        </div>
      </Band>

      <Band mist id="council" label="The Council">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">The Council</p>
            <h2 className="font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[44px]">One hundred physicians who set the agenda.</h2>
            <p className="text-[17px] leading-[1.55] max-w-[60ch]">{council.open} {council.monthly} a month or {council.annual} a year. Council members set the Alliance’s priorities each year and hear from the research arm before anything is published.</p>
            <Link href="/physicians/council/" className={`${textlink} self-start text-ink hover:text-oxblood`}>About the Council <Arrow /></Link>
          </div>
        </div>
      </Band>

      <Band id="proof" label="Proof">
        <SectionHead eyebrow="Proof" title="What members get to read." text="Every report carries its sources. Every quarter ends with a dated progress report. The published pieces are on the Insights page, and the research behind them is free to every reader." link={{ label: 'Read the insights', href: '/insights/' }} />
      </Band>

      <Band mist id="faq" label="Frequently asked questions">
        <SectionHead eyebrow="FAQ" title="Before you join." />
        <div className="grid grid-cols-12"><div className="col-span-12 lg:col-span-8"><FaqList items={faqs} /></div></div>
      </Band>

      <JoinBand />
    </>
  );
}
