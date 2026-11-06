import type { Metadata } from "next";
import FahSubnav from "@/components/fah/FahSubnav";
import { org, board, pillars } from "@/lib/fah";

const DESCRIPTION = `${org.tagline} Board dossiers, lobbying filings, PAC money and the eight policy fights, sourced and dated.`;

export const metadata: Metadata = {
  title: "The Federation of American Hospitals: The For-Profit Hospital Lobby",
  description: DESCRIPTION,
  alternates: { canonical: "https://rojasreport.com/fah/" },
  openGraph: {
    title: "Federation of American Hospitals | The Rojas Report",
    description: DESCRIPTION,
    url: "https://rojasreport.com/fah/",
    siteName: "The Rojas Report",
    images: [{ url: "https://rojasreport.com/og-default.png", width: 1200, height: 630, alt: "The Rojas Report" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Federation of American Hospitals | The Rojas Report",
    description: DESCRIPTION,
    images: ["https://rojasreport.com/og-default.png"],
    site: "@TheRojasReport",
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Federation of American Hospitals | The Rojas Report",
  url: "https://rojasreport.com/fah/",
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: "The Rojas Report", url: "https://rojasreport.com", founder: { "@type": "Person", name: "Dutch Rojas" } },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Federation of American Hospitals board dossiers and policy pillars",
  numberOfItems: board.length + pillars.length,
  itemListElement: [
    ...board.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.name, url: `https://rojasreport.com/fah/board/${m.slug}/` })),
    ...pillars.map((p, i) => ({ "@type": "ListItem", position: board.length + i + 1, name: p.title, url: `https://rojasreport.com/fah/pillars/${p.slug}/` })),
  ],
};

export default function FahLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <FahSubnav />
      {children}
    </>
  );
}
