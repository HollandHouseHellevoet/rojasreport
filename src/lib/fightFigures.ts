import poh from '@/data/poh/meta.json';

/**
 * The figures the three fights lead with, shared by the home page, the fights index and each fight page.
 * The physician-owned hospital count is the Alliance desk figure (src/data/poh/meta.json), which Dutch chose on
 * November 16, 2026 over the 240+ the Alliance site had carried from the FY 2027 IPPS final rule.
 */
export const POH_COUNT = {
  value: poh.headline.value,
  label: 'Physician-owned hospitals in the United States, the estimate CMS cites',
  source: 'CMS, FY 2027 IPPS proposed rule, 91 Fed. Reg. 19312, 19668 (April 14, 2026)',
  url: poh.headline.source,
  asOf: poh.headline.asOf,
};

export const FIGHT_TILES = [
  {
    slug: 'site-neutral' as const,
    title: 'Site-Neutral Payment',
    href: '/fights/site-neutral/',
    stake:
      'Same service, same price, regardless of who owns the building. Medicare has equalized three services by rule at existing off-campus departments, imaging without contrast the latest, in November 2026. Put the rest in statute: every service, every site.',
    value: '87%',
    label: 'More for the same primary care visit in a hospital outpatient department than in a physician office, 2022 commercial claims',
    source: 'Health Care Cost Institute, 2025',
    url: 'https://healthcostinstitute.org/all-hcci-reports/facility-fees-what-are-they-and-how-do-they-impact-health-care-prices/',
  },
  {
    slug: '340b' as const,
    title: '340B Reform',
    href: '/fights/340b/',
    stake:
      'Hospitals bought $79.2B of the $100.0B in drugs sold at 340B prices in 2025. Nothing in the law requires the discount to reach a patient, and nothing requires a hospital to report where it went. Require the report.',
    value: '3.08x',
    label: 'Median markup to private insurers on 340B drugs, against acquisition cost',
    source: 'Robinson et al., New England Journal of Medicine, 2024',
    url: 'https://doi.org/10.1056/NEJMsa2306609',
  },
  {
    slug: 'physician-ownership' as const,
    title: 'Physician Ownership',
    href: '/fights/physician-ownership/',
    stake:
      'Section 6001 shut new physician-owned hospitals out of Medicare in 2010. Repeal it, and secure the right of physicians to own the surgery center and the imaging center before the same rule reaches them.',
    value: POH_COUNT.value,
    label: POH_COUNT.label,
    source: POH_COUNT.source,
    url: POH_COUNT.url,
  },
];
