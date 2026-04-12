interface CaseLawCardProps {
  items: string[];
}

export default function CaseLawCard({ items }: CaseLawCardProps) {
  if (!items.length) return null;

  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-4">
        Case Law &amp; Denials
      </h3>
      <div className="space-y-4">
        {items.map((item, i) => {
          // Short items (like "Case: ..." or labels) get bold treatment
          if (item.length < 60) {
            return (
              <p key={i} className="font-body text-sm text-cream font-semibold">
                {item}
              </p>
            );
          }
          // Longer items are narrative
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
