import Link from 'next/link';
import { NEWSLETTER_URL, ABOUT_URL } from '@/lib/nav';

/** "Read it. Download it. Own the data." The reader, reports and membership cards. Home page and section pages end with it. */

const eyebrow = 'font-tight text-[13px] font-semibold uppercase tracking-[0.14em]';
const h2 = 'font-tight font-bold leading-[1.04] tracking-[-0.03em] text-[34px] md:text-[54px]';
const tag = 'inline-block font-tight text-[13px] font-bold uppercase tracking-[0.12em] leading-none px-2 py-[5px] border';
const textlink = 'inline-flex items-center gap-1.5 font-tight font-semibold text-[15px] border-b-[1.5px] border-current pb-0.5 hover:gap-2.5 transition-[gap]';

function Arrow() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="shrink-0">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

export default function GetIntelligence({ label = 'Get the intelligence' }: { label?: string }) {
  return (
    <section id="reports" className="pb-20 md:pb-[104px]">
      <div className="max-w-content mx-auto px-4 md:px-8">
        <div className="border-t border-hairline pt-20 md:pt-[88px] flex flex-wrap justify-between items-end gap-6 mb-12 md:mb-14">
          <div className="max-w-[760px]">
            <div className={`${eyebrow} text-oxblood mb-4`}>{label}</div>
            <h2 className={h2}>Read it. Download it. Own the data.</h2>
            <p className="mt-5 text-[19px] leading-[1.5]">Everything on this site is free to read. The reports and datasets are for the people who need the detail.</p>
          </div>
          <a href={ABOUT_URL} className={`${textlink} text-ink hover:text-oxblood`}>Request custom data <Arrow /></a>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <article className="bg-paper-2 p-8 flex flex-col gap-4">
            <div className="border-t-2 border-ink pt-5"><span className={`${tag} border-ink`}>Free</span></div>
            <h3 className="font-tight font-bold text-[26px] leading-[1.15] tracking-[-0.02em]">The Reader</h3>
            <p className="text-[16px] leading-[1.55] flex-grow">Every article, every cost-driver brief, every state dossier and the weekly newsletter.</p>
            <a href={NEWSLETTER_URL} className={`${textlink} self-start hover:text-oxblood`}>Subscribe free <Arrow /></a>
          </article>
          <article className="bg-paper-2 p-8 flex flex-col gap-4">
            <div className="border-t-2 border-ink pt-5"><span className={`${tag} border-ink`}>Reports &amp; datasets</span></div>
            <h3 className="font-tight font-bold text-[26px] leading-[1.15] tracking-[-0.02em]">Physician-Owned Hospitals</h3>
            <p className="text-[16px] leading-[1.55] flex-grow">Every POH in the country, with ownership, contacts and state context. $300 per state, or $3,500 a year for all access.</p>
            <Link href="/reports/" className={`${textlink} self-start hover:text-oxblood`}>Browse reports <Arrow /></Link>
          </article>
          <article className="bg-ink text-paper p-8 flex flex-col gap-4">
            <div className="border-t-2 border-oxblood-rule pt-5"><span className={`${tag} border-ink-text`}>Membership · 100 seats</span></div>
            <h3 className="font-tight font-bold text-[26px] leading-[1.15] tracking-[-0.02em]">The Builders Table</h3>
            <p className="text-[16px] leading-[1.55] flex-grow text-ink-text-2">For physician owners, operators, founders and investors. $25,000 a year, by application.</p>
            <a href={ABOUT_URL} className={`${textlink} self-start text-paper`}>Apply <Arrow /></a>
          </article>
        </div>
      </div>
    </section>
  );
}
