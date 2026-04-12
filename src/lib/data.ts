import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const statesDir = path.join(dataDir, 'states');

export interface StateData {
  state: string;
  abbreviation: string;
  slug: string;
  meta_description?: string;
  path?: string;
  quick_stats?: Array<{ value: string; label: string }>;
  section_headers?: Array<{ number?: string; title: string; subtitle?: string }>;
  content_blocks?: string[];
  scope_data?: string[];
  process_data?: string[];
  market_data?: string[];
  insurer_data?: string[];
  case_law?: string[];
  reform_data?: string[];
  market_bars?: Array<{ width_pct: string; label: string }>;
  score: number;
  tier: string;
  rank: number;
  con_status: string;
  // Virginia extras
  governor?: string;
  party?: string;
  con_year?: string;
  reviewing_agency?: string;
  application_fee?: string;
  review_timeline?: string;
  competitor_intervention?: string;
  regulated_services_count?: number;
  key_systems?: Array<{ name: string; revenue: string }>;
  top_insurer_share?: string;
  case_law_summary?: string;
}

export interface RankingEntry {
  rank: number;
  state: string;
  con_status: string;
  score: number;
  tier: string;
}

export interface TimelineEntry {
  year: string;
  event: string;
}

export function getAllStates(): StateData[] {
  const files = fs.readdirSync(statesDir).filter(f => f.endsWith('.json'));
  return files.map(f => {
    const raw = fs.readFileSync(path.join(statesDir, f), 'utf-8');
    return JSON.parse(raw) as StateData;
  }).sort((a, b) => a.state.localeCompare(b.state));
}

export function getState(slug: string): StateData | null {
  const filePath = path.join(statesDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as StateData;
}

export function getAllStateSlugs(): string[] {
  return fs.readdirSync(statesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

export function getRankings(): RankingEntry[] {
  const raw = fs.readFileSync(path.join(dataDir, 'rankings.json'), 'utf-8');
  return JSON.parse(raw) as RankingEntry[];
}

export function getTimeline(): TimelineEntry[] {
  const raw = fs.readFileSync(path.join(dataDir, 'timeline.json'), 'utf-8');
  return JSON.parse(raw) as TimelineEntry[];
}

export function getOverview() {
  const raw = fs.readFileSync(path.join(dataDir, 'overview.json'), 'utf-8');
  return JSON.parse(raw);
}

export function tierColor(tier: string): string {
  switch (tier) {
    case 'Free Market': return 'tier-free';
    case 'Mostly Free': return 'tier-mostly-free';
    case 'Moderate': return 'tier-moderate';
    case 'Restrictive': return 'tier-restrictive';
    case 'Highly Restrictive': return 'tier-highly-restrictive';
    case 'Most Restrictive': return 'tier-most-restrictive';
    default: return 'tier-moderate';
  }
}

export function tierBgClass(tier: string): string {
  switch (tier) {
    case 'Free Market': return 'bg-tier-free';
    case 'Mostly Free': return 'bg-tier-mostly-free';
    case 'Moderate': return 'bg-tier-moderate';
    case 'Restrictive': return 'bg-tier-restrictive';
    case 'Highly Restrictive': return 'bg-tier-highly-restrictive';
    case 'Most Restrictive': return 'bg-tier-most-restrictive';
    default: return 'bg-tier-moderate';
  }
}

export function tierTextClass(tier: string): string {
  switch (tier) {
    case 'Free Market': return 'text-tier-free';
    case 'Mostly Free': return 'text-tier-mostly-free';
    case 'Moderate': return 'text-tier-moderate';
    case 'Restrictive': return 'text-tier-restrictive';
    case 'Highly Restrictive': return 'text-tier-highly-restrictive';
    case 'Most Restrictive': return 'text-tier-most-restrictive';
    default: return 'text-tier-moderate';
  }
}
