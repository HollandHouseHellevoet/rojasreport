interface SectionHeaderProps {
  number?: string;
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ number, label, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-4 mb-2">
        {number && (
          <span className="font-display text-4xl sm:text-5xl font-bold text-orange leading-none">
            {number}
          </span>
        )}
        <span className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40">
          {label}
        </span>
      </div>
      <h2 className="font-display text-cream">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 font-body text-cream/50 leading-relaxed max-w-[720px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
