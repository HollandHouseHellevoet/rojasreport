'use client';

import { useId, useMemo, useState } from 'react';
import { STATUS_ORDER, STATUS_TEXT, longDate, type PohHospital, type PohStatus } from '@/lib/poh';
import { StatusTag } from '@/components/poh/ui';

/** Every hospital, with a name filter, a state filter and status toggles. Each row cites its source. */
export default function HospitalList({ hospitals, showState = true }: { hospitals: PohHospital[]; showState?: boolean }) {
  const [q, setQ] = useState('');
  const [state, setState] = useState('');
  const [off, setOff] = useState<Record<string, boolean>>({});
  const id = useId();
  const states = useMemo(() => Array.from(new Map(hospitals.map((h) => [h.state, h.stateName])).entries()).sort((a, b) => a[1].localeCompare(b[1])), [hospitals]);
  const needle = q.trim().toLowerCase();
  const shown = hospitals.filter(
    (h) =>
      !off[h.status] &&
      (!state || h.state === state) &&
      (!needle || `${h.name} ${h.originalName} ${h.city} ${h.owner}`.toLowerCase().includes(needle)),
  );
  const present = STATUS_ORDER.filter((s) => hospitals.some((h) => h.status === s));

  return (
    <div>
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div className="flex-[1_1_260px] max-w-[420px]">
          <label htmlFor={`${id}-q`} className="block font-tight font-semibold text-[15px] mb-2">Find a hospital or owner</label>
          <input
            id={`${id}-q`}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, city or owner"
            className="w-full min-h-[48px] bg-[#FBF8F2] border-[1.5px] border-ink rounded-none px-4 text-[17px] outline-none focus:outline focus:outline-[3px] focus:outline-ink focus:outline-offset-1 placeholder:text-ink placeholder:opacity-70"
          />
        </div>
        {showState && (
          <div>
            <label htmlFor={`${id}-s`} className="block font-tight font-semibold text-[15px] mb-2">State</label>
            <select
              id={`${id}-s`}
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="min-h-[48px] bg-[#FBF8F2] border-[1.5px] border-ink rounded-none px-3 text-[17px]"
            >
              <option value="">All states</option>
              {states.map(([c, n]) => (
                <option key={c} value={c}>{n}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div role="group" aria-label="Show statuses" className="flex flex-wrap gap-2 mb-4">
        {present.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={!off[s]}
            onClick={() => setOff((o) => ({ ...o, [s]: !o[s] }))}
            className={`min-h-[40px] px-3 font-tight font-semibold text-[14px] border-[1.5px] border-ink ${off[s] ? 'bg-transparent opacity-60 line-through' : 'bg-paper-2'}`}
          >
            {STATUS_TEXT[s as PohStatus].label}
          </button>
        ))}
      </div>
      <p className="text-[14px] mb-4" aria-live="polite">
        {shown.length} of {hospitals.length} hospitals
      </p>
      <ul className="border-t-2 border-ink">
        {shown.map((h) => (
          <li key={h.id} className="py-5 border-b border-hairline grid gap-x-8 gap-y-2 grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <p className="font-tight font-bold text-[19px] leading-[1.25] tracking-[-0.01em]">{h.name}</p>
              <p className="text-[15px] mt-1">
                {h.city}
                {showState ? `, ${h.stateName}` : ''}
                {h.specialty ? ` · ${h.specialty}` : ''}
              </p>
              <p className="mt-2"><StatusTag status={h.status} /></p>
            </div>
            <div className="text-[16px] leading-[1.5]">
              {h.owner && <p><span className="font-semibold">Owner: </span>{h.owner}</p>}
              {h.fact && <p className="mt-1">{h.fact}</p>}
              {h.source && (
                <p className="mt-1.5 text-[14px]">
                  <a href={h.source} className="underline underline-offset-[3px] decoration-hairline hover:text-oxblood break-words">
                    {h.sourceLabel || 'Source'}
                  </a>
                  {h.sourceDate ? `, ${longDate(h.sourceDate)}` : ''}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
