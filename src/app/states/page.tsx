import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStates } from '@/lib/data';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'The States',
  description: 'Where it costs you: certificate-of-need rules, rankings and reform status in every state.',
  alternates: { canonical: 'https://rojasreport.com/states/' },
};

export default function StatesIndex() {
  const states = [...getAllStates()].sort((a, b) => a.state.localeCompare(b.state));
  return (
    <SectionPage slug="states">
      <h2 className="font-display text-[32px] md:text-[40px] text-cream mt-14 mb-4">Every state</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {states.map((s) => (
          <Link
            key={s.slug}
            href={`/states/${s.slug}/`}
            className="group flex items-baseline justify-between border border-ink/10 px-3 py-2 hover:border-orange/60 transition-colors"
          >
            <span className="font-body text-sm text-cream group-hover:text-orange transition-colors">{s.state}</span>
            <span className="font-body text-[13px] uppercase tracking-wider text-cream">{s.tier}</span>
          </Link>
        ))}
      </div>
    </SectionPage>
  );
}
