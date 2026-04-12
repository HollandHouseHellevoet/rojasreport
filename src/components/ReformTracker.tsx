'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface TrackerEntry {
  state: string;
  abbreviation: string;
  slug: string;
  score: number;
  tier: string;
  momentum_score: number;
  momentum: 'green' | 'yellow' | 'red';
  bill_introduced: number;
  committee_assigned: number;
  hearing_held: number;
  governor_supports: number;
  reformed_before: number;
  current_bill: string;
  sponsor: string;
  bill_status: string;
  notes: string;
}

interface ReformTrackerProps {
  entries: TrackerEntry[];
}

const MOMENTUM_FILTER_OPTIONS = ['All', 'Green (4-5)', 'Yellow (2-3)', 'Red (0-1)'];

function MomentumBadge({ momentum, score }: { momentum: string; score: number }) {
  const colors = {
    green: 'bg-tier-free text-white',
    yellow: 'bg-tier-moderate text-navy',
    red: 'bg-tier-most-restrictive text-white',
  };
  const labels = { green: 'Likely', yellow: 'Possible', red: 'Stalled' };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold ${colors[momentum as keyof typeof colors] || colors.red}`}>
      {score}/5 {labels[momentum as keyof typeof labels]}
    </span>
  );
}

function ScoreDot({ filled }: { filled: boolean }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${filled ? 'bg-orange' : 'bg-white/10'}`}
      aria-label={filled ? 'Yes' : 'No'}
    />
  );
}

export default function ReformTracker({ entries }: ReformTrackerProps) {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'momentum' | 'state' | 'score'>('momentum');

  const filtered = useMemo(() => {
    let result = [...entries];

    if (filter === 'Green (4-5)') result = result.filter(e => e.momentum === 'green');
    else if (filter === 'Yellow (2-3)') result = result.filter(e => e.momentum === 'yellow');
    else if (filter === 'Red (0-1)') result = result.filter(e => e.momentum === 'red');

    result.sort((a, b) => {
      if (sortBy === 'momentum') return b.momentum_score - a.momentum_score || b.score - a.score;
      if (sortBy === 'state') return a.state.localeCompare(b.state);
      return b.score - a.score;
    });

    return result;
  }, [entries, filter, sortBy]);

  const greenCount = entries.filter(e => e.momentum === 'green').length;
  const yellowCount = entries.filter(e => e.momentum === 'yellow').length;
  const redCount = entries.filter(e => e.momentum === 'red').length;

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-tier-free/30 p-4 text-center">
          <div className="font-display text-3xl font-bold text-tier-free">{greenCount}</div>
          <div className="font-body text-xs text-cream/50 mt-1">Reform Likely</div>
          <div className="font-body text-[10px] text-cream/30 mt-0.5">Score 4-5</div>
        </div>
        <div className="border border-tier-moderate/30 p-4 text-center">
          <div className="font-display text-3xl font-bold text-tier-moderate">{yellowCount}</div>
          <div className="font-body text-xs text-cream/50 mt-1">Reform Possible</div>
          <div className="font-body text-[10px] text-cream/30 mt-0.5">Score 2-3</div>
        </div>
        <div className="border border-tier-most-restrictive/30 p-4 text-center">
          <div className="font-display text-3xl font-bold text-tier-most-restrictive">{redCount}</div>
          <div className="font-body text-xs text-cream/50 mt-1">Reform Stalled</div>
          <div className="font-body text-[10px] text-cream/30 mt-0.5">Score 0-1</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-navy-dark border border-white/20 text-cream text-sm px-3 py-2 font-body focus:border-orange focus:outline-none"
          aria-label="Filter by momentum"
        >
          {MOMENTUM_FILTER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="flex border border-white/20">
          {(['momentum', 'state', 'score'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-2 text-xs font-body font-semibold capitalize transition-colors ${
                sortBy === s ? 'bg-orange text-white' : 'text-cream/60 hover:text-cream'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="self-center text-xs font-body text-cream/30">
          {filtered.length} state{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="border-b border-white/20">
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40">State</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">CON</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">Momentum</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center" title="Bill Introduced">Bill</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center" title="Committee Assigned">Cmte</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center" title="Hearing Held">Hear</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center" title="Governor Supports">Gov</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center" title="Reformed Before">Prior</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40">Current Bill</th>
              <th scope="col" className="py-3 px-2 font-body text-xs font-bold tracking-widest uppercase text-cream/40">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.abbreviation} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-3 px-2">
                  <Link href={`/states/${e.slug}/`} className="font-body text-sm font-semibold text-cream hover:text-orange transition-colors">
                    {e.state}
                  </Link>
                  <span className="block font-body text-[10px] text-cream/30">{e.tier}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="font-body text-xs font-bold text-cream/50">{e.score}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <MomentumBadge momentum={e.momentum} score={e.momentum_score} />
                </td>
                <td className="py-3 px-2 text-center"><ScoreDot filled={!!e.bill_introduced} /></td>
                <td className="py-3 px-2 text-center"><ScoreDot filled={!!e.committee_assigned} /></td>
                <td className="py-3 px-2 text-center"><ScoreDot filled={!!e.hearing_held} /></td>
                <td className="py-3 px-2 text-center"><ScoreDot filled={!!e.governor_supports} /></td>
                <td className="py-3 px-2 text-center"><ScoreDot filled={!!e.reformed_before} /></td>
                <td className="py-3 px-2 font-body text-xs text-cream/50">{e.current_bill}</td>
                <td className="py-3 px-2 font-body text-xs text-cream/40 max-w-[200px]">{e.bill_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Methodology note */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="font-body text-xs text-cream/30 leading-relaxed max-w-3xl">
          <strong className="text-cream/50">Methodology:</strong> Each state is scored 0-5 across five dimensions:
          (1) reform bill introduced in current session, (2) bill has committee assignment,
          (3) hearing or floor vote held, (4) governor publicly supports reform,
          (5) state has reformed before. Green = 4-5 (reform likely), Yellow = 2-3 (reform possible),
          Red = 0-1 (no meaningful activity).
        </p>
      </div>
    </div>
  );
}
