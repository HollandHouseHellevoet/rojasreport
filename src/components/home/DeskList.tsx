import Link from 'next/link';
import type { Band, Desk } from '@/lib/home';
import StatusLabel from '@/components/StatusLabel';

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

const bandText: Record<Band, string> = { green: 'text-green', oxblood: 'text-oxblood' };

function Row({ d, band }: { d: Desk; band: Band }) {
  const live = d.status === 'live';
  return (
    <DeskLink
      desk={d}
      className={`group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5 border-b border-hairline ${live ? '' : 'cursor-default'}`}
    >
      <div className="min-w-0 flex-[1_1_420px]">
        <p className={`font-display text-[24px] md:text-[26px] leading-tight ${live ? 'text-ink group-hover:text-oxblood' : 'text-muted'}`}>
          {d.name}
          {live && <span aria-hidden="true"> →</span>}
        </p>
        {d.blurb && <p className={`mt-1 text-[19px] leading-[1.45] ${live ? 'text-body' : 'text-muted'}`}>{d.blurb}</p>}
        {!live && (
          <p className="mt-2">
            <StatusLabel status="pending" note="In preparation" />
          </p>
        )}
      </div>
      {live && d.stat && (
        <div className="text-right shrink-0">
          <p className={`font-display text-[36px] leading-none ${bandText[band]}`}>{d.stat}</p>
          {d.statLabel && <p className="italic text-[15px] text-muted mt-1 max-w-[14rem]">{d.statLabel}</p>}
        </div>
      )}
    </DeskLink>
  );
}

/** Desks in a section, as ledger-style rows. Groups render as italic serif headings in the band color. */
export default function DeskList({ desks, band = 'green' }: { desks: Desk[]; band?: Band }) {
  const groups: { name?: string; items: Desk[] }[] = [];
  for (const d of desks) {
    const last = groups[groups.length - 1];
    if (last && last.name === d.group) last.items.push(d);
    else groups.push({ name: d.group, items: [d] });
  }
  return (
    <div className="border-t border-ink">
      {groups.map((g, i) => (
        <div key={g.name ?? i}>
          {g.name && (
            <h2 className={`font-body italic text-[20px] pt-6 pb-1 ${bandText[band]}`}>{g.name}</h2>
          )}
          {g.items.map((d) => (
            <Row key={d.name} d={d} band={band} />
          ))}
        </div>
      ))}
    </div>
  );
}
