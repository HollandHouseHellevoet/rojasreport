import type { Metadata } from 'next';
import { Band, Breadcrumb, lede } from '@/components/alliance/ui';
import { Field, Form } from '@/components/alliance/Form';
import GiveForm from '@/components/alliance/GiveForm';
import SentNotice from '@/components/alliance/SentNotice';
import TaxNotice from '@/components/TaxNotice';
import JsonLd from '@/components/alliance/JsonLd';
import giving from '@/data/alliance/giving.json';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

// giving.json `open` is false until Stripe is connected; the page then shows one email field, not a form that cannot complete.
const open = giving.open === true;

export const metadata: Metadata = makeMetadata({
  title: 'Give',
  description: 'Support The Alliance for Healthcare Competition with a monthly gift. Gifts fund lobbying on site-neutral payment, 340B reform and physician ownership.',
  path: '/give/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Give', path: '/give/' }])} />
      <Band>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-5 self-start lg:sticky lg:top-24">
            <Breadcrumb trail={[{ name: 'Give', href: '/give/' }]} />
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[56px]">Fund the fights.</h1>
            <p className={lede}>A monthly gift is the steadiest support a lobbying operation can have. It pays for the data work and the briefings that move a bill.{!open && ' Giving opens with the public launch in December 2026. Leave your email to be told the day it opens.'}</p>
            <ul className="list-disc pl-5 grid gap-2.5 text-[15px] leading-[1.5]">
              <li>{open ? 'Processed by Stripe.' : 'When giving opens, payment is processed by Stripe.'} The Alliance never sees or stores a card number.</li>
              <li>No donor list. Your name is never published.</li>
              {open && <li>Change or stop a monthly gift at any time from your Stripe receipt.</li>}
            </ul>
          </div>

          <div className="lg:col-span-7 lg:col-start-6" id="checkout">
            {!open && (
              <div className="grid gap-6">
                <SentNotice messages={{ waitlist: 'You are on the list. The Alliance will write to you when giving opens.' }} />
                <h2 className="font-tight font-bold text-[26px] md:text-[32px] tracking-[-0.02em]">Be told when giving opens.</h2>
                <Form name="giving-waitlist" subject="TAFHC Giving Waitlist" action="/give/?sent=waitlist#checkout" submit="Tell me when giving opens" note="One email when giving opens. Your address is not published.">
                  <Field label="Email" id="w-email" full><input id="w-email" name="email" type="email" required autoComplete="email" /></Field>
                </Form>
                <TaxNotice />
              </div>
            )}
            {open && (
              <>
                <SentNotice param="status" messages={{
                  unconfigured: 'Giving is not yet open. Leave your email on the contact page and the Alliance will write to you the day it opens.',
                  cancelled: 'Payment was cancelled. Nothing was charged. You can try again below.',
                  amount: `Please enter an amount between $${giving.min.toLocaleString('en-US')} and $${giving.max.toLocaleString('en-US')}.`,
                  error: 'Something went wrong on the way to payment. Nothing was charged. Please try again, or write to the Alliance through the contact page.',
                }} />
                <GiveForm monthly={giving.monthly} once={giving.once} min={giving.min} max={giving.max} />
              </>
            )}
          </div>
        </div>
      </Band>
    </>
  );
}
