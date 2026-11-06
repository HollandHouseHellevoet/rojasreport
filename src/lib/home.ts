import sectionsData from '@/data/home/sections.json';

export interface Desk {
  name: string;
  href?: string;
  status: 'live' | 'planned';
  blurb?: string;
  stat?: string;
  statLabel?: string;
  /** Optional heading the desk is listed under on its section page. */
  group?: string;
}

export type Band = 'green' | 'oxblood';

export interface Section {
  slug: string;
  name: string;
  question: string;
  /** Color rule from the brief: green = where the money sits, oxblood = who holds power. */
  band: Band;
  intro?: string;
  desks: Desk[];
}

export const sections = sectionsData as Section[];

export function getSection(slug: string): Section {
  const s = sections.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown section: ${slug}`);
  return s;
}

export interface Post {
  title: string;
  link: string;
  date?: string;
}

/** Latest posts from the newsletter feed, fetched at build time. Returns [] if the feed can't be reached. */
export async function getLatestPosts(limit = 4): Promise<Post[]> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('https://read.rojasreport.com/feed', { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.split('<item>').slice(1, limit + 1);
    const pick = (s: string, tag: string) => {
      const m = s.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
      return m ? m[1].trim() : '';
    };
    return items
      .map((it) => {
        const pub = pick(it, 'pubDate');
        const d = pub ? new Date(pub) : null;
        return {
          title: pick(it, 'title'),
          link: pick(it, 'link'),
          date: d && !isNaN(d.getTime())
            ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
            : undefined,
        };
      })
      .filter((p) => p.title && p.link);
  } catch {
    return [];
  }
}
