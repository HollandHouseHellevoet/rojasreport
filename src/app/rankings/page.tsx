import Link from 'next/link';
import type { Metadata } from 'next';
import { getRankings, getAllStates, tierBgClass } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = makeMetadata({
  title: 'CON Law Rankings | 50-State Certificate of Need Index | The Rojas Report',
  description: 'All 51 jurisdictions ranked by CON law restrictiveness. Scores from 0 (free market) to 100 (most restrictive). Click any state for the full intelligence dossier.',
  path: '/rankings/',
  ogImage: '/og/rankings.svg',
});

export default function RankingsPage() {
  const rankings = getRankings();
  const states = getAllStates();
  const slugMap = new Map(states.map(s => [s.state, s.slug]));

  return (
    <div className="max-w-content mx-auto px-5 py-16 md:py-20">
      <SectionHeader
        label="50-State Rankings"
        title="Every Jurisdiction, Ranked"
        subtitle="Scored from 0 (no CON law) to 100 (most restrictive). Based on Cicero Institute methodology."
      />

      <div className="overflow-x-auto mt-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/20">
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                Rank
              </th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                State
              </th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                CON
              </th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                Score
              </th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                Tier
              </th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((r, i) => {
              const slug = slugMap.get(r.state);
              const bg = tierBgClass(r.tier);

              return (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-body text-sm text-cream/50">
                    {r.rank}
                  </td>
                  <td className="py-3 px-3 font-body text-sm font-semibold">
                    {slug ? (
                      <Link href={`/states/${slug}/`} className="text-cream hover:text-orange transition-colors">
                        {r.state}
                      </Link>
                    ) : (
                      <span className="text-cream/60">{r.state}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-body text-sm text-cream/50">
                    {r.con_status}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-bold text-white ${bg}`}>
                      {r.score}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-body text-xs text-cream/40">
                    {r.tier}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
