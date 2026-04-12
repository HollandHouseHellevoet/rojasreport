interface SectionHeaderProps {
  number?: string;
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ number, label, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        {number && (
          <span className="text-orange font-body text-xs font-bold tracking-widest">
            {number}
          </span>
        )}
        <span className="text-xs font-body font-semibold tracking-widest uppercase text-cream/40">
          {label}
        </span>
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 font-body text-sm text-cream/55 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
