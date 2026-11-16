import type { Metadata } from "next";
import HacSubnav from "@/components/hac/HacSubnav";
import { members, committee } from "@/lib/hac";

const DESCRIPTION = `${committee.memberCount} members picked from ${committee.nominations} nominations to advise HHS and CMS. Who they are, who pays them, and who is not at the table.`;

export const metadata: Metadata = {
  title: "The Healthcare Advisory Committee: Who Advises HHS and CMS",
  description: DESCRIPTION,
  alternates: { canonical: "https://tafhc.org/hac/" },
  openGraph: {
    title: "The Healthcare Advisory Committee | The Alliance for Healthcare Competition",
    description: DESCRIPTION,
    url: "https://tafhc.org/hac/",
    siteName: "The Alliance for Healthcare Competition",
    images: [{ url: "https://tafhc.org/og-default.png", width: 1200, height: 630, alt: "The Alliance for Healthcare Competition" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Healthcare Advisory Committee | The Alliance for Healthcare Competition",
    description: DESCRIPTION,
    images: ["https://tafhc.org/og-default.png"],
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Healthcare Advisory Committee | The Alliance for Healthcare Competition",
  url: "https://tafhc.org/hac/",
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: "The Alliance for Healthcare Competition", url: "https://tafhc.org" },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Healthcare Advisory Committee member dossiers",
  numberOfItems: members.length,
  itemListElement: members.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.name, url: `https://tafhc.org/hac/members/${m.slug}/` })),
};

export default function HacLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <HacSubnav />
      {children}
    </>
  );
}
