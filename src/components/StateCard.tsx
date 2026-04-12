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
  // Score-based orange opacity for badge
  const badgeOpacity = score === 0 ? 0.15 : 0.2 + (score / 100) * 0.8;

  const content = (
    <div className="border border-white/10 p-3 hover:border-orange/40 transition-colors h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <span className="font-body text-[10px] font-bold tracking-widest text-cream/40">
          {abbreviation}
        </span>
        <span
          className="text-white text-[10px] font-bold px-1.5 py-0.5"
          style={{ backgroundColor: `rgba(212, 98, 42, ${badgeOpacity})` }}
        >
          {score}
        </span>
      </div>
      <h3 className="font-display text-base font-bold text-cream leading-tight">
        {state}
      </h3>
      <p className="mt-1 font-body text-[10px] text-cream/30 leading-tight">
        {tier}
      </p>
      {teaser && (
        <p className="mt-1 font-body text-[10px] text-cream/40 leading-snug line-clamp-2">
          {teaser}
        </p>
      )}
    </div>
  );

  if (hasProfile) {
    return <Link href={`/states/${slug}/`}>{content}</Link>;
  }

  return content;
}
