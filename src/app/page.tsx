import type { Metadata } from 'next';
import Link from 'next/link';
import cover from '@/data/home/cover.json';
import fights from '@/data/home/fights.json';
import driversData from '@/data/home/drivers.json';
import mostRead from '@/data/home/mostread.json';
import { getAllStates } from '@/lib/data';
import { buildSearchIndex } from '@/lib/searchIndex';
import Tiers from '@/components/support/Tiers';
import Search from '@/components/home/Search';
import StateTileMap from '@/components/home/StateTileMap';
import FightsTable from '@/components/home/FightsTable';
import GetIntelligence from '@/components/home/GetIntelligence';

/**
 * Home page, Alliance-style layout (Dutch 2026-11-09, from the canvas mockup Esrvzn1CvPb4JDf3WNb4PB):
 * bold Inter Tight headlines, full-width ink / green / oxblood bands, number tiles, tinted cards.
 * Every figure comes from a data file.
 */

export const metadata: Metadata = {
  title: { absolute: 'The Rojas Report | Healthcare Intelligence' },
  alternates: { canonical: 'https://rojasreport.com/' },
};

const wrap = 'max-w-content mx-auto px-4 md:px-8';
const band = 'py-20 md:py-[104px]';
const eyebrow = 'font-tight text-[13px] font-semibold uppercase tracking-[0.14em]';
const h2 = 'font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[34px] md:text-[54px]';
const lede = 'mt-5 text-[19px] leading-[1.5]';
const tag = 'inline-block font-tight text-[13px] font-bold uppercase tracking-[0.12em] leading-none px-2 py-[5px] border';
const textlink = 'inline-flex items-center gap-1.5 font-tight font-semibold text-[15px] border-b-[1.5px] border-current pb-0.5 hover:gap-2.5 transition-[gap]';
const btn = 'inline-flex items-center gap-2.5 min-h-[48px] px-[22px] font-tight font-semibold text-[15px] leading-none border-[1.5px]';

function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="shrink-0">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

function Smart({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith('http') ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );
}

// Status labels: dot plus text, never color alone (brief, section 3). Dot colors are the light shades that read on the ink band.
const STATUS: Record<string, { text: string; dot: string }> = {
  'lobby-holding': { text: 'Lobby holding', dot: '#D9827F' },
  'in-play': { text: 'In play', dot: '#D8B45A' },
  'on-paper': { text: 'On paper', dot: '#D8B45A' },
  'in-court': { text: 'In court', dot: '#D8B45A' },
  'reform-moving': { text: 'Reform moving', dot: '#8FBF9F' },
  pending: { text: 'Pending', dot: '#C9BFA9' },
};

function SectionHead({ label, labelClass, title, lede: text, link, dark = false }: {
  label: string; labelClass: string; title: string; lede: string; link?: { href: string; text: string }; dark?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-between items-end gap-6 mb-12 md:mb-14">
      <div className="max-w-[760px]">
        <div className={`${eyebrow} ${labelClass} mb-4`}>{label}</div>
        <h2 className={h2}>{title}</h2>
        <p className={`${lede} ${dark ? 'text-ink-text-2' : ''}`}>{text}</p>
      </div>
      {link && (
        <Smart href={link.href} className={`${textlink} ${dark ? 'text-paper' : 'text-ink hover:text-oxblood'}`}>
          {link.text} <Arrow />
        </Smart>
      )}
    </div>
  );
}

export default function HomePage() {
  const index = buildSearchIndex();
  const conSlugs = Object.fromEntries(getAllStates().map((s) => [s.abbreviation, s.slug]));
  const stats = (cover as { stats?: { value: string; label: string }[] }).stats ?? [];

  return (
    <>
      <Search index={index} />

      {/* I. The cost drivers: ink band, number tiles */}
      <section id="drivers" className={`bg-ink text-paper ${band}`}>
        <div className={wrap}>
          <SectionHead
            dark
            label="I · The cost drivers"
            labelClass="text-ink-text"
            title="Six reasons your care costs what it does."
            lede="None of these are accidents. Each one is a rule, a subsidy or a payment formula, and each one has a sponsor."
            link={{ href: '/drivers/', text: 'All six briefs' }}
          />
          <div className="grid gap-x-6 gap-y-14 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {driversData.drivers.map((d) => {
              const s = STATUS[d.status] ?? STATUS.pending;
              const pending = d.figure.basis === 'pending' || !d.figure.value;
              return (
                <article key={d.numeral} className="border-t-2 border-oxblood-rule pt-6 flex flex-col gap-3.5">
                  <div className={`${eyebrow} tracking-[0.12em] text-ink-text`}>{d.numeral} · {d.label}</div>
                  {pending ? (
                    <div className="min-h-[66px] flex items-center">
                      <span className={`${tag} border-[1.5px] border-ink-text text-ink-text-2 py-1.5 px-2.5`} aria-label="Figure pending">Figure pending</span>
                    </div>
                  ) : (
                    <div className="font-tight font-extrabold text-[64px] md:text-[72px] leading-[0.92] tracking-[-0.045em] tabular-nums text-paper" title={d.figure.source ?? undefined}>
                      {d.figure.value}
                    </div>
                  )}
                  <h3 className="font-tight font-bold text-[22px] leading-[1.2] tracking-[-0.015em] text-paper">{d.title}</h3>
                  <p className="text-[16px] leading-[1.55] text-ink-text-2">{d.text}</p>
                  <div className="text-[14px] font-semibold flex items-center gap-2 flex-wrap">
                    <span aria-hidden="true" className="w-[9px] h-[9px] rounded-full inline-block" style={{ background: s.dot }} />
                    {s.text} <span className="font-normal text-ink-text">· {d.statusNote}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1 items-center">
                    <Smart href={d.href} className={`${textlink} text-paper`}>Read the brief <Arrow /></Smart>
                    <Link href="/reports/" className="text-[15px] text-ink-text-2 underline underline-offset-[3px] decoration-green-rule hover:text-paper">Download PDF</Link>
                    <Link href="/reports/" className="text-[15px] text-ink-text-2 underline underline-offset-[3px] decoration-green-rule hover:text-paper">Get the data</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* II. The tracker */}
      <section className={band}>
        <div className={wrap}>
          <SectionHead
            label={`II · The tracker · As of ${fights.asOf}`}
            labelClass="text-oxblood"
            title="Where the fights stand."
            lede="Each rule the hospital lobby is fighting, where it stands, and who is winning. The five that matter most this week."
            link={{ href: '/tracker/', text: `All ${fights.rows.length} fights` }}
          />
          <FightsTable rows={fights.rows} limit={5} />
        </div>
      </section>

      {/* III. States: green band */}
      <section id="states" className={`bg-green text-paper ${band}`}>
        <div className={`${wrap} grid gap-12 lg:gap-16 items-center grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
          <div>
            <div className={`${eyebrow} text-green-text mb-4`}>III · The state dossiers</div>
            <h2 className={h2}>Where it costs you.</h2>
            <p className={`${lede} text-green-text-2 max-w-[520px] mb-8`}>
              Every state, graded. Its CON law, its tax-exempt systems, its subsidies, its attorney general, and the lawmakers who decide.
            </p>
            <Link href="/states/" className={`${btn} bg-paper text-green border-paper hover:bg-paper-2`}>Pick a state <Arrow size={16} /></Link>
            <div className="flex flex-wrap gap-6 mt-8 text-[14px] font-semibold">
              <span className="flex items-center gap-2"><span aria-hidden="true" className="w-3.5 h-3.5 bg-paper inline-block" />Dossier published</span>
              <span className="flex items-center gap-2"><span aria-hidden="true" className="w-3.5 h-3.5 bg-[#2A4A3B] border border-green-rule inline-block" />In preparation</span>
            </div>
          </div>
          <div className="min-w-0">
            <StateTileMap conSlugs={conSlugs} onDark />
          </div>
        </div>
      </section>

      {/* IV. This week's cover + most read */}
      <section className={band}>
        <div className={`${wrap} grid gap-12 grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]`}>
          <article className="bg-paper-2 border-t-4 border-oxblood p-7 md:p-10 flex flex-col gap-5">
            <div className={`${eyebrow} text-oxblood`}>This week&apos;s cover · {cover.kicker} · {cover.date}</div>
            <h2 className="font-tight font-extrabold text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.035em]">{cover.headline}.</h2>
            <p className="text-[18px] leading-[1.55]">{cover.dek}</p>
            {cover.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover.image} alt="" className="w-full h-[320px] object-cover grayscale border-4 border-oxblood" />
            )}
            {stats.length > 0 && (
              <div className="flex flex-wrap gap-6 my-1">
                {stats.map((st) => (
                  <div key={st.label} className="border-t-2 border-ink pt-3 min-w-[140px]">
                    <div className="font-tight font-extrabold text-[48px] leading-none tracking-[-0.04em]">{st.value}</div>
                    <div className="text-[14px] font-semibold mt-1.5">{st.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div>
              <Smart href={cover.href} className={`${btn} bg-oxblood text-paper border-oxblood hover:bg-oxblood-hover`}>{cover.cta} <Arrow size={16} /></Smart>
            </div>
          </article>
          <aside>
            <div className={`${eyebrow} pb-3.5 border-b-2 border-ink`}>Most-read dossiers</div>
            <ol className="list-none m-0 p-0">
              {mostRead.map((m, i) => (
                <li key={m.href} className="border-b border-hairline">
                  <Smart href={m.href} className="flex gap-5 py-5 items-baseline group">
                    <span className="font-tight font-extrabold text-[28px] tracking-[-0.03em] text-oxblood w-7 shrink-0 leading-none">{i + 1}</span>
                    <span className="font-tight font-bold text-[19px] leading-[1.25] tracking-[-0.01em] group-hover:text-oxblood">{m.title}</span>
                  </Smart>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* V. Get the intelligence */}
      <GetIntelligence label="IV · Get the intelligence" />

      {/* VI. Support: oxblood band */}
      <section id="support" className={`bg-oxblood text-paper ${band}`}>
        <div className={`${wrap} grid gap-12 items-start grid-cols-1 lg:grid-cols-2`}>
          <div>
            <div className={`${eyebrow} text-oxblood-text mb-4`}>V · Support the Report</div>
            <h2 className="font-tight font-extrabold text-[40px] md:text-[68px] leading-none tracking-[-0.035em]">Keep the record open.</h2>
            <p className={`${lede} mt-6 max-w-[520px]`}>
              Reader-supported intelligence on why healthcare costs what it does. Your support funds the data, the filings and the reporting that keeps every dossier free to read.
            </p>
          </div>
          <Tiers tone="oxblood" />
        </div>
      </section>

      {/* VII. For physicians */}
      <section className={band}>
        <div className={wrap}>
          <div className="max-w-[760px] mb-12">
            <div className={`${eyebrow} text-green mb-4`}>VI · For physicians</div>
            <h2 className={h2}>Don&apos;t just read about it. Build.</h2>
            <p className={lede}>Three companies built for physicians who want to own what they run.</p>
          </div>
          <div className="grid gap-x-6 grid-cols-1 md:grid-cols-3">
            {[
              { name: 'MedMerge', href: 'https://medmerge.co', blurb: "Own your group's benefits instead of renting them from a carrier." },
              { name: 'Cornerstone Indemnity', href: '', blurb: 'Physician-owned malpractice coverage. Keep the underwriting profit.' },
              { name: 'PhyCap Fund', href: 'https://www.phycapfund.com', blurb: 'Capital for physician-led companies.' },
            ].map((c) => {
              const inner = (
                <>
                  <span className="flex flex-col gap-2">
                    <span className="font-tight font-bold text-[26px] leading-[1.1] tracking-[-0.02em] group-hover:text-oxblood">{c.name}</span>
                    <span className="text-[17px] leading-[1.45]">{c.blurb}</span>
                  </span>
                  {c.href && <span className="mt-1.5 group-hover:text-oxblood"><Arrow size={22} /></span>}
                </>
              );
              const cls = 'group flex justify-between gap-6 items-start border-t-2 border-ink py-6';
              return c.href ? (
                <a key={c.name} href={c.href} className={cls}>{inner}</a>
              ) : (
                <div key={c.name} className={cls}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
