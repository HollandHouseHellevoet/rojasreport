import Link from 'next/link';
import { STATE_TILES, PUBLISHED_DOSSIERS } from '@/lib/stateMap';

/** 50 states plus DC as a tile map. Published dossiers in green; the rest in preparation. */
export default function StateTileMap({ conSlugs, onDark = false }: { conSlugs: Record<string, string>; onDark?: boolean }) {
  return (
    <div className="max-w-[572px]">
      <div className="grid gap-[3px] sm:gap-1" style={{ gridTemplateColumns: 'repeat(11, minmax(0, 1fr))' }}>
        {STATE_TILES.map(([id, row, col, name]) => {
          const published = PUBLISHED_DOSSIERS[id];
          const href = published ?? (conSlugs[id] ? `/states/${conSlugs[id]}/` : undefined);
          const tone = onDark
            ? published ? 'bg-paper text-green border border-paper' : 'bg-[#2A4A3B] text-ink-text-2 border border-green-rule'
            : published ? 'bg-green text-paper' : 'bg-placeholder text-body';
          const cls = `aspect-square flex items-center justify-center ${onDark ? 'font-tight font-bold' : 'font-meta font-semibold'} text-[13px] tracking-[0.02em] sm:tracking-[0.04em] ${tone} ${
            href ? 'hover:bg-oxblood hover:text-paper hover:border-oxblood' : ''
          }`;
          const style = { gridColumn: col, gridRow: row };
          const label = `${name}: ${published ? 'dossier published' : 'in preparation'}`;
          return href ? (
            <Link key={id} href={href} aria-label={label} title={label} className={cls} style={style}>{id}</Link>
          ) : (
            <span key={id} aria-label={label} title={label} className={cls} style={style}>{id}</span>
          );
        })}
      </div>
    </div>
  );
}
