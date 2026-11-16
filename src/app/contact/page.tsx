import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Hero } from '@/components/alliance/ui';
import { Field, Form } from '@/components/alliance/Form';
import SentNotice from '@/components/alliance/SentNotice';
import JsonLd from '@/components/alliance/JsonLd';
import { CONTACT, ORG } from '@/lib/site';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'Contact',
  description: `Contact ${ORG}: general inquiries, press, corrections, membership and partnerships.`,
  path: '/contact/',
});

// Channel cards render only for values set in src/lib/site.ts.
const cards = [
  { h: 'General', lines: [CONTACT.general] },
  { h: 'Press', lines: [CONTACT.press, CONTACT.pressPhone] },
  { h: 'Corrections', lines: [CONTACT.corrections] },
  { h: 'Mail', lines: [CONTACT.address] },
].map((c) => ({ ...c, lines: c.lines.filter(Boolean) })).filter((c) => c.lines.length > 0);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Contact', path: '/contact/' }])} />
      <Hero eyebrow="Contact" title="Write to the Alliance." text="Membership questions, data requests, corrections, press and partnerships. Partners reach leadership through the application on the partners page." />
      <Band>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SentNotice messages={{
              contact: 'Thank you. Your message reached the Alliance. Expect a reply within two business days.',
              newsletter: 'You are on the list. Data and progress reports from the Alliance, twice a month.',
              partner: 'Thank you. Your application went to leadership and will be treated as confidential.',
            }} />
            <Form name="contact" subject="TAFHC Contact" action="/contact/?sent=contact" submit="Send" note="Your message goes to the Alliance’s general inbox. It is not shared outside the organization.">
              <Field label="Name" id="c-name"><input id="c-name" name="name" type="text" required autoComplete="name" /></Field>
              <Field label="Email" id="c-email"><input id="c-email" name="email" type="email" required autoComplete="email" /></Field>
              <Field label="Topic" id="c-topic" full>
                <select id="c-topic" name="topic" required defaultValue="">
                  <option value="">Choose one</option><option>Membership</option><option>Data or a report</option><option>A correction</option><option>Press</option><option>Partnership</option><option>Something else</option>
                </select>
              </Field>
              <Field label="Message" id="c-msg" full><textarea id="c-msg" name="message" rows={6} required /></Field>
            </Form>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9 grid gap-6 content-start">
            {cards.map((c) => (
              <div key={c.h} className="bg-mist p-7 flex flex-col gap-2">
                <h2 className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">{c.h}</h2>
                {c.lines.map((l) => <p key={l}><a href={`mailto:${l}`} className="hover:underline">{l}</a></p>)}
              </div>
            ))}
            <div className="bg-mist p-7 flex flex-col gap-2">
              <h2 className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Partners</h2>
              <p className="text-[15px]">Employers, payers, manufacturers and the owners of physician-led facilities reach leadership through the <Link href="/partners/#apply" className="underline">application</Link>.</p>
            </div>
            <div className="bg-mist p-7 flex flex-col gap-2">
              <h2 className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em]">Reporters</h2>
              <p className="text-[15px]">Releases, the boilerplate and the media contact are in the <Link href="/newsroom/" className="underline">newsroom</Link>.</p>
            </div>
          </aside>
        </div>
      </Band>
    </>
  );
}
