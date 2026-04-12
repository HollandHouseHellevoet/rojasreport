interface ReformStatusProps {
  items: string[];
}

export default function ReformStatus({ items }: ReformStatusProps) {
  if (!items.length) return null;

  return (
    <div className="border-l-2 border-orange p-5">
      <div className="space-y-3">
        {items.map((item, i) => {
          // Short status labels render as bold headings
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
