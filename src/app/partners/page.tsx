import type { Metadata } from 'next';
import { Hero, Block, Grid, Apply, Independence } from '@/components/membership/Membership';

// Dormant: not linked from the site, not in the sitemap, not indexed.
export const metadata: Metadata = {
  title: 'Rojas Intelligence Partners',
  description: "The Rojas Report's intelligence, briefed to your team, on your issues, before it's public.",
  robots: { index: false, follow: false, nocache: true },
};

const ROWS: [string, string, string][] = [
  ['Private quarterly briefing for your team, live with Dutch (90 min)', '4 a year', '4 a year + 2 on demand'],
  ['Issue lanes tracked, with alerts when anything moves', '3', '6'],
  ["Custom data pulls (a system's pay, a committee's votes, a lobbying map)", '8 a year', '20 a year'],
  ['Early look at investigations before publication', '72 hours', '2 weeks'],
  ['Monthly Partners call, off the record', 'Included', 'Included'],
  ['Named analyst contact, two-business-day response', 'Included', 'Included'],
  ['Seats at a Builders Table cigar dinner', '1 a year', '2 a year'],
];

export default function PartnersPage() {
  return (
    <>
      <Hero
        eyebrow="Rojas Intelligence Partners · by application"
        title="The intelligence, briefed to your team, before it's public."
        lede="A standing briefing on the fights that move your organization's money: who is moving, where the money is, and what happens next."
      />

      <Block label="Who it serves" title="Institutions with money on the line">
        <Grid
          items={[
            { title: 'Pharmaceutical manufacturers', body: 'The 340B program, site-neutral payment, drug pricing and state contract-pharmacy bills.' },
            { title: 'Payers and PBMs', body: 'Hospital pricing, consolidation, price transparency and provider-tax fights.' },
            { title: 'Self-insured employers and benefit consultants', body: 'What hospitals charge, where to steer, and how to contract directly.' },
            { title: 'Investors', body: 'Which rules change which markets, before they change.' },
            { title: 'Law and lobbying firms', body: 'Players, money and status on every fight your clients care about.' },
            { title: 'Physician groups and MSOs', body: 'CON, the physician-owned hospital ban, Stark, and how to compete with the systems.' },
          ]}
        />
      </Block>

      <Block label="Membership" title="Two levels">
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[620px] font-body text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="p-4 font-semibold text-cream/60"></th>
                <th className="p-4">
                  <span className="block font-display text-xl text-cream">Standard</span>
                  <span className="block text-orange font-semibold mt-1">$75,000 a year</span>
                </th>
                <th className="p-4">
                  <span className="block font-display text-xl text-cream">Plus</span>
                  <span className="block text-orange font-semibold mt-1">$150,000 a year</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, std, plus]) => (
                <tr key={label} className="border-b border-white/10 last:border-0">
                  <td className="p-4 text-cream/80">{label}</td>
                  <td className="p-4 text-cream tabular-nums">{std}</td>
                  <td className="p-4 text-cream tabular-nums">{plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-body text-cream/60 text-sm mt-6 max-w-2xl leading-relaxed">
          Annual, paid in advance. Briefings and calls are off the record. Custom research, strategy and exclusive work are available separately.
        </p>
      </Block>

      <Apply
        subject="Rojas Intelligence Partners application"
        note="Tell us about your organization and the issues that matter most to it. Seats are limited, and every application is reviewed personally."
      />
      <Independence />
    </>
  );
}
