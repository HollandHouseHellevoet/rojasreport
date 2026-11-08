import Link from 'next/link';

export interface FightRow {
  issue: string;
  status: string;
  tone: string;
  date: string;
  note: string;
  href: string;
}

// Who's winning, from the row's tone. Dot plus text, never color alone (brief, section 3).
const WINNING: Record<string, { text: string; color: string }> = {
  win: { text: 'Hospital lobby winning', color: 'text-oxblood' },
  loss: { text: 'Reform winning', color: 'text-green' },
  pending: { text: 'Contested', color: 'text-gold' },
};

function Smart({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith('http') ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );
}

/** The fights tracker table. Home shows the first five rows; /tracker/ shows them all. */
export default function FightsTable({ rows, limit }: { rows: FightRow[]; limit?: number }) {
  const shown = limit ? rows.slice(0, limit) : rows;
  const th = 'font-meta text-[13px] tracking-[0.02em] text-muted font-medium text-left pb-3 border-b border-ink';
  return (
    <div className="table-scroll">
      <table className="w-full min-w-[720px] border-collapse text-[18px]">
        <thead>
          <tr>
            <th className={`${th} pr-6 w-[40%]`}>The fight</th>
            <th className={`${th} pr-6 w-[20%]`}>Status</th>
            <th className={th}>What&apos;s next</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => {
            const w = WINNING[r.tone] ?? WINNING.pending;
            return (
              <tr key={r.issue} className="align-top">
                <td className="py-4 pr-6 border-b border-hairline">
                  <Smart href={r.href} className="hover:text-oxblood">{r.issue}</Smart>
                </td>
                <td className="py-4 pr-6 border-b border-hairline">
                  <span className={w.color}><span aria-hidden="true">●</span> {r.status}</span>
                  <span className="block font-meta text-[13px] text-muted mt-1">{w.text}</span>
                </td>
                <td className="py-4 border-b border-hairline text-muted">{r.date} · {r.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
