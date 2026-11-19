#!/usr/bin/env python3
"""Governor and attorney general of every state, from the two national rosters.

Governors: the National Governors Association's current governors page (nga.org/governors), fetched
here. Attorneys general: the National Association of Attorneys General's "Find my AG" page
(naag.org/find-my-ag), which refuses command-line fetches; its roster is read from a saved copy
(research/states/sources/naag_find_my_ag_<date>.txt, one "State | Name" line per row, saved from
the page on the date in the file name). Neither roster gives party or term start, so those two
fields come from the state's own official pages and are filled in the state's editorial file.

Writes research/states/data/officials.json. A state missing from either roster is NOT FOUND.
"""
import html
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path

from common import DATA, NAME_TO_CODE, PIPE, STATES, write_json

NGA_URL = 'https://www.nga.org/governors/'
NAAG_URL = 'https://www.naag.org/find-my-ag/'
SAVED = PIPE / 'sources'


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode('utf-8', 'replace')


def governors():
    page = fetch(NGA_URL)
    today = date.today().isoformat()
    (SAVED / f'nga_governors_{today}.html').write_text(page)
    out = {}
    for state, name in re.findall(r'<small class="state">(.*?)</small>\s*(.*?)\s*</div>', page, flags=re.S):
        state, name = html.unescape(state.strip()), html.unescape(re.sub(r'\s+', ' ', name)).strip()
        name = re.sub(r'^(Gov\.|Governor|Mayor)\s+', '', name)
        code = NAME_TO_CODE.get(state)
        if code:
            out[code] = {'name': name, 'source': f'National Governors Association, current governors ({NGA_URL}), retrieved {today}'}
    return out, today


def attorneys_general():
    files = sorted(SAVED.glob('naag_find_my_ag_*.txt'))
    if not files:
        return {}, None
    f = files[-1]
    saved = f.stem.rsplit('_', 1)[-1]
    out = {}
    for line in f.read_text().splitlines():
        if '|' not in line:
            continue
        state, name = [x.strip() for x in line.split('|', 1)]
        note = None
        m = re.match(r'(.*?)\s*\((.*?)\)\s*$', state)
        if m:
            state, note = m.group(1), m.group(2)
        code = NAME_TO_CODE.get(state)
        if code:
            out[code] = {'name': name, 'note': note, 'source': f'National Association of Attorneys General, Find my AG ({NAAG_URL}), page read {saved}'}
    return out, saved


def main():
    gov, gov_date = governors()
    ag, ag_date = attorneys_general()
    states = {}
    for st in sorted(STATES):
        states[st] = {'governor': gov.get(st, 'NOT FOUND'), 'attorneyGeneral': ag.get(st, 'NOT FOUND')}
    write_json(DATA / 'officials.json', {
        'sources': {
            'governors': {'name': 'National Governors Association, current governors', 'url': NGA_URL, 'retrieved': gov_date},
            'attorneysGeneral': {'name': 'National Association of Attorneys General, Find my AG', 'url': NAAG_URL, 'retrieved': ag_date or 'NOT FOUND'},
        },
        'states': states,
    })
    missing = [st for st, v in states.items() if 'NOT FOUND' in (v['governor'], v['attorneyGeneral'])]
    print('officials: 51 jurisdictions; NOT FOUND:', missing or 'none', file=sys.stderr)


if __name__ == '__main__':
    main()
