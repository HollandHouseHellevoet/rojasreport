import type { Metadata } from 'next';
import Link from 'next/link';
import { Arrow, Band, Hero, SectionHead, Smart, fmtDate, textlink } from '@/components/alliance/ui';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import cover from '@/data/home/cover.json';
import mostRead from '@/data/home/mostread.json';
import { sections } from '@/lib/home';
import { tracker, trackerAsOf } from '@/lib/fights';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'Research',
  description: 'Research and intelligence from The Alliance for Healthcare Competition: cost drivers, state dossiers, health systems, carriers, physician-owned hospitals, government and the hospital lobby. Every figure sourced to a public filing.',
  path: '/research/',
});

/** The research arm's front door (MERGER_PLAN.md, section 3.2): the nine sections and their desks, the latest work, the disclosure. */
export default function Page() {
  const latest = [...tracker].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Research', path: '/research/' }])} />
      <Hero eyebrow="Research" title="Research and intelligence from the Alliance." text="Every figure sourced to a public filing. Dossiers on the hospital systems, the states, the committees and the lobby; a two-lane tracker; the methodology behind each number. Three of these questions are fights the Alliance lobbies on. The rest is published as research." primary={{ label: 'The Tracker', href: '/tracker/' }} secondary={{ label: 'Methodology', href: '/methodology/' }} />

      <Band label="Sections">
        <SectionHead eyebrow="Seven sections" title="Where the work lives." text="Each section groups its desks. A live desk is published; a planned desk is on the list." />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => {
            const live = s.desks.filter((d) => d.status === 'live' && d.href);
            const planned = s.desks.filter((d) => d.status !== 'live');
            return (
              <section key={s.slug} className={`flex flex-col gap-4 pt-5 border-t-2 ${s.band === 'green' ? 'border-green' : 'border-oxblood'}`} aria-labelledby={`sec-${s.slug}`}>
                <p className="font-tight text-[12px] font-semibold uppercase tracking-[0.12em]">{s.question}</p>
                <h3 id={`sec-${s.slug}`} className="font-tight font-bold text-[24px] leading-[1.1] tracking-[-0.02em]"><Link href={`/${s.slug}/`} className="hover:underline">{s.name}</Link></h3>
                {s.intro && <p className="text-[15px] leading-[1.5]">{s.intro}</p>}
                <ul className="grid gap-2 list-none m-0 p-0">
                  {live.map((d) => (
                    <li key={d.name} className="text-[15px] leading-[1.4]">
                      <Smart href={d.href!} className="font-semibold hover:text-oxblood">{d.name}</Smart>
                      {d.stat && <span className="block text-[13px]"><span className="num text-[15px]">{d.stat}</span> {d.statLabel}</span>}
                    </li>
                  ))}
                </ul>
                {planned.length > 0 && <p className="text-[13px] leading-[1.5]">Planned: {planned.map((d) => d.name.replace(/^[IVX]+ · /, '')).join(' · ')}</p>}
              </section>
            );
          })}
        </div>
      </Band>

      <Band dark label="Latest">
        <SectionHead dark eyebrow="Latest" title="What changed." text={`The newest dossier and the three most recent tracker rows, as of ${fmtDate(trackerAsOf)}.`} link={{ label: 'The full tracker', href: '/tracker/' }} />
        <div className="grid gap-10 lg:grid-cols-12">
          <article className="lg:col-span-6 bg-ink-2 border-t-4 border-accent p-7 flex flex-col gap-4">
            <p className="font-tight text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-text">Newest dossier · {cover.kicker} · {cover.date}</p>
            <h3 className="font-tight font-extrabold text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.03em]">{cover.headline}.</h3>
            <p className="text-[16px] leading-[1.55] text-ink-text-2">{cover.dek}</p>
            <Smart href={cover.href} className={`${textlink} text-paper self-start`}>{cover.cta} <Arrow /></Smart>
          </article>
          <ol className="lg:col-span-6 list-none m-0 p-0 grid content-start">
            {latest.map((r) => (
              <li key={r.id} className="py-4 border-b border-rule-dark grid gap-1">
                <span className="font-tight text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-text">{fmtDate(r.date)} · {r.stage}</span>
                <span className="font-tight font-bold text-[18px] leading-[1.25]">{r.issue}</span>
                <span className="text-[14px] text-ink-text-2">{r.vehicle}</span>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band label="Most read">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em] pb-3.5 border-b-2 border-ink">Most-read dossiers</p>
            <ol className="list-none m-0 p-0">
              {mostRead.map((m, i) => (
                <li key={m.href} className="border-b border-hairline">
                  <Smart href={m.href} className="flex gap-5 py-5 items-baseline group">
                    <span className="font-tight font-extrabold text-[28px] tracking-[-0.03em] text-oxblood w-7 shrink-0 leading-none">{i + 1}</span>
                    <span className="font-tight font-bold text-[19px] leading-[1.25] tracking-[-0.01em] group-hover:text-oxblood">{m.title}</span>
                  </Smart>
                </li>
              ))}
            </ol>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9 grid gap-6 content-start">
            <div className="bg-mist p-7 flex flex-col gap-3">
              <h2 className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Who produces it</h2>
              <p className="text-[15px] leading-[1.55]">Produced for the Alliance under contract by Rojas Media, an independent research firm. The Alliance owns and publishes the work.</p>
              <Link href="/methodology/" className={`${textlink} self-start text-ink hover:text-oxblood`}>How every figure is built <Arrow /></Link>
              <Link href="/corrections/" className={`${textlink} self-start text-ink hover:text-oxblood`}>Corrections <Arrow /></Link>
            </div>
            <div className="bg-mist p-7 flex flex-col gap-3">
              <h2 className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Search</h2>
              <p className="text-[15px] leading-[1.55]">Every page, figure and name on the site.</p>
              <Link href="/search/" className={`${textlink} self-start text-ink hover:text-oxblood`}>Search the research <Arrow /></Link>
            </div>
          </aside>
        </div>
      </Band>

      <JoinBand />
    </>
  );
}
