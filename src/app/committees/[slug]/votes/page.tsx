import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WM_BASE, WM_SLUG, wmVotes, wmMeta, longDate, billNumber } from '@/lib/wm';
import { wrap, eyebrow, th, td, Source, Crumbs } from '@/components/committees/wm/ui';

/** /committees/ways-and-means/votes/: the 13 key health votes of the 119th Congress and how the committee split. */

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: WM_SLUG }];
}

export const metadata: Metadata = {
  title: 'Key health votes | House Ways and Means',
  description: 'The 13 key health votes on the House floor in 2025 and 2026, and how each Ways and Means member voted.',
  alternates: { canonical: `https://rojasreport.com${WM_BASE}/votes/` },
};

function tally(t: Record<string, number>) {
  const yes = (t.Yea ?? 0) + (t.Aye ?? 0);
  const no = (t.Nay ?? 0) + (t.No ?? 0);
  return { yes, no };
}

export default function VotesIndex({ params }: { params: { slug: string } }) {
  if (params.slug !== WM_SLUG) notFound();
  const scanned = Object.values(wmMeta.votesScanned as Record<string, number>).reduce((a, b) => a + b, 0);
  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-14`}>
        <Crumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government/' },
            { label: 'House Ways and Means', href: `${WM_BASE}/` },
            { label: 'Key health votes' },
          ]}
        />
        <p className={`${eyebrow} text-oxblood mb-4`}>House Ways and Means · The record</p>
        <h1 className="font-tight font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>13 health votes.</h1>
        <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">
          Of {scanned} House roll calls from January 2025 through November 8, 2026, {wmMeta.healthVotesMatched} touched health. These 13 decided the most. Here is how the committee&apos;s 45 members voted.
        </p>
      </section>

      <section className="pb-20 md:pb-[104px]">
        <div className={wrap}>
          <div className="table-scroll">
            <table className="w-full min-w-[720px] border-collapse text-[16px] border-t-2 border-ink">
              <thead>
                <tr>
                  <th className={`${th} pr-4 w-[15%]`}>Date</th>
                  <th className={`${th} pr-4`}>Bill</th>
                  <th className={`${th} pr-4 w-[12%]`}>House</th>
                  <th className={`${th} w-[18%] text-right`}>Committee yes / no</th>
                </tr>
              </thead>
              <tbody>
                {wmVotes.map((v) => {
                  const t = tally(v.waysAndMeansTally);
                  return (
                    <tr key={v.id}>
                      <td className={`${td} pr-4 whitespace-nowrap`}>{longDate(v.date)}</td>
                      <td className={`${td} pr-4`}>
                        <Link href={`${WM_BASE}/votes/${v.id}/`} className="font-tight font-bold text-[18px] leading-[1.25] hover:text-oxblood">
                          {billNumber(v.legisNum)}, {v.description}
                        </Link>
                        {v.why && <span className="block text-[15px] mt-1">{v.why}</span>}
                      </td>
                      <td className={`${td} pr-4`}>{v.result}</td>
                      <td className={`${td} text-right font-tight font-bold tabular-nums whitespace-nowrap`}>{t.yes} / {t.no}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Source href="https://clerk.house.gov/Votes">{wmMeta.votesSource}, every 2025 and 2026 roll call. A health vote is one whose bill or description names a health program or term.</Source>
        </div>
      </section>
    </>
  );
}
