import type { Metadata } from 'next';
import { getAllStates } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';
import StateCompare from '@/components/StateCompare';

export const metadata: Metadata = makeMetadata({
  title: 'Compare CON Laws | Side-by-Side State Analysis',
  description: 'Compare Certificate of Need laws across up to 3 states side by side. Scores, tiers, regulated services, fees, timelines, market data, reform status, and case law.',
  path: '/compare/',
});

export default function ComparePage() {
  const states = getAllStates();

  // Serialize only the fields the client component needs
  const clientStates = states.map(s => ({
    state: s.state,
    abbreviation: s.abbreviation,
    slug: s.slug,
    score: s.score,
    tier: s.tier,
    con_status: s.con_status,
    quick_stats: s.quick_stats,
    scope_data: s.scope_data,
    process_data: s.process_data,
    market_data: s.market_data,
    insurer_data: s.insurer_data,
    reform_data: s.reform_data,
    case_law: s.case_law,
  }));

  return (
    <div className="max-w-content mx-auto px-5 py-16 md:py-20">
      <SectionHeader
        label="Comparison Tool"
        title="Compare CON Laws Side by Side"
        subtitle="Select up to 3 states to compare every dimension of their Certificate of Need programs. Shareable via URL — just copy and paste."
      />
      <StateCompare allStates={clientStates} />
    </div>
  );
}
