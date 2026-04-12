interface ScopeChecklistProps {
  items: string[];
}

export default function ScopeChecklist({ items }: ScopeChecklistProps) {
  if (!items.length) return null;

  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-4">
        Services Requiring CON Approval
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center bg-orange/20 text-orange text-xs font-bold">
              &#x2713;
            </span>
            <span className="font-body text-sm text-cream/70 leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
