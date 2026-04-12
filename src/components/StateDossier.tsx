import Link from 'next/link';
import type { StateData } from '@/lib/data';
import ClassificationBadge from './ClassificationBadge';
import QuickStat from './QuickStat';
import SectionHeader from './SectionHeader';
import SmartText from './SmartText';
import ScopeChecklist from './ScopeChecklist';
import ProcessCard from './ProcessCard';
import MarketBar from './MarketBar';
import InsurerCard from './InsurerCard';
import CaseLawCard from './CaseLawCard';
import ReformStatus from './ReformStatus';
import CitationBlock from './CitationBlock';

interface StateDossierProps {
  state: StateData;
}

function getSourceLine(blocks: string[]): string {
  const source = blocks.find(b => b.startsWith('Data sourced'));
  return source || 'Data sourced from state agencies, Cicero Institute, and public records.';
}

/**
 * Content deduplication: track which blocks have been shown so the same
 * paragraph never appears in two sections.
 */
function makeDeduper() {
  const seen = new Set<string>();
  return {
    filter(items: string[], minLen = 40, maxLen = 500): string[] {
      return items.filter(item => {
        if (item.length < minLen || item.length > maxLen) return false;
        const key = item.substring(0, 80);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },
    mark(items: string[]) {
      items.forEach(item => seen.add(item.substring(0, 80)));
    },
  };
}

export default function StateDossier({ state }: StateDossierProps) {
  const dedup = makeDeduper();

  const metaSummary = state.content_blocks?.[0] || state.meta_description || '';
  // Mark the summary so it won't repeat
  if (metaSummary) dedup.mark([metaSummary]);

  const sourceLine = getSourceLine(state.content_blocks || []);

  // Deduplicated content for each section
  const processNarrative = dedup.filter(state.process_data || []);
  const marketNarrative = dedup.filter(state.market_data || []);
  const caseItems = dedup.filter(state.case_law || [], 10, 1000);
  const reformItems = dedup.filter(state.reform_data || [], 15, 500);
  const insurerItems = (state.insurer_data || []).filter(item =>
    item.length > 5 && item.length < 200
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-navy border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-3">
          <nav className="font-body text-xs text-cream/40" aria-label="Breadcrumb">
            <Link href="/" className="text-orange hover:text-orange-light">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-cream/60">{state.state}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 pt-10 pb-10">
          <span className="font-body text-xs font-bold tracking-widest uppercase text-cream/40">
            Certificate of Need Laws
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream tracking-tight">
            {state.state}
          </h1>
          <div className="mt-4">
            <ClassificationBadge tier={state.tier} score={state.score} size="lg" />
          </div>

          {state.quick_stats && state.quick_stats.length > 0 && (
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {state.quick_stats.map((qs) => (
                <QuickStat key={qs.label} value={qs.value} label={qs.label} />
              ))}
            </div>
          )}

          {metaSummary && (
            <p className="mt-5 font-body text-sm md:text-base text-cream/55 leading-relaxed max-w-3xl">
              {metaSummary}
            </p>
          )}
        </div>
      </section>

      {/* Section 01: Scope */}
      {(state.parsed_scope?.length || state.scope_data?.length) ? (
        <section className="border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-12">
            <SectionHeader
              number="01"
              label="Scope of Regulation"
              title={`What CON Covers in ${state.state}`}
            />
            <ScopeChecklist parsedScope={state.parsed_scope} rawScope={state.scope_data} />
          </div>
        </section>
      ) : null}

      {/* Section 02: Process */}
      {processNarrative.length > 0 && (
        <section className="bg-navy-dark border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-12">
            <SectionHeader
              number="02"
              label="The Application Process"
              title="How to Get Permission"
            />
            <ProcessCard items={processNarrative} />
          </div>
        </section>
      )}

      {/* Section 03: Market Concentration */}
      {(state.key_systems?.length || state.market_bars?.length || insurerItems.length > 0 || marketNarrative.length > 0) && (
        <section className="border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-12">
            <SectionHeader
              number="03"
              label="Market Concentration"
              title={`Who Benefits From CON in ${state.state}`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketBar bars={state.market_bars} systems={state.key_systems} />
              {insurerItems.length > 0 && (
                <InsurerCard items={insurerItems} />
              )}
            </div>
            {marketNarrative.length > 0 && (
              <div className="mt-4 space-y-3">
                {marketNarrative.slice(0, 2).map((item, i) => (
                  <SmartText key={i} text={item} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 04: Case Law */}
      {caseItems.length > 0 && (
        <section className="bg-navy-dark border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-12">
            <SectionHeader
              number="04"
              label="Case Law &amp; Denials"
              title="The Human Cost of CON"
            />
            <CaseLawCard items={caseItems} />
          </div>
        </section>
      )}

      {/* Section 05: Reform Status */}
      {reformItems.length > 0 && (
        <section className="border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-12">
            <SectionHeader
              number="05"
              label="Reform Status"
              title="Legislative Environment"
            />
            <ReformStatus items={reformItems} />
          </div>
        </section>
      )}

      {/* Download Brief */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-8 text-center">
          <a
            href={`/briefs/${state.slug}.txt`}
            download={`${state.slug}-intelligence-brief.txt`}
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-orange hover:text-orange-light border border-orange/30 px-6 py-3 hover:border-orange/60 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Intelligence Brief
          </a>
        </div>
      </section>

      {/* Cross-links */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-12">
          <SectionHeader
            number="06"
            label="Continue Reading"
            title="Related Intelligence"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={`/compare/?states=${state.abbreviation}`} className="block border border-white/10 p-5 hover:border-orange/40 transition-colors">
              <span className="font-body text-xs font-bold tracking-widest uppercase text-cream/40">Compare</span>
              <h3 className="mt-2 font-display text-lg font-bold text-cream">Compare {state.state}</h3>
              <p className="mt-1 font-body text-sm text-cream/50">Side-by-side with other states.</p>
            </Link>
            <Link href="/scope/" className="block border border-white/10 p-5 hover:border-orange/40 transition-colors">
              <span className="font-body text-xs font-bold tracking-widest uppercase text-cream/40">Scope Matrix</span>
              <h3 className="mt-2 font-display text-lg font-bold text-cream">What Requires CON?</h3>
              <p className="mt-1 font-body text-sm text-cream/50">All 36 states, 9 categories.</p>
            </Link>
            <Link href="/reform/" className="block border border-white/10 p-5 hover:border-orange/40 transition-colors">
              <span className="font-body text-xs font-bold tracking-widest uppercase text-cream/40">Reform Tracker</span>
              <h3 className="mt-2 font-display text-lg font-bold text-cream">Reform Momentum</h3>
              <p className="mt-1 font-body text-sm text-cream/50">Which states are closest to repeal.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="bg-navy">
        <div className="max-w-content mx-auto px-5 py-6">
          <CitationBlock sources={sourceLine} lastUpdated="April 2026" />
        </div>
      </section>
    </>
  );
}
