import { tierBgClass } from '@/lib/data';

interface ClassificationBadgeProps {
  tier: string;
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ClassificationBadge({ tier, score, size = 'md' }: ClassificationBadgeProps) {
  const bg = tierBgClass(tier);
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-body font-bold tracking-wider uppercase text-white ${bg} ${sizeClasses[size]}`}
    >
      <span>{score}/100</span>
      <span className="opacity-60">|</span>
      <span>{tier}</span>
    </span>
  );
}
