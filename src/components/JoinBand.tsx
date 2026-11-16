import Link from 'next/link';
import { MEMBERSHIP, GOAL_PHYSICIANS } from '@/lib/site';
import { JOIN } from '@/lib/nav';

/**
 * The conversion band every content type ends in (MERGER_PLAN.md, section 3.7). Ported from the Alliance site's CtaBand.
 * `partner` switches to the Partner band for system profiles, carriers, the lobby desks and methodology.
 */
export default function JoinBand({
  eyebrow,
  title,
  text,
  primary,
  secondary,
  dues = true,
  partner = false,
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  dues?: boolean;
  partner?: boolean;
}) {
  const p = partner
    ? {
        eyebrow: eyebrow ?? 'For partners',
        title: title ?? 'If your organization pays for care, the Alliance works for you.',
        text: text ?? 'Employers, payers, manufacturers, physician-owned hospitals, REITs and ASC developers partner with the Alliance by application.',
        primary: primary ?? { label: 'Apply to partner', href: '/partners/#apply' },
        dues: false,
      }
    : {
        eyebrow: eyebrow ?? 'Join the fight',
        title: title ?? `${GOAL_PHYSICIANS} physicians. One voice.`,
        text:
          text ??
          'Independent physicians have lost ground for 25 years. The Alliance is the organization built to fight back for them. Membership funds the three fights and keeps the research free.',
        primary: primary ?? JOIN,
        dues,
      };

  return (
    <section className="bg-ink text-paper py-16 md:py-24 print:hidden">
      <div className="max-w-content mx-auto px-4 md:px-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-text">{p.eyebrow}</p>
          <h2 className="font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[34px] md:text-[52px]">{p.title}</h2>
          {p.text && <p className="text-[19px] leading-[1.5] text-ink-text-2 max-w-[60ch]">{p.text}</p>}
          {p.dues && (
            <p className="text-[15px] text-ink-text-2">
              Dues: <span className="font-tight font-extrabold text-paper">{MEMBERSHIP.physician.monthly} a month</span> or{' '}
              <span className="font-tight font-extrabold text-paper">{MEMBERSHIP.physician.annual} a year</span>. Cancel anytime.
            </p>
          )}
        </div>
        <div className="lg:col-span-4 flex flex-col gap-3 items-start lg:items-end justify-end">
          <Link href={p.primary.href} className="inline-flex items-center gap-2.5 min-h-[48px] px-[22px] bg-accent text-ink font-tight font-semibold text-[15px] leading-none hover:bg-accent-hover">
            {p.primary.label}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 8h11M8 3l5 5-5 5" /></svg>
          </Link>
          {secondary && (
            <Link href={secondary.href} className="inline-flex items-center min-h-[48px] px-[22px] border-[1.5px] border-paper text-paper font-tight font-semibold text-[15px] leading-none hover:bg-paper hover:text-ink">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
