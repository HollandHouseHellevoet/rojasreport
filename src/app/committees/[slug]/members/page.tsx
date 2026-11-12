import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WM_BASE, WM_SLUG, wmMembers, wmMeta, roles, usd, shortUsd, longDate } from '@/lib/wm';
import { wrap, eyebrow, h2, th, td, Source, Crumbs, Stat, outcomeTone, outcomeText } from '@/components/committees/wm/ui';

/** /committees/ways-and-means/members/: the roster, with healthcare PAC money and the 2026 result for each member. */

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: WM_SLUG }];
}

export const metadata: Metadata = {
  title: 'Members | House Ways and Means',
  description: 'All 45 members of the House Ways and Means Committee: roles, healthcare PAC money, key health votes and who is not coming back in 2027.',
  alternates: { canonical: `https://rojasreport.com${WM_BASE}/members/` },
};

export default function MembersIndex({ params }: { params: { slug: string } }) {
  if (params.slug !== WM_SLUG) notFound();
  const groups = [
    { label: 'Republicans', party: 'R' as const },
    { label: 'Democrats', party: 'D' as const },
  ];
  const m26 = wmMeta.money['2026'];

  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-14`}>
        <Crumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government/' },
            { label: 'House Ways and Means', href: `${WM_BASE}/` },
            { label: 'Members' },
          ]}
        />
        <p className={`${eyebrow} text-oxblood mb-4`}>House Ways and Means · 119th Congress</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>The members.</h1>
        <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">
          Who sits on the committee that writes Medicare&apos;s payment rules, who funds them from healthcare, and who is not coming back in January.
        </p>
        <div className="mt-12 grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4 max-w-[1100px]">
          <Stat value={wmMeta.counts.members} label="Members" note={`${wmMeta.counts.republicans} Republicans, ${wmMeta.counts.democrats} Democrats`} />
          <Stat value={shortUsd(m26.committeeTotal)} label="Healthcare PAC money, 2026 cycle" note={`${usd(m26.committeeTotal)} from ${m26.pacsMatched} PACs, through ${longDate(m26.latestTransactionDate)}`} />
          <Stat value={wmMeta.notReturning} label="Not coming back in 2027" note={wmMeta.notCalled.length ? `${wmMeta.notCalled.length} race not called` : undefined} />
          <Stat value={wmMeta.counts.healthSubcommittee} label="On the Health Subcommittee" />
        </div>
      </section>

      {groups.map((g) => {
        const rows = wmMembers.filter((m) => m.party === g.party);
        return (
          <section key={g.party} className="pb-16 md:pb-20">
            <div className={wrap}>
              <div className="border-t border-hairline pt-14 md:pt-16">
                <h2 className={h2}>{g.label}</h2>
                <div className="table-scroll mt-8">
                  <table className="w-full min-w-[760px] border-collapse text-[16px]">
                    <thead>
                      <tr>
                        <th className={`${th} pr-4`}>Member</th>
                        <th className={`${th} pr-4`}>Role</th>
                        <th className={`${th} pr-4 text-right`}>Healthcare PACs, 2026</th>
                        <th className={th}>2026 election</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((m) => {
                        const r = roles(m);
                        return (
                          <tr key={m.slug}>
                            <td className={`${td} pr-4`}>
                              <Link href={`${WM_BASE}/members/${m.slug}/`} className="font-tight font-bold text-[18px] tracking-[-0.01em] hover:text-oxblood">{m.name}</Link>
                              <span className="block text-[14px]">{m.stateCode}{m.district === 'Delegate' ? ', delegate' : `, ${m.district}`}</span>
                            </td>
                            <td className={`${td} pr-4 text-[15px]`}>
                              {r.length ? r.join('; ') : m.healthSubcommittee ? 'Health Subcommittee' : 'Member'}
                            </td>
                            <td className={`${td} pr-4 text-right font-tight font-semibold tabular-nums whitespace-nowrap`}>
                              {m.money['2026'] ? usd(m.money['2026'].total) : '$0'}
                            </td>
                            <td className={`${td} font-semibold ${outcomeTone(m.outcome.status)}`}>{outcomeText(m.outcome.status)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="pb-20 md:pb-[104px]">
        <div className={wrap}>
          <Source href={wmMeta.moneySourceUrl}>
            Roster and roles: Clerk of the House, Member Data XML, published November 3, 2026. Money: {wmMeta.moneySource}; {wmMeta.moneyBasis} 2026 election: one source per member, on each dossier.
          </Source>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={`${WM_BASE}/votes/`} className="inline-flex items-center gap-2.5 min-h-[48px] px-[22px] font-tight font-semibold text-[15px] border-[1.5px] bg-oxblood text-paper border-oxblood hover:bg-oxblood-hover">13 key health votes →</Link>
            <Link href={`${WM_BASE}/`} className="inline-flex items-center gap-2.5 min-h-[48px] px-[22px] font-tight font-semibold text-[15px] border-[1.5px] border-ink hover:bg-ink hover:text-paper">The committee dossier</Link>
          </div>
        </div>
      </section>
    </>
  );
}
