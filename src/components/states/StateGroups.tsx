'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { TIER_STYLE } from '@/lib/conTiers';
import type { StateRow, TierGroup } from '@/lib/stateIndex';

/** Every state, grouped by CON tier (most restrictive first, no CON law last), with a filter. Groups collapse on phones. */
export default function StateGroups({ rows, groups }: { rows: StateRow[]; groups: TierGroup[] }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({ [groups[0]?.tier ?? '']: true });
  const id = useId();
  const needle = q.trim().toLowerCase();
  const match = (r: StateRow) => !needle || r.name.toLowerCase().includes(needle) || r.id.toLowerCase() === needle;
  const shown = rows.filter(match);

  return (
    <div>
      <div className="max-w-[420px] mb-10">
        <label htmlFor={id} className="block font-tight font-semibold text-[15px] mb-2">Find a state</label>
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a state name"
          autoComplete="off"
          className="w-full min-h-[48px] bg-[#FBF8F2] border-[1.5px] border-ink rounded-none px-4 text-[17px] text-ink placeholder:text-ink placeholder:opacity-70 outline-none focus:outline focus:outline-[3px] focus:outline-ink focus:outline-offset-1"
        />
        <p className="mt-2 text-[14px]" aria-live="polite">{needle ? `${shown.length} of ${rows.length} match` : `${rows.length} jurisdictions`}</p>
      </div>

      <div className="grid gap-x-8 gap-y-2 md:gap-y-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => {
          const members = shown.filter((r) => r.tier === g.tier);
          if (needle && members.length === 0) return null;
          const isOpen = Boolean(needle) || Boolean(open[g.tier]);
          const listId = `${id}-${g.tier.replace(/\W+/g, '-')}`;
          return (
            <section key={g.tier} aria-label={`${g.label}, ${g.count} states`}>
              <h3 className="border-t-2 border-ink">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  onClick={() => setOpen((o) => ({ ...o, [g.tier]: !o[g.tier] }))}
                  className="w-full flex items-center gap-3 py-3.5 text-left md:pointer-events-none"
                >
                  <span aria-hidden="true" className={`w-4 h-4 shrink-0 ${TIER_STYLE[g.step].swatch}`} />
                  <span className="font-tight font-bold text-[20px] tracking-[-0.015em]">{g.label}</span>
                  <span className="ml-auto font-tight font-bold text-[20px] tabular-nums">{needle ? members.length : g.count}</span>
                  <span aria-hidden="true" className={`md:hidden text-[18px] leading-none transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
              </h3>
              <ul id={listId} className={`${isOpen ? 'block' : 'hidden'} md:block border-t border-ink`}>
                {members.map((r) => (
                  <li key={r.id} className="border-b border-hairline">
                    <div className="flex items-baseline gap-3 py-2.5 text-[17px]">
                      {r.href ? (
                        <Link href={r.href} className="font-medium hover:text-oxblood underline-offset-[3px] hover:underline">{r.name}</Link>
                      ) : (
                        <span>{r.name}</span>
                      )}
                      <span className="ml-auto flex items-baseline gap-2 shrink-0">
                        {r.published && (
                          <span className="font-tight text-[13px] font-bold uppercase tracking-[0.1em] text-green">Dossier</span>
                        )}
                        {r.grade && (
                          <span className="font-tight font-extrabold text-[17px] text-oxblood" aria-label={`Rojas grade ${r.grade}${r.provisional ? ', provisional' : ''}`}>
                            {r.grade}
                          </span>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
