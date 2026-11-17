import type { Metadata } from 'next';
import Link from 'next/link';
import { Arrow, Band, Hero, SectionHead, lede, textlink } from '@/components/alliance/ui';
import FaqList, { faqJsonLd } from '@/components/alliance/FaqList';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { ORG } from '@/lib/site';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'About',
  description: `${ORG} is the free-market trade association for American healthcare: independent physicians, employers, payers and manufacturers united to end hospital monopoly pricing. Mission, leadership and frequently asked questions.`,
  path: '/about/',
});

const faqs = [
  { q: 'Why a 501(c)(6)?', a: '<p>A 501(c)(6) is a trade association. It exists to advance the common business interests of its members, and it may lobby without limit in pursuit of them. The Alliance was formed to change three federal rules, and that work is lobbying. A charity could not do it at this scale. A political committee could not do it on the merits. A trade association is the vehicle the tax code provides for exactly this purpose, and it carries the disclosure that goes with it: dues are not charitable contributions, and the share spent on lobbying is reported to members each year.</p>' },
  { q: 'Who funds the Alliance?', a: '<p>Physicians, employers, payers, manufacturers and the owners of physician-led facilities. Physician members pay dues of $50 a month or $600 a year. The Council is one hundred physicians, by invitation. Partners join by application through confidential agreements with leadership. The Alliance publishes no donor list, tier names or founding-member titles.</p>' },
  { q: 'Where does the research come from?', a: '<p>The Alliance owns and publishes every dossier, state grade and tracker row on this site. The research is produced for the Alliance under contract by Rojas Media, an independent research firm. Every figure carries its source and an as-of date, and the <a href="/methodology/">methodology</a> and <a href="/corrections/">corrections</a> pages say how it is checked.</p>' },
  { q: 'Is the Alliance partisan?', a: '<p>No. The Alliance is pro-competition. It works with members of both parties, and it will score every member of Congress on the same three questions regardless of party: site-neutral payment, 340B reform and physician ownership.</p>' },
  { q: 'What does the Alliance not do?', a: '<p>It does not lobby outside its three fights. Research on other questions, certificate of need among them, is published as research and not as a position. It does not endorse candidates. It does not name its contributors. It does not publish a figure without a source.</p>' },
];

// Directors are listed here as each seat is filled; the Board band renders once the first is listed.
const directors: { name: string; specialty: string; state: string }[] = [];

export default function Page() {
  return (
    <>
      <JsonLd data={[breadcrumbsJsonLd([{ name: 'About', path: '/about/' }]), faqJsonLd(faqs)]} />
      <Hero eyebrow="About" title="The counterweight." text="Hospital systems have had a trade association for more than a century. Independent physicians and the parties who pay for care have never had one together. The Alliance for Healthcare Competition is that organization." />

      <Band label="Mission">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-4 self-start">
            <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Mission</p>
            <h2 className="font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[44px]">Restore competition to American healthcare.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 prose-site">
            <p className={lede}>The Alliance is a 501(c)(6) trade association. It unites independent physicians with the parties who pay for care, employers, payers and manufacturers, to remove the federal rules that let consolidated hospital systems set prices without a competitor.</p>
            <p>Three rules do most of the work. A payment system that pays a hospital-owned clinic more than an independent office for the same visit. A drug discount program that requires no report of where the discount goes on $100 billion in purchases. A 2010 law that shut new physician-owned hospitals out of Medicare. The Alliance exists to change all three, in the same Congress, with the physicians in every district and the buyers in every state at the same table.</p>
            <p>The Alliance names the actor and the mechanism. It does not criticize profit, investment or scale. It criticizes rules that protect an incumbent from a competitor, and it brings the data to show what those rules cost.</p>
          </div>
        </div>
      </Band>

      {directors.length > 0 && (
        <Band dark id="board" label="Board">
          <SectionHead dark eyebrow="Board of directors" title="Physicians, in independent practice, on two-year terms." text="The board is drawn from independent physicians across specialties and states. Each director serves a two-year term." />
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 list-none m-0 p-0">
            {directors.map((d) => (
              <li key={d.name} className="flex flex-col gap-1 pt-5 border-t border-rule-dark">
                <p className="font-tight font-bold text-[20px] leading-[1.2]">{d.name}</p>
                <p className="text-[15px] text-ink-text-2">{d.specialty} · {d.state}</p>
              </li>
            ))}
          </ul>
        </Band>
      )}

      <Band id="leadership" label="Leadership">
        <SectionHead eyebrow="Leadership" title="Founder" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <p className="text-[17px] leading-[1.55] max-w-[60ch]">The Alliance was founded by Dutch Rojas, a healthcare entrepreneur and Marine veteran who has spent two decades building physician-led companies and writing about the rules that keep hospitals from facing a competitor. The founder writes a bylined column on this site; it is the one place the Alliance speaks in the first person.</p>
            <Link href="/founder/" className={`${textlink} self-start text-ink hover:text-oxblood`}>The founder’s column <Arrow /></Link>
          </div>
        </div>
      </Band>

      <Band mist id="faq" label="Frequently asked questions">
        <SectionHead eyebrow="FAQ" title="Questions physicians and reporters ask." />
        <div className="grid grid-cols-12"><div className="col-span-12 lg:col-span-8"><FaqList items={faqs} /></div></div>
      </Band>

      <JoinBand />
    </>
  );
}
