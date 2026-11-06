# The Rojas Report (rojasreport.com)

Next 14 static export, React 18, Tailwind v3. Code in `src/app`, alias `@/*` to `./src/*`. Build: `npm run build`, output in `out/`. Netlify project "therojasreport"; pull requests get a deploy preview.

## Redesign (branch `redesign`, November 2026)

The controlling document for the site is `docs/BUILD_BRIEF.md` (Dutch Rojas, November 6, 2026). The Machine Score spec is `docs/MACHINE_SCORE_DRAFT.md`. The approved mockups are the four artboards in `docs/mockups/` (home, health system profile, state dossier, committee dossier); where a mockup and the brief disagree, the brief wins. Build from these, not from the old look (navy, orange, Cormorant) or old plans. Hard rules in the brief: no invented numbers, every figure labeled reported or estimated with a source and an as-of date, client work stays out, never "donate," membership by application and never say anyone is excluded.

## Who merges

Dutch Rojas merges and deploys. Never merge, never deploy, never enable auto-merge. Open a pull request and send the deploy-preview link.

## Site structure

Seven sections (docs/DECISIONS.md decision 5), each a landing page that groups desks: `/drivers/`, `/states/`, `/systems/`, `/carriers/`, `/physician-owned/`, `/government/`, `/lobby/`. Reports & Data (`/reports/`) and Support (`/support/`) sit in the utility bar. The nav is `src/lib/nav.ts`; the shell is `src/components/Header.tsx` (full masthead on `/`, compact elsewhere) and `Footer.tsx`. Desks keep flat, permanent URLs (`/aha/`, `/con/`, `/academic/`, `/fah/`, `/hac/`). The desk list, each desk's live or planned status and each section's band color is `src/data/home/sections.json`; the home-page Fights tracker is `src/data/home/fights.json`; helpers in `src/lib/home.ts`. The retired section URLs redirect in `public/_redirects`.

Design tokens are in `tailwind.config.ts` (the brief's names: paper, paper-2, ink, oxblood, green, muted, body, hairline, gold). The legacy names (navy, cream, orange, ...) are aliases so desks built before the redesign render inside the shell; new code uses the brief's names only. Desks rebuilt into the brief's templates drop the aliases as they go.

Four page templates cover every desk: person dossier (model: `/aha/profiles/`), institution dossier, roster, fight page.

## Moving a desk in from a subdomain

1. Code in `src/app/<desk>/`, components in `src/components/<desk>/`, data in `src/data/<desk>/`. Shared nav, footer, fonts and palette.
2. Refresh every data point with a source while moving it. NOT FOUND beats a guess. Never fill a gap to finish.
3. Flip the desk's `href` in `sections.json` to the internal path. Add every new page to `src/app/sitemap.ts`.
4. Preview, independent fact-check by a fresh agent, then Dutch reviews and merges.
5. Only after the new pages are live: one `_redirects` line in the old repo (`/* https://rojasreport.com/<desk>/:splat 301`). Retire the old Netlify project 30 to 60 days later.

## Copy rules

- "Physicians," never "doctors."
- "340B" is the drug pricing program. Write "the 340B program" wherever it could be misread.
- No em dashes anywhere.
- "Provider" is not a word for physicians or hospitals. Say which one. (Legal terms of art such as "provider-based department" stay.)
- No "should." State what is, and what it costs.
- Every figure is sourced, with the year on it. Sourced figures stand on their source; no hedging notes.
- No correction notes or internal research notes on public pages.
- The newsletter is read.rojasreport.com. The platform name never appears in reader-facing copy.
- Sentences under 25 words in page copy.

## What never appears on the site

- Work built for clients (sites, portals, analyses) is the client's and is never reproduced. The public data behind it can always be used.
- No consulting client of Rojas Media is named on the site. The gate list lives outside this repo.
- Companies Dutch has exited are not named.

## Hidden pages

`/builders-table` and `/partners` are dormant: `noindex`, unlinked, not in the sitemap. Do not change `/builders-table` without Dutch's go-ahead.
