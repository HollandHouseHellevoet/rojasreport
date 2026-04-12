"""Generate SVG OG images for every page. SVGs render in social previews on most platforms."""
import json, os

states_dir = "data/states"
output_dir = "public/og"
os.makedirs(output_dir, exist_ok=True)

NAVY = "#1a2a3a"
NAVY_DARK = "#111e2b"
CREAM = "#f7f4ef"
ORANGE = "#d4622a"

TIER_COLORS = {
    "Free Market": "#22c55e",
    "Mostly Free": "#4ade80",
    "Moderate": "#facc15",
    "Restrictive": "#f97316",
    "Highly Restrictive": "#ef4444",
    "Most Restrictive": "#b91c1c",
}

def make_svg(title, subtitle, score_text, tier, tier_color, badge_text):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="{NAVY_DARK}"/>
  <rect x="0" y="0" width="1200" height="6" fill="{ORANGE}"/>
  <text x="60" y="80" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="{ORANGE}" letter-spacing="3" text-transform="uppercase">THE ROJAS REPORT</text>
  <text x="60" y="200" font-family="Georgia, serif" font-size="56" font-weight="bold" fill="{CREAM}">{title}</text>
  <text x="60" y="260" font-family="system-ui, sans-serif" font-size="22" fill="{CREAM}" opacity="0.55">{subtitle}</text>
  <rect x="60" y="310" width="180" height="70" rx="0" fill="{tier_color}"/>
  <text x="150" y="352" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">{score_text}</text>
  <text x="260" y="352" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="{CREAM}" opacity="0.6">{badge_text}</text>
  <text x="60" y="560" font-family="system-ui, sans-serif" font-size="16" fill="{CREAM}" opacity="0.3">conlaws.rojasreport.com</text>
  <text x="1140" y="560" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="{ORANGE}" text-anchor="end" letter-spacing="2">CON INTELLIGENCE</text>
</svg>'''

# Generate state OG images
for fname in sorted(os.listdir(states_dir)):
    if not fname.endswith('.json'):
        continue
    with open(os.path.join(states_dir, fname)) as f:
        state = json.load(f)

    name = state["state"]
    slug = state["slug"]
    score = state.get("score", 0)
    tier = state.get("tier", "")
    tier_color = TIER_COLORS.get(tier, "#6b7280")
    desc = state.get("meta_description", f"CON intelligence for {name}")
    # Truncate description for SVG
    if len(desc) > 90:
        desc = desc[:87] + "..."

    svg = make_svg(
        title=name,
        subtitle=f"Certificate of Need Laws",
        score_text=f"{score}/100",
        tier=tier,
        tier_color=tier_color,
        badge_text=tier,
    )
    with open(os.path.join(output_dir, f"{slug}.svg"), "w") as f:
        f.write(svg)

# Generate shared page OG images
pages = [
    ("home", "Certificate of Need Laws", "The Architecture of a Healthcare Monopoly", "35", "#b91c1c", "Jurisdictions"),
    ("rankings", "50-State Rankings", "Every jurisdiction scored and ranked by CON restrictiveness", "51", ORANGE, "Jurisdictions"),
    ("scope", "Scope Matrix", "What requires a Certificate of Need in each state?", "9", ORANGE, "Categories"),
    ("compare", "Compare States", "Side-by-side CON law comparison tool", "3", ORANGE, "States Max"),
    ("evidence", "The Evidence", "FTC, DOJ, and academic research on CON law impacts", "5-11%", "#ef4444", "Higher Costs"),
    ("reform", "Reform Tracker 2026", "Momentum scoring across 36 CON states", "36", ORANGE, "States Tracked"),
    ("outcomes", "Reform Outcomes", "Before and after data from states that repealed CON", "3", "#22c55e", "States Reformed"),
    ("timeline", "Timeline", "History of CON laws from 1946 to 2025", "79", ORANGE, "Years"),
    ("methodology", "Methodology", "Classification framework and data sources", "6", ORANGE, "Tiers"),
]

for slug, title, subtitle, score_text, color, badge in pages:
    svg = make_svg(title, subtitle, score_text, "", color, badge)
    with open(os.path.join(output_dir, f"{slug}.svg"), "w") as f:
        f.write(svg)

total = len(os.listdir(output_dir))
print(f"Generated {total} OG images in {output_dir}/")
