"""Build scope-matrix.json by classifying each state's scope_data into Cicero's 9 categories."""
import json, os, re

CATEGORIES = [
    "Acute Hospital Beds",
    "Ambulatory Surgery Centers",
    "Psychiatric Facilities",
    "Substance Abuse / Behavioral",
    "Nursing Homes / Long-Term Care",
    "Day Surgery / Day Services",
    "Home Health / Hospice",
    "Imaging (MRI, PET, CT)",
    "Other (Rehab, Equipment)",
]

# Keywords that map to each category
CAT_KEYWORDS = {
    "Acute Hospital Beds": ["hospital", "inpatient", "acute", "beds", "general hospital"],
    "Ambulatory Surgery Centers": ["ambulatory", "asc", "surgery center", "outpatient surg", "surgical center", "surgical facilit"],
    "Psychiatric Facilities": ["psychiatric", "mental health", "behavioral inpatient", "community mental"],
    "Substance Abuse / Behavioral": ["substance abuse", "behavioral outpatient", "chemical depend", "addiction", "substance use"],
    "Nursing Homes / Long-Term Care": ["nursing home", "nursing facilit", "long-term care", "skilled nursing", "intermediate care", "icf"],
    "Day Surgery / Day Services": ["day surgery", "day service", "outpatient"],
    "Home Health / Hospice": ["home health", "hospice", "home care"],
    "Imaging (MRI, PET, CT)": ["mri", "pet scan", "ct scan", "imaging", "diagnostic", "lithotripsy", "radiation therapy", "pet,"],
    "Other (Rehab, Equipment)": ["rehab", "equipment", "renal", "dialysis", "esrd", "transplant", "cardiac", "open heart", "neonatal", "capital expenditure", "burn", "air ambulance"],
}

states_dir = "data/states"
matrix = []

for fname in sorted(os.listdir(states_dir)):
    if not fname.endswith('.json'):
        continue
    with open(os.path.join(states_dir, fname)) as f:
        state = json.load(f)

    # Combine all text sources that mention regulated services
    all_text = " ".join(state.get("scope_data", []) + state.get("content_blocks", [])[:5]).lower()

    row = {
        "state": state["state"],
        "abbreviation": state["abbreviation"],
        "slug": state["slug"],
        "score": state.get("score", 0),
        "tier": state.get("tier", ""),
    }

    cats = {}
    for cat, keywords in CAT_KEYWORDS.items():
        match = any(kw in all_text for kw in keywords)
        cats[cat] = match

    # If we have very little scope data, infer from score
    # States with score >= 65 typically regulate most categories
    scope_items = state.get("scope_data", [])
    specific_items = [s for s in scope_items if len(s) > 15 and "requiring" not in s.lower()]

    # If no specific categories detected but state has CON, mark hospitals at minimum
    if state.get("con_status") == "Yes" and not any(cats.values()):
        cats["Acute Hospital Beds"] = True
        if state.get("score", 0) >= 65:
            cats["Nursing Homes / Long-Term Care"] = True
            cats["Home Health / Hospice"] = True

    row["categories"] = cats
    matrix.append(row)

with open("data/scope-matrix.json", "w") as f:
    json.dump(matrix, f, indent=2)

# Summary
total_checks = sum(sum(1 for v in r["categories"].values() if v) for r in matrix)
print(f"Built scope matrix: {len(matrix)} states, {total_checks} total checkmarks")
for cat in CATEGORIES:
    count = sum(1 for r in matrix if r["categories"].get(cat))
    print(f"  {cat}: {count} states")
