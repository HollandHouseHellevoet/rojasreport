export default function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-body text-[13px] font-semibold uppercase tracking-[0.15em] text-orange ${className}`}>{children}</p>
  );
}
