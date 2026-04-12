import Link from 'next/link';
import { getAllStates, getRankings } from '@/lib/data';
import ConMap from '@/components/ConMap';
import StateCard from '@/components/StateCard';
import QuickStat from '@/components/QuickStat';
import EvidencePreview from '@/components/EvidencePreview';
import SectionHeader from '@/components/SectionHeader';
import IntelligencePill from '@/components/IntelligencePill';

const SHARE_TEXT = encodeURIComponent(
  'In 35 jurisdictions, it is illegal to open a hospital without government permission. The Rojas Report mapped every one. https://conlaws.rojasreport.com'
);

const MECHANISM_STEPS = [
  { num: 1, text: 'You want to build a surgery center' },
  { num: 2, text: 'You apply to the state board' },
  { num: 3, text: 'Your competitors sit on that board' },
  { num: 4, text: 'Your competitors vote on whether you exist' },
];

export default function HomePage() {
  const states = getAllStates();
  const rankings = getRankings();

  const mapStates = rankings.map((r) => {
    const stateData = states.find(s => s.state === r.state);
    return {
      abbreviation: r.state === 'District of Columbia' ? 'DC' :
        states.find(s => s.state === r.state)?.abbreviation ?? '',
      slug: stateData?.slug ?? r.state.toLowerCase().replace(/ /g, '-'),
      score: r.score,
      tier: r.tier,
      state: r.state,
      hasProfile: !!stateData,
    };
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 pt-12 pb-12">
          <IntelligencePill>Intelligence Briefing</IntelligencePill>
          <h1 className="mt-4 font-display font-bold text-cream leading-tight tracking-tight max-w-4xl">
            Certificate of Need Laws:
          </h1>
          <h2 className="font-display font-bold text-orange leading-tight tracking-tight max-w-4xl">
            The Architecture of a Healthcare Monopoly
          </h2>
          <p className="mt-4 font-body text-cream/50 leading-relaxed max-w-prose">
            In 35 jurisdictions, it is illegal to open a hospital, surgery center, or imaging
            facility without government permission. Your competitors sit on the board that
            decides. This is how the monopoly was built.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#mechanism"
              className="inline-block font-body text-sm font-semibold text-cream bg-orange hover:bg-orange-light px-5 py-2.5 transition-colors rounded-sm"
            >
              Read the Investigation &rarr;
            </a>
            <a
              href={`https://x.com/intent/tweet?text=${SHARE_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-body text-sm font-semibold text-cream/60 border border-white/20 px-5 py-2.5 hover:text-cream hover:border-white/40 transition-colors rounded-sm"
            >
              Post to X
            </a>
          </div>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickStat value="35" label="Jurisdictions" context="Where competition is illegal" />
            <QuickStat value="1964" label="First CON Law" context="Enacted in New York" />
            <QuickStat value="1987" label="Mandate Repealed" context="Deemed ineffective by Congress" />
            <QuickStat value="5-11%" label="Higher Costs" context="In CON states vs. free market" />
          </div>
        </div>
      </section>

      {/* Four-step mechanism */}
      <section id="mechanism" className="border-b border-white/10 scroll-mt-20">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="01"
            label="The Mechanism"
            title="How Certificate of Need Works"
            subtitle="A four-step process designed so that your competitors decide whether you are allowed to exist."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MECHANISM_STEPS.map(step => (
              <div key={step.num} className="border border-white/10 p-5">
                <div className="font-display text-stat text-orange leading-none">
                  {step.num}
                </div>
                <p className="mt-3 font-body text-cream/70 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
          <blockquote className="mt-8 pl-5 border-l-2 border-orange max-w-prose">
            <p className="font-display text-2xl text-cream/80 italic leading-relaxed">
              It&apos;s like asking McDonald&apos;s for permission to open a Burger King.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Evidence stats */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="02"
            label="The Evidence"
            title="What CON Laws Actually Do"
            subtitle="The FTC and DOJ have found no reliable evidence that CON programs achieve any public benefits."
          />
          <EvidencePreview />
          <div className="mt-6">
            <Link
              href="/evidence/"
              className="font-body text-sm font-semibold text-orange hover:text-orange-light transition-colors"
            >
              Read the full investigation &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="03"
            label="50-State Overview"
            title="Every State, Ranked"
            subtitle="Darker orange means more restrictive. Click any state with a CON law to view its full intelligence dossier."
          />
          <ConMap states={mapStates} />
        </div>
      </section>

      {/* State Grid */}
      <section id="states" className="bg-navy-dark border-b border-white/10 scroll-mt-20">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="04"
            label="State Dossiers"
            title="36 Full Investigations"
            subtitle="Market concentration data, case law, reform status, and the names of the systems that benefit."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {states.map((s) => (
              <StateCard
                key={s.abbreviation}
                state={s.state}
                abbreviation={s.abbreviation}
                slug={s.slug}
                score={s.score}
                tier={s.tier}
                conStatus={s.con_status}
                teaser={s.hook || s.meta_description?.substring(0, 100) || ''}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/rankings/"
              className="inline-block font-body text-sm font-semibold text-orange hover:text-orange-light transition-colors"
            >
              View Full 51-Jurisdiction Rankings &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section>
        <div className="max-w-content mx-auto px-5 py-10 text-center">
          <h2 className="font-display font-bold text-cream">
            No other publisher has built this.
          </h2>
          <p className="mt-2 font-body text-cream/45 max-w-prose mx-auto leading-relaxed">
            Not KFF. Not Mercatus. Not Cicero. Not the AHA. The definitive Certificate
            of Need intelligence platform. Free, fully indexable, built for physicians,
            executives, and lawmakers.
          </p>
        </div>
      </section>
    </>
  );
}
