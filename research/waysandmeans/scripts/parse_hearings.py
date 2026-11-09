"""Parse hearing and markup listings saved from waysandmeans.house.gov into JSON.
Usage: python3 -I parse_hearings.py <raw/house dir> <out json>
"""
import sys, re, html, glob, json, datetime
d, out = sys.argv[1], sys.argv[2]
MONTHS = {m: i for i, m in enumerate(["January","February","March","April","May","June","July","August","September","October","November","December"], 1)}
events = []
for kind, pat in (("hearing", "hearings_p*.html"), ("markup", "markups_p*.html")):
    for p in sorted(glob.glob(f"{d}/{pat}")):
        t = open(p, encoding="utf-8", errors="replace").read()
        for b in t.split('<div class="single-event">')[1:]:
            mo = re.search(r'class="month">([^<]+)<', b); da = re.search(r'class="day">([^<]+)<', b); yr = re.search(r'class="year">([^<]+)<', b)
            a = re.search(r'<a href="([^"]+)"\s+class="name"\s*>([^<]+)<', b)
            loc = re.search(r'class="loc">([^<]*)<', b); tm = re.search(r'class="time">\s*<span>([^<]*)<', b)
            if not (mo and da and yr and a): continue
            date = datetime.date(int(yr.group(1)), MONTHS[mo.group(1).strip()], int(da.group(1))).isoformat()
            title = html.unescape(a.group(2).strip())
            sub = None
            m = re.search(r'(Health|Trade|Tax|Oversight|Social Security|Work (?:&|and) Welfare)\s+Subcommittee', title)
            if m: sub = m.group(1).replace(" and ", " & ")
            elif re.search(r'Full Committee', title): sub = "Full Committee"
            events.append({"kind": kind, "date": date, "title": title, "subcommittee": sub, "location": html.unescape(loc.group(1).strip()) if loc else None, "time": tm.group(1).strip() if tm else None, "url": a.group(1), "healthRelated": bool(re.search(r'health|medicare|medicaid|hospital|drug|pharm|physician|patient|kidney|organ|rural|telehealth|nursing|care\b|insurance|opioid|cancer|mental|disab|workforce|Kennedy|HHS|Human Services|\bOz\b|CMS', title, flags=re.I))})
seen = set(); uniq = []
for e in sorted(events, key=lambda x: x["date"], reverse=True):
    if e["url"] in seen: continue
    seen.add(e["url"]); uniq.append(e)
json.dump({"source": "https://waysandmeans.house.gov/hearings/ and https://waysandmeans.house.gov/markups/", "sourceLabel": "Committee on Ways and Means (majority site), hearings and markups listings", "retrieved": datetime.date.today().isoformat(), "count": len(uniq), "events": uniq}, open(out, "w"), indent=1)
print(len(uniq), "events; hearings", sum(1 for e in uniq if e["kind"]=="hearing"), "markups", sum(1 for e in uniq if e["kind"]=="markup"))
print("date range", uniq[-1]["date"], uniq[0]["date"])
for e in uniq:
    if e["healthRelated"]: print(e["date"], e["kind"], "|", e["subcommittee"], "|", e["title"][:110])
