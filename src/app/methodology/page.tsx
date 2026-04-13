import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = makeMetadata({
  title: 'Methodology | CON Law Classification Framework | The Rojas Report',
  description: 'How we score and classify Certificate of Need laws. Cicero Institute restrictiveness scoring (0-100), tier definitions, reform momentum methodology (0-5), and data sources.',
  path: '/methodology/',
  ogImage: '/og/methodology.svg',
});

interface Tier {
  name: string;
  score_range: string;
  color: string;
  description: string;
  states: string[];
  count: number;
}

interface MomentumDimension {
  label: string;
  description: string;
}

interface MomentumThreshold {
  range: string;
  signal: string;
  meaning: string;
}

export default function MethodologyPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'classifications.json'), 'utf-8');
  const data = JSON.parse(raw);
  const tiers: Tier[] = data.tiers;
  const scoring = data.scoring_methodology;
  const momentum = data.momentum_methodology;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 pt-16 pb-12">
          <SectionHeader
            as="h1"
            label="Methodology"
            title="Classification Framework"
            subtitle="How we score, classify, and track Certificate of Need laws across 51 jurisdictions. Transparent methodology. Reproducible results."
          />
        </div>
      </section>

      {/* Tier Definitions */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="01"
            label="Tier Definitions"
            title="Six Tiers of Restrictiveness"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiers.map(tier => (
              <div key={tier.name} className="border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: tier.color }} />
                  <h3 className="font-display text-lg font-bold text-cream">{tier.name}</h3>
                </div>
                <p className="font-body text-xs font-semibold text-cream/40 mb-2">
                  Score: {tier.score_range} &middot; {tier.count} jurisdictions
                </p>
                <p className="font-body text-sm text-cream/60 leading-relaxed">
                  {tier.description}
                </p>
                <p className="mt-3 font-body text-xs text-cream/30">
                  {tier.states.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring Methodology */}
      <section className="bg-navy-dark border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="02"
            label="Restrictiveness Score"
            title="Cicero Institute Scoring (0-100)"
          />
          <div className="max-w-3xl">
            <p className="font-body text-sm text-cream/60 leading-relaxed mb-6">
              {scoring.note}
            </p>
            <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-4">
              Scoring Dimensions
            </h3>
            <ol className="space-y-3">
              {scoring.dimensions.map((dim: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange/20 text-orange text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="font-body text-sm text-cream/70">{dim}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 font-body text-xs text-cream/30">
              Source: {scoring.source}. Scale: {scoring.scale}.
            </p>
          </div>
        </div>
      </section>

      {/* Momentum Methodology */}
      <section className="border-b border-white/10">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="03"
            label="Reform Momentum"
            title="5-Point Momentum Scoring"
          />
          <div className="max-w-3xl">
            <p className="font-body text-sm text-cream/60 leading-relaxed mb-6">
              Each CON state is evaluated on five binary dimensions. A state earns 1 point
              for each dimension it satisfies, producing a score from 0 to 5.
            </p>

            <div className="space-y-4 mb-8">
              {momentum.dimensions.map((dim: MomentumDimension, i: number) => (
                <div key={i} className="border border-white/10 p-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange" />
                    <h4 className="font-body text-sm font-semibold text-cream">{dim.label}</h4>
                  </div>
                  <p className="font-body text-sm text-cream/50 ml-5">{dim.description}</p>
                </div>
              ))}
            </div>

            <h3 className="font-body text-xs font-bold tracking-widest uppercase text-cream/40 mb-4">
              Signal Thresholds
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">Score</th>
                    <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">Signal</th>
                    <th scope="col" className="py-3 px-3 font-body text-xs font-bold tracking-widest uppercase text-cream/40">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {momentum.thresholds.map((t: MomentumThreshold) => (
                    <tr key={t.range} className="border-b border-white/5">
                      <td className="py-3 px-3 font-body text-sm text-cream/70 font-semibold">{t.range}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-xs font-bold ${
                          t.signal === 'Green' ? 'bg-tier-free text-white' :
                          t.signal === 'Yellow' ? 'bg-tier-moderate text-navy' :
                          'bg-tier-most-restrictive text-white'
                        }`}>
                          {t.signal}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-body text-sm text-cream/50">{t.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="bg-navy-dark">
        <div className="max-w-content mx-auto px-5 py-10">
          <SectionHeader
            number="04"
            label="Data Sources"
            title="Where the Data Comes From"
          />
          <div className="max-w-3xl">
            <ul className="space-y-3">
              {[
                { name: 'Cicero Institute', desc: 'State CON restrictiveness scores and tier classifications' },
                { name: 'National Academy for State Health Policy (NASHP)', desc: 'CON program scope and facility type classifications' },
                { name: 'Federal Trade Commission (FTC)', desc: 'Anticompetitive findings and joint policy statements' },
                { name: 'Department of Justice (DOJ)', desc: 'Competition advocacy and CON policy recommendations' },
                { name: 'Centers for Medicare & Medicaid Services (CMS)', desc: 'CMS data files, facility counts, utilization data' },
                { name: 'Institute for Justice', desc: 'CON litigation and constitutional challenges' },
                { name: 'Mercatus Center at George Mason University', desc: 'Economic research on CON impacts' },
                { name: 'National Bureau of Economic Research (NBER)', desc: 'Academic working papers on CON and health outcomes' },
                { name: 'State health departments', desc: 'Individual state CON program rules, fee schedules, and application data' },
                { name: 'The Rojas Report', desc: 'Original analysis, market concentration data, and editorial content' },
              ].map(s => (
                <li key={s.name} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                  <div>
                    <span className="font-body text-sm font-semibold text-cream">{s.name}</span>
                    <span className="font-body text-sm text-cream/50">: {s.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
