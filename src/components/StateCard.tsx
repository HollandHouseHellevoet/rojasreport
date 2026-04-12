import Link from 'next/link';
import { tierBgClass } from '@/lib/data';

interface StateCardProps {
  state: string;
  abbreviation: string;
  slug: string;
  score: number;
  tier: string;
  conStatus: string;
}

export default function StateCard({ state, abbreviation, slug, score, tier, conStatus }: StateCardProps) {
  const bg = tierBgClass(tier);
  const hasProfile = conStatus !== 'No';

  const content = (
    <div className="border border-white/10 p-4 hover:border-orange/40 transition-colors h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs font-bold tracking-widest text-cream/40">
            {abbreviation}
          </span>
          <span className={`${bg} text-white text-xs font-bold px-2 py-0.5`}>
            {score}
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-cream">
          {state}
        </h3>
      </div>
      <p className="mt-2 font-body text-xs text-cream/40">
        {tier}
      </p>
    </div>
  );

  if (hasProfile) {
    return <Link href={`/states/${slug}/`}>{content}</Link>;
  }

  return content;
}
