import type { Metadata } from "next";
import profilesData from "@/data/aha/profiles.json";
import AhaSubnav from "@/components/aha/AhaSubnav";

const profiles = profilesData as { slug: string; name: string; status?: string }[];
const CURRENT_COUNT = profiles.filter((p) => p.status !== "former").length;
const DESCRIPTION = `${CURRENT_COUNT} individuals. Every conflict. Every dollar. Every red flag. The definitive intelligence record on who controls American hospital policy.`;

export const metadata: Metadata = {
  title: "AHA Intelligence: Who Controls American Hospital Policy",
  description:
    "The sourced intelligence database on the American Hospital Association's board and executive team: conflicts of interest, executive pay, lobbying expenditures and red flags.",
  alternates: { canonical: "https://rojasreport.com/aha/" },
  openGraph: {
    title: "AHA Intelligence | The Rojas Report",
    description: DESCRIPTION,
    url: "https://rojasreport.com/aha/",
    siteName: "The Rojas Report",
    images: [{ url: "https://rojasreport.com/og-default.png", width: 1200, height: 630, alt: "AHA Intelligence - The Rojas Report" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AHA Intelligence | The Rojas Report",
    description: DESCRIPTION,
    images: ["https://rojasreport.com/og-default.png"],
    site: "@TheRojasReport",
  },
};

const sectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AHA Intelligence | The Rojas Report",
  url: "https://rojasreport.com/aha/",
  description:
    "Primary source intelligence on the American Hospital Association: board conflicts, lobbying expenditures, PAC architecture, and institutional capture.",
  publisher: {
    "@type": "Organization",
    name: "The Rojas Report",
    url: "https://rojasreport.com",
    founder: { "@type": "Person", name: "Dutch Rojas" },
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AHA Board Member Intelligence Profiles",
  description:
    "Documented financial conflicts, compensation, and lobbying relationships of American Hospital Association board members and executives",
  numberOfItems: profiles.length,
  itemListElement: [...profiles]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `https://rojasreport.com/aha/profiles/${p.slug}/`,
    })),
};

export default function AhaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <AhaSubnav />
      {children}
    </>
  );
}
