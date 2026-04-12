import Link from 'next/link';

interface StateCardProps {
  state: string;
  abbreviation: string;
  slug: string;
  score: number;
  tier: string;
  conStatus: string;
  teaser?: string;
}

export default function StateCard({ state, abbreviation, slug, score, tier, conStatus, teaser }: StateCardProps) {
  const hasProfile = conStatus !== 'No';
  const badgeOpacity = score === 0 ? 0.15 : 0.2 + (score / 100) * 0.8;

  const card = (
    <div className="border border-white/10 p-4 hover:border-orange/40 transition-colors h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-xs font-semibold tracking-widest text-cream/40">
          {abbreviation}
        </span>
        <span
          className="text-white text-xs font-bold px-2 py-0.5"
          style={{ backgroundColor: `rgba(212, 98, 42, ${badgeOpacity})` }}
        >
          {score}
        </span>
      </div>
      <h3 className="font-display text-xl font-bold text-cream leading-tight">
        {state}
      </h3>
      <p className="mt-1 font-body text-xs text-cream/35">
        {tier}
      </p>
      {teaser && (
        <p className="mt-2 font-body text-sm text-cream/45 leading-snug line-clamp-2 flex-1">
          {teaser}
        </p>
      )}
      {hasProfile && (
        <p className="mt-2 font-body text-sm text-orange">
          View Dossier &rarr;
        </p>
      )}
    </div>
  );

  if (hasProfile) {
    return <Link href={`/states/${slug}/`}>{card}</Link>;
  }
  return card;
}
