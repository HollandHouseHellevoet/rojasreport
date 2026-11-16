import type { Metadata } from 'next';
import Link from 'next/link';
import { POH_BASE, pohMeta, pohStates, STATUS_ORDER, STATUS_TEXT, type PohStatus } from '@/lib/poh';
import { wrap, eyebrow, h2, th, td, Crumbs, Source } from '@/components/poh/ui';

/** /poh/: the physician-owned hospitals desk. Figures from src/data/poh (scripts/build_poh.py). */

export const metadata: Metadata = {
  title: 'Physician-owned hospitals | Physician-Owned',
  description: 'Physician-owned hospitals in America: how many are left, who bought the rest, and the law that froze them in 2010. Every hospital re-verified in November 2026.',
  alternates: { canonical: `https://rojasreport.com${POH_BASE}/` },
};

const big = 'font-tight font-extrabold text-[44px] md:text-[64px] leading-none tracking-[-0.04em] tabular-nums';

export default function PohHome() {
  const by = pohMeta.byStatus as Record<string, number>;
  const top = [...pohStates].sort((a, b) => b.total - a.total).slice(0, 8);
  const h = pohMeta.headline;
  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-16`}>
        <Crumbs items={[{ label: 'Home', href: '/' }, { label: 'Physician-Owned', href: '/physician-owned/' }, { label: 'Physician-owned hospitals' }]} />
        <p className={`${eyebrow} text-oxblood mb-4`}>Physician-owned hospitals</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em] max-w-[1000px]" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>Frozen in 2010.</h1>
        <p className="mt-6 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">
          Section 6001 of the Affordable Care Act closed Medicare to new physician-owned hospitals and capped the ones already open. This desk tracks what happened to them.
        </p>
        <div className="mt-12 grid gap-8 grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
          <div className="bg-ink text-paper p-7 md:p-8 border-t-2 border-oxblood-rule">
            <div className={big}>{h.value}</div>
            <p className="mt-3 text-[17px] leading-[1.5]">Acute care hospitals owned in part or fully by physicians, as CMS stated in April 2026, citing a 2015 study.</p>
            <p className="mt-4 text-[14px] leading-[1.6] text-ink-text-2">
              Source: <a href={h.source} className="underline underline-offset-[3px] text-paper">{h.sourceLabel}</a>.
            </p>
          </div>
          <div className="grid gap-x-6 gap-y-8 grid-cols-2">
            {STATUS_ORDER.slice(0, 4).map((s) => (
              <div key={s} className="border-t-2 border-ink pt-3">
                <div className={`${big} !text-[40px] md:!text-[56px]`}>{by[s] ?? 0}</div>
                <div className="mt-2 text-[15px] font-semibold">{STATUS_TEXT[s as PohStatus].plural}</div>
                <div className="mt-1 text-[14px] leading-[1.45]">{STATUS_TEXT[s as PohStatus].blurb}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-8 text-[17px] leading-[1.55] max-w-[860px]">
          These four figures cover {STATUS_ORDER.slice(0, 4).reduce((a, s) => a + (by[s] ?? 0), 0)} of the {pohMeta.tracked} hospitals on the Rojas Report list. The rest are under development or not confirmed. Each was re-checked in November 2026.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`${POH_BASE}/hospitals/`} className="inline-flex items-center gap-2.5 min-h-[48px] px-[22px] font-tight font-semibold text-[15px] border-[1.5px] bg-oxblood text-paper border-oxblood hover:bg-oxblood-hover">Every hospital →</Link>
          <Link href={`${POH_BASE}/states/`} className="inline-flex items-center gap-2.5 min-h-[48px] px-[22px] font-tight font-semibold text-[15px] border-[1.5px] border-ink hover:bg-ink hover:text-paper">By state</Link>
        </div>
      </section>

      <section className="bg-green text-paper py-16 md:py-20">
        <div className={wrap}>
          <p className={`${eyebrow} text-green-text mb-4`}>Where they are</p>
          <h2 className={h2}>The states with the most.</h2>
          <div className="table-scroll mt-8">
            <table className="w-full min-w-[640px] border-collapse text-[16px]">
              <thead>
                <tr className="text-left">
                  {['State', 'On the list', 'Physician-owned', 'Joint ventures', 'Sold', 'Closed'].map((c, i) => (
                    <th key={c} className={`font-tight text-[13px] font-semibold uppercase tracking-[0.12em] py-3.5 border-b border-paper ${i ? 'text-right pr-4' : 'pr-4'}`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {top.map((s) => (
                  <tr key={s.code}>
                    <td className="py-3.5 border-b border-green-rule pr-4">
                      <Link href={`${POH_BASE}/states/${s.slug}/`} className="font-tight font-bold text-[18px] hover:underline underline-offset-4">{s.name}</Link>
                    </td>
                    <td className="py-3.5 border-b border-green-rule pr-4 text-right font-tight font-bold tabular-nums">{s.total}</td>
                    <td className="py-3.5 border-b border-green-rule pr-4 text-right tabular-nums">{s.byStatus['Physician-owned'] ?? 0}</td>
                    <td className="py-3.5 border-b border-green-rule pr-4 text-right tabular-nums">{s.byStatus['Joint venture'] ?? 0}</td>
                    <td className="py-3.5 border-b border-green-rule pr-4 text-right tabular-nums">{s.byStatus['Sold or acquired'] ?? 0}</td>
                    <td className="py-3.5 border-b border-green-rule pr-4 text-right tabular-nums">{s.byStatus['Closed'] ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6"><Link href={`${POH_BASE}/states/`} className="font-tight font-semibold border-b-[1.5px] border-current pb-0.5">All {pohMeta.statesCount} states →</Link></p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className={`${wrap} grid gap-6 grid-cols-1 md:grid-cols-2`}>
          <Link href={`${POH_BASE}/investigation/`} className="group bg-paper-2 p-8 flex flex-col gap-3 border-t-2 border-ink">
            <span className={`${eyebrow} text-oxblood`}>The investigation</span>
            <span className="font-tight font-bold text-[28px] leading-[1.1] tracking-[-0.02em] group-hover:text-oxblood">Section 6001: who wrote the ban, and what it did.</span>
            <span className="mt-auto font-tight font-semibold text-[15px]">Read it →</span>
          </Link>
          <Link href={`${POH_BASE}/evidence/`} className="group bg-paper-2 p-8 flex flex-col gap-3 border-t-2 border-ink">
            <span className={`${eyebrow} text-oxblood`}>The evidence</span>
            <span className="font-tight font-bold text-[28px] leading-[1.1] tracking-[-0.02em] group-hover:text-oxblood">What the studies and the payers say about physician-owned hospitals.</span>
            <span className="mt-auto font-tight font-semibold text-[15px]">Read it →</span>
          </Link>
        </div>
        <div className={wrap}>
          <Source>{pohMeta.method}</Source>
        </div>
      </section>
    </>
  );
}
