# tafhc.org (The Alliance for Healthcare Competition)

This repository builds tafhc.org. Next 14 static export, React 18, Tailwind v3. Code in `src/app`, alias `@/*` to `./src/*`. Build: `npm run build`, output in `out/`. Netlify project "therojasreport" serves tafhc.org; pull requests get a deploy preview. rojasreport.com and its subdomains are aliases of the same project and 301 to tafhc.org from `public/_redirects`. read.rojasreport.com, Dutch's personal newsletter, is the one subdomain that does not redirect.

## Controlling documents

1. `MERGER_PLAN.md` section 1.2 (Dutch Rojas, November 16, 2026) wins over every older document. The Rojas Report is retired as a website and as a public research brand. It continues only as Dutch's personal newsletter. The site is the Alliance's, and its research section is Research (`/research/`).
2. `docs/BUILD_BRIEF.md` (November 6, 2026) still governs the design system, the data model, the hard rules and the page templates wherever the merger plan does not override it. The approved mockups are in `docs/mockups/`; where a mockup and the brief disagree, the brief wins.
3. `docs/ROADMAP.md` is the build map; `docs/DECISIONS.md` is the decision log.

Hard rules: no invented numbers. Every figure is labeled reported or estimated, with a source and an as-of date. Client work stays out. Never say "donate." Never say anyone is excluded.

## Who merges

Dutch Rojas merges and deploys. Never merge, never deploy, never enable auto-merge. Open a pull request and send the deploy-preview link. Merging `main` deploys tafhc.org.

## Site structure

The nav is `src/lib/nav.ts` (MERGER_PLAN.md section 3.1): Our Fights, Research, Insights, How We Win, For Physicians, For Partners, About, with Join as the button. The shell is `src/components/Header.tsx` and `Footer.tsx`.

- **Fights.** Three at launch: site-neutral payment, the 340B program, physician ownership (Section 6001). Pages under `/fights/`. Everything else the research supports (certificate of need, price transparency, Stark and Anti-Kickback, other hospital subsidies) is research, not a fight.
- **The Tracker.** `/tracker/`, one file, `src/data/tracker.json`, two lanes (Congress; Agency and court). The "win = the lobby held the line" tone key is retired.
- **Research.** Hub at `/research/`. Nine sections: Cost Drivers `/drivers/`, States `/states/`, Health Systems `/systems/`, Physician-Owned `/physician-owned/`, Government `/government/`, The Lobby `/lobby/`, Carriers `/carriers/`, Methodology `/methodology/`, Search `/search/`. Desks keep flat, permanent paths: `/aha/`, `/fah/`, `/hac/`, `/academic/`, `/poh/`, `/con/`, `/committees/`, `/systems/`, `/states/`. The CON desk pages live under `/con/`.
- **Desk list.** Each desk's live or planned status and each section's band color is `src/data/home/sections.json`; helpers in `src/lib/home.ts`.
- **Membership and giving.** `/physicians/join/`, `/physicians/council/`, `/give/`. Physician Member is open to every independent physician; the Council is 100 physicians by invitation; Partner is by application only, with no public price. Dues levels and Stripe price ids are in `src/data/alliance/membership.json`; giving amounts and its `open` flag are in `src/data/alliance/giving.json`. Dues checkout stays closed until counsel supplies the lobbying percentage for the §6033(e) notice.
- **Off the site.** `/reports/` is `noindex` and out of the nav (Reports & Data waits for counsel, decision 7 of the merger plan). The Machine Score waits: no member scores or bands publish. (Its methodology page, `/methodology/machine-score/`, is live and linked on main although the merger plan holds it; Dutch's call, see the roadmap Intake. Do not unpublish it without his word.) The Builders Table is retired; the Council replaces it. Support the Report is now Alliance giving. No house ads, no shop.

Design tokens are in `tailwind.config.ts` (the brief's names: paper, paper-2, ink, oxblood, green, muted, body, hairline, gold). The legacy names (navy, cream, orange, ...) are aliases so older desks still render; new code uses the brief's names only.

Four page templates cover every desk: person dossier (model: `/aha/profiles/`), institution dossier, roster, fight page.

## Build gates

`npm run build` runs three checks first (`prebuild`): `check-sources.mjs` (figures in the brief's format), `check-desks.mjs` (the Ways and Means and physician-owned hospitals data: a source, a label and a date on every record, every printed count equal to its records) and `check-links.mjs`. A failure stops the build.

## Moving a desk in from an old subdomain

1. Code in `src/app/<desk>/`, components in `src/components/<desk>/`, data in `src/data/<desk>/`. Shared nav, footer, fonts and palette.
2. Refresh every data point with a source while moving it. NOT FOUND beats a guess. Never fill a gap to finish.
3. Flip the desk's `href` in `sections.json` to the internal path. Add every new page to `src/app/sitemap.ts`.
4. Preview, independent fact-check by a fresh agent, then Dutch reviews and merges.
5. Redirects are host-qualified, forced rules (`301!`) in this repo's `public/_redirects`, pointing at tafhc.org. Netlify skips an unforced rule when a file exists at the path. Dutch retires each old Netlify project.

## Voice (MERGER_PLAN.md section 5.2)

- A professional voice that advocates for members. Third person: "The Alliance for Healthcare Competition" or "the Alliance." Never "I." "We" only on membership and About pages. Never "we" in a dossier.
- First person appears only in Dutch's bylined column at `/founder/`. Research pages do not link to the column.
- A figure's attribution names the filing, never a publication. Our own estimates are "Alliance estimate," with the method named.
- Keep the verdict, drop the persona. Findings stand on the filing. Section titles describe ("Federal lobbying by year"); they do not characterize.
- Free-market lens: the problem is consolidation, regulatory capture and rules that block competitors. Never profit or business as such.

## Copy rules

- "Physicians," never "doctors." (Decision 12.)
- "340B" is the drug pricing program. Write "the 340B program" wherever it could be misread.
- No em dashes anywhere.
- "Provider" is not a word for physicians or hospitals. Say which one. (Legal terms of art such as "provider-based department" stay.)
- No "should." State what is, and what it costs.
- Every figure is sourced, with the year on it. Sourced figures stand on their source; no hedging notes.
- No correction notes or internal research notes inside page copy. Corrections are logged at `/corrections/`.
- tafhc.org does not link to or sell The Rojas Report newsletter at read.rojasreport.com. The Alliance newsletter is a separate publication. The newsletter platform's name never appears in reader-facing copy.
- Sentences under 25 words in page copy.

## Dossiers that name a person (MERGER_PLAN.md section 5.4)

Public record only, with no characterization of motive. Before publication, the person or office is offered the figures and the date is recorded. A counsel read is recommended (merger decision D12). Dutch signs off on every dossier, with the fact-check log and the counsel checklist in the PR. Every dossier carries the disclosure line: "Produced for The Alliance for Healthcare Competition under contract by Rojas Media. The Alliance owns and publishes this work. Corrections: /corrections/." Corrections land within five business days of a sourced report and are logged publicly.

## What never appears on the site

- Work built for clients (sites, portals, analyses) is the client's and is never reproduced. The ab.tafhc.com portal is client work. The public data behind it can always be used.
- No consulting client of Rojas Media is named on the site. The gate list lives outside this repo.
- Companies Dutch has exited are not named.
- No business tied to Dutch Rojas is named except the Alliance itself: never MedMerge, Cornerstone Indemnity, PhyCap Fund, DrCaptives or any other (decision 11, as amended by decision 15). Rojas Media appears only in the producer disclosure sentences: the line on `/research/` (and the About, AHA About and Terms pages that repeat it) and the dossier line above. The footer carries no Rojas Media line. Unrelated companies that share a word, such as Cornerstone Government Affairs in lobbying data, stay where the source names them.
