"""Generate plain-text state briefs for download at /public/briefs/."""
import json, os, textwrap

states_dir = "data/states"
output_dir = "public/briefs"
os.makedirs(output_dir, exist_ok=True)

def wrap(text, width=78):
    return "\n".join(textwrap.wrap(text, width=width))

for fname in sorted(os.listdir(states_dir)):
    if not fname.endswith('.json'):
        continue
    with open(os.path.join(states_dir, fname)) as f:
        state = json.load(f)

    name = state["state"]
    abbr = state["abbreviation"]
    slug = state["slug"]
    score = state.get("score", "N/A")
    tier = state.get("tier", "N/A")
    rank = state.get("rank", "N/A")

    lines = []
    lines.append("=" * 78)
    lines.append(f"  CERTIFICATE OF NEED INTELLIGENCE BRIEF: {name.upper()}")
    lines.append(f"  The Rojas Report | conlaws.rojasreport.com/states/{slug}/")
    lines.append("=" * 78)
    lines.append("")
    lines.append(f"  State:    {name} ({abbr})")
    lines.append(f"  Score:    {score}/100")
    lines.append(f"  Tier:     {tier}")
    lines.append(f"  Rank:     {rank} of 51 jurisdictions")
    lines.append("")

    # Quick stats
    qs = state.get("quick_stats", [])
    if qs:
        lines.append("-" * 78)
        lines.append("  KEY METRICS")
        lines.append("-" * 78)
        for q in qs:
            lines.append(f"  {q['value']:>12s}  {q['label']}")
        lines.append("")

    # Meta description
    desc = state.get("meta_description", "")
    if desc:
        lines.append("-" * 78)
        lines.append("  SUMMARY")
        lines.append("-" * 78)
        lines.append("")
        lines.append(wrap(f"  {desc}"))
        lines.append("")

    # Scope
    scope = state.get("scope_data", [])
    meaningful_scope = [s for s in scope if len(s) > 10 and len(s) < 120]
    if meaningful_scope:
        lines.append("-" * 78)
        lines.append("  SCOPE OF REGULATION")
        lines.append("-" * 78)
        for item in meaningful_scope[:8]:
            lines.append(f"  * {item}")
        lines.append("")

    # Process
    process = state.get("process_data", [])
    meaningful_process = [p for p in process if len(p) > 20 and "Services Requiring" not in p and "The Application Process" not in p]
    if meaningful_process:
        lines.append("-" * 78)
        lines.append("  APPLICATION PROCESS")
        lines.append("-" * 78)
        lines.append("")
        for item in meaningful_process[:2]:
            lines.append(wrap(f"  {item}"))
            lines.append("")

    # Key systems (Virginia-style)
    systems = state.get("key_systems", [])
    if systems:
        lines.append("-" * 78)
        lines.append("  KEY HEALTH SYSTEMS")
        lines.append("-" * 78)
        for sys in systems:
            lines.append(f"  {sys['name']:30s}  Revenue: {sys['revenue']}")
        lines.append("")

    # Market data highlights
    market = state.get("market_data", [])
    meaningful_market = [m for m in market if len(m) > 40 and len(m) < 300]
    if meaningful_market:
        lines.append("-" * 78)
        lines.append("  MARKET CONCENTRATION")
        lines.append("-" * 78)
        lines.append("")
        for item in meaningful_market[:2]:
            lines.append(wrap(f"  {item}"))
            lines.append("")

    # Reform
    reform = state.get("reform_data", [])
    meaningful_reform = [r for r in reform if len(r) > 20 and len(r) < 300]
    if meaningful_reform:
        lines.append("-" * 78)
        lines.append("  REFORM STATUS")
        lines.append("-" * 78)
        lines.append("")
        for item in meaningful_reform[:2]:
            lines.append(wrap(f"  {item}"))
            lines.append("")

    # Case law
    cases = state.get("case_law", [])
    meaningful_cases = [c for c in cases if len(c) > 20]
    if meaningful_cases:
        lines.append("-" * 78)
        lines.append("  CASE LAW / DENIALS")
        lines.append("-" * 78)
        lines.append("")
        for item in meaningful_cases[:3]:
            lines.append(wrap(f"  {item}"))
            lines.append("")

    # Footer
    lines.append("=" * 78)
    lines.append(f"  Source: The Rojas Report | conlaws.rojasreport.com/states/{slug}/")
    lines.append(f"  Data: Cicero Institute, NASHP, FTC, DOJ, CMS, state health departments")
    lines.append(f"  Generated: April 2026")
    lines.append("=" * 78)

    brief_path = os.path.join(output_dir, f"{slug}.txt")
    with open(brief_path, "w") as f:
        f.write("\n".join(lines))

print(f"Generated {len(os.listdir(output_dir))} briefs in {output_dir}/")
