import Link from "next/link";

export default function FahBreadcrumb({ trail = [], current }: { trail?: { href: string; label: string }[]; current: string }) {
  return (
    <nav className="flex items-center gap-2 font-body text-muted mb-8 flex-wrap" style={{ fontSize: "13px" }} aria-label="Breadcrumb">
      <Link href="/" className="hover:text-cream transition-colors">Home</Link>
      <span className="text-border">/</span>
      <Link href="/lobby/" className="hover:text-cream transition-colors">The Lobby</Link>
      <span className="text-border">/</span>
      <Link href="/fah/" className="hover:text-cream transition-colors">Federation of American Hospitals</Link>
      {trail.map((t) => (
        <span key={t.href} className="flex items-center gap-2">
          <span className="text-border">/</span>
          <Link href={t.href} className="hover:text-cream transition-colors">{t.label}</Link>
        </span>
      ))}
      <span className="text-border">/</span>
      <span className="text-cream">{current}</span>
    </nav>
  );
}
