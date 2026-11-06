import Link from 'next/link';
import type { ReactNode } from 'react';

/** Shared pieces for the methodology pages (docs/BUILD_BRIEF.md section 2, rule 2: each "est." method is on the methodology page). */

export const eyebrow = 'font-meta text-[12px] uppercase tracking-[0.14em]';
export const prose = 'text-[20px] leading-[1.55] text-body';
export const small = 'text-[17px] leading-[1.5] text-body';
export const th = 'font-meta text-[12px] uppercase tracking-[0.1em] text-muted font-normal text-left pt-[18px] pb-2.5 border-b border-ink';
export const td = 'py-3.5 border-b border-hairline align-top text-[18px] leading-[1.45]';

export function MethodPage({
  crumb,
  eyebrowText = 'Methodology',
  title,
  lede,
  asOf,
  children,
}: {
  crumb?: string;
  eyebrowText?: string;
  title: string;
  lede: string;
  asOf: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-12">
        <nav aria-label="Breadcrumb" className="font-meta text-[12px] tracking-[0.1em] text-muted mb-7">
          {crumb ? (
            <>
              <Link href="/methodology/" className="text-muted hover:text-oxblood">/Methodology</Link>{' '}
              <span className="text-ink">/{crumb}</span>
            </>
          ) : (
            <span className="text-ink">/Methodology</span>
          )}
        </nav>
        <p className={`${eyebrow} text-muted mb-3`}>{eyebrowText}</p>
        <h1 className="font-display font-normal text-[48px] md:text-[64px] lg:text-[72px] leading-[1] max-w-[900px]">{title}</h1>
        <p className="mt-[22px] max-w-[760px] italic text-[23px] leading-[1.45] text-body">{lede}</p>
        <p className="mt-5 font-meta text-[12px] tracking-[0.06em] text-muted">{asOf}</p>
      </section>
      {children}
    </>
  );
}

export function Section({ title, aside, children, id }: { title: string; aside?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="max-w-content mx-auto px-5 md:px-8 pb-16">
      <div className="flex flex-wrap justify-between items-baseline gap-3 border-t border-ink pt-5 mb-7">
        <h2 className="font-display font-normal leading-[1.1] text-[32px] md:text-[40px]">{title}</h2>
        {aside && <span className="italic text-[18px] text-muted">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

/** A rule stated large: the formula or the one sentence the section rests on. */
export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-[3px] border-oxblood pl-6 py-1 my-8 max-w-[860px]">
      <p className="font-display text-[24px] md:text-[30px] leading-[1.3]">{children}</p>
    </div>
  );
}

export function Pending({ children = 'Pending' }: { children?: ReactNode }) {
  return <span className="font-meta text-[11px] uppercase tracking-[0.12em] text-muted border border-hairline px-2 py-[3px] whitespace-nowrap">{children}</span>;
}

export function Est() {
  return <span className="font-meta text-[11px] uppercase tracking-[0.12em] text-oxblood ml-1.5">est.</span>;
}

/** Numbered definition list in the reading column. */
export function Defs({ items }: { items: { term: ReactNode; body: ReactNode }[] }) {
  return (
    <dl className="max-w-[860px]">
      {items.map((it, i) => (
        <div key={i} className="grid gap-2 md:gap-8 md:grid-cols-[220px_1fr] py-5 border-b border-hairline">
          <dt className="font-display text-[22px] leading-[1.25]">{it.term}</dt>
          <dd className={small}>{it.body}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Band({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'oxblood' | 'paper-2' }) {
  const cls = tone === 'paper-2' ? 'bg-paper-2 text-ink' : tone === 'green' ? 'bg-green text-paper' : 'bg-oxblood text-paper';
  return (
    <section className={`${cls} mb-16`}>
      <div className="max-w-content mx-auto px-5 md:px-8 py-14">{children}</div>
    </section>
  );
}
