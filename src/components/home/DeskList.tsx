import Link from 'next/link';
import type { Band, Desk } from '@/lib/home';

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

const plain = (name: string) => name.replace(/^[IVX]+ · /, '');

function Row({ d, band }: { d: Desk; band: Band }) {
  return (
    <DeskLink
      desk={d}
      className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5 border-b border-hairline"
    >
      <div className="min-w-0 flex-[1_1_420px]">
        <p className="font-tight font-bold tracking-[-0.015em] text-[22px] md:text-[24px] leading-tight text-ink group-hover:text-oxblood">
          {d.name}
          <span aria-hidden="true"> →</span>
        </p>
        {d.blurb && <p className="mt-1 text-[17px] leading-[1.45] text-body">{d.blurb}</p>}
      </div>
      {d.stat && (
        <div className="text-right shrink-0">
          <p className={`font-display text-[36px] leading-none ${bandText[band]}`}>{d.stat}</p>
          {d.statLabel && <p className="italic text-[15px] text-muted mt-1 max-w-[14rem]">{d.statLabel}</p>}
        </div>
      )}
    </DeskLink>
  );
}

/** Planned desks in a group, as one line. */
function Planned({ items }: { items: Desk[] }) {
  return (
    <p className="py-5 border-b border-hairline text-[15px] leading-[1.5] text-muted">
      <span className="font-tight font-semibold text-ink">In preparation:</span> {items.map((d) => plain(d.name)).join(' · ')}
    </p>
  );
}

/** Desks in a section, as ledger-style rows. Live desks are rows; planned desks are one line per group. Groups render as italic serif headings in the band color. */
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
            <h2 className={`font-body italic text-[19px] pt-6 pb-1 ${bandText[band]}`}>{g.name}</h2>
          )}
          {g.items.filter((d) => d.status === 'live' && d.href).map((d) => (
            <Row key={d.name} d={d} band={band} />
          ))}
          {g.items.some((d) => !(d.status === 'live' && d.href)) && <Planned items={g.items.filter((d) => !(d.status === 'live' && d.href))} />}
        </div>
      ))}
    </div>
  );
}
