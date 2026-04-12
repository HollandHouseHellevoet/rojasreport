import Link from 'next/link';
import { getAllStates, getRankings } from '@/lib/data';
import ConMap from '@/components/ConMap';
import StateCard from '@/components/StateCard';
import QuickStat from '@/components/QuickStat';
import EvidencePreview from '@/components/EvidencePreview';
import SectionHeader from '@/components/SectionHeader';

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
        <div className="max-w-content mx-auto px-5 pt-12 pb-14 md:pt-16 md:pb-18">
          <span className="font-body text-xs font-bold tracking-widest uppercase text-orange">
            The Rojas Report Investigation
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream leading-tight tracking-tight max-w-4xl">
            Certificate of Need Laws:{' '}
            <span className="text-orange">The Architecture of a Healthcare Monopoly</span>
          </h1>
          <p className="mt-4 font-body text-base md:text-lg text-cream/55 leading-relaxed max-w-3xl">
            In 35 jurisdictions, it is illegal to open a hospital, surgery center, or imaging
            facility without government permission. Your competitors sit on the board that
            decides. This is how the monopoly was built.
          </p>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickStat value="35" label="Jurisdictions where competition is illegal" />
            <QuickStat value="1964" label="First CON law enacted (New York)" />
            <QuickStat value="1987" label="Federal mandate repealed as ineffective" />
            <QuickStat value="5-11%" label="Higher healthcare costs in CON states" />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-12">
          <SectionHeader
            number="01"
            label="50-State Overview"
            title="Every State, Ranked"
            subtitle="Darker orange means more restrictive. Click any state with a CON law to view its full intelligence dossier."
          />
          <ConMap states={mapStates} />
        </div>
      </section>

      {/* Evidence */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-12">
          <SectionHeader
            number="02"
            label="The Evidence"
            title="What CON Laws Actually Do"
            subtitle="The FTC and DOJ have found no reliable evidence that CON programs achieve any public benefits."
          />
          <EvidencePreview />
        </div>
      </section>

      {/* State Grid */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-12">
          <SectionHeader
            number="03"
            label="State Dossiers"
            title="36 Full Investigations"
            subtitle="Market concentration data, case law, reform status, and the names of the systems that benefit."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {states.map((s) => {
              const teaser = s.meta_description
                ? s.meta_description.substring(0, 80)
                : s.content_blocks?.[0]?.substring(0, 80) || '';
              return (
                <StateCard
                  key={s.abbreviation}
                  state={s.state}
                  abbreviation={s.abbreviation}
                  slug={s.slug}
                  score={s.score}
                  tier={s.tier}
                  conStatus={s.con_status}
                  teaser={teaser}
                />
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/rankings/"
              className="inline-block font-body text-sm font-semibold text-orange hover:text-orange-light border border-orange/30 px-6 py-3 hover:border-orange/60 transition-colors"
            >
              View Full 51-Jurisdiction Rankings Table
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-dark">
        <div className="max-w-content mx-auto px-5 py-12 text-center">
          <p className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-3">
            The Rojas Report Network
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream">
            No other publisher has built this.
          </h2>
          <p className="mt-3 font-body text-sm text-cream/50 max-w-2xl mx-auto leading-relaxed">
            Not KFF. Not Mercatus. Not Cicero. Not the AHA. The definitive Certificate
            of Need intelligence platform. Free, fully indexable, built for executives, PE,
            bankers, lawmakers, attorneys general, and physicians.
          </p>
        </div>
      </section>
    </>
  );
}
