import Link from 'next/link';

interface FeaturedStateCardProps {
  state: string;
  slug: string;
  score: number;
  tier: string;
  hook: string;
}

export default function FeaturedStateCard({ state, slug, score, tier, hook }: FeaturedStateCardProps) {
  // Score-based orange opacity
  const badgeOpacity = 0.4 + (score / 100) * 0.6;

  return (
    <Link
      href={`/states/${slug}/`}
      className="block border-2 border-white/10 hover:border-orange/50 transition-colors bg-navy-dark/40 h-full"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-body text-[11px] font-semibold tracking-widest uppercase text-cream/40">
              {tier}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-cream leading-tight">
              {state}
            </h3>
          </div>
          <span
            className="font-display text-3xl font-bold text-white px-3 py-1 rounded-sm leading-none"
            style={{ backgroundColor: `rgba(212, 98, 42, ${badgeOpacity})` }}
          >
            {score}
          </span>
        </div>
        <p className="font-body text-sm text-cream/70 leading-relaxed">
          {hook}
        </p>
        <p className="mt-4 font-body text-sm font-semibold text-orange">
          View Dossier &rarr;
        </p>
      </div>
    </Link>
  );
}
