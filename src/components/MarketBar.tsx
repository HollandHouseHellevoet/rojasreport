interface MarketBarEntry {
  width_pct: string;
  label: string;
}

interface KeySystem {
  name: string;
  revenue: string;
}

interface MarketBarProps {
  bars?: MarketBarEntry[];
  systems?: KeySystem[];
}

export default function MarketBar({ bars, systems }: MarketBarProps) {
  // If we have bars with width data, show visual bars with system names
  if (bars && bars.length > 0 && systems && systems.length > 0) {
    return (
      <div className="border-l-2 border-orange p-5">
        <div className="space-y-3">
          {bars.map((bar, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1/3 font-body text-sm text-cream/70 font-semibold truncate">
                {systems[i]?.name || `System ${i + 1}`}
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

  // If we only have systems (no bars), show a simple list
  if (systems && systems.length > 0) {
    return (
      <div className="border-l-2 border-orange p-5">
        <div className="space-y-3">
          {systems.map((sys, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="font-body text-sm text-cream/70 font-semibold">
                {sys.name}
              </span>
              {sys.revenue && (
                <span className="font-body text-sm font-bold text-orange">
                  {sys.revenue}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
