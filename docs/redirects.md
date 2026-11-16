# Old subdomains and their redirects

Each desk that moved in from a subdomain keeps a 301 on the old address. Dutch retires each old project 30 to 60 days after its redirect goes live (roadmap Q7). Claude Code never retires a project.

## Status

| Old address | Old project | Redirect lives in | Live since | Retire between |
|---|---|---|---|---|
| waysandmeans.rojasreport.com | Waysandmeans (Netlify) | Waysandmeans repo, PR 1 | 2026-11-12 | 2026-12-12 and 2027-01-11 |
| poh.rojasreport.com | physicianownedhospital (Netlify, RojasReportIntelligence `apps/poh`) | `apps/poh/public/_redirects`, PRs 3 and 4 | 2026-11-16 | 2026-12-16 and 2027-01-15 |
| conlaws.rojasreport.com | rojasreportconlaws (Netlify, builds this repo) | this repo, `public/_redirects` (PR 8); the domain is an alias of therojasreport | 2026-11-14 | 2026-12-14 and 2027-01-13 |
| fah.rojasreport.com | FAH-Rojas-Report (GitHub Pages) | not moved yet | | after the FAH desk moves in |

## Maps

**waysandmeans.rojasreport.com.** Every path goes to `/committees/ways-and-means/`.

**poh.rojasreport.com.** Every rule is forced (`301!`), because the old pages are still in that deploy and Netlify skips an unforced rule when a file exists at the path.

| Old path | New path |
|---|---|
| `/` | `/poh/` |
| `/states/xx/` (28 states with a hospital on the list) | `/poh/states/xx/` |
| `/states/ia/`, `/states/nh/` (no hospital left on the list) | `/poh/states/` |
| `/states/` | `/poh/states/` |
| `/investigation/` | `/poh/investigation/` |
| `/evidence/` | `/poh/evidence/` |
| `/data-explorer/` | `/poh/hospitals/` |
| `/about/` and anything else | `/poh/` |

Checked 2026-11-16: all 38 pages in the old deploy, plus an uppercase path, a path without its slash and a made-up path, forward to a page that loads.

**conlaws.rojasreport.com.** The front page goes to `/con/`. Every other path keeps its path on rojasreport.com (decision 13). Checked 2026-11-16: all 240 paths in the sitemap load.

## Notes

- The rojasreportconlaws project still builds every pull request in this repo. Retiring it ends those duplicate checks.
- The first POH production build of PR 4 failed with no error in the log; a rebuild of the same commit passed. If a redirect does not show up after a merge, check the deploy before the rules.
