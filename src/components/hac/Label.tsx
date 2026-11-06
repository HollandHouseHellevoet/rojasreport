export default function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-orange ${className}`}>{children}</p>
  );
}
