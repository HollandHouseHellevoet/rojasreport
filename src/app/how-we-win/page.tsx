import type { Metadata } from 'next';
import { Band, Hero, SectionHead, Timeline } from '@/components/alliance/ui';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import timeline from '@/data/alliance/timeline.json';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'How We Win',
  description: 'The Alliance’s plan: unite the parties who pay for care behind independent physicians, put data in front of Congress, and run all three fights at once. Timeline for 2027 and progress reports to members.',
  path: '/how-we-win/',
});

const pillars = [
  { t: 'Unite the parties who pay for care behind independent physicians', p: 'Employers and payers pay the hospital bill. Manufacturers sell the drugs whose discount it captures. Independent physicians compete against the hospital for the same patient under price rules written for the hospital. Each has argued alone. The Alliance puts them in the same room with the same ask.' },
  { t: 'Put data in front of lawmakers', p: 'Committee staff act on figures they can cite. Every Alliance report carries its sources, every status is dated, and every member of Congress hears the same numbers from a physician in the district and an employer in the state.' },
  { t: 'Run all three fights at once', p: 'Site-neutral payment, 340B reform and physician ownership are three rules with one effect: a hospital system that faces no competitor sets the price. Fighting one at a time lets the other two pay for the defense. The Alliance moves all three in the same Congress.' },
];

// Progress reports are posted here as they are published; none has been yet.
const reports: { date: string; title: string; summary: string }[] = [];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'How We Win', path: '/how-we-win/' }])} />
      <Hero eyebrow="How we win" title="Unite the buyers. Put the data in front of Congress. Run all three fights at once." text="A hospital association has one message and one check. The Alliance has the physicians in every district and the parties who pay the bill in every state. This is how that advantage is used." />

      <Band label="The theory of victory">
        <SectionHead eyebrow="The theory of victory" title="Three moves, in order." />
        <ol className="grid gap-10 lg:grid-cols-3 list-none m-0 p-0">
          {pillars.map((x, i) => (
            <li key={x.t} className="flex flex-col gap-4 pt-5 border-t-2 border-ink">
              <span className="num text-[14px] tracking-[0.08em]" aria-hidden="true">0{i + 1}</span>
              <h3 className="font-tight font-bold text-[22px] leading-[1.15] tracking-[-0.02em]">{x.t}</h3>
              <p className="text-[15px] leading-[1.55]">{x.p}</p>
            </li>
          ))}
        </ol>
      </Band>

      <Band dark id="timeline" label="Timeline">
        <SectionHead dark eyebrow="Timeline" title="2027, quarter by quarter." text="Dates move. The sequence does not. Each quarter ends with a progress report to members." />
        <Timeline quarters={timeline.quarters} />
      </Band>

      {reports.length > 0 && (
        <Band id="progress" label="Progress reports">
          <SectionHead eyebrow="Progress reports" title="What the Alliance did, and what comes next." text="Dated reports to members, newest first. Physicians who join receive each one by email the day it is published." />
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-8 grid gap-12">
            {reports.map((r) => (
              <article key={r.title} className="flex flex-col gap-3 pt-6 border-t border-hairline">
                <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]"><time dateTime={r.date}>{r.date}</time></p>
                <h3 className="font-tight font-bold text-[22px]">{r.title}</h3>
                <p>{r.summary}</p>
              </article>
            ))}
            </div>
          </div>
        </Band>
      )}

      <JoinBand />
    </>
  );
}
