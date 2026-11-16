import type { Metadata } from 'next';
import Link from 'next/link';
import cover from '@/data/home/cover.json';
import membership from '@/data/alliance/membership.json';
import { getAllStates } from '@/lib/data';
import { buildSearchIndex } from '@/lib/searchIndex';
import { FIGHT_TILES } from '@/lib/fightFigures';
import { getFight, tracker, trackerAsOf } from '@/lib/fights';
import { insights } from '@/lib/insights';
import { stateDossiers } from '@/lib/stateDossiers';
import { GOAL_PHYSICIANS } from '@/lib/site';
import { JOIN } from '@/lib/nav';
import { makeMetadata } from '@/lib/seo';
import Search from '@/components/home/Search';
import StateTileMap from '@/components/home/StateTileMap';
import JoinBand from '@/components/JoinBand';
import TaxNotice from '@/components/TaxNotice';
import { Arrow, Band, InsightCard, SectionHead, Smart, Stat, btnPrimary, eyebrow, fmtDate, lede, textlink, wrap } from '@/components/alliance/ui';

/**
 * Home page (MERGER_PLAN.md, section 3.6): the three fights with their tracker stage, what the Alliance knows,
 * why join at $50 a month, who stands with the Alliance, insights, how we win. Every figure comes from a data file
 * or a sourced constant.
 */
export const metadata: Metadata = makeMetadata({
  title: 'The Alliance for Healthcare Competition',
  description: 'The free-market trade association for American healthcare. Independent physicians, employers, payers and manufacturers united to end hospital monopoly pricing: site-neutral payment, 340B reform and physician ownership.',
  path: '/',
});

const level = membership.levels[0];
const pillars = [
  { t: 'Unite the parties who pay for care behind independent physicians', p: 'Employers, payers and manufacturers pay the bill or sell the drug. Independent physicians compete with the hospital under price rules written for the hospital. The Alliance puts them in the same room with the same ask.' },
  { t: 'Put data in front of lawmakers', p: 'Committee staff act on figures they can cite. Every Alliance report carries its sources, and every member of Congress hears the same numbers from a physician in the district and an employer in the state.' },
  { t: 'Run all three fights at once', p: 'Three rules with one effect: a hospital system that faces no competitor sets the price. The Alliance moves all three in the same Congress.' },
];
const partners = [
  { h: 'Employers', p: 'Self-funded employers pay the hospital bill as priced.' },
  { h: 'Payers and manufacturers', p: 'Hospital rates for office-level care, and a drug discount that stops short of the patient.' },
  { h: 'Physician-owned hospitals, REITs and ASC developers', p: 'The owners and builders of physician-led facilities.' },
  { h: 'Medical societies', p: 'A society keeps its voice and adds a lobbying operation on the three rules its members name first.' },
];

export default function HomePage() {
  const index = buildSearchIndex();
  const conSlugs = Object.fromEntries(getAllStates().map((s) => [s.abbreviation, s.slug]));
  const latest = [...tracker].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const latestInsights = insights.slice(0, 3);

  return (
    <>
      <Search index={index} />

      {/* 1. Competition is the cure: the three fights with their tracker stage */}
      <section className="pt-14 md:pt-[96px] pb-12 md:pb-16">
        <div className={wrap}>
          <p className={`${eyebrow} mb-5`}>The Alliance for Healthcare Competition</p>
          <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.0] text-[48px] md:text-[80px] lg:text-[96px] max-w-[14ch]">Competition is the cure.</h1>
          <p className={`${lede} mt-6 max-w-[60ch]`}>
            Three federal rules let a consolidated hospital system set prices without a competitor. The Alliance unites independent physicians with the parties who pay for care to change all three, in the same Congress.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href={JOIN.href} className={btnPrimary}>{JOIN.label} <Arrow size={16} /></Link>
            <Link href="/fights/" className="inline-flex items-center gap-2.5 min-h-[48px] px-[22px] border-[1.5px] border-ink font-tight font-semibold text-[15px] leading-none hover:bg-paper-2">The three fights</Link>
          </div>
        </div>
      </section>
      <Band tight label="The three fights">
        <div className="grid gap-6 md:grid-cols-3">
          {FIGHT_TILES.map((t) => {
            const f = getFight(t.slug);
            return (
              <article key={t.slug} className="bg-mist p-7 flex flex-col gap-6 h-full">
                <Stat value={t.value} label={t.label} source={t.source} url={t.url} size="sm" />
                <div className="flex flex-col gap-2.5 flex-1">
                  <h2 className="font-tight font-bold text-[22px] leading-[1.15] tracking-[-0.02em]"><Link href={t.href} className="hover:underline">{t.title}</Link></h2>
                  <p className="text-[16px] leading-[1.55]">{t.stake}</p>
                </div>
                <p className="text-[14px] leading-[1.45] pt-4 border-t border-hairline">
                  <span className="font-tight font-semibold uppercase tracking-[0.1em] text-[12px]">In Congress</span><br />
                  <span className="font-semibold">{f.stage}</span> · {f.vehicle}
                </p>
                <Link href={t.href} className={`${textlink} self-start`}>The fight<span className="sr-only">: {t.title}</span> <Arrow /></Link>
              </article>
            );
          })}
        </div>
        <p className="text-[14px] mt-8">Tracker as of {fmtDate(trackerAsOf)}. <Link href="/tracker/" className="underline underline-offset-[3px] hover:text-oxblood">Every bill, rule and court case</Link>.</p>
      </Band>

      {/* 2. What the Alliance knows */}
      <Band dark label="What the Alliance knows">
        <SectionHead dark eyebrow="What the Alliance knows" title="The hospital lobby’s own filings, read and dated." text="The research arm publishes dossiers on the systems, the states, the committees and the lobby. Every figure is sourced to a public filing." link={{ label: 'All the research', href: '/research/' }} />
        <div className="grid gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Stat dark value="$25.47M" label="Federal lobbying the American Hospital Association reported for 2025" source="Senate Lobbying Disclosure Act filings, 2025" url="https://lda.senate.gov/" />
            <Smart href="/aha/" className={`${textlink} text-paper self-start`}>The AHA dossiers <Arrow /></Smart>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <p className={`${eyebrow} text-ink-text`}>Newest dossier · {cover.date}</p>
            <h3 className="font-tight font-extrabold text-[26px] md:text-[30px] leading-[1.05] tracking-[-0.03em]">{cover.headline}.</h3>
            <p className="text-[15px] leading-[1.55] text-ink-text-2">{cover.dek}</p>
            <Smart href={cover.href} className={`${textlink} text-paper self-start`}>{cover.cta} <Arrow /></Smart>
            <p className={`${eyebrow} text-ink-text mt-4`}>Tracker · latest changes</p>
            <ol className="list-none m-0 p-0">
              {latest.map((r) => (
                <li key={r.id} className="py-3 border-t border-rule-dark grid gap-0.5">
                  <span className="text-[12px] text-ink-text">{fmtDate(r.date)} · {r.stage}</span>
                  <Link href={r.href ?? (r.fight === 'research' ? '/tracker/' : `/fights/${r.fight}/`)} className="font-tight font-semibold text-[16px] leading-[1.3] hover:underline">{r.issue}</Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
            <p className={`${eyebrow} text-ink-text`}>The states</p>
            <StateTileMap conSlugs={conSlugs} onDark />
            <p className="text-[14px] leading-[1.5] text-ink-text-2">{getAllStates().length} certificate-of-need dossiers. {stateDossiers.length} state graded on all six cost drivers so far; the rest follow as each dossier publishes.</p>
            <Link href="/states/" className={`${textlink} text-paper self-start`}>Pick a state <Arrow /></Link>
          </div>
        </div>
      </Band>

      {/* 3. Why join at $50 a month */}
      <Band id="join" label="Why join">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <p className={eyebrow}>For independent physicians</p>
            <h2 className="font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[34px] md:text-[52px]">{level.monthly} a month. {GOAL_PHYSICIANS} physicians.</h2>
            <p className="text-[17px] leading-[1.55] max-w-[48ch]">Independent physicians have lost ground for 25 years. The Alliance is the trade association built to fight back for them.</p>
            <div className="flex flex-wrap items-center gap-5">
              <Link href={JOIN.href} className={btnPrimary}>{JOIN.label} <Arrow size={16} /></Link>
              <span className="text-[15px]">or <strong className="font-tight">{level.annual} a year</strong></span>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-6">
            <ol className="grid gap-5 list-none m-0 p-0">
              {level.benefits.map((b, i) => (
                <li key={b} className="flex gap-5 pt-4 border-t-2 border-ink">
                  <span className="num text-[14px] tracking-[0.08em] pt-1" aria-hidden="true">0{i + 1}</span>
                  <p className="font-tight font-semibold text-[19px] leading-[1.3] tracking-[-0.01em]">{b}</p>
                </li>
              ))}
            </ol>
            <p className="text-[14px] leading-[1.5]">The Alliance estimates {membership.deductibleShare} of dues are deductible as a business expense. The exact share is reported to members each year.</p>
            <TaxNotice compact />
          </div>
        </div>
      </Band>

      {/* 4. Who stands with the Alliance */}
      <Band mist label="Who stands with the Alliance">
        <SectionHead eyebrow="Who stands with the Alliance" title="The parties who pay for care and the physicians who deliver it." text="Partners share one interest with independent physicians: competition. Partnership is by application; the Alliance publishes no partner names, tiers or logos." link={{ label: 'For partners', href: '/partners/' }} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {partners.map((g) => (
            <div key={g.h} className="flex flex-col gap-3 pt-5 border-t-2 border-ink">
              <h3 className="font-tight font-bold text-[20px] leading-[1.15] tracking-[-0.02em]">{g.h}</h3>
              <p className="text-[15px] leading-[1.55]">{g.p}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* 5. Insights */}
      <Band label="Insights">
        <SectionHead eyebrow="Insights" title="Data lawmakers and staff can cite." text="Reports, briefs and data, each with its sources listed and a PDF to hand across a desk." link={{ label: 'All insights', href: '/insights/' }} />
        <div className="grid gap-8 md:grid-cols-3">
          {latestInsights.map((i) => <InsightCard key={i.slug} title={i.title} format={i.format} issue={i.issue} date={i.date} readTime={i.readTime} href={`/insights/${i.slug}/`} summary={i.summary} />)}
        </div>
      </Band>

      {/* 6. How we win */}
      <Band dark label="How we win">
        <SectionHead dark eyebrow="How we win" title="Unite the buyers. Put the data in front of Congress. Run all three fights at once." link={{ label: 'The plan and the timeline', href: '/how-we-win/' }} />
        <ol className="grid gap-10 lg:grid-cols-3 list-none m-0 p-0">
          {pillars.map((x, i) => (
            <li key={x.t} className="flex flex-col gap-4 pt-5 border-t-2 border-accent">
              <span className="num text-[14px] tracking-[0.08em] text-accent" aria-hidden="true">0{i + 1}</span>
              <h3 className="font-tight font-bold text-[22px] leading-[1.15] tracking-[-0.02em]">{x.t}</h3>
              <p className="text-[15px] leading-[1.55] text-ink-text-2">{x.p}</p>
            </li>
          ))}
        </ol>
      </Band>

      <JoinBand />
    </>
  );
}
