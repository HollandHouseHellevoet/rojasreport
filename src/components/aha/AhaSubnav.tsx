"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/aha/", label: "Dossiers" },
  { href: "/aha/powermap/", label: "Power Map" },
  { href: "/aha/about/", label: "About" },
];

export default function AhaSubnav() {
  const pathname = usePathname() || "";
  const active = (href: string) =>
    href === "/aha/"
      ? pathname === "/aha" || pathname === "/aha/" || pathname.startsWith("/aha/profiles")
      : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <div className="bg-navy-dark border-b border-ink/10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto">
        <Link
          href="/aha/"
          className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-orange py-3 whitespace-nowrap"
        >
          AHA
        </Link>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`font-body text-sm py-3 whitespace-nowrap border-b-2 transition-colors ${
              active(l.href) ? "text-cream border-orange" : "text-cream/60 border-transparent hover:text-cream"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
