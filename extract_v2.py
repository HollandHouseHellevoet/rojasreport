import re, json, os

def slugify(name):
    return name.lower().replace(' ', '-').replace('.', '').replace("'", '')

name_map = {
    'Alabama':'Alabama','Alaska':'Alaska','Arkansas':'Arkansas','Connecticut':'Connecticut',
    'DC':'Washington, D.C.','Delaware':'Delaware','Florida':'Florida','Georgia':'Georgia',
    'Hawaii':'Hawaii','Illinois':'Illinois','Iowa':'Iowa','Kentucky':'Kentucky',
    'Louisiana':'Louisiana','Maine':'Maine','Maryland':'Maryland','Massachusetts':'Massachusetts',
    'Michigan':'Michigan','Minnesota':'Minnesota','Mississippi':'Mississippi','Missouri':'Missouri',
    'Montana':'Montana','Nebraska':'Nebraska','Nevada':'Nevada','NewJersey':'New Jersey',
    'NewYork':'New York','NorthCarolina':'North Carolina','NorthDakota':'North Dakota',
    'Oklahoma':'Oklahoma','Oregon':'Oregon','RhodeIsland':'Rhode Island',
    'Tennessee':'Tennessee','Vermont':'Vermont','Virginia':'Virginia',
    'Washington':'Washington','WestVirginia':'West Virginia','Wisconsin':'Wisconsin'
}

abbr_map = {
    'Alabama':'AL','Alaska':'AK','Arkansas':'AR','Connecticut':'CT','Washington, D.C.':'DC',
    'Delaware':'DE','Florida':'FL','Georgia':'GA','Hawaii':'HI','Illinois':'IL','Iowa':'IA',
    'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
    'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
    'Nebraska':'NE','Nevada':'NV','New Jersey':'NJ','New York':'NY','North Carolina':'NC',
    'North Dakota':'ND','Oklahoma':'OK','Oregon':'OR','Rhode Island':'RI','Tennessee':'TN',
    'Vermont':'VT','Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI'
}

def deep_extract(filepath, raw_name):
    with open(filepath) as f:
        content = f.read()

    state_name = name_map.get(raw_name, raw_name)
    abbr = abbr_map.get(state_name, '??')

    state = {
        'state': state_name,
        'abbreviation': abbr,
        'slug': slugify(state_name),
    }

    # Meta
    desc = re.search(r'description:"([^"]+)"', content)
    if desc:
        state['meta_description'] = desc.group(1)

    path = re.search(r'path:"(/[^"]+)"', content)
    if path:
        state['path'] = path.group(1)

    # Quick stats: {num:"X",label:"Y"} pattern
    qstats = re.findall(r'\{num:"([^"]+)",label:"([^"]+)"\}', content)
    if qstats:
        state['quick_stats'] = [{'value': v, 'label': l} for v, l in qstats]

    # Section headers - Type A
    sections_a = re.findall(r'sectionNumber:"(\d+)"[^}]*?label:"([^"]+)"', content)
    sections_b = re.findall(r'(?<!og)title:"([^"]{3,60})",subtitle:"([^"]+)"', content)
    if sections_a:
        state['section_headers'] = [{'number': n, 'title': t} for n, t in sections_a]
    elif sections_b:
        state['section_headers'] = [{'title': t, 'subtitle': s} for t, s in sections_b]

    # ALL content blocks
    all_blocks = re.findall(r'children:"([^"]{25,})"', content)
    state['content_blocks'] = [b for b in all_blocks
        if not b.startswith('bg-') and not b.startswith('/home')
        and 'className' not in b and len(b) > 30]

    # Scope data
    scope_blocks = [b for b in re.findall(r'children:"([^"]{10,})"', content)
        if any(kw in b.lower() for kw in ['requiring con', 'regulated', 'scope', 'facilities covered',
            'nursing', 'imaging', 'psychiatric', 'home health', 'hospice', 'ambulatory', 'beds',
            'equipment', 'mri', 'pet scan', 'ct scan', 'surgery center', 'long-term'])]
    state['scope_data'] = list(dict.fromkeys(scope_blocks))

    # Application process
    process_blocks = [b for b in re.findall(r'children:"([^"]{20,})"', content)
        if any(kw in b.lower() for kw in ['application', 'fee', 'statutory', 'review', 'timeline',
            'days', 'months', 'approval', 'process', 'filing', 'taxpayer group', 'intervene',
            'contest', 'viable interest', 'opponent', 'incumbent'])]
    state['process_data'] = list(dict.fromkeys(process_blocks))

    # Market concentration
    market_blocks = [b for b in re.findall(r'children:"([^"]{10,})"', content)
        if any(kw in b.lower() for kw in ['hhi', 'market share', 'concentration', 'monopoly',
            'dominant', 'revenue', 'billion', '$', 'system', 'controls'])]
    state['market_data'] = list(dict.fromkeys(market_blocks))

    # Insurer data
    insurer_blocks = [b for b in re.findall(r'children:"([^"]{10,})"', content)
        if any(kw in b.lower() for kw in ['bcbs', 'blue cross', 'aetna', 'united', 'cigna',
            'humana', 'insurer', 'insurance market', 'commercial market', 'carrier', 'payer',
            'horizon', 'anthem', 'kaiser', 'highmark', 'carefirst', 'premera'])]
    state['insurer_data'] = list(dict.fromkeys(insurer_blocks))

    # Case law
    denial_blocks = [b for b in re.findall(r'children:"([^"]{20,})"', content)
        if any(kw in b.lower() for kw in ['denied', 'denial', 'rejected', 'case', 'contested',
            'blocked', 'appealed', 'sought to', 'applied for', 'ftc', 'court', 'judge',
            'supreme', 'ruling'])]
    state['case_law'] = list(dict.fromkeys(denial_blocks))

    # Reform
    reform_blocks = [b for b in re.findall(r'children:"([^"]{20,})"', content)
        if any(kw in b.lower() for kw in ['reform', 'repeal', 'bill', 'legislation', 'governor',
            'signed', 'enacted', 'amended', 'sb ', 'hb ', 'exemption', 'moratorium'])]
    state['reform_data'] = list(dict.fromkeys(reform_blocks))

    # Market bars
    bars = re.findall(r'style:\{width:"(\d+)%"\}[^}]*?children:"([^"]+)"', content)
    if bars:
        state['market_bars'] = [{'width_pct': w, 'label': l} for w, l in bars]

    return state

assets_dir = 'assets'

os.makedirs('extracted/states', exist_ok=True)

seen = set()
all_states = {}

for f in sorted(os.listdir(assets_dir)):
    if 'CON-' in f and f.endswith('.js') and not f.startswith('CONLaws'):
        raw = f.split('CON-')[0]
        if raw in seen:
            continue
        seen.add(raw)
        data = deep_extract(os.path.join(assets_dir, f), raw)
        all_states[data['abbreviation']] = data
        with open(f'extracted/states/{data["slug"]}.json', 'w') as out:
            json.dump(data, out, indent=2)
        print(f"Extracted: {data['state']} ({len(data.get('content_blocks',[]))} blocks)")

with open('extracted/master.json', 'w') as f:
    json.dump(all_states, f, indent=2)

print(f"\nDone. {len(all_states)} states extracted to extracted/")
