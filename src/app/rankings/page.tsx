import type { Metadata } from 'next';
import { getRankings, getAllStates } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';
import RankingsTable from '@/components/RankingsTable';

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

  const rows = rankings.map(r => ({
    ...r,
    slug: slugMap.get(r.state),
  }));

  return (
    <div className="max-w-content mx-auto px-5 py-10">
      <SectionHeader
        as="h1"
        label="50-State Rankings"
        title="Every Jurisdiction, Ranked"
        subtitle="Scored from 0 (no CON law) to 100 (most restrictive). Based on Cicero Institute methodology. Click column headers to sort."
      />
      <RankingsTable rows={rows} />
    </div>
  );
}
