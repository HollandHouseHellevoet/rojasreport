import type { Metadata } from 'next';
import Link from 'next/link';
import { getSection } from '@/lib/home';
import { getStateIndex } from '@/lib/stateIndex';
import { stateDossiers, stateGrade } from '@/lib/stateDossiers';
import StatesMap from '@/components/states/StatesMap';
import StateGroups from '@/components/states/StateGroups';
import StatusLabel from '@/components/StatusLabel';
import PendingChip from '@/components/PendingChip';
import GetIntelligence from '@/components/home/GetIntelligence';

/**
 * /states/: the map, the published dossiers, every state grouped by CON tier, and the desks.
 * Every number is computed from data/rankings.json, data/states and src/data/states; none is typed here.
 */

export const metadata: Metadata = {
  title: 'The States',
  description: 'Where it costs you: certificate-of-need rules, rankings and reform status in every state.',
  alternates: { canonical: 'https://rojasreport.com/states/' },
};

const wrap = 'max-w-content mx-auto px-4 md:px-8';
const band = 'py-20 md:py-[104px]';
const eyebrow = 'font-tight text-[13px] font-semibold uppercase tracking-[0.14em]';
const h2 = 'font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[34px] md:text-[54px]';
const btn = 'inline-flex items-center gap-2.5 min-h-[48px] px-[22px] font-tight font-semibold text-[15px] leading-none border-[1.5px]';

function Arrow({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="shrink-0">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="border-t-2 border-ink pt-3">
      <div className="font-tight font-extrabold text-[44px] md:text-[56px] leading-none tracking-[-0.04em] tabular-nums">{value}</div>
      <div className="text-[15px] font-semibold mt-2">{label}</div>
    </div>
  );
}

export default function StatesIndex() {
  const section = getSection('states');
  const { rows, groups } = getStateIndex();
  const restrictive = groups.filter((g) => !g.noCon).slice(0, 2);
  const restrictiveCount = restrictive.reduce((a, g) => a + g.count, 0);
  const noCon = groups.find((g) => g.noCon);
  const graded = rows.filter((r) => r.grade).length;
  const desks = section.desks.filter((d) => d.group === 'Desks');

  return (
    <>
      {/* 1. Header */}
      <section className={`${wrap} pt-10 md:pt-14 pb-16 md:pb-20`}>
        <nav aria-label="Breadcrumb" className="text-[14px] mb-8">
          <Link href="/" className="underline underline-offset-[3px] decoration-hairline hover:text-oxblood">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page">{section.name}</span>
        </nav>
        <p className={`${eyebrow} text-oxblood mb-5`}>{section.question}</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>{section.name}</h1>
        {section.intro && <p className="mt-7 max-w-[680px] text-[19px] md:text-[22px] leading-[1.45]">{section.intro}</p>}
        <div className="mt-12 grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4 max-w-[1000px]">
          <Stat value={rows.length} label="Jurisdictions scored for CON" />
          <Stat value={restrictiveCount} label={restrictive.map((g) => g.label).join(' or ')} />
          {noCon && <Stat value={noCon.count} label="With no CON law" />}
          <Stat value={stateDossiers.length} label={stateDossiers.length === 1 ? 'State dossier published' : 'State dossiers published'} />
        </div>
      </section>

      {/* 2. The map */}
      <section id="map" className={`bg-green text-paper ${band}`}>
        <div className={wrap}>
          <StatesMap
            rows={rows}
            groups={groups}
            intro={
              <>
                <div className={`${eyebrow} text-green-text mb-4`}>I · The map</div>
                <h2 className={h2}>How each state treats competition.</h2>
                <p className="mt-5 text-[19px] leading-[1.5] text-green-text-2 max-w-[520px]">
                  Certificate-of-need laws require a state board&apos;s approval to open or expand a facility, and let incumbents object. Darker means more restrictive.
                </p>
              </>
            }
          />
        </div>
      </section>

      {/* 3. Published dossiers */}
      <section id="dossiers" className={band}>
        <div className={wrap}>
          <div className="max-w-[760px] mb-12">
            <div className={`${eyebrow} text-oxblood mb-4`}>II · The dossiers</div>
            <h2 className={h2}>The full record, state by state.</h2>
            <p className="mt-5 text-[19px] leading-[1.5]">
              {stateDossiers.length === 1 ? 'One dossier is published.' : `${stateDossiers.length} dossiers are published.`} Each one covers the state&apos;s hospitals, its subsidies, its CON law and the lawmakers who decide.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {stateDossiers.map((d) => {
              const g = stateGrade(d);
              const reported = d.money.items.find((m) => m.basis === 'reported');
              const estimated = d.money.items.find((m) => m.basis === 'estimated');
              const href = `/states/${d.slug}/`;
              return (
                <article key={d.slug} className="bg-paper-2 border-t-4 border-oxblood p-7 md:p-10 grid gap-10 grid-cols-1 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
                  <div className="flex flex-col gap-6 min-w-0">
                    <div className={`${eyebrow} text-oxblood`}>State dossier · As of {d.asOf}</div>
                    <h3 className="font-tight font-extrabold text-[40px] md:text-[56px] leading-[1] tracking-[-0.035em]">
                      <Link href={href} className="hover:text-oxblood">{d.name}</Link>
                    </h3>
                    <p className="text-[18px] leading-[1.55] max-w-[640px]">{d.verdict}</p>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                      <div className="border-t-2 border-ink pt-3">
                        <div className="font-tight font-extrabold text-[44px] leading-none tracking-[-0.04em] tabular-nums">{d.hospitals.rows.length}</div>
                        <div className="text-[15px] mt-2">hospitals in the 340B program, {d.hospitals.as_of}</div>
                      </div>
                      {reported && (
                        <div className="border-t-2 border-ink pt-3" title={reported.source}>
                          <div className="font-tight font-extrabold text-[44px] leading-none tracking-[-0.04em] tabular-nums">{reported.value}</div>
                          <div className="text-[15px] mt-2">{reported.text}</div>
                        </div>
                      )}
                      {estimated && (
                        <div className="border-t-2 border-ink pt-3" title={estimated.source}>
                          <div className="font-tight font-extrabold text-[44px] leading-none tracking-[-0.04em] tabular-nums">{estimated.value}</div>
                          <div className="text-[15px] mt-2">{estimated.text}</div>
                          <div className="mt-2"><PendingChip label="Estimated" /></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Link href={href} className={`${btn} bg-oxblood text-paper border-oxblood hover:bg-oxblood-hover`}>Read the dossier <Arrow /></Link>
                    </div>
                  </div>
                  <aside className="flex flex-col gap-3 lg:border-l lg:border-hairline lg:pl-10">
                    <div className={eyebrow}>The Rojas grade</div>
                    <div className="font-tight font-extrabold text-[120px] leading-[0.85] tracking-[-0.05em] text-oxblood">{g.letter ?? '?'}</div>
                    {g.provisional && (
                      <div><PendingChip label="Provisional" size="card" /></div>
                    )}
                    <p className="text-[15px] leading-[1.5]">
                      {g.graded} of {g.total} cost drivers graded so far.
                    </p>
                    <Link href="/methodology/state-grade/" className="self-start inline-flex items-center gap-1.5 font-tight font-semibold text-[15px] border-b-[1.5px] border-current pb-0.5 hover:text-oxblood">
                      How the grade works <Arrow size={14} />
                    </Link>
                  </aside>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Every state, grouped */}
      <section id="every-state" className="pb-20 md:pb-[104px]">
        <div className={wrap}>
          <div className="border-t border-hairline pt-20 md:pt-[88px] max-w-[760px] mb-10">
            <div className={`${eyebrow} text-oxblood mb-4`}>III · Every state</div>
            <h2 className={h2}>All {rows.length}, most restrictive first.</h2>
            <p className="mt-5 text-[19px] leading-[1.5]">
              Grouped by how hard the state makes it to compete. {graded > 0 ? 'A letter marks a state with a published Rojas grade.' : ''}
            </p>
          </div>
          <StateGroups rows={rows} groups={groups} />
        </div>
      </section>

      {/* 5. Desks */}
      <section id="desks" className="pb-20 md:pb-[104px]">
        <div className={wrap}>
          <div className="border-t border-hairline pt-20 md:pt-[88px] mb-10">
            <div className={`${eyebrow} text-oxblood mb-4`}>IV · The desks</div>
            <h2 className={h2}>More on the states.</h2>
          </div>
          <div className="grid gap-x-6 grid-cols-1 md:grid-cols-2">
            {desks.map((d) =>
              d.status === 'live' && d.href ? (
                <Link key={d.name} href={d.href} className="group flex justify-between gap-6 items-start border-t-2 border-ink py-6">
                  <span className="flex flex-col gap-2">
                    <span className="font-tight font-bold text-[26px] leading-[1.1] tracking-[-0.02em] group-hover:text-oxblood">{d.name}</span>
                    {d.blurb && <span className="text-[17px] leading-[1.45]">{d.blurb}</span>}
                  </span>
                  <span className="mt-1.5 group-hover:text-oxblood"><Arrow size={22} /></span>
                </Link>
              ) : (
                <div key={d.name} className="flex flex-col gap-2 border-t-2 border-ink py-6">
                  <span className="font-tight font-bold text-[26px] leading-[1.1] tracking-[-0.02em]">{d.name}</span>
                  {d.blurb && <span className="text-[17px] leading-[1.45]">{d.blurb}</span>}
                  <span className="mt-1"><StatusLabel status="pending" note="In preparation" /></span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 6. Get the intelligence */}
      <GetIntelligence label="V · Get the intelligence" />
    </>
  );
}
