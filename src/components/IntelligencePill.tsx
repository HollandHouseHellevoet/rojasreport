interface IntelligencePillProps {
  children: React.ReactNode;
  className?: string;
}

export default function IntelligencePill({ children, className = '' }: IntelligencePillProps) {
  return (
    <span
      className={`inline-block border border-orange text-orange px-3 py-1 text-xs font-body font-semibold tracking-widest uppercase rounded-sm ${className}`}
    >
      {children}
    </span>
  );
}
