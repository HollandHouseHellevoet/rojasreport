import type { Metadata } from 'next';
import Link from 'next/link';
import { buildSearchIndex } from '@/lib/searchIndex';
import SearchResults from '@/components/search/SearchResults';

/** /search: search across everything (docs/BUILD_BRIEF.md section 4.1, item 4). Static page; results filter on the client. */

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search every health system, hospital, lawmaker and state on The Rojas Report.',
  robots: { index: false, follow: true },
};

export default function Page() {
  const index = buildSearchIndex();
  return (
    <div className="max-w-[880px] mx-auto px-5 md:px-8 pt-10 pb-20">
      <nav aria-label="Breadcrumb" className="font-meta text-[12px] tracking-[0.1em] text-muted mb-7">
        <Link href="/" className="hover:text-oxblood">/Home</Link> <span className="text-ink">/Search</span>
      </nav>
      <h1 className="font-display font-normal text-[36px] md:text-[44px] leading-[1.05] mb-8">Follow the money in healthcare.</h1>
      <SearchResults index={index} />
    </div>
  );
}
