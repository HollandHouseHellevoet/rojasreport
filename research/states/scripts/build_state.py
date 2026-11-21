#!/usr/bin/env python3
"""Render src/data/states/<st>.json (the StateDossierRecord the site reads) from the pipeline data
and the state's editorial file.

    python3 build_state.py TX

Inputs: research/states/data/hospitals/<st>.json (pull_hospitals.py), data/facilities.json,
data/officials.json, data/tax_rates.json and research/states/editorial/<st>.json. Every figure on the
page comes from the data files; the editorial file holds prose, grades, statuses, officeholders, bills
and the attorney general section, with {placeholders} for the figures (see FIGURES below).

Tax exemption estimate: federal income tax at 21% of the net income of the hospitals that made money;
state income tax at the editorial file's rate on the same base (null where the state has none);
property tax on land, land improvements and buildings at historical cost, at the Lincoln Institute
largest-city rate for hospitals in the counties the editorial file names and the rural rate elsewhere
(propertyTax.rateKey picks the study's published rate or its land-and-building rate; propertyTax.largestCityCities
keys hospitals whose cost report leaves the county blank by city).
"""
import json
import sys

from common import DATA, EDITORIAL, REPO, read_json, write_json

OUT = REPO / 'src' / 'data' / 'states'
COST_REPORT_SRC = 'CMS Hospital Provider Cost Report, CostReport_2023_Final.csv and CostReport_2024_Final.csv (data.cms.gov, retrieved September 30, 2026), latest report per hospital'


def fmt(n):
    """$6.5B above a billion, $846M below, $52,500 below a million."""
    a = abs(n)
    s = '-' if n < 0 else ''
    if a >= 1e9:
        return f'{s}${a / 1e9:.1f}B'
    if a >= 1e6:
        return f'{s}${a / 1e6:.0f}M'
    return f'{s}${a:,.0f}'


def words(n):
    a = abs(n)
    s = '-' if n < 0 else ''
    if a >= 1e9:
        return f'{s}${a / 1e9:.1f} billion'
    return f'{s}${a / 1e6:.0f} million'


def exact(n):
    return f'{n:,.0f}'


def fy_range(ends):
    ends = sorted(ends)
    return ends[0] if ends[0] == ends[-1] else f'{ends[0]} to {ends[-1]}'


def fill(obj, figures):
    if isinstance(obj, str):
        return obj.format(**figures)
    if isinstance(obj, list):
        return [fill(x, figures) for x in obj]
    if isinstance(obj, dict):
        return {k: fill(v, figures) for k, v in obj.items()}
    return obj


def main(st):
    st = st.upper()
    ed = read_json(EDITORIAL / f'{st.lower()}.json')
    hosp = read_json(DATA / 'hospitals' / f'{st.lower()}.json')
    fac = read_json(DATA / 'facilities.json')['states'][st]
    rates = read_json(DATA / 'tax_rates.json')['states'][st]
    t = hosp['totals']
    rows = [h for h in hosp['hospitals'] if h['inCostReport']]

    # Tax exemption estimate
    federal = round(0.21 * t['positiveNetIncomeSum'])
    state_rate = ed['stateIncomeTax']['rate']
    state_tax = round(state_rate * t['positiveNetIncomeSum']) if state_rate else 0
    city_counties = {c.upper() for c in ed['propertyTax']['largestCityCounties']}
    # rateKey: 'rate' (the study's published effective rate, land, building and fixtures) or 'landBuildingRate'
    # (the $1 million net tax bill over land and building value, for states that tax fixtures at a lower rate).
    rate_key = ed['propertyTax'].get('rateKey', 'rate')
    city_rate, rural_rate = rates['largestCity'][rate_key], rates['rural'][rate_key]
    rate_basis = ('effective commercial rates' if rate_key == 'rate'
                  else 'land-and-building rates (the $1 million net tax bill over land and building value, since the state taxes fixtures at a lower rate)')
    # largestCityCities: where the cost report leaves the county blank, key the hospital by its city instead.
    city_names = {c.upper() for c in ed['propertyTax'].get('largestCityCities', [])}
    prop = 0.0
    for h in rows:
        if h.get('propertyAtCost'):
            county, city = (h.get('county') or '').upper(), (h.get('city') or '').upper()
            in_city = county in city_counties or (not county and city in city_names)
            prop += h['propertyAtCost'] * (city_rate if in_city else rural_rate)
    prop = round(prop)
    exemptions = federal + state_tax + prop

    dual = [h['name'] for h in rows if h.get('dualClassification')]
    figures = {
        'hospitals': t['hospitals'], 'inCostReport': t['inCostReport'],
        'netIncome': fmt(t['netIncome']), 'netIncomeWords': words(t['netIncome']), 'netIncomeExact': exact(t['netIncome']),
        'npr': fmt(t['netPatientRevenue']), 'nprExact': exact(t['netPatientRevenue']),
        'totalAssets': fmt(t['totalAssets']), 'totalAssetsExact': exact(t['totalAssets']),
        'charity': fmt(t['charityCareAtCost']), 'charityWords': words(t['charityCareAtCost']), 'charityExact': exact(t['charityCareAtCost']),
        'positiveNetIncome': t['positiveNetIncome'], 'positiveNetIncomeSumExact': exact(t['positiveNetIncomeSum']),
        'federalTax': fmt(federal), 'federalTaxExact': exact(federal),
        'stateTax': fmt(state_tax), 'stateTaxExact': exact(state_tax),
        'propertyTax': fmt(prop), 'propertyTaxExact': exact(prop), 'propertyAtCostExact': exact(t['propertyAtCost']),
        'exemptions': fmt(exemptions), 'exemptionsWords': words(exemptions), 'exemptionsExact': exact(exemptions),
        'childSites': f"{t['childSites']:,}", 'contractPharmacies': f"{t['contractPharmacies']:,}",
        'contractPharmaciesOutOfState': f"{t['contractPharmaciesOutOfState']:,}",
        'outOfStateShare': f"{100 * t['contractPharmaciesOutOfState'] / t['contractPharmacies']:.0f}%",
        'dual': len(dual), 'dualNames': ', '.join(dual),
        'projectedDsh': t['projectedDsh'], 'ucp': fmt(t['uncompensatedCarePayment']), 'ucpWords': words(t['uncompensatedCarePayment']), 'ucpExact': exact(t['uncompensatedCarePayment']),
        'residentsFte': f"{t['residentsFte']:,.0f}",
        'pohOperating': fac['physicianOwnedHospitalsOperating'], 'pohListed': fac['physicianOwnedHospitalsListed'],
        'asc': f"{fac['ascActive']:,}",
        'fiscalYears': fy_range(t['fiscalYearEnds']),
    }
    e = fill(ed, figures)
    fy = f"hospital fiscal years ending {figures['fiscalYears']}"

    money = [
        {'value': figures['netIncome'], 'text': f"in net income in one year, on {figures['npr']} of patient revenue.",
         'note': f"{t['positiveNetIncome']} of {t['inCostReport']} made money. CMS hospital cost reports, latest report per hospital.",
         'basis': 'reported',
         'source': f"{COST_REPORT_SRC}: sum of Net Income {figures['netIncomeExact']} and Net Patient Revenue {figures['nprExact']} over the {t['inCostReport']} active 340B hospitals with cost reports; {t['positiveNetIncome']} of {t['inCostReport']} with positive net income",
         'as_of': fy},
        {'value': figures['totalAssets'], 'text': 'in total assets on their books.',
         'note': 'CMS hospital cost reports, latest report per hospital.', 'basis': 'reported',
         'source': f"{COST_REPORT_SRC}: sum of Total Assets {figures['totalAssetsExact']} over the {t['inCostReport']} hospitals", 'as_of': fy},
        {'value': figures['exemptions'], 'text': f"a year in estimated tax breaks, against {figures['charity']} of charity care.",
         'note': e['moneyNotes']['exemptions'], 'basis': 'estimated',
         'source': f"Estimate from the cost reports: federal income tax {figures['federalTaxExact']} (21% of cost-report net income of the {t['positiveNetIncome']} profitable hospitals, {figures['positiveNetIncomeSumExact']})"
                   + (f"; state income tax {figures['stateTaxExact']} ({state_rate * 100:g}% on the same base)" if state_rate else f"; {ed['stateIncomeTax']['note']}")
                   + f"; property tax {figures['propertyTaxExact']} on {figures['propertyAtCostExact']} of land, land improvements and buildings at historical cost at the Lincoln Institute / Minnesota Center for Fiscal Excellence 50-State Property Tax Comparison Study {rate_basis} for taxes paid in 2025 ({rates['largestCity']['city']} {city_rate * 100:.4g}% for hospitals in {', '.join(c.title() for c in sorted(city_counties))} County, {rates['rural']['city']} {rural_rate * 100:.4g}% elsewhere); total {figures['exemptionsExact']}. Charity care at cost {figures['charityExact']} from the cost reports",
         'as_of': f'exemptions at 2025 rates on {fy}'},
        {'value': figures['contractPharmaciesOutOfState'], 'text': f"340B contract pharmacy arrangements with pharmacies outside {e['name']}, of {figures['contractPharmacies']} in all.",
         'note': 'HRSA 340B registry, September 29, 2026.', 'basis': 'reported',
         'source': f"HRSA 340B OPAIS export of September 29, 2026: {figures['contractPharmacies']} active contract pharmacy arrangements for the {t['hospitals']} hospitals, {figures['contractPharmaciesOutOfState']} with pharmacies outside the state ({figures['outOfStateShare']})",
         'as_of': 'September 29, 2026'},
    ]

    # Systems table: every system in the AHRQ linkage, then the independents as one row.
    sys_src = f"{COST_REPORT_SRC}; hospitals assigned to systems by the AHRQ Compendium of U.S. Health Systems 2023 linkage file (CCN)"
    groups = {}
    for h in rows:
        groups.setdefault(h['system'], []).append(h)
    srows = []
    for name, hs in groups.items():
        if name is None:
            continue
        srows.append({'name': ed['systemNames'].get(name, name), 'slug': ed['slugs'].get(name), 'hospitals': len(hs),
                      'netPatientRevenue': round(sum(h['netPatientRevenue'] or 0 for h in hs)),
                      'netIncome': round(sum(h['netIncome'] or 0 for h in hs)),
                      'otherIncome': round(sum(h['otherIncome'] or 0 for h in hs)),
                      'basis': 'reported', 'source': sys_src, 'as_of': fy})
    srows.sort(key=lambda r: -r['netIncome'])
    ind = groups.get(None, [])
    if ind:
        srows.append({'name': f'Independent hospitals ({len(ind)})', 'slug': None, 'hospitals': len(ind),
                      'netPatientRevenue': round(sum(h['netPatientRevenue'] or 0 for h in ind)),
                      'netIncome': round(sum(h['netIncome'] or 0 for h in ind)),
                      'otherIncome': round(sum(h['otherIncome'] or 0 for h in ind)),
                      'basis': 'reported', 'source': sys_src + '; hospitals with no system in the linkage file', 'as_of': fy})

    hrows = sorted(({'ccn': h['ccn'], 'name': h['name'], 'system': ed['systemNames'].get(h['system'], h['system']) or 'Independent',
                     'fiscalYearEnd': h['fiscalYearEnd'], 'netPatientRevenue': round(h['netPatientRevenue'] or 0),
                     'netIncome': round(h['netIncome'] or 0), 'totalAssets': round(h['totalAssets'] or 0),
                     'charityCareAtCost': round(h['charityCareAtCost'] or 0)} for h in rows),
                   key=lambda r: -r['netPatientRevenue'])

    out = {
        'slug': e['slug'], 'code': st, 'name': e['name'], 'verdict': e['verdict'], 'asOf': e['asOf'],
        'grade': {'note': e['gradeNote']},
        'money': {'asOf': f"{e['possessive']} {t['hospitals']} hospitals in the 340B program, fiscal years ending {figures['fiscalYears']}", 'items': money},
        'drivers': e['drivers'],
        'systems': {'subtitle': e['systems']['subtitle'], 'note': e['systems']['note'], 'rows': srows},
        'hospitals': {'source': COST_REPORT_SRC, 'as_of': fy, 'rows': hrows},
        'whoDecides': e['whoDecides'],
        'agOversight': e['agOversight'],
        'bills': e['bills'],
        'buy': e['buy'],
        'sourcesLine': e['sourcesLine'],
    }
    write_json(OUT / f'{st.lower()}.json', out)
    print(f"{st}: federal {federal:,} state {state_tax:,} property {prop:,} total {exemptions:,}; {len(srows)} system rows, {len(hrows)} hospital rows; dual {len(dual)}", file=sys.stderr)
    return out


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'TX')
