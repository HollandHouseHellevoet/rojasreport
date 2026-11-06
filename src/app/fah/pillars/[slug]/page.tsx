import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FahBreadcrumb from "@/components/fah/FahBreadcrumb";
import ThreatTag from "@/components/fah/ThreatTag";
import DataTable from "@/components/fah/DataTable";
import SourceList from "@/components/fah/SourceList";
import Label from "@/components/hac/Label";
import { pillars, getPillar, getAdjacentPillar, fmtDate } from "@/lib/fah";

export function generateStaticParams() {
  return pillars.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPillar(params.slug);
  if (!p) return {};
  const title = `${p.title}: Where FAH Stands (Pillar ${p.number})`;
  const description = `${p.fahPosition} ${p.status2026[0]?.text || ""}`.slice(0, 155);
  const url = `https://rojasreport.com/fah/pillars/${p.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "The Rojas Report", type: "article" },
    twitter: { card: "summary_large_image", title, description, site: "@TheRojasReport" },
  };
}

function Section({ label, title, children }: { label: string; title?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <Label className="mb-3">{label}</Label>
      {title && <h2 className="font-display text-2xl sm:text-[28px] text-cream font-semibold mb-6">{title}</h2>}
      {children}
    </section>
  );
}

export default function PillarPage({ params }: { params: { slug: string } }) {
  const p = getPillar(params.slug);
  if (!p) notFound();
  const { prev, next } = getAdjacentPillar(p.slug);

  return (
    <article className="py-12 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <FahBreadcrumb trail={[{ href: "/fah/pillars/", label: "Eight pillars" }]} current={p.title} />

        <header className="mb-10">
          <Label className="mb-3">Pillar {p.number}</Label>
          <h1 className="font-display text-4xl sm:text-[56px] leading-[1.1] font-bold text-cream">{p.title}</h1>
          <p className="font-body text-sm text-cream/50 uppercase tracking-wider mt-3">{p.subtitle}</p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <ThreatTag level={p.threat} />
            <span className="font-body text-sm text-cream/70">{p.threatReason}</span>
          </div>
          <p className="font-body text-muted mt-3" style={{ fontSize: "12px" }}>Last verified {fmtDate(p.lastVerified)}</p>
          <div className="w-16 h-0.5 bg-orange mt-8" />
        </header>

        <Section label="FAH position">
          <div className="bg-navy-dark border border-orange/30 p-6 sm:p-8">
            <p className="font-body text-cream/90 text-lg leading-relaxed">{p.fahPosition}</p>
          </div>
        </Section>

        {p.status2026.length > 0 && (
          <Section label="Where it stands" title="Status as of November 2026">
            <ul className="space-y-3">
              {p.status2026.map((s, i) => (
                <li key={i} className="font-body text-sm text-cream/85 flex items-start gap-3">
                  <span className="text-orange whitespace-nowrap">{fmtDate(s.date)}</span>
                  <span>
                    {s.text}{" "}
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-orange underline underline-offset-2">source</a>
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {p.bills.length > 0 && (
          <Section label="Legislation" title="Bills in the 119th Congress">
            <DataTable
              label="Bills"
              headers={["Bill", "Title", "Sponsor", "Cosponsors", "Status"]}
              rows={p.bills.map((b) => [
                <a key={b.bill} href={b.url} target="_blank" rel="noopener noreferrer" className="text-orange hover:text-orange-light underline underline-offset-2">{b.bill}</a>,
                b.title,
                b.sponsor,
                b.cosponsors,
                `${b.status} (${b.asOf})`,
              ])}
            />
          </Section>
        )}

        {p.fahActions.length > 0 && (
          <Section label="FAH on the record" title="Letters, comments and statements">
            <ul className="space-y-3">
              {p.fahActions.map((a) => (
                <li key={a.url + a.date} className="font-body text-sm text-cream/85 flex items-start gap-3">
                  <span className="text-orange whitespace-nowrap">{fmtDate(a.date)}</span>
                  <span>
                    {a.text}{" "}
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-orange underline underline-offset-2">source</a>
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {p.keyFacts.length > 0 && (
          <Section label="The evidence">
            <ul className="space-y-3">
              {p.keyFacts.map((f, i) => (
                <li key={i} className="font-body text-sm text-cream/85 flex items-start gap-2">
                  <span className="text-orange mt-0.5">&bull;</span>
                  <span>
                    {f.text}{" "}
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-orange underline underline-offset-2">source</a>
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section label="What it means for physicians">
          <div className="bg-navy-dark border border-orange/20 p-6 sm:p-8">
            <p className="font-body text-cream/85 leading-relaxed">{p.whatItMeans}</p>
          </div>
        </Section>

        <Section label="Sources">
          <SourceList sources={p.sources} />
        </Section>

        <nav className="flex justify-between items-center pt-8 border-t border-white/10" aria-label="Pillar navigation">
          {prev ? <Link href={`/fah/pillars/${prev.slug}/`} className="font-body text-sm text-cream/60 hover:text-orange transition-colors">&larr; {prev.title}</Link> : <div />}
          {next ? <Link href={`/fah/pillars/${next.slug}/`} className="font-body text-sm text-cream/60 hover:text-orange transition-colors text-right">{next.title} &rarr;</Link> : <div />}
        </nav>
      </div>
    </article>
  );
}
