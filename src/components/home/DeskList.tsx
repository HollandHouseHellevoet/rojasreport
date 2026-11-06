import Link from 'next/link';
import type { Desk } from '@/lib/home';

function DeskLink({ desk, children, className }: { desk: Desk; children: React.ReactNode; className: string }) {
  if (!desk.href) return <div className={className}>{children}</div>;
  if (desk.href.startsWith('http')) {
    return (
      <a href={desk.href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={desk.href} className={className}>
      {children}
    </Link>
  );
}

export default function DeskList({ desks, compact = false }: { desks: Desk[]; compact?: boolean }) {
  const live = desks.filter((d) => d.status === 'live');
  const planned = desks.filter((d) => d.status === 'planned');
  return (
    <div>
      <div className={compact ? 'space-y-3' : 'grid gap-4 sm:grid-cols-2'}>
        {live.map((d) => (
          <DeskLink
            key={d.name}
            desk={d}
            className="group block border border-white/10 bg-navy-light/60 hover:border-orange/60 transition-colors p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-cream group-hover:text-orange transition-colors leading-snug">
                  {d.name}
                </p>
                {d.blurb && <p className="font-body text-sm text-cream/60 mt-1 leading-snug">{d.blurb}</p>}
              </div>
              {d.stat && (
                <div className="text-right shrink-0">
                  <p className="font-display text-2xl font-bold text-orange leading-none">{d.stat}</p>
                  {d.statLabel && (
                    <p className="font-body text-[10px] uppercase tracking-wider text-cream/40 mt-1 max-w-[9rem]">{d.statLabel}</p>
                  )}
                </div>
              )}
            </div>
          </DeskLink>
        ))}
      </div>
      {planned.length > 0 && (
        <p className="font-body text-xs text-cream/40 mt-3 leading-relaxed">
          <span className="uppercase tracking-wider font-semibold text-cream/50">Coming: </span>
          {planned.map((d) => d.name).join(' · ')}
        </p>
      )}
    </div>
  );
}
