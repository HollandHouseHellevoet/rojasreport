"""Count House financial-disclosure filings (periodic transaction reports and annual reports) per Ways and Means member.
Usage: python3 -I fd_ptrs.py <raw/fd dir> <roster json> <out json>
Source: Clerk of the House, Financial Disclosure Reports index files {YEAR}FD.txt from
https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{YEAR}FD.zip
FilingType codes seen in the index: P = periodic transaction report (PTR), A = annual (or amendment), C = candidate, X = extension, W = withdrawal, D, T = termination, H.
"""
import sys, csv, json, collections
fd, roster_f, out_f = sys.argv[1:4]
roster = json.load(open(roster_f))["members"]
idx = {(m["lastName"].upper(), m["stateDistrict"]): m for m in roster}
# some Clerk index spellings differ; fall back on last name + state
by_last_state = collections.defaultdict(list)
for m in roster: by_last_state[(m["lastName"].upper(), m["state"])].append(m)
res = {m["bioguideId"]: {"bioguideId": m["bioguideId"], "name": m["officialName"], "stateDistrict": m["stateDistrict"], "filings": []} for m in roster}
for year in ("2025", "2026"):
    with open(f"{fd}/{year}FD/{year}FD.txt", encoding="utf-8-sig") as f:
        rd = csv.DictReader(f, delimiter="\t")
        for r in rd:
            last = (r["Last"] or "").upper().strip(); sd = (r["StateDst"] or "").strip()
            m = idx.get((last, sd))
            if not m:
                cands = [c for c in by_last_state.get((last, sd[:2]), []) if c["stateDistrict"][:2] == sd[:2]]
                m = cands[0] if len(cands) == 1 else None
            if not m: continue
            ft = r["FilingType"]
            folder = "ptr-pdfs" if ft == "P" else "financial-pdfs"
            res[m["bioguideId"]]["filings"].append({"year": year, "filingType": ft, "filingDate": r["FilingDate"], "docId": r["DocID"], "pdf": f"https://disclosures-clerk.house.gov/public_disc/{folder}/{year}/{r['DocID']}.pdf"})
out = {"source": "https://disclosures-clerk.house.gov/FinancialDisclosure", "sourceLabel": "Clerk of the House, Financial Disclosure Reports index (2025FD.zip, 2026FD.zip)", "members": []}
for v in res.values():
    v["ptrCount"] = sum(1 for f in v["filings"] if f["filingType"] == "P")
    v["ptrCount2025"] = sum(1 for f in v["filings"] if f["filingType"] == "P" and f["year"] == "2025")
    v["ptrCount2026"] = sum(1 for f in v["filings"] if f["filingType"] == "P" and f["year"] == "2026")
    v["annualReports"] = [f for f in v["filings"] if f["filingType"] in ("A", "O")]
    out["members"].append(v)
json.dump(out, open(out_f, "w"), indent=1)
for v in sorted(out["members"], key=lambda x: -x["ptrCount"]): print(v["ptrCount"], v["ptrCount2025"], v["ptrCount2026"], v["stateDistrict"], v["name"], collections.Counter(f["filingType"] for f in v["filings"]))
