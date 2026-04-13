'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CompareState {
  state: string;
  abbreviation: string;
  slug: string;
  score: number;
  tier: string;
  con_status: string;
  quick_stats?: Array<{ value: string; label: string }>;
  scope_data?: string[];
  process_data?: string[];
  market_data?: string[];
  insurer_data?: string[];
  reform_data?: string[];
  case_law?: string[];
}

interface StateCompareProps {
  allStates: CompareState[];
}

interface CompareRow {
  label: string;
  getValue: (s: CompareState) => string;
}

const COMPARE_ROWS: CompareRow[] = [
  { label: 'CON Score', getValue: s => `${s.score}/100` },
  { label: 'Tier', getValue: s => s.tier },
  { label: 'CON Status', getValue: s => s.con_status },
  {
    label: 'Services Regulated',
    getValue: s => {
      const qs = s.quick_stats?.find(q => q.label.toLowerCase().includes('services'));
      return qs?.value || 'N/A';
    },
  },
  {
    label: 'Year Enacted',
    getValue: s => {
      const qs = s.quick_stats?.find(q => q.label.toLowerCase().includes('year') || q.label.toLowerCase().includes('enacted'));
      return qs?.value || 'N/A';
    },
  },
  {
    label: 'Top HHI',
    getValue: s => {
      const qs = s.quick_stats?.find(q => q.label.toLowerCase().includes('hhi'));
      return qs?.value || 'N/A';
    },
  },
  {
    label: 'Top Insurer Share',
    getValue: s => {
      const qs = s.quick_stats?.find(q => q.label.toLowerCase().includes('insurer'));
      return qs?.value || 'N/A';
    },
  },
  {
    label: 'Scope',
    getValue: s => {
      const items = (s.scope_data || []).filter(i => i.length > 10 && i.length < 100);
      return items.slice(0, 2).join('; ') || 'N/A';
    },
  },
  {
    label: 'Application Process',
    getValue: s => {
      const items = (s.process_data || []).filter(i => i.length > 20 && !i.includes('Services Requiring'));
      return items[0]?.substring(0, 150) || 'N/A';
    },
  },
  {
    label: 'Reform Status',
    getValue: s => {
      const items = (s.reform_data || []).filter(i => i.length > 15 && i.length < 200);
      return items[0]?.substring(0, 150) || 'N/A';
    },
  },
  {
    label: 'Case Law',
    getValue: s => {
      const items = (s.case_law || []).filter(i => i.length > 10);
      return items[0]?.substring(0, 150) || 'N/A';
    },
  },
];

export default function StateCompare({ allStates }: StateCompareProps) {
  const [selected, setSelected] = useState<string[]>(['', '', '']);

  // Read initial state from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statesParam = params.get('states');
    if (statesParam) {
      const abbrs = statesParam.split(',').slice(0, 3);
      const resolved = abbrs.map(abbr =>
        allStates.find(s => s.abbreviation === abbr.toUpperCase())?.slug || ''
      );
      setSelected(prev => {
        const next = [...prev];
        resolved.forEach((slug, i) => { next[i] = slug; });
        return next;
      });
    }
  }, [allStates]);

  // Update URL when selection changes
  useEffect(() => {
    const slugs = selected.filter(Boolean);
    if (slugs.length) {
      const abbrs = slugs.map(slug =>
        allStates.find(s => s.slug === slug)?.abbreviation || ''
      ).filter(Boolean);
      const url = new URL(window.location.href);
      url.searchParams.set('states', abbrs.join(','));
      window.history.replaceState({}, '', url.toString());
    }
  }, [selected, allStates]);

  const handleSelect = (index: number, slug: string) => {
    setSelected(prev => {
      const next = [...prev];
      next[index] = slug;
      return next;
    });
  };

  const selectedStates = selected
    .map(slug => allStates.find(s => s.slug === slug))
    .filter((s): s is CompareState => !!s);

  return (
    <div>
      {/* Selectors */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[0, 1, 2].map(i => (
          <select
            key={i}
            value={selected[i]}
            onChange={e => handleSelect(i, e.target.value)}
            className="bg-navy-dark border border-white/20 text-cream text-sm px-3 py-2 font-body focus:border-orange focus:outline-none min-w-[180px]"
            aria-label={`Select state ${i + 1}`}
          >
            <option value="">Select state {i + 1}...</option>
            {allStates.map(s => (
              <option key={s.slug} value={s.slug}>{s.state}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Comparison table */}
      {selectedStates.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-navy z-10">
              <tr className="border-b border-white/20">
                <th scope="col" className="py-4 px-4 font-body text-xs font-bold tracking-widest uppercase text-cream/40 min-w-[160px]">
                  Dimension
                </th>
                {selectedStates.map(s => (
                  <th key={s.slug} scope="col" className="py-4 px-4 font-body text-base font-bold text-cream">
                    <Link href={`/states/${s.slug}/`} className="hover:text-orange transition-colors">
                      {s.state}
                    </Link>
                    <span className="block font-body text-xs text-cream/40 font-normal mt-0.5">
                      {s.score}/100 &middot; {s.tier}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <tr key={row.label} className={`border-b border-white/5 ${i % 2 === 1 ? 'bg-navy-row/30' : ''}`}>
                  <td className="py-4 px-4 font-body text-sm font-semibold text-cream/60 align-top">
                    {row.label}
                  </td>
                  {selectedStates.map(s => (
                    <td key={s.slug} className="py-4 px-4 font-body text-base text-cream/80 align-top max-w-[320px] leading-relaxed">
                      {row.getValue(s)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-white/10 p-10 text-center">
          <p className="font-body text-cream/40">
            Select up to 3 states above to compare their CON profiles side by side.
          </p>
        </div>
      )}
    </div>
  );
}
