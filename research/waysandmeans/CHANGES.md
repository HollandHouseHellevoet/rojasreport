# Ways & Means desk: what changed since the old site

Refreshed November 8 and 9, 2026 against primary records for the 119th Congress. Every figure below sits in `data/*.json` with its source URL, source label, as-of date and a status (VERIFIED, CHANGED or NOT FOUND). Old-site values come from the clone of `HollandHouseHellevoet/Waysandmeans` (branch `claude/member-healthcare-profiles-S1Km4`, commit `939a215`).

## Status counts

| Status | Facts | What is in the count |
|---|---|---|
| VERIFIED | 1,189 | 45 roster rows (party, district, bioguide, roles, Health Subcommittee flag, first term), 13 key roll calls x 45 positions, 89 bills, 63 hearings and markups, 20 lobbying clients x 2 years, 45 election outcomes, House control, two expected leaders, disclosure counts, committee totals |
| CHANGED | 77 | 6 full-committee or subcommittee roles, 17 Health Subcommittee flags, 2 first-term years, 45 member money totals (new basis), the $11.0M headline, 6 new subcommittee ranking-member roles the old site did not show |
| NOT FOUND | 136 | 45 bio paragraphs, 77 old-site stock trades, 11 pre-119th voted bills, 2 members' scanned disclosure filings, member-level lobbying contacts |

## 1. Roster: same 45 members, 16 not coming back

No member joined or left the committee between the old site's April 2026 data and the Clerk's November 3, 2026 member file. 45 members, 26 Republicans, 19 Democrats. Source: `clerk.house.gov/xml/lists/MemberData.xml` (published November 3, 2026).

The November 3, 2026 election changes the picture for the 120th Congress. Source for each row: `data/developments.json` (member release, state results page or wire call, opened November 8 and 9, 2026).

| Outcome | Members |
|---|---|
| Retired (5) | Vern Buchanan (announced January 27, 2026), Jodey Arrington (November 11, 2025), Lloyd Doggett (after Texas redrew TX-37), Danny Davis, Dwight Evans (release June 30, 2025) |
| Defeated in the general (4) | Brian Fitzpatrick (PA-01, to Bob Harvie), Mike Carey (OH-15, to Don Leonard), Max Miller (OH-07, to Brian Poindexter), Jimmy Gomez (CA-34, to fellow Democrat Angela Gonzales-Torres) |
| Lost a primary (1) | John Larson (CT-01, to Luke Bronin, August 11, 2026) |
| Won other office (2) | Kevin Hern (U.S. Senate, Oklahoma), Stacey Plaskett (Governor, U.S. Virgin Islands) |
| Lost a primary for other office (2) | David Schweikert (Arizona governor, July 21, 2026), Randy Feenstra (Iowa governor, June 2, 2026) |
| Not called as of November 9 (2) | Greg Murphy (NC-03, leading 49.4 to 49.3), Mike Thompson (CA-04, trailing Eric Jones 47.4 to 52.5 at 58 percent counted) |
| Re-elected (29) | Everyone else. Two ran in renumbered districts: Blake Moore in Utah's court-drawn 2nd, Linda Sánchez in California's Proposition 50 41st. |

House control: NBC News projects a Democratic House (252 to 162 with 21 uncalled on November 9, 2026). Expected 120th Congress leaders: Richard Neal as chairman (MassLive, November 4, 2026) and Jason Smith as ranking member (Bloomberg Tax, March 20, 2026, pre-election; no conference vote yet). Both are expectations, not organized facts, until January 2027.

## 2. Leadership and subcommittees: the old site had the Health chair wrong

| Point | Old site | Primary record now | Status |
|---|---|---|---|
| Chair | Jason Smith | Jason Smith | VERIFIED |
| Ranking member | Richard Neal | Richard Neal | VERIFIED |
| Vice chair | Vern Buchanan | None listed. The committee's membership page shows only a Chairman and a Ranking Member. | CHANGED |
| Health Subcommittee chair | Adrian Smith | Vern Buchanan (Clerk file, `WM02 leadership="Chair"`) | CHANGED |
| Trade Subcommittee chair | not shown | Adrian Smith | CHANGED (new) |
| Tax, Oversight, Work & Welfare, Social Security chairs | not shown | Mike Kelly, David Schweikert, Darin LaHood, Ron Estes | CHANGED (new) |
| Health Subcommittee ranking member | Lloyd Doggett | Lloyd Doggett | VERIFIED |
| Other ranking members | not shown | Trade: Linda Sánchez. Tax: Mike Thompson. Oversight: Terri Sewell. Social Security: John Larson. Work & Welfare: Danny Davis. Vice ranking member: Gwen Moore. | CHANGED (new) |

Sources: Clerk XML for chairs; `waysandmeans.house.gov/members/` and `/subcommittees/`; Ranking Member Neal's January 8, 2025 release for Democratic assignments.

Health Subcommittee membership. The old site flagged 19 members; the Clerk's file also lists 19, but 17 flags were wrong. Not on the subcommittee despite the old flag: Schweikert, LaHood, Estes, Smucker, Van Duyne, Malliotakis, Sewell, DelBene, Schneider. On the subcommittee but not flagged: Kelly, Hern, Kustoff, Steube, Tenney, Sánchez, Chu, Boyle. The 19 members: Buchanan (chair), Adrian Smith, Kelly, Murphy, Hern, Carol Miller, Fitzpatrick, Tenney, Blake Moore, Kustoff, Steube; Doggett (ranking), Thompson, Chu, Evans, Davis, Horsford, Boyle, Sánchez.

First House term. 43 of 45 match the old site. Congress.gov gives Brad Schneider's first term as 2013 (old site 2017) and Steven Horsford's as 2013 (old site 2019); both served earlier terms, lost, and returned. Source: Congress.gov API member list, 119th Congress, retrieved November 9, 2026.

## 3. Money: new basis, new cycle

The old headline, "$11.0M Healthcare Money, 2024 cycle contributions" ($10,996,000 summed), was labelled "FEC filings via OpenSecrets". It mixed PAC and individual money, drew on a fixed list of 44 organizations, and carried no filing references. It cannot be reproduced. Every member's money figure is therefore CHANGED, with the FEC figure beside the old one in `data/money.json`.

New basis: PAC contributions (FEC transaction type 24K) to each member's House campaign committee from PACs classified as healthcare by name and connected organization. FEC bulk files `pas2`, `cm`, `cn`, `ccl`, retrieved November 8, 2026. Individual contributions are not included. Sector labels are the Rojas Report's own (rules in `scripts/fec_health_pacs.py`).

| Figure | Value | As of |
|---|---|---|
| 2026 cycle, all 45 members | $9,340,175 from 231 healthcare PACs | transactions through October 14, 2026 |
| 2024 cycle, all 45 members | $10,058,350 from 238 healthcare PACs | full cycle (through December 31, 2024) |
| Old site, "2024 cycle" | $10,996,000 | basis unknown |

Top recipients, 2026 cycle: Jason Smith $589,500; Greg Murphy $463,675; Terri Sewell $427,000; Brian Fitzpatrick $407,500; Suzan DelBene $399,750; Richard Neal $387,000. Danny Davis, who retired, took $0 from healthcare PACs this cycle.

Top healthcare PACs giving to the committee, 2026 cycle: American Hospital Association PAC $240,000; Elevance Health PAC $225,500; American Association of Orthopaedic Surgeons PAC $198,500; American Academy of Dermatology Association PAC $198,000; Pfizer PAC $161,000; National Emergency Medicine PAC $158,500; Humana PAC $157,000; UnitedHealth Group PAC $155,500.

Each contribution row in `data/money.json` links to the FEC filing image by image number.

## 4. Votes: 11 old bills replaced by 13 roll calls from this Congress

The old site scored 11 bills from the 116th to 118th Congresses and recorded positions for members who were not yet in office. Those 11 are marked NOT FOUND (pre-119th, not re-verified) and replaced. Every 2025 and 2026 House roll call was downloaded from the Clerk (362 in 2025, 314 in 2026 through November 8); 58 match health terms and 13 are marked key votes. Committee tallies below are the 45 members' positions.

| Date | Roll | Measure | Result | W&M Yea / Nay |
|---|---|---|---|---|
| 2025-03-11 | 70 | H.R. 1968, full-year CR with Medicare telehealth extenders, passage | Passed | 26 / 18 |
| 2025-05-22 | 145 | H.R. 1, One Big Beautiful Bill Act, House passage | Passed | 25 / 18 (1 not voting) |
| 2025-06-04 | 151 | H.R. 2483, SUPPORT for Patients and Communities Reauthorization Act | Passed | 42 / 2 |
| 2025-07-03 | 190 | H.R. 1, concur in Senate amendment (Public Law 119-21) | Passed | 25 / 19 |
| 2025-09-19 | 281 | H.R. 5371, Continuing Appropriations and Extensions Act, 2026, passage | Passed | 26 / 18 |
| 2025-11-12 | 285 | H.R. 5371, concur, ends the shutdown (Public Law 119-37) | Passed | 26 / 18 |
| 2025-12-17 | 349 | H.R. 6703, Lower Health Care Premiums for All Americans Act | Passed | 25 / 18 (1 not voting) |
| 2025-12-18 | 362 | H.R. 498, Do No Harm in Medicaid Act | Passed | 24 / 17 (3 not voting) |
| 2026-01-22 | 45 | H.R. 7148, Consolidated Appropriations Act, 2026, passage | Passed | 36 / 8 |
| 2026-02-03 | 53 | H.R. 7148, concur (Public Law 119-75) | Passed | 25 / 19 |
| 2026-04-21 | 128 | H.R. 2493, Improving Care in Rural America Reauthorization Act | Passed | 44 / 0 |
| 2026-07-21 | 272 | H.R. 9770, continuing appropriations for FY2027, passage | Passed | 26 / 18 |
| 2026-09-01 | 286 | H.R. 6500 as the vehicle for the Continuing Appropriations and Extensions Act, 2027 (Public Law 119-103) | Passed | 38 / 5 (1 not voting) |

Source for each: `clerk.house.gov/evs/<year>/roll<NNN>.xml`. No House roll call in 2025 or 2026 extended the enhanced ACA premium tax credits; the only premium-credit vote was H.R. 6703.

## 5. Bills: 89 tracked, 32 health-related, 14 enacted

Bills come from the committee's 119th Congress markup notices plus the health bills with floor votes. Source: GPO govinfo bill status XML, retrieved November 9, 2026. H.R. 247 (Health Care Affordability Act of 2025), the one 119th bill on the old site, is still where it was: referred to Ways and Means on January 9, 2025 (VERIFIED).

Enacted health vehicles: H.R. 1968 (Public Law 119-4), H.R. 1 (119-21), H.R. 5371 (119-37), H.R. 2483 (119-44), H.R. 7148 (119-75), H.R. 6500 (119-103). Health bills reported from committee but not yet law include H.R. 4313 Hospital Inpatient Services Modernization Act (passed House, in Senate since December 2, 2025), H.R. 9504 Tax Exempt Hospital Transparency Act (ordered reported July 1, 2026), H.R. 9644 Medicare Advantage MLR Transparency Act and H.R. 9645 Health Care Price Certainty for All Americans Act (ordered reported July 15, 2026), and H.R. 8163 Provider Reimbursement Stability Act of 2026 (ordered reported May 21, 2026).

## 6. Hearings and markups: new to the desk

The old site had none. The committee's own listings give 48 hearings and 15 markups in the 119th Congress through October 6, 2026; 18 are health-related and 8 are Health Subcommittee hearings. Source: `waysandmeans.house.gov/hearings/` and `/markups/`, retrieved November 8, 2026. Notable: Health Insurance CEOs (January 22, 2026), Health System CEOs (April 28, 2026), HHS Secretary Kennedy (April 16, 2026), Medicare fraud (April 21, 2026), tax-exempt hospitals' spending (Oversight, September 16, 2025), Medicare Advantage (joint Health and Oversight, July 22, 2025).

## 7. Lobbying: committee-level only

LD-2 quarterly reports name the chambers and agencies contacted, never individual members. Member-level lobbying contacts are NOT FOUND in any primary record; the old site did not show them either. Twenty healthcare clients were pulled from the LDA API for 2025 and 2026 (2026 through the third quarter). Reported spend is the client's own LD-2 expenses plus income reported by its outside firms.

| Client | 2025 | 2026 (Q1 to Q3) |
|---|---|---|
| PhRMA | $44,020,000 | $31,245,000 |
| American Hospital Association | $27,080,000 | $15,440,000 |
| American Medical Association | $24,090,000 | $13,743,000 |
| PCMA | $15,169,242 | $7,895,738 |
| BIO | $7,422,500 | $8,092,500 |
| Blue Cross Blue Shield Association | $6,480,000 | $4,770,000 |
| American Health Care Association | $5,362,000 | $3,690,000 |
| Tenet Healthcare | $5,362,000 | $4,228,000 |
| HCA Healthcare | $4,920,000 | $3,830,000 |
| Federation of American Hospitals | $4,885,000 | $2,860,000 |

Source: `lda.gov/api/v1/filings/`, retrieved November 8 and 9, 2026. The other ten clients and every filing ID are in `data/lobbying.json`.

## 8. Stock trades: the old data is not supported by the Clerk's filings

The old site listed 77 healthcare trades for 28 members from Capitol Trades pages. Checked against the Clerk of the House disclosure indexes for 2023 to 2026 and the periodic transaction reports they list:

- 0 of 77 could be verified.
- 46 are attributed to members who filed no periodic transaction report in the filing year the old site gives (18 for 2025 and 2026, 28 for 2023 and 2024).
- 6 are 2025 trades by members who did file, with no matching ticker and date in their reports.
- 25 are 2023 or 2024 rows for members who did file that year; those filings were not read in this pass.

New data: 156 periodic transaction reports filed by 18 members in 2025 and 2026 were downloaded and read. 150 have a text layer; 6 (Adrian Smith 3, Nicole Malliotakis 3) are scanned images and are NOT FOUND. 310 transactions were extracted, 53 in healthcare issuers. Kevin Hern accounts for 32 of the 53, mostly sales from August to September 2026 (Boston Scientific, IQVIA, Danaher, Medtronic, Novartis, Novo Nordisk, UnitedHealth). Lloyd Doggett reported seven Johnson & Johnson dividend reinvestments, each $1,001 to $15,000. Source for each row: the PTR PDF URL on `disclosures-clerk.house.gov`.

## 9. Not found

- Bio paragraphs for all 45 members: the old text is unsourced prose; `bioguide.congress.gov` blocks automated pulls. Replace with sourced facts (roles, first term, 2026 outcome).
- The 77 old-site trades and the 11 pre-119th voted bills, as above.
- Six scanned disclosure filings (Adrian Smith, Nicole Malliotakis).
- Member-level lobbying contacts: not disclosed anywhere.
- Member photos were not pulled (same Cloudflare block). Congress.gov's member list carries an image URL per member; it is saved in `raw/congress/`.

## 10. Housekeeping

- Old repo deploy branch: `claude/member-healthcare-profiles-S1Km4`; there is no `main`. A `redirect-to-rojasreport` branch holds the `_redirects` file for after the new desk is live.
- The redesign branch already carries a Ways and Means committee dossier (`src/data/committees/ways-and-means.json`, commit `ff09806`). Its hospital-only PAC figures and this pass's five-sector figures are built from the same FEC files on different definitions; reconcile when the desk is built.
