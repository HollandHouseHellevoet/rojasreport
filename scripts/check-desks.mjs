#!/usr/bin/env node
/**
 * Build gate for desk data that does not use the brief's figure format (roadmap Q3).
 * check-sources.mjs covers objects with `basis` + `value`; this covers the Ways and Means desk
 * (src/data/committees/wm) and the physician-owned hospitals desk (src/data/poh).
 *
 * Two kinds of rule:
 *   1. Every record carries a source link, a source label and a dated source (at least a year).
 *   2. Every count printed on a page equals the records behind it.
 * Runs before `next build` (npm "prebuild"). Exits 1 on any problem.
 */
import { readFileSync } from 'node:fs';

const problems = [];
let checked = 0;
const load = (p) => JSON.parse(readFileSync(p, 'utf8'));
const has = (v) => typeof v === 'string' && v.trim() !== '';
const isUrl = (v) => has(v) && /^https?:\/\//.test(v);
// A date as precise as the source gives it: a full date, a year and month, a year, or "FEC files of November 8, 2026".
const isDate = (v) => has(v) && /\b(19|20)\d{2}\b/.test(v);
function need(cond, msg) {
  checked += 1;
  if (!cond) problems.push(msg);
}
function eq(a, b, msg) {
  need(a === b, `${msg}: page says ${a}, records say ${b}`);
}

// ---------- Physician-owned hospitals ----------
{
  const H = load('src/data/poh/hospitals.json');
  const M = load('src/data/poh/meta.json');
  const STATUSES = ['Physician-owned', 'Joint venture', 'Sold or acquired', 'Closed', 'Under development', 'NOT FOUND'];
  const ids = new Set();
  for (const h of H) {
    const w = `poh ${h.id}`;
    need(!ids.has(h.id), `${w}: duplicate id`);
    ids.add(h.id);
    need(STATUSES.includes(h.status), `${w}: status "${h.status}" is not one of ${STATUSES.join(', ')}`);
    need(has(h.fact), `${w}: no fact`);
    need(isUrl(h.source), `${w}: source is not a link`);
    need(has(h.sourceLabel), `${w}: no source label`);
    need(isDate(h.sourceDate), `${w}: no source date`);
    if (has(h.ccn)) need(/^[0-9A-Z]{6}$/.test(h.ccn), `${w}: CCN "${h.ccn}" is not six characters`);
  }
  eq(M.tracked, H.length, 'poh meta.tracked');
  for (const s of STATUSES) eq(M.byStatus?.[s] ?? 0, H.filter((h) => h.status === s).length, `poh meta.byStatus["${s}"]`);
  const byState = {};
  for (const h of H) byState[h.state] = (byState[h.state] || 0) + 1;
  eq(M.statesCount, Object.keys(byState).length, 'poh meta.statesCount');
  eq(M.states.length, Object.keys(byState).length, 'poh meta.states length');
  for (const s of M.states) eq(s.total, byState[s.code] || 0, `poh meta.states ${s.code} total`);
  need(isUrl(M.headline?.source), 'poh meta.headline: source is not a link');
  need(has(M.headline?.sourceLabel), 'poh meta.headline: no source label');
  need(isDate(M.headline?.asOf), 'poh meta.headline: no as-of date');
}

// ---------- Ways and Means ----------
{
  const MEM = load('src/data/committees/wm/members.json');
  const V = load('src/data/committees/wm/votes.json');
  const M = load('src/data/committees/wm/meta.json');
  const voteIds = new Set(V.map((v) => v.id));
  const slugs = new Set();
  for (const m of MEM) {
    const w = `wm ${m.slug}`;
    need(!slugs.has(m.slug), `${w}: duplicate slug`);
    slugs.add(m.slug);
    need(has(m.rosterSource) && isUrl(m.rosterSourceUrl), `${w}: roster has no source`);
    const o = m.outcome || {};
    need(has(o.status), `${w}: no 2026 outcome`);
    need(isUrl(o.source), `${w}: outcome source is not a link`);
    need(isDate(o.date), `${w}: outcome has no date`);
    for (const [cycle, money] of Object.entries(m.money || {})) {
      if (!money || typeof money !== 'object' || !('total' in money)) continue;
      need(has(money.source) && isDate(money.asOf), `${w}: ${cycle} money has no source or as-of date`);
    }
    if (m.trades) need(isUrl(m.trades.source) && isDate(m.trades.asOf), `${w}: trades have no source or as-of date`);
    for (const v of m.votes || []) need(voteIds.has(v.id), `${w}: vote ${v.id} is not in votes.json`);
  }
  for (const v of V) {
    const w = `wm vote ${v.id}`;
    need(isUrl(v.source) && has(v.sourceLabel), `${w}: no source`);
    need(isDate(v.date), `${w}: no date`);
    need(Array.isArray(v.positions) && v.positions.length > 0, `${w}: no member positions`);
    const tally = Object.values(v.waysAndMeansTally || {}).reduce((a, b) => a + b, 0);
    eq(tally, (v.positions || []).length, `${w} committee tally`);
  }
  eq(M.counts.members, MEM.length, 'wm meta.counts.members');
  eq(M.counts.republicans, MEM.filter((m) => m.party === 'R').length, 'wm meta.counts.republicans');
  eq(M.counts.democrats, MEM.filter((m) => m.party === 'D').length, 'wm meta.counts.democrats');
  eq(M.counts.healthSubcommittee, MEM.filter((m) => m.healthSubcommittee).length, 'wm meta.counts.healthSubcommittee');
  need(Array.isArray(M.leadership?.source) && M.leadership.source.every(isUrl), 'wm meta.leadership: source is not a link');
  need(isUrl(M.houseControl?.source) && isDate(M.houseControl?.date), 'wm meta.houseControl: no source or date');
  for (const e of M.expectedLeaders || []) need(isUrl(e.source) && isDate(e.date), `wm meta.expectedLeaders ${e.name}: no source or date`);
}

if (problems.length) {
  console.error(`check-desks: ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check-desks: ${checked} checks on the Ways and Means and physician-owned hospitals data, all pass.`);
