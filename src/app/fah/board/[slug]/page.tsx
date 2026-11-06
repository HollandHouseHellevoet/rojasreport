import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RedFlagCallout from "@/components/aha/RedFlagCallout";
import FahBreadcrumb from "@/components/fah/FahBreadcrumb";
import DataTable from "@/components/fah/DataTable";
import SourceList from "@/components/fah/SourceList";
import Label from "@/components/hac/Label";
import { board, org, getMember, getAdjacentMember, fmtDate } from "@/lib/fah";

export function generateStaticParams() {
  return board.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = getMember(params.slug);
  if (!m) return {};
  const title = `${m.name}: Federation of American Hospitals Board Dossier`;
  const description = `${m.nickname}. ${m.title}, ${m.company}. ${(m.redFlags[0] || m.overview).slice(0, 120)}`.slice(0, 155);
  const url = `https://rojasreport.com/fah/board/${m.slug}/`;
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
      {title && <h2 className="font-display text-2xl sm:text-[28px] text-cream mb-6">{title}</h2>}
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((b, i) => (
        <li key={i} className="font-body text-sm text-cream/85 flex items-start gap-2"><span className="text-orange mt-0.5">&bull;</span><span>{b}</span></li>
      ))}
    </ul>
  );
}

export default function BoardMemberPage({ params }: { params: { slug: string } }) {
  const m = getMember(params.slug);
  if (!m) notFound();
  const { prev, next } = getAdjacentMember(m.slug);
  const url = `https://rojasreport.com/fah/board/${m.slug}/`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${m.name}: ${org.name} board dossier`,
      description: `${m.nickname}. ${m.title}, ${m.company}.`,
      url,
      publisher: { "@type": "Organization", name: "The Rojas Report", url: "https://rojasreport.com" },
      dateModified: m.lastVerified,
    },
    { "@context": "https://schema.org", "@type": "Person", name: m.name, jobTitle: m.title, worksFor: { "@type": "Organization", name: m.company }, url },
  ];

  return (
    <article className="py-12 sm:py-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <FahBreadcrumb trail={[{ href: "/fah/#board", label: "Board" }]} current={m.name} />

        <header className="mb-10">
          <h1 className="font-display text-4xl sm:text-[56px] leading-[1.1] text-cream">{m.name}</h1>
          <p className="font-display italic text-orange text-lg sm:text-xl mt-2">{m.nickname}</p>
          <p className="font-body text-cream/80 mt-4">{m.title}, {m.company}{m.ticker ? ` (${m.ticker})` : ""}</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="inline-block px-3 py-1 text-xs font-body border border-orange/40 text-orange rounded-full">{m.fahRole}</span>
            <span className="inline-block px-3 py-1 text-xs font-body border border-cream/20 text-cream/70 rounded-full">{m.sector}</span>
            {m.owner && <span className="font-body text-sm text-cream/50">{m.owner}</span>}
          </div>
          <p className="font-body text-muted mt-3" style={{ fontSize: "12px" }}>Last verified {fmtDate(m.lastVerified)}</p>
          <div className="w-16 h-0.5 bg-orange mt-8" />
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 bg-navy-dark border-y border-ink/10 py-8 px-4">
          {m.keyStats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl sm:text-4xl text-orange">{s.value}</p>
              <p className="font-body text-xs sm:text-sm text-cream/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <Section label="Overview">
          <p className="font-body text-cream/85 leading-relaxed">{m.overview}</p>
        </Section>

        {m.developments.length > 0 && (
          <Section label="Since April 2026" title="What has changed">
            <ul className="space-y-3">
              {m.developments.map((d) => (
                <li key={d.url + d.date} className="font-body text-sm text-cream/85 flex items-start gap-3">
                  <span className="text-orange whitespace-nowrap">{fmtDate(d.date)}</span>
                  <span>
                    {d.text}{" "}
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-orange underline underline-offset-2">source</a>
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {m.companyRecord.length > 0 && (
          <Section label="The company" title={m.company}>
            <Bullets items={m.companyRecord} />
          </Section>
        )}

        {m.ownership.length > 0 && (
          <Section label="Ownership and control">
            <Bullets items={m.ownership} />
          </Section>
        )}

        {m.litigation.length > 0 && (
          <Section label="Settlements, investigations and lawsuits">
            <Bullets items={m.litigation} />
          </Section>
        )}

        {m.compensation.length > 0 && (
          <Section label="Compensation">
            <DataTable label="Compensation" headers={["Year", "Total compensation", "CEO-to-worker pay ratio"]} rows={m.compensation.map((c) => [c.year, c.total, c.payRatio])} />
          </Section>
        )}

        {m.deals.length > 0 && (
          <Section label="Deals since 2025">
            <Bullets items={m.deals} />
          </Section>
        )}

        {m.politicalGiving.length > 0 && (
          <Section label="Political giving">
            <Bullets items={m.politicalGiving} />
          </Section>
        )}

        <Section label="Red flags" title="Conflicts and concerns">
          {m.redFlags.length > 0 ? m.redFlags.map((f, i) => <RedFlagCallout key={i} text={f} />) : (
            <p className="font-body text-muted italic">None located in available sources.</p>
          )}
        </Section>

        <Section label="Physician-owned hospitals">
          <div className="bg-navy-dark border border-orange/20 p-6 sm:p-8">
            <p className="font-body text-cream/85 leading-relaxed">{m.pohRelevance}</p>
          </div>
        </Section>

        <Section label="Sources">
          <SourceList sources={m.sources} />
        </Section>

        <nav className="flex justify-between items-center pt-8 border-t border-ink/10" aria-label="Board navigation">
          {prev ? <Link href={`/fah/board/${prev.slug}/`} className="font-body text-sm text-cream/60 hover:text-orange transition-colors">&larr; {prev.name}</Link> : <div />}
          {next ? <Link href={`/fah/board/${next.slug}/`} className="font-body text-sm text-cream/60 hover:text-orange transition-colors text-right">{next.name} &rarr;</Link> : <div />}
        </nav>
      </div>
    </article>
  );
}
