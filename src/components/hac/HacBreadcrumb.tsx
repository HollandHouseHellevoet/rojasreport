import Link from "next/link";

export default function HacBreadcrumb({ current }: { current: string }) {
  return (
    <nav className="flex items-center gap-2 font-body text-muted mb-8" style={{ fontSize: "13px" }} aria-label="Breadcrumb">
      <Link href="/" className="hover:text-cream transition-colors">Home</Link>
      <span className="text-muted">/</span>
      <Link href="/washington/" className="hover:text-cream transition-colors">Washington</Link>
      <span className="text-muted">/</span>
      <Link href="/hac/" className="hover:text-cream transition-colors">Healthcare Advisory Committee</Link>
      <span className="text-muted">/</span>
      <span className="text-cream">{current}</span>
    </nav>
  );
}
