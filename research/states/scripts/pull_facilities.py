#!/usr/bin/env python3
"""Certificate-of-need status, physician-owned hospital counts and ambulatory surgery center counts
for all 51 jurisdictions.

CON: data/rankings.json (the CON desk's scored list). POH: the Alliance physician-owned hospital list
(research/poh/poh_db_2026-03.json), operating hospitals by state. ASC: CMS Provider of Services file,
provider category 21 (ambulatory surgical centers), active certifications (no termination code).
Writes research/states/data/facilities.json.
"""
import csv
from collections import Counter

from common import DATA, NAME_TO_CODE, REGISTRY, STATES, read_json, sha256, src_path, write_json


def main():
    con = {}
    for r in read_json(src_path('rankings')):
        code = NAME_TO_CODE.get(r['state'])
        if code:
            con[code] = {'conStatus': r['con_status'], 'score': r['score'], 'tier': r['tier'], 'rank': r['rank']}

    poh = Counter()
    poh_all = Counter()
    for h in read_json(src_path('poh')):
        poh_all[h['state']] += 1
        if h.get('status') == 'Operating':
            poh[h['state']] += 1

    asc = Counter()
    asc_all = Counter()
    with open(src_path('pos'), newline='', encoding='latin-1') as fh:
        for row in csv.DictReader(fh):
            if row['PRVDR_CTGRY_CD'] != '21':
                continue
            asc_all[row['STATE_CD']] += 1
            if row['PGM_TRMNTN_CD'] in ('00', ''):
                asc[row['STATE_CD']] += 1

    out = {
        'sources': {k: {'name': REGISTRY[k]['name'], 'url': REGISTRY[k]['url'], 'retrieved': REGISTRY[k]['retrieved'],
                        'as_of': REGISTRY[k]['as_of'], 'sha256': sha256(src_path(k))} for k in ('rankings', 'poh', 'pos')},
        'states': {},
    }
    for st in sorted(STATES):
        out['states'][st] = {
            'con': con.get(st),
            'physicianOwnedHospitalsOperating': poh.get(st, 0),
            'physicianOwnedHospitalsListed': poh_all.get(st, 0),
            'ascActive': asc.get(st, 0),
            'ascEverCertified': asc_all.get(st, 0),
        }
    write_json(DATA / 'facilities.json', out)


if __name__ == '__main__':
    main()
