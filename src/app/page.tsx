import type { Metadata } from 'next';
import Link from 'next/link';
import cover from '@/data/home/cover.json';
import fights from '@/data/home/fights.json';
import { sections, getLatestPosts } from '@/lib/home';
import DeskList from '@/components/home/DeskList';
import { NEWSLETTER_URL } from '@/lib/nav';

/**
 * Phase 0 home page: the existing content inside the new shell.
 * Phase 1 rebuilds this page to docs/mockups/home.dc.html.
 */

export const metadata: Metadata = {
  title: { absolute: 'The Rojas Report | Healthcare Intelligence' },
  alternates: { canonical: 'https://rojasreport.com/' },
};

// Fights tracker tones: win = the hospital lobby is holding, loss = the reform is moving, pending = in play.
const TONE: Record<string, string> = {
  win: 'text-oxblood',
  loss: 'text-green',
  pending: 'text-gold',
};
const TONE_TEXT: Record<string, string> = { win: 'Lobby holding', loss: 'Reform moving', pending: 'In play' };

function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith('http') ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );
}

function SectionHead({ num, label, title, note }: { num: string; label: string; title: string; note?: string }) {
  return (
    <div className="flex flex-wrap justify-between items-baseline gap-3 border-t border-ink pt-5 mb-8">
      <h2 className="font-display text-[34px] md:text-[44px] leading-[1.1]">{title}</h2>
      <span className="font-meta text-[12px] uppercase tracking-[0.14em] text-muted">
        {num} · {label}{note ? ` · ${note}` : ''}
      </span>
    </div>
  );
}

export default async function HomePage() {
  const posts = await getLatestPosts(4);

  return (
    <>
      {/* Cover story */}
      <section className="max-w-content mx-auto px-5 md:px-8 pt-16 pb-16">
        <p className="font-meta text-[12px] uppercase tracking-[0.14em] text-muted mb-5">
          This week&apos;s cover · {cover.kicker} · {cover.date}
        </p>
        <h2 className="font-display leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', maxWidth: '18ch' }}>
          {cover.headline}
        </h2>
        <p className="text-[20px] md:text-[22px] leading-[1.45] text-body mb-8 max-w-[680px]">{cover.dek}</p>
        <SmartLink href={cover.href} className="text-[18px] text-ink border-b border-ink hover:text-oxblood hover:border-oxblood">
          {cover.cta} →
        </SmartLink>
      </section>

      {/* Where the fights stand */}
      <section className="bg-paper-2">
        <div className="max-w-content mx-auto px-5 md:px-8 py-14">
          <SectionHead num="I" label="The tracker" note={`As of ${fights.asOf}`} title="Where the fights stand" />
          <div className="table-scroll">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="font-meta text-[11px] uppercase tracking-[0.1em] text-muted text-left">
                  <th className="font-medium pb-2 border-b border-ink">The fight</th>
                  <th className="font-medium pb-2 border-b border-ink">Status</th>
                  <th className="font-medium pb-2 border-b border-ink">Who&apos;s winning</th>
                  <th className="font-medium pb-2 border-b border-ink">What&apos;s next</th>
                </tr>
              </thead>
              <tbody>
                {fights.rows.map((r) => (
                  <tr key={r.issue} className="border-b border-hairline align-top">
                    <td className="py-3 pr-4 text-[17px]">
                      <SmartLink href={r.href} className="hover:text-oxblood">{r.issue}</SmartLink>
                    </td>
                    <td className="py-3 pr-4 text-[16px]">{r.status}</td>
                    <td className={`py-3 pr-4 text-[16px] ${TONE[r.tone] || TONE.pending}`}>{TONE_TEXT[r.tone] || TONE_TEXT.pending}</td>
                    <td className="py-3 text-[16px] text-body">
                      <span className="text-muted">{r.date} · </span>
                      {r.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Desks */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-16">
        <SectionHead num="II" label="The desks" title="Intelligence, by section" />
        <div className="space-y-14">
          {sections.map((s) => (
            <div key={s.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h3 className="font-display text-[28px]">
                  <Link href={`/${s.slug}/`} className="hover:text-oxblood">{s.name} →</Link>
                </h3>
                <p className={`italic text-[18px] ${s.band === 'green' ? 'text-green' : 'text-oxblood'}`}>{s.question}</p>
              </div>
              <DeskList desks={s.desks} band={s.band} />
            </div>
          ))}
        </div>
      </section>

      {/* Latest writing */}
      <section className="bg-paper-2">
        <div className="max-w-content mx-auto px-5 md:px-8 py-14">
          <SectionHead num="III" label="The newsletter" title="Latest from The Rojas Report" />
          {posts.length > 0 ? (
            <ul className="border-t border-ink mb-8">
              {posts.map((p) => (
                <li key={p.link} className="border-b border-hairline">
                  <a href={p.link} className="group flex flex-wrap items-baseline justify-between gap-2 py-4">
                    <span className="font-display text-[24px] leading-tight group-hover:text-oxblood">{p.title}</span>
                    {p.date && <span className="italic text-[15px] text-muted">{p.date}</span>}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body mb-8">Daily analysis on the newsletter.</p>
          )}
          <a href={NEWSLETTER_URL} className="text-[18px] border-b border-ink hover:text-oxblood hover:border-oxblood">
            Read the newsletter →
          </a>
        </div>
      </section>

      {/* Build */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-16">
        <SectionHead num="IV" label="For physicians" title="Don't just read about it. Build." />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'MedMerge', href: 'https://medmerge.co', blurb: "Own your group's benefits instead of renting them from a carrier." },
            { name: 'PhyCap Fund', href: 'https://www.phycapfund.com', blurb: 'Capital for physician-led companies.' },
          ].map((c) => (
            <a key={c.name} href={c.href} className="group flex flex-col gap-2">
              <span className="font-display text-[26px] group-hover:text-oxblood">{c.name}</span>
              <span className="text-[18px] leading-[1.45] text-body">{c.blurb}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
