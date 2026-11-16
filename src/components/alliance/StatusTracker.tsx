import { getFight, STAGES, type FightSlug } from '@/lib/fights';
import { fmtDate } from '@/components/alliance/ui';

/** Where a fight's bill stands: the five congressional stages, the vehicle, the status note and the as-of date. */
export default function StatusTracker({ slug, dark = false }: { slug: FightSlug; dark?: boolean }) {
  const f = getFight(slug);
  const idx = (STAGES as readonly string[]).indexOf(f.stage);
  if (idx < 0) throw new Error(`fights: unknown stage "${f.stage}" for ${slug}`);
  const muted = dark ? 'text-ink-text' : 'text-ink';
  return (
    <div className="flex flex-col gap-8" role="group" aria-label="Legislative status">
      <div className="relative">
        <span aria-hidden="true" className={`absolute hidden sm:block left-[10%] right-[10%] top-[9px] h-[2px] ${dark ? 'bg-rule-dark' : 'bg-hairline'}`} />
        <span aria-hidden="true" className={`absolute sm:hidden left-[9px] top-[10px] bottom-[10px] w-[2px] ${dark ? 'bg-rule-dark' : 'bg-hairline'}`} />
        <ol className="list-none m-0 p-0 grid gap-3.5 sm:grid-cols-5 relative">
          {STAGES.map((s, i) => {
            const done = i < idx;
            const current = i === idx;
            return (
              <li key={s} aria-current={current ? 'step' : undefined} className="flex sm:flex-col items-center gap-4 sm:gap-3 sm:text-center">
                <span
                  aria-hidden="true"
                  className={`w-5 h-5 rounded-full border-2 box-border shrink-0 ${
                    current
                      ? `bg-accent ${dark ? 'border-accent shadow-[0_0_0_4px_#1C1B19]' : 'border-ink shadow-[0_0_0_4px_#F4EFE6]'}`
                      : done
                        ? dark ? 'bg-paper border-paper' : 'bg-ink border-ink'
                        : dark ? 'bg-ink border-ink-text' : 'bg-paper border-slate'
                  }`}
                />
                <span className={`font-tight text-[12px] sm:text-[13px] tracking-[0.06em] uppercase ${current ? `font-extrabold ${dark ? 'text-paper' : 'text-ink'}` : `font-semibold ${muted}`}`}>{s}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <dl className="m-0 grid gap-4 md:grid-cols-[1fr_2fr_1fr] md:gap-8">
        <div><dt className={`font-tight text-[12px] tracking-[0.12em] uppercase mb-1 ${muted}`}>Vehicle</dt><dd className={`m-0 text-[15px] leading-[1.5] ${f.vehicle.startsWith('[') ? 'tbd' : ''}`}>{f.vehicle}</dd></div>
        <div><dt className={`font-tight text-[12px] tracking-[0.12em] uppercase mb-1 ${muted}`}>Status</dt><dd className={`m-0 text-[15px] leading-[1.5] ${f.note.startsWith('[') ? 'tbd' : ''}`}>{f.note}</dd></div>
        <div><dt className={`font-tight text-[12px] tracking-[0.12em] uppercase mb-1 ${muted}`}>Last checked</dt><dd className="m-0 text-[15px] leading-[1.5]"><time dateTime={f.as_of}>{fmtDate(f.as_of)}</time>{f.source && <> · <a href={f.source} rel="noopener" className="underline underline-offset-[3px]">Source</a></>}</dd></div>
      </dl>
    </div>
  );
}
