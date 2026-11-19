#!/usr/bin/env python3
"""Effective commercial property tax rates for every state, from the Lincoln Institute of Land Policy
and Minnesota Center for Fiscal Excellence 50-State Property Tax Comparison Study (taxes paid in 2025,
April 2026 edition): Appendix Table 3a (largest city in each state) and Appendix Table 3c (a rural
municipality in each state), the $1 million commercial property rate.

Reads the study's extracted text (STATE_SOURCES/state_rates/lincoln_50state_2025_2026-09-30.txt)
and writes research/states/data/tax_rates.json. The dossier's property tax estimate applies the
largest-city rate to hospitals in that city's county (the state's editorial file names the county)
and the rural rate elsewhere, the convention the North Carolina and Texas research used.

Layout of the extracted text: each table runs two pages. Page 1 opens with one header line listing
the states (and, for 3a, the cities) in row order, followed by one rate line per row with no state
name; page 2 rows begin with "State City". The $1 million rate is the second rate on each row.
"""
import re
import sys

from common import DATA, NAME_TO_CODE, SOURCES, STATES, sha256, write_json

TXT = SOURCES / 'state_rates' / 'lincoln_50state_2025_2026-09-30.txt'
NAMES = sorted(list(STATES.values()) + ['DC'], key=len, reverse=True)
MULTI = ('Little Rock', 'Los Angeles', 'Des Moines', 'New Orleans', 'Kansas City', 'Las Vegas', 'New York City',
         'Salt Lake City', 'Sioux Falls', 'Virginia Beach', 'Oklahoma City', 'Colorado Springs')
RATE = re.compile(r'(\d\.\d{3})% ([\d,]+) \d+ \([^)]*\) (\d\.\d{3})% ([\d,]+) \d+')


def tokens(text, names):
    out, pos, text = [], 0, text.strip()
    while pos < len(text):
        for n in names:
            if text.startswith(n, pos) and (pos + len(n) == len(text) or text[pos + len(n)] == ' '):
                out.append(n)
                pos += len(n) + 1
                break
        else:
            m = re.match(r'\S+\s*', text[pos:])
            if names is NAMES:
                pass  # AVERAGE and stray words in a state list are skipped
            else:
                out.append(m.group(0).strip())
            pos += len(m.group(0))
    return out


def header(lines, idx):
    """Join the header line(s) of a table: from the nearest earlier line starting with 'State ' through idx."""
    start = idx
    while not lines[start].startswith('State '):
        start -= 1
    return ' '.join(l.strip() for l in lines[start:idx + 1]).split('Appendix Table')[0]


def parse(lines, tag):
    idx = next(i for i, l in enumerate(lines) if f'Appendix Table {tag}:' in l)
    head = header(lines, idx)
    state_part, city_part = (head.split(' City ', 1) + [''])[:2]
    states = [('District of Columbia' if s == 'DC' else s) for s in tokens(state_part.replace('State ', '', 1), NAMES)]
    cities = [c.rstrip('*') for c in tokens(city_part, MULTI)] if city_part else []
    rows, page1 = [], True
    for line in lines[idx + 1:]:
        if page1 and re.match(r'\d\.\d{3}% [\d,]+ \d\.\d{3}% ', line):
            page1 = False  # page 1 closes with its AVERAGE row (rates only, no rank)
            continue
        if not page1 and line.startswith('AVERAGE'):
            break
        m = RATE.search(line)
        if not m:
            continue
        before = line[:m.start()].strip().rstrip('*')
        rate = round(float(m.group(3)) / 100, 5)
        if page1:
            n = len(rows)
            if n >= len(states):
                continue
            city = before if before else (cities[n] if n < len(cities) else '')
            rows.append((states[n], city, rate))
        else:
            st = next((n for n in NAMES if before.startswith(n + ' ')), None)
            if st:
                rows.append(('District of Columbia' if st == 'DC' else st, before[len(st) + 1:].strip(), rate))
    return rows


def main():
    lines = TXT.read_text().splitlines()
    out = {'source': {
        'name': 'Lincoln Institute of Land Policy and Minnesota Center for Fiscal Excellence, 50-State Property Tax Comparison Study for Taxes Paid in 2025 (April 2026)',
        'url': 'https://www.lincolninst.edu/publications/other/50-state-property-tax-comparison-study-2025/',
        'retrieved': '2026-09-30', 'sha256': sha256(TXT),
        'basis': 'Effective tax rate (net tax bill over market value) on a $1 million commercial property with $200,000 of fixtures; Appendix Table 3a (largest city in each state) and 3c (a rural municipality in each state)'},
        'states': {st: {} for st in sorted(STATES)}}
    for tag, key in (('3a', 'largestCity'), ('3c', 'rural')):
        for state, city, rate in parse(lines, tag):
            code = NAME_TO_CODE.get(state)
            if not code:
                continue
            # Illinois and New York list two cities in 3a; keep Chicago and New York City as the largest city.
            if key in out['states'][code] and city not in ('Chicago', 'New York City'):
                continue
            out['states'][code][key] = {'city': city, 'rate': rate, 'table': f'Appendix Table {tag}'}
    for st, v in out['states'].items():
        v.setdefault('largestCity', 'NOT FOUND')
        v.setdefault('rural', 'NOT FOUND')
    write_json(DATA / 'tax_rates.json', out)
    missing = [f'{st}:{k}' for st, v in out['states'].items() for k in ('largestCity', 'rural') if v[k] == 'NOT FOUND']
    print('tax rates: 51 jurisdictions; NOT FOUND:', missing or 'none', file=sys.stderr)
    for st in ('TX', 'NC', 'IL', 'NY', 'KS', 'DC'):
        print(st, out['states'][st], file=sys.stderr)


if __name__ == '__main__':
    main()
