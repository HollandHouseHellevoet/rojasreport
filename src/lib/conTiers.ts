/**
 * Display styles for CON restrictiveness tiers on the states map, list and legend.
 * Client-safe (no fs). Which tier is which, and their order, come from data/rankings.json
 * through src/lib/stateIndex.ts; this file only maps an order position to a ramp color.
 *
 * `step` 5 = most restrictive ... 1 = freest tier that still has a CON law; 0 = no CON law (outlined).
 */
export interface TierStyle {
  /** Tile on the green band. */
  tile: string;
  /** Swatch on cream (legend, list headers). */
  swatch: string;
}

export const TIER_STYLE: Record<number, TierStyle> = {
  5: { tile: 'bg-con-ramp-5 text-paper border border-oxblood-text/60', swatch: 'bg-con-ramp-5' },
  4: { tile: 'bg-con-ramp-4 text-paper border border-oxblood-text/60', swatch: 'bg-con-ramp-4' },
  3: { tile: 'bg-con-ramp-3 text-ink border border-con-ramp-3', swatch: 'bg-con-ramp-3' },
  2: { tile: 'bg-con-ramp-2 text-ink border border-con-ramp-2', swatch: 'bg-con-ramp-2' },
  1: { tile: 'bg-con-ramp-1 text-ink border border-con-ramp-1', swatch: 'bg-con-ramp-1 border border-hairline' },
  0: { tile: 'bg-transparent text-paper border-[1.5px] border-green-text', swatch: 'bg-transparent border-[1.5px] border-ink' },
};

/** Map a tier's position (0 = most restrictive) among `count` CON tiers to a ramp step. */
export function rampStep(position: number, count: number): number {
  if (count <= 1) return 5;
  return Math.round(5 - (position * 4) / (count - 1));
}
