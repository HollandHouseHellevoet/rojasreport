interface InsurerCardProps {
  items: string[];
}

export default function InsurerCard({ items }: InsurerCardProps) {
  if (!items.length) return null;

  return (
    <div className="border-l-2 border-orange p-5">
      <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-3">
        Insurer Dominance
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="font-body text-sm text-cream/60">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
