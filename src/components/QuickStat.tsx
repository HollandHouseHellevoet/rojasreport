interface QuickStatProps {
  value: string;
  label: string;
}

export default function QuickStat({ value, label }: QuickStatProps) {
  return (
    <div className="border border-white/10 p-4">
      <div className="font-display text-2xl sm:text-3xl font-bold text-orange">
        {value}
      </div>
      <div className="mt-1 font-body text-xs text-cream/50">
        {label}
      </div>
    </div>
  );
}
