import type { Metadata } from "next";
import FahBreadcrumb from "@/components/fah/FahBreadcrumb";
import DataTable from "@/components/fah/DataTable";
import SourceList from "@/components/fah/SourceList";
import Label from "@/components/hac/Label";
import { org, fmtDate } from "@/lib/fah";

const DESC = "How the Federation of American Hospitals lobbies: annual spending from Senate filings, retained firms, the revolving door, and the dark-money vehicle beside it.";

export const metadata: Metadata = {
  title: "FAH Lobbying: The Machine",
  description: DESC,
  alternates: { canonical: "https://rojasreport.com/fah/lobbying/" },
  openGraph: { title: "FAH Lobbying | The Rojas Report", description: DESC, url: "https://rojasreport.com/fah/lobbying/", siteName: "The Rojas Report", type: "article" },
  twitter: { card: "summary_large_image", title: "FAH Lobbying | The Rojas Report", description: DESC, site: "@TheRojasReport" },
};

function Section({ label, title, children }: { label: string; title?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <Label className="mb-3">{label}</Label>
      {title && <h2 className="font-display text-2xl sm:text-[28px] text-cream mb-6">{title}</h2>}
      {children}
    </section>
  );
}

export default function LobbyingPage() {
  const L = org.lobbying;
  return (
    <article className="py-12 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <FahBreadcrumb current="Lobbying" />
        <header className="mb-10">
          <Label className="mb-3">Lobbying</Label>
          <h1 className="font-display text-4xl sm:text-[56px] leading-[1.1] text-cream mb-4">The machine</h1>
          <p className="font-body text-lg text-cream/80 max-w-2xl">{L.narrative}</p>
          <p className="font-body text-sm text-muted mt-3">Record as of {fmtDate(org.asOf)}</p>
          <div className="w-16 h-0.5 bg-orange mt-8" />
        </header>

        <Section label="01 · Annual spending" title="Federal lobbying by year (Senate filings)">
          <DataTable label="Annual lobbying" headers={["Year", "Reported spending"]} rows={[...L.annual.map((a) => [a.year, a.amount]), [`2026 through ${L.ytd2026.through}`, L.ytd2026.amount]]} />
          <p className="font-body text-sm text-cream/70 mt-4">{L.inHouseLobbyists.count} registered in-house lobbyists on the {L.inHouseLobbyists.asOf} filing.</p>
        </Section>

        <Section label="02 · Retained firms" title="Outside firms on retainer">
          <DataTable
            label="Retained firms"
            headers={["Firm", "2025", "2026 to date", "Issues", "Notable"]}
            rows={L.retainedFirms.map((f) => [f.firm, f.amount2025, f.amount2026ytd, f.issues, f.notable || " "])}
          />
        </Section>

        <Section label="03 · The revolving door" title="From government to the hospital lobby">
          <p className="font-body text-cream/85 leading-relaxed mb-6">{org.revolvingDoor.narrative}</p>
          {org.revolvingDoor.people.length > 0 && (
            <DataTable label="Revolving door" headers={["Name", "Now", "Before"]} rows={org.revolvingDoor.people.map((p) => [p.name, p.current, p.prior])} />
          )}
        </Section>

        <Section label="04 · Dark money" title="Partnership for America's Health Care Future">
          <p className="font-body text-cream/85 leading-relaxed mb-6">{org.pahcf.narrative}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6 bg-navy-dark border-y border-ink/10 py-8 px-4">
            {[
              [org.pahcf.founded, "Founded"],
              [org.pahcf.memberCount, "Member organizations"],
              [org.pahcf.cumulativeSpend, "Spent since founding (Form 990)"],
              [org.pahcf.status2026, "Status in 2026"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="font-display text-2xl sm:text-3xl text-orange">{v}</p>
                <p className="font-body text-xs sm:text-sm text-cream/70 mt-1">{l}</p>
              </div>
            ))}
          </div>
          {org.pahcf.byYear.length > 0 && (
            <DataTable label="PAHCF by year" headers={["Year", "Revenue", "Expenses"]} rows={org.pahcf.byYear.map((y) => [y.year, y.revenue, y.expenses])} />
          )}
        </Section>

        <Section label="Sources">
          <SourceList sources={[...L.sources, ...org.revolvingDoor.sources, ...org.pahcf.sources]} />
        </Section>
      </div>
    </article>
  );
}
