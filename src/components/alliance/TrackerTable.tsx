import Link from 'next/link';
import { fmtDateShort } from '@/components/alliance/ui';
import { fightName, type TrackerRow } from '@/lib/fights';

/** Direction: dot plus text, never color alone. */
const DIRECTION: Record<TrackerRow['direction'], { text: string; dot: string }> = {
  'toward competition': { text: 'Toward competition', dot: 'bg-green' },
  'away from competition': { text: 'Away from competition', dot: 'bg-oxblood' },
  open: { text: 'Open', dot: 'bg-hairline' },
};

function Where({ r }: { r: TrackerRow }) {
  const href = r.href ?? (r.fight === 'research' ? undefined : `/fights/${r.fight}/`);
  const cls = 'font-tight font-bold tracking-[-0.01em] text-[18px] leading-[1.25] hover:text-oxblood';
  if (!href) return <span className={cls.replace(' hover:text-oxblood', '')}>{r.issue}</span>;
  return href.startsWith('http') ? <a href={href} className={cls}>{r.issue}</a> : <Link href={href} className={cls}>{r.issue}</Link>;
}

/**
 * The two-lane tracker (MERGER_PLAN.md, section 3.5): congress and agency-court rows, each with its stage, vehicle,
 * direction, date and source. Home shows a few rows; /tracker/ shows every row grouped by fight.
 */
export default function TrackerTable({ rows, compact = false }: { rows: TrackerRow[]; compact?: boolean }) {
  const th = 'font-tight text-[12px] font-semibold uppercase tracking-[0.12em] text-left py-3 border-b border-ink align-bottom';
  const td = 'py-4 pr-5 border-b border-hairline align-top text-[15px] leading-[1.45]';
  return (
    <div className="table-scroll">
      <table className="w-full min-w-[760px] border-collapse border-t-2 border-ink">
        <thead>
          <tr>
            <th className={`${th} pr-5 w-[40%]`}>Issue</th>
            <th className={`${th} pr-5`}>Lane</th>
            <th className={`${th} pr-5`}>Stage</th>
            <th className={`${th} pr-5 w-[18%]`}>Vehicle</th>
            <th className={`${th} pr-5`}>Direction</th>
            <th className={`${th} pr-5`}>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const d = DIRECTION[r.direction];
            return (
              <tr key={r.id}>
                <td className={td}>
                  <Where r={r} />
                  {!compact && r.fight !== 'research' && <span className="block text-[13px] mt-1">{fightName(r.fight)}</span>}
                  {!compact && r.fight === 'research' && <span className="block text-[13px] mt-1">Research. The Alliance is not lobbying on this issue.</span>}
                  {!compact && <span className="block text-[14px] leading-[1.45] mt-2 max-w-[52ch]">{r.note}</span>}
                </td>
                <td className={td}>{r.lane === 'congress' ? 'Congress' : 'Agency or court'}</td>
                <td className={`${td} font-semibold`}>{r.stage}</td>
                <td className={td}>{r.vehicle}</td>
                <td className={td}>
                  <span className="inline-flex items-center gap-2 font-semibold whitespace-nowrap">
                    <span aria-hidden="true" className={`w-[9px] h-[9px] rounded-full inline-block ${d.dot}`} />
                    {d.text}
                  </span>
                </td>
                <td className={`${td} whitespace-nowrap`}>
                  {fmtDateShort(r.date)}
                  <a href={r.source} rel="noopener" className="block text-[13px] underline underline-offset-[3px] hover:text-oxblood">Source</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
