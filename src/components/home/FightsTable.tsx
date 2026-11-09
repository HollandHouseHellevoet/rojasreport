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
  pending: { text: 'Contested', color: 'text-oxblood' },
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
  const th = 'font-meta text-[13px] font-semibold uppercase tracking-[0.1em] text-ink text-left py-3 border-b border-ink';
  return (
    <div className="table-scroll">
      <table className="w-full min-w-[640px] border-collapse border-t-2 border-ink text-[17px] leading-[1.45]">
        <thead>
          <tr>
            <th className={`${th} pr-6 w-[34%]`}>The fight</th>
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
                  <Smart href={r.href} className="font-tight font-semibold tracking-[-0.01em] text-[18px] hover:text-oxblood">{r.issue}</Smart>
                </td>
                <td className="py-4 pr-6 border-b border-hairline">
                  <span className="font-semibold text-[15px]"><span aria-hidden="true" className={w.color}>●</span> {r.status}</span>
                  <span className={`block font-meta text-[14px] font-semibold mt-1 ${w.color}`}>{w.text}</span>
                </td>
                <td className="py-4 border-b border-hairline"><span className="font-semibold">{r.date}</span> · {r.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
