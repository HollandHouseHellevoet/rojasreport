"""Build reform-tracker.json with momentum scoring from extracted reform_data."""
import json, os

# Manual scoring based on analysis of reform_data content
# Each state scored on 5 dimensions (0 or 1 each):
#   1. bill_introduced: Reform bill introduced in current/recent session
#   2. committee_assigned: Bill has committee assignment
#   3. hearing_held: Bill had hearing, markup, or floor vote
#   4. governor_supports: Governor publicly supports reform
#   5. reformed_before: State has reformed before (partial repeal, exemptions)

REFORM_SCORES = {
    "AL": {
        "bill_introduced": 1, "committee_assigned": 1, "hearing_held": 1,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "SB 82 (2026)", "sponsor": "—", "bill_status": "Failed",
        "notes": "2026 repeal bill failed. 1999 moratorium on new CONs remains."
    },
    "AK": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "No significant reform pursued."
    },
    "AR": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Reformed",
        "notes": "Replaced full CON with limited Permit of Approval (POA) system."
    },
    "CT": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "Minor fee/timeline tweaks 2022-2025. Core law intact."
    },
    "DC": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "No significant reforms."
    },
    "DE": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "No reform efforts."
    },
    "FL": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 1, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Partially repealed",
        "notes": "2019 partial repeal eliminated hospital CON. Nursing home/hospice CON remain."
    },
    "GA": {
        "bill_introduced": 1, "committee_assigned": 1, "hearing_held": 1,
        "governor_supports": 1, "reformed_before": 1,
        "current_bill": "HB 1339 (2024)", "sponsor": "—", "bill_status": "Enacted",
        "notes": "HB 1339 began incremental reform in 2024. Governor Kemp signed."
    },
    "HI": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "No repeal efforts despite criticism."
    },
    "IL": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Sunset 2029",
        "notes": "CON law sunsets in 2029 unless renewed. Incumbents expected to fight renewal block."
    },
    "IA": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "Powerful hospital lobby blocks reform."
    },
    "KY": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "Tiwari v. Meier failed at SCOTUS (2022). No legislative reform."
    },
    "LA": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Minor reforms",
        "notes": "2022/2024 reforms clarified FNR process but entrenched it."
    },
    "ME": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "Repeal efforts consistently fail."
    },
    "MD": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "Unique all-payer rate-setting system makes reform politically complex."
    },
    "MA": {
        "bill_introduced": 1, "committee_assigned": 1, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "2024-2025 Reform", "sponsor": "—", "bill_status": "Enacted (partial)",
        "notes": "2025 reform broadened definition of substantial change. 2017 DoN overhaul."
    },
    "MI": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "Bureaucratic CON process via MDHHS. No reform movement."
    },
    "MN": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Replaced 1984",
        "notes": "CON repealed 1984. Replaced with hospital construction moratorium."
    },
    "MS": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "40-year moratorium on home health lifted only by federal court order."
    },
    "MO": {
        "bill_introduced": 1, "committee_assigned": 1, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "SB 1268", "sponsor": "—", "bill_status": "Introduced",
        "notes": "Partial repeal bill introduced. Full repeal has failed multiple times."
    },
    "MT": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 1, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Mostly repealed",
        "notes": "CON mostly repealed. Limited scope remains."
    },
    "NE": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Heavily reformed",
        "notes": "Narrow CON: primarily a moratorium on new LTC beds."
    },
    "NV": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "CON law since 1971. No significant repeal efforts."
    },
    "NJ": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Minor exemptions",
        "notes": "1998 reform created exemptions for ASCs and PET scans. Core law intact."
    },
    "NY": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "The state that started it all (1964). No meaningful reform."
    },
    "NC": {
        "bill_introduced": 1, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "Reform bill (2024)", "sponsor": "—", "bill_status": "Introduced",
        "notes": "Reform bills introduced but face strong hospital lobby opposition."
    },
    "ND": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Effectively repealed",
        "notes": "CON effectively repealed for most services. Minimal scope remains."
    },
    "OK": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 1, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Largely repealed",
        "notes": "Systematically dismantled over four decades. Only LTC CON remains."
    },
    "OR": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Partial exemptions",
        "notes": "ASCs exempted from CON in 2009. Core law remains."
    },
    "RI": {
        "bill_introduced": 1, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "2026 Repeal Bill", "sponsor": "—", "bill_status": "Introduced",
        "notes": "CON law amended 25+ times but never repealed. 2026 repeal bill introduced."
    },
    "TN": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "Governor Lee (R) has not pushed reform. Legislative efforts stalled."
    },
    "VT": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "CON embedded in broader healthcare planning under Green Mountain Care legacy."
    },
    "VA": {
        "bill_introduced": 1, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "Various COPN bills", "sponsor": "—", "bill_status": "Failed repeatedly",
        "notes": "COPN repeal bills consistently fail in General Assembly. Strong hospital lobby."
    },
    "WA": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "—", "sponsor": "—", "bill_status": "No activity",
        "notes": "State actively amends and updates CON rules rather than reforming."
    },
    "WV": {
        "bill_introduced": 1, "committee_assigned": 1, "hearing_held": 1,
        "governor_supports": 0, "reformed_before": 0,
        "current_bill": "HB 2013", "sponsor": "—", "bill_status": "Failed (13-12)",
        "notes": "CON repeal died by one vote. Closest any state has come without passing."
    },
    "WI": {
        "bill_introduced": 0, "committee_assigned": 0, "hearing_held": 0,
        "governor_supports": 0, "reformed_before": 1,
        "current_bill": "—", "sponsor": "—", "bill_status": "Mostly repealed",
        "notes": "CON repealed post-1987. Only nursing home bed moratorium remains."
    },
}

# Load state data for names/slugs/tiers
states_dir = "data/states"
state_lookup = {}
for fname in os.listdir(states_dir):
    if fname.endswith('.json'):
        with open(os.path.join(states_dir, fname)) as f:
            d = json.load(f)
        state_lookup[d["abbreviation"]] = d

tracker = []
for abbr, scores in REFORM_SCORES.items():
    sd = state_lookup.get(abbr, {})
    total = (scores["bill_introduced"] + scores["committee_assigned"] +
             scores["hearing_held"] + scores["governor_supports"] +
             scores["reformed_before"])

    if total >= 4:
        momentum = "green"
    elif total >= 2:
        momentum = "yellow"
    else:
        momentum = "red"

    tracker.append({
        "state": sd.get("state", abbr),
        "abbreviation": abbr,
        "slug": sd.get("slug", ""),
        "score": sd.get("score", 0),
        "tier": sd.get("tier", ""),
        "momentum_score": total,
        "momentum": momentum,
        "bill_introduced": scores["bill_introduced"],
        "committee_assigned": scores["committee_assigned"],
        "hearing_held": scores["hearing_held"],
        "governor_supports": scores["governor_supports"],
        "reformed_before": scores["reformed_before"],
        "current_bill": scores["current_bill"],
        "sponsor": scores["sponsor"],
        "bill_status": scores["bill_status"],
        "notes": scores["notes"],
    })

# Sort by momentum score desc, then score desc
tracker.sort(key=lambda x: (-x["momentum_score"], -x["score"]))

with open("data/reform-tracker.json", "w") as f:
    json.dump(tracker, f, indent=2)

green = sum(1 for t in tracker if t["momentum"] == "green")
yellow = sum(1 for t in tracker if t["momentum"] == "yellow")
red = sum(1 for t in tracker if t["momentum"] == "red")
print(f"Built reform tracker: {len(tracker)} states")
print(f"  Green (4-5): {green}")
print(f"  Yellow (2-3): {yellow}")
print(f"  Red (0-1): {red}")
