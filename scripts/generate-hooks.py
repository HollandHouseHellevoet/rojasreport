"""Generate compelling one-line hooks for state cards (replace generic meta_description)."""
import json, os

# Hand-crafted hooks using the best data points from each state
HOOKS = {
    "AL": "Decatur monopoly (HHI 10,000). BCBS controls 84% of the market.",
    "AK": "Premera BCBS owns 79% of the insurer market. HHI 2,785.",
    "AR": "Transitioned to Permit of Approval system. 2 services regulated.",
    "CT": "Yale New Haven Health $6.1B. 40+ years of hospital mergers.",
    "DC": "MedStar dominates tertiary care. George Washington + Children's.",
    "DE": "ChristianaCare $2.5B. 45% restrictiveness. One-system state.",
    "FL": "Mostly repealed in 2019. AdventHealth still pulls in $17B.",
    "GA": "FTC v. Phoebe Putney went to the Supreme Court. Albany HHI: 7,453.",
    "HI": "Queen's Health System: $1.7B. Last fully-regulated Pacific state.",
    "IL": "BCBS controls 97% of the HMO market. CON sunsets in 2029.",
    "IA": "Entrenched hospital lobby. No reform efforts in recent years.",
    "KY": "Three systems control 100% of Louisville. Tiwari v. Meier failed at SCOTUS.",
    "LA": "Ochsner dominates New Orleans. 2024 reform entrenched FNR process.",
    "ME": "MaineHealth + Northern Light. Repeal efforts consistently fail.",
    "MD": "Johns Hopkins $9B. University of Maryland $8.7B. All-payer rates.",
    "MA": "Mass General Brigham $18.5B. 15-year stranglehold on surgical competition.",
    "MI": "Bureaucratic MDHHS process. Corewell + Henry Ford + Trinity dominance.",
    "MN": "CON repealed 1984, replaced with hospital construction moratorium.",
    "MS": "40-year moratorium on home health, lifted only by federal court order.",
    "MO": "SB 1268 partial repeal pending. BJC + SSM + Mercy dominate.",
    "MT": "Mostly repealed in 2021. Limited CON scope remains.",
    "NE": "Narrow CON, primarily a moratorium on new long-term care beds.",
    "NV": "Sunrise (HCA) + Dignity. 100% score. No reform efforts since 1971.",
    "NJ": "RWJBarnabas $7.5B. 25+ regulated services. The Garden State cartel.",
    "NY": "Northwell $17.6B. 26 regulated services. Started it all in 1964.",
    "NC": "Two systems control nearly 100% of Charlotte. BCBS NC holds 62%.",
    "ND": "Effectively repealed. Sanford + CHI St. Alexius dominate.",
    "OK": "Saint Francis: $2.04B revenue. INTEGRIS $1.84B. OU Health $1.64B.",
    "OR": "ASC exemption 2009. Providence + Legacy core-state control.",
    "RI": "Amended 25+ times, never repealed. 2026 repeal bill introduced.",
    "TN": "HCA + Ascension + Ballad. Governor Lee has not pushed reform.",
    "VT": "Green Mountain Care legacy. UVMHN dominates the state.",
    "VA": "Sentara's $13B empire. 19 services regulated. Five systems, $16B+ combined.",
    "WA": "Providence Swedish + MultiCare + Virginia Mason Franciscan. 100% score.",
    "WV": "HB 2013 CON repeal died by one vote (13-12). Closest any state has come.",
    "WI": "CON repealed post-1987. Only nursing home bed moratorium remains.",
}

states_dir = "data/states"
for fname in os.listdir(states_dir):
    if not fname.endswith('.json'):
        continue
    path = os.path.join(states_dir, fname)
    with open(path) as f:
        state = json.load(f)
    abbr = state.get("abbreviation")
    if abbr in HOOKS:
        state["hook"] = HOOKS[abbr]
        with open(path, 'w') as f:
            json.dump(state, f, indent=2, ensure_ascii=False)

print(f"Added hooks to {len(HOOKS)} states")
