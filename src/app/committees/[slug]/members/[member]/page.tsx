import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WM_BASE, WM_SLUG, wmMembers, wmVotes, wmMeta, getWmMember, seat, roles, usd, longDate, billNumber, pacName } from '@/lib/wm';
import { wrap, eyebrow, h2, th, td, VoteLabel, Source, Crumbs, Stat, outcomeTone, outcomeText } from '@/components/committees/wm/ui';

/** /committees/ways-and-means/members/[member]: one member's dossier. Every figure comes from src/data/committees/wm. */

export const dynamicParams = false;

export function generateStaticParams() {
  return wmMembers.map((m) => ({ slug: WM_SLUG, member: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string; member: string } }): Metadata {
  const m = getWmMember(params.member);
  if (!m) return {};
  const money = m.money['2026'];
  return {
    title: `${m.name} | House Ways and Means`,
    description: `${m.name} (${m.party}-${m.stateCode}) on the House Ways and Means Committee: healthcare PAC money${money ? ` (${usd(money.total)} in the 2026 cycle)` : ''}, 13 key health votes, stock trades and the 2026 result.`,
    alternates: { canonical: `https://rojasreport.com${WM_BASE}/members/${m.slug}/` },
  };
}

const SECTOR_ORDER = ['Hospitals & Nursing Homes', 'Insurance', 'Health Services/HMOs', 'Pharmaceuticals', 'Health Professionals'];

export default function MemberPage({ params }: { params: { slug: string; member: string } }) {
  const m = getWmMember(params.member);
  if (params.slug !== WM_SLUG || !m) notFound();
  const r = roles(m);
  const c26 = m.money['2026'];
  const c24 = m.money['2024'];
  const yes = m.votes.filter((v) => v.vote === 'Aye' || v.vote === 'Yea').length;
  const voteById = new Map(wmVotes.map((v) => [v.id, v]));
  const sectors = c26 ? SECTOR_ORDER.filter((s) => s in c26.bySector).map((s) => [s, c26.bySector[s]] as const).sort((a, b) => b[1] - a[1]) : [];
  const maxSector = Math.max(1, ...sectors.map(([, v]) => v));
  const idx = wmMembers.findIndex((x) => x.slug === m.slug);
  const prev = wmMembers[(idx - 1 + wmMembers.length) % wmMembers.length];
  const next = wmMembers[(idx + 1) % wmMembers.length];

  return (
    <>
      {/* Header */}
      <section className={`${wrap} pt-10 md:pt-14 pb-14`}>
        <Crumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government/' },
            { label: 'House Ways and Means', href: `${WM_BASE}/` },
            { label: 'Members', href: `${WM_BASE}/members/` },
            { label: m.name },
          ]}
        />
        <p className={`${eyebrow} text-oxblood mb-4`}>House Ways and Means · Member dossier</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>{m.name}</h1>
        <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">
          {m.partyName} of {seat(m)}. In the House since {m.firstHouseTerm}.
          {m.healthSubcommittee ? ' Sits on the Health Subcommittee.' : ''}
        </p>
        {r.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {r.map((x) => (
              <li key={x} className="font-tight text-[13px] font-bold uppercase tracking-[0.1em] border-[1.5px] border-ink px-2.5 py-1.5 leading-none">{x}</li>
            ))}
          </ul>
        )}

        <div className="mt-8 bg-paper-2 border-t-4 border-oxblood p-6 md:p-7 max-w-[860px]">
          <p className={`${eyebrow} mb-2`}>2026 election</p>
          <p className={`font-tight font-bold text-[24px] tracking-[-0.02em] ${outcomeTone(m.outcome.status)}`}>{outcomeText(m.outcome.status)}</p>
          <p className="mt-2 text-[17px] leading-[1.55]">{m.outcome.detail}</p>
          <Source href={m.outcome.source}>{m.outcome.sourceLabel}</Source>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4 max-w-[1100px]">
          <Stat value={c26 ? usd(c26.total) : 'None'} label="Healthcare PAC money, 2026 cycle" note={`FEC filings through ${longDate(wmMeta.money['2026'].latestTransactionDate)}`} />
          <Stat value={c24 ? usd(c24.total) : 'None'} label="Healthcare PAC money, 2024 cycle" note="Full cycle" />
          <Stat value={`${yes} of ${m.votes.length}`} label="Key health votes cast yes" />
          <Stat value={m.trades.healthcare.length} label="Healthcare stock trades reported, 2025 to 2026" />
        </div>
      </section>

      {/* Money */}
      <section id="money" className="bg-green text-paper py-16 md:py-20">
        <div className={wrap}>
          <p className={`${eyebrow} text-green-text mb-4`}>Who funds the campaign</p>
          <h2 className={h2}>Healthcare PAC money, 2026 cycle.</h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-green-text-2 max-w-[760px]">
            Contributions from political action committees in healthcare to the {m.name.split(' ').slice(-1)[0]} campaign committee. Individual donations are not counted.
          </p>
          {c26 ? (
            <div className="mt-10 grid gap-12 grid-cols-1 lg:grid-cols-2">
              <div>
                <p className={`${eyebrow} text-green-text mb-3`}>By sector</p>
                <ul>
                  {sectors.map(([s, v]) => (
                    <li key={s} className="py-3 border-b border-green-rule">
                      <div className="flex justify-between gap-4 text-[16px]">
                        <span className="font-semibold">{s}</span>
                        <span className="font-tight font-bold tabular-nums">{usd(v)}</span>
                      </div>
                      <div className="mt-2 h-2 bg-[#2A4A3B]" aria-hidden="true">
                        <div className="h-2 bg-paper" style={{ width: `${(v / maxSector) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[15px] text-green-text-2">{c26.contributionCount} contributions. Sector labels are the Rojas Report&apos;s.</p>
              </div>
              <div>
                <p className={`${eyebrow} text-green-text mb-3`}>Largest healthcare PACs</p>
                <ol>
                  {c26.topPacs.map((p) => (
                    <li key={p.pacId} className="flex justify-between gap-4 py-2.5 border-b border-green-rule text-[16px]">
                      <span>
                        <a href={`https://www.fec.gov/data/committee/${p.pacId}/`} className="hover:underline underline-offset-[3px]">{pacName(p.pac)}</a>
                        <span className="block text-[14px] text-green-text">{p.sector}</span>
                      </span>
                      <span className="font-tight font-bold tabular-nums shrink-0">{usd(p.amount)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-[17px]">No healthcare PAC contributions in the 2026 cycle in FEC filings through {longDate(wmMeta.money['2026'].latestTransactionDate)}.</p>
          )}
          <div className="text-green-text-2 [&_a]:text-paper">
            <Source href={c26?.source ?? wmMeta.moneySourceUrl}>
              {c26?.sourceLabel ?? wmMeta.moneySource}. 2024 cycle: {c24 ? usd(c24.total) : 'none'}, full cycle.
            </Source>
          </div>
        </div>
      </section>

      {/* Votes */}
      <section id="votes" className="py-16 md:py-20">
        <div className={wrap}>
          <p className={`${eyebrow} text-oxblood mb-4`}>The record</p>
          <h2 className={h2}>How {m.name.split(' ').slice(-1)[0]} voted on 13 health bills.</h2>
          <p className="mt-4 text-[17px] leading-[1.55] max-w-[760px]">
            The key health votes on the House floor in 2025 and 2026. Each links to the full roll call.
          </p>
          <div className="table-scroll mt-8">
            <table className="w-full min-w-[640px] border-collapse text-[16px]">
              <thead>
                <tr>
                  <th className={`${th} pr-4 w-[16%]`}>Date</th>
                  <th className={`${th} pr-4`}>Bill</th>
                  <th className={`${th} pr-4 w-[18%]`}>Vote</th>
                  <th className={`${th} w-[12%]`}>House</th>
                </tr>
              </thead>
              <tbody>
                {m.votes.map((v) => {
                  const kv = voteById.get(v.id)!;
                  return (
                    <tr key={v.id}>
                      <td className={`${td} pr-4 whitespace-nowrap`}>{longDate(kv.date)}</td>
                      <td className={`${td} pr-4`}>
                        <Link href={`${WM_BASE}/votes/${kv.id}/`} className="font-tight font-bold text-[17px] leading-[1.25] hover:text-oxblood">
                          {billNumber(kv.legisNum)}, {kv.description}
                        </Link>
                        {kv.why && <span className="block text-[15px] mt-1">{kv.why}</span>}
                      </td>
                      <td className={`${td} pr-4`}><VoteLabel vote={v.vote} /></td>
                      <td className={td}>{kv.result}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Source href="https://clerk.house.gov/Votes">{wmMeta.votesSource}, 2025 and 2026.</Source>
        </div>
      </section>

      {/* Trades */}
      <section id="trades" className="pb-16 md:pb-20">
        <div className={wrap}>
          <div className="border-t border-hairline pt-16 md:pt-20">
            <p className={`${eyebrow} text-oxblood mb-4`}>Stock trades</p>
            <h2 className={h2}>Healthcare stocks bought and sold.</h2>
            {m.trades.healthcare.length > 0 ? (
              <>
                <p className="mt-4 text-[17px] leading-[1.55] max-w-[760px]">
                  Stock trades in healthcare companies, from periodic transaction reports filed in 2025 and 2026. Bonds and funds are not counted. An amended report replaces the trade it corrects.
                </p>
                <div className="table-scroll mt-8">
                  <table className="w-full min-w-[640px] border-collapse text-[16px]">
                    <thead>
                      <tr>
                        <th className={`${th} pr-4`}>Date</th>
                        <th className={`${th} pr-4`}>Company</th>
                        <th className={`${th} pr-4`}>Trade</th>
                        <th className={`${th} pr-4`}>Amount</th>
                        <th className={th}>Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {m.trades.healthcare.map((t, i) => (
                        <tr key={i}>
                          <td className={`${td} pr-4 whitespace-nowrap`}>{t.transactionDate}</td>
                          <td className={`${td} pr-4`}>
                            <a href={t.source} className="font-semibold hover:text-oxblood underline-offset-[3px] hover:underline">{t.asset}</a>
                            {t.ticker && <span className="ml-1.5 text-[14px]">({t.ticker})</span>}
                          </td>
                          <td className={`${td} pr-4`}>{t.transaction}</td>
                          <td className={`${td} pr-4 whitespace-nowrap`}>{t.amount}</td>
                          <td className={td}>{t.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="mt-4 text-[17px] leading-[1.55] max-w-[760px]">
                {m.trades.ptrCount
                  ? `${m.trades.ptrCount} periodic transaction reports filed in 2025 and 2026. None lists a trade in a healthcare company's stock. Bonds and funds are not counted.`
                  : 'No periodic transaction reports filed in 2025 or 2026.'}
              </p>
            )}
            <Source href={m.trades.source}>{m.trades.sourceLabel}{m.trades.asOf ? `, as of ${longDate(m.trades.asOf)}` : ''}.</Source>
          </div>
        </div>
      </section>

      {/* Seats */}
      <section id="seats" className="pb-16 md:pb-20">
        <div className={wrap}>
          <div className="border-t border-hairline pt-16 md:pt-20 grid gap-10 grid-cols-1 lg:grid-cols-2">
            <div>
              <p className={`${eyebrow} text-oxblood mb-4`}>On the committee</p>
              <h2 className={h2}>Seats and subcommittees.</h2>
              <ul className="mt-6 border-t-2 border-ink">
                <li className="flex justify-between gap-4 py-3 border-b border-hairline text-[17px]">
                  <span>Full committee</span>
                  <span className="font-semibold">{m.fullCommitteeRole ?? (m.viceRankingMember ? 'Vice ranking member' : 'Member')}</span>
                </li>
                {m.subcommittees.map((s) => (
                  <li key={s.name} className="flex justify-between gap-4 py-3 border-b border-hairline text-[17px]">
                    <span>{s.name} Subcommittee</span>
                    <span className="font-semibold">{s.role}</span>
                  </li>
                ))}
              </ul>
              <Source href={m.rosterSourceUrl}>{m.rosterSource}. Subcommittee ranking members: the ranking member&apos;s January 8, 2025 release.</Source>
            </div>
            <nav aria-label="More members" className="flex flex-col gap-4 lg:pt-14">
              <Link href={`${WM_BASE}/members/`} className="group flex justify-between items-center border-t-2 border-ink py-5">
                <span className="font-tight font-bold text-[24px] tracking-[-0.02em] group-hover:text-oxblood">All 45 members</span>
                <span aria-hidden="true" className="text-[22px]">→</span>
              </Link>
              <div className="grid grid-cols-2 gap-6">
                <Link href={`${WM_BASE}/members/${prev.slug}/`} className="border-t border-hairline pt-3 hover:text-oxblood">
                  <span className="block text-[14px]">Previous</span>
                  <span className="font-tight font-bold text-[18px]">{prev.name}</span>
                </Link>
                <Link href={`${WM_BASE}/members/${next.slug}/`} className="border-t border-hairline pt-3 text-right hover:text-oxblood">
                  <span className="block text-[14px]">Next</span>
                  <span className="font-tight font-bold text-[18px]">{next.name}</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
