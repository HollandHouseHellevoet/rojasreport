import Link from 'next/link';

/** Shared pieces for the Ways & Means member and vote pages, in the site's Alliance-style layout. */

export const wrap = 'max-w-content mx-auto px-4 md:px-8';
export const eyebrow = 'font-tight text-[13px] font-semibold uppercase tracking-[0.14em]';
export const h2 = 'font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[30px] md:text-[44px]';
export const th = 'font-tight text-[13px] font-semibold uppercase tracking-[0.12em] text-left py-3.5 border-b border-ink';
export const td = 'py-3.5 border-b border-hairline align-top';

/** Clerk records "Aye/No" on recorded votes and "Yea/Nay" on yeas and nays; both mean yes or no. */
export function voteWord(v: string): { text: string; tone: string } {
  if (v === 'Aye' || v === 'Yea') return { text: 'Yes', tone: 'text-green' };
  if (v === 'No' || v === 'Nay') return { text: 'No', tone: 'text-oxblood' };
  if (v === 'Not on the roll') return { text: 'Delegate, no floor vote', tone: 'text-ink' };
  if (v === 'Present') return { text: 'Present', tone: 'text-ink' };
  return { text: 'Did not vote', tone: 'text-ink' };
}

export function VoteLabel({ vote }: { vote: string }) {
  const w = voteWord(vote);
  return (
    <span className={`font-semibold ${w.tone}`}>
      {w.text === 'Yes' || w.text === 'No' ? <span aria-hidden="true">● </span> : null}
      {w.text}
    </span>
  );
}

export function Source({ children, href }: { children: React.ReactNode; href?: string | null }) {
  return (
    <p className="mt-4 text-[14px] leading-[1.6] max-w-[860px]">
      <span className="font-semibold">Source: </span>
      {href ? (
        <a href={href} className="underline underline-offset-[3px] decoration-hairline hover:text-oxblood break-words">{children}</a>
      ) : (
        children
      )}
    </p>
  );
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[14px] mb-8 flex flex-wrap gap-x-2 gap-y-1">
      {items.map((it, i) => (
        <span key={it.label} className="flex gap-2">
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.href ? (
            <Link href={it.href} className="underline underline-offset-[3px] decoration-hairline hover:text-oxblood">{it.label}</Link>
          ) : (
            <span aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Stat({ value, label, note }: { value: string | number; label: string; note?: string }) {
  return (
    <div className="border-t-2 border-ink pt-3">
      <div className="font-tight font-extrabold text-[30px] sm:text-[40px] md:text-[52px] leading-none tracking-[-0.04em] tabular-nums">{value}</div>
      <div className="text-[15px] font-semibold mt-2">{label}</div>
      {note && <div className="text-[14px] mt-1">{note}</div>}
    </div>
  );
}

/** Plain words for the outcome labels in the data. */
export function outcomeText(status: string): string {
  const map: Record<string, string> = {
    'Ran for other office: lost': 'Lost a race for other office',
    'Ran for other office: won': 'Won another office',
    'Defeated in general': 'Defeated in the general election',
    'Lost primary': 'Lost the primary',
    'Race not called': 'Race not called',
  };
  return map[status] ?? status;
}

export function outcomeTone(status: string): string {
  if (status === 'Re-elected') return 'text-green';
  if (/not called/i.test(status)) return 'text-gold';
  if (/won/i.test(status)) return 'text-gold';
  if (status === 'Retired') return 'text-ink';
  return 'text-oxblood';
}
