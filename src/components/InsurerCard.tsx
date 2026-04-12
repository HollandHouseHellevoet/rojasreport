interface InsurerCardProps {
  items: string[];
}

export default function InsurerCard({ items }: InsurerCardProps) {
  if (!items.length) return null;

  // Filter to meaningful insurer data (skip overly long narrative blocks)
  const meaningful = items.filter(item => item.length < 200 && item.length > 5);

  if (!meaningful.length) return null;

  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-4">
        Insurer Dominance
      </h3>
      <ul className="space-y-2">
        {meaningful.map((item, i) => (
          <li key={i} className="font-body text-sm text-cream/60">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
