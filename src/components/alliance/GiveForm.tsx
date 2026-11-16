'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Field } from '@/components/alliance/Form';
import TaxNotice from '@/components/TaxNotice';

const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;

/** The giving form: frequency, preset or custom amount, name and email, then the Stripe function at /api/checkout. */
export default function GiveForm({ monthly, once, min, max }: { monthly: number[]; once: number[]; min: number; max: number }) {
  const [interval, setInterval] = useState<'month' | 'once'>('month');
  const presets = interval === 'month' ? monthly : once;
  return (
    <form method="POST" action="/api/checkout" className="grid gap-8">
      <input type="hidden" name="kind" value="give" />
      <p className="hp" aria-hidden="true"><label>Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

      <fieldset className="border-0 m-0 p-0">
        <legend className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em] mb-4">Frequency</legend>
        <div className="flex">
          {(['month', 'once'] as const).map((v) => (
            <label key={v} className="cursor-pointer">
              <input type="radio" name="interval" value={v} checked={interval === v} onChange={() => setInterval(v)} className="peer sr-only" />
              <span className="inline-block px-5 py-3 border-[1.5px] border-ink -mr-[1.5px] font-tight font-semibold text-[15px] peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-ink relative">{v === 'month' ? 'Monthly' : 'One time'}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 m-0 p-0">
        <legend className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em] mb-4">Amount</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presets.map((a, i) => (
            <label key={`${interval}-${a}`} className="cursor-pointer">
              <input type="radio" name="amount" value={a} defaultChecked={i === 1} className="peer sr-only" />
              <span className="flex flex-col items-start gap-0.5 p-4 border-[1.5px] border-rule bg-paper-2 num text-[24px] leading-none peer-checked:border-ink peer-checked:shadow-[inset_0_0_0_1px_#1C1B19] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-ink">
                {fmt(a)}{interval === 'month' && <small className="font-body font-normal text-[12px] tracking-normal">/month</small>}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-5 max-w-[20rem]">
          <Field label="Or another amount" id="g-custom" hint={`Between ${fmt(min)} and ${fmt(max)}. A custom amount replaces the selection above.`}>
            <div className="flex items-center border-[1.5px] border-slate bg-paper-2 focus-within:outline focus-within:outline-[3px] focus-within:outline-ink">
              <span aria-hidden="true" className="pl-3.5 pr-1">$</span>
              <input id="g-custom" name="custom" type="number" inputMode="decimal" min={min} max={max} step="1" placeholder="0" className="!border-0 !bg-transparent focus:!outline-none" />
            </div>
          </Field>
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" id="g-name"><input id="g-name" name="name" type="text" required autoComplete="name" /></Field>
        <Field label="Email" id="g-email"><input id="g-email" name="email" type="email" required autoComplete="email" /></Field>
      </div>

      <div className="flex flex-col gap-3 items-start">
        <button type="submit" className="inline-flex items-center gap-2.5 min-h-[48px] px-[22px] bg-accent text-ink font-tight font-semibold text-[15px] leading-none border-[1.5px] border-accent hover:bg-accent-hover">
          Continue to payment
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 8h11M8 3l5 5-5 5" /></svg>
        </button>
        <p className="text-[14px] max-w-[60ch]">By giving you agree to the <Link href="/terms/" className="underline">terms</Link> and <Link href="/privacy/" className="underline">privacy policy</Link>.</p>
      </div>
      <TaxNotice />
    </form>
  );
}
