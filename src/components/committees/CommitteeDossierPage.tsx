import Link from 'next/link';
import PendingChip from '@/components/PendingChip';
import PrintButton from '@/components/PrintButton';
import { compact, type CommitteeRecord } from '@/lib/committees';
import type { Tone } from '@/lib/stateDossiers';

/** Committee dossier, built to docs/mockups/committee-dossier.dc.html. Every figure comes from the committee's data file. */

const eyebrow = 'font-meta text-[13px] font-semibold uppercase tracking-[0.1em]';
const h2 = 'font-display font-normal leading-[1.1]';
const button = 'font-meta text-[14px] font-medium text-center px-[18px] py-3.5';
const th = 'font-normal pt-2.5 pb-2.5 border-b border-ink';
const td = 'py-3.5 border-b border-hairline';

const toneClass: Record<Tone, string> = { red: 'text-oxblood', gold: 'text-gold', grey: 'text-muted', green: 'text-green' };

function Heading({ title, aside, rule = true, size = 44 }: { title: string; aside: string; rule?: boolean; size?: 40 | 44 }) {
  return (
    <div className={`flex flex-wrap justify-between items-baseline gap-3 ${rule ? 'border-t border-ink pt-5 mb-9' : 'mb-2'}`}>
      <h2 className={`${h2} text-[32px] md:text-[${size}px]`}>{title}</h2>
      <span className="italic text-[17px] text-muted">{aside}</span>
    </div>
  );
}

/** A dash for a pending figure, marked so it is never read as a zero. */
function Pending({ label = 'pending' }: { label?: string }) {
  return <PendingChip label={label.charAt(0).toUpperCase() + label.slice(1)} />;
}

/** Member dossiers and key votes, where a committee has them (Ways and Means). */
export interface CommitteeDesk {
  base: string;
  memberSlugs: string[];
  members: number;
  votes: number;
  notReturning: number;
}

function MemberName({ name, slug, desk }: { name: string; slug?: string; desk?: CommitteeDesk }) {
  const cls = 'font-tight font-bold tracking-[-0.015em] text-[18px]';
  if (desk && slug && desk.memberSlugs.includes(slug)) {
    return <Link href={`${desk.base}/members/${slug}/`} className={`${cls} hover:text-oxblood underline-offset-[3px] hover:underline`}>{name}</Link>;
  }
  return <span className={cls}>{name}</span>;
}

const slugOf = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

export default function CommitteeDossierPage({ c, desk }: { c: CommitteeRecord; desk?: CommitteeDesk }) {
  return (
    <>
      {/* Committee switcher */}
      <div className="border-b border-hairline">
        <nav aria-label="Committees" className="max-w-content mx-auto px-5 md:px-8 flex flex-wrap gap-x-8 gap-y-1 text-[17px]">
          {c.tabs.map((t) =>
            t.slug === c.slug ? (
              <span key={t.slug} className="py-3.5 border-b-2 border-oxblood text-oxblood" aria-current="page">{t.name}</span>
            ) : t.status === 'live' ? (
              <Link key={t.slug} href={`/committees/${t.slug}/`} className="py-3.5 text-muted hover:text-oxblood">{t.name}</Link>
            ) : (
              <span key={t.slug} className="py-3.5 text-muted" title="In preparation">{t.name}</span>
            ),
          )}
        </nav>
      </div>

      {/* Title */}
      <section className="max-w-content mx-auto px-5 md:px-8 pt-12 pb-14">
        <nav aria-label="Breadcrumb" className="font-meta text-[13px] tracking-[0.1em] text-muted mb-7">
          <Link href="/government/" className="text-muted hover:text-oxblood">/Government</Link>{' '}
          <span className="text-ink">/{c.name}</span>
        </nav>
        <p className={`${eyebrow} text-muted mb-3`}>Committee Dossier · {c.congress}</p>
        <h1 className="font-display font-normal text-[52px] md:text-[68px] lg:text-[76px] leading-[1] text-oxblood">{c.name}</h1>
        <p className="mt-[22px] max-w-[780px] italic text-[23px] leading-[1.45] text-body" title={c.verdictSource}>{c.verdict}</p>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <PrintButton label="Download the committee brief (PDF)" className={`${button} border border-ink hover:text-oxblood hover:border-oxblood`} />
          <a href="#buy" className={`${button} no-print bg-green text-paper hover:bg-ink`}>
            Get the member dataset
          </a>
        </div>
      </section>

      {/* Plain English */}
      <section className="border-t border-hairline">
        <div className="max-w-content mx-auto px-5 md:px-8 pt-16 pb-[72px] flex flex-wrap gap-14" title={c.plainEnglish.source}>
          <div className="flex-[1_1_320px] min-w-0">
            <div className="font-meta text-[13px] font-semibold uppercase tracking-[0.1em] text-oxblood mb-2.5">{c.plainEnglish.kicker}</div>
            <h2 className={`${h2} text-[34px] md:text-[44px]`}>{c.plainEnglish.heading}</h2>
            <p className="mt-[18px] text-[17px] leading-[1.5] text-body">{c.plainEnglish.intro}</p>
          </div>
          <ol className="flex-[999_1_520px] min-w-0 list-none m-0 p-0">
            {c.plainEnglish.points.map((p, i) => (
              <li key={p.title} className={`flex gap-5 ${i === 0 ? 'pb-[22px]' : i === c.plainEnglish.points.length - 1 ? 'pt-[22px]' : 'py-[22px]'} ${i < c.plainEnglish.points.length - 1 ? 'border-b border-hairline' : ''}`}>
                <span className="font-display text-[40px] leading-none text-oxblood w-8 shrink-0">{i + 1}</span>
                <div>
                  <div className="font-tight font-bold tracking-[-0.015em] text-[22px] leading-[1.2]">{p.title}</div>
                  <div className="text-[17px] leading-[1.5] text-body mt-1">{p.body}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What it controls */}
      <section className="bg-oxblood text-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 pt-[72px] pb-16" title={c.controls.source}>
          <div className="flex flex-wrap justify-between items-baseline gap-3 mb-10">
            <h2 className={`${h2} text-[34px] md:text-[40px] text-paper`}>What it controls</h2>
            <span className="italic text-[17px] text-oxblood-text">{c.controls.subtitle}</span>
          </div>
          <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {c.controls.items.map((k) => (
              <div key={k.title} className="flex flex-col gap-2.5 border-t border-oxblood-rule pt-5">
                <div className="font-tight font-bold tracking-[-0.015em] text-[24px] leading-[1.1] text-paper">{k.title}</div>
                <div className="text-[17px] leading-[1.45] text-green-text-2">{k.body}</div>
                <div className="font-meta text-[13px] leading-[1.6] text-oxblood-text">{k.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who runs it */}
      <section className="max-w-content mx-auto px-5 md:px-8 pt-20 pb-10" title={c.whoRuns.source}>
        <Heading title={c.whoRuns.heading} aside={c.whoRuns.subtitle} />
        <div className="grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
          {c.whoRuns.people.map((p) => (
            <div key={p.name} className="flex gap-6 items-start" title={p.source}>
              <div aria-hidden="true" className="flex-none w-[120px] h-[150px] bg-placeholder flex items-center justify-center font-meta text-[13px] text-muted">
                Portrait pending
              </div>
              <div>
                <div className="italic text-[17px] text-muted">{p.label}</div>
                <div className="font-tight font-bold tracking-[-0.015em] text-[28px] leading-[1.1]">{p.name}</div>
                <div className="text-[17px] text-body mt-1 mb-3">{p.line}</div>
                <p className="text-[17px] leading-[1.5]">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who is leaving */}
      <section className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-20">
        <Heading title={c.leaving.heading} aside={c.leaving.asOf} />
        <p className="-mt-6 mb-6 max-w-[760px] text-[17px] leading-[1.5] text-body" title={c.leaving.introSource}>{c.leaving.intro}</p>
        <div className="table-scroll">
          <table className="w-full min-w-[640px] border-collapse text-[17px]">
            <thead>
              <tr className="text-left italic text-[16px] text-muted">
                <th className={`${th} pr-4`}>{c.chamber === 'Senate' ? 'Senator' : 'Member'}</th>
                <th className={`${th} pr-4`}>Why</th>
                <th className={th}>What goes with them</th>
              </tr>
            </thead>
            <tbody>
              {c.leaving.rows.map((r) => (
                <tr key={r.name} title={r.source}>
                  <td className={`${td} pr-4 whitespace-nowrap`}>
                    <MemberName name={r.name} slug={slugOf(r.name)} desk={desk} /> <span className="text-muted">{r.party}</span>
                  </td>
                  <td className={`${td} pr-4 ${toneClass[r.tone]}`}>{r.why}</td>
                  <td className={`${td} text-body`}>{r.loss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scorecard */}
      <section id="scorecard" className="bg-paper-2 border-y border-hairline">
        <div className="max-w-content mx-auto px-5 md:px-8 py-[72px]" title={c.scorecard.source}>
          <Heading title={c.scorecard.heading} aside={c.scorecard.subtitle} rule={false} size={40} />
          <p className="mb-5 max-w-[760px] text-[17px] leading-[1.5] text-body">{c.scorecard.intro}</p>
          <div className="table-scroll">
            <table className="w-full min-w-[1000px] border-collapse text-[17px]">
              <thead>
                <tr className="text-left italic text-[15px] text-muted">
                  <th className={`${th} pr-4`}>Member</th>
                  {c.scorecard.columns.map((col) => (
                    <th key={col} className={`${th} px-3 text-center`}>{col}</th>
                  ))}
                  <th className={`${th} px-3 text-right`}>Hospital PAC money</th>
                  <th className={`${th} text-right`}>Machine Score</th>
                </tr>
              </thead>
              <tbody>
                {c.scorecard.members.map((m) => (
                  <tr key={m.slug}>
                    <td className={`${td} pr-4`}>
                      <MemberName name={m.name} slug={m.slug} desk={desk} /> <span className="text-muted">{m.party}</span>
                      <div className="italic text-[15px] text-muted">{m.role}</div>
                    </td>
                    {Object.values(m.records).map((v, i) => (
                      <td key={i} className={`${td} px-3 text-center text-muted`}>{v ?? <Pending label="record" />}</td>
                    ))}
                    <td className={`${td} px-3 text-right font-tight font-semibold tabular-nums whitespace-nowrap`} title={m.hospitalMoney.source}>
                      {m.hospitalMoney.value == null ? <Pending /> : compact(m.hospitalMoney.value)}
                    </td>
                    <td className={`${td} text-right font-display text-[26px] text-oxblood whitespace-nowrap`}>
                      {m.machineScore ?? <Pending />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 italic text-[16px] text-muted">{c.scorecard.note}</p>
        </div>
      </section>

      {/* Member dossiers and key votes */}
      {desk && (
        <section className="bg-ink text-paper">
          <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20 grid gap-10 grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center">
            <div>
              <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-text mb-4">Every member, every vote</p>
              <h2 className="font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[30px] md:text-[44px]">Follow the money to each seat.</h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-text-2">A dossier for each of the {desk.members} members: healthcare PAC money, {desk.votes} key health votes, stock trades and the 2026 result.</p>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <Link href={`${desk.base}/members/`} className="group border-t-2 border-oxblood-rule pt-5 pb-2">
                <span className="block font-tight font-extrabold text-[52px] leading-none tracking-[-0.04em]">{desk.members}</span>
                <span className="mt-2 flex items-center gap-2 font-tight font-bold text-[20px] group-hover:underline underline-offset-4">Member dossiers <span aria-hidden="true">→</span></span>
              </Link>
              <Link href={`${desk.base}/votes/`} className="group border-t-2 border-oxblood-rule pt-5 pb-2">
                <span className="block font-tight font-extrabold text-[52px] leading-none tracking-[-0.04em]">{desk.votes}</span>
                <span className="mt-2 flex items-center gap-2 font-tight font-bold text-[20px] group-hover:underline underline-offset-4">Key health votes <span aria-hidden="true">→</span></span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Docket */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20">
        <Heading title={c.docket.heading} aside={c.docket.subtitle} />
        <div className="grid border-t border-hairline" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {c.docket.items.map((d) => (
            <article key={d.title} className="pt-[26px] pb-[30px] md:pr-8 border-b border-hairline flex flex-col gap-2.5" title={d.source}>
              <h3 className="font-tight font-bold tracking-[-0.015em] text-[22px] leading-[1.2]">{d.title}</h3>
              <p className="text-[17px] leading-[1.5] text-body">{d.body}</p>
              <div className="font-meta text-[14px] font-semibold"><span aria-hidden="true" className={toneClass[d.tone]}>●</span> {d.status}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Staff / buy */}
      <section id="buy" className="bg-paper-2 border-t border-hairline">
        <div className="max-w-content mx-auto px-5 md:px-8 py-[72px] grid gap-14" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div>
            <h2 className={`${h2} text-[30px] md:text-[36px] mb-3.5`}>{c.staff.heading}</h2>
            <p className="text-[17px] leading-[1.5] text-body">{c.staff.text}</p>
          </div>
          <div className="flex flex-col gap-2.5 justify-center font-meta text-[14px] font-medium">
            {c.staff.options.map((o) =>
              o.href.startsWith('http') ? (
                <a key={o.label} href={o.href} className={`flex justify-between gap-4 px-5 py-4 ${o.primary ? 'bg-green text-paper hover:bg-ink' : 'border border-ink hover:text-oxblood hover:border-oxblood'}`}>
                  <span>{o.label}</span>
                  <span className="whitespace-nowrap">{o.price ?? 'Price pending'}</span>
                </a>
              ) : (
                <Link key={o.label} href={o.href} className={`flex justify-between gap-4 px-5 py-4 ${o.primary ? 'bg-green text-paper hover:bg-ink' : 'border border-ink hover:text-oxblood hover:border-oxblood'}`}>
                  <span>{o.label}</span>
                  <span className="whitespace-nowrap">{o.price ?? 'Price pending'}</span>
                </Link>
              ),
            )}
          </div>
        </div>
        <div className="max-w-content mx-auto px-5 md:px-8 pb-12">
          <p className="font-meta text-[13px] leading-[1.7] text-muted max-w-[720px]">
            {c.sourcesLine}{' '}
            <Link href="/methodology/machine-score/" className="text-ink border-b border-hairline hover:text-oxblood">How the Machine Score works</Link> ·{' '}
            <a href="https://read.rojasreport.com/about" className="text-ink border-b border-hairline hover:text-oxblood">Report a correction</a>
          </p>
        </div>
      </section>
    </>
  );
}
