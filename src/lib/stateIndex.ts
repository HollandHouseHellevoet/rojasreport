import { getAllStates, getRankings } from '@/lib/data';
import { STATE_TILES } from '@/lib/stateMap';
import { stateDossiers, stateGrade } from '@/lib/stateDossiers';
import { rampStep } from '@/lib/conTiers';

/**
 * One row per jurisdiction for the /states/ index: tier and CON status from data/rankings.json,
 * a state page where data/states has one, and the dossier and grade where src/data/states has one.
 * Nothing here is typed in by hand; tier order is derived from the scores.
 */

export interface StateRow {
  id: string;
  name: string;
  tier: string;
  /** Group label: the tier name, or "No CON law" when every state in the tier has no CON law. */
  group: string;
  step: number;
  conStatus: string;
  href: string | null;
  published: boolean;
  grade: string | null;
  provisional: boolean;
}

export interface TierGroup {
  label: string;
  tier: string;
  step: number;
  noCon: boolean;
  count: number;
}

export interface StateIndex {
  rows: StateRow[];
  groups: TierGroup[];
  missingPages: string[];
}

export const NO_CON_LABEL = 'No CON law';

export function getStateIndex(): StateIndex {
  const rankings = getRankings();
  const idByName = new Map(STATE_TILES.map(([id, , , name]) => [name, id]));
  const pageByCode = new Map(getAllStates().map((s) => [s.abbreviation, s.slug]));
  const dossierByCode = new Map(stateDossiers.map((d) => [d.code, d]));

  // Tiers, most restrictive first, by mean score.
  const byTier = new Map<string, typeof rankings>();
  for (const r of rankings) byTier.set(r.tier, [...(byTier.get(r.tier) ?? []), r]);
  const tiers = Array.from(byTier.entries())
    .map(([tier, members]) => ({
      tier,
      noCon: members.every((m) => m.con_status === 'No'),
      mean: members.reduce((a, m) => a + m.score, 0) / members.length,
      count: members.length,
    }))
    .sort((a, b) => b.mean - a.mean);
  const conTiers = tiers.filter((t) => !t.noCon);
  const groups: TierGroup[] = tiers.map((t) => ({
    label: t.noCon ? NO_CON_LABEL : t.tier,
    tier: t.tier,
    step: t.noCon ? 0 : rampStep(conTiers.indexOf(t), conTiers.length),
    noCon: t.noCon,
    count: t.count,
  }));
  const groupByTier = new Map(groups.map((g) => [g.tier, g]));

  const missingPages: string[] = [];
  const rows: StateRow[] = rankings.map((r) => {
    const id = idByName.get(r.state);
    if (!id) throw new Error(`rankings.json: no tile for ${r.state}`);
    const g = groupByTier.get(r.tier)!;
    const dossier = dossierByCode.get(id);
    const page = pageByCode.get(id);
    const grade = dossier ? stateGrade(dossier) : null;
    const href = dossier ? `/states/${dossier.slug}/` : page ? `/states/${page}/` : null;
    if (!href) missingPages.push(r.state);
    return {
      id,
      name: r.state,
      tier: r.tier,
      group: g.label,
      step: g.step,
      conStatus: r.con_status,
      href,
      published: Boolean(dossier),
      grade: grade?.letter ?? null,
      provisional: grade?.provisional ?? false,
    };
  });
  rows.sort((a, b) => a.name.localeCompare(b.name));
  return { rows, groups, missingPages: missingPages.sort() };
}
