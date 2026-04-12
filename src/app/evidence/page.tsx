import type { Metadata } from 'next';
import { getEvidence } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';
import QuickStat from '@/components/QuickStat';

export const metadata: Metadata = makeMetadata({
  title: 'The Evidence Against CON Laws | Research',
  description: 'FTC, DOJ, Mercatus Center, and academic research findings on how Certificate of Need laws reduce competition, raise costs, and harm patients.',
  path: '/evidence/',
  ogImage: '/og/evidence.svg',
});

export default function EvidencePage() {
  const evidence = getEvidence();

  // Deduplicate hero stats
  const seenLabels = new Set<string>();
  const uniqueStats = (evidence.hero_stats || []).filter((s: { label: string }) => {
    if (seenLabels.has(s.label)) return false;
    seenLabels.add(s.label);
    return true;
  });

  // Clean origin story paragraphs (filter out JSX artifacts and CSS classes)
  const storyParagraphs = (evidence.origin_story || []).filter(
    (p: string) => p.length > 50 && !p.includes('className') && !p.includes('font-sans')
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 pt-16 pb-20">
          <SectionHeader
            number="01"
            label="The Evidence"
            title="What CON Laws Actually Do"
            subtitle="The Federal Trade Commission and the Department of Justice have found no reliable evidence that CON programs achieve any public benefits. They have found clear evidence that the laws grant anticompetitive benefits to protected business interests."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {uniqueStats.map((s: { number: string; label: string }) => (
              <QuickStat key={s.label} value={s.number} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="02"
            label="The Mechanism"
            title="How Certificate of Need Works"
            subtitle="A four-step process designed so that your competitors decide whether you are allowed to exist."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {(evidence.how_it_works_steps || []).map((step: { step: number; text: string }) => (
              <div key={step.step} className="border border-white/10 p-5 text-center">
                <div className="font-display text-4xl font-bold text-orange mb-3">
                  {step.step}
                </div>
                <p className="font-body text-sm text-cream/70 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
          {evidence.blockquotes?.[0] && (
            <blockquote className="mt-8 pl-5 border-l-[3px] border-orange">
              <p className="font-display text-xl md:text-2xl text-cream/80 italic">
                {evidence.blockquotes[0].text}
              </p>
            </blockquote>
          )}
        </div>
      </section>

      {/* Origin Story */}
      {storyParagraphs.length > 0 && (
        <section className="bg-navy-dark border-b border-white/10">
          <div className="max-w-content mx-auto px-5 py-10">
            <SectionHeader
              number="03"
              label="The Origin Story"
              title="How We Got Here"
            />
            <div className="max-w-3xl space-y-5 font-body text-cream/60 leading-relaxed">
              {storyParagraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {evidence.blockquotes?.[1] && (
              <blockquote className="mt-8 pl-5 border-l-[3px] border-orange max-w-3xl">
                <p className="font-display text-lg text-cream/80 italic">
                  {evidence.blockquotes[1].text}
                </p>
                {evidence.blockquotes[1].source && (
                  <cite className="block mt-2 font-body text-xs text-cream/40 not-italic">
                    {evidence.blockquotes[1].source}
                  </cite>
                )}
              </blockquote>
            )}
          </div>
        </section>
      )}

      {/* Key Research Findings */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="04"
            label="Research Consensus"
            title="What the Studies Show"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { finding: 'CON states have fewer hospitals per capita, especially in rural areas.', source: 'Mercatus Center' },
              { finding: 'CON laws are associated with higher mortality rates for certain conditions.', source: 'NBER Working Paper' },
              { finding: 'Repealing CON laws does not lead to a decrease in charity care.', source: 'Journal of Health Economics' },
              { finding: 'CON laws pose serious anticompetitive risks. The agencies recommend repeal.', source: 'FTC & DOJ Joint Statement, 2004' },
              { finding: 'States that repeal CON see 44-47% more ASCs per capita.', source: 'Mercatus Center' },
              { finding: 'Rural areas see 92-112% increase in ASCs after CON repeal.', source: 'Journal of Health Economics' },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 p-5">
                <p className="font-body text-sm text-cream/70 leading-relaxed">
                  {item.finding}
                </p>
                <p className="mt-3 font-body text-xs text-orange">
                  {item.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="bg-navy-dark">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="05"
            label="Featured Investigations"
            title="Deep-Dive State Profiles"
            subtitle="These states have been fully investigated by The Rojas Report."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(evidence.featured_state_profiles || []).slice(0, 6).map((p: {
              state: string;
              score: number;
              status: string;
              description: string;
            }) => {
              const slug = p.state.toLowerCase().replace(/ /g, '-');
              return (
                <a
                  key={p.state}
                  href={`/states/${slug}/`}
                  className="block border border-white/10 p-5 hover:border-orange/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-xs font-bold tracking-widest uppercase text-cream/40">
                      {p.status}
                    </span>
                    <span className="font-body text-xs font-bold text-orange">
                      {p.score}/100
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-cream">
                    {p.state}
                  </h3>
                  <p className="mt-2 font-body text-sm text-cream/50 leading-relaxed">
                    {p.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
