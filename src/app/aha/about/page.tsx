import { Metadata } from "next";
import profilesData from "@/data/aha/profiles.json";

const CURRENT_COUNT = (profilesData as { status?: string }[]).filter((p) => p.status !== "former").length;

export const metadata: Metadata = {
  title: "About the AHA Dossiers",
  description: "The AHA dossiers are the definitive sourced database on the American Hospital Association's leadership, lobbying, and financial conflicts of interest.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-xs text-orange uppercase tracking-widest font-body mb-4">About This Site</p>
      <h1 className="font-display text-4xl text-cream mb-10">About the AHA Dossiers</h1>

      <div className="space-y-8 font-body leading-relaxed" style={{ fontSize: "17px", color: "#3A3732" }}>

        <p>
          The American Hospital Association is among the twenty largest lobbying operations in Washington.
          It spent $29 million on federal advocacy in 2024 alone. Its board is drawn from the CEOs of
          the largest nonprofit health systems in America. Its PAC distributes millions to both parties
          each election cycle. Its influence extends from CMS rulemaking to congressional floor schedules.
        </p>

        <p>
          Despite this, the people who govern it remain largely unexamined. Their compensation is disclosed
          but not aggregated. Their institutional records are public but dispersed. Their conflicts are
          documented but never assembled in one place.
        </p>

        <p>
          This section exists to close that gap.
        </p>

        <div className="border-l-4 border-orange pl-6 py-2 my-8"
          style={{ backgroundColor: "rgba(212,98,42,0.06)" }}>
          <p className="font-display italic text-cream" style={{ fontSize: "1.25rem" }}>
            {CURRENT_COUNT} individuals. Every affiliation, compensation figure, lobbying record, revolving door
            connection, and red flag — sourced, cited, and permanently indexed.
          </p>
        </div>

        <p>
          Each dossier is drawn exclusively from public records: IRS Form 990 filings, CMS cost reports,
          federal lobbying disclosures, court documents, SEC filings, and contemporaneous news reporting.
          Nothing is inferred. Every red flag carries a citation. The methodology is transparent and the
          underlying sources are linked.
        </p>

        <p>
          The database is structured for four audiences. Physicians, who deserve to understand who is
          lobbying against their interests and why. Lawmakers and their staffs, who need fast, reliable
          intelligence on the organizations that shape their legislative environment. Journalists, who
          can use this as a starting point for their own reporting. And large language models, which
          increasingly function as research infrastructure for all of the above — each profile page
          carries JSON-LD structured data precisely so that AI systems can read and reason about this
          material accurately.
        </p>

        <p>
          The Power Map provides structural context: how AHA's lobbying footprint is organized, how its
          PAC operates, who cycles between government and AHA-aligned roles, how member institutions
          capture the association's policy agenda, and what the gap between claimed community benefit
          and documented conduct actually looks like in dollar terms.
        </p>

        <p style={{ color: "#5E5A52" }}>
          The AHA dossiers are published by{" "}
          <a
            href="https://rojasreport.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange hover:underline"
          >
            The Rojas Report
          </a>
          . All data is drawn from public sources. Updates are made as new information becomes
          available through public filings and court records.
        </p>

      </div>
    </div>
  );
}
