/** Status label from docs/BUILD_BRIEF.md section 3: a dot plus text, never color alone. */
export type Status = 'lobby-holding' | 'in-play' | 'on-paper' | 'reform-moving' | 'pending';

const STYLE: Record<Status, { text: string; color: string }> = {
  'lobby-holding': { text: 'Lobby holding', color: 'text-oxblood' },
  'in-play': { text: 'In play', color: 'text-gold' },
  'on-paper': { text: 'On paper', color: 'text-gold' },
  'reform-moving': { text: 'Reform moving', color: 'text-green' },
  pending: { text: 'Pending', color: 'text-muted' },
};

export default function StatusLabel({ status, note }: { status: Status; note?: string }) {
  const s = STYLE[status];
  return (
    <span className="font-meta text-[14px] font-semibold text-ink">
      <span aria-hidden="true" className={s.color}>●</span> {s.text}
      {note && <span className="font-normal"> · {note}</span>}
    </span>
  );
}
