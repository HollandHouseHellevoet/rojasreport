# State dossier pipeline

Every state dossier on the site (`src/data/states/<st>.json`, rendered by `src/components/states/StateDossierPage.tsx`) is a
render of this pipeline plus one editorial file. The pull scripts read public source files for all 51 jurisdictions once; a
state's dossier is then `build_state.py <ST>` over its editorial file. No figure on a state page is typed in by hand.

## Layout

| Path | What |
|---|---|
| `scripts/common.py` | Source registry (file, name, URL, retrieval date, as-of), state list, helpers |
| `scripts/pull_hospitals.py <ST>` | The state's 340B hospitals: registry, child sites, contract pharmacies, cost-report finances, dual classification, Medicare DSH |
| `scripts/pull_facilities.py` | CON status, physician-owned hospital counts, ambulatory surgery center counts, all states |
| `scripts/pull_officials.py` | Governor and attorney general of every state |
| `scripts/pull_tax_rates.py` | Effective commercial property tax rates, largest city and a rural municipality, every state |
| `scripts/build_state.py <ST>` | Renders `src/data/states/<st>.json` from the data files and `editorial/<st>.json` |
| `data/` | Pull outputs (JSON, checked in so a render is reproducible without the source files) |
| `editorial/<st>.json` | Prose, grades, statuses, officeholders, bills, the attorney general section, with `{placeholders}` for figures |
| `overrides/<st>.json` | Optional: CCN fixes, system assignments and exclusions for one state (`{"ccn": {}, "system": {}, "exclude": {}}`) |
| `sources/` | Saved source pages that refuse scripted fetches (NAAG roster as text; Texas statute pages with `.sha256` sidecars) |

Source files live outside the repository (default `../research/dossiers/_sources` next to the repo; set `STATE_SOURCES` to
point elsewhere). Each data file records the sha256 of the source file it was built from.

## Sources

| Field | Source | As of |
|---|---|---|
| 340B hospitals, child sites, contract pharmacies | HRSA 340B OPAIS daily export (covered entities with contract pharmacies), hospital entity types DSH, CAH, PED, RRC, SCH, CAN | September 29, 2026 |
| Net patient revenue, net income, other income, total assets, charity care at cost, uncompensated care, beds, residents, property at historical cost, Medicare DSH adjustment | CMS Hospital Provider Cost Report, 2023 and 2024 files (data.cms.gov); latest report per CCN, skipping reports under 360 days or with no patient revenue when an earlier full-year report exists; property lines fall back to the latest report that carries them | Hospital fiscal years ending 2023 to 2025 |
| System membership | AHRQ Compendium of U.S. Health Systems, 2023 hospital linkage file, by CCN | 2023 |
| Dual classification (rural on the cost report, urban for CMS) | CMS FY2027 IPPS final rule impact file, correction notice (URGEO, Section 401 flag) | FY2027 |
| Projected Medicare DSH, uncompensated care payment | CMS FY2027 IPPS Medicare DSH supplemental file | FY2027 |
| CON status, score, tier | `data/rankings.json` (the CON desk) | 2026 |
| Physician-owned hospitals | Alliance physician-owned hospital database, `research/poh/poh_db_2026-03.json` | March 2026 |
| Ambulatory surgery centers | CMS Provider of Services file, Q2 2026, category 21, active certifications | Q2 2026 |
| Governors | National Governors Association, current governors (nga.org/governors) | November 19, 2026 |
| Attorneys general | National Association of Attorneys General, Find my AG (saved as `sources/naag_find_my_ag_<date>.txt`; the page refuses scripted fetches) | November 19, 2026 |
| Property tax rates | Lincoln Institute of Land Policy and Minnesota Center for Fiscal Excellence, 50-State Property Tax Comparison Study for taxes paid in 2025 (April 2026), Appendix Tables 3a and 3c, $1 million commercial property | 2025 |

### Tax exemption estimate

Federal income tax at 21% of the net income of the hospitals that made money; state corporate income tax at the rate in the
editorial file on the same base (null where the state has none); property tax on land, land improvements and buildings at
historical cost, at the Lincoln largest-city rate for hospitals in the counties the editorial file names and the rural rate
elsewhere. Sales tax is not estimated. This is the convention of the North Carolina and Texas research of October 2026.

### Fields still pending a 50-state source

| Field | Status |
|---|---|
| Provider taxes | KFF, States Reporting Taxes by Provider Type, SFY 2025, counts 47 states with a hospital tax; the per-state table could not be extracted by script (page tables render as images; the CRS RS22843 appendix PDF is not readable here). A state's editorial file states its hospital tax from the state statute until a 50-state table is in hand. |
| Private-practice physician counts over time | No source chosen. The AMA is not acceptable; PAI-Avalere publishes national figures only (82.0% employed, January 1, 2026). Open question for Dutch. |
| Graduate medical education | Residents and interns (FTE) come from the cost reports and are in `data/hospitals/<st>.json`; Medicare GME payments are not pulled yet. |

## Refresh

```bash
cd research/states/scripts
python3 pull_facilities.py && python3 pull_officials.py && python3 pull_tax_rates.py
python3 pull_hospitals.py TX        # one state; writes data/hospitals/tx.json
python3 build_state.py TX           # writes src/data/states/tx.json
```

Then register the state in `src/lib/stateDossiers.ts` and `src/lib/stateMap.ts`, add its card to `src/data/home/sections.json`,
and run `npm run build` (the source check in `scripts/check-sources.mjs` fails the build on any figure without a basis, source
and as-of date).

## Validation

The pipeline reproduces, with generic rules, every cost-report, registry and dual-classification figure of the October 2026
Texas and North Carolina research: Texas 167 hospitals (166 with cost reports), 2,377 child sites, 2,939 contract pharmacy
arrangements (1,011 out of state), net patient revenue 50,838,858,818, net income 6,540,725,516, total assets 78,630,839,110,
charity care 4,952,445,972, 21 dual classifications; North Carolina 54 hospitals, 855 child sites, 1,698 arrangements (770 out
of state), net income 4,062,986,363, 12 dual classifications.
