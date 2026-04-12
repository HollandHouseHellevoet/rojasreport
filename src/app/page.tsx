import Link from 'next/link';
import { getAllStates, getRankings } from '@/lib/data';
import ConMap from '@/components/ConMap';
import StateCard from '@/components/StateCard';
import QuickStat from '@/components/QuickStat';
import EvidencePreview from '@/components/EvidencePreview';
import SectionHeader from '@/components/SectionHeader';

const SHARE_TEXT = encodeURIComponent(
  'In 35 jurisdictions, it is illegal to open a hospital without government permission. The Rojas Report mapped every one. https://conlaws.rojasreport.com'
);

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
          <span className="font-body text-xs font-bold tracking-widest uppercase text-orange">
            Intelligence Briefing
          </span>
          <h1 className="mt-3 font-display font-bold text-cream leading-tight tracking-tight max-w-4xl">
            Certificate of Need Laws:
          </h1>
          <h2 className="font-display font-bold text-orange leading-tight tracking-tight max-w-4xl">
            The Architecture of a Healthcare Monopoly
          </h2>
          <p className="mt-4 font-body text-cream/50 leading-relaxed max-w-[720px]">
            In 35 jurisdictions, it is illegal to open a hospital, surgery center, or imaging
            facility without government permission. Your competitors sit on the board that
            decides. This is how the monopoly was built.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/evidence/"
              className="inline-block font-body text-sm font-semibold text-cream bg-orange hover:bg-orange-light px-5 py-2.5 transition-colors"
            >
              Read the Investigation &rarr;
            </Link>
            <a
              href={`https://x.com/intent/tweet?text=${SHARE_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-body text-sm font-semibold text-cream/60 border border-white/20 px-5 py-2.5 hover:text-cream hover:border-white/40 transition-colors"
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

      {/* Map */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
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
        <div className="max-w-content mx-auto px-5 py-10">
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
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="03"
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
                teaser={s.meta_description?.substring(0, 100) || s.content_blocks?.[0]?.substring(0, 100) || ''}
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

      {/* CTA */}
      <section className="bg-navy-dark">
        <div className="max-w-content mx-auto px-5 py-10 text-center">
          <h2 className="font-display font-bold text-cream">
            No other publisher has built this.
          </h2>
          <p className="mt-2 font-body text-cream/45 max-w-2xl mx-auto leading-relaxed">
            Not KFF. Not Mercatus. Not Cicero. Not the AHA. The definitive Certificate
            of Need intelligence platform. Free, fully indexable, built for physicians,
            executives, and lawmakers.
          </p>
        </div>
      </section>
    </>
  );
}
