#!/usr/bin/env python3
"""Compile the Ways & Means desk data for the site from research/waysandmeans/data.

Reads the refreshed research files (roster, money, votes, trades, developments) and writes
src/data/committees/wm/{members,votes,meta}.json. Nothing is typed in here except the
post-research updates listed in UPDATES, each with its own source.

Run: python3 scripts/build_wm.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(ROOT, 'research', 'waysandmeans', 'data')
OUT = os.path.join(ROOT, 'src', 'data', 'committees', 'wm')

STATES = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado',
    'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana',
    'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota',
    'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina',
    'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
    'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas',
    'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia', 'VI': 'U.S. Virgin Islands',
    'PR': 'Puerto Rico', 'GU': 'Guam', 'AS': 'American Samoa', 'MP': 'Northern Mariana Islands',
}

# Facts that changed after the research pass (November 9, 2026). Each carries its own source.
UPDATES = {
    'greg-murphy': {
        'status2026': 'Defeated in general',
        'detail': 'Democrat Raymond Smith led by 293 votes, 118,488 to 118,195, after provisional and cured absentee ballots were counted. Murphy conceded on November 11. Results are unofficial until the county canvass.',
        'eventDate': '2026-11-11',
        'source': 'https://www.carolinajournal.com/greg-murphy-concedes-in-nc-3/',
        'sourceLabel': 'Carolina Journal, Greg Murphy concedes in NC-3 (November 11, 2026), citing State Board of Elections unofficial results',
    },
    'mike-carey': {
        'status2026': 'Defeated in general',
        'detail': 'The Associated Press projected Democrat Don Leonard the winner on election night. Unofficial returns showed Leonard 52 percent to Carey 45 percent with 85 percent of precincts reporting.',
        'eventDate': '2026-11-03',
        'source': 'https://www.wosu.org/politics-government/2026-11-03/democrat-don-leonard-unseats-republican-u-s-rep-mike-carey-in-stunning-upset',
        'sourceLabel': 'WOSU, Democrat Don Leonard unseats Republican U.S. Rep. Mike Carey in stunning upset (November 3, 2026)',
    },
    'mike-thompson': {
        'status2026': 'Race not called',
        'detail': 'Democrat Eric Jones led Thompson 52.0 percent to 47.9 percent, 105,129 votes to 96,940, with an estimated 78.9 percent counted. No winner had been called.',
        'eventDate': '2026-11-12',
        'source': 'https://www.kqed.org/elections/results/california/congress-4th-district',
        'sourceLabel': 'KQED, 2026 Election Results for the U.S. House 4th District (updated 6:52 a.m. PT, November 12, 2026; AP estimate of votes counted)',
    },
}


# Common names for display (the Clerk's file carries middle initials and suffixes).
# Taken from the old desk's member list, accents restored.
DISPLAY_NAMES = {
    'jodey-arrington': 'Jodey Arrington', 'carol-miller': 'Carol Miller', 'greg-murphy': 'Greg Murphy',
    'brian-fitzpatrick': 'Brian Fitzpatrick', 'greg-steube': 'Greg Steube', 'blake-moore': 'Blake Moore',
    'rudy-yakym': 'Rudy Yakym', 'max-miller': 'Max Miller', 'richard-neal': 'Richard Neal',
    'john-larson': 'John Larson', 'danny-davis': 'Danny Davis', 'linda-sanchez': 'Linda Sánchez',
    'terri-sewell': 'Terri Sewell', 'suzan-delbene': 'Suzan DelBene', 'brendan-boyle': 'Brendan Boyle',
    'don-beyer': 'Don Beyer', 'brad-schneider': 'Brad Schneider', 'stacey-plaskett': 'Stacey Plaskett',
    'tom-suozzi': 'Tom Suozzi',
}


PTR_DIR = os.path.join(ROOT, 'research', 'waysandmeans', 'raw', 'fd', 'ptr_text')
OWNERS = {'SP': 'Spouse', 'JT': 'Joint', 'DC': 'Dependent child', '': 'Self'}
TX = re.compile(r'(?:^|(?<=\s)|(?<=\]))(P|S \(partial\)|S|E)\s+(\d{2}/\d{2}/\d{4})(\d{2}/\d{2}/\d{4})\s*(.*)$')
HEADER = {'Type', 'Date Notification', 'Date', 'Amount Cap.', 'Gains >', '$200?', 'ID Owner Asset Transaction'}


def parse_ptr(year, doc):
    """Rows of one periodic transaction report, read from the PDF text: owner, asset, dates, amount, filing status."""
    path = os.path.join(PTR_DIR, f'{year}_{doc}.txt')
    lines = [l.replace('\x00', '').strip() for l in open(path, encoding='utf-8', errors='replace')]
    rows, buf, cur, in_table = [], [], None, False
    for l in lines:
        if l.startswith('ID Owner Asset Transaction'):
            in_table, buf, cur = True, [], None
            continue
        if not in_table or not l:
            continue
        if l.startswith('*') or re.match(r'^I\s+V\s+D', l) or l.startswith('Filing ID #'):
            in_table = l.startswith('Filing ID #') and False
            buf, cur = [], None
            continue
        if l in HEADER:
            continue
        m = re.match(r'^F\s+S\s*:\s*(.*)$', l)
        if m:
            if cur is not None:
                cur['filingStatus'] = m.group(1).strip()
            buf = []
            continue
        if re.match(r'^(S\s+O|D|C)\s*:', l) or re.match(r'^C\s+S', l):
            buf = []
            continue
        if cur is not None and cur['amount'].endswith('-') and l.startswith('$'):
            cur['amount'] = f"{cur['amount']} {l}"
            continue
        t = TX.search(l)
        if t:
            head = l[: t.start()].strip()
            if head:
                buf.append(head)
            text = ' '.join(buf).strip()
            om = re.match(r'^(\d{6,})?(SP|JT|DC)?\s*(.*)$', text)
            owner = om.group(2) or ''
            asset = om.group(3)
            tk = re.search(r'\(([A-Z.]{1,6})\)', asset)
            cur = {
                'owner': OWNERS.get(owner, owner), 'asset': asset, 'ticker': tk.group(1) if tk else '',
                'tx': t.group(1), 'date': t.group(2), 'notified': t.group(3), 'amount': t.group(4).strip(),
                'filingStatus': None, 'docId': doc,
            }
            rows.append(cur)
            buf = []
            continue
        buf.append(l)
    for r in rows:
        r['amount'] = re.sub(r'\s*-\s*', '-', r['amount'])
        r['assetName'] = re.sub(r'\s*\([A-Z.]{1,6}\)\s*', ' ', re.sub(r'\s*\[[A-Z]{2}\]\s*', ' ', r['asset'])).strip(' -')
        r['assetName'] = re.sub(r'\s+', ' ', r['assetName'])
    return rows


def clean_trades(member_rows):
    """Re-read owner, asset and amount from the PTR text, and drop trades an amended report restates."""
    out = []
    cache, used = {}, set()
    norm = lambda a: re.sub(r'[^0-9$]', '', a)
    for t in member_rows:
        key = (t['year'], t['docId'])
        if key not in cache:
            cache[key] = parse_ptr(*key)
        cands = [
            (i, r) for i, r in enumerate(cache[key])
            if (key, i) not in used and r['date'] == t['transactionDate'] and (not t.get('ticker') or r['ticker'] == t['ticker'])
        ]
        same_amt = [c for c in cands if norm(c[1]['amount']) == norm(t['amount'])]
        pick = (same_amt or cands or [None])[0]
        if pick is None:
            raise SystemExit(f"PTR {t['docId']}: no row matches {t.get('ticker')} {t['transactionDate']}")
        used.add((key, pick[0]))
        r = pick[1]
        out.append({
            'owner': r['owner'], 'asset': r['assetName'], 'ticker': r['ticker'],
            'transaction': {'P': 'Purchase', 'S': 'Sale', 'S (partial)': 'Partial sale', 'E': 'Exchange'}[r['tx']],
            'transactionDate': r['date'], 'amount': r['amount'], 'source': t['source'],
            'filingStatus': r['filingStatus'], 'docId': r['docId'],
        })
    # An amended report restates trades from an earlier report (it may correct type or amount): drop the earlier rows it covers.
    amended = {}
    for t in out:
        if (t['filingStatus'] or '').startswith('Amend'):
            amended.setdefault((t['ticker'], t['transactionDate']), set()).add(t['docId'])
    kept = [
        t for t in out
        if (t['filingStatus'] or '').startswith('Amend')
        or not (amended.get((t['ticker'], t['transactionDate'])) - {t['docId']} if amended.get((t['ticker'], t['transactionDate'])) else set())
    ]
    return kept, len(out) - len(kept)


def load(name):
    with open(os.path.join(R, name + '.json')) as f:
        return json.load(f)


def by_slug(rows):
    return {r['slug']: r for r in (rows if isinstance(rows, list) else rows.values())}


def fact(facts, field):
    for f in facts or []:
        if f.get('field') == field:
            return f
    return None


def money_cycle(c, facts, cycle):
    if not c:
        return None
    f = fact(facts, f'healthcarePacTotal{cycle}')
    return {
        'total': c['total'],
        'bySector': c['bySector'],
        'contributionCount': c['contributionCount'],
        'topPacs': c['topPacs'][:10],
        'source': f"https://www.fec.gov/data/candidate/{c['fecCandidateId']}/?cycle={cycle}" if c.get('fecCandidateId') else (f['source'] if f else None),
        'sourceLabel': f['sourceLabel'] if f else None,
        'asOf': f['asOf'] if f else None,
    }


def main():
    roster = load('roster')
    money = load('money')
    votes = load('votes')
    trades = load('trades')
    devs = load('developments')

    money_by = by_slug(money['members'])
    trades_by = by_slug(trades['members'])
    # Match election outcomes by state and district (names differ: middle initials, nicknames).
    devs_by = {}
    for d in (devs['members'] if isinstance(devs['members'], list) else devs['members'].values()):
        devs_by[d['stateDistrict'].replace('-', '').replace('AL', '00') if d['stateDistrict'].endswith('-AL') else d['stateDistrict'].replace('-', '')] = d

    key = [v for v in votes['votes'] if v['keyVote']]
    key.sort(key=lambda v: v['date'])

    def vote_id(v):
        return f"{v['year']}-{v['rollCall']}"

    members = []
    for m in sorted(roster['members'], key=lambda x: (x['party'] != 'R', x['committeeRank'])):
        slug = m['slug']
        mo = money_by.get(slug, {})
        tr = trades_by.get(slug, {})
        dv = devs_by.get(m['stateDistrict'])
        if not dv:
            raise SystemExit(f"no 2026 outcome for {m['name']} ({m['stateDistrict']})")
        outcome = None
        if dv:
            outcome = {
                'status': dv['status2026'], 'detail': dv['detail'], 'date': dv.get('eventDate'),
                'source': dv['source'], 'sourceLabel': dv['sourceLabel'],
            }
        if slug in UPDATES:
            u = UPDATES[slug]
            outcome = {'status': u['status2026'], 'detail': u['detail'], 'date': u['eventDate'], 'source': u['source'], 'sourceLabel': u['sourceLabel']}

        mvotes = []
        for v in key:
            pos = v['memberVotes'].get(m['bioguideId'])
            mvotes.append({'id': vote_id(v), 'vote': pos['vote'] if pos else 'Not on the roll'})

        hc_rows, hc_dropped = clean_trades(tr.get('healthcareTransactions', []))
        ptr_fact = fact(tr.get('facts'), 'ptrCount2025_2026')
        hc_fact = fact(tr.get('facts'), 'healthcareTransactions2025_2026')
        members.append({
            'slug': slug,
            'bioguideId': m['bioguideId'],
            'name': DISPLAY_NAMES.get(slug, m['name']),
            'officialName': m['name'],
            'lastName': m['lastName'],
            'party': m['party'],
            'partyName': 'Republican' if m['party'] == 'R' else 'Democrat',
            'stateCode': m['state'],
            'state': STATES.get(m['state'], m['state']),
            'district': m['district'],
            'committeeRank': m['committeeRank'],
            'fullCommitteeRole': m['fullCommitteeRole'],
            'viceRankingMember': m['viceRankingMember'],
            'subcommittees': [{'name': s['name'], 'role': s['role']} for s in m['subcommittees']],
            'healthSubcommittee': any(s['code'] == 'WM02' for s in m['subcommittees']),
            'firstHouseTerm': m['firstHouseTerm'],
            'rosterSource': 'Clerk of the House, Member Data XML, published November 3, 2026',
            'rosterSourceUrl': 'https://clerk.house.gov/xml/lists/MemberData.xml',
            'outcome': outcome,
            'money': {
                '2026': money_cycle(mo.get('cycle2026'), mo.get('facts'), 2026),
                '2024': money_cycle(mo.get('cycle2024'), mo.get('facts'), 2024),
                'fecCandidateId': (mo.get('cycle2026') or {}).get('fecCandidateId'),
            },
            'votes': mvotes,
            'trades': {
                'ptrCount': ptr_fact['value'] if ptr_fact else None,
                'ptrNote': ptr_fact.get('note') if ptr_fact else None,
                'unreadable': tr.get('unreadablePtrs', 0),
                'healthcare': hc_rows,
                'amendmentDuplicatesDropped': hc_dropped,
                'source': (hc_fact or ptr_fact or {}).get('source'),
                'sourceLabel': 'Clerk of the House, periodic transaction reports listed in the 2025 and 2026 financial disclosure indexes',
                'asOf': (ptr_fact or {}).get('asOf'),
            },
        })

    vote_rows = []
    for v in key:
        positions = [
            {'bioguideId': b, 'name': p['name'], 'party': p['party'], 'vote': p['vote']}
            for b, p in v['memberVotes'].items()
        ]
        by_bio = {m['bioguideId']: m for m in members}
        for p in positions:
            mm = by_bio.get(p['bioguideId'])
            p['slug'] = mm['slug'] if mm else None
            if mm:
                p['name'] = mm['name']
        vote_rows.append({
            'id': vote_id(v), 'year': v['year'], 'rollCall': v['rollCall'], 'date': v['date'],
            'legisNum': v['legisNum'], 'question': v['question'], 'description': v['description'],
            'why': v['why'], 'result': v['result'], 'totals': v['totals'], 'byParty': v['byParty'],
            'waysAndMeansTally': v['waysAndMeansTally'], 'positions': positions,
            'source': v['source'], 'sourceLabel': v['sourceLabel'],
        })

    def uncalled(m):
        return 'not called' in m['outcome']['status'].lower()

    lost = [m for m in members if m['outcome']['status'] != 'Re-elected' and not uncalled(m)]
    meta = {
        'asOf': '2026-11-12',
        'counts': roster['counts'],
        'leadership': roster['leadership'],
        'subcommitteeLeaders': roster['subcommitteeLeaders'],
        'houseControl': devs['houseControl'],
        'expectedLeaders': devs['expectedLeaders'],
        'money': {
            cyc: {k: money['cycles'][cyc][k] for k in ('committeeTotal', 'latestTransactionDate', 'pacsMatched', 'topPacs')}
            for cyc in ('2026', '2024')
        },
        'moneyBasis': money['basis'],
        'moneySource': money['sourceLabel'],
        'moneySourceUrl': money['source'],
        'votesSource': votes['sourceLabel'],
        'votesScanned': votes['rollCallsScanned'],
        'votesFilter': votes['filter'],
        'healthVotesMatched': votes['allMatched'],
        'tradesTotals': trades['totals'],
        'notReturning': len(lost),
        'notCalled': [m['name'] for m in members if uncalled(m)],
    }

    os.makedirs(OUT, exist_ok=True)
    for name, data in (('members', members), ('votes', vote_rows), ('meta', meta)):
        p = os.path.join(OUT, name + '.json')
        with open(p + '.tmp', 'w') as f:
            json.dump(data, f, indent=1, ensure_ascii=False)
            f.write('\n')
        os.replace(p + '.tmp', p)
    print(f"members {len(members)}, key votes {len(vote_rows)}, not returning {len(lost)}, not called {meta['notCalled']}")


if __name__ == '__main__':
    main()
