import Link from 'next/link';
import { STATE_TILES, PUBLISHED_DOSSIERS } from '@/lib/stateMap';

/** 50 states plus DC as a tile map. Published dossiers in green; the rest in preparation. */
export default function StateTileMap({ conSlugs }: { conSlugs: Record<string, string> }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid gap-1 w-max" style={{ gridTemplateColumns: 'repeat(11, 48px)', gridAutoRows: '48px' }}>
        {STATE_TILES.map(([id, row, col, name]) => {
          const published = PUBLISHED_DOSSIERS[id];
          const href = published ?? (conSlugs[id] ? `/states/${conSlugs[id]}/` : undefined);
          const cls = `flex items-center justify-center font-meta text-[12px] font-semibold tracking-[0.04em] ${
            published ? 'bg-green text-paper' : 'bg-placeholder text-body'
          } ${href ? 'hover:bg-oxblood hover:text-paper' : ''}`;
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
