"""Pull LD-2 quarterly lobbying filings for named healthcare clients from the Lobbying Disclosure Act API (lda.gov).
Usage: python3 -I lda_pull.py <out dir> <year> <client name> [<client name> ...]
Anonymous limit is 15 requests a minute; this script waits 4.2 seconds between requests and retries 5xx.
Each response page is saved as JSON under <out dir>/<year>/<client slug>_pN.json.
"""
import sys, json, time, urllib.request, urllib.parse, os, re
out, year = sys.argv[1], sys.argv[2]
clients = sys.argv[3:]
API = "https://lda.gov/api/v1/filings/"
def get(url):
    for attempt in range(40):
        try:
            req = urllib.request.Request(url, headers={"Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(65); continue
            if e.code >= 500: time.sleep(min(300, 10 * (attempt + 1))); continue
            raise
        except Exception as e:
            time.sleep(15)
    raise SystemExit("gave up " + url)
os.makedirs(f"{out}/{year}", exist_ok=True)
for c in clients:
    slug = re.sub(r"[^a-z0-9]+", "-", c.lower()).strip("-")
    url = API + "?" + urllib.parse.urlencode({"client_name": c, "filing_year": year, "page_size": 25, "ordering": "-dt_posted"})
    page = 1
    while url:
        f = f"{out}/{year}/{slug}_p{page}.json"
        if os.path.exists(f):
            body = json.load(open(f))["body"]
        else:
            body = get(url); json.dump({"url": url, "fetchedOn": time.strftime("%Y-%m-%d"), "body": body}, open(f, "w")); time.sleep(4.2)
        print(year, c, "page", page, "count", body.get("count"), flush=True)
        url = body.get("next"); page += 1
        if page > 12: break
