import type { Metadata } from 'next';
import { Band, FightTile, Hero, eyebrow } from '@/components/alliance/ui';
import StatusTracker from '@/components/alliance/StatusTracker';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { FIGHT_TILES } from '@/lib/fightFigures';
import { FIGHTS } from '@/lib/fights';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'Our Fights',
  description: 'Three federal fights, launched together: site-neutral payment, 340B reform and physician ownership. Each has a bill, a data record and a status you can check.',
  path: '/fights/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Our Fights', path: '/fights/' }])} />
      <Hero eyebrow="Our fights" title="Three federal fronts, launched together." text="Each one removes a rule that lets a consolidated hospital system set prices without a competitor. Each one has a data record, a status you can check and a date it was last checked. The Alliance lobbies on these three and no others; everything else on this site is research." />
      <Band label="The three fights">
        <h2 className="sr-only">The three fights</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {FIGHT_TILES.map((t) => <FightTile key={t.slug} {...t} />)}
        </div>
      </Band>
      <Band dark label="Where each fight stands">
        <p className={`${eyebrow} text-ink-text mb-10`}>Where each fight stands</p>
        <div className="grid gap-12">
          {FIGHTS.map((f) => (
            <div key={f.slug} className="flex flex-col gap-7 pt-8 border-t border-rule-dark">
              <h2 className="font-tight font-bold text-[24px] tracking-[-0.02em]">{f.name}</h2>
              <StatusTracker slug={f.slug} dark />
            </div>
          ))}
        </div>
      </Band>
      <JoinBand />
    </>
  );
}
