import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WM_BASE, WM_SLUG, wmVotes, getWmVote, longDate, billNumber } from '@/lib/wm';
import { wrap, eyebrow, h2, Source, Crumbs, Stat, voteWord } from '@/components/committees/wm/ui';

/** /committees/ways-and-means/votes/[vote]: one roll call, the House tally and every committee member's vote. */

export const dynamicParams = false;

export function generateStaticParams() {
  return wmVotes.map((v) => ({ slug: WM_SLUG, vote: v.id }));
}

export function generateMetadata({ params }: { params: { slug: string; vote: string } }): Metadata {
  const v = getWmVote(params.vote);
  if (!v) return {};
  return {
    title: `${billNumber(v.legisNum)}, roll call ${v.rollCall} | House Ways and Means`,
    description: `${v.description}: how the House and each Ways and Means member voted on ${longDate(v.date)}.`,
    alternates: { canonical: `https://rojasreport.com${WM_BASE}/votes/${v.id}/` },
  };
}

export default function VotePage({ params }: { params: { slug: string; vote: string } }) {
  const v = getWmVote(params.vote);
  if (params.slug !== WM_SLUG || !v) notFound();
  const groups = ['Yes', 'No', 'Did not vote', 'Present', 'Delegate, no floor vote']
    .map((label) => ({ label, people: v.positions.filter((p) => voteWord(p.vote).text === label).sort((a, b) => a.name.localeCompare(b.name)) }))
    .filter((g) => g.people.length > 0);
  const t = v.totals;
  const rep = v.byParty.Republican;
  const dem = v.byParty.Democratic;

  return (
    <>
      <section className={`${wrap} pt-10 md:pt-14 pb-14`}>
        <Crumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government/' },
            { label: 'House Ways and Means', href: `${WM_BASE}/` },
            { label: 'Key health votes', href: `${WM_BASE}/votes/` },
            { label: `Roll call ${v.rollCall}` },
          ]}
        />
        <p className={`${eyebrow} text-oxblood mb-4`}>{billNumber(v.legisNum)} · Roll call {v.rollCall}, {longDate(v.date)}</p>
        <h1 className="font-tight font-extrabold leading-[1] tracking-[-0.035em] max-w-[1000px]" style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)' }}>{v.description}</h1>
        {v.why && <p className="mt-5 text-[19px] md:text-[22px] leading-[1.45] max-w-[760px]">{v.why}.</p>}
        <p className="mt-3 text-[17px]">{v.question}. <span className="font-semibold">{v.result}.</span></p>
        <div className="mt-12 grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4 max-w-[1100px]">
          <Stat value={t['yea-total']} label="Yes, whole House" note={`Republicans ${rep.yea}, Democrats ${dem.yea}`} />
          <Stat value={t['nay-total']} label="No, whole House" note={`Republicans ${rep.nay}, Democrats ${dem.nay}`} />
          <Stat value={t['not-voting-total']} label="Did not vote" />
          <Stat value={groups.find((g) => g.label === 'Yes')?.people.length ?? 0} label="Ways and Means members voting yes" note={`Of ${v.positions.length} members with a floor vote`} />
        </div>
      </section>

      <section className="pb-20 md:pb-[104px]">
        <div className={wrap}>
          <div className="border-t border-hairline pt-14 md:pt-16">
            <h2 className={h2}>How the committee voted.</h2>
            <div className="mt-8 grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {groups.map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between items-baseline border-b-2 border-ink pb-2.5">
                    <h3 className={`font-tight font-bold text-[22px] tracking-[-0.015em] ${g.label === 'Yes' ? 'text-green' : g.label === 'No' ? 'text-oxblood' : ''}`}>{g.label}</h3>
                    <span className="font-tight font-bold text-[22px] tabular-nums">{g.people.length}</span>
                  </div>
                  <ul>
                    {g.people.map((p) => (
                      <li key={p.bioguideId} className="flex justify-between gap-3 py-2.5 border-b border-hairline text-[16px]">
                        {p.slug ? (
                          <Link href={`${WM_BASE}/members/${p.slug}/`} className="font-medium hover:text-oxblood hover:underline underline-offset-[3px]">{p.name}</Link>
                        ) : (
                          <span>{p.name}</span>
                        )}
                        <span>{p.party}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Source href={v.source}>{v.sourceLabel}.</Source>
          </div>
        </div>
      </section>
    </>
  );
}
