/**
 * One place for the organization's identity. Every page, the structured data, the header and the footer read from here.
 * Ported from the Alliance site's src/config/site.ts (tafhc.com) for the merge at tafhc.org (MERGER_PLAN.md, section 3).
 */
export const ORG = 'The Alliance for Healthcare Competition';
export const SHORT = 'the Alliance';
export const MARK = 'TAFHC';
export const SITE_URL = 'https://tafhc.org';
export const TAGLINE =
  'The free-market alliance of independent physicians, employers, payers, and manufacturers fighting to end hospital monopoly pricing.';
export const GOAL_PHYSICIANS = '200,000';

/**
 * Mailboxes on tafhc.org (MERGER_PLAN.md, section 4.6). Google Workspace is not set up yet; Dutch creates these
 * before the soft launch on December 1, 2026. Until then the contact form carries every message.
 */
export const CONTACT = {
  general: 'info@tafhc.org',
  press: 'press@tafhc.org',
  corrections: 'corrections@tafhc.org',
  members: 'members@tafhc.org',
  partners: 'partners@tafhc.org',
  pressPhone: '',
  address: '',
};

/** Social profiles render only once a URL is set. */
export const SOCIAL = {
  x: '',
  linkedin: '',
  youtube: '',
};

/** Formspree endpoint, the one the Alliance site uses; every form sets its own _subject so the inbox can sort them. */
export const FORMSPREE = 'https://formspree.io/f/mqedyrgy';

export const absolute = (path: string) => new URL(path, SITE_URL).toString();

/**
 * Member levels (Dutch, November 16, 2026). Prices are the member-facing figures. The deductible share is
 * the Alliance's own IRC 162(e) estimate and is stated as "two thirds" until counsel confirms the percentage.
 */
export const MEMBERSHIP = {
  physician: { monthly: '$50', annual: '$600' },
  council: { monthly: '$2,000', annual: '$24,000', seats: 100 },
  deductibleShare: 'two thirds',
};
