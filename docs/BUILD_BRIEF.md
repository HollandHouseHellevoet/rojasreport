# The Rojas Report — build brief for Claude Code

*From Dutch Rojas. November 6, 2026. Build the live rojasreport.com from this brief and the approved mockups.*

**Approved mockups (design source of truth):** https://claude.ai/artifact/TDNh77Kmp8ZNiPayAvS8p7
Four artboards: Home, Health System Profile (CommonSpirit), State Dossier (North Carolina), Committee Dossier (Senate Finance). Match them closely. Where this brief and a mockup disagree, this brief wins.

**Stack (unchanged):** Next.js, static site generation, Netlify. One site at rojasreport.com. The subdomains (aha., fah., hac., poh., waysandmeans., academic., con.) fold into it over time and then redirect.

---

## 1. What the site is for

Healthcare intelligence for **independent physicians first**, then lawmakers and their staff, AGs, governors and specialty societies. Every page answers one question: **why does care cost this much, and who benefits?**

Every visitor should be able to do three things on any page: **read** it, **download** it (PDF), and **buy the data** behind it. Reading is free.

**Model:** OpenSecrets' structure (search-first, profiles of people and institutions, every number sourced) with a private-bank editorial look.

## 2. Hard rules

1. **No invented numbers.** Every figure links to its source filing. A missing figure shows as an em dash marked "pending," never a guess.
2. **Every figure is labeled reported or estimated.** "est." marks Rojas Report calculations; each method is on the methodology page.
3. **Client work stays out.** Nothing from client portals (for example ab.tafhc.com) is reproduced: not pages, layouts, copy or presentation. The underlying research data in `phycap-work/research/` may be used.
4. **"340B"** is always "the 340B program" where it could be misread as a dollar figure.
5. **Support is not a donation.** Never use "donate" or "donation." The Support section carries this line: *"The Rojas Report is published by Rojas Media; support is not a charitable donation and is not tax-deductible."*
6. **Never say publicly that anyone is excluded** from buying or membership. Membership is by application.

## 3. Design system

### Colors (four, no others)

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F4EFE6` | Page background. No pure white anywhere. |
| `paper-2` | `#ECE5D8` | Alternating section background |
| `ink` | `#1C1B19` | Text, rules, footer |
| `oxblood` | `#8E1B1B` | Masthead, Support button, **government/power bands** (committees, later lawmakers and the lobby), "lobby holding" status, big ratio numbers |
| `green` | `#1F3A2E` | **Institution/place bands** (health systems, states), Support section, "reform moving" status, buy buttons |

Supporting tones: muted text `#5E5A52`, body grey `#3A3732`, hairline `#CFC6B6`, gold status `#7A5A16`, placeholder fill `#DDD4C4`. On green bands use `#C9BFA9` / `#E4DCCB` for secondary text and `#4A6355` for rules. On oxblood bands use `#E8CFC4` and `#B35A58`.

**Color rule readers learn without being told:** green = where the money sits (institutions, places). Oxblood = who holds power (government).

### Type

| Role | Font | Notes |
|---|---|---|
| Display, headings, big numbers | Bodoni Moda | Masthead stacked "THE ROJAS / REPORT" in oxblood |
| Body | EB Garamond | 18–23px; italic for decks, captions, labels |
| Small metadata only | Inter | 11–14px. Use sparingly. |

**Restraint rule:** no more than about four uppercase letter-spaced labels per page (nav, Support button, one eyebrow, one section label). Everything else uses italic Garamond. Thin rules, not boxes. No cards with borders, no shadows, no gradients, no emoji.

### Components (build once, reuse everywhere)

- **Masthead + nav:** full masthead on home; compact one-line masthead on inner pages. Nav: Cost Drivers · States · Health Systems · Committees · The Lobby · Reports & Data. Support button top right.
- **Money band:** full-width colored band (green or oxblood by page type) with 3–4 big Bodoni numbers, a one-line plain-English caption each, and a small source note.
- **Driver card:** numeral + label + weight (state pages), title, one large number or grade, one sentence, status dot with text (never color alone), and Read / Download / Get the data links.
- **Status label:** `● LOBBY HOLDING` (oxblood), `● IN PLAY` / `● ON PAPER` (gold), `● REFORM MOVING` (green), `● PENDING` (grey).
- **Ledger table:** three columns (item with footnote number, who pays in italics, amount in Bodoni), group headings in oxblood italic serif, totals row with a 2px rule, numbered sources list beneath in two columns, "est." tag for estimates, em dash for pending.
- **Scorecard table:** member, positions on each driver, Machine Score (oxblood Bodoni).
- **Buy block:** green primary button with price, outlined secondary buttons.
- **Footer:** ink background, sourcing statement, methodology and corrections links.

Accessibility: real links and buttons, 4.5:1 text contrast, status never by color alone, all wide tables scroll inside their own box on phones.

## 4. Pages and URLs

| Page | URL pattern | Band color |
|---|---|---|
| Home | `/` | green (Support) |
| Cost driver | `/drivers/[slug]` | oxblood |
| Health system profile | `/systems/[slug]` | green |
| Hospital (child of system) | `/systems/[slug]/[hospital]` | green |
| State dossier | `/states/[st]` | green |
| Committee dossier | `/committees/[slug]` | oxblood |
| Member page (phase 2) | `/members/[slug]` | oxblood |
| Reports & store | `/reports` | green |
| Methodology | `/methodology` (+ `/methodology/machine-score`, `/methodology/state-grade`, `/methodology/subsidy-ledger`) | none |
| Support | `/support` | green |

### 4.1 Home (`/`)

In order:
1. Utility bar (date, sign in, newsletter, Support).
2. Masthead with the deck line: *"Why healthcare costs what it does, who profits, and how physicians take it back."*
3. Nav.
4. **Search across everything:** "Search a health system, hospital, lawmaker or state" (client-side index built at build time).
5. **Six reasons your care costs what it does:** the six driver cards.
6. **Where the fights stand:** tracker table (fight, status, who's winning, what's next).
7. **State tile map:** 50 states plus DC; published dossiers in green, others in preparation.
8. **This week's cover** (rotates weekly) + **Most-read dossiers** list.
9. **Get the intelligence:** Free reader · Reports & datasets · Builders Table ($25,000/yr, 100 seats, apply). Custom data request link.
10. **Support the Report** (green band, Stripe tiers, see section 7).
11. **Build:** MedMerge, Cornerstone Indemnity, PhyCap Fund.
12. Footer.

### 4.2 Health system profile (`/systems/[slug]`)

1. Breadcrumb, eyebrow (tax status, HQ), name, one-line verdict, Download PDF and Get the full dataset buttons.
2. Key figures strip: hospital facilities, revenue, net assets, CEO pay, long-term debt.
3. **Where the money sits** (green): cash and investments; assets in offshore insurance subsidiaries (label exactly: "held in [country] insurance companies it controls"); money sent abroad for investments (Schedule F); years of free care its cash could fund.
4. **The Fair Share Test:** one large ratio, "$X in subsidies and write-offs for every $1 of free care a patient actually received," marked "at least" with the count of filled ledger lines; two bars.
5. **The Subsidy Ledger:** groups Federal programs · Tax exemptions · State Medicaid financing · The community benefit write-off; totals; "for comparison: free care actually delivered"; sources list.
6. Leadership & pay · Lobbying & politics · Market power (CON objections, practices acquired, aircraft).
7. Buy block: this system · all its hospitals by state · all systems all-access.

**Editorial rule for the ledger:** charity care, Medicaid and Medicare shortfalls, bad debt and other community benefit claims are **write-offs on the subsidy side**, not offsets. The only separate line is "free care actually delivered to patients, at cost" (Schedule H line 7a; show the Worksheet S-10 figure in the note).

### 4.3 State dossier (`/states/[st]`)

1. Breadcrumb, name, verdict, **Rojas grade** box (letter, "provisional" note when drivers are missing, link to How we grade).
2. Where the money sits (green): net income, total assets, estimated tax breaks vs charity care, out-of-state 340B contract pharmacies.
3. The six cost drivers in this state: each card shows its **letter grade and weight**.
4. The systems that run it: table ranked by net income, linking to profiles.
5. Who decides: governor and AG, legislative leaders, health committee chairs, the federal delegation's committee seats; hospital association PAC spending.
6. The bills: status and remaining session dates.
7. Practicing here? (house ads) · Take the state with you (buy).

**State grade formula:** A=4, B=3, C=2, D=1, F=0. Weights: Section 6001 5% · price transparency 12.5% · CON 30% · subsidies 27.5% · CMS favoritism 12.5% · Stark/AKS 12.5%. Ungraded drivers drop out and the remaining weights renormalize; the grade shows "provisional" until all six are graded. Letter cutoffs on the weighted average: ≥3.5 A, ≥2.5 B, ≥1.5 C, ≥0.5 D, else F. Driver rubrics live in `/methodology/state-grade` and in data, not code.

### 4.4 Committee dossier (`/committees/[slug]`)

Committees replace individual lawmaker pages as the primary unit. Four to start: **Senate Finance, Senate HELP, House Ways and Means, House Energy and Commerce.** Tab bar switches between them.

1. Eyebrow "Committee Dossier · 120th Congress," name in **oxblood**, verdict, Download and Get the member dataset buttons.
2. **What this committee does, in plain English:** most physicians have never heard of these committees. Short intro plus four numbered points. Write this section for a reader with zero civics background.
3. **What it controls** (oxblood band): the jurisdiction items that set what care costs, each with its legal citation.
4. Who runs it: chair and ranking member, portraits, two-sentence summaries.
5. Who is leaving / who is new.
6. **Where the members stand:** scorecard (positions on the federal cost drivers + Machine Score). Hospital-industry money shown **beside** the score, not inside it.
7. What's on the docket.
8. For committee staff: member dataset and briefing request.

### 4.5 Machine Score

Full spec: `Machine_Score_Draft.md`. Summary:
- 0–100, **higher is better** = 100 × weighted actions against the hospital lobby's position ÷ all weighted scored actions. 100 = fully independent of the lobby.
- "The lobby's side" = the AHA's or FAH's own published position on that specific action. No published position, not scored.
- Weights: floor vote 3; committee vote, markup amendment, sponsorship 2; cosponsorship, letter, public statement 1. Last six years full weight, older half.
- Minimum 5 scored actions, else "Insufficient record."
- Bands: 80–100 Reformer · 60–79 Independent · 40–59 Mixed · 20–39 Reliable ally of the lobby · 0–19 The Machine. Show the band label large and the number beside it.
- Every scored action is listed on the member's entry with links to the action **and** the lobby document. The full action list is downloadable.

## 5. Data model

One shared database for every page. Content is data files in the repo (JSON/CSV), validated at build time; pages never hard-code figures.

| Object | Key fields |
|---|---|
| **State** | code, name, grade, driver grades + weights, money-band figures, CON status, session calendar, officials |
| **Institution** | slug, name, type (system, hospital, lobby group, PAC), EINs, CCNs, HQ, states, parent, key figures, ledger lines, offshore entities, executives |
| **Person** | slug, name, role(s), party, state/district, committees, Machine Score, scored actions, hospital money |
| **Committee** | slug, chamber, name, jurisdiction items, chair, ranking member, members by Congress, departures, docket |
| **Mechanism** (cost driver) | slug, number, title, big number, status, brief, PDF, dataset product |
| **Action** | id, type (vote, bill, letter, statement), date, person, mechanism, lobby position source URL, member's side, weight |
| **Ledger line** | institution, group, name, who pays, amount, basis (reported/estimated/pending), source citation, fiscal year |
| **Article** | slug, title, date, desk, tags → any of the objects above |

Every numeric field carries `value`, `basis`, `source`, `as_of`.

## 6. Data sources and refresh

All public. Refresh automatically by API or scheduled download from day one; Dutch hand-checks about 1 in 20–30 figures.

| Source | Feeds |
|---|---|
| IRS Form 990 e-file XML (Schedules H, J, F, R; Part X) | charity care, community benefit, bad debt, Medicare shortfall, executive pay, offshore entities, foreign investments, tax-exempt bonds |
| Audited financial statements (EMMA, system sites) | cash and investments, net assets, debt, operating results |
| CMS hospital cost reports (summary CSV and full HCRIS) | DSH, IME, direct GME, Medicare bad debt, cost of charity care, property base |
| CMS IPPS DSH supplemental file | Medicare uncompensated care payments |
| HRSA 340B OPAIS export | registrations, child sites, contract pharmacies |
| Medicaid DSH audits; state-directed payment and provider tax reports | state Medicaid financing lines |
| Lincoln Institute 50-State Property Tax Study | property tax exemption estimates |
| FEC and state campaign filings | hospital money |
| Congress.gov, Senate and House roll calls, AHA/FAH letters | Machine Score actions |
| State legislatures, statutes, boards of elections | state bills, CON law, officials |

Existing research lives in `phycap-work/research/` (system and state dossiers, 990 extracts, cost reports, CMS files). Use the data; do not reuse client-portal presentation.

## 7. Payments (Stripe)

Use **Stripe Payment Links** (no backend needed on a static Netlify site).

| Product | Type | Price |
|---|---|---|
| Support: Reader | recurring monthly | $10 |
| Support: Patron | recurring monthly | $25 |
| Support: Founder | recurring monthly | $100 |
| Support: One time | one-time, customer chooses amount | any |
| POH data, per state | one-time | $300 |
| POH data, all access | recurring yearly | $3,500 |
| System, state and committee datasets | one-time / yearly | **[PRICE: Dutch to set]** |
| Builders Table | application form, not checkout | $25,000/yr |

Stripe product descriptions say "support" or "subscription," never "donation."

## 8. Build order

1. Design system tokens and shared components (section 3).
2. Data layer, schemas and validation (section 5); load NC and CommonSpirit from research data.
3. Home page.
4. Health system profile template → CommonSpirit, then the 78-system set.
5. State dossier template → NC, MA, PA, NY, TN.
6. Committee dossier template → Senate Finance, then HELP, Ways and Means, Energy and Commerce.
7. Methodology pages (subsidy ledger, state grade, Machine Score).
8. Search index, PDFs per page, Stripe links, Support page.
9. Fold in subdomains and set redirects.

## 9. Done means

- Every page matches its mockup at desktop and works at phone width.
- Every number on every page links to its source, carries reported/estimated/pending, and has an "as of" date.
- Build fails if a page renders a figure without a source.
- Lighthouse accessibility ≥ 95; text contrast passes 4.5:1.
- Stripe links work end to end in test mode.
- No use of "donate" or "donation" anywhere in the site or Stripe.

## 10. Open items for Dutch

- Dataset prices (system, state, all-access, committee).
- Rubrics for price transparency and Stark/AKS driver grades.
- Machine Score decisions (see the draft): band names, lookback, start date.
- Portraits for committee chairs and cover stories.
- CommonSpirit's remaining ledger lines (see `research/DOWNLOAD_LIST_COMMONSPIRIT.md`).
