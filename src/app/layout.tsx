import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { siteJsonLd } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Certificate of Need Laws by State | CON Law Intelligence | The Rojas Report',
    template: '%s | The Rojas Report',
  },
  description:
    'In 35 jurisdictions, it is illegal to open a hospital without government permission. Complete intelligence on every CON state: rankings, market data, case law, reform status.',
  metadataBase: new URL('https://conlaws.rojasreport.com'),
  openGraph: {
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy text-cream font-body antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-orange focus:text-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
