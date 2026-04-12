interface ScopeChecklistProps {
  parsedScope?: string[];
  rawScope?: string[];
}

export default function ScopeChecklist({ parsedScope, rawScope }: ScopeChecklistProps) {
  // Prefer parsed individual facility types; fall back to raw scope_data
  const items = parsedScope && parsedScope.length > 0
    ? parsedScope
    : (rawScope || []).filter(item =>
        item.length > 5 &&
        item.length < 80 &&
        !item.toLowerCase().includes('services requiring') &&
        !item.toLowerCase().includes('regulated services')
      );

  if (!items.length) return null;

  return (
    <div className="border-l-2 border-orange p-5">
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
