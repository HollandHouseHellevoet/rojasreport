import { STATUS_TEXT, type PohStatus } from '@/lib/poh';

/** Shared pieces for the physician-owned hospitals desk. Layout helpers come from the committee desk. */
export { wrap, eyebrow, h2, th, td, Source, Crumbs, Stat } from '@/components/committees/wm/ui';

export function StatusTag({ status }: { status: PohStatus }) {
  const s = STATUS_TEXT[status];
  return (
    <span className="inline-flex items-center gap-2 font-semibold text-[15px] whitespace-nowrap">
      <span aria-hidden="true" className={`w-[9px] h-[9px] rounded-full inline-block ${s.dot}`} />
      {s.label}
    </span>
  );
}
