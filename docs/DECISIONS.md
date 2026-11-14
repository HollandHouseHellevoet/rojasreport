# Redesign decisions

Dutch's calls during the redesign discussion. Newest at the bottom. Each one binds every session working on the `redesign` branch.

## 2026-11-06

1. **Relaunch scope.** The redesigned site goes live with: the home page; the four template pages on real data (CommonSpirit profile, North Carolina dossier, Senate Finance dossier, plus the home page); the six cost-driver briefs; and the five live desks (AHA, FAH, HAC, CON, academic) inside the new shell. Every other item the home page promises shows "in preparation" in the new look. Full migration of each desk into the brief's templates follows relaunch, one desk at a time.

2. **Seven sections.** The nav is Cost Drivers · States · Health Systems · Carriers · Government · The Lobby · Reports & Data. Government replaces the brief's "Committees" and holds Congress (the four committees, later members and the Machine Score), advisory bodies (HAC, MedPAC, MACPAC) and agencies (CMS, HHS, HRSA). Carriers is a new green section (insurers, their PBMs and physician-employment arms) with its own template after relaunch; it shows "in preparation" until then. The pharma lobby stays out of The Lobby under the client gate. Physicians are the audience, not a section.

3. **Health Systems is the top 100** nonprofit health systems and academic medical centers (the brief said 78).

4. **Phased rollout.** The redesign ships in phases with a deploy preview and Dutch's review at the end of each; see the phase table below once approved.

5. **Physician-Owned is its own green section.** It holds the physician-owned hospital directory (the existing POH dataset, $300 a state or $3,500 a year), the ASC directory (physician-owned share and CON treatment by state) and later independent groups. Entries link to drivers I, III, V and VI. Main nav is seven items: Cost Drivers · States · Health Systems · Carriers · Physician-Owned · Government · The Lobby. Reports & Data moves to the utility bar beside Sign in, Newsletter and Support, and stays in the footer.

## Phase plan (approved 2026-11-06)

One session per phase, sequential, a deploy preview and Dutch's review at the end of each. No parallel sessions unless Dutch asks.

| Phase | Builds | Preview shows |
|---|---|---|
| 0. Shell | Tokens, fonts, masthead, nav, footer, "in preparation" page. The five live desks (AHA, FAH, HAC, CON, academic) move inside it. | The whole site in the new look |
| 1. Home and data layer | Schemas and build-time validation (every figure: value, basis, source, as_of; build fails without a source). Driver cards, fights tracker, state map, cover, most-read, store and support blocks on Stripe test links. | The home mockup, live |
| 2. Health systems | System template, then CommonSpirit. Then batches of ten from the 83 dossiers in `phycap-work/research/dossiers`; the rest of the top 100 need research first. | First profile |
| 3. States | State template, then North Carolina. Then MA, PA, NY, TN. | First dossier |
| 4. Government | Committee template, then Senate Finance. HELP, Ways and Means migration, Energy and Commerce. HAC moves under Government. | First committee |
| 5. Drivers and methodology | Six driver briefs. Subsidy ledger, state grade and Machine Score methodology pages. | Every home card has a page |
| 6. Relaunch gate | Store, Support page, PDFs per page, search index. Fresh-agent fact-check of every live page, Lighthouse accessibility ≥ 95, Stripe end to end in test mode. | Dutch merges and relaunches |
| 7. Rolling | Systems to 100, states to 51, Carriers template, Physician-Owned directories, member pages and the Machine Score, Lobby expansion, subdomain redirects. | One desk at a time |

## 2026-11-09

6. **Alliance-style look.** The site takes the tafhc.com layout in the Rojas palette: Inter Tight headlines, no Bodoni, full-width ink, green and oxblood bands, number tiles, a boxed "THE ROJAS REPORT" mark in an ink utility bar. Live with PR 3.

## 2026-11-13

7. **Physician-owned hospitals list is free.** Every hospital on the list is free to read at `/poh/hospitals/`. The $300-a-state and $3,500-a-year offers are withdrawn (PR 7). This replaces the paid POH dataset in decision 5.
8. **CON count.** 35 jurisdictions: 34 states and D.C. The CON desk tracks 36 jurisdictions, the 35 plus Florida.
9. **Roadmap.** `docs/ROADMAP.md` is the build map: one packet per branch and PR, the fact-check gate on every PR with figures, and a decisions register for calls only Dutch makes.

## 2026-11-14

10. **conlaws.rojasreport.com** is a domain alias of the main Netlify site (D-5). The redirect target is open as D-11.
