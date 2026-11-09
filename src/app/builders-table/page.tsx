import type { Metadata } from 'next';
import { Hero, Block, Grid, Apply, Independence } from '@/components/membership/Membership';

// Dormant: not linked from the site, not in the sitemap, not indexed.
export const metadata: Metadata = {
  title: 'The Builders Table',
  description: 'A private network of people building healthcare outside the hospital system, with Dutch Rojas.',
  robots: { index: false, follow: false, nocache: true },
};

export default function BuildersTablePage() {
  return (
    <>
      <Hero
        eyebrow="The Builders Table · by application"
        title="The people building what comes after the hospital monopoly. One room."
        lede="A private network of physician owners, founders, investors and employers who build and buy care outside the system, and a seat at the table with Dutch Rojas."
      />

      <Block label="Who's at the table" title="Builders">
        <Grid
          items={[
            { title: 'Physician owners', body: 'Practices, ASCs, imaging centers and MSOs. A read on the rules before they change, and a peer network of owners.' },
            { title: 'Operators and founders', body: 'Physician-led and direct-contracting companies. Strategy, introductions and capital.' },
            { title: 'Investors', body: 'Venture, private equity and family offices. Where the market is moving, and the operators worth backing.' },
            { title: 'Self-insured employers', body: 'CFOs and benefits leaders. How to stop overpaying hospitals, and who to contract with instead.' },
          ]}
        />
      </Block>

      <Block label="Membership" title="What members get">
        <Grid
          items={[
            { title: 'Monthly call', body: 'Sixty minutes live with Dutch: his read on the month, then open questions. Off the record.' },
            { title: "The members' brief", body: 'A short weekly written brief. What moved, what it means, what comes next.' },
            { title: 'Cigar tables', body: 'Small dinners of 8 to 12 members in cities across the country, through the year.' },
            { title: 'Annual gathering', body: 'One day, in person. Members and invited speakers. No press.' },
            { title: 'Private channel', body: 'A members-only channel with Dutch and the other members. The network is the product.' },
            { title: 'Early look', body: 'Rojas Report investigations 48 hours before they publish.' },
          ]}
        />
        <p className="font-body text-cream mt-6 max-w-2xl">Warm introductions to other members, at Dutch&apos;s discretion.</p>
      </Block>

      <Block label="Terms" title="$25,000 a year. 100 seats.">
        <p className="font-body text-cream max-w-2xl leading-relaxed">
          One price and one table. A practice owner and a fund partner sit side by side, and that is the point. Membership is annual and capped at 100 members.
        </p>
      </Block>

      <Apply
        subject="Builders Table application"
        note="Tell us what you are building, who you are building it with, and why you want a seat at the table. Every application is reviewed personally."
      />
      <Independence />
    </>
  );
}
