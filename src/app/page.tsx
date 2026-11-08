import type { Metadata } from 'next';
import Link from 'next/link';
import cover from '@/data/home/cover.json';
import fights from '@/data/home/fights.json';
import driversData from '@/data/home/drivers.json';
import mostRead from '@/data/home/mostread.json';
import { getAllStates } from '@/lib/data';
import { buildSearchIndex } from '@/lib/searchIndex';
import Tiers from '@/components/support/Tiers';
import { NEWSLETTER_URL, ABOUT_URL } from '@/lib/nav';
import Search from '@/components/home/Search';
import StateTileMap from '@/components/home/StateTileMap';
import FightsTable from '@/components/home/FightsTable';

/** Home page, built to docs/mockups/home.dc.html. Every figure comes from a data file. */

export const metadata: Metadata = {
  title: { absolute: 'The Rojas Report | Healthcare Intelligence' },
  alternates: { canonical: 'https://rojasreport.com/' },
};

const eyebrow = 'font-meta text-[13px] uppercase tracking-[0.14em] text-muted';
const h2 = 'font-display font-normal leading-[1.1]';
const kicker = 'font-meta text-[13px] tracking-[0.02em] text-muted';
const lead = 'max-w-[720px] text-[20px] leading-[1.5] text-body';
const action = 'font-body text-[16px] text-ink';

function Smart({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith('http') ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );
}

// Status labels: dot plus text, never color alone (brief, section 3).
const STATUS: Record<string, { text: string; color: string }> = {
  'lobby-holding': { text: 'Lobby holding', color: 'text-oxblood' },
  'in-play': { text: 'In play', color: 'text-gold' },
  'on-paper': { text: 'On paper', color: 'text-gold' },
  'in-court': { text: 'In court', color: 'text-gold' },
  'reform-moving': { text: 'Reform moving', color: 'text-green' },
  pending: { text: 'Pending', color: 'text-muted' },
};

export default function HomePage() {
  const index = buildSearchIndex();
  const conSlugs = Object.fromEntries(getAllStates().map((s) => [s.abbreviation, s.slug]));

  return (
    <>
      <Search index={index} />

      {/* I. The cost drivers */}
      <section id="drivers" className="max-w-content mx-auto px-5 md:px-8 pb-[88px]">
        <div className="flex flex-wrap justify-between items-baseline gap-3 border-t border-ink pt-5 mb-2">
          <h2 className={`${h2} text-[34px] md:text-[44px]`}>Six reasons your care costs what it does</h2>
          <span className={eyebrow}>I · The Cost Drivers</span>
        </div>
        <p className={`${lead} mb-10`}>
          None of these are accidents. Each one is a rule, a subsidy or a payment formula, and each one has a sponsor. Read the brief, download the one-pager, or buy the underlying data.
        </p>
        <div className="grid border-t border-hairline" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {driversData.drivers.map((d) => {
            const s = STATUS[d.status] ?? STATUS.pending;
            const pending = d.figure.basis === 'pending' || !d.figure.value;
            return (
              <article key={d.numeral} className="pt-8 pb-9 md:pr-8 border-b border-hairline flex flex-col gap-3.5">
                <div className={kicker}>{d.numeral} · {d.label}</div>
                <h3 className="font-display font-medium text-[26px] leading-[1.2]">{d.title}</h3>
                {pending ? (
                  <p className="min-h-[64px] flex items-end italic text-[19px] leading-[1.4] text-muted">Figure arrives with the brief.</p>
                ) : (
                  <div className="font-display text-[56px] md:text-[64px] leading-none text-oxblood" title={d.figure.source ?? undefined}>
                    {d.figure.value}
                  </div>
                )}
                <p className="text-[19px] leading-[1.45] text-body">{d.text}</p>
                <div className={`font-meta text-[13px] tracking-[0.02em] ${s.color}`}>
                  <span aria-hidden="true">●</span> {s.text} · <span className="text-muted">{d.statusNote}</span>
                </div>
                <div className={`flex flex-wrap gap-x-5 gap-y-1.5 ${action} mt-1`}>
                  <Smart href={d.href} className="hover:text-oxblood">Read the brief →</Smart>
                  <Link href="/reports/" className="hover:text-oxblood">Download PDF</Link>
                  <Link href="/reports/" className="text-green hover:text-oxblood">Get the data</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* II. Where the fights stand */}
      <section className="bg-paper-2 border-y border-hairline">
        <div className="max-w-content mx-auto px-5 md:px-8 py-[72px]">
          <div className="flex flex-wrap justify-between items-baseline gap-3 mb-2">
            <h2 className={`${h2} text-[34px] md:text-[40px]`}>Where the fights stand</h2>
            <span className={eyebrow}>II · The Tracker · As of {fights.asOf}</span>
          </div>
          <p className={`${lead} mb-8`}>
            Each rule the hospital lobby is fighting, where it stands, and who is winning. The five that matter most this week.
          </p>
          <FightsTable rows={fights.rows} limit={5} />
          <p className={`${action} mt-6`}>
            <Link href="/tracker/" className="border-b border-ink pb-0.5 hover:text-oxblood hover:border-oxblood">
              All {fights.rows.length} fights in the tracker →
            </Link>
          </p>
        </div>
      </section>

      {/* III. States */}
      <section id="states" className="max-w-content mx-auto px-5 md:px-8 py-[88px]">
        <div className="flex flex-wrap gap-14 items-center">
          <div className="flex-[1_1_340px] min-w-0">
            <div className={`${eyebrow} mb-4`}>III · The State Dossiers</div>
            <h2 className={`${h2} text-[34px] md:text-[44px] mb-5`}>Where it costs you</h2>
            <p className="text-[20px] leading-[1.5] text-body mb-6">
              Every state, graded. Its CON law, its tax-exempt systems, its subsidies, its attorney general, and the lawmakers who decide. Pick a state.
            </p>
            <div className="flex flex-col gap-2.5 font-meta text-[14px] text-body">
              <span className="flex items-center gap-2.5"><span className="w-4 h-4 bg-green inline-block" aria-hidden="true" />Dossier published</span>
              <span className="flex items-center gap-2.5"><span className="w-4 h-4 bg-placeholder inline-block" aria-hidden="true" />In preparation</span>
            </div>
          </div>
          <div className="flex-[1_1_560px] min-w-0">
            <StateTileMap conSlugs={conSlugs} />
          </div>
        </div>
      </section>

      {/* IV. This week's cover + most read */}
      <section className="border-t border-ink">
        <div className="max-w-content mx-auto px-5 md:px-8 pt-[72px] pb-[88px] flex flex-wrap gap-16">
          <article className="flex-[999_1_560px] min-w-0">
            <div className="font-meta text-[13px] uppercase tracking-[0.14em] text-oxblood mb-4">
              This Week&apos;s Cover · {cover.kicker} · {cover.date}
            </div>
            <h2 className="font-display font-normal italic text-[40px] md:text-[56px] leading-[1.05] mb-5">{cover.headline}</h2>
            <p className="text-[21px] leading-[1.5] text-body mb-7">{cover.dek}</p>
            {cover.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover.image} alt="" className="w-full h-[320px] object-cover mb-6" />
            ) : (
              <div className="bg-placeholder h-[320px] flex items-center justify-center font-meta text-[13px] tracking-[0.1em] uppercase text-muted mb-6">
                [Cover portrait]
              </div>
            )}
            <Smart href={cover.href} className="font-body text-[17px] border-b border-ink pb-0.5 hover:text-oxblood hover:border-oxblood">
              {cover.cta} →
            </Smart>
          </article>
          <aside className="flex-[1_1_300px] min-w-0">
            <div className={`${eyebrow} border-b border-ink pb-3`}>Most-read dossiers</div>
            <ol className="list-none m-0 p-0">
              {mostRead.map((m, i) => (
                <li key={m.href} className="flex gap-4 py-[18px] border-b border-hairline">
                  <span className="font-display text-[28px] text-oxblood w-6 shrink-0 leading-none">{i + 1}</span>
                  <Smart href={m.href} className="text-[19px] leading-[1.35] hover:text-oxblood">{m.title}</Smart>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* V. Get the intelligence */}
      <section id="reports" className="bg-paper-2 border-y border-hairline">
        <div className="max-w-content mx-auto px-5 md:px-8 py-20">
          <div className="text-center mb-12">
            <div className={`${eyebrow} mb-3.5`}>IV · Get the Intelligence</div>
            <h2 className={`${h2} text-[34px] md:text-[44px]`}>Read it. Download it. Own the data.</h2>
            <p className="mx-auto max-w-[640px] mt-4 text-[20px] leading-[1.5] text-body">
              Everything on this site is free to read. The reports and datasets are for the people who need the detail.
            </p>
          </div>
          <div className="grid border-t border-ink" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="pt-9 pb-10 md:pr-8 flex flex-col gap-3.5">
              <div className={eyebrow}>Free</div>
              <h3 className="font-display font-medium text-[28px]">The Reader</h3>
              <p className="text-[19px] leading-[1.5] text-body">Every article, every cost-driver brief, every state dossier and the weekly newsletter.</p>
              <a href={NEWSLETTER_URL} className={`${action} mt-auto hover:text-oxblood`}>Subscribe free →</a>
            </div>
            <div className="pt-9 pb-10 md:px-8 md:border-l border-hairline flex flex-col gap-3.5">
              <div className={eyebrow}>Reports &amp; datasets</div>
              <h3 className="font-display font-medium text-[28px]">Physician-Owned Hospitals</h3>
              <p className="text-[19px] leading-[1.5] text-body">Every POH in the country, with ownership, contacts and state context. $300 per state, or $3,500 a year for all access.</p>
              <Link href="/reports/" className={`${action} mt-auto text-green hover:text-oxblood`}>Browse reports →</Link>
            </div>
            <div className="pt-9 pb-10 md:pl-8 md:border-l border-hairline flex flex-col gap-3.5">
              <div className={eyebrow}>Membership · 100 seats</div>
              <h3 className="font-display font-medium text-[28px]">The Builders Table</h3>
              <p className="text-[19px] leading-[1.5] text-body">For physician owners, operators, founders and investors. $25,000 a year, by application.</p>
              <a href={ABOUT_URL} className={`${action} mt-auto hover:text-oxblood`}>Apply →</a>
            </div>
          </div>
          <p className="mt-8 text-center font-meta text-[14px] text-muted">
            Need something specific? <a href={ABOUT_URL} className="text-ink border-b border-ink hover:text-oxblood hover:border-oxblood">Request custom data</a>
          </p>
        </div>
      </section>

      {/* VI. Support */}
      <section id="support" className="bg-green text-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 py-[88px] flex flex-wrap gap-14 items-center">
          <div className="flex-[1_1_380px] min-w-0">
            <div className="font-meta text-[13px] uppercase tracking-[0.14em] text-green-text mb-4">V · Support the Report</div>
            <h2 className={`${h2} text-[40px] md:text-[48px] leading-[1.08] mb-5`}>Keep the record open.</h2>
            <p className="text-[20px] leading-[1.5] text-green-text-2">
              Reader-supported intelligence on why healthcare costs what it does. Your support funds the data, the filings and the reporting that keeps every dossier free to read.
            </p>
          </div>
          <div className="flex-[1_1_460px] min-w-0">
            <Tiers />
          </div>
        </div>
      </section>

      {/* VII. Build */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20">
        <div className="flex flex-wrap justify-between items-baseline gap-3 border-t border-ink pt-5 mb-8">
          <h2 className={`${h2} text-[34px] md:text-[40px]`}>Don&apos;t just read about it. Build.</h2>
          <span className={eyebrow}>VI · For Physicians</span>
        </div>
        <p className={`${lead} -mt-3 mb-10`}>
          Three companies built for physicians who want to own what they run.
        </p>
        <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {[
            { name: 'MedMerge', href: 'https://medmerge.co', blurb: "Own your group's benefits instead of renting them from a carrier." },
            { name: 'Cornerstone Indemnity', href: '', blurb: 'Physician-owned malpractice coverage. Keep the underwriting profit.' },
            { name: 'PhyCap Fund', href: 'https://www.phycapfund.com', blurb: 'Capital for physician-led companies.' },
          ].map((c) =>
            c.href ? (
              <a key={c.name} href={c.href} className="group flex flex-col gap-2.5">
                <span className="font-display text-[26px] group-hover:text-oxblood">{c.name}</span>
                <span className="text-[19px] leading-[1.45] text-body">{c.blurb}</span>
              </a>
            ) : (
              <div key={c.name} className="flex flex-col gap-2.5">
                <span className="font-display text-[26px]">{c.name}</span>
                <span className="text-[19px] leading-[1.45] text-body">{c.blurb}</span>
              </div>
            ),
          )}
        </div>
      </section>
    </>
  );
}
