interface QuickStatProps {
  value: string;
  label: string;
  context?: string;
}

export default function QuickStat({ value, label, context }: QuickStatProps) {
  return (
    <div className="border border-white/10 p-4">
      <div className="font-display text-stat text-orange">
        {value}
      </div>
      <div className="mt-1 font-body text-sm font-semibold text-cream">
        {label}
      </div>
      {context && (
        <div className="mt-1 font-body text-sm text-cream/50">
          {context}
        </div>
      )}
    </div>
  );
}
