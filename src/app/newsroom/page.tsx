import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Hero } from '@/components/alliance/ui';
import JsonLd from '@/components/alliance/JsonLd';
import { CONTACT, ORG } from '@/lib/site';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'Newsroom',
  description: `Press releases and the media contact for ${ORG}.`,
  path: '/newsroom/',
});

// Releases are posted here as they go out; the first is the public announcement (MERGER_PLAN.md, section 6.1). The page
// shows the media contact and the boilerplate until then; the press kit returns as a card once it exists.
const releases: { date: string; title: string; summary: string }[] = [];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Newsroom', path: '/newsroom/' }])} />
      <Hero eyebrow="Newsroom" title="Press releases and the media contact." />
      <Band label="Press releases">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 grid gap-10 content-start">
            <div className="flex flex-col gap-4 text-[18px] leading-[1.6] max-w-[60ch]">
              <p>The Alliance answers reporters on the three federal fights, the hospital lobby and the figures in its research. Every figure on this site carries its source and its as-of date, and the filing behind it is a request away.</p>
              <p>Releases are posted here as they go out.</p>
            </div>
            {releases.length > 0 && <h2 className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Press releases</h2>}
            {releases.map((r) => (
              <article key={r.title} className="flex flex-col gap-3 pt-6 border-t border-hairline">
                <p className="text-[15px]"><time dateTime={r.date}>{r.date}</time></p>
                <h3 className="font-tight font-bold text-[22px]">{r.title}</h3>
                <p>{r.summary}</p>
              </article>
            ))}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9 grid gap-6 content-start">
            <div className="bg-mist p-7 flex flex-col gap-2">
              <h2 className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Media contact</h2>
              <p><a href={`mailto:${CONTACT.press}`} className="hover:underline">{CONTACT.press}</a></p>
              {CONTACT.pressPhone && <p>{CONTACT.pressPhone}</p>}
              <p className="text-[15px] leading-[1.5]">For interview requests, data questions and comment on pending legislation. Or the <Link href="/contact/" className="underline">contact form</Link>, with Press as the topic.</p>
            </div>
            <div className="bg-mist p-7 flex flex-col gap-2">
              <h2 className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Boilerplate</h2>
              <p className="text-[15px] leading-[1.5]">{ORG} is the free-market trade association for American healthcare. A 501(c)(6), it unites independent physicians with employers, payers and manufacturers to remove the federal rules that let consolidated hospital systems set prices without competition. The Alliance fights on three federal fronts: site-neutral payment, 340B reform and physician ownership. Its research arm publishes sourced dossiers on hospital systems, states and the hospital lobby. tafhc.org.</p>
            </div>
          </aside>
        </div>
      </Band>
    </>
  );
}
