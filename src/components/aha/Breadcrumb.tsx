import Link from "next/link";

interface BreadcrumbProps {
  profileName: string;
}

export default function Breadcrumb({ profileName }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 font-body text-muted mb-8" style={{ fontSize: "13px" }}>
      <Link href="/" className="hover:text-cream transition-colors">
        Home
      </Link>
      <span className="text-border">/</span>
      <Link href="/aha/" className="hover:text-cream transition-colors">
        AHA Intelligence
      </Link>
      {profileName && (
        <>
          <span className="text-border">/</span>
          <span className="text-cream">{profileName}</span>
        </>
      )}
    </nav>
  );
}
