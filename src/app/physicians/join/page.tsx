import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Breadcrumb, lede } from '@/components/alliance/ui';
import { Field, Form, STATES } from '@/components/alliance/Form';
import SentNotice from '@/components/alliance/SentNotice';
import TaxNotice from '@/components/TaxNotice';
import JsonLd from '@/components/alliance/JsonLd';
import membership from '@/data/alliance/membership.json';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

const level = membership.levels[0];
// Until both Stripe prices are set in membership.json the page shows one email field, not a checkout that cannot complete.
const configured = !!level.stripePriceMonthly && !!level.stripePriceAnnual && !level.stripePriceMonthly.endsWith('TBD') && !level.stripePriceAnnual.endsWith('TBD');

export const metadata: Metadata = makeMetadata({
  title: 'Join',
  description: `Join The Alliance for Healthcare Competition. Dues of ${level.monthly} a month or ${level.annual} a year fund lobbying on site-neutral payment, 340B reform and physician ownership. ${configured ? 'A short form, then secure payment.' : 'Dues checkout opens soon.'}`,
  path: '/physicians/join/',
});

const SPECIALTIES = ['Anesthesiology','Cardiology','Dermatology','Emergency medicine','Family medicine','Gastroenterology','General surgery','Internal medicine','Neurology','Obstetrics and gynecology','Oncology','Ophthalmology','Orthopedic surgery','Otolaryngology','Pain medicine','Pediatrics','Physical medicine and rehabilitation','Plastic surgery','Psychiatry','Radiology','Urology','Vascular surgery'];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'For Physicians', path: '/physicians/' }, { name: 'Join', path: '/physicians/join/' }])} />
      <Band>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-5 self-start lg:sticky lg:top-24">
            <Breadcrumb trail={[{ name: 'For Physicians', href: '/physicians/' }, { name: 'Join', href: '/physicians/join/' }]} />
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[56px]">Join the fight.</h1>
            <p className={lede}>
              {configured
                ? `A short form, then payment. ${level.monthly} a month or ${level.annual} a year. Cancel anytime; your membership remains active through the end of your current billing period.`
                : `Dues are ${level.monthly} a month or ${level.annual} a year. Checkout opens with the public launch in December 2026. Leave your email to be told the day it opens.`}
            </p>
            <ul className="list-disc pl-5 grid gap-2.5 text-[15px] leading-[1.5]">
              <li>{configured ? 'Payment is processed by Stripe.' : 'When checkout opens, payment is processed by Stripe.'} The Alliance never sees or stores a card number.</li>
              <li>Your name is never published. Membership is reported to lawmakers only in aggregate.</li>
              <li>Progress reports and every Alliance report, by email, from the day you join.</li>
              <li>The Alliance estimates {membership.deductibleShare} of dues are deductible as a business expense. The exact share is reported to members each year.</li>
            </ul>
            <p className="text-[15px]">Invited to the Council? <Link href="/physicians/council/" className="underline underline-offset-[3px]">Start here instead.</Link></p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6" id="checkout">
            {!configured && (
              <div className="grid gap-6">
                <SentNotice messages={{ waitlist: 'You are on the list. The Alliance will write to you when dues checkout opens.' }} />
                <h2 className="font-tight font-bold text-[26px] md:text-[32px] tracking-[-0.02em]">Be told when dues open.</h2>
                <Form name="dues-waitlist" subject="TAFHC Dues Waitlist" action="/physicians/join/?sent=waitlist#checkout" submit="Tell me when dues open" note="One email when checkout opens. Your address is not published.">
                  <Field label="Email" id="w-email" full><input id="w-email" name="email" type="email" required autoComplete="email" /></Field>
                  <Field label="Specialty (optional)" id="w-spec"><input id="w-spec" name="specialty" type="text" list="specialties" /></Field>
                  <Field label="State (optional)" id="w-state">
                    <select id="w-state" name="state" defaultValue=""><option value="">Choose</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
                  </Field>
                </Form>
                <datalist id="specialties">{SPECIALTIES.map((s) => <option key={s} value={s} />)}</datalist>
                <TaxNotice />
              </div>
            )}
            {configured && (
              <>
                <SentNotice param="status" messages={{
                  unconfigured: 'Dues checkout is not yet open. Leave your email on the contact page and the Alliance will write to you the day it opens.',
                  cancelled: 'Payment was cancelled. Nothing was charged. You can try again below.',
                  error: 'Something went wrong on the way to payment. Nothing was charged. Please try again, or write to the Alliance through the contact page.',
                }} />
                <form method="POST" action="/api/checkout" className="grid gap-8">
                  <input type="hidden" name="kind" value="dues" />
                  <input type="hidden" name="level" value={level.id} />
                  <p className="hp" aria-hidden="true"><label>Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

                  <fieldset className="border-0 m-0 p-0 grid gap-4">
                    <legend className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em] mb-4">Billing</legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { v: 'month', name: 'Monthly', price: `${level.monthly}/month`, note: 'Cancel anytime.' },
                        { v: 'year', name: 'Annual', price: `${level.annual}/year`, note: 'Two months free against monthly.' },
                      ].map((o, i) => (
                        <label key={o.v} className="block cursor-pointer">
                          <input type="radio" name="interval" value={o.v} defaultChecked={i === 1} required className="peer sr-only" />
                          <span className="grid gap-2 p-6 border-[1.5px] border-rule bg-paper-2 peer-checked:border-ink peer-checked:shadow-[inset_0_0_0_1px_#1C1B19] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-ink">
                            <span className="font-tight font-bold text-[18px]">{o.name}</span>
                            <span className="num text-[28px]">{o.price}</span>
                            <span className="text-[14px]">{o.note}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <ul className="list-disc pl-5 text-[15px] grid gap-1.5">{level.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" id="j-name"><input id="j-name" name="name" type="text" required autoComplete="name" /></Field>
                    <Field label="Email" id="j-email"><input id="j-email" name="email" type="email" required autoComplete="email" /></Field>
                    <Field label="Specialty" id="j-spec"><input id="j-spec" name="specialty" type="text" required list="specialties" /></Field>
                    <Field label="State" id="j-state">
                      <select id="j-state" name="state" required autoComplete="address-level1" defaultValue=""><option value="">Choose</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
                    </Field>
                    <Field label="Practice name" id="j-practice" full><input id="j-practice" name="practice" type="text" required autoComplete="organization" /></Field>
                  </div>
                  <datalist id="specialties">{SPECIALTIES.map((s) => <option key={s} value={s} />)}</datalist>

                  <div className="flex flex-col gap-3 items-start">
                    <button type="submit" className="inline-flex items-center gap-2.5 min-h-[48px] px-[22px] bg-accent text-ink font-tight font-semibold text-[15px] leading-none border-[1.5px] border-accent hover:bg-accent-hover">
                      Continue to payment
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 8h11M8 3l5 5-5 5" /></svg>
                    </button>
                    <p className="text-[14px] max-w-[60ch]">By joining you agree to the <Link href="/terms/" className="underline">terms</Link> and <Link href="/privacy/" className="underline">privacy policy</Link>.</p>
                  </div>
                  <TaxNotice />
                </form>
              </>
            )}
          </div>
        </div>
      </Band>
    </>
  );
}
