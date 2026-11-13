#!/usr/bin/env python3
"""Compile the physician-owned hospitals desk data from research/poh.

Input: research/poh/verified_{A,B,C,D}.json, the November 2026 re-verification of the
189 hospitals in the March 2026 Rojas Report database (one dated source per hospital).
Output: src/data/poh/hospitals.json and src/data/poh/meta.json.

Rows that are not hospitals, and rows that repeat a hospital already listed (same CMS
Certification Number), are dropped here with the reason recorded in meta.json.
Run: python3 scripts/build_poh.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(ROOT, 'research', 'poh')
OUT = os.path.join(ROOT, 'src', 'data', 'poh')

STATUSES = ['Physician-owned', 'Joint venture', 'Sold or acquired', 'Closed', 'Under development', 'NOT FOUND']

STATE_NAMES = {
    'AL': 'Alabama', 'AR': 'Arkansas', 'AZ': 'Arizona', 'CA': 'California', 'CO': 'Colorado', 'FL': 'Florida',
    'GA': 'Georgia', 'IA': 'Iowa', 'ID': 'Idaho', 'IN': 'Indiana', 'KS': 'Kansas', 'LA': 'Louisiana',
    'MI': 'Michigan', 'MO': 'Missouri', 'MT': 'Montana', 'NC': 'North Carolina', 'NE': 'Nebraska',
    'NH': 'New Hampshire', 'NM': 'New Mexico', 'NV': 'Nevada', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon',
    'PA': 'Pennsylvania', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas',
    'UT': 'Utah', 'WI': 'Wisconsin', 'WV': 'West Virginia', 'WY': 'Wyoming',
}

# March 2026 entries that the November re-verification found were never physician-owned hospitals.
NOT_HOSPITALS = {
    'Michigan Heart & Vascular Institute': 'A 33-physician cardiology practice, not a licensed hospital; CMS lists no hospital under the name.',
    'MercyOne Des Moines Surgical Care': 'A MercyOne surgical clinic, not a licensed hospital; CMS lists no separate hospital at the site.',
    'Elliot One-Day Surgery Center': 'An ambulatory surgery center run by Elliot Health System, not a hospital; not in CMS hospital data.',
    'Guadalupe Regional Medical Center': 'County-owned; no source shows it was ever physician-owned.',
}

# Corrections from the independent fact-check of November 13, 2026 (each against CMS files or the cited source).
POS = 'CMS Provider of Services file, Q3 2026 (data.cms.gov)'
POS_URL = 'https://data.cms.gov/provider-characteristics/hospitals-and-other-facilities/provider-of-services-file-hospital-non-hospital-facilities'
OVERRIDES = {
    'Aspen Mountain Medical Center': {
        'status': 'NOT FOUND',
        'owner': 'Not named in any source',
        'fact': 'It was operating in January 2026, but no source names its owners, and its Medicare agreement ended October 21, 2019.',
        'source': POS_URL, 'sourceLabel': f'{POS}; SweetwaterNOW, January 2026', 'sourceDate': '2026-09-30',
    },
    'Glenwood Regional Medical Center': {
        'fact': 'CMS shows the Ouachita Community Hospital Medicare agreement ended November 1, 2015. No source shows whether it closed or merged.',
    },
    'Northwest Texas Surgery Center': {
        'owner': 'Not confirmed',
        'fact': 'CMS shows its Medicare agreement ended July 1, 2015. A burst pipe flooded the building on August 19, 2025. No source confirms it closed.',
        'source': POS_URL, 'sourceLabel': POS, 'sourceDate': '2026-09-30',
    },
    'The Heart Hospital Baylor Plano': {
        'owner': 'Baylor Scott & White (Baylor Regional Medical Center at Plano, 51%) with physician partners',
        'fact': 'CMS lists Baylor Regional Medical Center at Plano at 51% since February 1, 2025, beside physician partners.',
    },
    'Summit Medical Center': {
        'status': 'NOT FOUND',
        'fact': 'Physicians hold most shares. Solara Summit Partners LLC holds 20%, and no source shows whether it belongs to a hospital chain.',
    },
    'Pinnacle Hospital': {
        'fact': 'CMS lists Pinnacle Healthcare LLC and individual physicians as owners, and classifies the ownership as physician.',
    },
    'Ascentist Hospital': {
        'owner': 'PatientFirst Healthcare Alliance PA (100% direct); Ascentist Physicians Group LLC (Douglas Cowan, MD, 100% indirect)',
        'fact': 'CMS lists PatientFirst Healthcare Alliance PA as 100% direct owner and Ascentist Physicians Group, led by Douglas Cowan, MD, as indirect owner.',
    },
}

HEADLINE = {
    'value': '250+',
    'text': 'It is estimated that more than 250 acute care hospitals are owned, in part or fully, by physicians.',
    'source': 'https://www.federalregister.gov/documents/2026/04/14/2026-07203/medicare-program-hospital-inpatient-prospective-payment-systems-for-acute-care-hospitals-ipps-and',
    'sourceLabel': 'Centers for Medicare & Medicaid Services, FY 2027 IPPS proposed rule, 91 Fed. Reg. 19312, 19668 (April 14, 2026), citing Blumenthal et al., BMJ 2015',
    'asOf': '2026-04-14',
}


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def main():
    rows = []
    for g in 'ABCD':
        with open(os.path.join(R, f'verified_{g}.json')) as f:
            rows += json.load(f)
    for r in rows:
        if r['inputName'] in OVERRIDES:
            r.update(OVERRIDES[r['inputName']])

    # When two rows share a CMS Certification Number, keep the one that is operating
    # (and not itself flagged as a duplicate); drop the other.
    def ccn_of(r):
        m = re.match(r'\s*([0-9A-Z]{6})\b', r.get('ccn') or '')
        return m.group(1) if m else None

    def rank(r):
        return (r['status'] in ('Closed', 'NOT FOUND'), 'duplicate' in (r.get('note') or '').lower())

    keep_for = {}
    for i, r in enumerate(rows):
        c = ccn_of(r)
        if c and (c not in keep_for or rank(r) < rank(rows[keep_for[c]])):
            keep_for[c] = i

    dropped, seen_ccn, hospitals = [], {}, []
    for i, r in enumerate(rows):
        if r['inputName'] in NOT_HOSPITALS:
            dropped.append({'name': r['inputName'], 'state': r['state'], 'reason': NOT_HOSPITALS[r['inputName']]})
            continue
        ccn = ccn_of(r)
        if ccn and keep_for[ccn] != i:
            kept = rows[keep_for[ccn]]
            dropped.append({'name': r['inputName'], 'state': r['state'], 'reason': f"Same hospital as {kept.get('currentName') or kept['inputName']} (CCN {ccn})."})
            continue
        if r['status'] not in STATUSES:
            raise SystemExit(f"unknown status {r['status']!r} for {r['inputName']}")
        name = r.get('currentName') or r['inputName']
        if ccn:
            seen_ccn[ccn] = name
        hospitals.append({
            'id': slug(f"{r['state']} {r['inputName']}"),
            'name': name,
            'originalName': r['inputName'],
            'city': r['city'],
            'state': r['state'],
            'stateName': STATE_NAMES[r['state']],
            'stateSlug': r['state'].lower(),
            'specialty': '',
            'status': r['status'],
            'owner': r.get('owner') or '',
            'ccn': ccn,
            'fact': r.get('fact') or '',
            'source': r.get('source') or '',
            'sourceLabel': r.get('sourceLabel') or '',
            'sourceDate': r.get('sourceDate') or '',
        })

    # Specialty from the March database (not re-verified; shown only as a descriptor).
    with open(os.path.join(R, 'poh_db_2026-03.json')) as f:
        march = {(m['state'], m['name']): m for m in json.load(f)}
    for h in hospitals:
        m = march.get((h['state'], h['originalName']))
        if m:
            h['specialty'] = m['specialty']

    hospitals.sort(key=lambda h: (h['stateName'], h['name']))

    # State context from the site's CON rankings and state pages.
    with open(os.path.join(ROOT, 'data', 'rankings.json')) as f:
        rank = {x['state']: x for x in json.load(f)}
    pages = {}
    for fn in os.listdir(os.path.join(ROOT, 'data', 'states')):
        with open(os.path.join(ROOT, 'data', 'states', fn)) as f:
            d = json.load(f)
        pages[d['abbreviation']] = f"/states/{d['slug']}/"

    states = []
    for code, name in sorted(STATE_NAMES.items(), key=lambda kv: kv[1]):
        hs = [h for h in hospitals if h['state'] == code]
        if not hs:
            continue
        by = {s: sum(1 for h in hs if h['status'] == s) for s in STATUSES}
        rk = rank.get(name)
        states.append({
            'code': code, 'name': name, 'slug': code.lower(), 'total': len(hs), 'byStatus': by,
            'conTier': rk['tier'] if rk else None, 'conStatus': rk['con_status'] if rk else None,
            'statePage': pages.get(code),
        })

    by_status = {s: sum(1 for h in hospitals if h['status'] == s) for s in STATUSES}
    dates = sorted(h['sourceDate'] for h in hospitals if re.match(r'^\d{4}-\d{2}', h['sourceDate'] or ''))
    meta = {
        'asOf': '2026-11-13',
        'headline': HEADLINE,
        'tracked': len(hospitals),
        'startingList': len(rows),
        'byStatus': by_status,
        'statesCount': len(states),
        'states': states,
        'dropped': dropped,
        'latestSourceDate': dates[-1] if dates else None,
        'method': 'Each hospital on the March 2026 Rojas Report list was re-checked in November 2026 against CMS Hospital All Owners and enrollment data (September 29, 2026 release), CMS Provider of Services and Hospital General Information files, hospital websites, SEC and SEDAR filings, court records and news. One dated source is cited per hospital.',
    }

    os.makedirs(OUT, exist_ok=True)
    for name, data in (('hospitals', hospitals), ('meta', meta)):
        p = os.path.join(OUT, name + '.json')
        with open(p + '.tmp', 'w') as f:
            json.dump(data, f, indent=1, ensure_ascii=False)
            f.write('\n')
        os.replace(p + '.tmp', p)
    print(f"hospitals {len(hospitals)} of {len(rows)}; dropped {len(dropped)}; states {len(states)}; {by_status}")


if __name__ == '__main__':
    main()
