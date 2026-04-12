'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ScopeRow {
  state: string;
  abbreviation: string;
  slug: string;
  score: number;
  tier: string;
  categories: Record<string, boolean>;
}

interface ScopeMatrixProps {
  rows: ScopeRow[];
  categories: string[];
}

const TIER_OPTIONS = [
  'All Tiers',
  'Most Restrictive',
  'Highly Restrictive',
  'Restrictive',
  'Moderate',
  'Mostly Free',
  'Free Market',
];

const COLUMN_LABELS: Record<string, string> = {
  "Acute Hospital Beds": "Hospitals",
  "Ambulatory Surgery Centers": "ASCs",
  "Psychiatric Facilities": "Psychiatric",
  "Substance Abuse / Behavioral": "Substance",
  "Nursing Homes / Long-Term Care": "Nursing/LTC",
  "Day Surgery / Day Services": "Day Surgery",
  "Home Health / Hospice": "Home Health/Hospice",
  "Imaging (MRI, PET, CT)": "Imaging",
  "Other (Rehab, Equipment)": "Other",
};

export default function ScopeMatrix({ rows, categories }: ScopeMatrixProps) {
  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'state' | 'score' | 'total'>('score');

  const filtered = useMemo(() => {
    let result = [...rows];

    if (tierFilter !== 'All Tiers') {
      result = result.filter(r => r.tier === tierFilter);
    }

    if (categoryFilter !== 'All Categories') {
      result = result.filter(r => r.categories[categoryFilter]);
    }

    result.sort((a, b) => {
      if (sortBy === 'state') return a.state.localeCompare(b.state);
      if (sortBy === 'total') {
        const aTotal = Object.values(a.categories).filter(Boolean).length;
        const bTotal = Object.values(b.categories).filter(Boolean).length;
        return bTotal - aTotal || b.score - a.score;
      }
      return b.score - a.score;
    });

    return result;
  }, [rows, tierFilter, categoryFilter, sortBy]);

  function handleColumnClick(cat: string) {
    if (categoryFilter === cat) {
      setCategoryFilter('All Categories');
    } else {
      setCategoryFilter(cat);
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="bg-navy-dark border border-white/20 text-cream px-3 py-2 font-body focus:border-orange focus:outline-none"
          aria-label="Filter by tier"
        >
          {TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex border border-white/20">
          {(['score', 'total', 'state'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-2 font-body text-sm font-semibold capitalize transition-colors ${
                sortBy === s ? 'bg-orange text-white' : 'text-cream/60 hover:text-cream'
              }`}
            >
              {s === 'total' ? 'Total' : s === 'score' ? 'Score' : 'A-Z'}
            </button>
          ))}
        </div>
        {categoryFilter !== 'All Categories' && (
          <button
            onClick={() => setCategoryFilter('All Categories')}
            className="px-3 py-2 font-body text-sm text-orange border border-orange/30 hover:bg-orange/10 transition-colors"
          >
            Clear filter: {COLUMN_LABELS[categoryFilter] || categoryFilter} &times;
          </button>
        )}
        <span className="self-center font-body text-sm text-cream/30">
          {filtered.length} state{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-navy z-10">
            <tr>
              <th
                scope="col"
                className="sticky left-0 bg-navy z-20 py-3 px-4 font-body text-sm font-bold text-cream/50 text-left align-bottom border-b border-white/20 min-w-[160px]"
              >
                State
              </th>
              <th
                scope="col"
                className="py-3 px-2 font-body text-sm font-bold text-cream/50 text-center align-bottom border-b border-white/20 min-w-[50px]"
              >
                Score
              </th>
              {categories.map(cat => {
                const isActive = categoryFilter === cat;
                return (
                  <th
                    key={cat}
                    scope="col"
                    className={`relative py-3 px-1 border-b border-white/20 min-w-[48px] cursor-pointer select-none align-bottom ${isActive ? 'bg-orange/10' : ''}`}
                    onClick={() => handleColumnClick(cat)}
                    title={`Click to filter: ${COLUMN_LABELS[cat] || cat}`}
                  >
                    <div className="h-[100px] flex items-end justify-center">
                      <span
                        className={`block font-body text-xs font-bold tracking-wide whitespace-nowrap origin-bottom-left ${isActive ? 'text-orange' : 'text-cream/40'}`}
                        style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
                      >
                        {COLUMN_LABELS[cat] || cat}
                      </span>
                    </div>
                  </th>
                );
              })}
              <th
                scope="col"
                className="py-3 px-2 font-body text-sm font-bold text-cream/50 text-center align-bottom border-b border-white/20 min-w-[50px] cursor-pointer"
                onClick={() => setSortBy('total')}
              >
                <div className="h-[100px] flex items-end justify-center">
                  <span
                    className={`block font-body text-xs font-bold tracking-wide whitespace-nowrap ${sortBy === 'total' ? 'text-orange' : 'text-cream/40'}`}
                    style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
                  >
                    Total
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const total = Object.values(row.categories).filter(Boolean).length;
              return (
                <tr
                  key={row.abbreviation}
                  className={`border-b border-white/5 hover:bg-orange/5 transition-colors ${i % 2 === 1 ? 'bg-navy-row/30' : ''}`}
                  style={{ height: '48px' }}
                >
                  <td className="sticky left-0 bg-navy z-10 py-2 px-4 border-r border-white/5">
                    <Link
                      href={`/states/${row.slug}/`}
                      className="font-body text-base font-bold text-cream hover:text-orange transition-colors"
                    >
                      {row.state}
                    </Link>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="font-body text-base font-bold text-cream/60">
                      {row.score}
                    </span>
                  </td>
                  {categories.map(cat => {
                    const regulated = row.categories[cat];
                    const isActiveCol = categoryFilter === cat;
                    return (
                      <td
                        key={cat}
                        className={`py-2 px-1 text-center ${isActiveCol ? 'bg-orange/5' : ''}`}
                        aria-label={`${row.state} ${regulated ? 'regulates' : 'does not regulate'} ${COLUMN_LABELS[cat]}`}
                      >
                        <div
                          className={`mx-auto w-7 h-7 rounded-sm ${regulated ? 'bg-orange' : 'bg-white/5'}`}
                        />
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-center">
                    <span className="font-body text-base font-bold text-orange">
                      {total}
                    </span>
                    <span className="font-body text-xs text-cream/30">/9</span>
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
