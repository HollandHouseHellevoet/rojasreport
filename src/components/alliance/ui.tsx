import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * The Alliance page pieces, ported from the tafhc.com Astro components (Hero, Band, SectionHead, Stat, StatBand,
 * FightTile, InsightCard, Timeline, Compare, Steps) for the merge at tafhc.org. Tokens: ink bands, paper, the
 * accent as a filled button with ink text or a key number on an ink band, never as text on paper.
 */

export const wrap = 'max-w-content mx-auto px-4 md:px-8';
export const eyebrow = 'font-tight text-[13px] font-semibold uppercase tracking-[0.14em]';
export const lede = 'text-[19px] md:text-[21px] leading-[1.45] tracking-[-0.005em]';
export const h2 = 'font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[48px]';
export const textlink = 'inline-flex items-center gap-1.5 font-tight font-semibold text-[15px] border-b-[1.5px] border-current pb-0.5 hover:gap-2.5 transition-[gap]';
export const btnBase = 'inline-flex items-center gap-2.5 min-h-[48px] px-[22px] font-tight font-semibold text-[15px] leading-none border-[1.5px] transition-colors';
export const btnPrimary = `${btnBase} bg-accent text-ink border-accent hover:bg-accent-hover hover:border-accent-hover`;
export const btnInk = `${btnBase} bg-ink text-paper border-ink hover:bg-black`;
export const btnOutline = `${btnBase} bg-transparent text-ink border-ink hover:bg-ink hover:text-paper`;
export const btnOutlineDark = `${btnBase} bg-transparent text-paper border-paper hover:bg-paper hover:text-ink`;

export function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="shrink-0">
      <path d="M2 8h11M8 3l5 5-5 5" />
    </svg>
  );
}

export function Smart({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return href.startsWith('http') || href.startsWith('mailto:') ? (
    <a href={href} className={className} rel="noopener">{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );
}

export function Band({
  dark = false,
  mist = false,
  tight = false,
  id,
  className = '',
  label,
  children,
}: {
  dark?: boolean;
  mist?: boolean;
  tight?: boolean;
  id?: string;
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  const tone = dark ? 'bg-ink text-paper' : mist ? 'bg-mist text-ink' : '';
  return (
    <section id={id} aria-label={label} className={`${tone} ${tight ? 'py-12 md:py-[72px]' : 'py-16 md:py-[104px]'} ${className}`}>
      <div className={wrap}>{children}</div>
    </section>
  );
}

export function Hero({
  eyebrow: eb,
  title,
  text,
  primary,
  secondary,
  size = 'page',
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  size?: 'page' | 'home';
}) {
  return (
    <section className={`border-b border-hairline ${size === 'home' ? 'pt-20 md:pt-[136px] pb-16 md:pb-[104px]' : 'pt-16 md:pt-[112px] pb-14 md:pb-[88px]'}`}>
      <div className={`${wrap} grid grid-cols-12`}>
        <div className="col-span-12 lg:col-span-10 flex flex-col gap-7">
          {eb && <p className={eyebrow}>{eb}</p>}
          <h1 className={`font-tight font-extrabold tracking-[-0.035em] leading-[1.02] ${size === 'home' ? 'text-[48px] md:text-[88px] lg:text-[112px]' : 'text-[40px] md:text-[64px] lg:text-[80px]'}`}>{title}</h1>
          {text && <p className={`${lede} max-w-[60ch]`}>{text}</p>}
          {(primary || secondary) && (
            <div className="flex flex-wrap gap-3 mt-2">
              {primary && <Smart href={primary.href} className={btnPrimary}>{primary.label} <Arrow size={16} /></Smart>}
              {secondary && <Smart href={secondary.href} className={btnOutline}>{secondary.label}</Smart>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow: eb,
  title,
  text,
  link,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  link?: { label: string; href: string };
  dark?: boolean;
}) {
  return (
    <div className="grid grid-cols-12 gap-y-4 items-end mb-10 md:mb-14">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
        {eb && <p className={`${eyebrow} ${dark ? 'text-ink-text' : ''}`}>{eb}</p>}
        <h2 className={h2}>{title}</h2>
        {text && <p className={`${lede} ${dark ? 'text-ink-text-2' : ''}`}>{text}</p>}
      </div>
      {link && (
        <div className="col-span-12 lg:col-span-4 flex lg:justify-end lg:pb-1.5">
          <Smart href={link.href} className={`${textlink} ${dark ? 'text-paper' : 'text-ink hover:text-oxblood'}`}>{link.label} <Arrow /></Smart>
        </div>
      )}
    </div>
  );
}

export interface Figure {
  value?: string;
  label: string;
  source?: string;
  url?: string;
  placeholder?: string;
}

/** A data callout. It refuses to render a figure without a source, unless it is an explicit placeholder. */
export function Stat({ value, label, source, url, placeholder, size = 'md', dark = false }: Figure & { size?: 'sm' | 'md' | 'lg'; dark?: boolean }) {
  if (!placeholder && !source) throw new Error(`Stat "${label}" has a value but no source. Every figure on the site carries one.`);
  const shown = placeholder ? `[STAT: ${placeholder} | source needed]` : value;
  const num = placeholder
    ? 'text-[17px] font-semibold leading-[1.3] tbd'
    : size === 'lg'
      ? 'text-[48px] md:text-[64px] xl:text-[96px]'
      : size === 'sm'
        ? 'text-[28px] md:text-[40px]'
        : 'text-[40px] md:text-[44px] lg:text-[56px] xl:text-[64px]';
  return (
    <figure className={`m-0 min-w-0 flex flex-col gap-3.5 pt-4 border-t-2 ${dark ? 'border-accent' : 'border-ink'}`}>
      <span className={`num break-words ${num} ${dark && !placeholder ? 'text-accent' : ''}`}>{shown}</span>
      <figcaption className="flex flex-col gap-1.5">
        <span className="font-tight font-semibold text-[16px] leading-[1.35] tracking-[-0.01em]">{label}</span>
        <span className={`text-[13px] leading-[1.4] ${dark ? 'text-ink-text' : ''}`}>
          {placeholder ? 'Source needed' : url ? <a href={url} rel="noopener" className="hover:underline">{source}</a> : source}
        </span>
      </figcaption>
    </figure>
  );
}

export function StatBand({ eyebrow: eb, four = false, children }: { eyebrow?: string; four?: boolean; children: ReactNode }) {
  return (
    <section aria-label="Key figures" className="bg-ink text-paper py-12 md:py-[72px]">
      <div className={wrap}>
        {eb && <p className={`${eyebrow} text-ink-text mb-8`}>{eb}</p>}
        <div className={`grid gap-x-6 gap-y-10 grid-cols-1 ${four ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} print:grid-cols-3`}>{children}</div>
      </div>
    </section>
  );
}

export function FightTile({ title, stake, href, ...fig }: Figure & { title: string; stake: string; href: string }) {
  return (
    <article className="bg-mist p-7 flex flex-col gap-6 h-full">
      <Stat {...fig} size="sm" />
      <div className="flex flex-col gap-2.5 flex-1">
        <h3 className="font-tight font-bold text-[22px] leading-[1.15] tracking-[-0.02em]"><Link href={href} className="hover:underline">{title}</Link></h3>
        <p className="text-[16px] leading-[1.55]">{stake}</p>
      </div>
      <Link href={href} className={`${textlink} self-start`}>The fight<span className="sr-only">: {title}</span> <Arrow /></Link>
    </article>
  );
}

export function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
export function fmtDateShort(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span className={`inline-block font-tight text-[11px] font-bold uppercase tracking-[0.12em] leading-none px-2 py-[5px] border ${dark ? 'border-ink-text' : 'border-ink'}`}>{children}</span>;
}

export function InsightCard({ title, format, issue, date, readTime, href, summary, dark = false, placeholder = false }: {
  title: string; format: string; issue: string; date: string; readTime: number; href: string; summary?: string; dark?: boolean; placeholder?: boolean;
}) {
  return (
    <article className={`flex flex-col gap-3.5 py-6 border-t h-full ${dark ? 'border-rule-dark' : 'border-hairline'}`}>
      <div className="flex gap-3 items-center text-[13px]"><Tag dark={dark}>{format}</Tag><span className={dark ? 'text-ink-text' : ''}>{issue}</span></div>
      <h3 className="font-tight font-bold text-[20px] leading-[1.2] tracking-[-0.015em]"><Link href={href} className="hover:underline">{title}</Link></h3>
      {summary && <p className={`text-[15px] leading-[1.5] flex-1 ${dark ? 'text-ink-text-2' : ''}`}>{summary}</p>}
      <p className={`text-[13px] mt-auto ${dark ? 'text-ink-text' : ''}`}><time dateTime={date}>{fmtDateShort(date)}</time> · {readTime} min read{placeholder && ' · Placeholder'}</p>
    </article>
  );
}

export function Timeline({ quarters, compact = false }: { quarters: { label: string; title: string; text: string }[]; compact?: boolean }) {
  const items = compact ? quarters.slice(0, 3) : quarters;
  return (
    <ol className="list-none m-0 p-0 grid gap-8 md:grid-flow-col md:auto-cols-fr">
      {items.map((q, i) => (
        <li key={q.label} className="relative flex flex-col gap-2.5 pl-8 md:pl-0 md:pt-8">
          <span aria-hidden="true" className="absolute left-0 top-0.5 md:top-0 w-3.5 h-3.5 rounded-full bg-accent border-2 border-ink" />
          {i < items.length - 1 && <span aria-hidden="true" className="absolute left-[6px] top-5 bottom-[-2rem] w-[2px] bg-rule-dark md:left-5 md:right-[-2rem] md:top-[6px] md:bottom-auto md:h-[2px] md:w-auto" />}
          <span className="font-tight font-bold text-[13px] tracking-[0.1em] uppercase">{q.label}</span>
          <h3 className="font-tight font-bold text-[20px] leading-[1.2] tracking-[-0.015em]">{q.title}</h3>
          {!compact && <p className="text-[15px] leading-[1.55] text-ink-text-2">{q.text}</p>}
        </li>
      ))}
    </ol>
  );
}

/** Two figures side by side: the picture of a gap. Refuses to render without a source. */
export function Compare({ a, b, caption, source, url }: { a: { value: string; label: string }; b: { value: string; label: string }; caption?: string; source: string; url?: string }) {
  if (!source) throw new Error(`Compare "${a.label} / ${b.label}" has no source. Every figure on the site carries one.`);
  return (
    <figure className="my-9 pt-7 border-t-2 border-current">
      <div className="grid grid-cols-2 gap-6">
        {[a, b].map((s, i) => (
          <div key={i} className={`flex flex-col gap-3 ${i === 1 ? 'border-l border-hairline pl-6' : ''}`}>
            <span className="num text-[40px] md:text-[68px]">{s.value}</span>
            <span className="font-tight font-semibold text-[16px] leading-[1.35] tracking-[-0.01em]">{s.label}</span>
          </div>
        ))}
      </div>
      <figcaption className="flex flex-col gap-1.5 mt-5">
        {caption && <span className="text-[16px] leading-[1.5]">{caption}</span>}
        <span className="text-[13px] leading-[1.4] opacity-80">{url ? <a href={url} rel="noopener">{source}</a> : source}</span>
      </figcaption>
    </figure>
  );
}

/** A dated sequence: what happened, in order. Vertical on phones, a row on wider screens. */
export function Steps({ items, label = 'Timeline' }: { items: { when: string; title: string; text?: string }[]; label?: string }) {
  return (
    <ol className="list-none my-9 p-0 grid gap-6 md:grid-flow-col md:auto-cols-fr" aria-label={label}>
      {items.map((s, i) => (
        <li key={s.when + s.title} className="relative flex flex-col gap-1.5 pl-7 md:pl-0 md:pt-7">
          <span aria-hidden="true" className="absolute left-0 top-1 md:top-0 w-3 h-3 rounded-full bg-accent border-2 border-current" />
          {i < items.length - 1 && <span aria-hidden="true" className="absolute left-[5px] top-[1.1rem] bottom-[-1.5rem] w-[2px] bg-hairline md:left-4 md:right-[-1.5rem] md:top-[5px] md:bottom-auto md:h-[2px] md:w-auto" />}
          <span className="font-tight font-bold text-[12px] tracking-[0.1em] uppercase">{s.when}</span>
          <span className="font-tight font-semibold text-[17px] leading-[1.3] tracking-[-0.01em]">{s.title}</span>
          {s.text && <span className="text-[14px] leading-[1.5] opacity-80">{s.text}</span>}
        </li>
      ))}
    </ol>
  );
}

/** The answer before the argument: three lines on a mist band. */
export function Takeaways({ items, text = 'Three things to take from this page.', tools }: { items: string[]; text?: string; tools?: ReactNode }) {
  return (
    <section aria-label="In brief" className="bg-mist py-12 md:py-[72px]">
      <div className={`${wrap} grid grid-cols-12 gap-y-8 items-start`}>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
          <p className={eyebrow}>In brief</p>
          <p className="text-[14px]">{text}</p>
          {tools}
        </div>
        <ol className="col-span-12 lg:col-span-9 list-none m-0 p-0 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <li key={i} className={`flex flex-col gap-3 pt-4 border-t-2 border-ink font-tight font-semibold text-[17px] leading-[1.4] tracking-[-0.01em] ${t.startsWith('[') ? 'tbd' : ''}`}>
              <span className="num text-[14px] font-bold tracking-[0.04em]">{String(i + 1).padStart(2, '0')}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Sources({ items, prefix = 'fn' }: { items: { id?: string; text: string; url?: string }[]; prefix?: string }) {
  return (
    <>
      <h2 className="font-tight font-bold text-[18px] tracking-[0.02em] uppercase mb-5">Sources</h2>
      <ol className="list-none m-0 p-0 grid gap-3 text-[15px] leading-[1.5]">
        {items.map((s, i) => (
          <li key={s.id ?? i} id={`${prefix}-${s.id ?? i + 1}`} className="grid grid-cols-[2rem_1fr] gap-2 target:bg-accent/20">
            <span className="font-tight font-bold">{i + 1}</span>
            <span>{s.url ? <a href={s.url} rel="noopener" className="hover:underline">{s.text}</a> : s.text}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

export function Fn({ n, id, prefix = 'fn' }: { n: number; id: string; prefix?: string }) {
  return <sup><a href={`#${prefix}-${id}`}>{n}</a></sup>;
}

export function Breadcrumb({ trail }: { trail: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-meta text-[13px] tracking-[0.1em] mb-7">
      <Link href="/" className="hover:text-oxblood">/Home</Link>
      {trail.map((t, i) => (
        <span key={t.href}>{' '}{i === trail.length - 1 ? <span className="text-ink">/{t.name}</span> : <Link href={t.href} className="hover:text-oxblood">/{t.name}</Link>}</span>
      ))}
    </nav>
  );
}
