interface ProcessCardProps {
  items: string[];
}

export default function ProcessCard({ items }: ProcessCardProps) {
  if (!items.length) return null;

  return (
    <div className="border-l-2 border-orange p-5">
      <div className="space-y-3">
        {items.map((item, i) => (
          <p key={i} className="font-body text-sm text-cream/60 leading-relaxed">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
