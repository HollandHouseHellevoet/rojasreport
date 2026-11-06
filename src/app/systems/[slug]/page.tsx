import type { Metadata } from 'next';
import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { systems, getSystem, fairShare, millions, short, filledSentence, type Row } from '@/lib/systems';

/** Health system profile, built to docs/mockups/system-profile.dc.html. Every figure comes from the system's data file. */

export function generateStaticParams() {
  return systems.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getSystem(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} | Health Systems`,
    description: p.verdict,
    alternates: { canonical: `https://rojasreport.com/systems/${p.slug}/` },
  };
}

const eyebrow = 'font-meta text-[12px] uppercase tracking-[0.14em]';
const h2 = 'font-display font-normal leading-[1.1]';
const button = 'font-meta text-[14px] font-medium text-center px-[18px] py-3.5';
const cell = 'py-3.5 border-b border-hairline';

/** A dash for a pending figure, marked so it is never read as a zero. */
function Dash({ className = '' }: { className?: string }) {
  return (
    <span className={`text-hairline ${className}`} aria-label="Pending">
      —<span className="font-meta text-[10px] uppercase tracking-[0.12em] text-muted align-middle ml-2">pending</span>
    </span>
  );
}

function FactRows({ rows }: { rows: Row[] }) {
  return (
    <div className="flex flex-col text-[18px]">
      {rows.map((r) => (
        <div key={r.name} className="flex justify-between gap-3 py-2.5 border-b border-hairline">
          <span>{r.name}</span>
          <span className="font-display whitespace-nowrap" title={r.value ? r.source : undefined}>
            {r.value ?? <Dash />}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SystemProfilePage({ params }: { params: { slug: string } }) {
  const p = getSystem(params.slug);
  if (!p) notFound();
  const fs = fairShare(p);
  const ratio = `$${fs.ratio.toFixed(2)}`;
  const note = p.fairShareNote.replace('{s10ratio}', `$${fs.ratioCostReport.toFixed(2)}`);
  const allLines = p.ledger.groups.flatMap((g) => g.lines);
  const numberOf = (line: (typeof allLines)[number]) => allLines.indexOf(line) + 1;

  return (
    <>
      {/* Title block */}
      <section className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-12">
        <nav aria-label="Breadcrumb" className="font-meta text-[12px] tracking-[0.1em] text-muted mb-7">
          <Link href="/systems/" className="text-muted hover:text-oxblood">/Health Systems</Link>{' '}
          <Link href="/systems/" className="text-muted hover:text-oxblood">/{p.footprint}</Link>{' '}
          <span className="text-ink">/{p.name}</span>
        </nav>
        <div className="flex flex-wrap gap-8 justify-between items-end">
          <div className="flex-[999_1_560px] min-w-0">
            <p className={`${eyebrow} text-muted mb-3`}>
              {p.kind} · {p.taxStatus} · {p.hq}
            </p>
            <h1 className="font-display font-normal text-[44px] md:text-[64px] lg:text-[72px] leading-[1]">{p.name}</h1>
            <p className="mt-5 max-w-[720px] italic text-[22px] leading-[1.45] text-body">{p.verdict}</p>
          </div>
          <div className="flex-[1_1_260px] flex flex-col gap-2.5">
            <Link href="/reports/" className={`${button} border border-ink hover:text-oxblood hover:border-oxblood`}>
              Download the profile (PDF)
            </Link>
            <a href="#buy" className={`${button} bg-green text-paper hover:bg-ink`}>
              Get the full dataset
            </a>
          </div>
        </div>
      </section>

      {/* Key figures strip */}
      <section className="border-y border-hairline">
        <div className="max-w-content mx-auto px-5 md:px-8 grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {p.keyFigures.map((k, i) => (
            <div key={k.label} className={`py-6 ${i === 0 ? 'pr-5' : 'px-5 border-l border-hairline'}`} title={k.source}>
              <div className="italic text-[16px] text-muted">{k.label}</div>
              <div className="font-display text-[36px] mt-1.5">{k.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Where the money sits */}
      <section className="bg-green text-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 pt-[72px] pb-16">
          <div className="flex flex-wrap justify-between items-baseline gap-3 mb-10">
            <h2 className={`${h2} text-[34px] md:text-[40px] text-paper`}>Where the money sits</h2>
            <span className="italic text-[18px] text-green-text">{p.money.asOf}</span>
          </div>
          <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {p.money.items.map((m) => (
              <div key={m.value} className="flex flex-col gap-2.5 border-t border-green-rule pt-5" title={m.source}>
                <div className="font-display leading-none text-paper whitespace-nowrap" style={{ fontSize: 'clamp(44px, 4.8vw, 68px)' }}>{m.value}</div>
                <div className="text-[19px] leading-[1.4] text-green-text-2">{m.text}</div>
                <div className="font-meta text-[11px] leading-[1.6] text-green-text">{m.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Fair Share Test */}
      <section className="max-w-content mx-auto px-5 md:px-8 pt-[72px] pb-10">
        <div className="flex flex-wrap gap-14 items-center">
          <div className="flex-[1_1_360px] min-w-0">
            <div className={`${eyebrow} text-oxblood mb-3.5`}>The Fair Share Test</div>
            <div className="font-display text-[84px] md:text-[120px] leading-[0.95] text-oxblood">{ratio}</div>
            <div className="italic text-[17px] text-muted mt-2.5">{filledSentence(fs.filled, fs.lines)}</div>
            <p className="mt-4 text-[22px] leading-[1.4]">
              in subsidies and write-offs for every <strong className="font-semibold">$1</strong> of free care a patient actually received.
            </p>
          </div>
          <div className="flex-[1_1_460px] min-w-0 flex flex-col gap-[22px]">
            <div>
              <div className="flex justify-between font-meta text-[13px] mb-2">
                <span className="font-body italic text-[17px]">Subsidies &amp; write-offs (so far)</span>
                <span className="font-semibold">{short(fs.total)}</span>
              </div>
              <div className="h-7 bg-oxblood w-full" role="img" aria-label={`Subsidies and write-offs ${short(fs.total)}`} />
            </div>
            <div>
              <div className="flex justify-between font-meta text-[13px] mb-2">
                <span className="font-body italic text-[17px]">{p.freeCare.label}</span>
                <span className="font-semibold">{millions(p.freeCare.amount)}</span>
              </div>
              <div
                className="h-7 bg-green"
                style={{ width: `${(fs.freeCareShare * 100).toFixed(1)}%` }}
                role="img"
                aria-label={`Free care delivered ${millions(p.freeCare.amount)}`}
              />
            </div>
            <p className="font-meta text-[12px] leading-[1.6] text-muted">{note}</p>
          </div>
        </div>
      </section>

      {/* The Subsidy Ledger */}
      <section className="max-w-[1000px] mx-auto px-5 md:px-8 pt-10 pb-[88px]">
        <div className="flex flex-wrap justify-between items-baseline gap-3 border-t border-ink pt-5 mb-2">
          <h2 className={`${h2} text-[34px] md:text-[44px]`}>The Subsidy Ledger</h2>
          <span className="italic text-[18px] text-muted">{p.ledger.caption}</span>
        </div>
        <div className="table-scroll">
          <table className="w-full min-w-[600px] border-collapse text-[19px]">
            <tbody>
              {p.ledger.groups.map((g) => (
                <Fragment key={g.name}>
                  <tr>
                    <td colSpan={3} className="pt-8 pb-1.5 font-display italic text-[22px] text-oxblood border-b border-ink">{g.name}</td>
                  </tr>
                  {g.lines.map((l) => (
                    <tr key={l.name}>
                      <td className={`${cell} pr-4`}>
                        {l.name}
                        <sup className="font-meta text-[10px] text-muted ml-[3px]">{numberOf(l)}</sup>
                      </td>
                      <td className={`${cell} pr-4 italic text-muted`}>{l.payer}</td>
                      <td className={`${cell} text-right whitespace-nowrap font-display text-[20px]`} title={l.amount != null ? l.source : undefined}>
                        {l.amount != null ? millions(l.amount) : <Dash />}
                        {l.amount != null && l.basis === 'estimated' && (
                          <span className="font-body italic text-[14px] text-gold ml-1.5">est.</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
              <tr>
                <td colSpan={2} className="py-[22px] pr-4 border-t-2 border-ink font-display text-[22px]">Total subsidies and write-offs</td>
                <td className="py-[22px] border-t-2 border-ink text-right whitespace-nowrap font-display text-[30px] text-oxblood">{millions(fs.total)}+</td>
              </tr>
              <tr>
                <td colSpan={2} className="py-[18px] pr-4 border-y border-hairline italic text-green">For comparison: free care actually delivered to patients, at cost</td>
                <td className="py-[18px] border-y border-hairline text-right whitespace-nowrap font-display text-[26px] text-green" title={p.freeCare.source}>{millions(p.freeCare.amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-[18px] italic text-[16px] text-muted">{p.ledger.note}</p>
        <div className="mt-10 border-t border-hairline pt-[18px]">
          <div className="font-display text-[20px] mb-3">Sources</div>
          <ol className="pl-[22px] font-meta text-[12px] leading-[1.6] text-muted" style={{ columns: '2 320px', columnGap: 40 }}>
            {allLines.map((l) => (
              <li key={l.name} className="mb-1" style={{ breakInside: 'avoid' }}>{l.source}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Power and influence */}
      <section className="bg-paper-2 border-y border-hairline">
        <div className="max-w-content mx-auto px-5 md:px-8 py-[72px] grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {[
            { title: 'Leadership & pay', block: p.pay },
            { title: 'Lobbying & politics', block: p.lobbying },
            { title: 'Market power', block: p.market },
          ].map(({ title, block }) => (
            <div key={title}>
              <h3 className={`${h2} text-[28px] border-b border-ink pb-3 mb-[18px]`}>{title}</h3>
              <FactRows rows={block.rows} />
              <p className="mt-3 font-meta text-[12px] text-muted">{block.sourceLine}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buy */}
      <section id="buy" className="max-w-content mx-auto px-5 md:px-8 py-20">
        <div className="flex flex-wrap gap-12 items-center border-t border-ink pt-10">
          <div className="flex-[999_1_520px] min-w-0">
            <h2 className={`${h2} text-[34px] md:text-[40px] mb-3.5`}>Take the numbers with you.</h2>
            <p className="text-[20px] leading-[1.5] text-body">{p.buy.text}</p>
          </div>
          <div className="flex-[1_1_300px] flex flex-col gap-2.5 font-meta text-[14px] font-medium">
            {p.buy.options.map((o) => (
              <Link
                key={o.label}
                href="/reports/"
                className={`flex justify-between gap-4 px-5 py-4 ${o.primary ? 'bg-green text-paper hover:bg-ink' : 'border border-ink hover:text-oxblood hover:border-oxblood'}`}
              >
                <span>{o.label}</span>
                <span className="whitespace-nowrap">{o.price ? `${o.price}${o.perYear ? '/yr' : ''}` : 'Price pending'}</span>
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-12 font-meta text-[12px] leading-[1.7] text-muted max-w-[720px]">
          {p.sourcesLine}{' '}
          <Link href="/methodology/subsidy-ledger/" className="text-ink border-b border-hairline hover:text-oxblood">Methodology</Link> ·{' '}
          <a href="https://read.rojasreport.com/about" className="text-ink border-b border-hairline hover:text-oxblood">Report a correction</a>
        </p>
      </section>
    </>
  );
}
