"""Scan House roll-call XML files (clerk.house.gov/evs/YYYY/rollNNN.xml) for health-related votes and record how each
Ways and Means member voted.
Usage: python3 -I parse_rollcalls.py <evs dir with 2025/ 2026/> <roster json> <out json> [--all]
"""
import sys, glob, json, re, datetime, xml.etree.ElementTree as ET
evs, roster_f, out_f = sys.argv[1:4]
roster = json.load(open(roster_f))["members"]
ids = {m["bioguideId"]: m for m in roster}
HEALTH = re.compile(r"health|medicare|medicaid|hospital|\bdrug|pharm|insur|affordable care|obamacare|telehealth|physician|patient|premium tax credit|\bHSA\b|340B|opioid|mental|nursing|\bFDA\b|vaccine|organ|kidney|cancer|rural|disabilit|hospice|home care|caregiver|dialysis|biosimilar|PBM|pharmacy benefit|One Big Beautiful|reconciliation|continuing appropriations|Full-Year Continuing|Consolidated Appropriations|Lower Costs|Protecting Health|Medical", re.I)
votes = []
for year in ("2025", "2026"):
    for f in sorted(glob.glob(f"{evs}/{year}/roll*.xml")):
        try: root = ET.parse(f).getroot()
        except ET.ParseError: continue
        md = root.find("vote-metadata")
        desc = md.findtext("vote-desc") or ""; legis = (md.findtext("legis-num") or "").strip(); q = md.findtext("vote-question") or ""
        text = f"{legis} {desc} {q}"
        num = int(md.findtext("rollcall-num"))
        INCLUDE = {("2026", 286)}  # H.R. 6500 as the vehicle for the Continuing Appropriations and Extensions Act, 2027 (vote description still reads AGOA Extension Act)
        if "--all" not in sys.argv and not HEALTH.search(text) and (year, num) not in INCLUDE: continue
        d =  datetime.datetime.strptime(md.findtext("action-date"), "%d-%b-%Y").date().isoformat()
        tot = md.find("vote-totals/totals-by-vote")
        totals = {k: int(tot.findtext(k) or 0) for k in ("yea-total", "nay-total", "present-total", "not-voting-total")} if tot is not None else {}
        party = {}
        for p in md.findall("vote-totals/totals-by-party"):
            party[p.findtext("party")] = {"yea": int(p.findtext("yea-total") or 0), "nay": int(p.findtext("nay-total") or 0), "present": int(p.findtext("present-total") or 0), "notVoting": int(p.findtext("not-voting-total") or 0)}
        mv = {}
        for rv in root.findall("vote-data/recorded-vote"):
            leg = rv.find("legislator"); bid = leg.get("name-id")
            if bid in ids: mv[bid] = rv.findtext("vote")
        votes.append({"year": year, "rollCall": num, "date": d, "legisNum": legis, "question": q, "description": desc, "result": md.findtext("vote-result"), "totals": totals, "byParty": party,
                      "source": f"https://clerk.house.gov/evs/{year}/roll{num:03d}.xml", "sourceLabel": f"Clerk of the House, Roll Call {num} ({year})", "memberVotes": mv, "wmMembersRecorded": len(mv)})
json.dump({"source": "https://clerk.house.gov/Votes", "sourceLabel": "Clerk of the House, roll-call vote XML", "retrieved": datetime.date.today().isoformat(), "filter": HEALTH.pattern if "--all" not in sys.argv else "all", "count": len(votes), "votes": votes}, open(out_f, "w"), indent=1)
print(len(votes), "votes matched")
for v in votes: print(v["year"], f"{v['rollCall']:3}", v["date"], f"{v['legisNum']:14}", f"{v['question'][:28]:28}", v["result"], "|", v["description"][:90])
