import type { Metadata } from 'next';
import { Band, Hero, SectionHead } from '@/components/alliance/ui';
import { Field, Form } from '@/components/alliance/Form';
import SentNotice from '@/components/alliance/SentNotice';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

// Partner is by application only, no public price (Dutch, November 16, 2026). This page replaces the Rojas
// Intelligence Partners page that lived at this address; nothing is sold here.
export const metadata: Metadata = makeMetadata({
  title: 'For Partners',
  description: 'Employers, payers, manufacturers, physician-owned hospitals, REITs and ASC developers share one interest with independent physicians: competition. Partnership is by application.',
  path: '/partners/',
});

const groups = [
  { id: 'employers', h: 'Employers and employer coalitions', p: 'Self-funded employers pay the hospital bill as priced. Site-neutral payment removes the facility fee from the price of office-level care; 340B reporting shows what the rest of the bill contains. Neither touches a benefit. The Alliance brings the physicians who can say so in every district.' },
  { id: 'payers', h: 'Payers and manufacturers', p: 'Payers pay hospital rates for office-level care. Manufacturers sell at 340B prices and watch the discount stop short of the patient. The Alliance puts a physician ally in the hearing room beside them, on the record, with sourced data.' },
  { id: 'owners', h: 'Physician-owned hospitals, REITs and ASC developers', p: 'The owners and builders of physician-led facilities compete against Section 6001 and the rules that could reach the surgery center next. The Alliance carries the repeal bill and the statute that would put physician ownership beyond a rulemaking.' },
  { id: 'societies', h: 'Medical societies', p: 'Specialty and state societies carry the physicians. The Alliance carries the fights. A society that joins keeps its own voice and adds a lobbying operation that works on the three rules its members name first.' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'For Partners', path: '/partners/' }])} />
      <Hero eyebrow="For partners" title="The parties who pay for care and the physicians who deliver it share one interest." text="Competition. Partners do not need to agree on everything to agree on this. The Alliance gives employers, payers, manufacturers, physician-owned hospitals, REITs and ASC developers a confidential path to its leadership. Partnership is by application." primary={{ label: 'Apply to partner', href: '#apply' }} />

      <Band label="Who partners with the Alliance">
        <SectionHead eyebrow="Who partners with the Alliance" title="Four kinds of partner. One ask." text="Partnership is by application and its terms are set with leadership. The Alliance publishes no partner names, tiers, titles or logos." />
        <div className="grid gap-10 md:grid-cols-2">
          {groups.map((g) => (
            <section key={g.id} id={g.id} className="flex flex-col gap-3.5 pt-5 border-t-2 border-ink" aria-labelledby={`${g.id}-h`}>
              <h3 id={`${g.id}-h`} className="font-tight font-bold text-[22px] leading-[1.15] tracking-[-0.02em]">{g.h}</h3>
              <p className="text-[15px] leading-[1.55]">{g.p}</p>
            </section>
          ))}
        </div>
      </Band>

      <Band dark id="apply" label="Apply to partner">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-5 self-start">
            <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-text">Apply to partner</p>
            <h2 className="font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[44px]">Reach leadership directly.</h2>
            <p className="text-ink-text-2 text-[16px] leading-[1.55]">The application goes to the Alliance’s leadership, not to a sales queue. Expect a direct reply within two business days. Nothing you send is published or shared.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <SentNotice messages={{ partner: 'Thank you. Your application went to leadership and will be treated as confidential. Expect a direct reply within two business days.' }} />
            <Form name="partner-application" subject="TAFHC Partner Application" action="/partners/?sent=partner#apply" submit="Send to leadership" note="Confidential. Not shared outside the Alliance’s leadership." dark>
              <Field label="Name" id="p-name"><input id="p-name" name="name" type="text" required autoComplete="name" /></Field>
              <Field label="Organization" id="p-org"><input id="p-org" name="organization" type="text" required autoComplete="organization" /></Field>
              <Field label="Sector" id="p-sector">
                <select id="p-sector" name="sector" required defaultValue="">
                  <option value="">Choose one</option>
                  <option>Employer</option><option>Employer coalition</option><option>Payer</option><option>Manufacturer</option><option>Physician-owned hospital</option><option>REIT</option><option>ASC developer</option><option>Medical society</option><option>Other</option>
                </select>
              </Field>
              <Field label="Email" id="p-email"><input id="p-email" name="email" type="email" required autoComplete="email" /></Field>
              <Field label="Phone" id="p-phone"><input id="p-phone" name="phone" type="tel" autoComplete="tel" /></Field>
              <Field label="Message" id="p-msg" full><textarea id="p-msg" name="message" rows={5} required /></Field>
            </Form>
          </div>
        </div>
      </Band>

      <JoinBand partner />
    </>
  );
}
