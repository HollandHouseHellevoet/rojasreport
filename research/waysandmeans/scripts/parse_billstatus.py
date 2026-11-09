"""Parse govinfo BILLSTATUS XML files into a bill list.
Usage: python3 -I parse_billstatus.py <raw/govinfo dir> <out json>
"""
import sys, glob, json, datetime, xml.etree.ElementTree as ET
d, out = sys.argv[1], sys.argv[2]
bills = []
for f in sorted(glob.glob(f"{d}/BILLSTATUS-*.xml")):
    try: b = ET.parse(f).getroot().find("bill")
    except ET.ParseError: continue
    if b is None: continue
    typ = b.findtext("type"); num = b.findtext("number"); cong = b.findtext("congress")
    la = b.find("latestAction")
    comms = []
    for c in b.findall("committees/item"):
        acts = [a.findtext("name") for a in c.findall("activities/item")]
        comms.append({"name": c.findtext("name"), "chamber": c.findtext("chamber"), "systemCode": c.findtext("systemCode"), "activities": acts})
    laws = [f"{l.findtext('type')} {l.findtext('number')}" for l in b.findall("laws/item")]
    sp = b.find("sponsors/item")
    typeslug = {"HR": "house-bill", "HRES": "house-resolution", "HJRES": "house-joint-resolution", "S": "senate-bill"}.get(typ, typ.lower())
    bills.append({"congress": int(cong), "type": typ, "number": int(num), "label": {"HR": "H.R.", "HRES": "H.Res.", "HJRES": "H.J.Res."}.get(typ, typ) + " " + num,
        "title": b.findtext("title"), "introducedDate": b.findtext("introducedDate"), "policyArea": b.findtext("policyArea/name"),
        "sponsor": {"name": sp.findtext("fullName"), "bioguideId": sp.findtext("bioguideId"), "party": sp.findtext("party"), "state": sp.findtext("state")} if sp is not None else None,
        "latestAction": {"date": la.findtext("actionDate"), "text": la.findtext("text")} if la is not None else None,
        "committees": comms, "waysAndMeansReferred": any((c.get("systemCode") or "").startswith("hswm") for c in comms),
        "laws": laws, "updateDate": b.findtext("updateDate"),
        "source": f"https://www.congress.gov/bill/{cong}th-congress/{typeslug}/{num}", "sourceLabel": f"Congress.gov / GPO govinfo bill status, {typ} {num} ({cong}th Congress)", "govinfoXml": f"https://www.govinfo.gov/bulkdata/BILLSTATUS/{cong}/{typ.lower()}/BILLSTATUS-{cong}{typ.lower()}{num}.xml"})
bills.sort(key=lambda x: (x["type"], x["number"]))
json.dump({"source": "https://www.govinfo.gov/bulkdata/BILLSTATUS", "sourceLabel": "GPO govinfo bulk data, bill status XML (Library of Congress data)", "retrieved": datetime.date.today().isoformat(), "count": len(bills), "bills": bills}, open(out, "w"), indent=1)
print(len(bills))
for x in bills: print(f"{x['label']:12} {x['policyArea'] or '':24} WM={x['waysAndMeansReferred']} {x['latestAction']['date'] if x['latestAction'] else ''} | {x['title'][:80]} | {(x['latestAction']['text'] if x['latestAction'] else '')[:60]} {x['laws']}")
