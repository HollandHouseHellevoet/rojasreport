import Link from 'next/link';
import Wordmark from '@/components/Wordmark';
import TaxNotice from '@/components/TaxNotice';
import { FORMSPREE, ORG, SOCIAL, absolute } from '@/lib/site';

const head = 'font-tight text-[13px] font-bold uppercase tracking-[0.12em] text-ink-text mb-4';
const link = 'text-paper text-[15px] hover:underline';

/** Four columns (Fights, Research, Membership, About), the newsletter signup and the legal block (MERGER_PLAN.md, section 3.9). */
const COLS: { h: string; links: [string, string][] }[] = [
  {
    h: 'Our Fights',
    links: [
      ['Site-Neutral Payment', '/fights/site-neutral/'],
      ['340B Reform', '/fights/340b/'],
      ['Physician Ownership', '/fights/physician-ownership/'],
      ['The Tracker', '/tracker/'],
      ['How We Win', '/how-we-win/'],
    ],
  },
  {
    h: 'Research',
    links: [
      ['Cost Drivers', '/drivers/'],
      ['States', '/states/'],
      ['Health Systems', '/systems/'],
      ['Physician-Owned', '/physician-owned/'],
      ['Government', '/government/'],
      ['The Lobby', '/lobby/'],
      ['Methodology', '/methodology/'],
    ],
  },
  {
    h: 'Membership',
    links: [
      ['For Physicians', '/physicians/'],
      ['Join', '/physicians/join/'],
      ['Council', '/physicians/council/'],
      ['For Partners', '/partners/'],
      ['Give', '/give/'],
    ],
  },
  {
    h: 'About',
    links: [
      ['Mission', '/about/'],
      ['Board', '/about/#board'],
      ['Newsroom', '/newsroom/'],
      ['Founder', '/founder/'],
      ['Contact', '/contact/'],
      ['Corrections', '/corrections/'],
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { glyph: 'X', name: 'X (Twitter)', href: SOCIAL.x },
    { glyph: 'in', name: 'LinkedIn', href: SOCIAL.linkedin },
    { glyph: '▶', name: 'YouTube', href: SOCIAL.youtube },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-ink-text print:hidden">
      <div className="max-w-content mx-auto px-4 md:px-8 pt-16 pb-10">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-4 lg:grid-cols-12 pb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-4 flex flex-col gap-5 max-w-[36ch]">
            <Wordmark dark />
            <p className="text-[15px] leading-[1.6] text-ink-text-2">
              The free-market trade association for American healthcare. Independent physicians, employers, payers and manufacturers, united against hospital monopoly pricing.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.h} className="lg:col-span-2 xl:col-span-[1.5]">
              <h2 className={head}>{c.h}</h2>
              <ul className="flex flex-col gap-2.5">
                {c.links.map(([l, h]) => (
                  <li key={h}><Link href={h} className={link}>{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-12 border-t border-[#3A3833] pt-10 pb-10">
          <div className="lg:col-span-5">
            <h2 className={head}>Newsletter</h2>
            <p className="text-[14px] leading-[1.5] text-ink-text-2 mb-4">Data and progress reports from the Alliance. Twice a month.</p>
            <form name="newsletter" method="POST" action={FORMSPREE}>
              <input type="hidden" name="_subject" value="TAFHC Newsletter Subscribe" />
              <input type="hidden" name="_next" value={absolute('/contact/?sent=newsletter')} />
              <p className="absolute left-[-10000px] w-px h-px overflow-hidden" aria-hidden="true">
                <label>Leave this field empty <input name="_gotcha" tabIndex={-1} autoComplete="off" /></label>
              </p>
              <label htmlFor="nl-email" className="sr-only">Email address</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="nl-email"
                  type="email"
                  name="email"
                  placeholder="you@practice.com"
                  required
                  autoComplete="email"
                  className="flex-1 font-body text-[15px] px-3.5 py-3 border-[1.5px] border-[#3A3833] bg-[#262522] text-paper placeholder:text-ink-text rounded-none"
                />
                <button type="submit" className="inline-flex items-center justify-center min-h-[48px] px-5 border-[1.5px] border-paper text-paper font-tight font-semibold text-[15px] hover:bg-paper hover:text-ink">
                  Sign up
                </button>
              </div>
            </form>
            {socials.length > 0 && (
              <ul className="flex gap-2.5 mt-6" aria-label="Social">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} rel="noopener" className="inline-flex w-9 h-9 items-center justify-center border border-[#3A3833] font-tight font-bold text-[13px] text-paper">
                      <span aria-hidden="true">{s.glyph}</span><span className="sr-only">{s.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-3.5 text-[14px]">
            <TaxNotice compact onDark />
            <p className="text-ink-text-2">Paid for by {ORG}.</p>
            <p className="text-ink-text-2">
              © {year} {ORG}.{' '}
              <Link href="/privacy/" className="text-paper underline underline-offset-[3px]">Privacy</Link> ·{' '}
              <Link href="/terms/" className="text-paper underline underline-offset-[3px]">Terms</Link> ·{' '}
              <Link href="/corrections/" className="text-paper underline underline-offset-[3px]">Corrections</Link> ·{' '}
              <Link href="/methodology/" className="text-paper underline underline-offset-[3px]">Methodology</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
