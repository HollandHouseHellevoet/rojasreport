"""Scripted rename of Rojas Report branding to the Alliance (MERGER_PLAN.md, section 5.1). Ordered, literal
substitutions over src/; every changed line is read by hand afterwards (git diff). Run from the repo root."""
import os, re, sys
ORG = 'The Alliance for Healthcare Competition'
ROOT = 'src'
SKIP = {'src/app/academic/page.tsx'}  # hand rewrite (rewrite list item 8)

RULES = [
    # twitter handle lines go away: no Alliance handle is set
    (re.compile(r'\n\s*site: ["\']@TheRojasReport["\'],'), ''),
    (' via @dutchrojas', ''),
    # publisher entities
    ('publisher: { "@type": "Organization", name: "The Rojas Report", url: "https://rojasreport.com", founder: { "@type": "Person", name: "Dutch Rojas" } }',
     f'publisher: {{ "@type": "Organization", name: "{ORG}", url: "https://tafhc.org" }}'),
    ('''  publisher: {
    "@type": "Organization",
    name: "The Rojas Report",
    url: "https://rojasreport.com",
    founder: { "@type": "Person", name: "Dutch Rojas" },
  },''', f'''  publisher: {{
    "@type": "Organization",
    name: "{ORG}",
    url: "https://tafhc.org",
  }},'''),
    ('publisher: { "@type": "Organization", name: "The Rojas Report", url: "https://rojasreport.com" }',
     f'publisher: {{ "@type": "Organization", name: "{ORG}", url: "https://tafhc.org" }}'),
    # correction links
    ('https://read.rojasreport.com/about', '/corrections/'),
    # absolute URLs and bare domains
    ('https://poh.rojasreport.com', '/poh/'),
    ('https://rojasreport.com', 'https://tafhc.org'),
    ('rojasreport.com/', 'tafhc.org/'),
    ('rojasreport.com/methodology', 'tafhc.org/methodology'),
    ('info@rojasreport.com', 'info@tafhc.org'),
    # titles, site names, alts
    ('alt: "AHA - The Rojas Report"', f'alt: "AHA | {ORG}"'),
    ('alt: "The Rojas Report"', f'alt: "{ORG}"'),
    ('siteName: "The Rojas Report"', f'siteName: "{ORG}"'),
    ("siteName: 'The Rojas Report'", f"siteName: '{ORG}'"),
    ('| The Rojas Report', f'| {ORG}'),
    # estimate and attribution labels (voice rule 2)
    ('Rojas Report estimate:', 'Alliance estimate (subsidy ledger method, /methodology/subsidy-ledger/):'),
    ('Rojas Report calculation:', 'Alliance calculation (subsidy ledger method, /methodology/subsidy-ledger/):'),
    ('A Rojas Report calculation', 'An Alliance calculation'),
    ('calculated by The Rojas Report', 'calculated by the Alliance'),
    ('Rojas Report North Carolina state dossier, release r71 (October 13, 2026)', 'Alliance state dossier, North Carolina, release r71 (October 13, 2026)'),
    ('Rojas Report physician-owned hospital database', 'Alliance physician-owned hospital database'),
    ('Rojas Report physician-owned hospital list', 'Alliance physician-owned hospital list'),
    ('the March 2026 Rojas Report list', 'the March 2026 list'),
    ('the Rojas Report list', 'the Alliance list'),
    ('The Rojas Report list', 'The Alliance list'),
    ('Rojas Report CON desk', 'Alliance CON desk'),
    ('the Rojas Report CON rankings', 'the Alliance CON rankings'),
    ('the Rojas Report editorial grades', 'the Alliance grades'),
    ("the Rojas Report's own", "the Alliance's own"),
    ("the Rojas Report&apos;s", "the Alliance&apos;s"),
    ('The Rojas Report ranks it', 'The Alliance ranks it'),
    ('How The Rojas Report ', 'How the Alliance '),
    ('on The Rojas Report is sourced', 'on this site is sourced'),
    ('fully investigated by The Rojas Report', 'fully investigated by the Alliance'),
    ('The Rojas Report mapped every one', 'The Alliance mapped every one'),
    ('behind every Rojas Report page', 'behind every page'),
    ('lawmaker and state on The Rojas Report', 'lawmaker and state on tafhc.org'),
    ('The Rojas Report publishes what the evidence shows', 'The Alliance publishes what the evidence shows'),
    ('"thesisDate": "The Rojas Report, March 28, 2026"', '"thesisDate": "March 28, 2026"'),
    ('Rojas Intelligence\n', 'The Alliance\n'),
]

changed = 0
for dp, _, fns in os.walk(ROOT):
    for fn in fns:
        if not fn.endswith(('.ts', '.tsx', '.json')): continue
        p = os.path.join(dp, fn)
        if p in SKIP: continue
        s = open(p, encoding='utf-8').read(); t = s
        for a, b in RULES:
            t = a.sub(b, t) if hasattr(a, 'sub') else t.replace(a, b)
        if t != s:
            open(p, 'w', encoding='utf-8').write(t); changed += 1
print('files changed:', changed)
