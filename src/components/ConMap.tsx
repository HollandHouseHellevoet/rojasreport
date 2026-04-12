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

const ORANGE = '#d4622a';
const CREAM = '#f7f4ef';

function scoreFill(score: number, tier: string): { fill: string; opacity: number; stroke: string } {
  if (score === 0) {
    // Free Market: transparent with cream border
    return { fill: 'transparent', opacity: 1, stroke: CREAM + '66' };
  }
  if (score <= 10) {
    // Reformed / Mostly Free: cream at 40% opacity
    return { fill: CREAM, opacity: 0.35, stroke: CREAM + '33' };
  }
  // Active CON: orange at opacity scaled by score (15->20%, 100->100%)
  const opacity = 0.15 + (score / 100) * 0.85;
  return { fill: ORANGE, opacity, stroke: 'transparent' };
}

const STATE_GRID: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0],
  WA: [0, 1], ID: [1, 1], MT: [2, 1], ND: [3, 1], MN: [4, 1],
  WI: [5, 1], MI: [6, 1], NY: [8, 1], VT: [9, 1], NH: [10, 1],
  OR: [0, 2], NV: [1, 2], WY: [2, 2], SD: [3, 2], IA: [4, 2],
  IL: [5, 2], IN: [6, 2], OH: [7, 2], PA: [8, 2], MA: [10, 2],
  CA: [0, 3], UT: [1, 3], CO: [2, 3], NE: [3, 3], MO: [4, 3],
  KY: [5, 3], WV: [6, 3], VA: [7, 3], MD: [8, 3], CT: [9, 2], RI: [10, 3],
  AZ: [1, 4], NM: [2, 4], KS: [3, 4], AR: [4, 4], TN: [5, 4],
  NC: [6, 4], SC: [7, 4], DC: [8, 4], NJ: [9, 3], DE: [9, 4],
  HI: [0, 5], TX: [2, 5], OK: [3, 5], LA: [4, 5], MS: [5, 5],
  AL: [6, 5], GA: [7, 5], FL: [7, 6],
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
          const { fill, opacity, stroke } = s
            ? scoreFill(s.score, s.tier)
            : { fill: '#374151', opacity: 0.3, stroke: 'transparent' };
          const x = col * step + 10;
          const y = row * step + 10;
          const textFill = fill === 'transparent' || opacity < 0.4 ? CREAM + 'aa' : '#ffffff';

          const rect = (
            <g key={abbr} role="listitem" aria-label={s ? `${s.state}: ${s.tier}, score ${s.score}` : abbr}>
              <rect
                x={x} y={y}
                width={cellSize} height={cellSize}
                fill={fill} opacity={opacity}
                stroke={stroke} strokeWidth={fill === 'transparent' ? 1.5 : 0}
                rx={3}
                className="hover:brightness-125 cursor-pointer transition-all"
              />
              <text
                x={x + cellSize / 2} y={y + cellSize / 2 - 4}
                textAnchor="middle" dominantBaseline="middle"
                fill={textFill}
                className="text-[11px] font-bold pointer-events-none"
                fontFamily="system-ui, sans-serif"
              >
                {abbr}
              </text>
              {s && s.score > 0 && (
                <text
                  x={x + cellSize / 2} y={y + cellSize / 2 + 10}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={textFill} opacity={0.7}
                  className="text-[9px] pointer-events-none"
                  fontFamily="system-ui, sans-serif"
                >
                  {s.score}
                </text>
              )}
            </g>
          );

          if (s?.hasProfile) {
            return <Link key={abbr} href={`/states/${s.slug}/`}>{rect}</Link>;
          }
          return rect;
        })}
      </svg>
      {/* Gradient legend */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <span className="font-body text-xs text-cream/50">Free Market</span>
        <div className="w-48 h-3 rounded-full" style={{
          background: `linear-gradient(to right, ${CREAM}33, ${ORANGE}33, ${ORANGE}88, ${ORANGE})`
        }} />
        <span className="font-body text-xs text-cream/50">Most Restrictive</span>
      </div>
    </div>
  );
}
