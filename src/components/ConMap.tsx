'use client';

import Link from 'next/link';

interface MapState {
  abbreviation: string;
  slug: string;
  score: number;
  tier: string;
  state: string;
  hasProfile: boolean;
}

interface ConMapProps {
  states: MapState[];
}

function tierFill(tier: string): string {
  switch (tier) {
    case 'Free Market': return '#22c55e';
    case 'Mostly Free': return '#4ade80';
    case 'Moderate': return '#facc15';
    case 'Restrictive': return '#f97316';
    case 'Highly Restrictive': return '#ef4444';
    case 'Most Restrictive': return '#b91c1c';
    default: return '#6b7280';
  }
}

// Simplified US state positions for a grid-based cartogram
// Each state gets equal visual weight — better for data visualization than a geographic map
const STATE_GRID: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0],
  WI: [5, 1], VT: [9, 1], NH: [10, 1],
  WA: [0, 1], ID: [1, 1], MT: [2, 1], ND: [3, 1], MN: [4, 1],
  MI: [6, 1], NY: [8, 1], MA: [10, 2], CT: [9, 2], RI: [10, 3],
  OR: [0, 2], NV: [1, 2], WY: [2, 2], SD: [3, 2], IA: [4, 2],
  IL: [5, 2], IN: [6, 2], OH: [7, 2], PA: [8, 2], NJ: [9, 3],
  CA: [0, 3], UT: [1, 3], CO: [2, 3], NE: [3, 3], MO: [4, 3],
  KY: [5, 3], WV: [6, 3], VA: [7, 3], MD: [8, 3], DE: [9, 4],
  AZ: [1, 4], NM: [2, 4], KS: [3, 4], AR: [4, 4], TN: [5, 4],
  NC: [6, 4], SC: [7, 4], DC: [8, 4],
  OK: [3, 5], LA: [4, 5], MS: [5, 5], AL: [6, 5], GA: [7, 5],
  HI: [0, 5], TX: [2, 5], FL: [7, 6],
};

export default function ConMap({ states }: ConMapProps) {
  const stateMap = new Map(states.map(s => [s.abbreviation, s]));

  const cellSize = 52;
  const gap = 3;
  const step = cellSize + gap;
  const width = 11 * step + 20;
  const height = 7 * step + 20;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-4xl mx-auto"
        role="img"
        aria-label="US map showing CON law restrictiveness by state"
      >
        {Object.entries(STATE_GRID).map(([abbr, [col, row]]) => {
          const s = stateMap.get(abbr);
          const fill = s ? tierFill(s.tier) : '#374151';
          const x = col * step + 10;
          const y = row * step + 10;

          const rect = (
            <g key={abbr} role="listitem" aria-label={s ? `${s.state}: ${s.tier}, score ${s.score}` : abbr}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={fill}
                rx={3}
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              <text
                x={x + cellSize / 2}
                y={y + cellSize / 2 - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-[11px] font-bold pointer-events-none"
                fontFamily="system-ui, sans-serif"
              >
                {abbr}
              </text>
              {s && (
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white/70 text-[9px] pointer-events-none"
                  fontFamily="system-ui, sans-serif"
                >
                  {s.score}
                </text>
              )}
            </g>
          );

          if (s?.hasProfile) {
            return (
              <Link key={abbr} href={`/states/${s.slug}/`}>
                {rect}
              </Link>
            );
          }
          return rect;
        })}
      </svg>
    </div>
  );
}
