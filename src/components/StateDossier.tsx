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

// --- Thesis headline generators ---

function scopeTitle(state: StateData): string {
  const count = state.parsed_scope?.length || 0;
  if (count >= 7) return `${count} Services. One Board. Zero Competition.`;
  if (count >= 4) return `${count} Services Held Hostage`;
  if (count >= 1) return `${count} Service${count > 1 ? 's' : ''} Behind the Gate`;
  return `Regulated by Permission`;
}

function processTitle(state: StateData): string {
  // Pull timeline info from quick_stats or process_data
  const processText = (state.process_data || []).join(' ').toLowerCase();
  if (processText.includes('6 to 12 months') || processText.includes('6-12 months'))
    return '90 Days on Paper. 12 Months in Practice.';
  if (processText.includes('12 months') || processText.includes('18 months'))
    return 'A Year-Long Permission Slip';
  if (processText.includes('6 months') || processText.includes('six months'))
    return 'Six Months to Say No';
  return 'The Permission Process';
}

function marketTitle(state: StateData): string {
  const systems = state.key_systems || [];
  const insurer = (state.insurer_data || []).find(i => i.includes('%'));
  const topSystem = systems[0]?.name || '';
  const topRevenue = systems[0]?.revenue || '';

  if (topSystem && topRevenue && insurer) {
    return `${topSystem}. ${topRevenue}. ${insurer.length < 50 ? insurer : 'Insurer Dominance.'}`;
  }
  if (systems.length >= 3) return `${systems.length} Systems. One Market.`;
  if (topSystem && topRevenue) return `${topSystem}: ${topRevenue}`;
  if (systems.length > 0) return `The ${state.state} Healthcare Cartel`;
  return `Who Controls ${state.state}`;
}

function caseLawTitle(state: StateData): string {
  const items = state.case_law || [];
  // Find the case name (short item starting with "Case:" or entity name)
  const caseName = items.find(i => i.length < 50 && i.length > 5);
  if (caseName) return caseName;
  return 'Blocked, Denied, Upheld';
}

function reformTitle(state: StateData): string {
  const items = state.reform_data || [];
  const status = items.find(i =>
    i.includes('No Meaningful') || i.includes('No Reform') || i.includes('No Full') ||
    i.includes('Partial Repeal') || i.includes('Reformed') || i.includes('Repealed')
  );
  if (status && status.length < 60) return status;
  return `Reform Status: ${state.tier}`;
}

export default function StateDossier({ state }: StateDossierProps) {
  const dedup = makeDeduper();

  const metaSummary = state.content_blocks?.[0] || state.meta_description || '';
  if (metaSummary) dedup.mark([metaSummary]);

  const sourceLine = getSourceLine(state.content_blocks || []);

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
          <span className="font-body text-xs font-bold tracking-widest uppercase text-orange">
            Intelligence Briefing
          </span>
          <h1 className="mt-3 font-display font-bold text-cream tracking-tight">
            {state.state}
          </h1>
          <div className="mt-3">
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
            <p className="mt-5 font-body text-cream/50 leading-relaxed max-w-[720px]">
              {metaSummary}
            </p>
          )}
        </div>
      </section>

      {/* Section 01: Scope */}
      {(state.parsed_scope?.length || state.scope_data?.length) ? (
        <section className="border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-10">
            <SectionHeader
              number="01"
              label="Scope of Regulation"
              title={scopeTitle(state)}
            />
            <ScopeChecklist parsedScope={state.parsed_scope} rawScope={state.scope_data} />
          </div>
        </section>
      ) : null}

      {/* Section 02: Process */}
      {processNarrative.length > 0 && (
        <section className="bg-navy-dark border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-10">
            <SectionHeader
              number="02"
              label="The Application Process"
              title={processTitle(state)}
            />
            <ProcessCard items={processNarrative} />
          </div>
        </section>
      )}

      {/* Section 03: Market */}
      {(state.key_systems?.length || state.market_bars?.length || insurerItems.length > 0 || marketNarrative.length > 0) && (
        <section className="border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-10">
            <SectionHeader
              number="03"
              label="Market Concentration"
              title={marketTitle(state)}
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
          <div className="max-w-content mx-auto px-5 py-10">
            <SectionHeader
              number="04"
              label="Case Law &amp; Denials"
              title={caseLawTitle(state)}
            />
            <CaseLawCard items={caseItems} />
          </div>
        </section>
      )}

      {/* Section 05: Reform */}
      {reformItems.length > 0 && (
        <section className="border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-10">
            <SectionHeader
              number="05"
              label="Legislative Environment"
              title={reformTitle(state)}
            />
            <ReformStatus items={reformItems} />
          </div>
        </section>
      )}

      {/* Download Brief */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-6 text-center">
          <a
            href={`/briefs/${state.slug}.txt`}
            download={`${state.slug}-intelligence-brief.txt`}
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-orange hover:text-orange-light transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Intelligence Brief
          </a>
        </div>
      </section>

      {/* Cross-links */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={`/compare/?states=${state.abbreviation}`} className="block border border-white/10 p-4 hover:border-orange/40 transition-colors">
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40">Compare</span>
              <h3 className="mt-1 font-display text-lg font-bold text-cream">Compare {state.state}</h3>
            </Link>
            <Link href="/scope/" className="block border border-white/10 p-4 hover:border-orange/40 transition-colors">
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40">Scope Matrix</span>
              <h3 className="mt-1 font-display text-lg font-bold text-cream">What Requires CON?</h3>
            </Link>
            <Link href="/reform/" className="block border border-white/10 p-4 hover:border-orange/40 transition-colors">
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40">Reform Tracker</span>
              <h3 className="mt-1 font-display text-lg font-bold text-cream">Reform Momentum</h3>
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
