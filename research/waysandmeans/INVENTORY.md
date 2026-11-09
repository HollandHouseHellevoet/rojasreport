# Ways & Means desk: inventory of the old site

Old site: waysandmeans.rojasreport.com. Repo: `HollandHouseHellevoet/Waysandmeans` (Next.js 16, server-rendered on Netlify). Inventoried November 8, 2026 from a fresh clone at `/Users/homefolder/phycap-work/Waysandmeans`.

## Deploy branch (step 1 answer)

The Netlify project "waysandmeans" (site id `c7f835ae-8b93-421f-a7ed-baf81c94eb37`) deploys **`claude/member-healthcare-profiles-S1Km4`**. The production deploy (`69d8f9640a7d130008b6e54e`, published April 10, 2026, context `production`) is built from commit `939a2159` on that branch, and the project's branch URL is `claude-member-healthcare-profiles-s1km4--waysandmeans.netlify.app`. The repository has **no `main` branch**: its only branches are `claude/member-healthcare-profiles-S1Km4` (the default, HEAD) and `redirect-to-rojasreport` (one commit, `ea3e6ea`, adding `public/_redirects` that sends every old URL to `rojasreport.com/committees/ways-and-means/`; the commit message says to merge it only after the dossier is live). The live site matches the default branch: same 45 members, same $11.0M headline, same footer attribution.

Source: Netlify MCP `get-projects` and `get-deploy-for-site` (November 8, 2026); `git branch -a` in the clone; live page fetch November 8, 2026.

## Pages

| Route | What it shows |
|---|---|
| `/` | Header "Follow the Money. Follow the Votes." Four stat badges: committee members (45, "119th Congress (2025-2026)"), Republicans (26, "Majority party"), Democrats (19, "Minority party"), Healthcare Money ($11.0M, "2024 cycle contributions"). Member grid with party filter, name/state search, sort by donations, seniority or name. Each card: photo, name, party, state-district, role, Yea/Nay/Absent counts, "Top Healthcare $" (2024 total). |
| `/member/[slug]` | 45 pages. Profile header (photo, name, party, state, district, role, bio paragraph, term start, Health Subcommittee flag, vote counts, 2024 donation total). Voting history on 11 bills. Donation history with a 2024/2022 toggle: total, PAC vs individual split, five sector totals, donor count, one row per organization. Trade history (healthcare stock trades, link to Capitol Trades). Share buttons. |
| `/bill/[id]` | 12 pages. Bill number, title, short title, category, description, date, result, Congress.gov link, Yea/Nay/Not Voting tally with party split. |
| Footer | "Voting data sourced from Congress.gov. Campaign finance data based on FEC filings via OpenSecrets. Member photos from the Congressional Biographical Directory." Links to the newsletter and the other subdomain reports. |

## Data files (`data/`)

| File | Rows | Fields | Notes |
|---|---|---|---|
| `members.json` | 45 | id, firstName, lastName, party, state, district, role, bioguideId, bio, healthcareSubcommittee, termStart | Roles shown: Jason Smith "Chair"; Vern Buchanan "Vice Chair"; Adrian Smith "Health Subcommittee Chair"; Richard Neal "Ranking Member"; Lloyd Doggett "Health Subcommittee Ranking Member". 19 members flagged on the Health Subcommittee. Bio text is unsourced prose. |
| `bills.json` | 12 | id, congress, number, title, shortTitle, category, description, date, result, url | 11 passed bills from the 116th to 118th Congresses (H.R. 3 of 2019 through H.R. 4822 of 2024) plus H.R. 247 (119th, "Pending"). Not one is a 119th Congress vote. |
| `votes.json` | 495 | memberId, billId, vote | 45 members x 11 bills. Members who were not yet in Congress on the vote date still carry a recorded position (for example members first elected in 2022 on 2019 votes), so the file cannot be a transcription of roll calls. |
| `donations.json` | 1,336 | memberId, cycle (2024 or 2022), organization, sector, total, pacAmount, individualAmount | 673 rows for 2024 and 663 for 2022, drawn from a fixed list of 44 organizations across five sectors. Every amount is a multiple of $500. 2024 total across members: $10,996,000 (shown as $11.0M). No committee IDs, no filing references, no OpenSecrets URLs. |
| `trades.json` | 77 | memberId, transactionDate, filingDate, company, ticker, type, amount (range), owner, sector, capitolTradesUrl | Trades dated January 27, 2023 to December 30, 2025 for 28 members. The link is to the member's Capitol Trades page, not to the disclosure filing. |

## Provenance of the old data

The five data files were committed on April 9, 2026 in four commits (`9f0fe8b`, `2949e36` "refined vote data", `0218bff`, `d1cf8e7`) with no fetch or build scripts; the only script in the repo downloads headshots. The footer credits Congress.gov and "FEC filings via OpenSecrets", but nothing in the repo ties a figure to a filing, an OpenSecrets record or a roll call. Taken together (round amounts, a fixed donor list, recorded votes for members who were not in office), the old figures are not reproducible and are treated here as unverified. The refresh below re-sources every point from a primary record rather than checking the old numbers one by one.

## Data points to refresh, and where the primary record is

| Data point on the old site | Primary source used in this pass |
|---|---|
| Roster: 45 members, party, state, district, seniority | Clerk of the House member data XML (`clerk.house.gov/xml/lists/MemberData.xml`, published November 3, 2026) |
| Full committee chair, ranking member, "Vice Chair" | Clerk XML leadership flags; `waysandmeans.house.gov/members/` (Committee Leadership block) |
| Subcommittee membership and chairs | Clerk XML (`WM01` to `WM06` with `leadership="Chair"`); `waysandmeans.house.gov/subcommittees/` |
| Subcommittee ranking members, vice ranking member | Ranking Member Neal's January 8, 2025 release on `democrats-waysandmeans.house.gov` |
| Term start | Clerk XML `prior-congress` count (first Congress served) |
| Bio paragraph | No primary equivalent; replaced by sourced facts (roles, first Congress, 2026 outcome) |
| Healthcare campaign money (2024 cycle; 2022 cycle) | FEC bulk files: `pas2` (PAC contributions to candidates), `cm`, `cn`, `ccl` for the 2024 and 2026 cycles, retrieved November 8, 2026 |
| Bills and roll-call votes | Clerk roll-call XML (`clerk.house.gov/evs/2025/`, `/2026/`); GPO govinfo bill status XML (Library of Congress data) |
| Stock trades | Clerk of the House financial disclosure index (`2025FD`, `2026FD`) and the periodic transaction report PDFs it lists |
| Hearings and markups (not on the old site) | `waysandmeans.house.gov/hearings/` and `/markups/`; `docs.house.gov` committee calendar RSS |
| Lobbying contacts (not on the old site) | Lobbying Disclosure Act API (`lda.gov/api/v1/filings/`), LD-2 quarterly reports for 20 healthcare clients, 2025 and 2026 |
| Dated developments (not on the old site) | Member releases, state results and wire calls for the November 3, 2026 election; House control; expected 120th Congress leaders |

## Outside this pass

- The redesign branch of `rojasreport` already carries `src/data/committees/ways-and-means.json` (commit `ff09806`, November 8, 2026: roster from the Clerk's November 3 file, 2026 outcomes, hospital PAC money, 2027 docket). This research folder does not touch `src/`; where the two overlap the figures were derived independently and can be reconciled when the desk is built.
- Member photos: the old site pulled from the Biographical Directory; `bioguide.congress.gov` sits behind a Cloudflare challenge and was not pulled here.

## Not committed

The FEC bulk zips and their unzipped files (205MB) are excluded by `research/waysandmeans/.gitignore`; `raw/fec/README.md` lists the URLs and the rebuild step. Everything else under `raw/` is committed.
