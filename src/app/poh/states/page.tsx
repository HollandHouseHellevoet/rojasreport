import type { Metadata } from 'next';
import Link from 'next/link';
import { POH_BASE, pohStates, pohMeta } from '@/lib/poh';
import { wrap, eyebrow, th, td, Crumbs, Source } from '@/components/poh/ui';

/** /poh/states/: physician-owned hospitals by state. */

export const metadata: Metadata = {
  title: 'Physician-owned hospitals by state | Physician-Owned',
  description: `Physician-owned hospitals in ${pohMeta.statesCount} states: how many are left, how many were sold, how many closed.`,
  alternates: { canonical: `https://rojasreport.com${POH_BASE}/states/` },
};

export default function StatesIndex() {
  const rows = [...pohStates].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-12`}>
        <Crumbs items={[{ label: 'Home', href: '/' }, { label: 'Physician-Owned', href: '/physician-owned/' }, { label: 'Physician-owned hospitals', href: `${POH_BASE}/` }, { label: 'States' }]} />
        <p className={`${eyebrow} text-oxblood mb-4`}>Physician-owned hospitals · By state</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>{pohMeta.statesCount} states.</h1>
        <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">Where the hospitals on the list are, and what happened to them. Most restrictive CON states have the fewest.</p>
      </section>
      <section className="pb-20 md:pb-[104px]">
        <div className={wrap}>
          <div className="table-scroll">
            <table className="w-full min-w-[720px] border-collapse text-[16px] border-t-2 border-ink">
              <thead>
                <tr>
                  <th className={`${th} pr-4`}>State</th>
                  <th className={`${th} pr-4 text-right`}>On the list</th>
                  <th className={`${th} pr-4 text-right`}>Physician-owned</th>
                  <th className={`${th} pr-4 text-right`}>Joint ventures</th>
                  <th className={`${th} pr-4 text-right`}>Sold</th>
                  <th className={`${th} pr-4 text-right`}>Closed</th>
                  <th className={th}>CON law</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.code}>
                    <td className={`${td} pr-4`}>
                      <Link href={`${POH_BASE}/states/${s.slug}/`} className="font-tight font-bold text-[18px] hover:text-oxblood">{s.name}</Link>
                    </td>
                    <td className={`${td} pr-4 text-right font-tight font-bold tabular-nums`}>{s.total}</td>
                    <td className={`${td} pr-4 text-right tabular-nums`}>{s.byStatus['Physician-owned'] ?? 0}</td>
                    <td className={`${td} pr-4 text-right tabular-nums`}>{s.byStatus['Joint venture'] ?? 0}</td>
                    <td className={`${td} pr-4 text-right tabular-nums`}>{s.byStatus['Sold or acquired'] ?? 0}</td>
                    <td className={`${td} pr-4 text-right tabular-nums`}>{s.byStatus['Closed'] ?? 0}</td>
                    <td className={`${td} text-[15px]`}>{s.conStatus === 'No' ? 'None' : s.conTier ?? 'Not ranked'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Source>Hospital statuses: {pohMeta.method} CON law: the Rojas Report CON rankings.</Source>
        </div>
      </section>
    </>
  );
}
