import type { Metadata } from 'next';
import Link from 'next/link';
import cover from '@/data/home/cover.json';
import fights from '@/data/home/fights.json';
import { sections, getLatestPosts } from '@/lib/home';
import DeskList from '@/components/home/DeskList';

export const metadata: Metadata = {
  title: { absolute: 'The Rojas Report | Healthcare Intelligence' },
  alternates: { canonical: 'https://rojasreport.com/' },
};

const TONE: Record<string, string> = {
  win: 'text-[#e6b85c] border-[#e6b85c]/40',
  loss: 'text-[#a8c9b0] border-[#a8c9b0]/40',
  pending: 'text-cream/70 border-white/20',
};

function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith('http') ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );
}

function Eyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-2">
      <span className="font-body text-[11px] font-semibold tracking-[0.15em] text-orange">{num}</span>
      <span className="font-body text-[11px] font-semibold tracking-[0.15em] uppercase text-cream">{label}</span>
    </div>
  );
}

export default async function HomePage() {
  const posts = await getLatestPosts(4);
  const physicians = sections.find((s) => s.slug === 'physicians');
  const deskSections = sections.filter((s) => s.slug !== 'physicians');

  return (
    <>
      {/* Cover story */}
      <section className="relative bg-cover bg-center" style={{ backgroundImage: `url('${cover.image}')` }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,20,32,0.70) 0%, rgba(10,20,32,0.92) 100%)' }} />
        <div className="relative max-w-content mx-auto px-5 py-24 md:py-32">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-orange mb-5">
            {cover.kicker} <span className="text-cream/40">· {cover.date}</span>
          </p>
          <h1 className="font-display font-bold text-cream leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.6rem)', maxWidth: '16ch' }}>
            {cover.headline}
          </h1>
          <p className="font-body text-lg text-cream/75 leading-relaxed mb-10 max-w-2xl">{cover.dek}</p>
          <SmartLink href={cover.href} className="inline-block bg-orange text-cream font-body font-semibold text-sm px-6 py-3 hover:bg-orange-light transition-colors">
            {cover.cta} →
          </SmartLink>
        </div>
      </section>

      {/* Where the fights stand */}
      <section className="border-b border-white/10 bg-navy-dark">
        <div className="max-w-content mx-auto px-5 py-14">
          <Eyebrow num="01" label="Where the fights stand" />
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
            <h2 className="font-display text-3xl font-bold text-cream">Every fight over the rules, one table</h2>
            <p className="font-body text-xs text-cream/40">As of {fights.asOf}</p>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {fights.rows.map((r) => (
              <SmartLink key={r.issue} href={r.href} className="group grid grid-cols-[1fr_auto] md:grid-cols-[2fr_auto_1fr] gap-x-4 gap-y-1 py-4 hover:bg-white/[0.03] transition-colors px-1">
                <p className="font-body text-[15px] font-semibold text-cream group-hover:text-orange transition-colors">{r.issue}</p>
                <span className={`self-start font-body text-[11px] font-semibold uppercase tracking-wider border px-2 py-0.5 whitespace-nowrap ${TONE[r.tone] || TONE.pending}`}>
                  {r.status}
                </span>
                <p className="col-span-2 md:col-span-1 font-body text-sm text-cream/55 leading-snug">
                  <span className="text-cream/40">{r.date} · </span>
                  {r.note}
                </p>
              </SmartLink>
            ))}
          </div>
          <p className="font-body text-xs text-cream/40 mt-3">
            Gold: the hospital lobby held the line. Green: the reform happened. White: still being fought.
          </p>
        </div>
      </section>

      {/* Desks */}
      <section className="max-w-content mx-auto px-5 py-16">
        <Eyebrow num="02" label="The desks" />
        <h2 className="font-display text-3xl font-bold text-cream mb-10">Intelligence, by desk</h2>
        <div className="space-y-14">
          {deskSections.map((s) => (
            <div key={s.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4 border-b border-orange/40 pb-2">
                <h3 className="font-display text-2xl font-bold text-cream">
                  <Link href={`/${s.slug}/`} className="hover:text-orange transition-colors">{s.name}</Link>
                </h3>
                <p className="font-body text-xs uppercase tracking-wider text-cream/45">{s.question}</p>
              </div>
              <DeskList desks={s.desks} />
            </div>
          ))}
        </div>
      </section>

      {/* Latest writing */}
      <section className="border-y border-white/10 bg-navy-light/40">
        <div className="max-w-content mx-auto px-5 py-14">
          <Eyebrow num="03" label="Latest writing" />
          <h2 className="font-display text-3xl font-bold text-cream mb-6">From The Rojas Report</h2>
          {posts.length > 0 ? (
            <ul className="divide-y divide-white/10 border-y border-white/10 mb-6">
              {posts.map((p) => (
                <li key={p.link}>
                  <a href={p.link} className="group flex flex-wrap items-baseline justify-between gap-2 py-4">
                    <span className="font-display text-xl font-semibold text-cream group-hover:text-orange transition-colors">{p.title}</span>
                    {p.date && <span className="font-body text-xs text-cream/40">{p.date}</span>}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-cream/60 mb-6">Daily analysis on the newsletter.</p>
          )}
          <a href="https://read.rojasreport.com" className="inline-block border border-cream/30 text-cream font-body text-sm font-semibold px-5 py-2.5 hover:border-orange hover:text-orange transition-colors">
            Read the newsletter →
          </a>
        </div>
      </section>

      {/* Physicians */}
      {physicians && (
        <section className="max-w-content mx-auto px-5 py-16">
          <Eyebrow num="04" label="Physicians" />
          <h2 className="font-display text-3xl font-bold text-cream mb-3">What you can do about it</h2>
          <p className="font-body text-cream/65 max-w-2xl mb-8 leading-relaxed">
            For independent physicians: own what you build, contract directly, and stop financing the systems that compete with you.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: 'MedMerge', href: 'https://medmerge.co', blurb: 'Physician benefits.' },
              { name: 'PhyCap Fund', href: 'https://www.phycapfund.com', blurb: 'Capital for physician-led companies.' },
            ].map((c) => (
              <a key={c.name} href={c.href} className="group block border border-white/10 hover:border-orange/60 transition-colors p-4">
                <p className="font-display text-lg font-semibold text-cream group-hover:text-orange transition-colors">{c.name}</p>
                <p className="font-body text-sm text-cream/55 mt-1">{c.blurb}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
