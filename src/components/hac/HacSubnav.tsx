"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/hac/", label: "Committee" },
  { href: "/hac/#members", label: "Members" },
  { href: "/hac/pattern-analysis/", label: "Pattern analysis" },
];

export default function HacSubnav() {
  const pathname = usePathname() || "";
  const active = (href: string) =>
    href === "/hac/"
      ? pathname === "/hac" || pathname === "/hac/"
      : href === "/hac/#members"
        ? pathname.startsWith("/hac/members")
        : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <div className="bg-navy-dark border-b border-ink/10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto">
        <Link href="/hac/" className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-orange py-3 whitespace-nowrap">
          Healthcare Advisory Committee
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
