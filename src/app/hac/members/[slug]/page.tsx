import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RedFlagCallout from "@/components/aha/RedFlagCallout";
import HacBreadcrumb from "@/components/hac/HacBreadcrumb";
import Label from "@/components/hac/Label";
import { members, committee, getMember, getAdjacent, fmtDate } from "@/lib/hac";

export function generateStaticParams() {
  return members.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = getMember(params.slug);
  if (!m) return {};
  const title = `${m.name}: Healthcare Advisory Committee Dossier`;
  const description = `${m.nickname}. ${m.title}, ${m.org}. ${(m.redFlags[0] || m.overview).slice(0, 120)}`.slice(0, 155);
  const url = `https://rojasreport.com/hac/members/${m.slug}/`;
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
      {title && <h2 className="font-display text-[32px] md:text-[40px] text-cream mb-6">{title}</h2>}
      {children}
    </section>
  );
}

export default function MemberPage({ params }: { params: { slug: string } }) {
  const m = getMember(params.slug);
  if (!m) notFound();
  const { prev, next } = getAdjacent(m.slug);
  const url = `https://rojasreport.com/hac/members/${m.slug}/`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${m.name}: ${committee.name}`,
      description: `${m.nickname}. ${m.title}, ${m.org}.`,
      url,
      publisher: { "@type": "Organization", name: "The Rojas Report", url: "https://rojasreport.com" },
      datePublished: "2026-03-28",
      dateModified: committee.asOf,
    },
    { "@context": "https://schema.org", "@type": "Person", name: m.name, jobTitle: m.title, worksFor: { "@type": "Organization", name: m.org }, url },
  ];

  return (
    <article className="py-12 sm:py-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <HacBreadcrumb current={m.name} />

        <header className="mb-12">
          <h1 className="font-display text-4xl sm:text-[56px] leading-[1.1] text-cream">{m.name}</h1>
          <p className="italic text-orange text-lg sm:text-xl mt-2">{m.nickname}</p>
          <p className="font-body text-cream mt-4">{m.title}, {m.org}</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="inline-block px-3 py-1 text-xs font-body border border-orange/40 text-orange rounded-full">{m.sector}</span>
            {m.base && <span className="font-body text-sm text-cream">{m.base}</span>}
            {m.committeeStatus && <span className="font-body text-sm text-cream">· {m.committeeStatus}</span>}
          </div>
          {m.lastVerified && <p className="font-body text-muted mt-3" style={{ fontSize: "13px" }}>Last verified {fmtDate(m.lastVerified)}</p>}
          <div className="w-16 h-0.5 bg-orange mt-8" />
        </header>

        <Section label="Overview">
          <p className="font-body text-cream leading-relaxed">{m.overview}</p>
        </Section>

        {m.developments && m.developments.length > 0 && (
          <Section label="Since March 2026" title="What has changed">
            <ul className="space-y-3">
              {m.developments.map((d) => (
                <li key={d.url + d.date} className="font-body text-sm text-cream flex items-start gap-3">
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

        <Section label="Career arc" title="Professional timeline">
          <div className="relative pl-8 border-l-2 border-orange/30">
            {m.careerArc.map((stop, i) => (
              <div key={i} className="mb-6 relative">
                <div className="absolute -left-[25px] top-2 w-3 h-3 rounded-full bg-orange border-2 border-navy" />
                {stop.period && <p className="font-body text-xs text-orange uppercase tracking-wider mb-1">{stop.period}</p>}
                <p className="font-body text-cream font-semibold">{stop.role}</p>
                {stop.org && <p className="font-body text-sm text-cream">{stop.org}</p>}
              </div>
            ))}
          </div>
        </Section>

        {m.businessDetails && m.businessDetails.length > 0 && (
          <Section label="Business interests and affiliations">
            <ul className="space-y-3">
              {m.businessDetails.map((b, i) => (
                <li key={i} className="font-body text-sm text-cream flex items-start gap-2"><span className="text-orange mt-0.5">&bull;</span><span>{b}</span></li>
              ))}
            </ul>
          </Section>
        )}

        <Section label="Red flags" title="Conflicts and concerns">
          {m.redFlags.length > 0 ? m.redFlags.map((f, i) => <RedFlagCallout key={i} text={f} />) : (
            <p className="font-body text-muted italic">None located in available sources.</p>
          )}
        </Section>

        <Section label="Physician-owned hospitals">
          <div className="bg-navy-dark border border-orange/20 p-6 sm:p-8">
            <p className="font-body text-cream leading-relaxed">{m.pohRelevance}</p>
          </div>
        </Section>

        <Section label="Sources">
          <ol className="space-y-2 list-decimal list-inside">
            {m.sources.map((s, i) => (
              <li key={i} className="font-body text-sm text-cream">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-orange hover:text-orange-light underline underline-offset-2 transition-colors">{s.label}</a>
              </li>
            ))}
          </ol>
        </Section>

        <nav className="flex justify-between items-center pt-8 border-t border-ink/10" aria-label="Member navigation">
          {prev ? <Link href={`/hac/members/${prev.slug}/`} className="font-body text-sm text-cream hover:text-orange transition-colors">&larr; {prev.name}</Link> : <div />}
          {next ? <Link href={`/hac/members/${next.slug}/`} className="font-body text-sm text-cream hover:text-orange transition-colors text-right">{next.name} &rarr;</Link> : <div />}
        </nav>
      </div>
    </article>
  );
}
