#!/usr/bin/env python3
"""Extract structured data from CON state page JS bundles and the CONLaws overview."""

import json
import os
import re
import glob

ASSETS_DIR = "/home/user/rojasreport/assets"
OUTPUT_DIR = "/home/user/rojasreport/rojas-report-data/con/states"
OVERVIEW_OUTPUT = "/home/user/rojasreport/rojas-report-data/con/overview.json"

# State name -> abbreviation mapping
STATE_ABBREVS = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "District of Columbia": "DC", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI",
    "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
    "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME",
    "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN",
    "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE",
    "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
    "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
    "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI",
    "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX",
    "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
    "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
}

# File prefix -> display state name (for multi-word states and DC)
PREFIX_TO_STATE = {
    "Alabama": "Alabama", "Alaska": "Alaska", "Arkansas": "Arkansas",
    "Connecticut": "Connecticut", "DC": "District of Columbia",
    "Delaware": "Delaware", "Florida": "Florida", "Georgia": "Georgia",
    "Hawaii": "Hawaii", "Illinois": "Illinois", "Iowa": "Iowa",
    "Kentucky": "Kentucky", "Louisiana": "Louisiana", "Maine": "Maine",
    "Maryland": "Maryland", "Massachusetts": "Massachusetts",
    "Michigan": "Michigan", "Minnesota": "Minnesota", "Mississippi": "Mississippi",
    "Missouri": "Missouri", "Montana": "Montana", "Nebraska": "Nebraska",
    "Nevada": "Nevada", "NewJersey": "New Jersey", "NewYork": "New York",
    "NorthCarolina": "North Carolina", "NorthDakota": "North Dakota",
    "Oklahoma": "Oklahoma", "Oregon": "Oregon", "RhodeIsland": "Rhode Island",
    "Tennessee": "Tennessee", "Vermont": "Vermont", "Virginia": "Virginia",
    "Washington": "Washington", "WestVirginia": "West Virginia",
    "Wisconsin": "Wisconsin"
}


def extract_string_prop(content, prop_name):
    """Extract a string property value like prop_name:"value" """
    pattern = rf'{prop_name}:"((?:[^"\\]|\\.)*)"'
    match = re.search(pattern, content)
    return match.group(1) if match else None


def extract_all_string_props(content, prop_name):
    """Extract all occurrences of a string property."""
    pattern = rf'{prop_name}:"((?:[^"\\]|\\.)*)"'
    return [m.group(1) for m in re.finditer(pattern, content)]


def extract_children_strings(content):
    """Extract all children:"..." string values."""
    return extract_all_string_props(content, "children")


def extract_template_literals(content):
    """Extract template literal children (backtick strings)."""
    pattern = r'children:`((?:[^`\\]|\\.)*)`'
    return [m.group(1) for m in re.finditer(pattern, content)]


def extract_section_headers(content):
    """Extract section headers from SectionHeader component calls."""
    pattern = r'sectionNumber:"(\d+)",label:"((?:[^"\\]|\\.)*)",title:"((?:[^"\\]|\\.)*)"(?:,subtitle:"((?:[^"\\]|\\.)*)")?'
    sections = []
    for m in re.finditer(pattern, content):
        section = {
            "number": m.group(1),
            "label": m.group(2),
            "title": m.group(3),
        }
        if m.group(4):
            section["subtitle"] = m.group(4)
        sections.append(section)
    return sections


def extract_quick_stats(content):
    """Extract {num:"...",label:"..."} stat arrays."""
    pattern = r'\{num:"((?:[^"\\]|\\.)*)",label:"((?:[^"\\]|\\.)*)"\}'
    return [{"value": m.group(1), "label": m.group(2)} for m in re.finditer(pattern, content)]


def extract_table_data(content):
    """Extract various table data patterns."""
    tables = []

    # Pattern: {cat:"...",services:"..."}
    cat_pattern = r'\{cat:"((?:[^"\\]|\\.)*)",services:"((?:[^"\\]|\\.)*)"\}'
    cat_rows = [{"category": m.group(1), "services": m.group(2)} for m in re.finditer(cat_pattern, content)]
    if cat_rows:
        tables.append({"type": "regulated_services", "rows": cat_rows})

    # Pattern: {detail:"...",value:"..."} with optional highlight
    detail_pattern = r'\{detail:"((?:[^"\\]|\\.)*)",value:"((?:[^"\\]|\\.)*)"(?:,highlight:!0)?\}'
    detail_rows = [{"detail": m.group(1), "value": m.group(2)} for m in re.finditer(detail_pattern, content)]
    if detail_rows:
        tables.append({"type": "review_process", "rows": detail_rows})

    return tables


def extract_blockquotes(content):
    """Extract blockquote text and citations."""
    quotes = []

    # Find all blockquote element positions
    bq_starts = [m.start() for m in re.finditer(r'jsxDEV\("blockquote"', content)]

    for start in bq_starts:
        # Get a reasonable chunk after the blockquote start
        chunk = content[start:start+1500]

        text = ""
        cite = ""

        # Pattern 1: template literal children
        tl_match = re.search(r'children:\[`((?:[^`\\]|\\.)*)`', chunk)
        if tl_match:
            text = tl_match.group(1).strip().strip('"')
            # Look for cite after
            cite_match = re.search(r'jsxDEV\("cite".*?children:"((?:[^"\\]|\\.)*)"', chunk)
            if cite_match:
                cite = cite_match.group(1).strip()

        # Pattern 2: blockquote -> p -> children string
        if not text:
            p_match = re.search(r'jsxDEV\("p".*?children:"((?:[^"\\]|\\.)*)"', chunk)
            if p_match:
                text = p_match.group(1).strip()
                cite_match = re.search(r'jsxDEV\("cite".*?children:"((?:[^"\\]|\\.)*)"', chunk)
                if cite_match:
                    cite = cite_match.group(1).strip()

        # Skip footer data-source text and duplicate entries
        if text and not text.startswith("Data sourced"):
            if not any(q["text"] == text for q in quotes):
                quotes.append({"text": text, "source": cite})

    return quotes


def extract_market_concentration_cards(content):
    """Extract market concentration data cards."""
    cards = []
    # Find dossier-card sections with section-label, stat-number patterns
    card_pattern = r'children:"((?:[^"\\]|\\.)*)"[^}]*\}[^}]*\{[^}]*className:"stat-number",children:"((?:[^"\\]|\\.)*)"[^}]*\}[^}]*\{[^}]*children:"((?:[^"\\]|\\.)*)"[^}]*\}[^}]*\{[^}]*children:"((?:[^"\\]|\\.)*)"'
    for m in re.finditer(card_pattern, content):
        cards.append({
            "region": m.group(1),
            "value": m.group(2),
            "metric": m.group(3),
            "assessment": m.group(4)
        })
    return cards


def extract_bar_chart_data(content):
    """Extract bar chart data (hospital system market share)."""
    entries = []
    # Pattern: "w-1/3 text-cream/80 font-semibold",children:"NAME" ... children:"VALUE"
    bar_pattern = r'text-cream/80 font-semibold",children:"((?:[^"\\]|\\.)*)".*?children:"((?:[^"\\]|\\.)*)"[^}]*\}[^}]*\}[^,]*,[^}]*\}'
    for m in re.finditer(bar_pattern, content):
        entries.append({"name": m.group(1), "value": m.group(2)})
    return entries


def extract_evidence_table(content):
    """Extract evidence of harm table rows."""
    rows = []
    # Find pairs of td elements in evidence section
    # Look for "Evidence of Harm" header then extract subsequent td pairs
    evidence_section = re.search(r'children:"Evidence of Harm".*?(?=jsxDEV\("section"|$)', content, re.DOTALL)
    if evidence_section:
        section_text = evidence_section.group(0)
        td_pattern = r'jsxDEV\("td"[^}]*\}[^}]*className:"[^"]*text-cream/60",children:"((?:[^"\\]|\\.)*)"[^}]*\}[^}]*\{[^}]*jsxDEV\("td"[^}]*\}[^}]*className:"[^"]*text-brand-orange",children:"((?:[^"\\]|\\.)*)"'
        for m in re.finditer(td_pattern, section_text):
            rows.append({"finding": m.group(1), "source": m.group(2)})
    return rows


def extract_editorial_take(content):
    """Extract editorial take paragraphs and closing line."""
    result = {"paragraphs": [], "closing_line": ""}

    # Extract closingLine
    closing_match = re.search(r'closingLine:"((?:[^"\\]|\\.)*)"', content)
    if closing_match:
        result["closing_line"] = closing_match.group(1)

    # Find the editorial section (paragraphs:[...])
    editorial_match = re.search(r'paragraphs:\[(.+?)\],closingLine:', content, re.DOTALL)
    if editorial_match:
        editorial_block = editorial_match.group(1)
        # Extract all string literals from Fragment children in the editorial block
        # Each Fragment = one paragraph. Collect all strings within each Fragment.
        fragments = editorial_block.split('e.Fragment,{children:')
        for frag in fragments:
            if not frag.strip():
                continue
            # Collect all quoted string segments in this fragment
            strings = re.findall(r'"((?:[^"\\]|\\.)*)"', frag)
            # Filter out short CSS/className strings and join substantive text
            text_parts = []
            for s in strings:
                # Skip class names, data-loc, file names, HTML tags
                if (s.startswith('client/') or s.startswith('/home/') or
                    'className' in s or 'data-loc' in s or
                    s.startswith('text-') or s.startswith('font-') or
                    s.startswith('bg-') or s.startswith('inline-') or
                    len(s) < 3 or s in ('strong', 'span', 'p', 'div', 'em')):
                    continue
                text_parts.append(s)
            if text_parts:
                paragraph = " ".join(text_parts)
                # Only include substantial paragraphs
                if len(paragraph) > 50:
                    result["paragraphs"].append(paragraph)

    return result


def extract_case_law(content):
    """Extract case law / denial examples."""
    cases = []
    # Look for "Case:" labels
    case_label_pattern = r'children:"Case: ((?:[^"\\]|\\.)*)"'
    case_labels = [m.group(1) for m in re.finditer(case_label_pattern, content)]

    # Look for case titles (h3 after Case label)
    case_title_pattern = r'children:"Case: (?:[^"\\]|\\.)*".*?font-serif text-2xl font-bold text-cream",children:"((?:[^"\\]|\\.)*)"'
    case_titles = [m.group(1) for m in re.finditer(case_title_pattern, content)]

    # Extract case body paragraphs
    case_section = re.search(r'label:"Case Law".*?(?=jsxDEV\("section"|closingLine|$)', content, re.DOTALL)
    if not case_section:
        case_section = re.search(r'sectionNumber:"03".*?(?=sectionNumber:"04"|closingLine|$)', content, re.DOTALL)

    case_paragraphs = []
    if case_section:
        section_text = case_section.group(0)
        p_pattern = r'jsxDEV\("p",\{[^}]*children:"((?:[^"\\]|\\.)*)"'
        case_paragraphs = [m.group(1) for m in re.finditer(p_pattern, section_text)
                          if len(m.group(1)) > 30]

    # Build case objects
    for i, label in enumerate(case_labels):
        case = {"label": label}
        if i < len(case_titles):
            case["title"] = case_titles[i]
        cases.append(case)

    if case_paragraphs:
        if cases:
            cases[0]["details"] = case_paragraphs
        else:
            cases.append({"details": case_paragraphs})

    return cases


def extract_reform_status(content):
    """Extract reform/legislative status information."""
    reform = {}

    # Look for section 04 (Legislative Environment / Reform Status)
    reform_section = re.search(r'sectionNumber:"04".*?(?=sectionNumber:"05"|sectionNumber:"06"|jsxDEV\(m|jsxDEV\(o|paragraphs:\[|closingLine|$)', content, re.DOTALL)
    if not reform_section:
        return reform

    section_text = reform_section.group(0)

    # Extract subtitle which usually contains reform summary
    subtitle_match = re.search(r'subtitle:"((?:[^"\\]|\\.)*)"', section_text)
    if subtitle_match:
        reform["summary"] = subtitle_match.group(1)

    # Extract h3 titles and their following p content
    h3_pattern = r'jsxDEV\("h3"[^}]*\}[^}]*children:"((?:[^"\\]|\\.)*)"'
    p_pattern = r'jsxDEV\("p"[^}]*\}[^}]*children:"((?:[^"\\]|\\.)*)"'

    h3s = [m.group(1) for m in re.finditer(h3_pattern, section_text)]
    ps = [m.group(1) for m in re.finditer(p_pattern, section_text) if len(m.group(1)) > 20]

    if h3s:
        reform["headings"] = h3s
    if ps:
        reform["details"] = ps

    # Extract timeline/legislative history from table data in this section
    timeline_pattern = r'\{(?:year|session|bill):"((?:[^"\\]|\\.)*)".*?(?:event|status|outcome):"((?:[^"\\]|\\.)*)"'
    timeline_items = [{"item": m.group(1), "detail": m.group(2)} for m in re.finditer(timeline_pattern, section_text)]
    if timeline_items:
        reform["legislative_history"] = timeline_items

    return reform


def extract_sources(content):
    """Extract source citations from the footer and evidence tables."""
    sources = []

    # Footer source text
    source_pattern = r'Data sourced from ((?:[^"\\]|\\.)*)\.'
    match = re.search(source_pattern, content)
    if match:
        sources.append(match.group(0))

    # Evidence table source column values (only in evidence-of-harm section)
    evidence_section = re.search(r'children:"Evidence of Harm".*?(?=jsxDEV\("section"|jsxDEV\(m|jsxDEV\(o|closingLine|$)', content, re.DOTALL)
    if evidence_section:
        section_text = evidence_section.group(0)
        source_vals = re.findall(r'text-brand-orange",children:"((?:[^"\\]|\\.)*)"', section_text)
        for s in source_vals:
            if s not in sources and len(s) > 3:
                sources.append(s)

    return sources


def extract_key_systems(content):
    """Extract key hospital/health systems mentioned."""
    systems = []

    # Bar chart entries (hospital systems)
    bar_entries = extract_bar_chart_data(content)
    for entry in bar_entries:
        systems.append({"name": entry["name"], "revenue": entry["value"]})

    # Look for system names in market concentration section
    # Pattern: provider-sponsored plans or dominant systems mentioned
    viva_pattern = r'text-2xl font-bold font-serif text-cream[^"]*",children:"((?:[^"\\]|\\.)*)"'
    for m in re.finditer(viva_pattern, content):
        name = m.group(1)
        if name not in [s.get("name") for s in systems]:
            systems.append({"name": name, "type": "provider_plan"})

    return systems


def extract_meta(content):
    """Extract SEO/meta information."""
    title = extract_string_prop(content, "title")
    description = extract_string_prop(content, "description")
    path = extract_string_prop(content, "path")
    return {"title": title, "description": description, "path": path}


def extract_hero(content):
    """Extract hero section information."""
    hero = {}

    # Restrictiveness score
    score_section = re.search(r'children:"Restrictiveness Score".*?children:"(\d+)"', content)
    if score_section:
        hero["restrictiveness_score"] = int(score_section.group(1))

    # Score label (Highly Restrictive, etc)
    verdict_match = re.search(r'level:"((?:[^"\\]|\\.)*)",label:"((?:[^"\\]|\\.)*)"', content)
    if verdict_match:
        hero["verdict_level"] = verdict_match.group(1)
        hero["verdict_label"] = verdict_match.group(2)

    # National rank
    rank_section = re.search(r'children:"National Rank".*?children:"(\d+)"', content)
    if rank_section:
        hero["national_rank"] = int(rank_section.group(1))

    rank_of_match = re.search(r'children:"of (\d+)"', content)
    if rank_of_match:
        hero["rank_total"] = int(rank_of_match.group(1))

    # Rank tier label
    tier_labels = ["Bottom Tier", "Top Tier", "Mid Tier", "Upper Tier", "Lower Tier"]
    for label in tier_labels:
        if f'children:"{label}"' in content:
            hero["rank_tier"] = label
            break

    # Governor
    gov_section = re.search(r'children:"Governor".*?children:"((?:[^"\\]|\\.)*)"', content)
    if gov_section:
        hero["governor"] = gov_section.group(1)

    # Party
    for party in ["Republican", "Democrat", "Democratic", "Independent"]:
        if f'children:"{party}"' in content:
            hero["party"] = party
            break

    # Hero subtitle (the long description paragraph)
    # This is the <p> right after the <h1> with the state name
    subtitle_match = re.search(
        r'className:"mt-4 font-sans text-base md:text-lg text-cream/55 leading-relaxed max-w-3xl",children:"((?:[^"\\]|\\.)*)"',
        content
    )
    if subtitle_match:
        hero["subtitle"] = subtitle_match.group(1)

    return hero


def extract_state_data(filepath, state_prefix):
    """Extract all data from a state CON bundle."""
    with open(filepath, "r") as f:
        content = f.read()

    state_name = PREFIX_TO_STATE.get(state_prefix, state_prefix)
    abbreviation = STATE_ABBREVS.get(state_name, "")

    # Build slug from path
    meta = extract_meta(content)
    slug = meta.get("path", "").strip("/").split("/")[0] if meta.get("path") else state_name.lower().replace(" ", "-")

    hero = extract_hero(content)
    sections = extract_section_headers(content)
    quick_stats = extract_quick_stats(content)
    tables = extract_table_data(content)
    blockquotes = extract_blockquotes(content)
    market_cards = extract_market_concentration_cards(content)
    editorial = extract_editorial_take(content)
    case_law = extract_case_law(content)
    reform = extract_reform_status(content)
    evidence = extract_evidence_table(content)
    sources = extract_sources(content)
    key_systems = extract_key_systems(content)

    result = {
        "state": state_name,
        "abbreviation": abbreviation,
        "slug": slug,
        "meta": meta,
        "hero": hero,
        "quick_stats": quick_stats,
        "sections": [],
    }

    # Build sections with their associated content
    for sec in sections:
        section_data = {
            "number": sec["number"],
            "label": sec["label"],
            "title": sec["title"],
        }
        if "subtitle" in sec:
            section_data["subtitle"] = sec["subtitle"]
        result["sections"].append(section_data)

    if tables:
        result["tables"] = tables
    if market_cards:
        result["market_concentration"] = market_cards
    if key_systems:
        result["key_systems"] = key_systems
    if blockquotes:
        result["blockquotes"] = blockquotes
    if case_law:
        result["case_law"] = case_law
    if reform:
        result["reform_status"] = reform
    if evidence:
        result["evidence_of_harm"] = evidence
    if editorial.get("paragraphs") or editorial.get("closing_line"):
        result["editorial_take"] = editorial
    if sources:
        result["sources"] = sources

    return result


def extract_conlaws_overview(filepath):
    """Extract data from the CONLaws overview page."""
    with open(filepath, "r") as f:
        content = f.read()

    meta = extract_meta(content)

    # Extract hero text
    hero_subtitle_match = re.search(
        r'className:"mt-5 font-sans text-base md:text-lg text-cream/55 leading-relaxed max-w-3xl",children:"((?:[^"\\]|\\.)*)"',
        content
    )
    hero_subtitle = hero_subtitle_match.group(1) if hero_subtitle_match else ""

    # Extract hero stats
    hero_stats = []
    stat_pattern = r'number:"((?:[^"\\]|\\.)*)",label:"((?:[^"\\]|\\.)*)"'
    for m in re.finditer(stat_pattern, content):
        hero_stats.append({"number": m.group(1), "label": m.group(2)})

    # Extract state rankings table
    rankings = []
    rank_pattern = r'\{rank:(\d+),state:"((?:[^"\\]|\\.)*)",con:"((?:[^"\\]|\\.)*)",score:(\d+),tier:"((?:[^"\\]|\\.)*)"\}'
    for m in re.finditer(rank_pattern, content):
        rankings.append({
            "rank": int(m.group(1)),
            "state": m.group(2),
            "con_status": m.group(3),
            "score": int(m.group(4)),
            "tier": m.group(5)
        })

    # Extract timeline
    timeline = []
    timeline_pattern = r'\{year:"(\d+)",event:"((?:[^"\\]|\\.)*)"\}'
    for m in re.finditer(timeline_pattern, content):
        timeline.append({"year": m.group(1), "event": m.group(2)})

    # Extract featured state profiles
    profiles = []
    profile_pattern = r'\{state:"((?:[^"\\]|\\.)*)",score:(\d+),status:"((?:[^"\\]|\\.)*)",href:"((?:[^"\\]|\\.)*)",desc:"((?:[^"\\]|\\.)*)"\}'
    for m in re.finditer(profile_pattern, content):
        profiles.append({
            "state": m.group(1),
            "score": int(m.group(2)),
            "status": m.group(3),
            "href": m.group(4),
            "description": m.group(5)
        })

    # Extract section headers
    sections = extract_section_headers(content)

    # Extract how-it-works steps
    steps = []
    step_pattern = r'\{num:"(\d+)",text:"((?:[^"\\]|\\.)*)"\}'
    for m in re.finditer(step_pattern, content):
        steps.append({"step": int(m.group(1)), "text": m.group(2)})

    # Extract blockquotes
    blockquotes = extract_blockquotes(content)

    # Extract narrative paragraphs from the origin story section
    origin_paragraphs = []
    origin_section = re.search(r'sectionNumber:"02".*?(?=sectionNumber:"03"|$)', content, re.DOTALL)
    if origin_section:
        section_text = origin_section.group(0)
        # Find all <p> elements and reconstruct their full text content
        # Split on jsxDEV("p" to find paragraph boundaries
        p_segments = re.split(r'jsxDEV\("p",', section_text)
        for seg in p_segments[1:]:  # skip first (before any <p>)
            # Find the children content - either string or array
            children_str = re.search(r'children:"((?:[^"\\]|\\.)*)"', seg)
            children_arr = re.search(r'children:\[', seg)
            if children_str and (not children_arr or seg.index(children_str.group(0)) < seg.index('children:[')):
                text = children_str.group(1)
                if len(text) > 40:
                    origin_paragraphs.append(text)
            elif children_arr:
                # Mixed content paragraph - extract all string segments
                # Take content up to the next major element boundary
                boundary = re.search(r'\}\s*,\s*void\s+0\s*,\s*!\s*0', seg)
                if boundary:
                    arr_text = seg[:boundary.start()]
                else:
                    arr_text = seg[:500]
                strings = re.findall(r'"((?:[^"\\]|\\.){10,})"', arr_text)
                text_parts = [s for s in strings if not s.startswith('client/') and not s.startswith('/home/')
                              and 'className' not in s and 'data-loc' not in s
                              and not s.startswith('text-') and not s.startswith('font-')]
                if text_parts:
                    combined = " ".join(text_parts)
                    if len(combined) > 40:
                        origin_paragraphs.append(combined)

    # Extract evidence section paragraphs
    evidence_paragraphs = []
    evidence_section = re.search(r'sectionNumber:"03".*?(?=sectionNumber:"04"|$)', content, re.DOTALL)
    if evidence_section:
        section_text = evidence_section.group(0)
        p_matches = re.finditer(r'jsxDEV\("p",\{[^}]*children:"((?:[^"\\]|\\.)*)"', section_text)
        for m in p_matches:
            text = m.group(1)
            if len(text) > 30:
                evidence_paragraphs.append(text)

    # Extract data points from evidence section
    evidence_data = []
    ev_pattern = r'\{metric:"((?:[^"\\]|\\.)*)",value:"((?:[^"\\]|\\.)*)",source:"((?:[^"\\]|\\.)*)"'
    for m in re.finditer(ev_pattern, content):
        evidence_data.append({
            "metric": m.group(1),
            "value": m.group(2),
            "source": m.group(3)
        })

    # Extract sources from footer
    sources = extract_sources(content)

    result = {
        "page": "CON Laws Overview",
        "meta": meta,
        "hero": {
            "headline": "Certificate of Need Laws: The Architecture of a Healthcare Monopoly",
            "subtitle": hero_subtitle,
            "stats": hero_stats
        },
        "sections": [],
        "state_rankings": rankings,
        "timeline": timeline,
        "featured_state_profiles": profiles,
        "how_it_works_steps": steps,
        "blockquotes": blockquotes,
    }

    for sec in sections:
        section_data = {
            "number": sec["number"],
            "label": sec["label"],
            "title": sec["title"],
        }
        if "subtitle" in sec:
            section_data["subtitle"] = sec["subtitle"]
        result["sections"].append(section_data)

    if origin_paragraphs:
        result["origin_story"] = origin_paragraphs
    if evidence_paragraphs:
        result["evidence_paragraphs"] = evidence_paragraphs
    if evidence_data:
        result["evidence_data"] = evidence_data
    if sources:
        result["sources"] = sources

    return result


def get_first_bundle_per_state():
    """Get one bundle file per unique state."""
    all_files = glob.glob(os.path.join(ASSETS_DIR, "*CON-*.js"))
    state_files = {}
    for f in sorted(all_files):
        basename = os.path.basename(f)
        # Skip CONLaws files
        if basename.startswith("CONLaws"):
            continue
        # Extract state prefix (everything before "CON-")
        prefix = basename.split("CON-")[0]
        if prefix not in state_files:
            state_files[prefix] = f
    return state_files


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(OVERVIEW_OUTPUT), exist_ok=True)

    # Process state bundles
    state_files = get_first_bundle_per_state()
    print(f"Found {len(state_files)} unique states to process")

    for prefix, filepath in sorted(state_files.items()):
        print(f"Processing: {prefix} ({os.path.basename(filepath)})")
        try:
            data = extract_state_data(filepath, prefix)
            # Determine output filename
            state_name = PREFIX_TO_STATE.get(prefix, prefix)
            filename = state_name.lower().replace(" ", "-").replace(".", "") + ".json"
            output_path = os.path.join(OUTPUT_DIR, filename)
            with open(output_path, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"  -> Wrote {output_path}")
        except Exception as ex:
            print(f"  ERROR processing {prefix}: {ex}")

    # Process CONLaws overview
    conlaws_file = os.path.join(ASSETS_DIR, "CONLaws-DIuwVHxK.js")
    if os.path.exists(conlaws_file):
        print(f"\nProcessing CONLaws overview ({os.path.basename(conlaws_file)})")
        try:
            data = extract_conlaws_overview(conlaws_file)
            with open(OVERVIEW_OUTPUT, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"  -> Wrote {OVERVIEW_OUTPUT}")
        except Exception as ex:
            print(f"  ERROR processing CONLaws: {ex}")

    print("\nDone!")


if __name__ == "__main__":
    main()
