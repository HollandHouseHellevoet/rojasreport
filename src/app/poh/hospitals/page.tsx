import type { Metadata } from 'next';
import Link from 'next/link';
import { POH_BASE, pohHospitals, pohMeta, STATUS_ORDER, STATUS_TEXT, type PohStatus } from '@/lib/poh';
import { wrap, eyebrow, Crumbs, Stat, Source } from '@/components/poh/ui';
import HospitalList from '@/components/poh/HospitalList';

/** /poh/hospitals/: every hospital on the list, with its status, owner and source. */

export const metadata: Metadata = {
  title: 'Every physician-owned hospital | Physician-Owned',
  description: `The ${pohMeta.tracked} hospitals on the Rojas Report list, each re-verified in November 2026: who owns it now, and the source.`,
  alternates: { canonical: `https://rojasreport.com${POH_BASE}/hospitals/` },
};

export default function HospitalsPage() {
  const by = pohMeta.byStatus as Record<string, number>;
  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-12`}>
        <Crumbs items={[{ label: 'Home', href: '/' }, { label: 'Physician-Owned', href: '/physician-owned/' }, { label: 'Physician-owned hospitals', href: `${POH_BASE}/` }, { label: 'Every hospital' }]} />
        <p className={`${eyebrow} text-oxblood mb-4`}>Physician-owned hospitals · The list</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>Every hospital, checked.</h1>
        <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">
          {pohMeta.tracked} hospitals across {pohMeta.statesCount} states. Each one was re-checked in November 2026, with a dated source for who owns it now.
        </p>
        <div className="mt-10 grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4 max-w-[1100px]">
          {STATUS_ORDER.slice(0, 4).map((s) => (
            <Stat key={s} value={by[s] ?? 0} label={STATUS_TEXT[s as PohStatus].plural} />
          ))}
        </div>
      </section>
      <section className="pb-20 md:pb-[104px]">
        <div className={wrap}>
          <HospitalList hospitals={pohHospitals} />
          <Source>{pohMeta.method}</Source>
          <p className="mt-6 text-[15px]">
            <Link href={`${POH_BASE}/states/`} className="font-tight font-semibold border-b-[1.5px] border-current pb-0.5 hover:text-oxblood">By state →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
