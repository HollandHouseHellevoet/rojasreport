#!/usr/bin/env python3
"""Every active 340B hospital in every jurisdiction, with its cost-report, system, CMS and DSH fields.

Reads (see common.REGISTRY): the HRSA OPAIS export, the CMS cost report files (2023 and 2024),
the AHRQ 2023 hospital linkage file, the CMS FY 2027 IPPS impact file and the FY 2027 Medicare DSH
supplemental file. Writes research/states/data/hospitals/<st>.json for all 51 jurisdictions and
research/states/data/hospitals_summary.json.

Hospital set (the rule the North Carolina dossier was built on): every participating OPAIS
registration with no parent, of type DSH, CAH, PED, RRC, SCH or CAN, whose 340B street address is in
the state. Child sites and contract pharmacies are counted under their parent hospital.

Cost report per hospital: the latest report by fiscal year end across both files, skipping a report
that covers fewer than 360 days or shows no net patient revenue when an earlier full-year report
exists. Property lines (land, land improvements, buildings) fall back to the most recent earlier
report with amounts when the latest lists none. Each fallback is recorded on the row.

System: AHRQ 2023 linkage by CCN. research/states/overrides/<st>.json may remap a CCN that changed
after 2023, name a system the linkage file lacks, or drop a registration; every override is logged.
"""
import csv
import json
import re
import sys
from collections import defaultdict
from datetime import date

from common import (DATA, HOSPITAL_TYPES, OVERRIDES, REGISTRY, STATES, log, mdy, num, read_json,
                    sha256, src_path, write_json)

EXPORT_DATE = date.fromisoformat(REGISTRY['opais']['retrieved'])


def active(begin, end):
    """In force on the export date: begun on or before it and not terminated on or before it."""
    b = date.fromisoformat(begin[:10]) if begin else None
    e = date.fromisoformat(end[:10]) if end else None
    return (b is None or b <= EXPORT_DATE) and (e is None or e > EXPORT_DATE)


def norm(s):
    return re.sub(r'[^A-Z0-9]+', ' ', (s or '').upper()).strip()


def load_opais():
    log('loading OPAIS ...')
    ces = read_json(src_path('opais'))['coveredEntities']
    parents = {}
    children = defaultdict(int)
    for ce in ces:
        if ce.get('participating') != 'TRUE':
            continue
        if ce.get('parentId340B'):
            children[ce['parentId340B']] += 1
            continue
        if ce.get('entityType') not in HOSPITAL_TYPES:
            continue
        parents[ce['id340B']] = ce
    # Contract pharmacy arrangements registered to the parent and to its child sites.
    cps = defaultdict(list)
    for ce in ces:
        if ce.get('participating') != 'TRUE':
            continue
        owner = ce.get('parentId340B') or ce['id340B']
        if owner not in parents:
            continue
        if not active(ce.get('participatingStartDate'), ce.get('terminationDate')):
            continue
        for cp in ce.get('contractPharmacies') or []:
            if active(cp.get('beginDate'), cp.get('terminationDate')):
                cps[owner].append(cp)
    return parents, children, cps


def load_cost_reports():
    log('loading cost reports ...')
    by_ccn = defaultdict(list)
    for key in ('costreport_2023', 'costreport_2024'):
        with open(src_path(key), newline='', encoding='utf-8-sig') as fh:
            for row in csv.DictReader(fh):
                row['_file'] = key
                by_ccn[row['Provider CCN'].strip()].append(row)
    return by_ccn


def pick_report(rows):
    """Latest full-year report with patient revenue; property fallback to an earlier report."""
    rows = sorted(rows, key=lambda r: mdy(r['Fiscal Year End Date']) or date.min, reverse=True)
    chosen = None
    notes = []
    for r in rows:
        b, e = mdy(r['Fiscal Year Begin Date']), mdy(r['Fiscal Year End Date'])
        days = (e - b).days + 1 if b and e else 0
        npr = num(r['Net Patient Revenue']) or 0
        if days >= 360 and npr > 0:
            chosen = r
            break
        notes.append(f"report {r['Fiscal Year Begin Date']} to {r['Fiscal Year End Date']} skipped ({days} days, net patient revenue {int(npr):,})")
    if chosen is None:
        chosen = rows[0]
        notes = ['no full-year report with patient revenue; latest report used']
    prop = property_sum(chosen)
    prop_note = None
    if prop == 0:
        for r in rows:
            if mdy(r['Fiscal Year End Date']) < mdy(chosen['Fiscal Year End Date']) and property_sum(r) > 0:
                prop = property_sum(r)
                prop_note = f"property lines from the report for the year ending {r['Fiscal Year End Date']} (latest lists none)"
                break
    return chosen, prop, prop_note, notes


def property_sum(r):
    return sum((num(r[k]) or 0) for k in ('Land', 'Land Improvements', 'Buildings'))


def load_ahrq():
    out = {}
    with open(src_path('ahrq'), newline='', encoding='latin-1') as fh:
        for row in csv.DictReader(fh):
            out[row['ccn'].strip()] = row
    return out


def load_impact():
    out = {}
    with open(src_path('ipps_impact'), encoding='latin-1') as fh:
        lines = fh.read().splitlines()
    header = lines[1].split('\t')
    for line in lines[2:]:
        cells = line.split('\t')
        if len(cells) < 10 or not cells[0].strip():
            continue
        out[cells[0].strip()] = dict(zip(header, cells))
    return out


def load_dsh():
    out = {}
    with open(src_path('dsh_supplemental'), encoding='latin-1') as fh:
        lines = fh.read().splitlines()
    for line in lines[3:]:
        cells = line.split('\t')
        if len(cells) < 13 or not cells[0].strip():
            continue
        out[cells[0].strip()] = {'projected_dsh': cells[1].strip(), 'ucp': num(cells[12])}
    return out


def load_overrides(st):
    p = OVERRIDES / f'{st.lower()}.json'
    return read_json(p) if p.exists() else {}


def main():
    parents, children, cps = load_opais()
    reports = load_cost_reports()
    ahrq = load_ahrq()
    impact = load_impact()
    dsh = load_dsh()
    name_index = defaultdict(list)
    for ccn, rows in reports.items():
        r = rows[0]
        name_index[(r['State Code'].strip(), norm(r['Hospital Name']), norm(r['City']))].append(ccn)

    by_state = defaultdict(list)
    for ce in parents.values():
        by_state[ce['streetAddress']['state']].append(ce)

    sources = {k: {'name': v['name'], 'url': v['url'], 'retrieved': v['retrieved'], 'sha256': sha256(src_path(k))}
               for k, v in REGISTRY.items() if k in ('opais', 'costreport_2023', 'costreport_2024', 'ahrq', 'ipps_impact', 'dsh_supplemental')}

    summary = {}
    for st in sorted(STATES):
        ov = load_overrides(st)
        rows = []
        for ce in sorted(by_state.get(st, []), key=lambda c: c['name']):
            hid = ce['id340B']
            if hid in ov.get('exclude', {}):
                log(f'{st}: {hid} excluded: {ov["exclude"][hid]}')
                continue
            ccn = (ce.get('cmsCertificationNumber') or '').strip()
            match = 'CCN'
            if hid in ov.get('ccn', {}):
                ccn = ov['ccn'][hid]
                match = 'override'
            elif ccn not in reports:
                cands = name_index.get((st, norm(ce['name']), norm(ce['streetAddress']['city'])), [])
                if len(cands) == 1:
                    ccn, match = cands[0], 'name and city'
            row = {
                'id340B': hid,
                'entityType': ce['entityType'],
                'name': ce['name'],
                'city': ce['streetAddress']['city'],
                'ccn': ccn,
                'childSites': children.get(hid, 0),
                'contractPharmacies': len(cps.get(hid, [])),
                'contractPharmaciesOutOfState': sum(1 for cp in cps.get(hid, []) if (cp.get('address') or {}).get('state') != st),
                'distinctPharmacies': len({cp.get('pharmacyId') for cp in cps.get(hid, [])}),
                'matchedBy': match,
                'inCostReport': ccn in reports,
            }
            a = ahrq.get(ccn)
            row['system'] = ov.get('system', {}).get(hid) or (a['health_sys_name'] if a and a['health_sys_name'] else None)
            row['systemBasis'] = 'override' if hid in ov.get('system', {}) else ('AHRQ 2023 linkage by CCN' if row['system'] else 'no system in the AHRQ 2023 linkage file')
            if ccn in reports:
                r, prop, prop_note, notes = pick_report(reports[ccn])
                row.update({
                    'fileName': r['Hospital Name'],
                    'fiscalYearBegin': r['Fiscal Year Begin Date'],
                    'fiscalYearEnd': r['Fiscal Year End Date'],
                    'file': r['_file'],
                    'ruralUrban': r['Rural Versus Urban'].strip(),
                    'typeOfControl': r['Type of Control'].strip(),
                    'county': r['County'].strip(),
                    'beds': num(r['Number of Beds']),
                    'residentsFte': num(r['Number of Interns and Residents (FTE)']),
                    'netPatientRevenue': num(r['Net Patient Revenue']) or 0,
                    'otherIncome': num(r['Total Other Income']) or 0,
                    'netIncome': num(r['Net Income']) or 0,
                    'totalAssets': num(r['Total Assets']) or 0,
                    'charityCareAtCost': num(r['Cost of Charity Care']) or 0,
                    'uncompensatedCare': num(r['Total Unreimbursed and Uncompensated Care']) or 0,
                    'propertyAtCost': prop,
                    'propertyNote': prop_note,
                    'medicareDshAdjustment': num(r['Disproportionate Share Adjustment']),
                    'reportNotes': notes,
                })
            im = impact.get(ccn)
            if im:
                row['cmsGeography'] = im.get('URGEO')
                row['section401'] = im.get('Section 401 Hospital', '').strip() == 'Y'
                row['dualClassification'] = row.get('ruralUrban') == 'R' and row['section401']
                row['dshPercent'] = num(im.get('DSHPCT'))
                row['dshOperatingAdjustment'] = num(im.get('DSHOPP'))
            d = dsh.get(ccn)
            if d:
                row['projectedDsh'] = d['projected_dsh']
                row['uncompensatedCarePayment'] = d['ucp']
            rows.append(row)

        inf = [r for r in rows if r['inCostReport']]
        tot = {
            'hospitals': len(rows),
            'inCostReport': len(inf),
            'childSites': sum(r['childSites'] for r in rows),
            'contractPharmacies': sum(r['contractPharmacies'] for r in rows),
            'contractPharmaciesOutOfState': sum(r['contractPharmaciesOutOfState'] for r in rows),
            'netPatientRevenue': sum(r['netPatientRevenue'] for r in inf),
            'otherIncome': sum(r['otherIncome'] for r in inf),
            'netIncome': sum(r['netIncome'] for r in inf),
            'positiveNetIncome': sum(1 for r in inf if r['netIncome'] > 0),
            'negativeNetIncome': sum(1 for r in inf if r['netIncome'] < 0),
            'positiveNetIncomeSum': sum(r['netIncome'] for r in inf if r['netIncome'] > 0),
            'totalAssets': sum(r['totalAssets'] for r in inf),
            'charityCareAtCost': sum(r['charityCareAtCost'] for r in inf),
            'uncompensatedCare': sum(r['uncompensatedCare'] for r in inf),
            'propertyAtCost': sum(r['propertyAtCost'] for r in inf),
            'rural': sum(1 for r in inf if r['ruralUrban'] == 'R'),
            'dualClassification': sum(1 for r in rows if r.get('dualClassification')),
            'residentsFte': sum(r['residentsFte'] or 0 for r in inf),
            'medicareDshAdjustment': sum(r['medicareDshAdjustment'] or 0 for r in inf),
            'projectedDsh': sum(1 for r in rows if r.get('projectedDsh') == 'YES'),
            'uncompensatedCarePayment': sum(r.get('uncompensatedCarePayment') or 0 for r in rows if r.get('projectedDsh') == 'YES'),
            'fiscalYearEnds': sorted({r['fiscalYearEnd'][-4:] for r in inf}),
            'matchedByName': [r['name'] for r in rows if r['matchedBy'] == 'name and city'],
            'overrides': [r['name'] for r in rows if r['matchedBy'] == 'override'],
            'notInCostReport': [r['name'] for r in rows if not r['inCostReport']],
        }
        write_json(DATA / 'hospitals' / f'{st.lower()}.json', {'state': st, 'name': STATES[st], 'sources': sources, 'totals': tot, 'hospitals': rows})
        summary[st] = tot
    write_json(DATA / 'hospitals_summary.json', {'sources': sources, 'states': summary})
    log('done')


if __name__ == '__main__':
    main()
