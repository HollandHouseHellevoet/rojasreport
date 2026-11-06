import Link from "next/link";
import Label from "@/components/hac/Label";
import { members, committee, fmtDate } from "@/lib/hac";

const STATS = [
  { number: String(committee.memberCount), label: "Members on the committee" },
  { number: "0", label: "With a stated interest in physician ownership" },
  { number: committee.nominations, label: "Nominations reviewed" },
  { number: String(members.filter((m) => m.redFlags.length > 0).length), label: "Members with at least one red flag" },
];

export default function HacPage() {
  return (
    <article>
      <section className="py-20 sm:py-28 px-4" aria-label="Overview">
        <div className="max-w-4xl mx-auto text-center">
          <Label className="mb-6">Washington · Intelligence briefing</Label>
          <h1 className="font-display text-5xl sm:text-[64px] leading-[1.05] font-bold text-cream mb-6 [text-wrap:balance]">
            The {committee.name}
          </h1>
          <p className="font-body text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto mb-4">
            {committee.memberCount} members picked from {committee.nominations} nominations to advise HHS and CMS. None has a stated interest in expanding physician ownership.
          </p>
          <p className="font-body text-sm text-muted mb-10">Record as of {fmtDate(committee.asOf)}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hac/#members" className="inline-flex items-center justify-center px-6 py-3 bg-orange text-cream font-body font-semibold text-sm hover:bg-orange-light transition-colors">
              The members &rarr;
            </Link>
            <Link href="/hac/pattern-analysis/" className="inline-flex items-center justify-center px-6 py-3 border border-cream/30 text-cream font-body font-semibold text-sm hover:border-orange hover:text-orange transition-colors">
              Pattern analysis &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-navy-dark py-12 px-4 border-y border-white/10" aria-label="Key figures">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl sm:text-5xl font-bold text-orange">{s.number}</p>
              <p className="font-body text-sm text-cream/70 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4" aria-label="Committee details">
        <div className="max-w-5xl mx-auto">
          <Label className="mb-3">01 · The committee</Label>
          <h2 className="font-display text-3xl sm:text-[42px] text-cream font-semibold mb-10">What it is</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              ["Announced", committee.announced],
              ["Authority", committee.authority],
              ["Reports to", committee.reportsTo],
              ["Stated focus areas", committee.focusAreas],
            ].map(([k, v]) => (
              <div key={k} className="bg-navy-light p-6 border-t-2 border-orange">
                <Label className="mb-2">{k}</Label>
                <p className="font-body text-cream">{v}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left" aria-label="Full roster">
              <thead>
                <tr className="border-b border-white/20">
                  {["#", "Name", "Title", "Organization", "Sector"].map((h, i) => (
                    <th key={h} className={`font-body text-xs uppercase tracking-widest text-orange py-3 pr-4 ${i === 2 ? "hidden sm:table-cell" : ""} ${i === 3 ? "hidden md:table-cell" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={m.slug} className="border-b border-white/5 hover:bg-navy-light/50 transition-colors">
                    <td className="font-body text-sm text-cream/50 py-3 pr-4">{String(i + 1).padStart(2, "0")}</td>
                    <td className="font-body text-sm text-cream py-3 pr-4 font-semibold">
                      <Link href={`/hac/members/${m.slug}/`} className="hover:text-orange transition-colors">{m.name}</Link>
                    </td>
                    <td className="font-body text-sm text-cream/70 py-3 pr-4 hidden sm:table-cell">{m.title}</td>
                    <td className="font-body text-sm text-cream/70 py-3 pr-4 hidden md:table-cell">{m.org}</td>
                    <td className="font-body text-xs text-orange py-3">{m.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="members" className="py-16 sm:py-24 px-4 bg-navy-dark" aria-label="Member dossiers">
        <div className="max-w-6xl mx-auto">
          <Label className="mb-3">02 · The {committee.memberCount} members</Label>
          <h2 className="font-display text-3xl sm:text-[42px] text-cream font-semibold mb-10">Dossiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <Link key={m.slug} href={`/hac/members/${m.slug}/`} className="bg-navy-light border-t-2 border-orange p-6 block hover:-translate-y-1 hover:shadow-lg transition-transform" aria-label={`Dossier: ${m.name}`}>
                <h3 className="font-display text-xl text-cream font-semibold">{m.name}</h3>
                <p className="font-display italic text-orange text-sm mt-1">{m.nickname}</p>
                <p className="font-body text-sm text-cream/70 mt-3">{m.title}, {m.org}</p>
                <span className="inline-block mt-3 px-3 py-1 text-xs font-body border border-orange/40 text-orange rounded-full">{m.sector}</span>
                <p className="font-body text-sm text-orange mt-4">{m.redFlags.length} red flag{m.redFlags.length === 1 ? "" : "s"} &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4" aria-label="Who the committee serves">
        <div className="max-w-5xl mx-auto">
          <Label className="mb-3">03 · Pattern</Label>
          <h2 className="font-display text-3xl sm:text-[42px] text-cream font-semibold mb-10">Who the committee serves</h2>
          <div className="overflow-x-auto mb-12">
            <table className="w-full text-left" aria-label="Sector breakdown">
              <thead>
                <tr className="border-b border-white/20">
                  {["Sector", "Count", "Members"].map((h) => (
                    <th key={h} className="font-body text-xs uppercase tracking-widest text-orange py-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {committee.sectorBreakdown.map((r) => (
                  <tr key={r.sector} className="border-b border-white/5">
                    <td className="font-body text-sm text-cream py-3 pr-4">{r.sector}</td>
                    <td className="font-body text-sm text-orange font-semibold py-3 pr-4">{r.count}</td>
                    <td className="font-body text-sm text-cream/70 py-3">{r.members}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-navy-light p-6 sm:p-8 border-l-4 border-orange mb-10">
            <h3 className="font-display text-2xl text-cream font-semibold mb-4">Who is not at the table</h3>
            <ul className="space-y-2">
              {committee.notAtTable.map((item) => (
                <li key={item} className="font-body text-sm text-cream/80 flex items-start gap-2">
                  <span className="text-orange mt-1">&bull;</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/hac/pattern-analysis/" className="inline-flex items-center px-6 py-3 bg-orange text-cream font-body font-semibold text-sm hover:bg-orange-light transition-colors">
            Read the full pattern analysis &rarr;
          </Link>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 bg-navy-dark" aria-label="The thesis">
        <div className="max-w-4xl mx-auto">
          <Label className="mb-3">04 · The thesis</Label>
          <h2 className="font-display text-3xl sm:text-[42px] text-cream font-semibold mb-10">The structural conclusion</h2>
          <blockquote className="border-l-4 border-orange pl-6 sm:pl-8">
            <p className="font-display text-xl sm:text-2xl text-cream/90 italic leading-relaxed">&ldquo;{committee.thesis}&rdquo;</p>
            <footer className="mt-6"><p className="font-body text-sm text-orange">{committee.thesisDate}</p></footer>
          </blockquote>
        </div>
      </section>
    </article>
  );
}
