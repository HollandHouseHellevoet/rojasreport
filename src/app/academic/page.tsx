import type { Metadata } from 'next';
import './amc.css';

const DESC = 'Academic medical centers borrowed at scale for forty years on a credential scarcity argument that no longer holds. The data is in.';

export const metadata: Metadata = {
  title: 'The AMC Debt Trap',
  description: DESC,
  alternates: { canonical: 'https://rojasreport.com/academic/' },
  openGraph: {
    title: 'The AMC Debt Trap | The Rojas Report',
    description: DESC,
    url: 'https://rojasreport.com/academic/',
    siteName: 'The Rojas Report',
    type: 'article',
    images: [{ url: 'https://rojasreport.com/academic/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AMC Debt Trap | The Rojas Report',
    description: DESC,
    images: ['https://rojasreport.com/academic/og-image.png'],
    site: '@TheRojasReport',
  },
};

const XSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Rojas Media LLC',
      url: 'https://rojasreport.com',
      sameAs: [
        'https://x.com/TheRojasReport',
        'https://www.linkedin.com/company/the-rojas-report/',
      ],
      founder: { '@type': 'Person', name: 'Dutch Rojas' },
    },
    {
      '@type': 'Person',
      name: 'Dutch Rojas',
      jobTitle: 'Founder',
      affiliation: { '@type': 'Organization', name: 'Rojas Media LLC' },
      sameAs: [
        'https://x.com/dutchrojas',
        'https://www.linkedin.com/in/dutchrojas',
        'https://www.youtube.com/@DutchRojas',
        'https://read.rojasreport.com/',
        'https://rojasreport.com/about',
      ],
    },
    {
      '@type': 'WebSite',
      name: 'The AMC Debt Trap',
      url: 'https://rojasreport.com/academic/',
      publisher: { '@type': 'Organization', name: 'Rojas Media LLC' },
    },
    {
      '@type': 'Article',
      headline: 'The AMC Debt Trap: The Most Protected Are the Most Exposed',
      datePublished: '2026-04-02',
      dateModified: '2026-04-02',
      author: { '@type': 'Person', name: 'Dutch Rojas' },
      publisher: { '@type': 'Organization', name: 'Rojas Media LLC' },
      url: 'https://rojasreport.com/academic/',
      image: 'https://rojasreport.com/academic/og-image.png',
    },
  ],
};


function HeroSection() {
  const tweetText = encodeURIComponent(
    'The AMC Debt Trap: Five institutions issued $5B+ in new debt while operating at or below 2% margin. The most protected are the most exposed. https://rojasreport.com/academic'
  );
  return (
    <section className="hero" id="thesis">
      <div className="hero-inner">
        <div className="hero-tag">Intelligence Briefing</div>
        <h1>
          The AMC Debt Trap
        </h1>
        <h2 style={{ marginTop: '-10px' }}>
          The Most Protected Are the <span>Most Exposed</span>
        </h2>
        <p className="hero-body">
          Academic medical centers borrowed at scale for forty years on a credential
          scarcity argument that no longer holds. The debt remains. The institutions
          that issued it will be the last to admit the collateral is obsolete — and
          the first to ask for a bailout.
        </p>
        <div className="hero-btns">
          <a href="#finding" className="btn-primary">Read the Thesis &rarr;</a>
          <a
            href={`https://x.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <XSVG /> Post to X
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 2: KEY FINDING ─── */
function FindingSection() {
  return (
    <section className="content-section" id="finding">
      <div className="content-inner">
        <div className="section-eyebrow">
          <span className="section-num">01</span>
          <span className="section-label">The Finding</span>
        </div>
        <h2 className="section-h2">Five Institutions. $5B. Sub-2% Margins.</h2>
        <p className="section-desc">
          This is not a stress indicator. This is the argument. Institutions
          borrowing at scale while operating performance deteriorates.
        </p>
        <div className="orange-rule" />

        <div className="card-grid">
          <div className="card">
            <div className="card-figure">$5B+</div>
            <div className="card-label">New Debt Issued</div>
            <p className="card-desc">
              Five AMCs issued over $5 billion in combined new debt while operating
              at or below 2% margin.
            </p>
          </div>
          <div className="card">
            <div className="card-figure">5</div>
            <div className="card-label">Institutions</div>
            <p className="card-desc">
              UPMC, Northwell, Duke, Yale New Haven, and Emory. Named. Documented.
              On the record.
            </p>
          </div>
          <div className="card">
            <div className="card-figure">2%</div>
            <div className="card-label">Operating Margin</div>
            <p className="card-desc">
              The threshold below which new debt issuance signals deteriorating
              fundamentals, not investment.
            </p>
          </div>
        </div>

        {/* 5-institution issuance table */}
        <div style={{ marginTop: '36px' }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>New Issuance</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="institution">UPMC</td>
                  <td className="mono">$1.6B</td>
                  <td>2025</td>
                </tr>
                <tr>
                  <td className="institution">Northwell Health</td>
                  <td className="mono">$762.8M</td>
                  <td>2024</td>
                </tr>
                <tr>
                  <td className="institution">Duke University Health System</td>
                  <td className="mono">$743M</td>
                  <td>2025</td>
                </tr>
                <tr>
                  <td className="institution">Yale New Haven Health</td>
                  <td className="mono">$669M</td>
                  <td>2024</td>
                </tr>
                <tr>
                  <td className="institution">Emory Healthcare</td>
                  <td className="mono">$1B+</td>
                  <td>2025 (planned)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="table-caption">
            Source: EMMA/MSRB, institutional continuing disclosure filings.
            Flagged entries verified against public bond documents.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 3: WHY IT WORKED ─── */
function WhyItWorkedSection() {
  return (
    <section className="content-section">
      <div className="content-inner">
        <div className="section-eyebrow">
          <span className="section-num">02</span>
          <span className="section-label">Forty Years</span>
        </div>
        <h2 className="section-h2">Why the AMC Debt Model Worked</h2>
        <div className="orange-rule" />

        <div className="card-grid">
          <div className="card card-no-border">
            <h3>Credential Scarcity</h3>
            <div className="card-status">&nbsp;</div>
            <p>
              Hands-on volume, credentialed faculty, and physical infrastructure
              were non-substitutable. This justified facility expansion as a
              competitive moat.
            </p>
          </div>
          <div className="card card-no-border">
            <h3>Federal Revenue Floor</h3>
            <div className="card-status">&nbsp;</div>
            <p>
              NIH grant revenue and indirect cost recovery provided a funding floor
              that made long-duration bond issuance appear low-risk.
            </p>
          </div>
          <div className="card card-no-border">
            <h3>Prestige Pricing Power</h3>
            <div className="card-status">&nbsp;</div>
            <p>
              AMC brand translated into above-market reimbursement, facility fee
              stacking, and payer negotiating leverage that serviced the debt.
            </p>
          </div>
        </div>

        <p className="body-close">
          These assumptions were correct. For forty years, they held. The bond
          market priced them accordingly.
        </p>
      </div>
    </section>
  );
}

/* ─── SECTION 4: WHY IT'S A LIABILITY ─── */
function LiabilitySection() {
  return (
    <section className="content-section">
      <div className="content-inner">
        <div className="section-eyebrow">
          <span className="section-num">03</span>
          <span className="section-label">The Inversion</span>
        </div>
        <h2 className="section-h2">Why the Same Logic Is Now a Liability</h2>
        <div className="orange-rule" />

        <div className="card-grid">
          <div className="card">
            <h3>Assumption 1 Inverted</h3>
            <div className="card-status">Credential Scarcity</div>
            <p>
              Robot-assisted surgery and AI-augmented diagnostics have decoupled
              skill acquisition from physical volume. The credential scarcity
              argument that justified $2B surgical towers is eroding in real time.
            </p>
          </div>
          <div className="card">
            <h3>Assumption 2 Exposed</h3>
            <div className="card-status">NIH Indirect Cost Recovery</div>
            <p>
              Federal scrutiny of indirect cost recovery rates hits AMC operating
              margins directly. Institutions modeled for 26-28% recovery rates are
              not hedged for 18%.
            </p>
          </div>
          <div className="card">
            <h3>Assumption 3 Legislated Away</h3>
            <div className="card-status">Pricing Power</div>
            <p>
              Price transparency enforcement, site-neutral payment proposals, and
              facility fee reform target the exact revenue streams that made AMC
              debt serviceable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 5: POLITICAL PROTECTION ─── */
function PoliticalSection() {
  return (
    <section className="content-section">
      <div className="content-inner">
        <div className="section-eyebrow">
          <span className="section-num">04</span>
          <span className="section-label">The Problem</span>
        </div>
        <h2 className="section-h2">The Most Connected Are the Worst Positioned</h2>
        <div className="orange-rule" />
        <div className="prose">
          <p>
            AMCs sit at the intersection of academic tenure, hospital lobbying,
            federal grant dependency, and municipal bond markets. Each constituency
            has a structural incentive to suppress acknowledgment of deteriorating
            fundamentals. No board will vote to impair their own bond rating.
          </p>
          <p>
            The institutions most exposed to the structural shift are also the ones
            generating the research, training the physicians, and advising the
            policymakers who would need to act. The information loop is captured by
            the institutions with the most to lose from honest disclosure.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 6: FULL BOND TABLE ─── */
function BondTableSection() {
  const institutions = [
    { name: 'Advocate Health (Atrium)', moodys: 'Aa2', sp: 'N/F', outlook: 'Stable', debt: '~$7.4B', action: 'Upgraded Aa3\u2192Aa2 (Oct 2025)', unverified: true },
    { name: 'UPMC', moodys: 'A2', sp: 'A', outlook: 'Stable', debt: '~$6.2B+', action: '$1.6B issuance (2025) after 2yr losses', unverified: false },
    { name: 'Mass General Brigham', moodys: 'Aa3', sp: 'N/F', outlook: 'Stable', debt: '~$6.0B', action: 'Affirmed Aa3, stable', unverified: true },
    { name: 'Cleveland Clinic', moodys: 'Aa2', sp: 'AA', outlook: 'Stable', debt: '~$5.0B', action: '$440M new issuance (2025)', unverified: true },
    { name: 'Northwell Health', moodys: 'A3', sp: 'A-', outlook: 'Stable', debt: '~$4.9B', action: '$762.8M issuance at <2% margin', unverified: false },
    { name: 'Mayo Clinic', moodys: 'Aa2', sp: 'AA', outlook: 'Stable', debt: '~$4.7B', action: '~$400M Series 2025 bonds', unverified: false },
    { name: 'Intermountain Health', moodys: 'Aa1', sp: 'AA+', outlook: 'Stable', debt: '~$4.3B', action: 'Affirmed Aa1, stable', unverified: true },
    { name: 'Baylor Scott & White', moodys: 'Aa2', sp: 'AA-', outlook: 'Stable', debt: '~$3.9B', action: 'Upgraded Aa3\u2192Aa2 (Feb 2025)', unverified: false },
    { name: 'NYU Langone Health', moodys: 'A1', sp: 'A+', outlook: 'Stable', debt: '~$3.2B', action: 'Affirmed A1, stable (Feb 2025)', unverified: false },
    { name: 'Stanford Health Care', moodys: 'Aa2', sp: 'AA-', outlook: 'Stable', debt: '~$2.2B', action: 'Upgraded Aa3\u2192Aa2 (May 2025)', unverified: false },
    { name: 'Duke Univ Health System', moodys: 'Aa3', sp: 'AA-', outlook: 'Stable', debt: '~$2.1B', action: '~$743M issuance at -1.5% margin', unverified: false },
    { name: 'Johns Hopkins', moodys: 'Aa2', sp: 'N/F', outlook: 'Stable', debt: '~$1.9B', action: 'Affirmed Aa2, stable', unverified: true },
    { name: 'Yale New Haven Health', moodys: 'A1', sp: 'N/F', outlook: 'Stable', debt: '~$1.7B', action: 'Downgraded Aa3\u2192A1 (May 2023)', unverified: false },
    { name: 'Northwestern Memorial', moodys: 'Aa2', sp: 'AA+', outlook: 'Stable', debt: '~$1.7B', action: 'Affirmed Aa2, stable', unverified: true },
    { name: 'Cedars-Sinai', moodys: 'Aa3', sp: 'N/F', outlook: 'Stable', debt: '~$1.1B', action: 'Affirmed Aa3, stable', unverified: true },
    { name: 'UC Health (Colorado)', moodys: 'Aa3', sp: 'N/F', outlook: 'Positive', debt: '~$1.1B', action: 'Outlook \u2192 positive (2021)', unverified: true },
    { name: 'OSF HealthCare', moodys: 'WD', sp: 'A', outlook: 'Stable', debt: 'N/F', action: "Moody's withdrawn (Oct 2022)", unverified: false },
    { name: 'Vanderbilt UMC', moodys: 'A3', sp: 'N/F', outlook: 'Stable', debt: '~$0.9B', action: 'Affirmed A3, stable (2019)', unverified: false },
    { name: 'WakeMed', moodys: 'A2', sp: 'N/F', outlook: 'Stable', debt: '~$0.76B', action: 'Outlook stable from negative (2024)', unverified: false },
    { name: 'Penn Medicine (UPHS)', moodys: 'Aa3', sp: 'N/F', outlook: 'Stable', debt: 'N/F', action: 'Affirmed Aa3, stable (2021)', unverified: false },
    { name: 'U of Michigan Health', moodys: 'Aa2', sp: 'AA+', outlook: 'Stable', debt: 'N/F', action: 'Hospital Aa2/AA+ (univ Aaa/AAA)', unverified: false },
    { name: 'Houston Methodist', moodys: 'N/F', sp: 'AA', outlook: 'Stable', debt: 'N/F', action: 'Fitch AA, stable', unverified: true },
    { name: 'Emory Healthcare', moodys: 'N/F', sp: 'N/F', outlook: 'Negative', debt: 'N/F', action: '$1B+ issuance planned (2025)', unverified: false },
    { name: 'UCSF Health', moodys: 'Aa2*', sp: 'AA*', outlook: 'Stable', debt: 'N/F', action: 'UC system-level ratings', unverified: false },
    { name: 'Ochsner Health', moodys: 'A3', sp: 'A', outlook: 'Stable', debt: 'N/F', action: 'Affirmed A3/A, stable', unverified: false },
  ];

  return (
    <section className="content-section" id="the-data">
      <div className="content-inner">
        <div className="section-eyebrow">
          <span className="section-num">05</span>
          <span className="section-label">The Data</span>
        </div>
        <h2 className="section-h2">Bond Ratings — All 25 Academic Medical Centers</h2>
        <div className="orange-rule" />

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Moody&apos;s</th>
                <th>S&amp;P</th>
                <th>Outlook</th>
                <th>Est. LT Debt</th>
                <th>Recent Action</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((inst, i) => (
                <tr key={i}>
                  <td className="institution">{inst.name}</td>
                  <td>{inst.moodys}</td>
                  <td>{inst.sp}</td>
                  <td style={inst.outlook === 'Negative' ? { color: '#c0392b', fontWeight: 600 } : undefined}>
                    {inst.outlook}
                  </td>
                  <td className="mono">
                    {inst.debt}
                    {inst.unverified && <span className="unverified-dot" title="Unverified" />}
                  </td>
                  <td>{inst.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-caption">
          Source: Moody&apos;s Investors Service, S&amp;P Global Ratings, Fitch Ratings, EMMA/MSRB,
          institutional financial reports. Amber dots indicate unverified figures derived from
          older filings. N/F = Not Found. WD = Withdrawn. * = System-level rating.
        </p>

        {/* Summary stats */}
        <div className="stats-row">
          <div className="card">
            <div className="card-figure">8</div>
            <div className="card-label">Below Aa3 / AA-</div>
            <p className="card-desc">
              32% of the cohort rated below the Aa3/AA- threshold, carrying ~$18.8B+
              in combined long-term debt.
            </p>
          </div>
          <div className="card">
            <div className="card-figure">1</div>
            <div className="card-label">Negative Outlook</div>
            <p className="card-desc">
              Emory Healthcare on confirmed negative outlook. WakeMed and Yale New
              Haven recently stabilized from negative.
            </p>
          </div>
          <div className="card">
            <div className="card-figure">$75B+</div>
            <div className="card-label">Aggregate LT Debt</div>
            <p className="card-desc">
              Estimated aggregate long-term debt across all 25 institutions. $63.8B
              confirmed; remainder extrapolated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 7: SCENARIOS ─── */
function ScenariosSection() {
  return (
    <section className="content-section" id="scenarios">
      <div className="content-inner">
        <div className="section-eyebrow">
          <span className="section-num">06</span>
          <span className="section-label">Forward</span>
        </div>
        <h2 className="section-h2">Three Plausible Scenarios</h2>
        <div className="orange-rule" />

        <div className="card-grid">
          <div className="card">
            <span className="card-score low">LOW</span>
            <h3>Orderly Deleveraging</h3>
            <div className="card-status">Low Probability</div>
            <p>
              A handful of well-capitalized AMCs recognize the structural shift
              early. The sector bifurcates. This scenario requires board-level
              honesty that has no historical precedent in this sector.
            </p>
          </div>
          <div className="card">
            <span className="card-score high">HIGH</span>
            <h3>Federal Bailout</h3>
            <div className="card-status">Most Likely</div>
            <p>
              Margin compression and NIH funding pressure create a slow-motion
              liquidity crisis at 6-10 major AMCs. Congress intervenes under the
              framing of protecting physician training capacity. Taxpayers absorb
              the loss.
            </p>
          </div>
          <div className="card">
            <span className="card-score critical">CRITICAL</span>
            <h3>Collapse and Redistribution</h3>
            <div className="card-status">Tail Risk — Growing</div>
            <p>
              A credit event at one or two major AMCs cascades into a broader
              repricing of the sector. New issuance becomes prohibitively expensive.
              Physician training redistributes to community hospitals and simulation
              centers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 8: WHO PAYS ─── */
function WhoPaysSection() {
  return (
    <section className="content-section" id="about">
      <div className="content-inner">
        <div className="section-eyebrow">
          <span className="section-num">07</span>
          <span className="section-label">The Reckoning</span>
        </div>
        <h2 className="section-h2">Who Pays</h2>
        <div className="orange-rule" />
        <div className="prose">
          <p>
            The debt was issued to bondholders — pension funds, municipal bond
            funds, and retail investors in tax-advantaged accounts. If the
            institutions restructure, those investors take haircuts. If the federal
            government intervenes, taxpayers absorb the cost through program
            expansion rather than explicit bailout.
          </p>
          <p>
            The people who will pay are the ones who had no seat at the table when
            the bonds were issued: taxpayers, younger physicians entering a system
            shaped by infrastructure decisions made before they started medical
            school, and the communities that assumed these institutions were
            permanent.
          </p>
        </div>
        <p className="closing-line">
          The institutions will frame any intervention as mission preservation.
          It will be liability transfer.
        </p>
      </div>
    </section>
  );
}

/* ─── SECTION 9: CITATIONS ─── */
function CitationsSection() {
  return (
    <section className="content-section">
      <div className="content-inner">
        <div className="section-eyebrow">
          <span className="section-num">08</span>
          <span className="section-label">Sources</span>
        </div>
        <h2 className="section-h2">Primary Sources</h2>
        <div className="orange-rule" />
        <ol className="citations-list">
          <li>
            <div>
              <a href="https://emma.msrb.org" target="_blank" rel="noopener noreferrer" className="citation-title">EMMA / MSRB — Electronic Municipal Market Access</a>
              <a href="https://emma.msrb.org" target="_blank" rel="noopener noreferrer" className="citation-url">emma.msrb.org</a>
            </div>
          </li>
          <li>
            <div>
              <a href="https://www.moodys.com" target="_blank" rel="noopener noreferrer" className="citation-title">Moody&apos;s Investors Service — Healthcare Sector Reports</a>
              <a href="https://www.moodys.com" target="_blank" rel="noopener noreferrer" className="citation-url">moodys.com</a>
            </div>
          </li>
          <li>
            <div>
              <a href="https://www.spglobal.com/ratings" target="_blank" rel="noopener noreferrer" className="citation-title">S&amp;P Global Ratings — Healthcare Issuers</a>
              <a href="https://www.spglobal.com/ratings" target="_blank" rel="noopener noreferrer" className="citation-url">spglobal.com/ratings</a>
            </div>
          </li>
          <li>
            <div>
              <a href="https://projects.propublica.org/nonprofits" target="_blank" rel="noopener noreferrer" className="citation-title">IRS Form 990 via ProPublica Nonprofit Explorer</a>
              <a href="https://projects.propublica.org/nonprofits" target="_blank" rel="noopener noreferrer" className="citation-url">projects.propublica.org/nonprofits</a>
            </div>
          </li>
          <li>
            <div>
              <a href="https://www.cms.gov/data-research/statistics-trends-and-reports/cost-reports" target="_blank" rel="noopener noreferrer" className="citation-title">CMS Hospital Cost Report (HCRIS)</a>
              <a href="https://www.cms.gov/data-research/statistics-trends-and-reports/cost-reports" target="_blank" rel="noopener noreferrer" className="citation-url">cms.gov/data-research</a>
            </div>
          </li>
          <li>
            <div>
              <a href="https://officeofbudget.od.nih.gov" target="_blank" rel="noopener noreferrer" className="citation-title">NIH Office of Budget — Indirect Cost Recovery Data</a>
              <a href="https://officeofbudget.od.nih.gov" target="_blank" rel="noopener noreferrer" className="citation-url">officeofbudget.od.nih.gov</a>
            </div>
          </li>
          <li>
            <div>
              <a href="https://www.beckershospitalreview.com" target="_blank" rel="noopener noreferrer" className="citation-title">Becker&apos;s Hospital Review — Rating Actions &amp; Financial Reports</a>
              <a href="https://www.beckershospitalreview.com" target="_blank" rel="noopener noreferrer" className="citation-url">beckershospitalreview.com</a>
            </div>
          </li>
          <li>
            <div>
              <a href="https://www.bondbuyer.com" target="_blank" rel="noopener noreferrer" className="citation-title">The Bond Buyer — Municipal Bond Issuance Reporting</a>
              <a href="https://www.bondbuyer.com" target="_blank" rel="noopener noreferrer" className="citation-url">bondbuyer.com</a>
            </div>
          </li>
        </ol>
        <p className="table-caption" style={{ marginTop: '24px' }}>
          Dutch Rojas &middot; Rojas Media LLC &middot; Last updated April 2, 2026
        </p>
      </div>
    </section>
  );
}

/* ─── PAGE ─── */
export default function AcademicPage() {
  return (
    <div className="amc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <HeroSection />
      <FindingSection />
      <WhyItWorkedSection />
      <LiabilitySection />
      <PoliticalSection />
      <BondTableSection />
      <ScenariosSection />
      <WhoPaysSection />
      <CitationsSection />
    </div>
  );
}
