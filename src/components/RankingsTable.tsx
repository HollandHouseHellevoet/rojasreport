'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface RankingRow {
  rank: number;
  state: string;
  con_status: string;
  score: number;
  tier: string;
  slug?: string;
}

interface RankingsTableProps {
  rows: RankingRow[];
}

const TIER_FILTERS = ['All', 'Most Restrictive', 'Highly Restrictive', 'Restrictive', 'Moderate', 'Mostly Free', 'Free Market'];

function tierBadgeBg(tier: string): string {
  switch (tier) {
    case 'Free Market': return 'bg-tier-free';
    case 'Mostly Free': return 'bg-tier-mostly-free';
    case 'Moderate': return 'bg-tier-moderate';
    case 'Restrictive': return 'bg-tier-restrictive';
    case 'Highly Restrictive': return 'bg-tier-highly-restrictive';
    case 'Most Restrictive': return 'bg-tier-most-restrictive';
    default: return 'bg-tier-moderate';
  }
}

type SortKey = 'rank' | 'state' | 'score' | 'tier';

export default function RankingsTable({ rows }: RankingsTableProps) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let result = [...rows];
    if (tierFilter !== 'All') result = result.filter(r => r.tier === tierFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => r.state.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'state') cmp = a.state.localeCompare(b.state);
      else if (sortKey === 'score') cmp = a.score - b.score;
      else if (sortKey === 'rank') cmp = a.rank - b.rank;
      else cmp = a.score - b.score;
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [rows, search, tierFilter, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key === 'state'); }
  }

  const SortIcon = ({ active, asc }: { active: boolean; asc: boolean }) => (
    <span className={`ml-1 inline-block ${active ? 'text-orange' : 'text-cream/20'}`}>
      {asc ? '\u25B2' : '\u25BC'}
    </span>
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search state..."
          className="bg-navy-dark border border-white/20 text-cream px-4 py-2 font-body text-sm focus:border-orange focus:outline-none w-full sm:w-auto sm:min-w-[200px]"
          aria-label="Search states"
        />
        <select
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          className="bg-navy-dark border border-white/20 text-cream px-3 py-2 font-body text-sm focus:border-orange focus:outline-none"
          aria-label="Filter by tier"
        >
          {TIER_FILTERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="self-center font-body text-sm text-cream/30">
          {filtered.length} jurisdiction{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-navy z-10">
            <tr className="border-b border-white/20">
              {[
                { key: 'rank' as SortKey, label: 'Rank', align: '' },
                { key: 'state' as SortKey, label: 'State', align: '' },
                { key: 'score' as SortKey, label: 'Score', align: 'text-right' },
                { key: 'tier' as SortKey, label: 'Tier', align: '' },
              ].map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className={`py-3 px-4 font-body text-xs font-bold tracking-widest uppercase text-cream/40 cursor-pointer hover:text-cream/60 select-none ${col.align}`}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <SortIcon active={sortKey === col.key} asc={sortAsc} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={r.state}
                className={`border-b border-white/5 hover:bg-orange/5 transition-colors ${i % 2 === 1 ? 'bg-navy-row/30' : ''}`}
              >
                <td className="py-3 px-4 font-body text-cream/50">
                  {r.rank}
                </td>
                <td className="py-3 px-4 font-body font-semibold">
                  {r.slug ? (
                    <Link href={`/states/${r.slug}/`} className="text-cream hover:text-orange transition-colors">
                      {r.state}
                    </Link>
                  ) : (
                    <span className="text-cream/60">{r.state}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-block px-2.5 py-1 text-sm font-bold text-white ${tierBadgeBg(r.tier)}`}>
                    {r.score}
                  </span>
                </td>
                <td className="py-3 px-4 font-body text-sm text-cream/50">
                  {r.tier}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
