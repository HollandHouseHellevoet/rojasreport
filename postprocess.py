"""Post-process: Fix DC slug, enrich Virginia with inline object data, fix DC filename."""
import json, os, re

states_dir = 'extracted/states'

# 1. Fix DC: rename file and fix slug
dc_old = os.path.join(states_dir, 'washington,-dc.json')
dc_new = os.path.join(states_dir, 'washington-dc.json')
if os.path.exists(dc_old):
    with open(dc_old) as f:
        dc = json.load(f)
    dc['slug'] = 'washington-dc'
    with open(dc_new, 'w') as f:
        json.dump(dc, f, indent=2)
    os.remove(dc_old)
    print("Fixed DC: renamed and fixed slug")

# 2. Enrich Virginia with the inline data object
va_path = os.path.join(states_dir, 'virginia.json')
with open(va_path) as f:
    va = json.load(f)

# Parse the object from the bundle
va_bundle = 'assets/VirginiaCON-Dbt3HkZl.js'
with open(va_bundle) as f:
    va_content = f.read()

obj_match = re.search(r'const i=\{([^}]+)\}', va_content)
if obj_match:
    obj_str = obj_match.group(1)
    # Parse key-value pairs
    va_obj = {}
    for m in re.finditer(r'(\w+):"([^"]*)"', obj_str):
        va_obj[m.group(1)] = m.group(2)
    for m in re.finditer(r'(\w+):(\d+)', obj_str):
        va_obj[m.group(1)] = int(m.group(2))

    # Enrich
    va['meta_description'] = f"Virginia CON score {va_obj.get('score','?')}/100 (Most Restrictive). {va_obj.get('regulatedServicesCount','?')} services regulated since {va_obj.get('conYear','?')}. See how the law impacts healthcare access and cost."
    va['path'] = f"/{va_obj.get('slug','virginia')}/certificate-of-need"
    va['governor'] = va_obj.get('governor', '')
    va['party'] = va_obj.get('party', '')
    va['con_year'] = va_obj.get('conYear', '')
    va['reviewing_agency'] = va_obj.get('agency', '')
    va['application_fee'] = va_obj.get('appFee', '')
    va['review_timeline'] = va_obj.get('reviewTimeline', '')
    va['competitor_intervention'] = va_obj.get('competitorIntervention', '')
    va['regulated_services_count'] = va_obj.get('regulatedServicesCount', '')
    va['key_systems'] = [
        {'name': va_obj.get('topSystem1Name',''), 'revenue': va_obj.get('topSystem1Revenue','')},
        {'name': va_obj.get('topSystem2Name',''), 'revenue': va_obj.get('topSystem2Revenue','')},
        {'name': va_obj.get('topSystem3Name',''), 'revenue': va_obj.get('topSystem3Revenue','')},
    ]
    va['top_insurer_share'] = va_obj.get('topInsurerShare', '')
    va['case_law_summary'] = va_obj.get('caseLawSummary', '')

    # Also add quick stats from template literals in the bundle
    va['quick_stats'] = [
        {'value': str(va_obj.get('regulatedServicesCount','')), 'label': 'Services regulated by CON'},
        {'value': va_obj.get('conYear',''), 'label': 'Year CON enacted'},
        {'value': va_obj.get('topInsurerShare',''), 'label': 'Top Insurer Market Share'},
        {'value': 'Highly Concentrated', 'label': 'Northern VA Hospital Market'},
    ]

    with open(va_path, 'w') as f:
        json.dump(va, f, indent=2)
    print(f"Enriched Virginia with {len(va_obj)} fields from inline object")

# 3. Copy updated files to final output
final_dir = 'rojas-report-data/con/states'
os.makedirs(final_dir, exist_ok=True)
for fname in os.listdir(states_dir):
    if fname.endswith('.json'):
        with open(os.path.join(states_dir, fname)) as f:
            data = json.load(f)
        with open(os.path.join(final_dir, fname), 'w') as f:
            json.dump(data, f, indent=2)

# Also copy master and overview
for fname in ['master.json', 'overview.json']:
    src = os.path.join('extracted', fname)
    dst = os.path.join('rojas-report-data/con', fname)
    if os.path.exists(src):
        with open(src) as f:
            data = json.load(f)
        with open(dst, 'w') as f:
            json.dump(data, f, indent=2)

print(f"\nCopied {len(os.listdir(final_dir))} state files + master + overview to rojas-report-data/con/")
