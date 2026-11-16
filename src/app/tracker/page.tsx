import type { Metadata } from 'next';
import { Band, Breadcrumb, eyebrow, fmtDate, lede } from '@/components/alliance/ui';
import TrackerTable from '@/components/alliance/TrackerTable';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { FIGHTS, rowsFor, tracker, trackerAsOf } from '@/lib/fights';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'The Tracker: where the fights stand',
  description: 'Every bill, rule and court case on site-neutral payment, 340B reform and physician ownership, in two lanes: Congress, and agencies and courts. Each row dated and sourced.',
  path: '/tracker/',
});

/** The full two-lane tracker (MERGER_PLAN.md, section 3.5). The home page and each fight page show rows from the same file. */
export default function TrackerPage() {
  const research = tracker.filter((r) => r.fight === 'research');
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Research', path: '/research/' }, { name: 'The Tracker', path: '/tracker/' }])} />
      <Band tight>
        <Breadcrumb trail={[{ name: 'Research', href: '/research/' }, { name: 'The Tracker', href: '/tracker/' }]} />
        <p className={`${eyebrow} text-oxblood mt-6 mb-3`}>The Tracker · As of {fmtDate(trackerAsOf)}</p>
        <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[64px]">Where the fights stand.</h1>
        <p className={`${lede} mt-5 max-w-[60ch]`}>
          Two lanes. Congress moves a bill through five stages: drafted, introduced, committee, floor, law. Agencies and courts move a rule from proposed to final, in effect, in court or vacated. Direction says which way the row moves competition. Every row carries the date it was checked and its source.
        </p>
      </Band>
      {FIGHTS.map((f) => (
        <Band key={f.slug} tight id={f.slug} label={f.name}>
          <h2 className="font-tight font-bold text-[28px] tracking-[-0.02em] mb-6">{f.name}</h2>
          <TrackerTable rows={rowsFor(f.slug)} />
        </Band>
      ))}
      <Band tight mist id="research" label="Research only">
        <h2 className="font-tight font-bold text-[28px] tracking-[-0.02em] mb-2">Research only</h2>
        <p className="text-[16px] leading-[1.5] max-w-[60ch] mb-6">Issues the Alliance tracks and publishes research on without lobbying: price transparency, Medicaid financing and certificate of need.</p>
        <TrackerTable rows={research} />
      </Band>
      <Band tight>
        <p className="text-[14px] leading-[1.6] max-w-[72ch]">
          A row changes within two business days of a public action, with its source. The stage is the state of the bill or rule on the date shown, read from the record, not from a press release.
        </p>
      </Band>
      <JoinBand />
    </>
  );
}
