"""Summarize saved LDA filings (lda_pull.py output) per client and year.
Usage: python3 -I lda_summarize.py <raw/lda dir> <out json>
LD-2 reports name government entities lobbied (for example "U.S. House of Representatives"), never individual members.
A filing is counted as naming Ways and Means when any lobbying activity's description mentions the committee.
"""
import sys, json, glob, re, collections
d, out = sys.argv[1], sys.argv[2]
HEALTH = {"HCR": "Health Issues", "MMM": "Medicare/Medicaid", "PHA": "Pharmacy"}
# exact client names (upper-case regex) kept for each organization; everything else the contains-search returned is dropped
CLIENTS = [
 ("American Hospital Association", r"^AMERICAN HOSPITAL ASSOCIATION$"),
 ("Federation of American Hospitals", r"^FEDERATION OF AMERICAN HOSPITALS$"),
 ("American Medical Association", r"^AMERICAN MEDICAL ASSOCIATION$"),
 ("PhRMA", r"^PHARMACEUTICAL RESEARCH AND MANUFACTURERS OF AMERICA( \(PHRMA\))?$"),
 ("AHIP", r"^AMERICA'S HEALTH INSURANCE PLANS(,? INC\.?)?( \(AHIP\))?$"),
 ("UnitedHealth Group", r"^UNITEDHEALTH GROUP(,? INC\.?)?$"),
 ("HCA Healthcare", r"^HCA HEALTHCARE(, INC\.)?$"),
 ("Tenet Healthcare", r"^TENET HEALTHCARE( CORPORATION)?$"),
 ("Ascension", r"^ASCENSION HEALTH ALLIANCE( D/B/A ASCENSION)?$"),
 ("CommonSpirit Health", r"^COMMONSPIRIT HEALTH$"),
 ("Blue Cross Blue Shield Association", r"^BLUE CROSS (AND )?BLUE SHIELD ASSOCIATION$"),
 ("PCMA", r"^PHARMACEUTICAL CARE MANAGEMENT ASSOCIATION( \(PCMA\))?$"),
 ("American Health Care Association", r"^AMERICAN HEALTH CARE ASSOCIATION$"),
 ("Premier Inc", r"^PREMIER(, INC\.| HEALTHCARE SOLUTIONS, INC\.)$"),
 ("America's Essential Hospitals", r"^AMERICA'S ESSENTIAL HOSPITALS$"),
 ("340B Health", r"^340B HEALTH$"),
 ("AAMC", r"^ASSOCIATION OF AMERICAN MEDICAL COLLEGES( \(AAMC\))?$"),
 ("American Nurses Association", r"^AMERICAN NURSES ASSOCIATION$"),
 ("BIO", r"^BIOTECHNOLOGY INNOVATION ORGANIZATION( \(BIO\)| \(FORMERLY BIOTECHNOLOGY INDUSTRY ORG\.\))?$"),
 ("AdvaMed", r"^(ADVAMED|ADVAMED:ADVANCED MEDICAL TECHNOLOGY ASSOCIATION|ADVANCED MEDICAL TECHNOLOGY ASSOCIATION \(ADVAMED\))$"),
]
def canon(name):
    n = name.strip().upper()
    for label, pat in CLIENTS:
        if re.match(pat, n): return label
    return None
clients = collections.defaultdict(lambda: {"filings": {}, "years": {}})
for f in sorted(glob.glob(f"{d}/*/*.json")):
    body = json.load(open(f))["body"]
    for r in body.get("results", []):
        if not r["filing_type"].startswith("Q"): continue  # LD-2 quarterly (Q1..Q4, with amendments Q1A..)
        key = r["filing_uuid"]
        slug = canon(r["client"]["name"])
        if not slug: continue
        c = clients[slug]
        if key in c["filings"]: continue
        acts = r.get("lobbying_activities") or []
        health_codes = sorted({a["general_issue_code"] for a in acts if a["general_issue_code"] in HEALTH})
        wm = [a for a in acts if re.search(r"ways\s*(and|&)\s*means", (a.get("description") or ""), re.I)]
        ents = sorted({e["name"] for a in acts for e in (a.get("government_entities") or [])})
        c["clientName"] = slug; c.setdefault("clientNamesAsFiled", set()).add(r["client"]["name"]); c.setdefault("registrants", set()).add(r["registrant"]["name"])
        c["filings"][key] = {"uuid": key, "registrant": r["registrant"]["name"], "clientNameAsFiled": r["client"]["name"], "selfFiled": r["registrant"]["name"].strip().upper() == r["client"]["name"].strip().upper(), "year": r["filing_year"], "period": r["filing_period_display"], "type": r["filing_type_display"], "posted": r["dt_posted"][:10],
            "income": float(r["income"]) if r.get("income") else None, "expenses": float(r["expenses"]) if r.get("expenses") else None,
            "healthIssueCodes": health_codes, "namesWaysAndMeans": bool(wm), "waysAndMeansText": [ (a.get("description") or "")[:400] for a in wm][:3], "entities": ents, "document": r["filing_document_url"], "source": f"https://lda.senate.gov/filings/public/filing/{key}/print/"}
rows = []
for slug, c in clients.items():
    fl = sorted(c["filings"].values(), key=lambda x: (x["year"], x["period"]))
    yrs = {}
    for y in (2025, 2026):
        fy = [x for x in fl if x["year"] == y]
        # amendments supersede: keep latest filing per period (by posted date)
        latest = {}
        for x in sorted(fy, key=lambda x: x["posted"]): latest[(x["registrant"], x["period"])] = x
        fy2 = list(latest.values())
        own = sum((x["expenses"] or 0) for x in fy2 if x["selfFiled"])
        hired = sum((x["income"] or 0) for x in fy2 if not x["selfFiled"])
        yrs[str(y)] = {"quartersFiled": sorted({k[1] for k in latest}), "ownLobbyingExpenses": own, "outsideFirmIncome": hired, "reportedSpend": own + hired, "spendBasis": "own LD-2 expenses (self-filed) plus income reported by outside registrants, latest report for each registrant and quarter", "registrantsFiling": sorted({k[0] for k in latest}), "filingsNamingWaysAndMeans": sum(1 for x in fy2 if x["namesWaysAndMeans"]), "healthIssueCodes": sorted({c for x in fy2 for c in x["healthIssueCodes"]})}
    rows.append({"slug": slug, "clientName": c.get("clientName"), "clientNamesAsFiled": sorted(c.get("clientNamesAsFiled", [])), "registrants": sorted(c.get("registrants", [])), "years": yrs, "filings": fl})
rows.sort(key=lambda r: -(r["years"]["2025"]["reportedSpend"]))
json.dump({"source": "https://lda.gov/api/v1/filings/", "sourceLabel": "Lobbying Disclosure Act database (Secretary of the Senate / Clerk of the House), LD-2 quarterly reports", "note": "LD-2 reports name government entities, never individual members; member-level lobbying contacts are not disclosed anywhere in the LDA system.", "clients": rows}, open(out, "w"), indent=1)
for r in rows: print(f'{r["clientName"]:36} regs {len(r["registrants"]):2} | 2025 q{len(r["years"]["2025"]["quartersFiled"])} own {r["years"]["2025"]["ownLobbyingExpenses"]:>12,.0f} hired {r["years"]["2025"]["outsideFirmIncome"]:>10,.0f} WM {r["years"]["2025"]["filingsNamingWaysAndMeans"]} | 2026 q{len(r["years"]["2026"]["quartersFiled"])} own {r["years"]["2026"]["ownLobbyingExpenses"]:>12,.0f} hired {r["years"]["2026"]["outsideFirmIncome"]:>10,.0f} WM {r["years"]["2026"]["filingsNamingWaysAndMeans"]}')
