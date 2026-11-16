#!/usr/bin/env python3
"""Build the merger inventory and redirect map from source. Run from the rojasreport-merger worktree."""
import csv, json, os, re, subprocess, sys, glob
S = os.environ['S']; W = os.getcwd(); TAFHC = os.path.join(W, '..', 'tafhc')
pages = {p['route']: p for p in json.load(open(S + '/rr_pages.json'))}
def gitdate(path, cwd=W):
    r = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', path], capture_output=True, text=True, cwd=cwd).stdout.strip()
    return r or ''
def jload(p): return json.load(open(os.path.join(W, p)))
def nsrc(obj):
    s = json.dumps(obj); return len(re.findall(r'"(source|sourceLabel|sources|url)"\s*:', s))
live = set(l.strip() for l in open(S + '/live/rojasreport.com_sitemap.urls'))
rows = []  # inventory
red = []   # redirects: (old_url, target_path, reason)
def row(url, title, typ, topic, voice, names, commercial, sources, updated, disp, target, src=''):
    rows.append(dict(url=url, title=title, type=typ, topic=topic, voice=voice, names=names, commercial=commercial, sources=sources, updated=updated, disposition=disp, target=target, source_file=src))
def rr(path, title, typ, topic, voice, names, commercial, sources, updated, disp, target, src='', redirect=True):
    url = 'https://rojasreport.com' + path
    row(url, title, typ, topic, voice, names, commercial, sources, updated, disp, target, src)
    if redirect and target: red.append((url, target, disp))
INST = 'institutional, third person'
# ---------- rojasreport.com static routes ----------
static = {
 '/': ('Home', 'utility', 'all', INST, 'no', 'Support link, newsletter link', 'home key figures sourced in data', 'Merge into existing Alliance page: tafhc.org home', '/'),
 '/drivers': ('The Cost Drivers', 'cost-driver brief', 'all six drivers', INST, 'no', 'none', 'drivers.json: 3 of 6 figures sourced, 3 pending', 'Migrate and rewrite to Alliance voice (becomes the Intelligence cost-driver index; II, IV, V figures pending)', '/drivers/'),
 '/states': ('The States', 'state dossier', 'certificate of need, state subsidies', INST, 'no', 'none', 'map and tiers from data/overview.json', 'Migrate as is (Intelligence: States)', '/states/'),
 '/systems': ('Health Systems', 'system profile', 'hospital subsidies', INST, 'no', 'none', 'index page', 'Migrate as is (Intelligence: Health Systems)', '/systems/'),
 '/carriers': ('Carriers', 'utility', 'carriers (planned)', INST, 'no', 'none', 'none (no desk live)', 'Migrate as is (section placeholder; all desks planned)', '/carriers/'),
 '/physician-owned': ('Physician-Owned', 'utility', 'physician ownership', INST, 'no', 'none', 'index page', 'Merge into existing Alliance page: /fights/physician-ownership/ links here as the research section', '/physician-owned/'),
 '/government': ('Government', 'committee page', 'committees, agencies', INST, 'no', 'none', 'index page', 'Migrate as is (Intelligence: Government)', '/government/'),
 '/lobby': ('The Lobby', 'lobby dossier', 'hospital lobby', INST, 'no', 'none', 'index page', 'Migrate as is (Intelligence: The Lobby)', '/lobby/'),
 '/tracker': ('The Tracker: where the fights stand', 'tracker', 'all fights', INST, 'no', 'none', 'fights.json 8 rows, notes cite rules; no per-row URL', 'Merge into existing Alliance page: tafhc.com /fights/ status tracker (two status models, see Conflicts)', '/tracker/'),
 '/reports': ('Reports & Data', 'product', 'datasets', INST, 'no', 'three datasets offered, no prices', 'n/a', 'Hold for decision: dataset sales under the Alliance (nonmember income, prices unset)', '/research/data/'),
 '/support': ('Support the Report', 'support', 'n/a', INST, 'no', 'Reader $10 / Patron $25 / Founder $100 monthly, paid to Rojas Media', 'n/a', 'Retire: Rojas Media product, converts to Alliance giving (parent page: Give)', '/give/'),
 '/partners': ('Rojas Intelligence Partners', 'membership', 'n/a', INST, 'no', 'Partners by application, sold by Rojas Intelligence (noindex, unlinked)', 'n/a', 'Retire: Rojas Media product; audience goes to Alliance For Partners (parent page)', '/partners/'),
 '/builders-table': ('The Builders Table', 'membership', 'n/a', INST, 'no', '$25,000/yr, 100 seats, by application (dormant, noindex)', 'n/a', 'Retire: Dutch 2026-11-16; Council replaces it (parent page: For Physicians)', '/physicians/'),
 '/search': ('Search', 'utility', 'n/a', INST, 'no', 'none', 'n/a', 'Migrate as is (index rebuilt for the merged site)', '/search/'),
 '/privacy': ('Privacy Policy', 'legal', 'n/a', INST, 'no', 'none', 'n/a', 'Merge into existing Alliance page: /privacy/ (Alliance policy, counsel)', '/privacy/'),
 '/methodology': ('Methodology', 'utility', 'sourcing', INST, 'no', 'none', 'data sources table', 'Migrate and rewrite to Alliance voice (publisher refs, correction link to read.rojasreport.com)', '/methodology/'),
 '/methodology/subsidy-ledger': ('The Subsidy Ledger | Methodology', 'utility', 'hospital subsidies', INST, 'no', 'none', '19 ledger lines, each with filing source', 'Migrate and rewrite to Alliance voice (correction link; "Rojas Report estimate" labels)', '/methodology/subsidy-ledger/'),
 '/methodology/state-grade': ('The State Grade | Methodology', 'utility', 'state grades', INST, 'no', 'none', 'formula + NC worked example', 'Migrate and rewrite to Alliance voice (correction link)', '/methodology/state-grade/'),
 '/methodology/machine-score': ('The Machine Score | Methodology', 'utility', 'lawmaker scoring', INST, 'no', 'none', 'draft rules, no scores', 'Hold for decision: Dutch 2026-11-16 "wait"; methodology may migrate, no scores', '/methodology/machine-score/'),
 '/academic': ('The AMC Debt Trap', 'system profile', 'hospital subsidies, academic medical centers', 'editorial, third person (em dash in lede)', 'yes (institution leaders)', 'JSON-LD author Dutch Rojas, publisher Rojas Media LLC', 'bond disclosures, 6 source hits', 'Migrate and rewrite to Alliance voice (JSON-LD, publisher, lede)', '/academic/'),
 '/aha': ('Who Controls American Hospital Policy', 'lobby dossier', 'hospital lobby', INST, 'yes (36 board members)', 'Rojas Intelligence mention', 'layout + profiles.json sourced', 'Migrate as is (rebrand layout strings)', '/aha/'),
 '/aha/about': ('About the AHA Dossiers', 'lobby dossier', 'hospital lobby', INST, 'no', 'none', '4 source hits', 'Migrate and rewrite to Alliance voice (about text names the Report)', '/aha/about/'),
 '/aha/powermap': ('AHA Power Map', 'lobby dossier', 'hospital lobby, site-neutral, 340B', INST, 'yes', 'none', 'powermap.json, lastUpdated Nov 6 2026', 'Migrate as is (rebrand; $170B figure in Conflicts)', '/aha/powermap/'),
 '/fah': ('Federation of American Hospitals', 'lobby dossier', 'hospital lobby', INST, 'yes (9 board)', 'none', '7 source hits', 'Migrate as is (rebrand layout strings)', '/fah/'),
 '/fah/lobbying': ('FAH Lobbying: The Machine', 'lobby dossier', 'hospital lobby', 'editorial, third person', 'yes (firms, lobbyists)', 'none', 'LDA filings, 8 source hits', 'Migrate as is (rebrand; title "The machine" is an editorial call, see Phase 4)', '/fah/lobbying/'),
 '/fah/pac': ('FAH PAC: FEDPAC Money by Cycle', 'lobby dossier', 'hospital lobby', INST, 'yes (recipients)', 'none', 'FEC Schedule B, 6 source hits', 'Migrate as is (rebrand)', '/fah/pac/'),
 '/fah/pillars': ('The Eight Pillars: Where FAH Stands', 'lobby dossier', 'all fights', INST, 'no', 'none', 'pillars.json sourced', 'Migrate as is (rebrand)', '/fah/pillars/'),
 '/hac': ('Healthcare Advisory Committee', 'committee page', 'CMS advisory', INST, 'yes (18 members)', 'none', 'members.json sourced', 'Migrate as is (rebrand layout strings)', '/hac/'),
 '/hac/pattern-analysis': ('Healthcare Advisory Committee: Pattern Analysis', 'committee page', 'CMS advisory', 'editorial, third person', 'yes', 'none', 'members.json', 'Migrate as is (rebrand)', '/hac/pattern-analysis/'),
 '/con': ('Certificate of Need Laws by State', 'state dossier', 'certificate of need', INST, 'no', 'none', 'data/*.json', 'Migrate as is (Intelligence: research, no fight)', '/con/'),
 '/con/methodology': ('CON Classification Methodology', 'utility', 'certificate of need', INST, 'no', 'none', '5 source hits', 'Migrate as is (rebrand)', '/con/methodology/'),
 '/rankings': ('CON Law Rankings | 50-State Certificate of Need Index', 'state dossier', 'certificate of need', INST, 'no', 'none', 'rankings.json', 'Migrate as is, move under /con/', '/con/rankings/'),
 '/scope': ('CON Scope Matrix', 'state dossier', 'certificate of need', INST, 'no', 'none', 'scope-matrix.json', 'Migrate as is, move under /con/', '/con/scope/'),
 '/compare': ('Compare CON Laws | Side-by-Side State Analysis', 'state dossier', 'certificate of need', INST, 'no', 'none', 'data/states', 'Migrate as is, move under /con/ (last code change April 2026, check it still builds)', '/con/compare/'),
 '/evidence': ('The Evidence Against CON Laws | Research', 'insight', 'certificate of need', INST, 'no', 'none', 'evidence.json, 9 source hits', 'Migrate as is, move under /con/', '/con/evidence/'),
 '/outcomes': ('CON Repeal Outcomes', 'insight', 'certificate of need', INST, 'no', 'none', 'outcomes.json', 'Migrate as is, move under /con/', '/con/outcomes/'),
 '/reform': ('CON Reform Tracker 2026', 'tracker', 'certificate of need', INST, 'no', 'none', 'reform-tracker.json', 'Migrate as is, move under /con/ (state tracker, research only)', '/con/reform/'),
 '/timeline': ('History of CON Laws 1946-2025', 'insight', 'certificate of need', INST, 'no', 'none', 'timeline.json', 'Migrate as is, move under /con/', '/con/timeline/'),
 '/poh': ('Physician-owned hospitals', 'cost-driver brief', 'physician ownership', INST, 'no', 'none', 'meta.json sourced (CMS FY2027 IPPS proposed rule)', 'Migrate as is (250+ vs 240+ in Conflicts)', '/poh/'),
 '/poh/investigation': ('Section 6001: the ban on physician-owned hospitals', 'cost-driver brief', 'physician ownership', INST, 'no', 'none', '12 source hits', 'Migrate as is; link from /fights/physician-ownership/ (overlap, see Phase 1)', '/poh/investigation/'),
 '/poh/evidence': ('The evidence on physician-owned hospitals', 'insight', 'physician ownership', INST, 'no', 'none', '9 source hits', 'Migrate as is', '/poh/evidence/'),
 '/poh/hospitals': ('Every physician-owned hospital', 'insight', 'physician ownership', INST, 'no (institutions)', 'none (list free since Nov 13)', 'hospitals.json 176 rows sourced', 'Migrate as is', '/poh/hospitals/'),
 '/poh/states': ('Physician-owned hospitals by state', 'insight', 'physician ownership', INST, 'no', 'none', 'meta.json', 'Migrate as is', '/poh/states/'),
}
for path, (title, typ, topic, voice, names, com, src, disp, target) in static.items():
    p = pages.get(path, {}); upd = p.get('updated', '')
    rr(path + ('/' if path != '/' else ''), title, typ, topic, voice, names, com, src, upd, disp, target, p.get('file', ''))
# ---------- rojasreport.com dynamic routes ----------
def dyn(route_file, data_file, items, urlfn, title_fn, typ, topic, names, disp_fn, target_fn, src_note):
    upd = max(gitdate(route_file), gitdate(data_file))
    for it in items:
        rr(urlfn(it), title_fn(it), typ, topic, INST, names, 'none', src_note, upd, disp_fn(it), target_fn(it), route_file)
aha = jload('src/data/aha/profiles.json')
dyn('src/app/aha/profiles/[slug]/page.tsx', 'src/data/aha/profiles.json', aha, lambda p: f"/aha/profiles/{p['slug']}/", lambda p: f"{p.get('name', p['slug'])}: AHA Dossier", 'lobby dossier', 'hospital lobby', 'yes (named board member)', lambda p: 'Migrate as is (rebrand; dossier naming an individual: review standard in Phase 4)', lambda p: f"/aha/profiles/{p['slug']}/", f'profiles.json, {nsrc(aha)} source/url fields')
fb = jload('src/data/fah/board.json')
dyn('src/app/fah/board/[slug]/page.tsx', 'src/data/fah/board.json', fb, lambda b: f"/fah/board/{b['slug']}/", lambda b: f"{b.get('name', b['slug'])} | FAH board", 'lobby dossier', 'hospital lobby', 'yes (named director)', lambda b: 'Migrate as is (rebrand; names an individual)', lambda b: f"/fah/board/{b['slug']}/", f'board.json, {nsrc(fb)} source/url fields')
fp = jload('src/data/fah/pillars.json')
dyn('src/app/fah/pillars/[slug]/page.tsx', 'src/data/fah/pillars.json', fp, lambda x: f"/fah/pillars/{x['slug']}/", lambda x: f"FAH pillar: {x.get('title', x['slug'])}", 'lobby dossier', 'all fights', 'no', lambda x: 'Migrate as is (rebrand)', lambda x: f"/fah/pillars/{x['slug']}/", f'pillars.json, {nsrc(fp)} source/url fields')
hm = jload('src/data/hac/members.json')
dyn('src/app/hac/members/[slug]/page.tsx', 'src/data/hac/members.json', hm, lambda m: f"/hac/members/{m['slug']}/", lambda m: f"{m.get('name', m['slug'])} | HAC", 'committee page', 'CMS advisory', 'yes (named member)', lambda m: 'Migrate as is (rebrand; names an individual)', lambda m: f"/hac/members/{m['slug']}/", f'members.json, {nsrc(hm)} source/url fields')
states = sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(W, 'data/states/*.json')))
sd = gitdate('data/states'); 
for s in states:
    name = s.replace('-', ' ').title().replace('Dc', 'DC')
    disp = 'Migrate as is (full state dossier; NC only)' if s == 'north-carolina' else 'Migrate as is (CON state page; dossier in preparation)'
    rr(f"/states/{s}/", f"{name} | States", 'state dossier', 'certificate of need' + (', subsidies, officials' if s == 'north-carolina' else ''), INST, 'yes (officials, NC)' if s == 'north-carolina' else 'no', 'none', 'data/states/%s.json' % s + (' + src/data/states/nc.json (sourced fields)' if s == 'north-carolina' else ''), max(sd, gitdate(f'data/states/{s}.json')), disp, f"/states/{s}/", 'src/app/states/[state]/page.tsx')
rr('/con/north-carolina/', 'Certificate of Need Laws in North Carolina', 'state dossier', 'certificate of need', INST, 'no', 'none', 'data/states/north-carolina.json', gitdate('src/app/con/[state]/page.tsx'), 'Migrate as is', '/con/north-carolina/', 'src/app/con/[state]/page.tsx')
rr('/systems/commonspirit/', 'CommonSpirit Health | Health Systems', 'system profile', 'hospital subsidies, 340B', INST, 'no (institution; executives not profiled)', 'none', f"commonspirit.json, {nsrc(jload('src/data/systems/commonspirit.json'))} source fields", max(gitdate('src/app/systems/[slug]/page.tsx'), gitdate('src/data/systems/commonspirit.json')), 'Migrate as is (rebrand "Rojas Report estimate" labels)', '/systems/commonspirit/', 'src/app/systems/[slug]/page.tsx')
for c, nm in [('senate-finance', 'Senate Finance'), ('ways-and-means', 'House Ways and Means')]:
    rr(f'/committees/{c}/', f'{nm} | Government', 'committee page', 'committees', INST, 'yes (roster)', 'none', f'{c}.json sourced', max(gitdate('src/app/committees/[slug]/page.tsx'), gitdate(f'src/data/committees/{c}.json')), 'Migrate as is (rebrand; Machine Score column stays a dash)', f'/committees/{c}/', 'src/app/committees/[slug]/page.tsx')
rr('/committees/ways-and-means/members/', 'Members | House Ways and Means', 'committee page', 'committees', INST, 'yes', 'none', 'members.json', gitdate('src/app/committees/[slug]/members/page.tsx'), 'Migrate as is', '/committees/ways-and-means/members/', 'src/app/committees/[slug]/members/page.tsx')
rr('/committees/ways-and-means/votes/', 'Key health votes | House Ways and Means', 'committee page', 'committees', INST, 'yes', 'none', 'votes.json', gitdate('src/app/committees/[slug]/votes/page.tsx'), 'Migrate as is', '/committees/ways-and-means/votes/', 'src/app/committees/[slug]/votes/page.tsx')
wm = jload('src/data/committees/wm/members.json')
dyn('src/app/committees/[slug]/members/[member]/page.tsx', 'src/data/committees/wm/members.json', wm, lambda m: f"/committees/ways-and-means/members/{m['slug']}/", lambda m: f"{m.get('name', m['slug'])} | House Ways and Means", 'committee page', 'committees', 'yes (member of Congress)', lambda m: 'Migrate as is (rebrand; names an individual; PAC money and votes sourced)', lambda m: f"/committees/ways-and-means/members/{m['slug']}/", f'members.json, {nsrc(wm)} source/url fields')
wv = jload('src/data/committees/wm/votes.json')
dyn('src/app/committees/[slug]/votes/[vote]/page.tsx', 'src/data/committees/wm/votes.json', wv, lambda v: f"/committees/ways-and-means/votes/{v['id']}/", lambda v: f"Vote {v['id']} | House Ways and Means", 'committee page', 'committees', 'yes (votes by member)', lambda v: 'Migrate as is', lambda v: f"/committees/ways-and-means/votes/{v['id']}/", f'votes.json, {nsrc(wv)} source/url fields')
pm = jload('src/data/poh/meta.json')
for s in pm['states']:
    rr(f"/poh/states/{s['slug']}/", f"Physician-owned hospitals in {s['name']}", 'insight', 'physician ownership', INST, 'no', 'none', 'hospitals.json rows sourced', gitdate('src/app/poh/states/[state]/page.tsx'), 'Migrate as is', f"/poh/states/{s['slug']}/", 'src/app/poh/states/[state]/page.tsx')
# ---------- rojasreport.com retired section paths and non-page files ----------
for old, new, note in [('/washington/', '/government/', 'retired Nov 2026 (already 301 on rojasreport.com)'), ('/fights/', '/drivers/', 'retired Nov 2026 (rojasreport /fights was the cost-driver index; Alliance /fights/ is a different page)'), ('/physicians/', '/physician-owned/', 'retired Nov 2026 (rojasreport /physicians was the physician-owned section)')]:
    rr(old, 'retired section URL', 'utility', 'n/a', 'n/a', 'no', 'none', 'n/a', '2026-11-06', f'Retire: {note}', new)
for old, new in [('/sitemap.xml', '/sitemap.xml'), ('/robots.txt', '/robots.txt'), ('/llms.txt', '/llms.txt')]:
    rr(old, old.strip('/'), 'utility', 'n/a', 'n/a', 'no', 'none', 'n/a', '', 'Migrate as is (regenerated for tafhc.org)', new)
briefs = sorted(os.listdir(os.path.join(W, 'public/briefs')))
for b in briefs:
    rr(f'/briefs/{b}', f'Brief download {b}', 'insight', 'certificate of need', INST, 'no', 'none', 'generated from data/states', gitdate('public/briefs'), 'Migrate as is', f'/briefs/{b}')
# ---------- legacy apex URLs (old CON single-page site; 404 today, 301 from conlaws.) ----------
legacy = [l.strip().replace('https://rojasreport.com', '') for l in open(os.path.join(W, 'sitemap.xml')).read().split('<loc>')[1:]]
legacy = [re.sub(r'</loc>.*', '', l, flags=re.S).strip() for l in legacy]
def legacy_target(p):
    m = re.match(r'^/([a-z-]+)/certificate-of-need$', p)
    if m:
        st = {'dc': 'washington-dc'}.get(m.group(1), m.group(1))
        note = 'Retire: old CON state page (404 today) to the state page'
        if m.group(1) == 'washington': note = 'Retire: old CON state page (301 via the /washington/* rule today, then 404) to the state page'
        return f'/states/{st}/', note
    return {'/': ('/', 'home'), '/about': ('/about/', 'Retire: old About (404 today) to Alliance About'), '/certificate-of-need': ('/con/', 'Retire: old CON index to the CON desk'), '/340b-drug-pricing': ('/fights/340b/', 'Retire: old 340B page (404 today) to the 340B fight'), '/hospital-monopolies': ('/systems/', 'Retire: old hospital monopolies page (404 today) to Health Systems (parent page)'), '/idr-no-surprises-act': ('/fah/pillars/idr/', 'Retire: old IDR page (404 today) to the closest live content, the FAH IDR pillar (parent page)'), '/hospital-monopolies/university-of-michigan': ('/academic/', 'Retire: old U-M page (404 today) to the academic medical centers desk (parent page)')}.get(p, (None, None))
for p in legacy:
    if p == '/': continue
    t, note = legacy_target(p)
    for host in ['https://rojasreport.com', 'https://conlaws.rojasreport.com']:
        url = host + p
        row(url, f'legacy CON site: {p}', 'state dossier' if 'certificate-of-need' in p else 'insight', 'certificate of need' if 'certificate-of-need' in p else 'legacy', INST, 'no', 'none', 'n/a (old site)', '2026-04', note, t, 'sitemap.xml (repo root, old site)')
        red.append((url, t, note))
for p, t, note in [('/investigations/con', '/con/', 'legacy pattern'), ('/investigations/con-laws', '/con/', 'legacy pattern'), ('/investigations/340b', '/fights/340b/', 'legacy pattern'), ('/investigations/idr', '/fah/pillars/idr/', 'legacy pattern (parent page)'), ('/investigations/hospital-monopolies', '/systems/', 'legacy pattern (parent page)'), ('/con', '/con/', 'legacy pattern; the live site already 301s /con to /con/, kept so the hop is direct'), ('/340b', '/fights/340b/', 'legacy pattern'), ('/idr', '/fah/pillars/idr/', 'legacy pattern (parent page)')]:
    for host in ['https://rojasreport.com', 'https://conlaws.rojasreport.com']:
        row(host + p, 'legacy redirect pattern', 'utility', 'legacy', 'n/a', 'no', 'none', 'n/a', '2026-04', 'Retire: ' + note, t, '_redirects (repo root, old site)'); red.append((host + p, t, note))
row('https://conlaws.rojasreport.com/', 'conlaws front page', 'utility', 'certificate of need', 'n/a', 'no', 'none', 'n/a', '2026-11-14', 'Retire: alias front page to the CON desk', '/con/', 'public/_redirects'); red.append(('https://conlaws.rojasreport.com/', '/con/', 'alias'))
row('https://www.rojasreport.com/*', 'www alias', 'utility', 'n/a', 'n/a', 'no', 'none', 'n/a', '', 'Retire: www mirrors apex, same targets', '/:splat', 'Netlify DNS'); red.append(('https://www.rojasreport.com/*', '/:splat', 'www alias, same map as apex'))
# ---------- subdomains ----------
def sub(url, title, typ, topic, names, upd, disp, target, src):
    row(url, title, typ, topic, INST, names, 'none', 'see merged page', upd, disp, target, src); red.append((url, target, disp))
H = 'https://aha.rojasreport.com'
sub(H + '/', 'AHA dossiers (old subdomain)', 'lobby dossier', 'hospital lobby', 'yes', '2026-11-06', 'Retire: already 301 to rojasreport.com/aha/; repoint to tafhc.org', '/aha/', 'AmericanHospitalAssociation aha-site/public/_redirects')
for p, t in [('/about/', '/aha/about/'), ('/powermap/', '/aha/powermap/'), ('/privacy/', '/privacy/')]:
    sub(H + p, f'AHA {p}', 'lobby dossier' if p != '/privacy/' else 'legal', 'hospital lobby', 'no', '2026-11-06', 'Retire: already 301; repoint', t, 'AmericanHospitalAssociation')
for p in aha: sub(H + f"/profiles/{p['slug']}/", f"AHA profile {p['slug']} (old)", 'lobby dossier', 'hospital lobby', 'yes', '2026-11-06', 'Retire: already 301; repoint', f"/aha/profiles/{p['slug']}/", 'AmericanHospitalAssociation')
H = 'https://hac.rojasreport.com'
sub(H + '/', 'HAC (old subdomain)', 'committee page', 'CMS advisory', 'yes', '2026-11-06', 'Retire: already 301; repoint', '/hac/', 'hac-old public/_redirects')
sub(H + '/pattern-analysis/', 'HAC pattern analysis (old)', 'committee page', 'CMS advisory', 'yes', '2026-11-06', 'Retire: already 301; repoint', '/hac/pattern-analysis/', 'hac-old')
for m in hm: sub(H + f"/members/{m['slug']}/", f"HAC member {m['slug']} (old)", 'committee page', 'CMS advisory', 'yes', '2026-11-06', 'Retire: already 301; repoint', f"/hac/members/{m['slug']}/", 'hac-old')
sub('https://academic.rojasreport.com/', 'AMC Debt Trap (old subdomain)', 'system profile', 'academic medical centers', 'yes', '2026-11-06', 'Retire: already 301; repoint', '/academic/', 'AiandAmc public/_redirects')
H = 'https://fah.rojasreport.com'
sub(H + '/', 'FAH (old subdomain, GitHub Pages)', 'lobby dossier', 'hospital lobby', 'yes', '2026-11-06', 'Retire: meta refresh today, no 301; DNS move gives a true 301', '/fah/', 'FAH-Rojas-Report')
sub(H + '/lobbying/', 'FAH lobbying (old)', 'lobby dossier', 'hospital lobby', 'yes', '2026-11-06', 'Retire: meta refresh today', '/fah/lobbying/', 'FAH-Rojas-Report')
sub(H + '/pac/', 'FAH PAC (old)', 'lobby dossier', 'hospital lobby', 'yes', '2026-11-06', 'Retire: meta refresh today', '/fah/pac/', 'FAH-Rojas-Report')
sub(H + '/board/', 'FAH board index (old)', 'lobby dossier', 'hospital lobby', 'yes', '2026-11-06', 'Retire: no board index on the merged site; parent page', '/fah/', 'FAH-Rojas-Report')
sub(H + '/pillars/', 'FAH pillars (old)', 'lobby dossier', 'all fights', 'no', '2026-11-06', 'Retire: meta refresh today', '/fah/pillars/', 'FAH-Rojas-Report')
newb = {b['slug'] for b in fb}
for s in ['bonick', 'dill', 'hammons', 'hazen', 'jay', 'miller', 'reddy', 'sutaria', 'tarr']:
    t = f'/fah/board/{s}/' if s in newb else '/fah/'
    sub(H + f'/board/{s}.html', f'FAH board {s} (old)', 'lobby dossier', 'hospital lobby', 'yes', '2026-11-06', 'Retire: meta refresh today' + ('' if s in newb else '; left the board for 2027: parent page'), t, 'FAH-Rojas-Report')
for s in ['340b', 'con-laws', 'consolidation', 'idr', 'poh-ban', 'scope', 'site-neutral', 'transparency']:
    sub(H + f'/pillars/{s}.html', f'FAH pillar {s} (old)', 'lobby dossier', 'all fights', 'no', '2026-11-06', 'Retire: meta refresh today', f'/fah/pillars/{s}/', 'FAH-Rojas-Report')
H = 'https://poh.rojasreport.com'
pohmap = {'/': '/poh/', '/investigation/': '/poh/investigation/', '/data-explorer/': '/poh/hospitals/', '/evidence/': '/poh/evidence/', '/states/': '/poh/states/', '/about/': '/poh/'}
for l in open(S + '/live/poh.rojasreport.com_sitemap.urls'):
    p = l.strip().replace(H, '')
    if p in pohmap: t = pohmap[p]
    else:
        st = p.split('/')[2].lower(); t = f'/poh/states/{st}/' if st in {s['slug'] for s in pm['states']} else '/poh/states/'
    parent = '' if 'states/' not in p or t != '/poh/states/' else ' (no hospital left on the list: parent page)'
    if p.startswith('/states/') and p != '/states/':
        sub(H + p, f'POH {p} (old subdomain, sitemap form)', 'insight', 'physician ownership', 'no', '2026-11-13', 'Retire: 301 to the lowercase path today; RRI PR 3 merged 2026-11-16, PR 4 (force) open; repoint' + parent, t, 'rri-poh-redirect apps/poh/public/_redirects')
        sub(H + p.lower(), f'POH {p.lower()} (old subdomain, served form)', 'insight', 'physician ownership', 'no', '2026-11-13', 'Retire: serves 200 today; repoint' + parent, t, 'rri-poh-redirect apps/poh/public/_redirects')
    else:
        sub(H + p, f'POH {p} (old subdomain)', 'insight', 'physician ownership', 'no', '2026-11-13', 'Retire: serves 200 today; RRI PR 3 merged 2026-11-16, PR 4 (force) open; repoint to tafhc.org', t, 'rri-poh-redirect apps/poh/public/_redirects')
H = 'https://waysandmeans.rojasreport.com'
sub(H + '/', 'Ways and Means (old subdomain)', 'committee page', 'committees', 'yes', '2026-11-12', 'Retire: already 301; repoint', '/committees/ways-and-means/', 'Waysandmeans public/_redirects')
for m in wm: sub(H + f"/member/{m['slug']}", f"W&M member {m['slug']} (old)", 'committee page', 'committees', 'yes', '2026-11-12', 'Retire: already 301; repoint', f"/committees/ways-and-means/members/{m['slug']}/", 'Waysandmeans')
for b in ['hr-3421-118', 'hr-3284-118', 'hr-2-117', 'hr-3-116', 'hr-1319-117', 'hr-3076-117', 'hr-987-116', 'hr-8800-117', 'hr-2474-118', 'hr-5378-118', 'hr-4822-118', 'hr-247-119']:
    sub(H + f'/bill/{b}', f'W&M bill {b} (old, 116th-118th votes)', 'committee page', 'committees', 'yes', '2026-11-12', 'Retire: old bill pages not ported (unverified April 2026 data); key-votes list (parent page)', '/committees/ways-and-means/votes/', 'Waysandmeans')
row('https://read.rojasreport.com/*', 'The Rojas Report newsletter (Substack, 236 posts)', 'article', 'all', 'first person, Dutch', 'varies', 'paid tier $300/yr (Dutch, personal)', 'per post', '2026-11', 'Excluded: stays with Dutch Rojas as his personal newsletter (decision 7, option B); not redirected', '', 'DNS: Substack custom domain')
# ---------- tafhc.com (copy source only; no redirects) ----------
T = 'https://tafhc.com'
tp = {
 '/': ('Home', 'utility', 'all three fights', 'none (Join, Give links)', 'FightTiles sourced (HCCI 2025, NEJM 2024, CMS 91 FR 50104)', 'src/pages/index.astro'),
 '/about/': ('About', 'utility', 'mission', 'none', '1 footnote; board placeholders hidden', 'src/pages/about.astro'),
 '/contact/': ('Contact', 'utility', 'n/a', 'Formspree form (shared endpoint)', 'n/a', 'src/pages/contact.astro'),
 '/fights/': ('Our Fights', 'tracker', 'all three fights', 'none', 'fights.json stages', 'src/pages/fights/index.astro'),
 '/fights/340b/': ('340B Reform', 'cost-driver brief', '340B', 'Join band', '11 footnotes (CBO publication number mismatch, see Conflicts)', 'src/pages/fights/340b.astro'),
 '/fights/site-neutral/': ('Site-Neutral Payment', 'cost-driver brief', 'site-neutral', 'Join band', '9 footnotes', 'src/pages/fights/site-neutral.astro'),
 '/fights/physician-ownership/': ('Physician Ownership', 'cost-driver brief', 'physician ownership', 'Join band', '14 footnotes', 'src/pages/fights/physician-ownership.astro'),
 '/give/': ('Give', 'support', 'n/a', 'giving presets (closed, waitlist)', 'n/a', 'src/pages/give.astro'),
 '/how-we-win/': ('How We Win', 'utility', 'all', 'none', 'timeline.json', 'src/pages/how-we-win.astro'),
 '/insights/': ('Insights', 'insight', 'all', 'none', 'index', 'src/pages/insights/[...page].astro'),
 '/insights/340b-purchases-by-hospital-type/': ('340B purchases by hospital type', 'insight', '340B', 'none', 'numbers[] sourced, PDF', 'src/content/insights/340b-purchases-by-hospital-type.mdx'),
 '/insights/what-independent-practice-lost-after-section-6001/': ('What independent practice lost after Section 6001', 'insight', 'physician ownership', 'none', 'numbers[] sourced, PDF', 'src/content/insights/what-independent-practice-lost-after-section-6001.mdx'),
 '/insights/where-the-facility-fee-goes/': ('Where the facility fee goes', 'insight', 'site-neutral', 'none', 'numbers[] sourced, PDF', 'src/content/insights/where-the-facility-fee-goes.mdx'),
 '/newsroom/': ('Newsroom', 'utility', 'n/a', 'none', 'press drafts hidden', 'src/pages/newsroom.astro'),
 '/partners/': ('For Partners', 'membership', 'n/a', 'partner inquiry form', 'n/a', 'src/pages/partners.astro'),
 '/physicians/': ('For Independent Physicians', 'membership', 'n/a', '$25/month (superseded by $50)', '1 footnote', 'src/pages/physicians/index.astro'),
 '/physicians/join/': ('Join', 'membership', 'n/a', 'dues checkout (price_TBD, waitlist)', 'n/a', 'src/pages/physicians/join.astro'),
 '/privacy/': ('Privacy Policy', 'legal', 'n/a', 'none', 'draft, not in force', 'src/pages/privacy.astro'),
 '/terms/': ('Terms of Use', 'legal', 'n/a', 'none', 'draft, not in force', 'src/pages/terms.astro'),
 '/give/thanks/': ('Thank you', 'utility', 'n/a', 'none', 'n/a', 'src/pages/give/thanks.astro'),
 '/physicians/join/thanks/': ('Welcome to the Alliance', 'utility', 'n/a', 'none', 'n/a', 'src/pages/physicians/join/thanks.astro'),
 '/styleguide/': ('Style guide', 'utility', 'n/a', 'none', 'n/a (noindex)', 'src/pages/styleguide.astro'),
 '/404/': ('Page not found', 'utility', 'n/a', 'none', 'n/a', 'src/pages/404.astro'),
}
for p, (title, typ, topic, com, src, f) in tp.items():
    upd = gitdate(f, TAFHC)
    disp = 'Copy to tafhc.org at the same path (tafhc.com page stays live, untouched, no redirect)'
    if p == '/physicians/': disp += '; rewrite levels to $50 / Council / Partner'
    if p == '/physicians/join/': disp += '; three levels, Stripe prices'
    if p in ('/privacy/', '/terms/'): disp += '; counsel finalizes'
    if p == '/styleguide/': disp = 'Hold for decision: internal page, keep noindex or drop'
    row(T + p, title, typ, topic, INST, 'no', com, src, upd, disp, p if p not in ('/404/',) else '/404/', 'tafhc ' + f)
for f, title in [('src/content/insights/340b-placeholder-oped.mdx', '[PLACEHOLDER] Competition is the cure'), ('src/content/insights/site-neutral-placeholder-testimony.mdx', '[PLACEHOLDER] Site-neutral payment, in the employer'), ('src/content/insights/physician-ownership-placeholder-report.mdx', '[PLACEHOLDER] After Section 6001: where the money went'), ('src/content/press/2026-11-placeholder-launch.md', '[PLACEHOLDER] launch press release'), ('src/content/progress/2026-11-placeholder.md', '[PLACEHOLDER] Progress report: founding')]:
    row(T + ' (draft, not built): ' + f, title, 'insight', 'n/a', INST, 'no', 'none', '[STAT] placeholders', gitdate(f, TAFHC), 'Hold for decision: draft placeholder, not published', '', 'tafhc ' + f)
# ---------- write ----------
os.makedirs(os.path.join(W, 'merger'), exist_ok=True)
with open(os.path.join(W, 'merger/inventory.csv'), 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['Current URL', 'Title', 'Type', 'Topic / fight', 'Voice', 'Names individuals', 'Commercial element', 'Sources cited', 'Last updated', 'Disposition', 'Target URL on tafhc.org', 'Source file'])
    for r in rows: w.writerow([r['url'], r['title'], r['type'], r['topic'], r['voice'], r['names'], r['commercial'], r['sources'], r['updated'], r['disposition'], ('https://tafhc.org' + r['target']) if r['target'] else '', r['source_file']])
seen = {}
with open(os.path.join(W, 'redirects.csv'), 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['old_url', 'target_url', 'status', 'note'])
    for old, t, note in red:
        if old in seen: print('DUP', old, file=sys.stderr); continue
        seen[old] = t; w.writerow([old, 'https://tafhc.org' + t, 301, note])
# checks
live_paths = {l.strip().replace('https://rojasreport.com', '') for l in live}
inv_rr = {r['url'].replace('https://rojasreport.com', '') for r in rows if r['url'].startswith('https://rojasreport.com/') and '*' not in r['url']}
print('inventory rows', len(rows), '| redirects', len(seen))
print('live sitemap paths not in inventory:', sorted(live_paths - inv_rr))
print('inventory rojasreport paths not in live sitemap (expected: noindex, retired, legacy, files):', len(inv_rr - live_paths))
targets = {t for t in seen.values()}
print('distinct targets', len(targets))
