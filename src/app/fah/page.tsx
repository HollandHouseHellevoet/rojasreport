import Link from "next/link";
import Label from "@/components/hac/Label";
import ThreatTag from "@/components/fah/ThreatTag";
import DataTable from "@/components/fah/DataTable";
import SourceList from "@/components/fah/SourceList";
import { org, board, pillars, fmtDate } from "@/lib/fah";

export default function FahPage() {
  const officers = [
    ["Chair", org.board.chair],
    ["Chair-elect", org.board.chairElect],
    ["Immediate past chair", org.board.pastChair],
    ["Treasurer", org.board.treasurer],
  ] as const;

  return (
    <article>
      <section className="py-20 sm:py-28 px-4" aria-label="Overview">
        <div className="max-w-4xl mx-auto text-center">
          <Label className="mb-6">The Lobby · Intelligence briefing</Label>
          <h1 className="font-display text-5xl sm:text-[64px] leading-[1.05] text-cream mb-6 [text-wrap:balance]">
            The {org.name}
          </h1>
          <p className="font-body text-lg sm:text-xl text-cream max-w-2xl mx-auto mb-4">{org.tagline}</p>
          <p className="font-body text-sm text-muted mb-10">Record as of {fmtDate(org.asOf)}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fah/#board" className="inline-flex items-center justify-center px-6 py-3 bg-oxblood text-paper font-body font-semibold text-sm hover:bg-orange-light transition-colors">
              The board &rarr;
            </Link>
            <Link href="/fah/pillars/" className="inline-flex items-center justify-center px-6 py-3 border border-cream/30 text-cream font-body font-semibold text-sm hover:border-orange hover:text-orange transition-colors">
              The eight pillars &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-navy-dark py-12 px-4 border-y border-ink/10" aria-label="Key figures">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {org.keyStats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl sm:text-5xl text-orange">{s.value}</p>
              <p className="font-body text-sm text-cream mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4" aria-label="Threat matrix">
        <div className="max-w-5xl mx-auto">
          <Label className="mb-3">01 · Threat assessment</Label>
          <h2 className="font-display text-3xl sm:text-[42px] text-cream mb-4">Where FAH stands on the eight fights</h2>
          <p className="font-body text-cream max-w-2xl mb-10">
            FAH&apos;s documented position on the eight policy areas that decide whether physician-owned hospitals and independent physicians can compete.
          </p>
          <DataTable
            label="Policy threat matrix"
            headers={["Pillar", "FAH position", "Threat"]}
            rows={pillars.map((p) => [
              <Link key={p.slug} href={`/fah/pillars/${p.slug}/`} className="font-semibold hover:text-orange transition-colors">{p.number} · {p.title}</Link>,
              p.summary,
              <ThreatTag key={p.slug + "t"} level={p.threat} />,
            ])}
          />
        </div>
      </section>

      <section id="board" className="bg-navy-dark py-16 sm:py-24 px-4 border-y border-ink/10" aria-label="Board dossiers">
        <div className="max-w-6xl mx-auto">
          <Label className="mb-3">02 · The board</Label>
          <h2 className="font-display text-3xl sm:text-[42px] text-cream mb-4">Who runs the for-profit hospital lobby</h2>
          <p className="font-body text-cream max-w-2xl mb-10">{org.board.note}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {officers.map(([role, o]) => (
              <div key={role} className="bg-navy-light p-6 border-t-2 border-orange">
                <Label className="mb-2">{role}</Label>
                <p className="font-body text-cream font-semibold">
                  {o.slug ? <Link href={`/fah/board/${o.slug}/`} className="hover:text-orange transition-colors">{o.name}</Link> : o.name}
                </p>
                <p className="font-body text-sm text-cream">{o.company}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {board.map((m) => (
              <Link key={m.slug} href={`/fah/board/${m.slug}/`} className="block bg-navy-light border border-ink/10 hover:border-orange p-6 transition-colors">
                <Label className="mb-2">{m.fahRole}</Label>
                <h3 className="font-tight font-bold tracking-[-0.015em] text-[22px] text-cream mb-1">{m.name}</h3>
                <p className="italic text-orange text-sm mb-3">{m.nickname}</p>
                <p className="font-body text-sm text-cream">{m.title}, {m.company}</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {m.keyStats.slice(0, 2).map((s) => (
                    <div key={s.label}>
                      <p className="font-display text-xl text-orange">{s.value}</p>
                      <p className="font-body text-xs text-cream leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="font-body text-sm text-orange mt-4">{m.redFlags.length} red flags &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4" aria-label="Lobbying and PAC">
        <div className="max-w-5xl mx-auto">
          <Label className="mb-3">03 · The machine</Label>
          <h2 className="font-display text-3xl sm:text-[42px] text-cream mb-4">Lobbying, PAC and dark money</h2>
          <p className="font-body text-cream max-w-2xl mb-8">{org.lobbying.narrative}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/fah/lobbying/" className="inline-flex items-center px-5 py-2.5 border border-cream/30 text-cream font-body font-semibold text-sm hover:border-orange hover:text-orange transition-colors">Lobbying &rarr;</Link>
            <Link href="/fah/pac/" className="inline-flex items-center px-5 py-2.5 border border-cream/30 text-cream font-body font-semibold text-sm hover:border-orange hover:text-orange transition-colors">PAC &rarr;</Link>
          </div>
        </div>
      </section>

      {org.developments.length > 0 && (
        <section className="bg-navy-dark py-16 sm:py-24 px-4 border-y border-ink/10" aria-label="Developments">
          <div className="max-w-5xl mx-auto">
            <Label className="mb-3">04 · Since April 2026</Label>
            <h2 className="font-display text-3xl sm:text-[42px] text-cream mb-8">What has changed</h2>
            <ul className="space-y-3">
              {org.developments.map((d) => (
                <li key={d.url + d.date} className="font-body text-sm text-cream flex items-start gap-3">
                  <span className="text-orange whitespace-nowrap">{fmtDate(d.date)}</span>
                  <span>
                    {d.text}{" "}
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-orange underline underline-offset-2">source</a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-24 px-4" aria-label="Bottom line">
        <div className="max-w-4xl mx-auto">
          <Label className="mb-3">05 · Bottom line</Label>
          <div className="bg-navy-dark border border-orange/30 p-6 sm:p-8 mb-12">
            <p className="font-body text-cream text-lg leading-relaxed">{org.bottomLine}</p>
          </div>
          <Label className="mb-3">Sources</Label>
          <SourceList sources={org.sources} />
        </div>
      </section>
    </article>
  );
}
