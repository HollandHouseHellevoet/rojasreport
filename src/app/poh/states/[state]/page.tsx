import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POH_BASE, pohStates, getPohState, hospitalsIn, pohMeta, STATUS_ORDER, STATUS_TEXT, type PohStatus } from '@/lib/poh';
import { wrap, eyebrow, Crumbs, Stat, Source } from '@/components/poh/ui';
import HospitalList from '@/components/poh/HospitalList';

/** /poh/states/[state]/: the physician-owned hospitals in one state, with the state's CON rules for context. */

export const dynamicParams = false;

export function generateStaticParams() {
  return pohStates.map((s) => ({ state: s.slug }));
}

export function generateMetadata({ params }: { params: { state: string } }): Metadata {
  const s = getPohState(params.state);
  if (!s) return {};
  return {
    title: `Physician-owned hospitals in ${s.name} | Physician-Owned`,
    description: `${s.total} physician-owned hospitals in ${s.name} on the Rojas Report list: who still owns them, who bought them, and which closed. Re-verified November 2026.`,
    alternates: { canonical: `https://rojasreport.com${POH_BASE}/states/${s.slug}/` },
  };
}

function conLine(name: string, tier: string | null, status: string | null): string | null {
  if (!tier || !status) return null;
  if (status === 'No') return `${name} has no certificate-of-need law.`;
  if (status === 'Repealed') return `${name} repealed most of its certificate-of-need law. The Rojas Report ranks it ${tier}.`;
  if (status === 'Limited') return `${name} keeps a limited certificate-of-need law. The Rojas Report ranks it ${tier}.`;
  if (status === 'Repealing') return `${name} is phasing out its certificate-of-need law. The Rojas Report ranks it ${tier}.`;
  return `${name} keeps a certificate-of-need law. The Rojas Report ranks it ${tier}.`;
}

export default function StatePage({ params }: { params: { state: string } }) {
  const s = getPohState(params.state);
  if (!s) notFound();
  const hs = hospitalsIn(s.code);
  const still = (s.byStatus['Physician-owned'] ?? 0) + (s.byStatus['Joint venture'] ?? 0);
  const con = conLine(s.name, s.conTier, s.conStatus);
  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-12`}>
        <Crumbs items={[{ label: 'Home', href: '/' }, { label: 'Physician-Owned', href: '/physician-owned/' }, { label: 'Physician-owned hospitals', href: `${POH_BASE}/` }, { label: 'States', href: `${POH_BASE}/states/` }, { label: s.name }]} />
        <p className={`${eyebrow} text-oxblood mb-4`}>Physician-owned hospitals · {s.name}</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>{s.name}</h1>
        <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">
          {s.total} {s.total === 1 ? 'hospital' : 'hospitals'} on the list. {still} still {still === 1 ? 'has' : 'have'} physician owners, alone or with a partner.
        </p>
        <div className="mt-10 grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4 max-w-[1100px]">
          {STATUS_ORDER.slice(0, 4).map((st) => (
            <Stat key={st} value={s.byStatus[st] ?? 0} label={STATUS_TEXT[st as PohStatus].plural} />
          ))}
        </div>
        {con && (
          <div className="mt-10 bg-paper-2 border-t-4 border-green p-6 max-w-[860px]">
            <p className={`${eyebrow} mb-2`}>The state&apos;s rules</p>
            <p className="text-[17px] leading-[1.55]">{con}</p>
            <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              {s.statePage && <Link href={s.statePage} className="font-tight font-semibold border-b-[1.5px] border-current pb-0.5 hover:text-oxblood">{s.name} state page →</Link>}
              <Link href="/con/" className="font-tight font-semibold border-b-[1.5px] border-current pb-0.5 hover:text-oxblood">How CON is ranked →</Link>
            </p>
          </div>
        )}
      </section>
      <section className="pb-20 md:pb-[104px]">
        <div className={wrap}>
          <HospitalList hospitals={hs} showState={false} />
          <Source>{pohMeta.method}</Source>
        </div>
      </section>
    </>
  );
}
