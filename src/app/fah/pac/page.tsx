import type { Metadata } from "next";
import FahBreadcrumb from "@/components/fah/FahBreadcrumb";
import DataTable from "@/components/fah/DataTable";
import SourceList from "@/components/fah/SourceList";
import Label from "@/components/hac/Label";
import { org, fmtDate } from "@/lib/fah";

const DESC = "FEDPAC, the Federation of American Hospitals' political action committee: what it raised, what it gave, and who got it, from FEC filings.";

export const metadata: Metadata = {
  title: "FAH PAC: FEDPAC Money by Cycle",
  description: DESC,
  alternates: { canonical: "https://rojasreport.com/fah/pac/" },
  openGraph: { title: "FAH PAC | The Rojas Report", description: DESC, url: "https://rojasreport.com/fah/pac/", siteName: "The Rojas Report", type: "article" },
  twitter: { card: "summary_large_image", title: "FAH PAC | The Rojas Report", description: DESC, site: "@TheRojasReport" },
};

function Section({ label, title, children }: { label: string; title?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <Label className="mb-3">{label}</Label>
      {title && <h2 className="font-display text-[32px] md:text-[40px] text-cream mb-6">{title}</h2>}
      {children}
    </section>
  );
}

export default function PacPage() {
  const P = org.pac;
  const c26 = P.cycle2026;
  const c24 = P.cycle2024;
  return (
    <article className="py-12 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <FahBreadcrumb current="PAC" />
        <header className="mb-10">
          <Label className="mb-3">PAC</Label>
          <h1 className="font-display text-4xl sm:text-[56px] leading-[1.1] text-cream mb-4">{P.name}</h1>
          <p className="font-body text-lg text-cream max-w-2xl">{P.narrative}</p>
          <p className="font-body text-sm text-muted mt-3">FEC committee {P.fecId}. Record as of {fmtDate(org.asOf)}.</p>
          <div className="w-16 h-0.5 bg-orange mt-8" />
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14 bg-navy-dark border-y border-ink/10 py-8 px-4">
          {[
            [c26.receipts, "Raised, 2025-26 cycle"],
            [c26.contributions, "Given to candidates and committees"],
            [c26.cashOnHand, `Cash on hand, ${c26.asOf}`],
            [`${c26.demShare} / ${c26.repShare}`, "Democratic / Republican share"],
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="font-display text-2xl sm:text-3xl text-orange">{v}</p>
              <p className="font-body text-xs sm:text-sm text-cream mt-1">{l}</p>
            </div>
          ))}
        </div>

        <Section label="01 · Two cycles" title="2025-26 against 2023-24">
          <DataTable
            label="PAC cycles"
            headers={["", "2025-26 (to date)", "2023-24 (final)"]}
            rows={[
              ["Receipts", c26.receipts, c24.receipts],
              ["Disbursements", c26.disbursements, c24.disbursements],
              ["Contributions to candidates and committees", c26.contributions, c24.contributions],
              ["Democratic share", c26.demShare, c24.demShare],
              ["Republican share", c26.repShare, c24.repShare],
            ]}
          />
        </Section>

        {P.topRecipients.length > 0 && (
          <Section label="02 · Recipients" title="Top recipients, 2025-26 cycle">
            <DataTable label="Top recipients" headers={["Recipient", "Office", "Party", "Amount"]} rows={P.topRecipients.map((r) => [r.name, r.office, r.party, r.amount])} />
          </Section>
        )}

        <Section label="03 · The full picture" title="The PAC beside the dark money">
          <p className="font-body text-cream leading-relaxed">{org.pahcf.narrative}</p>
        </Section>

        <Section label="Sources">
          <SourceList sources={P.sources} />
        </Section>
      </div>
    </article>
  );
}
