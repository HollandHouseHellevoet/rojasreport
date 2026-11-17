import type { Metadata } from 'next';
import Link from 'next/link';
import { buildSearchIndex } from '@/lib/searchIndex';
import { FIGHT_TILES } from '@/lib/fightFigures';
import { getFight, trackerAsOf } from '@/lib/fights';
import { deskTitle, sections } from '@/lib/home';
import { JOIN } from '@/lib/nav';
import { makeMetadata } from '@/lib/seo';
import Search from '@/components/home/Search';
import { Field, Form, STATES } from '@/components/alliance/Form';
import SentNotice from '@/components/alliance/SentNotice';
import { Arrow, Band, SectionHead, Smart, btnPrimary, eyebrow, fmtDate, lede, textlink, wrap } from '@/components/alliance/ui';

/**
 * Home page, one-page intro edition (Dutch, November 17, 2026). The search bar and the opening stay as they were.
 * Below them: the research that is live today, the three fights in brief, the briefing signup, and what is in
 * preparation. The lists are read from sections.json at build time so the page never promises a desk that is not live.
 * The form posts to the same Formspree endpoint as every other form on the site (FORMSPREE in src/lib/site.ts).
 */
export const metadata: Metadata = makeMetadata({
  title: 'The Alliance for Healthcare Competition',
  description: 'The free-market trade association for American healthcare. Independent physicians, employers, payers and manufacturers united to end hospital monopoly pricing: site-neutral payment, 340B reform and physician ownership.',
  path: '/',
});

const ROLES = ['Independent physician', 'Employed physician', 'Employer', 'Payer', 'Manufacturer', 'Physician-owned facility', 'Congressional or agency staff', 'Press', 'Something else'];

export default function HomePage() {
  const index = buildSearchIndex();

  // Live desks, one card per destination; planned desks, grouped by section.
  const seen = new Set<string>();
  const live = sections.flatMap((s) =>
    s.desks
      .filter((d) => d.status === 'live' && !!d.href && !seen.has(d.href) && seen.add(d.href))
      .map((d) => ({ ...d, href: d.href as string, section: s.name })),
  );
  const planned = sections
    .map((s) => ({ section: s.name, desks: s.desks.filter((d) => d.status === 'planned').map((d) => deskTitle(d.name)) }))
    .filter((s) => s.desks.length > 0);

  return (
    <>
      <Search index={index} />

      {/* 1. The opening, unchanged */}
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

      {/* 2. The research that is live today */}
      <Band dark label="The research">
        <SectionHead dark eyebrow="Live today" title="The hospital lobby’s own filings, read and dated." text="The research arm publishes dossiers on the systems, the states, the committees and the lobby. Every figure is sourced to a public filing. Free to read." link={{ label: 'All the research', href: '/research/' }} />
        <ul role="list" className="grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3 list-none m-0 p-0">
          {live.map((d) => (
            <li key={d.href} className="flex flex-col gap-2 pt-5 border-t border-rule-dark">
              <p className={`${eyebrow} text-ink-text`}>{d.section}</p>
              <h3 className="font-tight font-bold text-[22px] leading-[1.15] tracking-[-0.02em]"><Link href={d.href} className="hover:underline">{deskTitle(d.name)}</Link></h3>
              {d.stat && <p className="text-[15px] leading-[1.5] text-ink-text-2"><span className="num font-tight font-bold text-[28px] text-paper leading-none">{d.stat}</span> {d.statLabel}</p>}
              {d.blurb && <p className="text-[15px] leading-[1.55] text-ink-text-2">{d.blurb}</p>}
            </li>
          ))}
        </ul>
      </Band>

      {/* 3. The three fights, in brief */}
      <Band tight label="The three fights">
        <SectionHead eyebrow="In Congress" title="Three rules. One Congress." text="Each fight has a page with the bill, the money and the Alliance’s ask." link={{ label: 'Every bill, rule and court case', href: '/tracker/' }} />
        <ol role="list" className="grid gap-6 md:grid-cols-3 list-none m-0 p-0">
          {FIGHT_TILES.map((t, i) => {
            const f = getFight(t.slug);
            return (
              <li key={t.slug} className="flex flex-col gap-3 pt-5 border-t-2 border-ink">
                <span className="num text-[14px] tracking-[0.08em]" aria-hidden="true">0{i + 1}</span>
                <h3 className="font-tight font-bold text-[22px] leading-[1.15] tracking-[-0.02em]"><Link href={t.href} className="hover:underline">{t.title}</Link></h3>
                <p className="text-[15px] leading-[1.55]">{t.stake}</p>
                <p className="text-[14px] leading-[1.45]"><span className="font-semibold">{f.stage}</span> · {f.vehicle}</p>
              </li>
            );
          })}
        </ol>
        <p className="text-[14px] mt-8">Tracker as of {fmtDate(trackerAsOf)}.</p>
      </Band>

      {/* 4. The briefing signup */}
      <Band mist id="briefing" label="The Alliance briefing">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <p className={eyebrow}>The Alliance briefing</p>
            <h2 className="font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[34px] md:text-[52px]">Data and progress reports. Twice a month.</h2>
            <p className="text-[17px] leading-[1.55] max-w-[48ch]">The dossiers as they publish, the tracker as it moves, and what the Alliance asks of Congress. Free, and the first thing a new member reads.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SentNotice messages={{ briefing: 'You are on the list. The next briefing reaches you when it publishes.' }} />
            <Form name="briefing" subject="TAFHC Newsletter Subscribe" action="/?sent=briefing#briefing" submit="Get the briefing" note="One list, twice a month. Your address is not published or shared.">
              <Field label="Name" id="b-name"><input id="b-name" name="name" type="text" required autoComplete="name" /></Field>
              <Field label="Email" id="b-email"><input id="b-email" name="email" type="email" required autoComplete="email" /></Field>
              <Field label="I am" id="b-role">
                <select id="b-role" name="role" required defaultValue="">
                  <option value="">Choose one</option>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="State" id="b-state" hint="Optional.">
                <select id="b-state" name="state" defaultValue="">
                  <option value="">Choose one</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </Form>
          </div>
        </div>
      </Band>

      {/* 5. Membership, and what is in preparation */}
      <Band label="Membership and what comes next">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <p className={eyebrow}>For independent physicians</p>
            <h2 className="font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[34px] md:text-[52px]">Membership opens soon.</h2>
            <p className="text-[17px] leading-[1.55] max-w-[48ch]">Physician membership and the Council open when checkout is live. The join page explains each level and holds the waitlist. Partners reach leadership by application.</p>
            <div className="flex flex-wrap gap-5">
              <Smart href={JOIN.href} className={textlink}>Membership <Arrow /></Smart>
              <Smart href="/partners/" className={textlink}>For partners <Arrow /></Smart>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-6">
            <p className={eyebrow}>In preparation</p>
            <dl className="grid gap-5 m-0">
              {planned.map((s) => (
                <div key={s.section} className="grid gap-1 pt-4 border-t border-hairline">
                  <dt className="font-tight font-semibold text-[15px]">{s.section}</dt>
                  <dd className="m-0 text-[15px] leading-[1.55]">{s.desks.join(' · ')}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[14px] leading-[1.5]">Each desk publishes when its figures are sourced. The briefing carries the news.</p>
          </div>
        </div>
      </Band>
    </>
  );
}
