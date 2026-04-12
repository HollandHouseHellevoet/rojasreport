interface ReformStatusProps {
  items: string[];
}

export default function ReformStatus({ items }: ReformStatusProps) {
  if (!items.length) return null;

  // Filter out overly long narrative blocks that aren't reform-specific
  const meaningful = items.filter(item =>
    item.length > 15 && item.length < 500
  );

  if (!meaningful.length) return null;

  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-4">
        Reform Status
      </h3>
      <div className="space-y-3">
        {meaningful.map((item, i) => {
          // Short items like "Current Status: No Meaningful Reform" are headings
          if (item.length < 80 && !item.includes('.')) {
            return (
              <p key={i} className="font-body text-sm text-cream font-semibold">
                {item}
              </p>
            );
          }
          return (
            <p key={i} className="font-body text-sm text-cream/60 leading-relaxed">
              {item}
            </p>
          );
        })}
      </div>
    </div>
  );
}
