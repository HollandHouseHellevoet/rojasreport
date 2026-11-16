// Stripe Checkout, on demand (a Netlify Function, served at /api/checkout). Receives a plain HTML form POST from
// /physicians/join/ or /give/ and answers with a 303 redirect: to Stripe when configured, back to the page with
// ?status=... when not. Keys come from the Netlify environment only (STRIPE_SECRET_KEY). Ported from the Alliance
// site's src/pages/api/checkout.ts for the static Next export at tafhc.org.
import Stripe from 'stripe';
import membership from '../../src/data/alliance/membership.json' with { type: 'json' };
import giving from '../../src/data/alliance/giving.json' with { type: 'json' };

const ORG = 'The Alliance for Healthcare Competition';
const SITE_URL = 'https://tafhc.org';

export const config = { path: '/api/checkout' };

const back = (base: string, status: string) =>
  new Response(null, { status: 303, headers: { Location: `${base}?status=${status}#checkout` } });

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  const form = await req.formData();
  const kind = form.get('kind') === 'give' ? 'give' : 'dues';
  const base = kind === 'give' ? '/give/' : '/physicians/join/';
  if (form.get('bot-field')) return back(base, 'error');

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return back(base, 'unconfigured');
  if (kind === 'give' && giving.open !== true) return back(base, 'unconfigured');
  const origin = process.env.PUBLIC_SITE_URL || process.env.URL || SITE_URL;
  const stripe = new Stripe(key);
  const email = String(form.get('email') ?? '').trim();
  const str = (k: string) => String(form.get(k) ?? '');

  try {
    if (kind === 'dues') {
      const level = membership.levels.find((l) => l.id === form.get('level'));
      const annual = form.get('interval') === 'year';
      const price = level ? (annual ? level.stripePriceAnnual : level.stripePriceMonthly) : undefined;
      if (!level || !price || price.endsWith('TBD')) return back(base, 'unconfigured');
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price, quantity: 1 }],
        customer_email: email || undefined,
        metadata: { name: str('name'), specialty: str('specialty'), state: str('state'), practice: str('practice'), level: level.id, interval: annual ? 'year' : 'month' },
        subscription_data: { metadata: { level: level.id, name: str('name') } },
        success_url: `${origin}/physicians/join/thanks/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}${base}?status=cancelled#checkout`,
        allow_promotion_codes: false,
        billing_address_collection: 'auto',
      });
      return new Response(null, { status: 303, headers: { Location: session.url! } });
    }

    // Giving: preset or custom amount in whole dollars; monthly (subscription) or once (payment).
    const raw = String(form.get('custom') || form.get('amount') || '').replace(/[^0-9.]/g, '');
    const dollars = Math.round(Number(raw) * 100) / 100;
    if (!Number.isFinite(dollars) || dollars < giving.min || dollars > giving.max) return back(base, 'amount');
    const monthly = form.get('interval') !== 'once';
    const session = await stripe.checkout.sessions.create({
      mode: monthly ? 'subscription' : 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: giving.currency,
          unit_amount: Math.round(dollars * 100),
          product_data: { name: monthly ? `Monthly gift to ${ORG}` : `Gift to ${ORG}` },
          ...(monthly ? { recurring: { interval: 'month' as const } } : {}),
        },
      }],
      customer_email: email || undefined,
      metadata: { name: str('name'), kind: 'gift', interval: monthly ? 'month' : 'once' },
      success_url: `${origin}/give/thanks/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${base}?status=cancelled#checkout`,
    });
    return new Response(null, { status: 303, headers: { Location: session.url! } });
  } catch (err) {
    console.error('checkout:', err instanceof Error ? err.message : err);
    return back(base, 'error');
  }
};
