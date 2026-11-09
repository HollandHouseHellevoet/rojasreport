import data from '@/data/support/tiers.json';

/** Support tiers (docs/BUILD_BRIEF.md section 7). Checkout runs on Stripe Payment Links; the links live in src/data/support/tiers.json. */

export interface Tier {
  id: string;
  name: string;
  amount: string;
  unit: string;
  primary: boolean;
  /** Stripe Payment Link. Null until the link is connected. */
  href: string | null;
}

export const tiers: Tier[] = data.tiers as Tier[];

/** True only when every tier has its Stripe link. */
export const checkoutOpen = tiers.every((t) => t.href);

/** Required on every Support block (brief, hard rule 5). */
export const SUPPORT_LINE =
  'The Rojas Report is published by Rojas Media; support is not a charitable donation and is not tax-deductible.';
