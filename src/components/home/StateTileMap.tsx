import Link from 'next/link';
import { STATE_TILES, PUBLISHED_DOSSIERS } from '@/lib/stateMap';
import { TIER_STYLE } from '@/lib/conTiers';

/** What the states index passes per tile. The home page passes none and gets the dossier view. */
export interface TileInfo {
  name: string;
  href: string | null;
  published: boolean;
  step: number;
  label: string;
}

interface Props {
  /** Home page: CON slugs for linking. */
  conSlugs?: Record<string, string>;
  onDark?: boolean;
  /** States index: per-tile data, keyed by two-letter code. */
  tiles?: Record<string, TileInfo>;
  mode?: 'dossier' | 'tier';
  size?: 'home' | 'large';
  activeId?: string | null;
  onActivate?: (id: string | null) => void;
  onTileClick?: (id: string, e: React.MouseEvent) => void;
}

/** 50 states plus DC as a tile map. Dossier view: published filled, the rest in preparation. Tier view: CON ramp. */
export default function StateTileMap({ conSlugs = {}, onDark = false, tiles, mode = 'dossier', size = 'home', activeId, onActivate, onTileClick }: Props) {
  const large = size === 'large';
  return (
    <div className={large ? 'max-w-[760px] overflow-x-auto p-1.5 -m-1.5' : 'max-w-[572px]'}>
      <div
        className={`grid ${large ? 'gap-1 sm:gap-1.5 min-w-[460px]' : 'gap-[3px] sm:gap-1'}`}
        style={{ gridTemplateColumns: 'repeat(11, minmax(0, 1fr))' }}
      >
        {STATE_TILES.map(([id, row, col, name]) => {
          const info = tiles?.[id];
          const published = info ? info.published : Boolean(PUBLISHED_DOSSIERS[id]);
          const href = info ? info.href : PUBLISHED_DOSSIERS[id] ?? (conSlugs[id] ? `/states/${conSlugs[id]}/` : undefined);
          const tone =
            mode === 'tier' && info
              ? TIER_STYLE[info.step].tile
              : onDark
                ? published ? 'bg-paper text-green border border-paper' : 'bg-[#2A4A3B] text-ink-text-2 border border-green-rule'
                : published ? 'bg-green text-paper' : 'bg-placeholder text-body';
          const active = activeId === id;
          const cls = `aspect-square flex items-center justify-center ${onDark ? 'font-tight font-bold' : 'font-meta font-semibold'} ${
            large ? 'text-[13px] sm:text-[15px]' : 'text-[13px]'
          } tracking-[0.02em] sm:tracking-[0.04em] ${tone} ${
            href && !info ? 'hover:bg-oxblood hover:text-paper hover:border-oxblood' : ''
          } ${info ? 'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-paper' : ''} ${
            active ? 'outline outline-[3px] outline-offset-2 outline-paper relative z-10' : ''
          }`;
          const style = { gridColumn: col, gridRow: row };
          const label = info ? info.label : `${name}: ${published ? 'dossier published' : 'in preparation'}`;
          const handlers = onActivate
            ? {
                onMouseEnter: () => onActivate(id),
                onFocus: () => onActivate(id),
              }
            : {};
          if (href) {
            return (
              <Link
                key={id}
                href={href}
                aria-label={label}
                title={info ? undefined : label}
                className={cls}
                style={style}
                {...handlers}
                onClick={onTileClick ? (e) => onTileClick(id, e) : undefined}
              >
                {id}
              </Link>
            );
          }
          return info ? (
            <button
              key={id}
              type="button"
              aria-label={label}
              className={`${cls} cursor-default`}
              style={style}
              {...handlers}
              onClick={onTileClick ? (e) => onTileClick(id, e) : undefined}
            >
              {id}
            </button>
          ) : (
            <span key={id} aria-label={label} title={label} className={cls} style={style}>{id}</span>
          );
        })}
      </div>
    </div>
  );
}
