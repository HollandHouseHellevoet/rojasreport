import Link from 'next/link';
import type { StateData } from '@/lib/data';
import ClassificationBadge from './ClassificationBadge';
import QuickStat from './QuickStat';
import SectionHeader from './SectionHeader';
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

function extractSystemNames(marketData: string[]): string[] {
  return marketData
    .filter(item => item.length < 40 && !item.includes('Market') && !item.includes('HHI') &&
      !item.includes('Monopoly') && !item.includes('Dominant') && !item.includes('Share') &&
      !item.includes('controls') && !item.includes('system') && !item.includes('revenue'))
    .slice(0, 3);
}

function getSourceLine(blocks: string[]): string {
  const source = blocks.find(b => b.startsWith('Data sourced'));
  return source || 'Data sourced from state agencies, Cicero Institute, and public records.';
}

export default function StateDossier({ state }: StateDossierProps) {
  const systemNames = state.key_systems
    ? state.key_systems.map(s => s.name)
    : extractSystemNames(state.market_data || []);

  const metaSummary = state.content_blocks?.[0] || state.meta_description || '';
  const sourceLine = getSourceLine(state.content_blocks || []);

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
        <div className="max-w-content mx-auto px-5 pt-12 pb-16 md:pt-16 md:pb-20">
          <span className="font-body text-xs font-bold tracking-widest uppercase text-cream/40">
            Certificate of Need Laws
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream tracking-tight">
            {state.state}
          </h1>
          <div className="mt-4">
            <ClassificationBadge tier={state.tier} score={state.score} size="lg" />
          </div>

          {/* Quick Stats */}
          {state.quick_stats && state.quick_stats.length > 0 && (
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {state.quick_stats.map((qs) => (
                <QuickStat key={qs.label} value={qs.value} label={qs.label} />
              ))}
            </div>
          )}

          {/* Meta Summary */}
          {metaSummary && (
            <p className="mt-6 font-body text-sm md:text-base text-cream/55 leading-relaxed max-w-3xl">
              {metaSummary}
            </p>
          )}
        </div>
      </section>

      {/* Section 01: Scope of Regulation */}
      {state.scope_data && state.scope_data.length > 0 && (
        <section className="border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-16 md:py-20">
            <SectionHeader
              number="01"
              label="Scope of Regulation"
              title={`What CON Covers in ${state.state}`}
            />
            <ScopeChecklist items={state.scope_data} />
          </div>
        </section>
      )}

      {/* Section 02: Application Process */}
      {state.process_data && state.process_data.length > 0 && (
        <section className="bg-navy-dark border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-16 md:py-20">
            <SectionHeader
              number="02"
              label="The Application Process"
              title="How to Get Permission"
            />
            <ProcessCard items={state.process_data} />
          </div>
        </section>
      )}

      {/* Section 03: Market Concentration */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-16 md:py-20">
          <SectionHeader
            number="03"
            label="Market Concentration"
            title={`Who Benefits From CON in ${state.state}`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.market_bars && state.market_bars.length > 0 && (
              <MarketBar bars={state.market_bars} systemNames={systemNames} />
            )}
            {state.insurer_data && state.insurer_data.length > 0 && (
              <InsurerCard items={state.insurer_data} />
            )}
          </div>
          {/* Narrative market data */}
          {state.market_data && state.market_data.length > 0 && (
            <div className="mt-6 space-y-3">
              {state.market_data
                .filter(item => item.length > 80)
                .slice(0, 3)
                .map((item, i) => (
                  <p key={i} className="font-body text-sm text-cream/55 leading-relaxed">
                    {item}
                  </p>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 04: Case Law */}
      {state.case_law && state.case_law.length > 0 && (
        <section className="bg-navy-dark border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-16 md:py-20">
            <SectionHeader
              number="04"
              label="Case Law &amp; Denials"
              title="The Human Cost of CON"
            />
            <CaseLawCard items={state.case_law} />
          </div>
        </section>
      )}

      {/* Section 05: Reform Status */}
      {state.reform_data && state.reform_data.length > 0 && (
        <section className="border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-16 md:py-20">
            <SectionHeader
              number="05"
              label="Reform Status"
              title="Legislative Environment"
            />
            <ReformStatus items={state.reform_data} />
          </div>
        </section>
      )}

      {/* Download Brief */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10 text-center">
          <a
            href={`/briefs/${state.slug}.txt`}
            download={`${state.slug}-con-brief.txt`}
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-orange hover:text-orange-light border border-orange/30 px-6 py-3 hover:border-orange/60 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download State Brief
          </a>
          <p className="mt-2 font-body text-xs text-cream/30">
            Plain text intelligence brief for {state.state}
          </p>
        </div>
      </section>

      {/* Cross-links */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-16 md:py-20">
          <SectionHeader
            number="06"
            label="Continue Reading"
            title="Related Intelligence"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/"
              className="block border border-white/10 p-5 hover:border-orange/40 transition-colors"
            >
              <span className="font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                Overview
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-cream">
                What Are CON Laws?
              </h3>
              <p className="mt-1 font-body text-sm text-cream/50">
                The full investigation with 50-state rankings and evidence.
              </p>
            </Link>
            <Link
              href="/rankings/"
              className="block border border-white/10 p-5 hover:border-orange/40 transition-colors"
            >
              <span className="font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                Rankings
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-cream">
                51-Jurisdiction Rankings
              </h3>
              <p className="mt-1 font-body text-sm text-cream/50">
                Every state scored, tiered, and ranked by restrictiveness.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="bg-navy">
        <div className="max-w-content mx-auto px-5 py-8">
          <CitationBlock
            sources={sourceLine}
            lastUpdated="April 2026"
          />
        </div>
      </section>
    </>
  );
}
