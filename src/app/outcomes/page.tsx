import type { Metadata } from 'next';
import Link from 'next/link';
import { getOutcomes } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = makeMetadata({
  title: 'CON Repeal Outcomes | What Happens After Reform',
  description: 'Before-and-after data from states that reformed their Certificate of Need laws. Florida (2019), Montana (2021), South Carolina (2024). New facilities, rural access, cost trends.',
  path: '/outcomes/',
  ogImage: '/og/outcomes.svg',
});

function DirectionIcon({ direction }: { direction: string }) {
  if (direction === 'positive') return <span className="text-tier-free text-lg">&#x2191;</span>;
  if (direction === 'negative') return <span className="text-tier-most-restrictive text-lg">&#x2193;</span>;
  return <span className="text-cream/30 text-lg">&#x2014;</span>;
}

export default function OutcomesPage() {
  const outcomes = getOutcomes();

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 pt-16 pb-12">
          <SectionHeader
            label="Reform Outcomes"
            title="What Happens After Repeal?"
            subtitle="Every CON reform bill faces the same opposition testimony: 'repeal will close rural hospitals.' These three states provide the answer, with data."
          />
        </div>
      </section>

      {/* State cards */}
      {outcomes.map((outcome, i) => (
        <section
          key={outcome.abbreviation}
          className={`border-b border-white/10 ${i % 2 === 0 ? '' : 'bg-navy-dark'}`}
        >
          <div className="max-w-content mx-auto px-5 py-16 md:py-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-body text-xs font-bold tracking-widest uppercase text-orange">
                    {outcome.reform_type}
                  </span>
                  <span className="font-body text-xs text-cream/30">
                    {outcome.reform_year}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold text-cream">
                  <Link href={`/states/${outcome.slug}/`} className="hover:text-orange transition-colors">
                    {outcome.state}
                  </Link>
                </h2>
                <p className="mt-2 font-body text-sm text-cream/55 leading-relaxed max-w-2xl">
                  {outcome.description}
                </p>
              </div>
              <div className="flex-shrink-0 border border-white/10 p-4 text-center min-w-[140px]">
                <div className="font-body text-xs text-cream/40 mb-1">Bill</div>
                <div className="font-body text-sm font-semibold text-cream">{outcome.bill}</div>
                <div className="font-body text-xs text-cream/40 mt-1">{outcome.governor_at_reform}</div>
              </div>
            </div>

            {/* Before / After table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                      Metric
                    </th>
                    <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                      Before Reform
                    </th>
                    <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                      After Reform
                    </th>
                    <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40 text-center w-16">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {outcome.metrics.map((m, j) => (
                    <tr key={j} className="border-b border-white/5">
                      <td className="py-3 px-3 font-body text-sm text-cream/70 font-semibold">
                        {m.label}
                      </td>
                      <td className="py-3 px-3 font-body text-sm text-cream/50">
                        {m.before}
                      </td>
                      <td className="py-3 px-3 font-body text-sm text-cream/70">
                        {m.after}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <DirectionIcon direction={m.direction} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Key finding */}
            <blockquote className="mt-8 pl-5 border-l-[3px] border-orange">
              <p className="font-body text-sm text-cream/70 leading-relaxed italic">
                {outcome.key_finding}
              </p>
            </blockquote>

            {/* Source */}
            <p className="mt-4 font-body text-xs text-cream/30">
              Source: {outcome.source}
            </p>
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section className="bg-navy-dark">
        <div className="max-w-content mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-cream">
            The data is clear.
          </h2>
          <p className="mt-3 font-body text-sm text-cream/50 max-w-2xl mx-auto leading-relaxed">
            States that reform their CON laws see more facilities, more competition,
            and better access, especially in rural areas. No state that has repealed
            its CON law has reversed course.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/reform/" className="font-body text-sm font-semibold text-orange hover:text-orange-light border border-orange/30 px-6 py-3 hover:border-orange/60 transition-colors">
              View Reform Tracker
            </Link>
            <Link href="/evidence/" className="font-body text-sm font-semibold text-cream/60 hover:text-cream border border-white/10 px-6 py-3 hover:border-white/30 transition-colors">
              View Research Evidence
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
