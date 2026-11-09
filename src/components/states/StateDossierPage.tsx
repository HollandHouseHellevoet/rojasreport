import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import PendingChip from '@/components/PendingChip';
import { stateGrade, money, margin, word, type StateDossierRecord, type Letter, type Tone } from '@/lib/stateDossiers';

/** State dossier, built to docs/mockups/state-dossier.dc.html. Every figure comes from the state's data file. */

const eyebrow = 'font-meta text-[13px] font-semibold uppercase tracking-[0.1em]';
const h2 = 'font-display font-normal leading-[1.1]';
const button = 'font-meta text-[14px] font-medium text-center px-[18px] py-3.5';
const th = 'font-normal pt-[18px] pb-2.5 border-b border-ink';
const td = 'py-3.5 border-b border-hairline';

const toneClass: Record<Tone, string> = { red: 'text-oxblood', gold: 'text-gold', grey: 'text-muted', green: 'text-green' };

function gradeClass(g: Letter | null): string {
  if (!g) return 'text-muted';
  if (g === 'A' || g === 'B') return 'text-green';
  if (g === 'C') return 'text-gold';
  return 'text-oxblood';
}

function Heading({ title, aside, rule = true, size = 44 }: { title: string; aside: string; rule?: boolean; size?: 40 | 44 }) {
  return (
    <div className={`flex flex-wrap justify-between items-baseline gap-3 ${rule ? 'border-t border-ink pt-5 mb-9' : 'mb-2'}`}>
      <h2 className={`${h2} text-[32px] md:text-[${size}px]`}>{title}</h2>
      <span className="italic text-[17px] text-muted">{aside}</span>
    </div>
  );
}

export default function StateDossierPage({ d }: { d: StateDossierRecord }) {
  const g = stateGrade(d);
  return (
    <>
      {/* Title block with grade */}
      <section className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-14">
        <nav aria-label="Breadcrumb" className="font-meta text-[13px] tracking-[0.1em] text-muted mb-7">
          <Link href="/states/" className="text-muted hover:text-oxblood">/States</Link>{' '}
          <span className="text-ink">/{d.name}</span>
        </nav>
        <div className="flex flex-wrap gap-12 items-center">
          <div className="flex-[999_1_560px] min-w-0">
            <p className={`${eyebrow} text-muted mb-3`}>State Dossier</p>
            <h1 className="font-display font-normal text-[52px] md:text-[72px] lg:text-[80px] leading-[1]">{d.name}</h1>
            <p className="mt-[22px] max-w-[720px] italic text-[23px] leading-[1.45] text-body">{d.verdict}</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <PrintButton label="Download the dossier (PDF)" className={`${button} border border-ink hover:text-oxblood hover:border-oxblood`} />
              <a href="#buy" className={`${button} no-print bg-green text-paper hover:bg-ink`}>
                Get the state dataset
              </a>
            </div>
          </div>
          <div className="flex-none w-[220px] text-center border border-ink pt-7 px-5 pb-6" title={d.grade.note}>
            <div className="italic text-[17px] text-muted">The Rojas grade</div>
            <div className={`font-display text-[132px] leading-none my-1 ${gradeClass(g.letter)}`} aria-label={g.letter ? `Grade ${g.letter}` : 'Not yet graded'}>
              {g.letter ?? <PendingChip label="Not yet graded" size="card" />}
            </div>
            <div className="italic text-[15px] leading-[1.4] text-muted">
              {g.provisional
                ? `Provisional: ${word(g.graded)} of ${word(g.total)} drivers graded. `
                : 'All six drivers graded. '}
              <Link href="/methodology/state-grade/" className="text-muted border-b border-hairline hover:text-oxblood">How we grade</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Where the money sits */}
      <section className="bg-green text-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 pt-[72px] pb-16">
          <div className="flex flex-wrap justify-between items-baseline gap-3 mb-10">
            <h2 className={`${h2} text-[34px] md:text-[40px] text-paper`}>Where the money sits</h2>
            <span className="italic text-[17px] text-green-text">{d.money.asOf}</span>
          </div>
          <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {d.money.items.map((m) => (
              <div key={m.value} className="flex flex-col gap-2.5 border-t border-green-rule pt-5" title={m.source}>
                <div className="font-display leading-none text-paper whitespace-nowrap" style={{ fontSize: 'clamp(44px, 4.8vw, 68px)' }}>{m.value}</div>
                <div className="text-[17px] leading-[1.4] text-green-text-2">{m.text}</div>
                <div className="font-meta text-[13px] leading-[1.6] text-green-text">{m.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The six cost drivers */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20">
        <Heading title={`The six cost drivers in ${d.name}`} aside={`As of ${d.asOf}`} />
        <div className="grid border-t border-hairline" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {d.drivers.map((dr) => (
            <article key={dr.num} className="pt-7 pb-8 md:pr-8 border-b border-hairline flex flex-col gap-3" title={dr.source}>
              <div className="italic text-[17px] text-muted">
                {dr.num} · {dr.label}{' '}
                <span className="font-meta not-italic text-[13px] text-muted ml-1.5">{dr.weight}% of the grade</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-tight font-bold tracking-[-0.015em] text-[24px] leading-[1.2]">{dr.title}</h3>
                <div className={`font-display text-[46px] leading-[0.9] ${gradeClass(dr.grade)}`} aria-label={dr.grade ? `Grade ${dr.grade}` : 'Not yet graded'}>
                  {dr.grade ?? <PendingChip label="Not graded" />}
                </div>
              </div>
              <p className="text-[17px] leading-[1.5] text-body">{dr.body}</p>
              <div className="font-meta text-[14px] font-semibold"><span aria-hidden="true" className={toneClass[dr.tone]}>●</span> {dr.status}</div>
              {dr.href && dr.linkText && (
                <Link href={dr.href} className="font-meta text-[13px] font-medium hover:text-oxblood">
                  {dr.linkText} →
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* The systems that run it */}
      <section id="systems" className="bg-paper-2 border-y border-hairline">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8 py-[72px]">
          <Heading title="The systems that run it" aside={d.systems.subtitle} rule={false} size={40} />
          <div className="table-scroll">
            <table className="w-full min-w-[620px] border-collapse text-[17px]">
              <thead>
                <tr className="text-left italic text-[16px] text-muted">
                  <th className={`${th} pr-4`}>System</th>
                  <th className={`${th} pr-4 text-right`}>Hospitals</th>
                  <th className={`${th} pr-4 text-right`}>Patient revenue</th>
                  <th className={`${th} pr-4 text-right`}>Net income</th>
                  <th className={`${th} text-right`}>Margin</th>
                </tr>
              </thead>
              <tbody>
                {d.systems.rows.map((r) => (
                  <tr key={r.name} title={r.source}>
                    <td className={`${td} pr-4`}>
                      {r.slug ? (
                        <Link href={`/systems/${r.slug}/`} className="border-b border-hairline hover:text-oxblood">{r.name}</Link>
                      ) : (
                        r.name
                      )}
                    </td>
                    <td className={`${td} pr-4 text-right`}>{r.hospitals}</td>
                    <td className={`${td} pr-4 text-right font-tight font-semibold tabular-nums whitespace-nowrap`}>{money(r.netPatientRevenue)}</td>
                    <td className={`${td} pr-4 text-right font-tight font-semibold tabular-nums whitespace-nowrap text-oxblood`}>{money(r.netIncome)}</td>
                    <td className={`${td} text-right font-tight font-semibold tabular-nums`}>{margin(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 italic text-[16px] text-muted">{d.systems.note}</p>
        </div>
      </section>

      {/* Who decides */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20">
        <Heading title="Who decides" aside={d.whoDecides.subtitle} />
        <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }} title={d.whoDecides.source}>
          {d.whoDecides.groups.map((grp) => (
            <div key={grp.name}>
              <div className="italic text-[17px] text-muted border-b border-ink pb-2.5">{grp.name}</div>
              <div className="flex flex-col">
                {grp.people.map((p) => (
                  <div key={p.name} className="py-3.5 border-b border-hairline">
                    <div className="font-tight font-bold tracking-[-0.015em] text-[20px] leading-[1.25]">{p.name}</div>
                    <div className="text-[16px] text-muted">{p.role}</div>
                  </div>
                ))}
                {grp.note && (
                  <div className="py-3.5 border-b border-hairline text-[17px] text-body">{grp.note}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-7 italic text-[17px] text-body" title={d.whoDecides.pac.source}>{d.whoDecides.pac.text}</p>
      </section>

      {/* The bills */}
      <section className="bg-paper-2 border-y border-hairline">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8 py-[72px]" title={d.bills.source}>
          <Heading title="The bills" aside={d.bills.subtitle} rule={false} size={40} />
          <div className="flex flex-col">
            {d.bills.rows.map((b) => (
              <div key={b.id} className="flex flex-wrap gap-2 md:gap-x-6 justify-between py-5 border-b border-hairline">
                <div className="flex-[999_1_420px] min-w-0">
                  <div className="font-tight font-bold tracking-[-0.015em] text-[20px] leading-[1.25]">{b.id} · {b.title}</div>
                  <div className="text-[17px] leading-[1.45] text-body mt-1">{b.body}</div>
                </div>
                <div className="flex-[1_1_180px] md:text-right font-meta text-[14px] font-semibold"><span aria-hidden="true" className={toneClass[b.tone]}>●</span> {b.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practicing here / buy */}
      <section id="buy" className="max-w-content mx-auto px-5 md:px-8 py-20">
        <div className="grid gap-14" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div>
            <h2 className={`${h2} text-[30px] md:text-[36px] mb-3.5`}>{d.practicing.heading}</h2>
            <p className="text-[17px] leading-[1.5] text-body mb-[18px]">{d.practicing.text}</p>
            <div className="flex flex-col gap-2 font-meta text-[14px] font-medium">
              {d.practicing.links.map((l) =>
                l.href ? (
                  <a key={l.name} href={l.href} className="hover:text-oxblood">{l.name} →</a>
                ) : (
                  <span key={l.name}>{l.name}</span>
                ),
              )}
            </div>
          </div>
          <div>
            <h2 className={`${h2} text-[30px] md:text-[36px] mb-3.5`}>{d.buy.heading}</h2>
            <p className="text-[17px] leading-[1.5] text-body mb-[18px]">{d.buy.text}</p>
            <div className="flex flex-col gap-2.5 font-meta text-[14px] font-medium">
              {d.buy.options.map((o) => (
                <Link
                  key={o.label}
                  href="/reports/"
                  className={`flex justify-between gap-4 px-5 py-4 ${o.primary ? 'bg-green text-paper hover:bg-ink' : 'border border-ink hover:text-oxblood hover:border-oxblood'}`}
                >
                  <span>{o.label}</span>
                  <span className="whitespace-nowrap">{o.price ? `${o.price}${o.perYear ? '/yr' : ''}` : 'Price pending'}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-12 font-meta text-[13px] leading-[1.7] text-muted max-w-[720px]">
          {d.sourcesLine}{' '}
          <Link href="/methodology/" className="text-ink border-b border-hairline hover:text-oxblood">Methodology</Link> ·{' '}
          <a href="https://read.rojasreport.com/about" className="text-ink border-b border-hairline hover:text-oxblood">Report a correction</a>
        </p>
      </section>
    </>
  );
}
