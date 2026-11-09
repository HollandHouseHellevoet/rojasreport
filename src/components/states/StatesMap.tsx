'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import StateTileMap, { type TileInfo } from '@/components/home/StateTileMap';
import { TIER_STYLE } from '@/lib/conTiers';
import type { StateRow, TierGroup } from '@/lib/stateIndex';

type Mode = 'tier' | 'dossier';

function tileLabel(r: StateRow): string {
  const grade = r.grade ? `, Rojas grade ${r.grade}${r.provisional ? ' (provisional)' : ''}` : '';
  return `${r.name}: ${r.group}${grade}, ${r.published ? 'dossier published' : 'dossier in preparation'}`;
}

/** The states index map: CON tier or dossier status, a legend with counts, and a card for the state under the pointer or focus. */
export default function StatesMap({ rows, groups, intro }: { rows: StateRow[]; groups: TierGroup[]; intro?: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('tier');
  const [activeId, setActiveId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const byId = useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows]);
  const tiles = useMemo(() => {
    const t: Record<string, TileInfo> = {};
    for (const r of rows) t[r.id] = { name: r.name, href: r.href, published: r.published, step: r.step, label: tileLabel(r) };
    return t;
  }, [rows]);
  const active = activeId ? byId.get(activeId) ?? null : null;
  const published = rows.filter((r) => r.published).length;

  // On touch screens the first tap shows the card; the card's link goes to the page.
  const onTileClick = (id: string, e: React.MouseEvent) => {
    const touch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
    if (touch && activeId !== id) {
      e.preventDefault();
      setActiveId(id);
      requestAnimationFrame(() => cardRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    }
  };

  const toggle = (m: Mode, label: string) => (
    <button
      type="button"
      aria-pressed={mode === m}
      onClick={() => setMode(m)}
      className={`min-h-[44px] px-4 font-tight font-semibold text-[15px] border-[1.5px] border-paper ${
        mode === m ? 'bg-paper text-green' : 'text-paper hover:bg-green-rule'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="grid gap-x-14 gap-y-10 grid-cols-1 [grid-template-areas:'intro'_'map'_'panel'] xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:[grid-template-areas:'intro_map'_'panel_map'] items-start">
      <div className="min-w-0 [grid-area:intro]">
        {intro}
        <div role="group" aria-label="Color the map by" className="flex flex-wrap gap-2 mt-8">
          {toggle('tier', 'CON restrictiveness')}
          {toggle('dossier', 'Dossier status')}
        </div>
      </div>

      <div className="min-w-0 [grid-area:map]">
        <h3 className="sr-only">Map of the states. Each state links to its page; the full list follows below.</h3>
        <StateTileMap tiles={tiles} mode={mode} size="large" onDark activeId={activeId} onActivate={setActiveId} onTileClick={onTileClick} />
      </div>

      <div className="min-w-0 [grid-area:panel] grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-1 items-start">
        {/* Card for the active state. Fixed height so nothing shifts. */}
        <div ref={cardRef} aria-live="polite" className="bg-ink text-paper p-6 min-h-[196px] flex flex-col gap-2.5 border-t-2 border-oxblood-rule">
          {active ? (
            <>
              <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-text">{active.group}</p>
              <p className="font-tight font-bold text-[28px] leading-[1.1] tracking-[-0.02em]">{active.name}</p>
              <p className="text-[15px] text-ink-text-2">
                {active.grade ? (
                  <>The Rojas grade <span className="font-semibold text-paper">{active.grade}</span>{active.provisional ? ', provisional' : ''} · </>
                ) : null}
                {active.published ? 'Dossier published' : 'Dossier in preparation'}
              </p>
              {active.href ? (
                <Link href={active.href} className="mt-auto self-start inline-flex items-center gap-1.5 font-tight font-semibold text-[15px] border-b-[1.5px] border-current pb-0.5">
                  {active.published ? 'Read the dossier' : 'Read the CON state page'} <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <p className="mt-auto text-[15px] text-ink-text-2">In preparation</p>
              )}
            </>
          ) : (
            <p className="text-[16px] text-ink-text-2 my-auto">Point to a state, or tab to it, to see its tier, grade and dossier status. On a phone, tap it.</p>
          )}
        </div>

        {/* Legend */}
        {mode === 'tier' ? (
          <ul className="flex flex-col" aria-label="CON restrictiveness, most restrictive first">
            {groups.map((g) => (
              <li key={g.tier} className="flex items-center gap-3 py-2.5 border-b border-green-rule text-[16px]">
                <span aria-hidden="true" className={`w-5 h-5 shrink-0 ${g.noCon ? TIER_STYLE[0].tile : TIER_STYLE[g.step].tile}`} />
                <span className="font-semibold">{g.label}</span>
                <span className="ml-auto font-tight font-bold tabular-nums">{g.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col" aria-label="Dossier status">
            <li className="flex items-center gap-3 py-2.5 border-b border-green-rule text-[16px]">
              <span aria-hidden="true" className="w-5 h-5 shrink-0 bg-paper" />
              <span className="font-semibold">Dossier published</span>
              <span className="ml-auto font-tight font-bold tabular-nums">{published}</span>
            </li>
            <li className="flex items-center gap-3 py-2.5 border-b border-green-rule text-[16px]">
              <span aria-hidden="true" className="w-5 h-5 shrink-0 bg-[#2A4A3B] border border-green-rule" />
              <span className="font-semibold">In preparation</span>
              <span className="ml-auto font-tight font-bold tabular-nums">{rows.length - published}</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
