import type { Metadata } from 'next';
import { getTimeline } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = makeMetadata({
  title: 'History of CON Laws | Certificate of Need Timeline 1946-2025',
  description: 'The complete history of Certificate of Need laws from the 1946 Hill-Burton Act through today. How a 1959 study was twisted into a federal mandate that created healthcare monopolies.',
  path: '/timeline/',
  ogImage: '/og/timeline.svg',
});

export default function TimelinePage() {
  const timeline = getTimeline();

  return (
    <div className="max-w-content mx-auto px-5 py-10">
      <SectionHeader
        as="h1"
        label="History"
        title="How We Got Here"
        subtitle="From a 1959 academic study to a federal mandate to 35 jurisdictions that still restrict healthcare competition. This is the timeline of Certificate of Need."
      />

      <div className="relative mt-12 max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" aria-hidden="true" />

        <ol className="space-y-0">
          {timeline.map((entry, i) => {
            const isKeyYear = ['1964', '1974', '1987', '2004', '2025'].includes(entry.year);

            return (
              <li key={i} className="relative pl-16 pb-10">
                {/* Dot */}
                <div
                  className={`absolute left-4 top-1 w-5 h-5 rounded-full border-2 ${
                    isKeyYear
                      ? 'bg-orange border-orange'
                      : 'bg-navy border-white/30'
                  }`}
                  aria-hidden="true"
                />

                {/* Year */}
                <time
                  className={`block font-display text-2xl font-bold ${
                    isKeyYear ? 'text-orange' : 'text-cream/70'
                  }`}
                >
                  {entry.year}
                </time>

                {/* Event */}
                <p className="mt-2 font-body text-sm text-cream/60 leading-relaxed max-w-2xl">
                  {entry.event}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Closing */}
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <blockquote className="pl-5 border-l-[3px] border-orange text-left">
          <p className="font-display text-xl text-cream/80 italic">
            They didn&apos;t prove waste. They proved access.
          </p>
          <cite className="block mt-2 font-body text-xs text-cream/40 not-italic">
            The Rojas Report, on Roemer&apos;s Law
          </cite>
        </blockquote>
      </div>
    </div>
  );
}
