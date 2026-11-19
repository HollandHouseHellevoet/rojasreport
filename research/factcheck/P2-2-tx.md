# Fact-check log: Texas state dossier

- Date: 2026-11-19
- Packet: P2-2, packet 1 (Texas)
- Checker: fresh agent (independent fact-checker; no pipeline scripts were run, every sum was recomputed with the checker's own Python)
- Page data checked: `src/data/states/tx.json` (rendered from `research/states/editorial/tx.json` by `research/states/scripts/build_state.py`)
- Pipeline files read for rules only: `research/states/README.md`, `research/states/scripts/common.py`, `research/states/scripts/pull_hospitals.py`, `research/states/scripts/build_state.py`, `research/states/data/hospitals/tx.json` (for the 167 CCNs and the per-hospital county field)
- Source files checked (read only, under `research/dossiers/_sources`): `cms_cost_reports/CostReport_2023_Final.csv`, `cms_cost_reports/CostReport_2024_Final.csv`, `opais/OPA_CE_DAILY_PUBLIC.JSON`, `cms_ipps/impact/FY 2027 IPPS Impact File - Correction Notice.txt`, `cms_dsh/dsh_fy2027/FY 2027 FR IPPS Medicare DSH Supplemental File (Data).txt`, `state_rates/lincoln_50state_2025_2026-09-30.txt`; in the worktree `research/poh/poh_db_2026-03.json`, `research/states/sources/tx/*.htm` (sha256 sidecars all match), `research/states/sources/naag_find_my_ag_2026-11-19.txt`
- Live web checked: tcss.legis.texas.gov (HS chapter 327), capitol.texas.gov bill histories (HB 3265, HB 2747, HB 3708, HB 4422) and committee membership (C410), lrl.texas.gov session dates, gov.texas.gov/about, texasattorneygeneral.gov/about-office, ltgov.texas.gov/about, house.texas.gov/members/speaker, senate.texas.gov (committee 610 and member district 18), finance.senate.gov membership, waysandmeans.house.gov members, arrington.house.gov, doggett.house.gov, energycommerce.house.gov (January 14, 2025 subcommittee assignments post), ethics.state.tx.us/search/cf

## Method notes

- Cost reports: for each of the 167 CCNs, all rows from both files were sorted by fiscal year end; the latest row covering 360 days or more with net patient revenue above zero was taken; property (Land, Land Improvements, Buildings) fell back to the next earlier report with amounts when the chosen report listed none. One CCN (453321, Driscoll Children's Hospital Rio Grande Valley) has no row in either file, leaving 166. One CCN (453319) had no full-year report with revenue and the latest row was used, as the README says.
- OPAIS: participating registrations with no parent, entity type DSH, CAH, PED, RRC, SCH or CAN, 340B street address state TX (167 found). Child sites: participating registrations whose parent is one of the 167. Arrangements: contract pharmacies on the parent or a participating, in-force child, with begin date on or before September 29, 2026 and no termination on or before that date.
- Dual classification: cost-report "Rural Versus Urban" = R and impact-file "Section 401 Hospital" = Y; all 21 carry URGEO LURBAN or OURBAN.
- DSH: column 2 "Projected to Receive DSH in FY 2027" = YES, column 13 "Total Uncompensated Care Payment" summed.

## Figures

| # | Figure as it appears on the page | Source checked | Found | Verdict |
|---|---|---|---|---|
| 1 | Net income 6,540,725,516 ($6.5B) | CMS cost report CSVs 2023 and 2024, recomputed over 166 CCNs | 6,540,725,516 | PASS |
| 2 | Net patient revenue 50,838,858,818 ($50.8B) | same | 50,838,858,818 | PASS |
| 3 | Total assets 78,630,839,110 ($78.6B) | same | 78,630,839,110 | PASS |
| 4 | Charity care at cost 4,952,445,972 ($5.0B) | same | 4,952,445,972 | PASS |
| 5 | 118 of 166 made money; positive net income sum 7,052,119,075 | same | 118 of 166 with net income above zero; sum 7,052,119,075 | PASS |
| 6 | Fiscal years ending 2023 to 2025; 167 hospitals, 166 with cost reports | same plus OPAIS | fiscal year ends 2023, 2024, 2025; 167 registrations, 166 CCNs in the files | PASS |
| 7 | 2,939 contract pharmacy arrangements | OPAIS export of September 29, 2026, active rule | 2,939 | PASS |
| 8 | 1,011 arrangements with pharmacies outside Texas (34%) | same | 1,011; 1,011 / 2,939 = 34.4% | PASS |
| 9 | 2,377 child sites | same | 2,377 | PASS |
| 10 | Federal income tax 1,480,945,006 (21% of 7,052,119,075) | arithmetic | 0.21 x 7,052,119,075 = 1,480,945,005.75, rounds to 1,480,945,006 | PASS |
| 11 | Property tax 729,074,640 on 35,143,113,048 (Houston 2.028% Harris County, Fort Stockton 2.087% elsewhere) | cost-report property lines recomputed, county from the cost report | property at cost 35,143,113,048; tax 729,074,640 | PASS |
| 12 | Total exemptions 2,210,019,646 ($2.2B); note "Federal income $1.5B, property $729M" | arithmetic | 1,480,945,006 + 729,074,640 = 2,210,019,646 | PASS |
| 13 | Houston 2.028% (Appendix Table 3a) | Lincoln 50-State study text, Appendix Table 3a row "Texas Houston 2.028% 2,434 ... 2.028% 24,341 ... 2.028% 608,525" | 2.028% at $100,000, $1 million and $25 million | PASS |
| 14 | Fort Stockton 2.087% (Appendix Table 3c) | Lincoln Appendix Table 3c row "Texas Fort Stockton 2.087% 2,504 ... 2.087% 25,039 ... 2.087% 625,985" | 2.087% | PASS |
| 15 | 21 of 166 dual classification; named list (Ascension Providence through UTMB) | cost report R flag against impact file correction notice Section 401 = Y | 21, same 21 CCNs as the page's list (names differ only by file spelling) | PASS |
| 16 | 76 projected to draw Medicare DSH in fiscal 2027 | FY 2027 FR DSH supplemental data file, column 2 | 76 | PASS |
| 17 | Uncompensated care payment 1,116,374,226 ($1.1 billion) | same, column 13 | 1,116,374,225.96 | PASS |
| 18 | 11 physician-owned hospitals operating, of 55 listed; 16 joint ventures, 13 closed, 13 sold | research/poh/poh_db_2026-03.json, state TX | 55 listed; Operating 11, Joint Venture 16, Closed 13, Sold/Acquired 13, Under Development 1, Unknown 1 | PASS |
| 19 | HS 327.0015: $10 million gross revenue threshold, SB 331, effective June 20, 2025 | tcss.legis.texas.gov HS.327 (live) | "This chapter applies only to a facility with a total gross revenue of $10 million or more." Added by Acts 2025, 89th Leg., R.S., Ch. 1131 (S.B. 331), Sec. 2, eff. June 20, 2025 | PASS |
| 20 | HS 327.008(c): $100 per violation at $10M to $100M, $1,000 per day above $100M, SB 331 section 3 | same | (c)(1) $100 for each violation at $10,000,000 or more and less than $100,000,000; (c)(2) $1,000 for each day at $100,000,000 or more; amended by Acts 2025, Ch. 1131 (S.B. 331), Sec. 3, eff. June 20, 2025 | PASS |
| 21 | HS 327.002 added by SB 1137, Acts 2021 ch. 1044, effective September 1, 2021 | same | Added by Acts 2021, 87th Leg., R.S., Ch. 1044 (S.B. 1137), Sec. 1, eff. September 1, 2021 | PASS |
| 22 | HB 3265: cleared House Insurance 5 to 2 on April 24, 2025; died in Calendars | capitol.texas.gov history (live) | Referred to Insurance 03/20/2025; reported favorably as substituted 04/24/2025; committee vote Ayes 5, Nays 2, PNV 0, Absent 2; last action 05/05/2025 "Committee report sent to Calendars" | PASS |
| 23 | HB 2747: filed February 12, 2025; reported favorably as substituted April 28, 2025, 8 to 4; committee report sent to Calendars May 10, 2025 | same | Filed 02/12/2025; reported favorably as substituted 04/28/2025; Ayes 8, Nays 4, PNV 0, Absent 1; last action 05/10/2025 "Committee report sent to Calendars" | PASS |
| 24 | HB 3708: cleared House Public Health 7 to 4 on May 1, 2025; died | same | Referred to Public Health 03/26/2025; reported favorably as substituted 05/01/2025; Ayes 7, Nays 4, PNV 0, Absent 2; last action 05/09/2025 "Committee report sent to Calendars" | PASS |
| 25 | HB 4422: referred to House Insurance April 2, 2025 and never heard | same | Filed 03/11/2025; read first time and referred to Insurance 04/02/2025; no later action | PASS |
| 26 | 89th Legislature adjourned June 2, 2025; 90th convenes January 12, 2027 | lrl.texas.gov session dates (live) | 89th R.S. convened Jan 14, 2025, adjourned sine die Jun 2, 2025; 90th R.S. convenes Jan 12, 2027 | PASS |
| 27 | Greg Abbott, Governor (R), first elected 2014, third term | gov.texas.gov/about (live) | "first elected as the 48th Governor of Texas in 2014"; "Re-elected to a third term in 2022" | PASS |
| 28 | Ken Paxton, Attorney General (R), sworn in January 2015, third term | texasattorneygeneral.gov/about-office (live, curl); NAAG roster saved 2026-11-19 | "elected on November 4, 2014, and sworn into office on January 5, 2015 ... re-elected to a second term in 2018 and a third term in 2022"; NAAG: Texas, Ken Paxton | PASS |
| 29 | Dan Patrick, Lieutenant Governor and President of the Senate (R), first elected 2014 | ltgov.texas.gov/about (live) | "first elected Lt. Governor of Texas in 2014", re-elected 2018 and 2022 | PASS |
| 30 | Dustin Burrows, Speaker (R), District 83, since January 2025 | house.texas.gov/members/speaker (live) | House District 83; "elected by his colleagues as the 77th Speaker of the Texas House in January 2025" | PASS |
| 31 | Lois W. Kolkhorst, Chair, Senate Health and Human Services (R), District 18 | senate.texas.gov committee 610 and member.php?d=18 (live) | "CHAIR: Lois Kolkhorst"; District 18 page lists "Health and Human Services, Chair" | PASS |
| 32 | Gary VanDeaver, Chair, House Public Health (R), District 1 | capitol.texas.gov committee membership C410, 89th Legislature (live) | Chair: Rep. Gary VanDeaver; Vice Chair: Rep. Liz Campos (page shown for the 89th second called session); district number not shown on that page | PASS (district 1 not shown on the page reached) |
| 33 | Sen. John Cornyn, Senate Finance | finance.senate.gov membership (live) | John Cornyn, R, Texas, listed in the majority | PASS |
| 34 | Rep. Jodey Arrington, Ways and Means (TX-19) | waysandmeans.house.gov members; arrington.house.gov (live) | "Jodey Arrington (TX)" under majority members; site: "Representing West Texas District 19" | PASS |
| 35 | Rep. Lloyd Doggett, Ways and Means (TX-37) | waysandmeans.house.gov members; doggett.house.gov (live) | "Lloyd Doggett (TX)" under minority members; site: TX37, Ranking Member of the Health Subcommittee on Ways and Means | PASS |
| 36 | Rep. Dan Crenshaw, Energy and Commerce (TX-2) | energycommerce.house.gov post of January 14, 2025 (live) | "Rep. Dan Crenshaw (TX-02)" on the Health, Environment (Vice Chairman) and Oversight and Investigations subcommittees; the committee's membership page itself returned 404 | PASS |
| 37 | HOSPAC $52,500 in 2025; $129,500 January 1 to August 25, 2026 | Texas Ethics Commission campaign finance search | NOT CHECKED: ethics.state.tx.us/search/cf offers only form-driven Simple and Advanced searches (no filer-ID URL); the bulk export is a large download that was not authorized; a web search returned only the separate federal HOSPAC committee at the FEC | REVIEW |
| 38 | "23 of 30 state senators and 67 of 150 House members have a 340B hospital in their district" | Census geocoder and TIGERweb per the page's source line | NOT CHECKED: derived figure outside this packet's list; would need re-geocoding 167 addresses | REVIEW |

Counts: PASS 36, FAIL 0, REVIEW 2 (both not checked, neither contradicted).

## FAIL and REVIEW items

No FAIL.

REVIEW 1 (not checked). Page text (whoDecides.pac.text): "The Texas Hospital Association's PAC, HOSPAC, reported $52,500 in political contributions in 2025 and $129,500 from January 1 to August 25, 2026." Source given on the page: Texas Ethics Commission, filer ID 00015794, 13 contributions in 2025 and 49 from January 1 to August 25, 2026. What the checker found: the TEC search page reachable here is a form-driven application with no per-filer URL, so the filings could not be opened by fetch; nothing found contradicts the figures. The federal HOSPAC committee (FEC C00301325) is a different filer and was not used.

REVIEW 2 (not checked). Page text (whoDecides.groups[1].note): "23 of 30 state senators and 67 of 150 House members have a 340B hospital in their district." Not in the packet's required list; the geocoding was not repeated.

## Copy observations

Words "doctor", "provider", "should", "Substack" and em dashes in reader-facing text: none found. The word "Provider" appears only inside source lines as part of the CMS file title "Hospital Provider Cost Report" (money items, systems rows, hospitals table source); that is a proper name of the CMS dataset, not a reader-facing use.

Sentences over 25 words in reader-facing text:

1. drivers[5].body (Stark & Anti-Kickback), 26 words: "Occupations Code 102.001 makes it a crime to pay or accept anything of value for referring a patient to a licensed health care practitioner or facility."
2. agOversight.items[1].body (Charitable assets), 27 words: "Business Organizations Code 12.151 to 12.156 let the office examine any Texas entity's books and management; refusal forfeits the right to do business and is a misdemeanor."
3. sourcesLine, 63 words (a sources list, one sentence): "Sources: CMS hospital cost reports (2023 and 2024 files, latest report per hospital), HRSA 340B OPAIS export of September 29, 2026, Texas Health and Safety, Tax, Property, Business Organizations and Occupations Codes, Texas Legislature Online, Texas Ethics Commission, CMS FY2027 IPPS impact and Medicare DSH supplemental files, Lincoln Institute 50-State Property Tax Comparison Study (April 2026), the Alliance physician-owned hospital database (March 2026)."

Other notes, no verdict change:

- Driver V names "Memorial Hermann Texas Medical Center, Parkland, Baylor University Medical Center and UTMB" among the 21; all four are in the recomputed list.
- The page's property-tax note says "Houston 2.028% for hospitals in Harris County"; the recomputation used the cost report's County field, which is what the build does; 35,143,113,048 and 729,074,640 both match.
- The committee membership page reached for House Public Health (C410) is labeled for the 89th Legislature second called session; the chair matches.

## After the check (builder, 2026-11-19)

Seven sentences of 25 words or more in the editorial file were split or shortened (verdict, drivers IV and VI, the HB 3708 row, and the attorney general items on the charity care standard and charitable assets). No figure changed. `build_state.py TX` re-run; `npm run build` passes. REVIEW 1 (HOSPAC) and REVIEW 2 (district counts) stand on the October 1, 2026 research record cited in the page source lines.
