"""
Data enrichment script: Fix key_systems, scope, em dashes across all 36 states.
Run from repo root: python3 scripts/enrich-state-data.py
"""
import json, os, re

states_dir = "data/states"

# ---- FACILITY KEYWORDS for scope parsing ----
FACILITY_KEYWORDS = {
    "Hospitals": ["hospital", "acute care", "inpatient"],
    "Ambulatory Surgery Centers (ASCs)": ["ambulatory surg", "asc", "surgery center", "outpatient surg"],
    "Nursing Homes / Long-Term Care": ["nursing home", "nursing facilit", "long-term care", "skilled nursing", "intermediate care", "icf", "ltc"],
    "Home Health Agencies": ["home health"],
    "Hospice": ["hospice"],
    "Psychiatric Facilities": ["psychiatric", "mental health", "behavioral"],
    "Imaging (MRI, CT, PET)": ["mri", "ct scan", "pet scan", "imaging", "diagnostic test", "lithotripsy"],
    "Rehabilitation Facilities": ["rehabilitation", "rehab"],
    "End-Stage Renal Disease / Dialysis": ["renal", "dialysis", "esrd"],
    "Substance Abuse Treatment": ["substance abuse", "addiction", "chemical depend"],
    "Cardiac / Open Heart Surgery": ["cardiac", "open heart", "heart surgery"],
    "Organ Transplantation": ["transplant"],
    "Neonatal Care": ["neonatal"],
    "Radiation Therapy": ["radiation therapy"],
    "Major Medical Equipment": ["equipment", "capital expendit"],
    "Burn Care": ["burn"],
    "Air Ambulance": ["air ambulance"],
}

# ---- SYSTEM NAME EXTRACTION PATTERNS ----
SYSTEM_PATTERNS = [
    # "$3.5B" style revenue mentions
    r'([A-Z][A-Za-z\s\.\&\'-]+?)\s*\(\$[\d\.]+[BM]\b[^)]*\)',
    # "System Name ($X.XB in revenue)"
    r'([A-Z][A-Za-z\s\.\&\'-]+?)\s*\(\$[\d\.]+[BM]\s+in\s+revenue\)',
    # Standalone system names in short market_data entries
]

# Known systems for states where regex extraction is insufficient
KNOWN_SYSTEMS = {
    "AL": [{"name": "UAB Health System", "revenue": "$3.5B"}, {"name": "Huntsville Hospital", "revenue": "$2.9B"}, {"name": "Infirmary Health", "revenue": ""}],
    "AR": [{"name": "Baptist Health", "revenue": ""}, {"name": "Mercy Health", "revenue": ""}, {"name": "CHI St. Vincent", "revenue": ""}],
    "CT": [{"name": "Hartford HealthCare", "revenue": "$5.4B"}, {"name": "Yale New Haven Health", "revenue": "$6.1B"}, {"name": "Nuvance Health", "revenue": ""}],
    "DE": [{"name": "ChristianaCare", "revenue": "$2.5B"}, {"name": "Bayhealth", "revenue": ""}],
    "FL": [{"name": "AdventHealth", "revenue": "$17B"}, {"name": "HCA Florida", "revenue": ""}, {"name": "Orlando Health", "revenue": ""}],
    "GA": [{"name": "Piedmont Healthcare", "revenue": "$5.6B"}, {"name": "Wellstar Health", "revenue": ""}, {"name": "Northside Hospital", "revenue": ""}],
    "HI": [{"name": "Queen's Health System", "revenue": "$1.7B"}, {"name": "Hawaii Pacific Health", "revenue": ""}],
    "IL": [{"name": "Advocate Aurora", "revenue": ""}, {"name": "Northwestern Medicine", "revenue": ""}, {"name": "OSF HealthCare", "revenue": ""}],
    "IA": [{"name": "UnityPoint Health", "revenue": ""}, {"name": "MercyOne", "revenue": ""}],
    "KY": [{"name": "Norton Healthcare", "revenue": ""}, {"name": "Baptist Health", "revenue": ""}, {"name": "CHI Saint Joseph", "revenue": ""}],
    "LA": [{"name": "Ochsner Health", "revenue": ""}, {"name": "LCMC Health", "revenue": ""}],
    "ME": [{"name": "MaineHealth", "revenue": ""}, {"name": "Northern Light Health", "revenue": ""}],
    "MD": [{"name": "Johns Hopkins Health", "revenue": "$9.0B"}, {"name": "University of Maryland Medical", "revenue": "$8.7B"}, {"name": "MedStar Health", "revenue": ""}],
    "MA": [{"name": "Mass General Brigham", "revenue": "$18.5B"}, {"name": "Beth Israel Lahey Health", "revenue": ""}],
    "MI": [{"name": "Beaumont/Corewell Health", "revenue": ""}, {"name": "Henry Ford Health", "revenue": ""}, {"name": "Trinity Health Michigan", "revenue": ""}],
    "MN": [{"name": "Mayo Clinic", "revenue": ""}, {"name": "Allina Health", "revenue": ""}],
    "MS": [{"name": "University of Mississippi Medical Center", "revenue": ""}, {"name": "Baptist Memorial Health Care", "revenue": ""}, {"name": "Merit Health", "revenue": ""}],
    "NV": [{"name": "Sunrise Health (HCA)", "revenue": ""}, {"name": "Dignity Health Nevada", "revenue": ""}],
    "NC": [{"name": "Atrium Health", "revenue": ""}, {"name": "Novant Health", "revenue": ""}, {"name": "UNC Health", "revenue": ""}],
    "NJ": [{"name": "RWJBarnabas Health", "revenue": "$7.5B"}, {"name": "Hackensack Meridian Health", "revenue": ""}],
    "OR": [{"name": "Providence Health Oregon", "revenue": ""}, {"name": "Legacy Health", "revenue": ""}],
    "TN": [{"name": "HCA Healthcare", "revenue": ""}, {"name": "Ascension Saint Thomas", "revenue": ""}, {"name": "Ballad Health", "revenue": ""}],
    "VT": [{"name": "University of Vermont Health", "revenue": ""}],
    "WA": [{"name": "Providence Swedish", "revenue": ""}, {"name": "MultiCare Health", "revenue": ""}, {"name": "Virginia Mason Franciscan", "revenue": ""}],
    "DC": [{"name": "MedStar Health", "revenue": ""}, {"name": "GW University Hospital", "revenue": ""}, {"name": "Children's National", "revenue": ""}],
    "WV": [{"name": "WVU Medicine", "revenue": ""}, {"name": "CAMC Health System", "revenue": ""}],
    "WI": [{"name": "Advocate Aurora Health", "revenue": ""}, {"name": "Ascension Wisconsin", "revenue": ""}],
    "ND": [{"name": "Sanford Health", "revenue": ""}, {"name": "CHI St. Alexius", "revenue": ""}],
}

def extract_systems(state_data):
    """Extract named health systems with revenue from all text fields."""
    systems = []
    seen = set()

    all_text = state_data.get("content_blocks", []) + state_data.get("market_data", [])

    for text in all_text:
        # Pattern: "Name ($X.XB)" or "Name ($X.XB in revenue)"
        for m in re.finditer(r'([A-Z][A-Za-z\s\.\&\'-]{3,40}?)\s*\(\$(\d+[\.\d]*[BM])\b[^)]*\)', text):
            name = m.group(1).strip()
            revenue = "$" + m.group(2)
            # Skip false positives
            if name.lower() in ("the", "a", "in", "by", "of", "and", "for"):
                continue
            if len(name) < 4:
                continue
            key = name.lower()
            if key not in seen:
                seen.add(key)
                systems.append({"name": name, "revenue": revenue})

        # Pattern: "Name, City" in short lines (< 60 chars) in market_data
        if len(text) < 60 and ", " in text and any(kw in text.lower() for kw in ["health", "hospital", "medical", "clinic", "baptist"]):
            name = text.split(",")[0].strip()
            if len(name) > 4 and name[0].isupper() and name.lower() not in seen:
                seen.add(name.lower())
                systems.append({"name": name, "revenue": ""})

    # Also check for "Name ($X.XB), Name ($X.XB)" style comma lists
    for text in all_text:
        parts = re.findall(r'([A-Z][A-Za-z\s]+)\s*\(\$(\d+[\.\d]*[BM])\)', text)
        for name, rev in parts:
            name = name.strip()
            key = name.lower()
            if key not in seen and len(name) > 4:
                seen.add(key)
                systems.append({"name": name, "revenue": "$" + rev})

    # Fallback to known systems if extraction found nothing
    abbr = state_data.get("abbreviation", "")
    if not systems and abbr in KNOWN_SYSTEMS:
        systems = KNOWN_SYSTEMS[abbr]

    return systems[:5]  # Cap at 5 systems


def parse_scope(state_data):
    """Extract individual regulated facility types from scope_data and content."""
    found = set()

    # Combine scope_data + first few content blocks
    all_text = " ".join(
        state_data.get("scope_data", []) +
        state_data.get("content_blocks", [])[:8]
    ).lower()

    for facility, keywords in FACILITY_KEYWORDS.items():
        if any(kw in all_text for kw in keywords):
            found.add(facility)

    # If state has CON and we found almost nothing, add minimum based on score
    if state_data.get("con_status") == "Yes" and len(found) < 2:
        found.add("Hospitals")
        if state_data.get("score", 0) >= 45:
            found.add("Nursing Homes / Long-Term Care")
        if state_data.get("score", 0) >= 65:
            found.add("Home Health Agencies")

    # Sort by a sensible order
    order = list(FACILITY_KEYWORDS.keys())
    return sorted(found, key=lambda x: order.index(x) if x in order else 99)


def remove_em_dashes(text):
    """Replace em dashes with commas or periods depending on context."""
    # " — " (with spaces) -> ", " or ". "
    text = re.sub(r'\s*\u2014\s*', ', ', text)
    # Also handle raw " — "
    text = re.sub(r'\s*—\s*', ', ', text)
    # Clean up ", ," or ", ."
    text = text.replace(", ,", ",").replace(", .", ".")
    return text


def fix_provider_word(text):
    """Replace 'provider' with 'physician' or 'system' depending on context."""
    # "healthcare provider" or "provider" in context of individuals -> "physician"
    # "incumbent providers" -> "incumbent systems"
    text = re.sub(r'\bincumbent providers?\b', 'incumbent systems', text, flags=re.IGNORECASE)
    # Leave other "provider" instances for now (too many false positives)
    return text


def process_text_list(items):
    """Apply em dash removal and provider fix to a list of strings."""
    return [fix_provider_word(remove_em_dashes(item)) for item in items]


# ---- PROCESS ALL STATES ----
for fname in sorted(os.listdir(states_dir)):
    if not fname.endswith('.json'):
        continue

    fpath = os.path.join(states_dir, fname)
    with open(fpath) as f:
        state = json.load(f)

    name = state["state"]

    # 1. Extract key_systems if not already present or empty
    if not state.get("key_systems"):
        systems = extract_systems(state)
        if systems:
            state["key_systems"] = systems

    # 2. Parse scope into individual facility types
    parsed_scope = parse_scope(state)
    if parsed_scope:
        state["parsed_scope"] = parsed_scope

    # 3. Remove em dashes from all text fields
    for field in ["content_blocks", "scope_data", "process_data", "market_data",
                   "insurer_data", "case_law", "reform_data"]:
        if field in state and isinstance(state[field], list):
            state[field] = process_text_list(state[field])

    if state.get("meta_description"):
        state["meta_description"] = fix_provider_word(remove_em_dashes(state["meta_description"]))

    if state.get("case_law_summary"):
        state["case_law_summary"] = fix_provider_word(remove_em_dashes(state["case_law_summary"]))

    # 4. Mark content blocks with their primary category for dedup
    # (The component will use this to avoid showing the same block twice)

    with open(fpath, 'w') as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

    sys_count = len(state.get("key_systems", []))
    scope_count = len(state.get("parsed_scope", []))
    print(f"{name:25s} systems={sys_count} scope={scope_count}")

print("\nDone. All states enriched.")
