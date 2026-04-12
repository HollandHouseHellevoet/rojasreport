"""Merge Cicero rankings from overview.json into each state file, and copy CONLaws overview."""
import json, os, shutil

# Load rankings from the previously extracted overview.json
with open('rojas-report-data/con/overview.json') as f:
    overview = json.load(f)

rankings = overview.get('state_rankings', [])

# Build lookup by state name
rank_lookup = {}
for r in rankings:
    rank_lookup[r['state']] = r

# Also build by abbreviation for DC edge case
name_to_abbr = {
    'Alabama':'AL','Alaska':'AK','Arkansas':'AR','Connecticut':'CT',
    'District of Columbia':'DC','Delaware':'DE','Florida':'FL','Georgia':'GA',
    'Hawaii':'HI','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kentucky':'KY',
    'Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
    'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
    'Nebraska':'NE','Nevada':'NV','New Jersey':'NJ','New York':'NY','North Carolina':'NC',
    'North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Rhode Island':'RI',
    'South Carolina':'SC','Tennessee':'TN','Vermont':'VT','Virginia':'VA',
    'Washington':'WA','West Virginia':'WV','Wisconsin':'WI',
}

# Map state names from our files to ranking state names
our_name_to_ranking_name = {
    'Washington, D.C.': 'District of Columbia',
}

states_dir = 'extracted/states'
merged_count = 0

for fname in sorted(os.listdir(states_dir)):
    if not fname.endswith('.json'):
        continue
    fpath = os.path.join(states_dir, fname)
    with open(fpath) as f:
        data = json.load(f)

    state_name = data.get('state', '')
    lookup_name = our_name_to_ranking_name.get(state_name, state_name)

    ranking = rank_lookup.get(lookup_name)
    if ranking:
        data['score'] = ranking['score']
        data['tier'] = ranking['tier']
        data['rank'] = ranking['rank']
        data['con_status'] = ranking['con_status']
        merged_count += 1
        print(f"  Merged: {state_name} -> score={ranking['score']}, tier={ranking['tier']}, rank={ranking['rank']}")
    else:
        print(f"  WARNING: No ranking found for {state_name} (lookup: {lookup_name})")

    with open(fpath, 'w') as f:
        json.dump(data, f, indent=2)

# Also update master.json
with open('extracted/master.json') as f:
    master = json.load(f)

for abbr, data in master.items():
    state_name = data.get('state', '')
    lookup_name = our_name_to_ranking_name.get(state_name, state_name)
    ranking = rank_lookup.get(lookup_name)
    if ranking:
        data['score'] = ranking['score']
        data['tier'] = ranking['tier']
        data['rank'] = ranking['rank']
        data['con_status'] = ranking['con_status']

with open('extracted/master.json', 'w') as f:
    json.dump(master, f, indent=2)

# Copy the CONLaws overview into extracted/ as well
shutil.copy2('rojas-report-data/con/overview.json', 'extracted/overview.json')

print(f"\nMerged rankings for {merged_count} states. Copied overview.json.")
