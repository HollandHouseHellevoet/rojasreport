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

export default function ScopeMatrix({ rows, categories }: ScopeMatrixProps) {
  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'state' | 'score'>('score');

  const filtered = useMemo(() => {
    let result = [...rows];

    if (tierFilter !== 'All Tiers') {
      result = result.filter(r => r.tier === tierFilter);
    }

    if (categoryFilter !== 'All Categories') {
      result = result.filter(r => r.categories[categoryFilter]);
    }

    result.sort((a, b) =>
      sortBy === 'state'
        ? a.state.localeCompare(b.state)
        : b.score - a.score
    );

    return result;
  }, [rows, tierFilter, categoryFilter, sortBy]);

  // Short labels for mobile
  const shortLabels: Record<string, string> = {
    "Acute Hospital Beds": "Hospitals",
    "Ambulatory Surgery Centers": "ASCs",
    "Psychiatric Facilities": "Psych",
    "Substance Abuse / Behavioral": "Subst.",
    "Nursing Homes / Long-Term Care": "NH/LTC",
    "Day Surgery / Day Services": "Day Svc",
    "Home Health / Hospice": "HH/Hosp",
    "Imaging (MRI, PET, CT)": "Imaging",
    "Other (Rehab, Equipment)": "Other",
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="bg-navy-dark border border-white/20 text-cream text-sm px-3 py-2 font-body focus:border-orange focus:outline-none"
          aria-label="Filter by tier"
        >
          {TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-navy-dark border border-white/20 text-cream text-sm px-3 py-2 font-body focus:border-orange focus:outline-none"
          aria-label="Filter by category"
        >
          <option value="All Categories">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex border border-white/20">
          <button
            onClick={() => setSortBy('state')}
            className={`px-3 py-2 text-xs font-body font-semibold transition-colors ${
              sortBy === 'state' ? 'bg-orange text-white' : 'text-cream/60 hover:text-cream'
            }`}
          >
            A-Z
          </button>
          <button
            onClick={() => setSortBy('score')}
            className={`px-3 py-2 text-xs font-body font-semibold transition-colors ${
              sortBy === 'score' ? 'bg-orange text-white' : 'text-cream/60 hover:text-cream'
            }`}
          >
            Score
          </button>
        </div>
        <span className="self-center text-xs font-body text-cream/30">
          {filtered.length} state{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-white/20">
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 sticky left-0 bg-navy z-10">
                State
              </th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">
                Score
              </th>
              {categories.map(cat => (
                <th
                  key={cat}
                  scope="col"
                  className="py-3 px-1 font-body text-[10px] font-bold tracking-wider uppercase text-cream/40 text-center max-w-[70px]"
                  title={cat}
                >
                  {shortLabels[cat] || cat}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.abbreviation} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2.5 px-2 sticky left-0 bg-navy z-10">
                  <Link
                    href={`/states/${row.slug}/`}
                    className="font-body text-sm font-semibold text-cream hover:text-orange transition-colors"
                  >
                    {row.abbreviation}
                  </Link>
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span className="font-body text-xs font-bold text-cream/60">
                    {row.score}
                  </span>
                </td>
                {categories.map(cat => (
                  <td key={cat} className="py-2.5 px-1 text-center">
                    {row.categories[cat] ? (
                      <span className="text-orange text-sm" aria-label={`${row.state} regulates ${cat}`}>&#x2713;</span>
                    ) : (
                      <span className="text-cream/15" aria-label={`${row.state} does not regulate ${cat}`}>&mdash;</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
