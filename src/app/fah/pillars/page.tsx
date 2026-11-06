import type { Metadata } from "next";
import Link from "next/link";
import FahBreadcrumb from "@/components/fah/FahBreadcrumb";
import ThreatTag from "@/components/fah/ThreatTag";
import Label from "@/components/hac/Label";
import { pillars, org, fmtDate } from "@/lib/fah";

const DESC = "The Federation of American Hospitals' documented positions on the eight policy fights that decide whether physician-owned hospitals and independent physicians can compete.";

export const metadata: Metadata = {
  title: "The Eight Pillars: Where FAH Stands",
  description: DESC,
  alternates: { canonical: "https://rojasreport.com/fah/pillars/" },
  openGraph: { title: "The Eight Pillars | The Rojas Report", description: DESC, url: "https://rojasreport.com/fah/pillars/", siteName: "The Rojas Report", type: "website" },
  twitter: { card: "summary_large_image", title: "The Eight Pillars | The Rojas Report", description: DESC, site: "@TheRojasReport" },
};

export default function PillarsPage() {
  return (
    <article className="py-12 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <FahBreadcrumb current="Eight pillars" />
        <Label className="mb-3">The fights</Label>
        <h1 className="font-display text-4xl sm:text-[56px] leading-[1.1] text-cream mb-4">The eight pillars</h1>
        <p className="font-body text-lg text-cream/80 max-w-2xl mb-2">{DESC}</p>
        <p className="font-body text-sm text-muted mb-12">Record as of {fmtDate(org.asOf)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <Link key={p.slug} href={`/fah/pillars/${p.slug}/`} className="block bg-navy-light border border-ink/10 hover:border-orange p-6 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <Label>Pillar {p.number}</Label>
                <ThreatTag level={p.threat} />
              </div>
              <h2 className="font-display text-2xl text-cream mb-1">{p.title}</h2>
              <p className="font-body text-xs text-cream/50 uppercase tracking-wider mb-4">{p.subtitle}</p>
              <p className="font-body text-sm text-cream/80 mb-2"><span className="text-orange font-semibold">FAH position:</span> {p.fahPosition}</p>
              {p.status2026[0] && <p className="font-body text-sm text-cream/70"><span className="text-orange font-semibold">Now:</span> {p.status2026[0].text}</p>}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
