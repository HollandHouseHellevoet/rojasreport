interface ProcessCardProps {
  items: string[];
}

export default function ProcessCard({ items }: ProcessCardProps) {
  if (!items.length) return null;

  // Filter to only meaningful process-related content
  const meaningful = items.filter(item =>
    item.length > 15 &&
    !item.startsWith('Services Requiring') &&
    !item.startsWith('The Application Process')
  );

  if (!meaningful.length) return null;

  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-4">
        Application Process
      </h3>
      <div className="space-y-3">
        {meaningful.map((item, i) => (
          <p key={i} className="font-body text-sm text-cream/60 leading-relaxed">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
