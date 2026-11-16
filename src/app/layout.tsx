import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrintHeader from '@/components/PrintHeader';
import { siteJsonLd } from '@/lib/seo';
import { ORG, SITE_URL, TAGLINE } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${ORG}: Competition is the cure`,
    template: `%s | ${ORG}`,
  },
  description: TAGLINE,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: ORG,
    images: [{ url: '/og/home.svg', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = siteJsonLd();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:ital,wght@0,400..700;1,400..700&family=Inter+Tight:wght@600..800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1C1B19" />
      </head>
      <body className="bg-paper text-ink font-body antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-ink focus:text-paper focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          <PrintHeader />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
