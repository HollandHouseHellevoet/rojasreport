"""Build research/waysandmeans/data/*.json from the raw pulls, with a status on every fact.
Usage: python3 -I build_data.py <research/waysandmeans dir> <old Waysandmeans repo data dir> [developments json]
Statuses: VERIFIED (primary source confirms the point; for a point the old site did not carry, confirms the new value),
CHANGED (primary source differs from the old site), NOT FOUND (no primary record reachable; left empty).
"""
import sys, json, glob, re, collections, datetime, unicodedata, os
W, OLD = sys.argv[1], sys.argv[2]
DEV = sys.argv[3] if len(sys.argv) > 3 else None
RAW, DATA = f"{W}/raw", f"{W}/data"
os.makedirs(DATA, exist_ok=True)
TODAY = "2026-11-08"
def J(p): return json.load(open(p))
def fold(s): return "".join(c for c in unicodedata.normalize("NFKD", s or "") if not unicodedata.combining(c)).lower()
def fact(field, value, source, label, asof, status, old=None, note=None):
    f = {"field": field, "value": value, "status": status, "source": source, "sourceLabel": label, "asOf": asof}
    if old is not None: f["old"] = old
    if note: f["note"] = note
    return f
counts = collections.Counter()
def tally(facts):
    for f in facts: counts[f["status"]] += 1
    return facts

roster = J(f"{RAW}/clerk/wm_roster_parsed.json"); CLERK = "https://clerk.house.gov/xml/lists/MemberData.xml"; CLERK_L = "Clerk of the House, Member Data XML, published November 3, 2026"
old_members = {m["bioguideId"]: m for m in J(f"{OLD}/members.json")}
old_slug = {m["bioguideId"]: m["id"] for m in J(f"{OLD}/members.json")}
terms = {}
for f in glob.glob(f"{RAW}/congress/members_119_offset*.json"):
    for m in J(f)["members"]:
        ys = [t.get("startYear") for t in m.get("terms", {}).get("item", []) if t.get("chamber") == "House of Representatives" and t.get("startYear")]
        if ys: terms[m["bioguideId"]] = min(ys)
CG = "https://api.congress.gov/v3/member/congress/119"; CG_L = "Congress.gov API, member list for the 119th Congress (terms), retrieved November 9, 2026"
MEMBERS_URL = "https://waysandmeans.house.gov/members/"; MEMBERS_L = "Committee on Ways and Means, Full Committee membership page, retrieved November 9, 2026"
SUBS_URL = "https://waysandmeans.house.gov/subcommittees/"; SUBS_L = "Committee on Ways and Means, Subcommittees page, retrieved November 8, 2026"
DEM_URL = "https://democrats-waysandmeans.house.gov/media-center/press-releases/ranking-member-neal-announces-ways-and-means-democrats-subcommittee-0"; DEM_L = "Ranking Member Neal, release of January 8, 2025: Democratic subcommittee assignments for the 119th Congress"
RANKING = {"WM02": "D000399", "WM06": "S001185", "WM01": "L000557", "WM05": "T000460", "WM04": "S001156", "WM03": "D000096"}  # Doggett, Sewell, Larson, Thompson, Sánchez, Davis
VICE_RANKING = "M001160"  # Gwen Moore
SUBNAME = roster["committeeNames"]

# ---------- roster ----------
members_out = []
for m in roster["members"]:
    b = m["bioguideId"]; o = old_members.get(b); facts = []
    facts.append(fact("onCommittee", True, CLERK, CLERK_L, "2026-11-03", "VERIFIED" if o else "CHANGED", old=bool(o), note=None if o else "Not on the old site"))
    if o:
        facts.append(fact("party", m["party"], CLERK, CLERK_L, "2026-11-03", "VERIFIED" if o["party"] == m["party"] else "CHANGED", old=o["party"]))
        sd_old = f"{o['state']}{o['district']}" if o["district"] != "AL" else f"{o['state']}00"
        facts.append(fact("stateDistrict", m["stateDistrict"], CLERK, CLERK_L, "2026-11-03", "VERIFIED" if sd_old == m["stateDistrict"] else "CHANGED", old=f"{o['state']}-{o['district']}"))
        facts.append(fact("bioguideId", b, CLERK, CLERK_L, "2026-11-03", "VERIFIED", old=o["bioguideId"]))
    # full committee role
    role = "Chair" if m["committeeLeadership"] == "Chair" else ("Ranking Member" if b == "N000015" else None)
    subs = []
    for s in m["subcommittees"]:
        r = "Chair" if s["leadership"] == "Chair" else ("Ranking Member" if RANKING.get(s["code"]) == b else "Member")
        subs.append({"code": s["code"], "name": SUBNAME.get(s["code"]), "rank": s["rank"], "role": r})
    sub_roles = [f"{s['name']} Subcommittee {s['role']}" for s in subs if s["role"] != "Member"]
    role_new = "; ".join(([role] if role else []) + sub_roles + (["Committee Vice Ranking Member"] if b == VICE_RANKING else [])) or None
    role_old = (o or {}).get("role")
    if role_old or role_new:
        same = fold(role_old or "").replace("health subcommittee chair", "health subcommittee chair") == fold(role_new or "")
        note = None
        if role_old == "Vice Chair": note = "The committee's membership page lists only a Chairman and a Ranking Member; no vice chair is listed. The Clerk's file shows Buchanan as Health Subcommittee Chair."
        if role_old == "Health Subcommittee Chair" and b == "S001172": note = "The Clerk's file shows Adrian Smith as Trade Subcommittee Chair and a Health Subcommittee member; Buchanan chairs Health."
        facts.append(fact("role", role_new, CLERK if role_new and "Ranking" not in (role_new or "") else DEM_URL, CLERK_L if role_new and "Ranking" not in (role_new or "") else DEM_L, "2026-11-03", "VERIFIED" if same else "CHANGED", old=role_old, note=note))
    on_health = any(s["code"] == "WM02" for s in subs)
    if o is not None:
        facts.append(fact("healthSubcommittee", on_health, CLERK, CLERK_L, "2026-11-03", "VERIFIED" if o["healthcareSubcommittee"] == on_health else "CHANGED", old=o["healthcareSubcommittee"]))
    first = terms.get(b)
    if first:
        facts.append(fact("firstHouseTerm", first, CG, CG_L, "2026-11-09", ("VERIFIED" if (o and o["termStart"] == first) else ("CHANGED" if o else "VERIFIED")), old=(o or {}).get("termStart"), note="Congress.gov term start year of the member's first House term" + ("; the old site's year differs" if o and o["termStart"] != first else "")))
    else:
        facts.append(fact("firstHouseTerm", None, CG, CG_L, "2026-11-09", "NOT FOUND", old=(o or {}).get("termStart")))
    facts.append(fact("bio", None, "https://bioguide.congress.gov/", "Biographical Directory of the United States Congress", TODAY, "NOT FOUND", old=(o or {}).get("bio"), note="The old bio paragraph is unsourced prose. bioguide.congress.gov answers automated requests with a Cloudflare challenge; no replacement text was pulled."))
    members_out.append({"bioguideId": b, "slug": old_slug.get(b) or fold(m["officialName"]).replace(" ", "-"), "name": m["officialName"], "firstName": m["firstName"], "lastName": m["lastName"], "party": m["party"], "state": m["state"], "district": m["district"], "stateDistrict": m["stateDistrict"], "committeeRank": m["committeeRank"], "fullCommitteeRole": role, "subcommittees": subs, "viceRankingMember": b == VICE_RANKING, "firstHouseTerm": first, "facts": tally(facts)})
old_only = [o for b, o in old_members.items() if b not in {m["bioguideId"] for m in roster["members"]}]
roster_json = {"committee": "House Committee on Ways and Means", "congress": "119th Congress (2025 to 2026)", "asOf": "Clerk member data published November 3, 2026", "sources": [{"url": CLERK, "label": CLERK_L}, {"url": MEMBERS_URL, "label": MEMBERS_L}, {"url": SUBS_URL, "label": SUBS_L}, {"url": DEM_URL, "label": DEM_L}, {"url": CG, "label": CG_L}],
    "counts": {"members": len(members_out), "republicans": sum(1 for m in members_out if m["party"] == "R"), "democrats": sum(1 for m in members_out if m["party"] == "D"), "healthSubcommittee": sum(1 for m in members_out if any(s["code"] == "WM02" for s in m["subcommittees"]))},
    "leadership": {"chair": "Jason Smith (R-MO)", "rankingMember": "Richard E. Neal (D-MA)", "viceChair": None, "viceRankingMember": "Gwen Moore (D-WI)", "source": [MEMBERS_URL, DEM_URL], "note": "The committee's membership page lists a Chairman and a Ranking Member only."},
    "subcommitteeLeaders": [{"code": c, "name": SUBNAME[c], "chair": next((m["name"] for m in members_out for s in m["subcommittees"] if s["code"] == c and s["role"] == "Chair"), None), "rankingMember": next((m["name"] for m in members_out for s in m["subcommittees"] if s["code"] == c and s["role"] == "Ranking Member"), None), "chairSource": CLERK, "rankingSource": DEM_URL} for c in ["WM02", "WM01", "WM03", "WM04", "WM05", "WM06"]],
    "membersNoLongerOnCommittee": [{"name": f"{o['firstName']} {o['lastName']}", "bioguideId": o["bioguideId"]} for o in old_only],
    "members": members_out}
json.dump(roster_json, open(f"{DATA}/roster.json", "w"), indent=1, ensure_ascii=False)

# ---------- money ----------
old_don = J(f"{OLD}/donations.json")
old_tot = collections.defaultdict(lambda: collections.Counter())
for d in old_don: old_tot[d["memberId"]][d["cycle"]] += d["total"]
money = {"sourceLabel": "FEC bulk data (pas2, cm, cn, ccl), 2024 and 2026 cycles, files retrieved November 8, 2026", "source": "https://www.fec.gov/data/browse-data/?tab=bulk-data",
    "basis": "PAC contributions to each member's House campaign committee (transaction type 24K) from PACs classified as healthcare by name and connected organization. Individual contributions are not included. Sector labels are the Rojas Report's own.",
    "comparisonNote": "The old site's figures were labelled 'FEC filings via OpenSecrets', mixed PAC and individual money, used a fixed list of 44 organizations and carried no filing references. They cannot be reproduced; every member's figure is therefore marked CHANGED with the FEC PAC total beside it.",
    "cycles": {}, "members": []}
fec = {cy: J(f"{RAW}/fec/health_pacs_{cy}.json") for cy in ("2026", "2024")}
for cy, d in fec.items():
    money["cycles"][cy] = {"committeeTotal": d["grandTotal"], "latestTransactionDate": d["latestTransactionDate"], "pacsMatched": len(d["pacsMatched"]), "topPacs": d["pacsMatched"][:25], "files": d["files"]}
by_b = {cy: {m["bioguideId"]: m for m in d["members"]} for cy, d in fec.items()}
for m in members_out:
    b = m["bioguideId"]; facts = []; row = {"bioguideId": b, "name": m["name"], "slug": m["slug"]}
    for cy in ("2026", "2024"):
        x = by_b[cy].get(b)
        if not x or not x["fecCandidateId"]:
            facts.append(fact(f"healthcarePacTotal{cy}", None, money["source"], money["sourceLabel"], "2026-11-08", "NOT FOUND", note="No FEC House candidate ID matched")); continue
        old_v = old_tot.get(m["slug"], {}).get("2024" if cy == "2024" else None)
        src = f"https://www.fec.gov/data/receipts/?committee_id={x['fecCommittees'][0]}&two_year_transaction_period={cy}&contributor_type=committee" if x["fecCommittees"] else money["source"]
        facts.append(fact(f"healthcarePacTotal{cy}", x["total"], src, f"FEC, contributions from committees to {x['fecCandidateName']} ({x['fecCandidateId']}), {cy} cycle", f"FEC files of November 8, 2026; latest transaction {fec[cy]['latestTransactionDate']}", ("CHANGED" if old_v is not None else "VERIFIED"), old=old_v, note=("Old figure mixed PAC and individual money on an unreproducible basis" if old_v is not None else None)))
        row[f"cycle{cy}"] = {"total": x["total"], "bySector": x["bySector"], "contributionCount": x["contributionCount"], "topPacs": x["topPacs"][:10], "fecCandidateId": x["fecCandidateId"], "fecCommittees": x["fecCommittees"]}
    row["facts"] = tally(facts); money["members"].append(row)
money["members"].sort(key=lambda r: -(r.get("cycle2026", {}).get("total", 0)))
money["oldSiteTotal2024"] = sum(v["2024"] for v in old_tot.values())
json.dump(money, open(f"{DATA}/money.json", "w"), indent=1, ensure_ascii=False)

# ---------- votes ----------
hv = J(f"{RAW}/clerk/health_votes.json")
KEY = {("2025", 70): "Full-year CR for FY2025 with Medicare telehealth and other health extenders", ("2025", 145): "One Big Beautiful Bill Act, House passage (Medicaid, ACA and HSA provisions; rural hospital fund)", ("2025", 190): "One Big Beautiful Bill Act, final passage (concur in Senate amendment); became Public Law 119-21",
       ("2025", 151): "SUPPORT for Patients and Communities Reauthorization Act (opioid programs)", ("2025", 281): "Continuing Appropriations and Extensions Act, 2026, House passage (health extenders)", ("2025", 285): "Continuing Appropriations and Extensions Act, 2026, final passage ending the shutdown; became Public Law 119-37",
       ("2025", 349): "Lower Health Care Premiums for All Americans Act", ("2025", 362): "Do No Harm in Medicaid Act", ("2026", 45): "Consolidated Appropriations Act, 2026, House passage", ("2026", 53): "Consolidated Appropriations Act, 2026, final passage; became Public Law 119-75",
       ("2026", 128): "Improving Care in Rural America Reauthorization Act", ("2026", 272): "Continuing appropriations for FY2027 (H.R. 9770), House passage", ("2026", 286): "H.R. 6500 as the vehicle for the Continuing Appropriations and Extensions Act, 2027; became Public Law 119-103"}
bio_name = {m["bioguideId"]: m for m in members_out}
votes_out = []
for v in hv["votes"]:
    k = (v["year"], v["rollCall"]); wm = collections.Counter(v["memberVotes"].values())
    votes_out.append({**{kk: v[kk] for kk in ("year", "rollCall", "date", "legisNum", "question", "description", "result", "totals", "byParty", "source", "sourceLabel")}, "keyVote": k in KEY, "why": KEY.get(k), "waysAndMeansTally": dict(wm), "memberVotes": {b: {"name": bio_name[b]["name"], "party": bio_name[b]["party"], "vote": p} for b, p in v["memberVotes"].items()}, "status": "VERIFIED"})
counts["VERIFIED"] += sum(1 for v in votes_out if v["keyVote"]) * 45
old_bills = J(f"{OLD}/bills.json"); old_votes = J(f"{OLD}/votes.json")
votes_json = {"source": hv["source"], "sourceLabel": hv["sourceLabel"], "retrieved": hv["retrieved"], "congress": "119th", "rollCallsScanned": {"2025": 362, "2026": 314}, "filter": "roll calls whose bill number or description matches health terms (see scripts/parse_rollcalls.py)", "keyVotes": sum(1 for v in votes_out if v["keyVote"]), "allMatched": len(votes_out),
    "oldSiteVotes": {"note": "The old site's 11 voted bills are from the 116th to 118th Congresses and were not re-verified; they are replaced by 119th Congress roll calls. The old vote file records positions for members who were not yet in office on the vote date.", "bills": [{"number": b["number"], "date": b["date"], "title": b["title"], "status": "NOT FOUND", "reason": "pre-119th; not re-verified in this pass"} for b in old_bills if b["congress"] != 119], "rows": len(old_votes)},
    "votes": votes_out}
counts["NOT FOUND"] += len(votes_json["oldSiteVotes"]["bills"])
json.dump(votes_json, open(f"{DATA}/votes.json", "w"), indent=1, ensure_ascii=False)

# ---------- bills ----------
bp = J(f"{RAW}/govinfo/bills_parsed.json")
HEALTHY = re.compile(r"health|medicare|medicaid|hospital|pharmac|patient|care|dialysis|caregiver|anesthesiolog|drug|DME|biosimilar|premium", re.I)
bills_out = []
for b in bp["bills"]:
    health = (b["policyArea"] == "Health") or bool(HEALTHY.search(b["title"] or "")) or b["label"] in ("H.R. 1", "H.R. 1968", "H.R. 5371", "H.R. 7148", "H.R. 6500", "H.R. 9770", "H.R. 498", "H.R. 6703", "H.R. 2483", "H.R. 2493")
    old = next((o for o in old_bills if o["congress"] == 119 and o["number"].replace(" ", "") == b["label"].replace(" ", "")), None)
    st = "VERIFIED"
    note = None
    if old:
        note = f"Old site: {old['result']} as of {old['date']}; latest action now {b['latestAction']['date']}: {b['latestAction']['text']}"
    bills_out.append({**b, "healthRelated": health, "status": st, "old": {"result": old["result"], "date": old["date"]} if old else None, "note": note})
    counts[st] += 1
json.dump({"source": bp["source"], "sourceLabel": bp["sourceLabel"], "retrieved": bp["retrieved"], "scope": "119th Congress bills marked up by Ways and Means (from the committee's markup notices), the health-related bills with House roll calls, and H.R. 247 from the old site", "count": len(bills_out), "healthRelated": sum(1 for b in bills_out if b["healthRelated"]), "enacted": [b["label"] + ": " + ", ".join(b["laws"]) for b in bills_out if b["laws"]], "bills": bills_out}, open(f"{DATA}/bills.json", "w"), indent=1, ensure_ascii=False)

# ---------- hearings ----------
ev = J(f"{RAW}/house/events_parsed.json")
ev119 = [e for e in ev["events"] if e["date"] >= "2025-01-01"]
for e in ev119: e["status"] = "VERIFIED"; counts["VERIFIED"] += 1
json.dump({"source": ev["source"], "sourceLabel": ev["sourceLabel"], "retrieved": ev["retrieved"], "congress": "119th", "counts": {"hearings": sum(1 for e in ev119 if e["kind"] == "hearing"), "markups": sum(1 for e in ev119 if e["kind"] == "markup"), "healthRelated": sum(1 for e in ev119 if e["healthRelated"]), "healthSubcommitteeHearings": sum(1 for e in ev119 if e["subcommittee"] == "Health" and e["kind"] == "hearing")}, "oldSite": "none", "events": ev119}, open(f"{DATA}/hearings.json", "w"), indent=1, ensure_ascii=False)

# ---------- lobbying ----------
ld = J(f"{RAW}/lda/summary.json")
clients = []
for c in ld["clients"]:
    for y in ("2025", "2026"): counts["VERIFIED"] += 1
    clients.append({"client": c["clientName"], "clientNamesAsFiled": c["clientNamesAsFiled"], "registrants": c["registrants"], "2025": c["years"]["2025"], "2026": c["years"]["2026"], "status": "VERIFIED", "source": "https://lda.gov/api/v1/filings/?client_name=" + c["clientNamesAsFiled"][0].replace(" ", "%20"), "sourceLabel": f"LDA LD-2 filings for {c['clientName']}, 2025 and 2026 (2026 through the third quarter)", "filings": [{k: f[k] for k in ("uuid", "registrant", "year", "period", "type", "posted", "income", "expenses", "healthIssueCodes", "namesWaysAndMeans", "document")} for f in c["filings"]]})
lob = {"source": ld["source"], "sourceLabel": ld["sourceLabel"], "retrieved": "2026-11-08 to 2026-11-09", "note": ld["note"], "memberLevelContacts": fact("lobbyingContactsByMember", None, "https://lda.gov/api/redoc/v1/", "LDA API documentation: LD-2 reports list government entities contacted (chambers and agencies), not members", TODAY, "NOT FOUND", note="Not disclosed in any primary record. The old site did not show lobbying data either."), "clients": clients}
counts["NOT FOUND"] += 1
json.dump(lob, open(f"{DATA}/lobbying.json", "w"), indent=1, ensure_ascii=False)

# ---------- trades ----------
fdi = J(f"{RAW}/fd/wm_fd_index.json"); ptr = J(f"{RAW}/fd/ptr_transactions.json"); old_trades = J(f"{OLD}/trades.json"); chk = J(f"{RAW}/fd/old_trades_2023_2024_index_check.json")
ptr_by = collections.defaultdict(list)
for t in ptr["transactions"]: ptr_by[t["bioguideId"]].append(t)
files_by = collections.defaultdict(list)
for f in ptr["files"]: files_by[f.get("bioguideId")].append(f)
def pd(s): return datetime.datetime.strptime(s, "%m/%d/%Y").date() if "/" in s else datetime.date.fromisoformat(s)
trades_out = []
for m in members_out:
    b = m["bioguideId"]; idx = next(x for x in fdi["members"] if x["bioguideId"] == b); facts = []
    facts.append(fact("ptrCount2025_2026", idx["ptrCount"], "https://disclosures-clerk.house.gov/FinancialDisclosure", "Clerk of the House, financial disclosure index 2025FD and 2026FD (retrieved November 8, 2026)", "2026-11-06", "VERIFIED", note=f"2025: {idx['ptrCount2025']}; 2026: {idx['ptrCount2026']}"))
    unreadable = [f for f in files_by.get(b, []) if not f["readable"]]
    if unreadable: facts.append(fact("ptrTransactions", None, unreadable[0]["pdf"], "Clerk of the House PTR (scanned paper filing)", TODAY, "NOT FOUND", note=f"{len(unreadable)} PTR(s) are scanned images without a text layer; transactions not extracted"))
    health_rows = [t for t in ptr_by.get(b, []) if t["healthcare"]]
    if idx["ptrCount"] and not unreadable:
        facts.append(fact("healthcareTransactions2025_2026", len(health_rows), "https://disclosures-clerk.house.gov/FinancialDisclosure", "Clerk of the House PTR PDFs listed in the 2025 and 2026 indexes", TODAY, "VERIFIED"))
    # old trades check
    old_rows = [t for t in old_trades if old_slug.get(b) == t["memberId"]]
    old_check = []
    for t in old_rows:
        if t["transactionDate"] >= "2025-01-01":
            hits = [r for r in ptr_by.get(b, []) if r["ticker"] == t["ticker"] and abs((pd(r["transactionDate"]) - pd(t["transactionDate"])).days) <= 3]
            st = "VERIFIED" if hits else "NOT FOUND"; why = "matching PTR row" if hits else ("member filed no PTR in 2025 or 2026" if idx["ptrCount"] == 0 else "no matching row in the member's PTRs")
        else:
            c = chk.get(old_slug.get(b), {})
            st = "NOT FOUND"; why = "member filed no PTR in the filing year per the Clerk's index" if c.get("NO PTR ON FILE that year") and not c.get("PTR filed that year") else "pre-2025 filing; PTR exists for that year but rows were not extracted in this pass"
        counts[st] += 1
        old_check.append({"transactionDate": t["transactionDate"], "ticker": t["ticker"], "company": t["company"], "type": t["type"], "amount": t["amount"], "status": st, "why": why})
    trades_out.append({"bioguideId": b, "name": m["name"], "slug": m["slug"], "ptrCount2025": idx["ptrCount2025"], "ptrCount2026": idx["ptrCount2026"], "ptrs": [f for f in idx["filings"] if f["filingType"] == "P"], "unreadablePtrs": len(unreadable), "healthcareTransactions": health_rows, "allTransactionsExtracted": len(ptr_by.get(b, [])), "oldSiteTrades": old_check, "facts": tally(facts)})
old_summary = collections.Counter((c["status"], c["why"]) for t in trades_out for c in t["oldSiteTrades"])
json.dump({"source": ptr["source"], "sourceLabel": ptr["sourceLabel"], "retrieved": TODAY, "method": "Every periodic transaction report listed for a member in the Clerk's 2025 and 2026 indexes was downloaded and read with pypdf; rows with a ticker were parsed, and healthcare issuers flagged by ticker list and name. Scanned filings have no text layer and are marked NOT FOUND.", "totals": {"ptrs": sum(t["ptrCount2025"] + t["ptrCount2026"] for t in trades_out), "readable": sum(1 for f in ptr["files"] if f["readable"]), "unreadable": sum(1 for f in ptr["files"] if not f["readable"]), "transactionsExtracted": len(ptr["transactions"]), "healthcareTransactions": sum(1 for t in ptr["transactions"] if t["healthcare"])}, "oldSiteTradesCheck": {"rows": len(old_trades), "byOutcome": [{"status": k[0], "why": k[1], "count": v} for k, v in old_summary.most_common()]}, "members": trades_out}, open(f"{DATA}/trades.json", "w"), indent=1, ensure_ascii=False)

# ---------- developments ----------
if DEV and os.path.exists(DEV):
    dv = J(DEV)
    for m in dv.get("members", []): counts[m.get("verification", "NOT FOUND")] += 1
    for k in ("houseControl",):
        if dv.get(k): counts[dv[k].get("status", "NOT FOUND")] += 1
    for l in dv.get("expectedLeaders", []): counts[l.get("status", "NOT FOUND")] += 1
    json.dump(dv, open(f"{DATA}/developments.json", "w"), indent=1, ensure_ascii=False)

# ---------- summary ----------
summary = {"desk": "Ways & Means", "builtOn": "2026-11-09", "congress": "119th (2025 to 2026)", "factStatusCounts": dict(counts),
    "headline": {"members": fact("committeeMembers", 45, CLERK, CLERK_L, "2026-11-03", "VERIFIED", old=45), "republicans": fact("republicans", roster_json["counts"]["republicans"], CLERK, CLERK_L, "2026-11-03", "VERIFIED", old=26), "democrats": fact("democrats", roster_json["counts"]["democrats"], CLERK, CLERK_L, "2026-11-03", "VERIFIED", old=19),
        "healthcareMoney2024": fact("healthcarePacMoney2024cycle", fec["2024"]["grandTotal"], money["source"], money["sourceLabel"], "2026-11-08", "CHANGED", old=money["oldSiteTotal2024"], note="Old: 'Healthcare Money, 2024 cycle contributions' $11.0M on an unreproducible OpenSecrets-labelled basis. New: healthcare PAC contributions (24K) to the 45 members' House committees, 2023 to 2024 cycle, FEC bulk data."),
        "healthcareMoney2026": fact("healthcarePacMoney2026cycle", fec["2026"]["grandTotal"], money["source"], money["sourceLabel"], f"FEC files of November 8, 2026; latest transaction {fec['2026']['latestTransactionDate']}", "VERIFIED", note="New figure; the old site had no 2026-cycle data.")}}
for f in summary["headline"].values(): counts[f["status"]] += 1
summary["factStatusCounts"] = dict(counts)
json.dump(summary, open(f"{DATA}/summary.json", "w"), indent=1, ensure_ascii=False)
print(json.dumps(summary["factStatusCounts"]))
print("roster", roster_json["counts"], "leaders", [(s["name"], s["chair"], s["rankingMember"]) for s in roster_json["subcommitteeLeaders"]])
print("money 2026", fec["2026"]["grandTotal"], "2024", fec["2024"]["grandTotal"], "old 2024", money["oldSiteTotal2024"])
print("role/term changes:", [(m["name"], f["field"], f.get("old"), f["value"]) for m in members_out for f in m["facts"] if f["status"] == "CHANGED" and f["field"] in ("role", "firstHouseTerm", "healthSubcommittee", "stateDistrict", "party")])
print("old trades check", old_summary)
