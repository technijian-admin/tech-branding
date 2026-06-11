"""
generate-diagrams.py - AFC  Abound Food Care (Santa Ana CA food-recovery nonprofit / SB 1383 implementer)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, solid fills, brand tokens, only the timeline bar uses a gradient.

IMPORTANT esc() rule: box(), arch_card(), and milestone_card() run text through esc(),
so pass a LITERAL '&' to them (esc converts it to &amp;). In RAW <text> written here,
use '&amp;' directly.

Output:  Clients/AFC/diagrams/ecosystem.png     (Figure 02.0 - dual-sided ecosystem map)
         Clients/AFC/diagrams/personas.png      (Figure 05.0 - five-persona matrix)
         Clients/AFC/diagrams/landscape.png     (Figure 06.0 - service depth x data/AI discipline 2x2)
         Clients/AFC/diagrams/architecture.png  (Figure 11.0 - 3-column AI engine + boundary bar)
         Clients/AFC/diagrams/timeline.png      (Figure 13.0 - 90/180/270 roadmap)
Usage:   python Clients/AFC/generate-diagrams.py
"""

import asyncio
import pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

# -- Brand tokens --
BLUE   = "#006DB6"
ORANGE = "#F67D4B"
TEAL   = "#1EAAC8"
DARK   = "#1A1A2E"
GREY   = "#59595B"
LIGHT  = "#E9ECEF"
OFF    = "#F8F9FA"
WHITE  = "#FFFFFF"
GOLD   = "#C9922A"
GREEN  = "#28A745"
RED    = "#CC0000"


def page_shell(svg: str, bg: str = WHITE) -> str:
    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ background:{bg}; display:inline-block; }}
  svg {{ display:block; }}
</style></head><body>{svg}</body></html>"""


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;")


def box(x, y, w, h, fill, stroke, title, subtitle, title_color, sub_color, title_size=14):
    sub = ""
    if subtitle:
        sub = f"""<text x="{x+w//2}" y="{y+h//2+16}" font-family="Segoe UI,Arial" font-size="11"
              fill="{sub_color}" text-anchor="middle">{esc(subtitle)}</text>"""
    ty = y + h//2 + (2 if not subtitle else -4)
    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill}"
        stroke="{stroke}" stroke-width="2"/>
  <text x="{x+w//2}" y="{ty}" font-family="Segoe UI,Arial" font-size="{title_size}"
        font-weight="700" fill="{title_color}" text-anchor="middle">{esc(title)}</text>
  {sub}"""


# ============================================================================
# DIAGRAM 1 - DUAL-SIDED ECOSYSTEM MAP (900 x 640)
# Generators -> Abound (coordination layer) -> FROs -> Communities;
# Jurisdictions + CalRecycle above; funders below; AI band at the bottom.
# ============================================================================

def build_ecosystem_svg():
    title = f"""
  <text x="20" y="30" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Food-Recovery Ecosystem - Abound Is the Coordination Layer</text>
  <text x="20" y="50" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Surplus food flows left to right; contracts and auditable reporting flow up; funding flows in. Trust at every junction is the product.</text>"""

    marker = f"""<defs>
    <marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker>
    <marker id="fb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{BLUE}"/></marker>
    <marker id="fg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GOLD}"/></marker>
  </defs>"""

    # Top band - jurisdictions + CalRecycle
    top = (
        box(180, 66, 250, 50, BLUE, BLUE, "JURISDICTIONS", "CA cities + counties - SB 1383 duty", WHITE, "#C9E3F4", 13)
        + box(480, 66, 250, 50, DARK, DARK, "CALRECYCLE", "monitoring + enforcement since 2024", WHITE, "#C9CDD6", 13)
    )
    # contracts down / reports up between jurisdictions and Abound
    top_arrows = f"""
  <line x1="270" y1="116" x2="380" y2="186" stroke="{BLUE}" stroke-width="2" marker-end="url(#fb)"/>
  <text x="268" y="156" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}" text-anchor="middle">contracts +</text>
  <text x="268" y="170" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}" text-anchor="middle">grants</text>
  <line x1="500" y1="186" x2="580" y2="116" stroke="{GREY}" stroke-width="2" marker-end="url(#fa)"/>
  <text x="600" y="156" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}" text-anchor="middle">auditable reports</text>
  <text x="600" y="170" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}" text-anchor="middle">+ evidence</text>"""

    # Left - generators (two tier boxes)
    gen_hdr = f"""<text x="120" y="206" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{GREY}" text-anchor="middle">FOOD GENERATORS</text>"""
    gens = (
        box(20, 216, 200, 56, OFF, LIGHT, "TIER 1 - since 2022", "supermarkets, grocery, distributors", DARK, GREY, 12)
        + box(20, 284, 200, 56, OFF, LIGHT, "TIER 2 - since 2024", "restaurants, hotels, health, schools", DARK, GREY, 12)
    )

    # Center - Abound coordination layer
    abound = f"""
  <rect x="330" y="196" width="250" height="160" rx="8" fill="{ORANGE}" stroke="{ORANGE}" stroke-width="2"/>
  <text x="455" y="226" font-family="Segoe UI,Arial" font-size="15" font-weight="700" fill="{DARK}" text-anchor="middle">ABOUND FOOD CARE</text>
  <text x="455" y="244" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}" text-anchor="middle">the coordination layer</text>
  <text x="455" y="266" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">written agreements - food-safety</text>
  <text x="455" y="282" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">chain of custody - logistics</text>
  <text x="455" y="298" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">repurposing kitchens - data +</text>
  <text x="455" y="314" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">regulatory reporting - emergency</text>
  <text x="455" y="330" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">food management</text>"""

    # Right - FROs + communities
    fro_hdr = f"""<text x="785" y="206" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{GREY}" text-anchor="middle">RECOVERY NETWORK</text>"""
    fros = (
        box(690, 216, 190, 56, TEAL, TEAL, "FOOD RECOVERY ORGS", "pantries, kitchens, faith orgs", DARK, DARK, 12)
        + box(690, 284, 190, 56, OFF, LIGHT, "COMMUNITIES", "food-insecure households fed", DARK, GREY, 12)
    )

    # food flow arrows
    flow = f"""
  <line x1="220" y1="244" x2="322" y2="262" stroke="{GREY}" stroke-width="2.4" marker-end="url(#fa)"/>
  <line x1="220" y1="312" x2="322" y2="292" stroke="{GREY}" stroke-width="2.4" marker-end="url(#fa)"/>
  <text x="270" y="240" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}" text-anchor="middle">surplus food</text>
  <line x1="580" y1="244" x2="682" y2="244" stroke="{GREY}" stroke-width="2.4" marker-end="url(#fa)"/>
  <text x="631" y="236" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}" text-anchor="middle">matched + routed</text>
  <line x1="785" y1="272" x2="785" y2="280" stroke="{GREY}" stroke-width="2.4" marker-end="url(#fa)"/>"""

    # allies note under FROs
    allies = f"""<text x="785" y="356" font-family="Segoe UI,Arial" font-size="10.5" font-style="italic" fill="{GREY}" text-anchor="middle">allies incl. Second Harvest OC + OC Food Bank</text>
  <text x="785" y="370" font-family="Segoe UI,Arial" font-size="10.5" font-style="italic" fill="{GREY}" text-anchor="middle">(OC Hunger Alliance)</text>"""

    # Bottom - funders feeding in
    funders = (
        box(20, 392, 380, 50, OFF, GOLD, "FUNDERS", "CalRecycle-linked grants - foundations - corporate CSR", DARK, GREY, 13)
    )
    funder_arrow = f"""
  <line x1="400" y1="408" x2="455" y2="360" stroke="{GOLD}" stroke-width="2.4" marker-end="url(#fg)"/>
  <text x="452" y="392" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GOLD}" text-anchor="start">funding follows proof</text>"""

    # Health-system lane (right of funders)
    health = box(500, 392, 380, 50, OFF, LIGHT, "HEALTH SYSTEMS", "food-insecurity screening - medically tailored meals", DARK, GREY, 13)

    # AI band
    BY = 462
    band = f"""
  <rect x="20" y="{BY}" width="860" height="158" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="20" y="{BY}" width="6" height="158" rx="3" fill="{BLUE}"/>
  <text x="44" y="{BY+26}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Where Technijian AI plugs in - on the trust junctions, not the food</text>
  <text x="44" y="{BY+52}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}">Win Jurisdictions</text>
  <text x="190" y="{BY+52}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">account intelligence on cities + counties - RFP and proposal drafting from referenced wins - reference content</text>
  <text x="44" y="{BY+78}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}">Enroll Generators</text>
  <text x="190" y="{BY+78}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">own the SB 1383 answers generators ask AI engines - agreement packets and onboarding drafted in minutes</text>
  <text x="44" y="{BY+104}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}">Fund the Mission</text>
  <text x="190" y="{BY+104}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">grant discovery, screening + drafting - impact reports assembled from program data - knowledge governance</text>
  <text x="44" y="{BY+132}" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">AI drafts, classifies, assembles, and remembers. A named human signs every compliance report, food-safety decision,</text>
  <text x="44" y="{BY+146}" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">and grant submission. Donor PII, screening data, and government-contract records never enter public AI tools.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 640" width="900" height="640" role="img">
  {marker}{title}{top}{top_arrows}{gen_hdr}{gens}{abound}{fro_hdr}{fros}{flow}{allies}{funders}{funder_arrow}{health}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - FIVE-PERSONA MATRIX (900 x 600)
# X = Direct Revenue / Funding Contribution ; Y = Program Leverage / Network Value
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, revenue, leverage, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("JURIS",  "Jurisdiction Sustainability / Solid-Waste Program Mgr", 84, 86, BLUE,   WHITE, 32, 0,  56, "middle"),
        ("FUND",   "Funder / Grant Officer",                                 68, 56, GOLD,   DARK,  26, 36,  6, "start"),
        ("GEN",    "Tier 1 / Tier 2 Generator Compliance Owner",             30, 74, ORANGE, DARK,  26, 0,  -42, "middle"),
        ("FRO",    "Food Recovery Org Program Director",                     16, 48, TEAL,   DARK,  22, 0,   42, "middle"),
        ("HEALTH", "Health-System Community-Benefit Lead",                   52, 26, DARK,   WHITE, 20, 0,   40, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">CONTRACTS + FUNDING (THE BUYERS)</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">PROGRAM PERFORMANCE (THE PROOF)</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">EMERGING PREMIUM</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">CAPACITY PARTNERS</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Jurisdiction Program Manager</text>
  <circle cx="320" cy="557" r="7" fill="{ORANGE}"/> <text x="332" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Generator Compliance Owner</text>
  <circle cx="556" cy="557" r="7" fill="{TEAL}"/>   <text x="568" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">FRO Program Director</text>
  <circle cx="84"  cy="581" r="7" fill="{GOLD}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Funder / Grant Officer</text>
  <circle cx="320" cy="581" r="7" fill="{DARK}"/>   <text x="332" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Health-System Community-Benefit Lead</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Abound Buyer - Revenue / Funding Contribution x Program Influence</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Jurisdictions and funders write the checks; generators and recovery orgs make the programs visibly perform - which wins the next check.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Program Influence / Network Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Direct Revenue / Funding Contribution -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - ECOSYSTEM 2x2 (900 x 600)
# X = Service Depth (contracts, kitchens, logistics, emergency) ; Y = Data / AI Discipline
# ============================================================================

def build_landscape_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, service_depth, data_ai, color, r, ldx, ldy, anchor)
    C = [
        ("Abound Today", 78, 40, ORANGE, 28, 0, 48, "middle"),
        ("Careit (donation-matching software)", 26, 76, BLUE, 20, 28, 2, "start"),
        ("ChowMatch (donation-matching software)", 20, 62, TEAL, 18, 28, 2, "start"),
        ("Solid-waste / SB 1383 consultancies", 52, 30, GREY, 18, -30, 2, "end"),
        ("Peer FROs + food banks (allies)", 40, 20, GREY, 16, 28, 2, "start"),
        ("Commercial recovery platforms", 36, 50, DARK, 16, 30, 2, "start"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "Abound Today" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(78), Y(40); tx, ty = X(78), Y(84)
    move = f"""
  <line x1="{sx}" y1="{sy-34}" x2="{tx}" y2="{ty+18}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx-18}" y="{ty+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="end">Abound's move</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">FULL-SERVICE + PLATFORM-GRADE DATA (OPEN)</text>
  <text x="{X(24)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SOFTWARE - MATCHING, NOT IMPLEMENTATION</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DEEP SERVICE, MANUAL DATA OPS</text>
  <text x="{X(24)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SINGLE-LANE CAPACITY</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Ecosystem Map - Service Depth x Data &amp; AI Discipline</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Software platforms match donations but do not implement; consultancies advise but do not operate. Full-service depth plus platform-grade data is open.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Data &amp; AI Discipline -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Service Depth - contracts, kitchens, logistics, emergency -&gt;</text>
  {quad}{dots}{move}
  <text x="80" y="566" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">Peer recovery organizations and food banks are allies and capacity partners (OC Hunger Alliance), not competitors - shown only to map the category.</text>
</svg>"""


# ============================================================================
# DIAGRAM 4 - AI GROWTH + INTEGRATION ENGINE (900 x 620) - 3 columns x 4 cards + boundary bar
# ============================================================================

def arch_card(x, y, w, h, accent, title, desc, badge, badge_color):
    t = esc(title); d = esc(desc); b = esc(badge)
    badge_txt = WHITE if badge_color in (BLUE, DARK, TEAL) else DARK
    words = d.split(); l1, l2, cnt, on2 = [], [], 0, False
    for w_ in words:
        if not on2 and cnt + len(w_) + 1 <= 40:
            l1.append(w_); cnt += len(w_) + 1
        else:
            on2 = True; l2.append(w_)
    bw = len(b) * 7 + 16; bx = x + w - bw - 8; by = y + h - 22
    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+14}" y="{y+20}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{t}</text>
  <text x="{x+14}" y="{y+36}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(l1)}</text>
  <text x="{x+14}" y="{y+50}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(l2)}</text>
  <rect x="{bx}" y="{by}" width="{bw}" height="16" fill="{badge_color}" rx="8"/>
  <text x="{bx + bw//2}" y="{by+11}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{badge_txt}" text-anchor="middle">{b}</text>"""


def build_arch_svg():
    marker = f"""<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{BLUE}"/></marker></defs>"""
    headers = f"""
  <rect x="16"  y="76" width="264" height="48" fill="{BLUE}"   rx="4"/>
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">VISIBILITY &amp; DEMAND</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">own the SB 1383 answers</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">COMPLIANCE &amp; DOC ENGINE</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">win the document race</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">KNOWLEDGE &amp; GOVERNANCE</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">prove, fund + retain</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    found = (
        arch_card(20, 136, 256, 88, BLUE, "Answer-Engine Authority (AEO)",
                  "Be the cited answer when generators ask AI engines about SB 1383 compliance.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Generator Education Content",
                    "Tier guides, written-agreement FAQs, liability + tax-benefit explainers.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Jurisdiction Account Intelligence",
                    "Track the named universe - grant cycles, RFP calendars, capacity gaps.", "Lead Gen", ORANGE)
        + arch_card(20, 436, 256, 88, BLUE, "Reference Proof Engine",
                    "Ventura, Sacramento, Garden Grove, Arcata stories told where buyers look.", "My SEO", BLUE)
    )
    faster = (
        arch_card(320, 136, 256, 88, ORANGE, "RFP / Proposal Drafting",
                  "Jurisdiction RFP responses assembled from past wins - days to minutes.", "My Dev", DARK)
        + arch_card(320, 236, 256, 88, ORANGE, "Grant Pipeline Engine",
                    "Discover, screen eligibility, and draft applications for human review.", "My Dev", DARK)
        + arch_card(320, 336, 256, 88, ORANGE, "Compliance Reporting Drafts",
                    "Jurisdiction-facing reports with evidence appendices, council-checked.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "Generator Onboarding Packets",
                    "Tier classification, agreement drafts, tax-benefit one-pagers, tracked.", "My Dev", DARK)
    )
    keep = (
        arch_card(620, 136, 256, 88, TEAL, "Impact-Report Factory",
                  "Meals, tonnage, and diversion outcomes assembled from program data.", "My AI", TEAL)
        + arch_card(620, 236, 256, 88, TEAL, "Institutional Knowledge System",
                    "Operator know-how, SOPs, and program history searchable by the team.", "My Dev", DARK)
        + arch_card(620, 336, 256, 88, TEAL, "Records Governance",
                    "Retention discipline and audit-ready files built into daily work.", "My AI", TEAL)
        + arch_card(620, 436, 256, 88, TEAL, "Emergency Activation Playbooks",
                    "48-hour disaster-meal drill comms and partner notifications drafted.", "My AI", TEAL)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">wins</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">proof</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Compliance-Credibility Engine - Visibility, Documents, and Governed Knowledge</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Visibility on the left; the compliance and document engine in the center; impact proof and governed knowledge on the right.</text>"""
    boundary = f"""
  <rect x="16" y="548" width="864" height="48" rx="4" fill="{DARK}"/>
  <text x="448" y="568" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">THE BOUNDARY - donor PII, screening data, and government-contract records never enter public AI tools.</text>
  <text x="448" y="586" font-family="Segoe UI,Arial" font-size="11" fill="#C9CDD6" text-anchor="middle">AI drafts, classifies, assembles, and remembers - a named human signs compliance reports, food-safety decisions, and grant submissions.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" width="900" height="620" role="img">
  {marker}{title}{headers}{bg}{found}{faster}{keep}{arrows}{boundary}
</svg>"""


# ============================================================================
# DIAGRAM 5 - 90/180/270 ROADMAP (900 x 392)
# ============================================================================

def milestone_card(x, y, w, h, accent, num, title, body, tag, tag_color):
    t = esc(title); bd = esc(body); tg = esc(tag)
    tw = len(tg) * 7 + 16; tx = x + w - tw - 8; ty = y + h - 22
    tag_txt = WHITE if tag_color in (BLUE, DARK, TEAL) else DARK
    words = bd.split(); l1, l2, cnt, on2 = [], [], 0, False
    for w_ in words:
        if not on2 and cnt + len(w_) + 1 <= 30:
            l1.append(w_); cnt += len(w_) + 1
        else:
            on2 = True; l2.append(w_)
    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+14}" y="{y+17}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{accent}">MILESTONE {num}</text>
  <text x="{x+14}" y="{y+33}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{t}</text>
  <text x="{x+14}" y="{y+48}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(l1)}</text>
  <text x="{x+14}" y="{y+61}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(l2)}</text>
  <rect x="{tx}" y="{ty}" width="{tw}" height="16" fill="{tag_color}" rx="8"/>
  <text x="{tx + tw//2}" y="{ty+11}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{tag_txt}" text-anchor="middle">{tg}</text>"""


def build_timeline_svg():
    P1_X, P2_X, P3_X = 80, 328, 576
    P1_W, P2_W, P3_W = 248, 248, 244
    phases = f"""
  <rect x="{P1_X}" y="60" width="{P1_W}" height="44" fill="{BLUE}"   rx="4"/>
  <text x="{P1_X+P1_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">DAYS 1-90</text>
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">GET FOUND &amp; TRUSTED</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">WIN THE DOCUMENT RACE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-270</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">PROVE, FUND &amp; EXPAND</text>"""
    TL_Y, TL_H = 110, 18
    bar = f"""
  <defs><linearGradient id="tl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="{BLUE}"/><stop offset="40%" stop-color="{TEAL}"/>
    <stop offset="70%" stop-color="{ORANGE}"/><stop offset="100%" stop-color="#c45e2c"/>
  </linearGradient></defs>
  <rect x="80" y="{TL_Y}" width="740" height="{TL_H}" fill="url(#tl)" rx="4"/>
  <line x1="80"  y1="{TL_Y-5}" x2="80"  y2="{TL_Y+TL_H+5}" stroke="{GREY}" stroke-width="1.5"/>
  <line x1="328" y1="{TL_Y-5}" x2="328" y2="{TL_Y+TL_H+5}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="576" y1="{TL_Y-5}" x2="576" y2="{TL_Y+TL_H+5}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="820" y1="{TL_Y-5}" x2="820" y2="{TL_Y+TL_H+5}" stroke="{GREY}" stroke-width="1.5"/>
  <text x="80"  y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 0</text>
  <text x="328" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 90</text>
  <text x="576" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 180</text>
  <text x="820" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 270</text>"""
    COL_X = [84, 340, 588]
    R1, R2 = 162, 266
    cards = (
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "AEO + SB 1383 Answer Content",
                       "Own the generator compliance questions AI engines answer.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Jurisdiction Intelligence Standup",
                         "Named-universe tracking; grant + RFP calendars; dossiers.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Grant + RFP Drafting Engine",
                         "Proposals + applications drafted from past wins; human signs.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Reporting + Onboarding Automation",
                         "Jurisdiction reports + generator agreement packets drafted.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Impact Factory + Knowledge System",
                         "Outcome reports from program data; SOPs + history captured.", "My AI", TEAL)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Replicate the Regional Model",
                         "Package the playbook for the next counties + alliances.", "My Dev", DARK)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Program scope, grant calendars, and reporting workflows calibrate after a 30-minute discovery call. Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 270 Day Growth &amp; Integration Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Abound Food Care + Technijian. Get found and trusted, win the document race, then prove, fund and expand.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">
  {title}{phases}{bar}{cards}{note}
</svg>"""


# -- RENDER --
async def render(page, html, output):
    await page.set_content(html, wait_until="networkidle")
    box_ = await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width": max(box_["w"], 900), "height": max(box_["h"], 100)})
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating AFC diagrams (technijian-diagram skill, SVG)...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=3)
        print("1/5  ecosystem.png");    await render(page, page_shell(build_ecosystem_svg()),   DIAGRAMS_DIR / "ecosystem.png")
        print("2/5  personas.png");     await render(page, page_shell(build_personas_svg()),    DIAGRAMS_DIR / "personas.png")
        print("3/5  landscape.png");    await render(page, page_shell(build_landscape_svg()),   DIAGRAMS_DIR / "landscape.png")
        print("4/5  architecture.png"); await render(page, page_shell(build_arch_svg()),        DIAGRAMS_DIR / "architecture.png")
        print("5/5  timeline.png");     await render(page, page_shell(build_timeline_svg()),    DIAGRAMS_DIR / "timeline.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
