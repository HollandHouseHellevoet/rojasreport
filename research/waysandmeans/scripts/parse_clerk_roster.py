"""Parse the Clerk of the House MemberData.xml for the Ways and Means roster (WM00) and its subcommittees.
Usage: python3 -I parse_clerk_roster.py <MemberData.xml> <out.json>
"""
import sys, json, xml.etree.ElementTree as ET
src, out = sys.argv[1], sys.argv[2]
root = ET.parse(src).getroot()
pub = root.get("publish-date")
ti = root.find("title-info")
congress = ti.findtext("congress-num"); session = ti.findtext("session")
# committee code -> name
comnames = {}
for c in root.iter("committee"):
    code = c.get("comcode")
    if code and c.find("committee-fullname") is not None:
        comnames[code] = c.findtext("committee-fullname")
    for sc in c.findall("subcommittee"):
        comnames[sc.get("subcomcode")] = sc.findtext("subcommittee-fullname")
members = []
for m in root.find("members"):
    info = m.find("member-info")
    assigns = m.find("committee-assignments")
    if assigns is None: continue
    wm = [c for c in assigns.findall("committee") if c.get("comcode") == "WM00"]
    if not wm: continue
    subs = [s for s in assigns.findall("subcommittee") if (s.get("subcomcode") or "").startswith("WM")]
    members.append({
        "bioguideId": info.findtext("bioguideID"),
        "lastName": info.findtext("lastname"),
        "firstName": info.findtext("firstname"),
        "officialName": info.findtext("official-name"),
        "party": info.findtext("party"),
        "state": info.find("state").get("postal-code"),
        "district": info.findtext("district"),
        "stateDistrict": m.findtext("statedistrict"),
        "electedDate": (info.find("elected-date").text if info.find("elected-date") is not None else None),
        "swornDate": (info.find("sworn-date").text if info.find("sworn-date") is not None else None),
        "committeeRank": int(wm[0].get("rank")),
        "committeeLeadership": wm[0].get("leadership"),
        "subcommittees": [{"code": s.get("subcomcode"), "name": comnames.get(s.get("subcomcode")), "rank": int(s.get("rank")), "leadership": s.get("leadership")} for s in subs],
    })
members.sort(key=lambda x: (x["party"] != "R", x["committeeRank"]))
json.dump({"source": "https://clerk.house.gov/xml/lists/MemberData.xml", "sourceLabel": "Clerk of the House, Member Data (XML)", "publishDate": pub, "congress": congress, "session": session, "committeeNames": {k: v for k, v in comnames.items() if k.startswith("WM")}, "count": len(members), "members": members}, open(out, "w"), indent=1)
print(pub, congress, session, len(members))
for x in members: print(x["party"], x["committeeRank"], x["stateDistrict"], x["officialName"], x["committeeLeadership"] or "", [(s["code"], s["leadership"]) for s in x["subcommittees"]])
print(json.dumps({k: v for k, v in comnames.items() if k.startswith("WM")}))
