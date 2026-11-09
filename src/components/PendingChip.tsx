/**
 * A pending figure, shown as a visible chip so it is never read as a zero (type decision B).
 * "card" is the oxblood chip for headline figures; "table" is a quieter ink chip for dense tables.
 */
export default function PendingChip({ label = 'Pending', size = 'table' }: { label?: string; size?: 'card' | 'table' }) {
  const cls =
    size === 'card'
      ? 'border-[1.5px] border-oxblood text-oxblood px-2.5 py-1'
      : 'border border-ink text-ink px-1.5 py-[1px]';
  return (
    <span aria-label={`Figure ${label.toLowerCase()}`} className={`inline-block whitespace-nowrap rounded-[3px] font-meta text-[13px] font-semibold uppercase tracking-[0.08em] leading-[1.3] ${cls}`}>
      {label}
    </span>
  );
}
