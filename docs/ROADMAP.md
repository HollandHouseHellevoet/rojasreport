# ROADMAP.md · rojasreport.com build map

Source: Site audit of November 13, 2026, plus docs/BUILD_BRIEF.md and docs/DECISIONS.md.
Owner: Dutch Rojas. Executor: Claude Code.
Place this file at `docs/ROADMAP.md`. Read it at the start of every session.

---

## 0. How to use this file

1. Read this file, then `docs/DECISIONS.md`, then `git log -10`.
2. Pick the **first packet in the current phase** whose status is `READY` and whose dependencies are `DONE`. Never start a `BLOCKED` packet.
3. One packet = one branch = one PR. Branch name: `wp/<packet-id>-<slug>` (example: `wp/Q3-source-check`).
4. Work to the packet's **Done when** list. Nothing else ships in that PR.
5. Run the fact-check gate (section 2) before opening the PR.
6. In the PR description: what changed, page count, figures added, figures with no source (must be zero), anything left for Dutch.
7. Update this file in the same PR: status, date, PR number. Add any new decision to `docs/DECISIONS.md`.
8. If a packet turns up a new gap, add it to section 10 (Intake). Do not expand the current packet.

Status values: `READY` · `IN PROGRESS` · `IN PR` · `DONE` · `BLOCKED (D-x)`.

---

## 1. Standing rules (apply on every page, every session)

**Data**
- Every published figure carries four fields: `value`, `basis`, `source`, `as_of`. No exceptions. After Q3 ships, the build enforces this.
- Websites and portals built for consulting clients are the client's work. Never copy their presentation, copy, or structure into the site. The underlying public data (990s, cost reports, HRSA, CMS, FEC, LDA) is always fair to use.
- Refresh paths are automated from day one. Every new data source gets a fetch script in the pipeline, not a hand-pasted file.
- Election-dependent facts (member status, races) update only on an AP call or an official canvass. Never on unofficial returns alone.

**Editorial (house style for all copy Claude Code writes)**
- "Physician." Never "doctor" or "provider." (Dutch, 2026-11-14)
- No "should." No em dashes.
- Free-market lens. The critique lands on consolidation, monopoly, subsidy, and rule capture. Never on profit, investment, or business as such.
- "340B" always means the Section 340B drug pricing program. Write "the 340B program" where a reader could misread it as a dollar figure. Coverage points at the hospital-side spread, not at drugmakers.
- Bans on physicians (Section 6001): show where the money moved. Never imply the ban solved anything.
- A reduction in projected growth is not a "cut."
- Charity care is counted as a subsidy.
- Never state publicly that any person or institution is excluded from membership or purchase.
- Do not mention any other business tied to Dutch Rojas: MedMerge, Cornerstone Indemnity, PhyCap Fund, DrCaptives, the Alliance, or any other. Rojas Media appears only as the publisher. (Dutch, 2026-11-14)

**Build**
- Next.js SSG on Netlify. Structure first, visual design later. Reuse live templates before building new ones.
- Lighthouse accessibility 95+ on every template (enforced after Q8).
- Pages pass at 375px width with no horizontal page scroll. Wide tables scroll inside their own container.

---

## 2. Fact-check gate (every PR that adds figures or claims)

1. Build passes the source check (Q3).
2. A fresh agent with no context from the build session re-derives a random sample of figures from the cited source. Sample: at least 10 figures or 10 percent, whichever is larger. Log results in `research/factcheck/<packet-id>.md`.
3. Any mismatch blocks the PR until fixed and re-sampled.
4. Flag 1 in 20 to 30 figures for Dutch's hand check, listed at the top of the PR description.

---

## 3. Decisions register (Dutch only)

Packets that depend on these stay `BLOCKED` until the answer is logged in `docs/DECISIONS.md`.

| ID | Decision | Unblocks | Status |
|---|---|---|---|
| D-1 | Machine Score rubric: band names, lookback window, start date (per `docs/MACHINE_SCORE_DRAFT.md`). Scale already set: 100 = fully independent of the hospital lobby. | P1-3, P3-x scorecards | OPEN |
| D-2 | Driver grade rubrics for price transparency and Stark/AKS | P1-1 grades, state grades leave "provisional" | OPEN |
| D-3 | Stripe Payment Links: Reader $10, Patron $25, Founder $100, one-time | M-1 | OPEN |
| D-4 | Dataset prices: system, state, committee datasets | M-2 | OPEN |
| D-5 | OK to add conlaws DNS redirect record | Q1 | DECIDED 2026-11-14: yes (alias and DNS record added that day) |
| D-6 | State order: MA, PA, NY, TN (brief) or Texas first | P2-2 | OPEN |
| D-7 | "Sign in" in the utility bar: drop it, or keep for paid tiers | Q9 | OPEN |
| D-8 | Go-ahead to open /builders-table application | M-3 | OPEN |
| D-9 | Canonical list of the top 100 health systems (which list, which metric, which year) | P2-1 batches past the 84 on hand | OPEN |
| D-10 | CON count | Q2 | DECIDED 2026-11-13: 35 jurisdictions (34 states and D.C.) |
| D-11 | conlaws redirect target: every path to `/con/` (Q1 as written) or keep each path (old CON routes still live here); see Intake | Q1 | DECIDED 2026-11-14: Dutch left it to Claude Code. Keep each path; only the front page goes to `/con/` (PR 8) |
| D-12 | PhyCap Fund on the home page "Build" row: remove now under the standing rule; see Intake | Q10 | DECIDED 2026-11-14: remove every business tied to Dutch Rojas, not just PhyCap Fund (Q10, PR 10) |

---

## 4. Phase 0 · This week · Quick fixes

| ID | Task | Done when | Depends | Status |
|---|---|---|---|---|
| Q0 | Merge PR 7 (physician-owned hospitals, 176 hospitals, 30 states). Switch on POH redirects. | PR 7 merged; every old poh URL 301s to its new path; redirect map in `docs/redirects.md` | none | IN PR (PR 7). Redirects ready on `RojasReportIntelligence` branch `claude/poh-redirect` |
| Q1 | conlaws.rojasreport.com redirect | DNS record added in Netlify; the conlaws front page 301s to `/con/` and every other old path 301s to the same path here (D-11); spot-check 10 old links | D-5 | IN PR (PR 8). Alias and DNS record live 2026-11-14 (wildcard cert covers it). Path-preserving per D-11 |
| Q2 | CON count reconciliation | All copy says 35 jurisdictions (34 states and D.C.). Grep the repo for "36" near CON terms, including section index tables and llms.txt. Reconcile with the "36 states have CON pages" figure: document which pages cover states with no current CON law (repeal history) and label them that way. Confirm D.C. status: it has CON but appears on the "no page" list. | PR 8 | IN PR (PR 8), partial. D.C. has a page (`data/states/washington-dc.json`); the audit's no-page list wrongly included it. Labelling still to do |
| Q3 | Build-time source check | Build step fails on any figure missing `value`, `basis`, `source`, or `as_of`. Run once in report mode first, fix every violation, then switch to fail mode. | none | IN PR (PR 8), partial. Covers figures in the brief's format (99 today, all pass); desk data with its own source fields not yet covered (Intake) |
| Q4 | AHA pages at 375px | Main AHA page has zero horizontal overflow at 375px; power map table scrolls inside its own container | wait for the other session's AHA commits | IN PR (PR 8). Fixed on its own branch; the other session's edits are untouched |
| Q5 | Mike Thompson (CA-04) status | Member page and committee page reflect the AP call, with date. Until the call, page reads "not called" with the as-of date. | AP call | WAITING (not called as of 2026-11-13) |
| Q6 | Greg Murphy (NC-03) status | Status confirmed against the official canvass; member and committee pages updated with as-of date | canvass result | WAITING (pages show his November 11 concession on unofficial returns) |
| Q7 | Retire old subdomain projects | Calendar note in `docs/redirects.md`: retire each Netlify/GitHub Pages project 30 to 60 days after its redirect goes live (waysandmeans, poh, fah). Dutch does the retirement. | Q0 | READY |
| Q8 | Lighthouse accessibility | Lighthouse run on every template; each scores 95+; results in `docs/lighthouse.md`; add to CI if feasible | none | IN PROGRESS. 13 templates run on the PR 8 branch: 10 at 100, 3 at 96. `docs/lighthouse.md` and CI still to do |
| Q9 | "Sign in" in utility bar | Brief and site match D-7 | D-7 | BLOCKED (D-7) |
| Q10 | Remove businesses tied to Dutch Rojas | Built site has zero mentions of MedMerge, Cornerstone Indemnity, PhyCap Fund, DrCaptives or the Alliance; home "Build" section and NC "Practicing here?" links gone | D-12 | IN PR (PR 10) |
| Q11 | "Physician" in site copy | Built site uses "doctor" only inside proper names and source URLs | none | IN PR (PR 11) |

---

## 5. Phase 1 · Weeks 1 to 2 · Every home card leads somewhere

### P1-1 · Five cost-driver briefs
- **Inputs:** POH investigation and evidence (Section 6001); Alliance evidence banks in `research/tafhc-site` (site-neutral, 340B program); CMS 2026 rules in `fights.json`.
- **Client rule:** `research/tafhc-site` is evidence only. Use the public sources it cites. Never reuse its presentation or copy.
- **Steps:**
  1. Build one fight-page template. Sections: the mechanism, who benefits, the dollars, where the money moved, the state picture, current fight (rules, bills, dockets), sources.
  2. One brief per driver, in this order: Section 6001 (evidence already in hand), hospital subsidies (340B program, DSH, GME, charity care, tax exemption), price transparency, CMS favoritism, Stark and Anti-Kickback.
  3. Replace both "figure pending" home cards with sourced figures.
- **Done when:** six home cards all resolve to live pages; zero "figure pending"; fact-check gate passed per brief.
- **Note:** price transparency and Stark/AKS briefs ship without letter grades until D-2.
- **Size:** 2 sessions. **Status:** READY

### P1-2 · Lobby: Hospital PACs (pulled forward)
- **Why now:** FEC bulk files already in hand and the AHA/FAH desks are the template. Cheap win that feeds the Machine Score.
- **Done when:** PAC desk live with receipts and disbursements by cycle, linked to committee member pages where recipients overlap.
- **Size:** 1 session. **Status:** READY

### P1-3 · Machine Score on Ways and Means
- **Inputs:** `docs/MACHINE_SCORE_DRAFT.md`; 13 Ways and Means roll calls; AHA and FAH positions from the lobby desks; PAC data from P1-2.
- **Done when:** every Ways and Means member has a score, a band, and a "how this was scored" link listing each vote and position used; committee scorecard shows no "pending."
- **Depends:** D-1, P1-2. **Size:** 2 sessions. **Status:** BLOCKED (D-1)

---

## 6. Phase 2 · Weeks 3 to 6 · Systems and states at volume

### P2-1 · Health systems, batches of ten
- **Inputs:** 84 dossiers in `research/dossiers` (public 990, cost report, HRSA). CommonSpirit template.
- **Client rule:** the client portal's presentation stays out. Public data only.
- **Subsidy order on every profile:** 340B program, GME, DSH, charity care, tax exemption, then the rest.
- **Steps per batch:** build 10 profiles on the CommonSpirit template, attach Schedule J executive pay, attach hospital child pages from cost reports, run the fact-check gate on the batch.
- **First:** finish CommonSpirit's ledger (11 of 19 lines). Blocked on the remaining lines in `research/DOWNLOAD_LIST_COMMONSPIRIT.md` (M-5).
- **Past 84:** 16 systems need research first, against the canonical list (D-9).
- **Done when (per batch):** 10 live profiles, each with executive pay and hospital child pages; batch fact-check log filed.
- **Size:** about 1 session per batch, 10+ total. **Status:** READY (batches 1 to 8), BLOCKED (D-9) after that

### P2-2 · State dossiers
- **Inputs:** NC template; 36 jurisdictions with CON pages (35 states and D.C.); 15 states with no page (AZ, CA, CO, ID, IN, KS, NH, NM, OH, PA, SC, SD, TX, UT, WY).
- **Order:** per D-6. Default if no answer: MA, PA, NY, TN, then TX, then the remaining no-page states.
- **Before state two:** build a state data pipeline that pulls every dossier field for all 51 at once (CON status, AG and governor, tax-exempt systems in state, DSH and GME, provider tax, POH and ASC counts, private-practice counts over time). The dossier page then becomes a render, not a research job. See section 9.
- **Includes:** AG oversight section (P4-3) built into the template from the first new state, not retrofitted later.
- **Done when (per state):** dossier live with letter grade (marked provisional until D-2), every figure sourced, linked to its systems and CON page.
- **Size:** 1 session per state today; target 3 to 5 states per session once the pipeline exists. **Status:** BLOCKED (D-6) for order; pipeline work READY

---

## 7. Phases 3 and 4 · Weeks 6 and after

| ID | Desk | Inputs | Plan | Size | Depends |
|---|---|---|---|---|---|
| P3-1 | Energy and Commerce | Ways and Means pipeline (Clerk roster, FEC, roll calls, PTRs) | Research pass, committee page, member pages, Machine Score | 2 | D-1 |
| P3-2 | Senate HELP | Senate Finance template | Same as P3-1 using Senate sources | 2 | D-1 |
| P3-3 | Lobbying firms | LDA pipeline (shipped Oct 9) | Firm pages, clients, issues, revolving door | 1 | none |
| P3-4 | State hospital associations | LDA, state filings, 990s | Desk on the AHA pattern | 1 | none |
| P3-5 | AHIP and BCBSA | LDA, FEC, 990s | Desk on the AHA pattern | 1 | none |
| P3-6 | Ambulatory surgery centers | CMS ASC files, POH ownership data, CON rankings | State-by-state directory: physician-owned share, CON treatment | 2 | P2-2 pipeline helps |
| P4-1 | Carriers | SEC 10-Ks, CMS MA enrollment, state filings | Carrier template, then UnitedHealth and its Optum arms first; then PBMs; then physician employment by carriers | 3+ | none |
| P4-2 | MedPAC, MACPAC, then CMS, HHS, HRSA | HAC desk template, public rosters | Rosters, reports, recommendations; leadership pages | 1 per body | none |
| P4-3 | AG oversight of nonprofit systems | State AG statutes and actions | Section of state template (see P2-2), then a 50-state table | 2 | P2-2 |
| P4-4 | Independent groups (Physician-Owned) | to be scoped | Scope in its own session before build | TBD | none |

---

## 8. Money and media (Dutch supplies, Claude Code wires)

| ID | Item | Where | Claude Code task once supplied | Depends |
|---|---|---|---|---|
| M-1 | Stripe Payment Links | Support page, home band | Replace "Checkout opens soon" with live links; test each in Stripe test mode first | D-3 |
| M-2 | Dataset prices | Reports page | Turn on the three datasets with prices and delivery path | D-4 |
| M-3 | Builders Table | Home card, /builders-table | Open the application form | D-8 |
| M-4 | Portraits and cover art | Committee chairs, weekly cover | Drop in images; remove every "Portrait pending" | Dutch's images |
| M-5 | CommonSpirit ledger lines | CommonSpirit profile | Fill the remaining 8 lines from `research/DOWNLOAD_LIST_COMMONSPIRIT.md` | Dutch's downloads |

---

## 9. Capacity check

Sizes from the audit, in working sessions:

| Block | Sessions |
|---|---|
| Phase 0 quick fixes | about 3 |
| Cost-driver briefs | 2 |
| Machine Score | 2 |
| Health systems (99) | 10+ plus research on 16 |
| State dossiers (50) at 1 per state | 50 |
| Committees (2) | 4 |
| Lobby (4) | 4 |
| Carriers | 3+ |
| ASC | 2 |
| Agencies and advisers (5 bodies) | 5 |
| AG oversight | 2 |
| **Total** | **about 90** |

States are more than half the total. At one per week, 50 states take a year. The state data pipeline in P2-2 is the single highest-leverage task on this map. Build it before the second state.

---

## 10. Intake (new gaps found during work)

Add rows here. Dutch triages them into a phase.

| Date | Found during | Gap | Proposed size |
|---|---|---|---|
| 2026-11-14 | Roadmap review | The home page "Build" row lists PhyCap Fund with a link. The standing rule says never reference it. The November 9 stack review had said keep it. Resolved by D-12: all removed (Q10, PR 10). | XS |
| 2026-11-14 | Roadmap review | Copy rule conflict: this file says "Physician" or "doctor"; CLAUDE.md says "physicians, never doctors." Resolved 2026-11-14: "physician," never "doctor"; this file now matches CLAUDE.md. | XS |
| 2026-11-14 | Q1 | Q1 as written sends every old conlaws path to `/con/`. Old CON routes (`/states/[state]`, `/rankings`, `/scope`, `/compare`) still live at the same paths here, so PR 8 keeps each path and sends only the front page to `/con/`. Resolved by D-11: keep each path. | XS |
| 2026-11-14 | Q2 | The November 13 audit listed D.C. among states with no page. D.C. has one; the no-page list is 15 states. Audit and P2-2 inputs corrected. | done |
| 2026-11-14 | Q3 | Desk data with its own source fields (Ways and Means `src/data/committees/wm`, POH `src/data/poh`, AHA, FAH, HAC) is not covered by the source check. Extend the check, or move those files to the four-field shape. | 1 session |
| 2026-11-14 | Q4 | Uncommitted edits from a November 9 session sit in the main checkout (AHA pages, `fights.json`, `data/states/*`, `StateDossier`, `BaseballCard`, `rankings`). Some duplicate fixes now in PR 8. Commit or discard them, then delete. | XS |
| 2026-11-14 | Audit | Branch `claude/physicians-about` (another session) built `/physicians/` and an About page; no PR was opened. Review and PR, or close. | XS |

---

## 11. Log

| Date | Packet | PR | Status | Note |
|---|---|---|---|---|
| 2026-11-12 | Ways and Means desk | PR 6 | DONE | 45 member dossiers, 13 key votes; old subdomain 301s live (Waysandmeans PR 1) |
| 2026-11-13 | Q0 (POH desk) | PR 7 | IN PR | 176 hospitals re-verified in 30 states; list free; redirects ready |
| 2026-11-13 | Q2 (partial) | PR 8 | IN PR | CON count fixed in two page descriptions and llms.txt; section table and "36 states have CON pages" still to reconcile |
| 2026-11-13 | Q3, Q4, Q8 (partial) | PR 8 | IN PR | Source check in prebuild; AHA newsletter link and phone overflow fixed; CON desk Lighthouse 89 to 100 |
| 2026-11-14 | Q1 | PR 8 | IN PR | conlaws.rojasreport.com added as a domain alias with Dutch's OK; DNS record live; redirect rule in PR 8 |
| 2026-11-14 | Roadmap | this PR | IN PR | ROADMAP.md added; statuses set to the state of PRs 7 and 8 |
| 2026-11-14 | Q10 | PR 10 | IN PR | Home "Build" section and NC practicing links removed (D-12) |
| 2026-11-14 | Q11 | PR 11 | IN PR | Three "doctor" uses on the Allina AHA profile changed to "physician" |
| 2026-11-14 | Rules | this PR | IN PR | Dutch's rulings: no businesses tied to him, "physician" only, D-11 left to Claude Code (path-preserving) |
