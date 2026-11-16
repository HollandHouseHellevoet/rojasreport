/** Site navigation for tafhc.org (MERGER_PLAN.md, section 3.1). Seven top items, each with its second level. */

export interface NavItem {
  href: string;
  label: string;
  blurb?: string;
}

export interface NavSection {
  href: string;
  label: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    label: 'Our Fights',
    href: '/fights/',
    items: [
      { label: 'Site-Neutral Payment', href: '/fights/site-neutral/', blurb: 'Same service, same price, regardless of who owns the building.' },
      { label: '340B Reform', href: '/fights/340b/', blurb: 'Transparency and accountability for where the discount goes.' },
      { label: 'Physician Ownership', href: '/fights/physician-ownership/', blurb: 'Repeal Section 6001 and secure the right to own the facility.' },
      { label: 'The Tracker', href: '/tracker/', blurb: 'Every bill and rule, its stage, its direction and its source.' },
    ],
  },
  {
    label: 'Research',
    href: '/research/',
    items: [
      { label: 'Cost Drivers', href: '/drivers/', blurb: 'Why care costs what it does.' },
      { label: 'States', href: '/states/', blurb: 'Every state, graded.' },
      { label: 'Health Systems', href: '/systems/', blurb: 'Where the money sits.' },
      { label: 'Physician-Owned', href: '/physician-owned/', blurb: 'What physicians built anyway.' },
      { label: 'Government', href: '/government/', blurb: 'Who writes the rules.' },
      { label: 'The Lobby', href: '/lobby/', blurb: 'Who buys the outcome.' },
      { label: 'Carriers', href: '/carriers/', blurb: 'Who holds the premium.' },
      { label: 'Methodology', href: '/methodology/', blurb: 'How every figure is labeled and sourced.' },
      { label: 'Search', href: '/search/', blurb: 'Every page, every figure.' },
    ],
  },
  {
    label: 'Insights',
    href: '/insights/',
    items: [
      { label: 'All insights', href: '/insights/', blurb: 'Reports, briefs and data, each with its sources.' },
      { label: 'Reports', href: '/insights/?format=Report', blurb: 'Long-form analysis with sources.' },
      { label: 'Data', href: '/insights/?format=Data', blurb: 'Figures lawmakers and staff can cite.' },
    ],
  },
  {
    label: 'How We Win',
    href: '/how-we-win/',
    items: [
      { label: 'The plan', href: '/how-we-win/', blurb: 'Three fights, run at once, with the parties who pay for care.' },
      { label: 'Timeline', href: '/how-we-win/#timeline', blurb: 'What happens each quarter of 2027.' },
      { label: 'Progress reports', href: '/how-we-win/#progress', blurb: 'What the Alliance did, and what comes next.' },
    ],
  },
  {
    label: 'For Physicians',
    href: '/physicians/',
    items: [
      { label: 'Why join', href: '/physicians/', blurb: 'What membership funds and what you get back.' },
      { label: 'Join', href: '/physicians/join/', blurb: '$50 a month or $600 a year for physician members.' },
      { label: 'Council', href: '/physicians/council/', blurb: '100 physicians, by invitation.' },
      { label: 'Give', href: '/give/', blurb: 'A monthly or one-time gift, separate from dues.' },
    ],
  },
  {
    label: 'For Partners',
    href: '/partners/',
    items: [
      { label: 'Employers and coalitions', href: '/partners/#employers', blurb: 'The buyers of care.' },
      { label: 'Payers and manufacturers', href: '/partners/#payers', blurb: 'The parties that pay the bill.' },
      { label: 'Physician-owned hospitals, REITs and ASC developers', href: '/partners/#owners', blurb: 'The parties that build the competitor.' },
      { label: 'Medical societies', href: '/partners/#societies', blurb: 'The physicians’ own organizations.' },
      { label: 'Apply', href: '/partners/#apply', blurb: 'Partnership is by application.' },
    ],
  },
  {
    label: 'About',
    href: '/about/',
    items: [
      { label: 'Mission', href: '/about/', blurb: 'Why a 501(c)(6), and who funds it.' },
      { label: 'Board', href: '/about/#board', blurb: 'Physician board members on two-year terms.' },
      { label: 'Newsroom', href: '/newsroom/', blurb: 'Press releases and the media contact.' },
      { label: 'Founder', href: '/founder/', blurb: 'The column by the Alliance’s founder.' },
      { label: 'Contact', href: '/contact/', blurb: 'Write to the Alliance.' },
    ],
  },
];

/** Utility bar, left of the Join button. */
export const UTILITY: NavItem[] = [
  { href: '/newsroom/', label: 'Newsroom' },
  { href: '/contact/', label: 'Contact' },
  { href: '/search/', label: 'Search' },
  { href: '/give/', label: 'Give' },
];

export const JOIN = { href: '/physicians/join/', label: 'Join the Fight' };

/** Research sections in nav order, for the hub page and the footer. */
export const RESEARCH_SECTIONS = NAV[1].items.filter((i) => !['/methodology/', '/search/'].includes(i.href));
