interface MarketBarEntry {
  width_pct: string;
  label: string;
}

interface MarketBarProps {
  bars: MarketBarEntry[];
  systemNames?: string[];
}

export default function MarketBar({ bars, systemNames }: MarketBarProps) {
  if (!bars.length) return null;

  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-4">
        Hospital System Revenue
      </h3>
      <div className="space-y-3">
        {bars.map((bar, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-1/3 font-body text-sm text-cream/70 font-semibold truncate">
              {systemNames?.[i] || `System ${i + 1}`}
            </div>
            <div className="w-2/3 bg-navy-dark rounded-full h-6">
              <div
                className="bg-orange h-6 rounded-full flex items-center justify-end px-2"
                style={{ width: `${Math.max(parseInt(bar.width_pct), 10)}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {bar.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
