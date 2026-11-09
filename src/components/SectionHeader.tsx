interface SectionHeaderProps {
  number?: string;
  label: string;
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2';
}

export default function SectionHeader({ number, label, title, subtitle, as = 'h2' }: SectionHeaderProps) {
  const Heading = as;
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-4 mb-2 flex-wrap">
        {number && (
          <span className="font-display text-4xl sm:text-5xl text-orange leading-none">
            {number}
          </span>
        )}
        <span className="font-body text-xs font-semibold tracking-widest uppercase text-cream">
          {label}
        </span>
      </div>
      <Heading className="font-display text-cream">
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-2 font-body text-cream leading-relaxed max-w-[720px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
