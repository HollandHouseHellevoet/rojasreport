'use client';

import type { StateData } from '@/lib/data';
import Link from 'next/link';
import IntelligencePill from './IntelligencePill';

interface BaseballCardProps {
  state: StateData;
}

function extractStat(state: StateData, labels: string[]): string {
  if (!state.quick_stats) return '';
  const match = state.quick_stats.find(q =>
    labels.some(l => q.label.toLowerCase().includes(l.toLowerCase()))
  );
  return match?.value || '';
}

function findInText(items: string[] | undefined, keyword: string, maxLen = 200): string {
  if (!items) return '';
  const match = items.find(i => i.toLowerCase().includes(keyword.toLowerCase()) && i.length < maxLen);
  return match || '';
}

function keyCase(state: StateData): string {
  const items = state.case_law || [];
  const caseName = items.find(i => i.length < 60 && i.length > 10 && !i.startsWith(','));
  if (caseName) {
    const detail = items.find(i => i.length > 60 && i.length < 200);
    if (detail) return `${caseName}. ${detail.substring(0, 100)}`;
    return caseName;
  }
  return 'No major case law on record.';
}

function reformStatus(state: StateData): string {
  const items = state.reform_data || [];
  const status = items.find(i =>
    (i.includes('No Meaningful') || i.includes('No Reform') ||
     i.includes('Partial Repeal') || i.includes('Reformed') ||
     i.includes('Repealed') || i.includes('Pending') ||
     i.includes('Failed')) && i.length < 120
  );
  return status || `${state.tier} with no active reform bill.`;
}

function copyShareLink() {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(window.location.href);
  }
}

export default function BaseballCard({ state }: BaseballCardProps) {
  const servicesCount = extractStat(state, ['services']) || state.regulated_services_count?.toString() || '—';
  const yearEnacted = extractStat(state, ['year', 'enacted']) || state.con_year || '—';
  const topInsurer = findInText(state.insurer_data, '%', 100);
  const hhi = findInText(state.market_data, 'hhi', 150) ||
              extractStat(state, ['hhi']);
  const caseText = keyCase(state);
  const reform = reformStatus(state);

  return (
    <section
      className="bg-navy-dark border-2 border-white/10 baseball-card relative"
      aria-label={`${state.state} intelligence summary card`}
    >
      <div className="max-w-content mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <IntelligencePill>Certificate of Need Intelligence</IntelligencePill>
            <h2 className="mt-3 font-display font-bold text-cream leading-none">
              {state.state}
            </h2>
          </div>
          <div className="text-right">
            <div className="font-display text-stat text-orange leading-none">
              {state.score}<span className="text-cream/30 text-2xl">/100</span>
            </div>
            <p className="mt-1 font-body text-xs font-semibold text-cream/60 tracking-wide uppercase">
              {state.tier}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-white/10" />

        {/* Top-line facts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-cream/40">Year Enacted</p>
            <p className="mt-1 font-display text-xl text-cream font-bold">{yearEnacted}</p>
          </div>
          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-cream/40">Services Regulated</p>
            <p className="mt-1 font-display text-xl text-cream font-bold">{servicesCount}</p>
          </div>
          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-cream/40">National Rank</p>
            <p className="mt-1 font-display text-xl text-cream font-bold">{state.rank} of 51</p>
          </div>
        </div>

        {/* Systems + Insurer (collapses to single column if only one present) */}
        {(state.key_systems?.length || topInsurer) && (
          <div className={`grid gap-6 mt-6 ${state.key_systems?.length && topInsurer ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {state.key_systems && state.key_systems.length > 0 && (
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-cream/40">Top Systems</p>
                <ul className="mt-2 space-y-1">
                  {state.key_systems.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex justify-between gap-3 font-body text-sm">
                      <span className="text-cream font-semibold">{s.name}</span>
                      {s.revenue && <span className="text-orange font-bold">{s.revenue}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {topInsurer && (
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-cream/40">Dominant Insurer</p>
                <p className="mt-2 font-body text-sm text-cream">{topInsurer}</p>
              </div>
            )}
          </div>
        )}

        {/* Market Concentration */}
        {hhi && (
          <div className="mt-6">
            <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-cream/40">Market Concentration</p>
            <p className="mt-2 font-body text-sm text-cream/80">{hhi}</p>
          </div>
        )}

        {/* Reform Status */}
        <div className="mt-6">
          <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-cream/40">Reform Status</p>
          <p className="mt-2 font-body text-sm text-cream/80">{reform}</p>
        </div>

        {/* Key Case */}
        <div className="mt-6">
          <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-cream/40">Key Case</p>
          <p className="mt-2 font-body text-sm text-cream/80">{caseText}</p>
        </div>

        {/* Actions: 2x2 on mobile, inline on desktop */}
        <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 no-print">
          <a
            href={`/briefs/${state.slug}.txt`}
            download={`${state.slug}-intelligence-brief.txt`}
            className="inline-flex items-center justify-center gap-2 font-body text-sm font-semibold text-cream bg-orange hover:bg-orange-light px-4 py-2.5 transition-colors rounded-sm"
          >
            Download Brief
          </a>
          <button
            onClick={copyShareLink}
            className="inline-flex items-center justify-center gap-2 font-body text-sm font-semibold text-cream/70 border border-white/20 hover:text-cream hover:border-white/40 px-4 py-2.5 transition-colors rounded-sm"
          >
            Share
          </button>
          <Link
            href={`/compare/?states=${state.abbreviation}`}
            className="inline-flex items-center justify-center gap-2 font-body text-sm font-semibold text-cream/70 border border-white/20 hover:text-cream hover:border-white/40 px-4 py-2.5 transition-colors rounded-sm"
          >
            Compare
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 font-body text-sm font-semibold text-cream/70 border border-white/20 hover:text-cream hover:border-white/40 px-4 py-2.5 transition-colors rounded-sm"
          >
            Print
          </button>
        </div>
      </div>
    </section>
  );
}
