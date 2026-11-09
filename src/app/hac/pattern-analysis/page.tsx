import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/hac/Label";
import { committee, fmtDate } from "@/lib/hac";

const DESC = "Sector by sector, who the Healthcare Advisory Committee serves, who benefits from each stated focus area, and who is not at the table.";

export const metadata: Metadata = {
  title: "Healthcare Advisory Committee: Pattern Analysis",
  description: DESC,
  alternates: { canonical: "https://rojasreport.com/hac/pattern-analysis/" },
  openGraph: { title: "Pattern Analysis | The Rojas Report", description: DESC, url: "https://rojasreport.com/hac/pattern-analysis/", siteName: "The Rojas Report", type: "article" },
  twitter: { card: "summary_large_image", title: "Pattern Analysis | The Rojas Report", description: DESC, site: "@TheRojasReport" },
};

const sectorMap = [
  { sector: "Hospital systems and finance", members: [
    { name: "William J. Gassen, JD", slug: "william-gassen", org: "Sanford Health ($12.5B)" },
    { name: "Dennis Laraway", slug: "dennis-laraway", org: "Cleveland Clinic ($18B)" },
    { name: "Dan Liljenquist, JD", slug: "dan-liljenquist", org: "Intermountain Health ($15B+)" },
  ]},
  { sector: "Value-based care and managed care", members: [
    { name: "Robert Bessler, MD", slug: "robert-bessler", org: "Honest Health" },
    { name: "David Carmouche, MD", slug: "david-carmouche", org: "Lumeris" },
    { name: "Jenni Gudapati, PhD", slug: "jenni-gudapati", org: "HealthyInsights.ai / Boise State" },
  ]},
  { sector: "Primary care consolidation", members: [
    { name: "Clive K. Fields, MD", slug: "clive-fields", org: "VillageMD co-founder and former CMO; committee chair" },
  ]},
  { sector: "Insurance-adjacent and claims", members: [
    { name: "Kyu Rhee, MD", slug: "kyu-rhee", org: "NACHC; Providence Health Plan board" },
    { name: "Russ Thomas, JD", slug: "russ-thomas", org: "Availity (insurer-owned)" },
  ]},
  { sector: "For-profit behavioral health", members: [
    { name: "Andrew Lynch, PhD", slug: "andrew-lynch", org: "Acadia Healthcare (280 facilities)" },
  ]},
  { sector: "Government (CMS)", members: [
    { name: "Kimberly Brandt, JD", slug: "kimberly-brandt", org: "CMS Deputy Administrator and COO" },
    { name: "Stephanie Carlton", slug: "stephanie-carlton", org: "CMS Deputy Administrator and Chief Clinical AI Officer" },
  ]},
  { sector: "Venture capital and health tech", members: [
    { name: "Sebastian Caliri", slug: "sebastian-caliri", org: "8VC ($6B+ under management)" },
  ]},
  { sector: "Wellness and celebrity", members: [
    { name: "Tony Robbins", slug: "tony-robbins", org: "Fountain Life / Celularity" },
  ]},
  { sector: "State government", members: [
    { name: "Ursel J. McElroy, MA", slug: "ursel-mcelroy", org: "Ohio Department of Aging" },
    { name: "Valerie D. Huhn", slug: "valerie-huhn", org: "Missouri Department of Mental Health" },
  ]},
  { sector: "Safety net and FQHCs", members: [
    { name: "Linda Thomas-Hemak, MD", slug: "linda-thomas-hemak", org: "The Wright Center" },
  ]},
  { sector: "Nursing homes and post-acute care", members: [
    { name: "Elizabeth M. Fago", slug: "elizabeth-fago", org: "Home Quality Management" },
  ]},
];

const focusAreas = [
  { area: "Chronic disease prevention", beneficiaries: "Robbins (Fountain Life longevity diagnostics), Carmouche (Lumeris AI primary care), Fields (VillageMD risk-based primary care), Gudapati (population health education)." },
  { area: "Outcomes accountability", beneficiaries: "Bessler (Honest Health value-based contracts), Liljenquist (Castell ACO, $86.7M in Medicare savings), Carmouche (Lumeris enablement), R. Thomas (Availity claims processing)." },
  { area: "Real-time data", beneficiaries: "R. Thomas (Availity: 13 billion transactions a year), Caliri (8VC health tech portfolio), Brandt and Carlton (CMS modernization agenda)." },
  { area: "Vulnerable populations", beneficiaries: "Rhee (NACHC health centers), Thomas-Hemak (Wright Center), Lynch (Acadia behavioral health), Huhn (Missouri mental health), McElroy (Ohio aging)." },
  { area: "Medicare Advantage sustainability", beneficiaries: "Gassen (Sanford Health and the Oscar Health board), Liljenquist (SelectHealth, a Medicare Advantage insurer), Bessler (Honest Health risk adjustment), Laraway (Cleveland Clinic Medicare Advantage revenue), Fields (VillageMD Medicare Advantage contracts)." },
];

const pohMembers = [
  { name: "William J. Gassen, JD", slug: "william-gassen", detail: "AHA chair for 2027. AHA is the leading institutional opponent of physician-owned hospital expansion and opposes the bills that would loosen the ban." },
  { name: "Dennis Laraway", slug: "dennis-laraway", detail: "CFO of Cleveland Clinic, a direct financial beneficiary of the Section 6001 ban and of Medicare's site-of-service payment gap." },
  { name: "Dan Liljenquist, JD", slug: "dan-liljenquist", detail: "Intermountain Health is the kind of large nonprofit system whose market position the ban protects." },
  { name: "Robert Bessler, MD", slug: "robert-bessler", detail: "Honest Health's value-based model is built on hospital system partnerships, not physician ownership." },
  { name: "David Carmouche, MD", slug: "david-carmouche", detail: "Every career role has served payer-aligned consolidation, the opposite of physician ownership." },
  { name: "Clive K. Fields, MD", slug: "clive-fields", detail: "VillageMD is the corporate aggregation of independent practices, which displaces physician-owned independent medicine." },
  { name: "Kyu Rhee, MD", slug: "kyu-rhee", detail: "Former Aetna chief medical officer, current Providence Health Plan board member. Payer-integrated medicine, not physician ownership." },
  { name: "Kimberly Brandt, JD", slug: "kimberly-brandt", detail: "Led Stark Law reform at CMS. Controls the regulatory architecture that governs physician ownership." },
  { name: "Sebastian Caliri", slug: "sebastian-caliri", detail: "8VC's portfolio serves platform companies that capture CMS payment categories, not physician owners." },
];

export default function PatternAnalysis() {
  return (
    <article className="py-12 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <Label className="mb-3">Washington · {committee.name}</Label>
        <h1 className="font-display text-4xl sm:text-[56px] leading-[1.1] text-cream mb-4">Pattern analysis</h1>
        <p className="font-tight font-bold tracking-[-0.015em] text-[20px] sm:text-[22px] text-cream mb-2">Who the committee serves</p>
        <p className="font-body text-sm text-muted mb-12">Record as of {fmtDate(committee.asOf)}</p>

        <section className="mb-16" aria-label="Sector representation">
          <Label className="mb-3">01 · Sector representation</Label>
          <h2 className="font-display text-[32px] md:text-[40px] text-cream mb-8">All {committee.memberCount} members mapped</h2>
          <div className="space-y-6">
            {sectorMap.map((g) => (
              <div key={g.sector} className="bg-navy-light border-t-2 border-orange p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-body text-sm font-semibold text-orange uppercase tracking-wider">{g.sector}</h3>
                  <span className="font-display text-2xl text-cream">{g.members.length}</span>
                </div>
                <div className="space-y-2">
                  {g.members.map((m) => (
                    <div key={m.slug} className="flex items-center justify-between gap-4">
                      <Link href={`/hac/members/${m.slug}/`} className="font-body text-sm text-cream hover:text-orange transition-colors">{m.name}</Link>
                      <span className="font-body text-xs text-cream text-right">{m.org}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-label="Focus areas">
          <Label className="mb-3">02 · Focus areas</Label>
          <h2 className="font-display text-[32px] md:text-[40px] text-cream mb-8">Who benefits from each stated focus area</h2>
          <div className="space-y-4">
            {focusAreas.map((f) => (
              <div key={f.area} className="bg-navy-dark border border-ink/10 p-5 sm:p-6">
                <h3 className="font-tight font-bold tracking-[-0.015em] text-[20px] text-orange mb-2">{f.area}</h3>
                <p className="font-body text-sm text-cream leading-relaxed">{f.beneficiaries}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-label="Structural gaps">
          <Label className="mb-3">03 · Structural gaps</Label>
          <h2 className="font-display text-[32px] md:text-[40px] text-cream mb-8">Who is not at the table</h2>
          <div className="bg-navy-light border-l-4 border-orange p-6 sm:p-8">
            <ul className="space-y-3">
              {committee.notAtTable.map((item) => (
                <li key={item} className="font-body text-sm text-cream flex items-start gap-3"><span className="text-orange mt-0.5 text-lg">&times;</span>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="poh" className="mb-16" aria-label="Physician-owned hospitals">
          <Label className="mb-3">04 · Physician-owned hospitals</Label>
          <h2 className="font-display text-[32px] md:text-[40px] text-cream mb-8">Members with a direct stake in the ban</h2>
          <div className="space-y-4">
            {pohMembers.map((p) => (
              <div key={p.slug} className="bg-navy-light border-l-4 border-orange p-5 sm:p-6">
                <Link href={`/hac/members/${p.slug}/`} className="font-body text-orange hover:text-orange-light font-semibold transition-colors">{p.name}</Link>
                <p className="font-body text-sm text-cream mt-2 leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-label="The dominant gravity">
          <Label className="mb-3">05 · The dominant gravity</Label>
          <h2 className="font-display text-[32px] md:text-[40px] text-cream mb-8">Structural conclusion</h2>
          <div className="bg-navy-dark border border-orange/30 p-6 sm:p-8 space-y-4">
            <p className="font-body text-cream leading-relaxed">The center of gravity is Medicare Advantage and value-based care. At least 10 of 18 members have a direct financial interest in Medicare Advantage rates, value-based contracts, or the claims infrastructure that processes them.</p>
            <p className="font-body text-cream leading-relaxed">The hospital bloc (Gassen, Laraway, Liljenquist) runs systems with more than $45 billion in combined revenue. The 2027 AHA chairman sits beside the CFO of Cleveland Clinic and the chief strategist of Intermountain. All three systems benefit from the Section 6001 ban on physician-owned hospitals.</p>
            <p className="font-body text-cream leading-relaxed">The value-based care corridor (Bessler, Carmouche, Fields) runs companies whose revenue depends on Medicare Advantage risk adjustment and CMS payment innovation. Bessler&apos;s company was founded by Rubicon Founders investors, among them the current and a former head of the CMS Innovation Center.</p>
            <p className="font-body text-cream leading-relaxed">No member represents independent physician practice. No member represents physician-owned hospitals. No member has publicly backed Section 6001 reform. The charter names &ldquo;Medicare Advantage sustainability&rdquo; as a priority, and the roster is built to sustain it.</p>
          </div>
        </section>

        <div className="text-center">
          <Link href="/hac/" className="inline-flex items-center px-6 py-3 border border-cream/30 text-cream font-body font-semibold text-sm hover:border-orange hover:text-orange transition-colors">&larr; Back to the committee</Link>
        </div>
      </div>
    </article>
  );
}
