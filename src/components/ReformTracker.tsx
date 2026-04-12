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

const MOMENTUM_FILTER_OPTIONS = ['All', 'Reform Likely', 'Reform Possible', 'Reform Stalled'];

// Brand-palette mapping
// Likely (green): cream with cream border
// Possible (yellow): orange with orange border
// Stalled (red): red-brown with red-brown border
function momentumStyles(momentum: string) {
  if (momentum === 'green') {
    return {
      border: 'border-l-4 border-l-cream',
      text: 'text-cream',
      label: 'Likely',
    };
  }
  if (momentum === 'yellow') {
    return {
      border: 'border-l-4 border-l-orange',
      text: 'text-orange',
      label: 'Possible',
    };
  }
  return {
    border: 'border-l-4 border-l-red-brown',
    text: 'text-red-brown',
    label: 'Stalled',
  };
}

function MomentumBadge({ momentum, score }: { momentum: string; score: number }) {
  const s = momentumStyles(momentum);
  return (
    <span className={`inline-flex items-center gap-2 ${s.text} font-body text-sm font-bold`}>
      <span>{score}/5</span>
      <span className="font-semibold">{s.label}</span>
    </span>
  );
}

function YesNo({ filled }: { filled: boolean }) {
  return filled ? (
    <span className="font-body text-sm font-semibold text-orange">Yes</span>
  ) : (
    <span className="font-body text-sm text-cream/30">No</span>
  );
}

export default function ReformTracker({ entries }: ReformTrackerProps) {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'momentum' | 'state' | 'score'>('momentum');

  const filtered = useMemo(() => {
    let result = [...entries];
    if (filter === 'Reform Likely') result = result.filter(e => e.momentum === 'green');
    else if (filter === 'Reform Possible') result = result.filter(e => e.momentum === 'yellow');
    else if (filter === 'Reform Stalled') result = result.filter(e => e.momentum === 'red');

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
      {/* Summary cards (brand palette) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border-l-4 border-l-cream bg-navy-dark/40 p-4">
          <div className="font-display text-stat text-cream leading-none">{greenCount}</div>
          <div className="mt-2 font-body text-sm font-semibold text-cream">Reform Likely</div>
          <div className="font-body text-xs text-cream/40 mt-0.5">Score 4-5</div>
        </div>
        <div className="border-l-4 border-l-orange bg-navy-dark/40 p-4">
          <div className="font-display text-stat text-orange leading-none">{yellowCount}</div>
          <div className="mt-2 font-body text-sm font-semibold text-cream">Reform Possible</div>
          <div className="font-body text-xs text-cream/40 mt-0.5">Score 2-3</div>
        </div>
        <div className="border-l-4 border-l-red-brown bg-navy-dark/40 p-4">
          <div className="font-display text-stat text-red-brown leading-none">{redCount}</div>
          <div className="mt-2 font-body text-sm font-semibold text-cream">Reform Stalled</div>
          <div className="font-body text-xs text-cream/40 mt-0.5">Score 0-1</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-navy-dark border border-white/20 text-cream px-3 py-2 font-body text-sm focus:border-orange focus:outline-none"
          aria-label="Filter by momentum"
        >
          {MOMENTUM_FILTER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="flex border border-white/20">
          {(['momentum', 'state', 'score'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-2 font-body text-sm font-semibold capitalize transition-colors ${
                sortBy === s ? 'bg-orange text-white' : 'text-cream/60 hover:text-cream'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="self-center font-body text-sm text-cream/30">
          {filtered.length} state{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[980px]">
          <thead className="sticky top-0 bg-navy z-10">
            <tr className="border-b border-white/20">
              <th scope="col" className="py-3 px-4 font-body text-xs font-bold tracking-widest uppercase text-cream/40">State</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">CON</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">Momentum</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">Bill Introduced</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">Committee Assigned</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">Hearing Held</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">Governor Support</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center">Prior Reform</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">Current Bill</th>
              <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const s = momentumStyles(e.momentum);
              return (
                <tr
                  key={e.abbreviation}
                  className={`border-b border-white/5 hover:bg-orange/5 transition-colors ${i % 2 === 1 ? 'bg-navy-row/30' : ''}`}
                >
                  <td className={`py-3 px-4 ${s.border}`}>
                    <Link href={`/states/${e.slug}/`} className="font-body text-base font-bold text-cream hover:text-orange transition-colors">
                      {e.state}
                    </Link>
                    <span className="block font-body text-xs text-cream/30">{e.tier}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-body text-sm font-bold text-cream/60">{e.score}</td>
                  <td className="py-3 px-3"><MomentumBadge momentum={e.momentum} score={e.momentum_score} /></td>
                  <td className="py-3 px-3 text-center"><YesNo filled={!!e.bill_introduced} /></td>
                  <td className="py-3 px-3 text-center"><YesNo filled={!!e.committee_assigned} /></td>
                  <td className="py-3 px-3 text-center"><YesNo filled={!!e.hearing_held} /></td>
                  <td className="py-3 px-3 text-center"><YesNo filled={!!e.governor_supports} /></td>
                  <td className="py-3 px-3 text-center"><YesNo filled={!!e.reformed_before} /></td>
                  <td className="py-3 px-3 font-body text-sm text-cream/60">{e.current_bill || 'N/A'}</td>
                  <td className="py-3 px-3 font-body text-sm text-cream/40 max-w-[220px]">{e.bill_status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Methodology note */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="font-body text-sm text-cream/40 leading-relaxed max-w-prose">
          <strong className="text-cream/60">Methodology:</strong> Each state is scored 0-5 across five dimensions:
          (1) reform bill introduced in current session, (2) bill has committee assignment,
          (3) hearing or floor vote held, (4) governor publicly supports reform,
          (5) state has reformed before. Score 4-5 = reform likely. Score 2-3 = reform possible.
          Score 0-1 = reform stalled.
        </p>
      </div>
    </div>
  );
}
