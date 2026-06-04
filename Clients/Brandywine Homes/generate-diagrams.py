"""
generate-diagrams.py — BWH  Brandywine Homes (brandywine-homes.com)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

Output:  Clients/Brandywine Homes/diagrams/model.png         (Figure 02.0 — Infill growth model)
         Clients/Brandywine Homes/diagrams/personas.png      (Figure 06.0 — Stakeholder matrix)
         Clients/Brandywine Homes/diagrams/competitive.png   (Figure 07.0 — Scale x AI maturity 2x2)
         Clients/Brandywine Homes/diagrams/architecture.png  (Figure 10.0 — AI engine)
         Clients/Brandywine Homes/diagrams/timeline.png      (Figure 12.0 — 90/180/365 roadmap)
Usage:   py -3.12 "Clients/Brandywine Homes/generate-diagrams.py"
"""

import asyncio
import pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

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
PURPLE = "#7B2D8B"


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
# DIAGRAM 1 - INFILL GROWTH MODEL (900 x 540)
# Inputs (Land / City-PPP / Capital) -> Brandywine pipeline (Source/Entitle/Build/Sell)
# -> Delivered communities ; AI band underneath
# ============================================================================

def build_model_svg():
    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/>
      </marker>
      <marker id="arB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{DARK}"/>
      </marker>
    </defs>"""

    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Brandywine Grows: an Infill Deal Pipeline</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Growth is gated on the supply side - sourcing and entitling scarce infill land - not on selling the homes.</text>"""

    # three inputs
    inputs = (
        box(40, 80, 240, 60, WHITE, ORANGE, "LAND & SITES", "off-market parcels, assemblage", DARK, GREY, 13)
        + box(330, 80, 240, 60, WHITE, BLUE, "CITY / PPP", "entitlements, redevelopment", DARK, GREY, 13)
        + box(620, 80, 240, 60, WHITE, GREEN, "CAPITAL", "construction lenders + equity", DARK, GREY, 13)
    )

    # pipeline (4 stages)
    PW, PY, PH = 180, 210, 96
    px = [40, 248, 456, 664]
    pipeline = (
        box(px[0], PY, PW, PH, BLUE,   BLUE,   "1  SOURCE",  "find + assemble land", WHITE, "#C9E3F4", 14)
        + box(px[1], PY, PW, PH, TEAL,   TEAL,   "2  ENTITLE", "CEQA + city approvals", WHITE, "#D6F1F8", 14)
        + box(px[2], PY, PW, PH, ORANGE, ORANGE, "3  BUILD",   "lean constrained sites", DARK, "#7a3d22", 14)
        + box(px[3], PY, PW, PH, DARK,   DARK,   "4  SELL",    "absorb homes + partners", WHITE, "#C9CDD6", 14)
    )

    # arrows between pipeline stages
    arrows = ""
    for i in range(3):
        x1 = px[i] + PW
        x2 = px[i+1]
        ymid = PY + PH // 2
        arrows += f"""<line x1="{x1+2}" y1="{ymid}" x2="{x2-4}" y2="{ymid}" stroke="{GREY}" stroke-width="2.5" marker-end="url(#ar)"/>"""

    # input -> pipeline connectors
    conn = f"""
  <line x1="160" y1="140" x2="130" y2="208" stroke="{ORANGE}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="450" y1="140" x2="338" y2="208" stroke="{BLUE}" stroke-width="2" marker-end="url(#ar)"/>
  <text x="486" y="180" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="start">funds every deal</text>
  <line x1="740" y1="140" x2="566" y2="208" stroke="{GREEN}" stroke-width="2" marker-end="url(#ar)"/>"""

    # delivered outcome strip
    strip = f"""
  <rect x="40" y="338" width="820" height="46" rx="6" fill="{DARK}"/>
  <text x="450" y="358" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">DELIVERED:  60+ infill communities  -  ~2,000 homes  -  $1.2B revenue</text>
  <text x="450" y="376" font-family="Segoe UI,Arial" font-size="11" fill="#C9CDD6" text-anchor="middle">Orange County  -  LA County (San Gabriel Valley + Gateway Cities)  -  expanding to the Inland Empire</text>
  <line x1="450" y1="306" x2="450" y2="334" stroke="{DARK}" stroke-width="2.5" marker-end="url(#arB)"/>"""

    band = f"""
  <rect x="40" y="416" width="820" height="92" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="416" width="6" height="92" rx="3" fill="{ORANGE}"/>
  <text x="62" y="440" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Where Technijian AI plugs in - across the whole pipeline</text>
  <text x="62" y="463" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">SOURCE: AI land + feasibility intelligence, parcel + owner targeting, by-right path scoring</text>
  <text x="62" y="481" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">ENTITLE + BUILD: entitlement document automation, approval-timeline modeling, construction-ops AI, knowledge graph</text>
  <text x="62" y="499" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">SELL + PARTNER: 24/7 AI buyer assistant, community/answer-engine search, landowner + city B2B presence</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" width="900" height="540" role="img">
  {marker}{title}{inputs}{conn}{pipeline}{arrows}{strip}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - STAKEHOLDER MATRIX (900 x 600)
# X = Deal / Relationship Value ; Y = Strategic Leverage on the Pipeline
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, value, leverage, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("CITY", "City / PPP Partner",          70, 90, BLUE,   WHITE, 30, 0,   48, "middle"),
        ("LAND", "Land Seller / Broker",         54, 80, ORANGE, DARK,  26, -36,  0, "end"),
        ("CAP",  "Capital / Equity Partner",     86, 76, GREEN,  WHITE, 26, 0,  -36, "middle"),
        ("BTR",  "BTR / Multifamily Investor",   82, 52, PURPLE, WHITE, 22, 0,   42, "middle"),
        ("MOVE", "Move-Up / Detached Buyer",     60, 30, TEAL,   DARK,  22, 0,   40, "middle"),
        ("ATTN", "Attainable Townhome Buyer",    38, 26, GOLD,   DARK,  28, 0,   48, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">GATEKEEPERS - fund + approve the deal</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">PIPELINE MULTIPLIERS</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE BUYERS</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / TRANSACTIONAL</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">City / PPP Partner (entitlement gatekeeper)</text>
  <circle cx="470" cy="557" r="7" fill="{ORANGE}"/> <text x="482" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Land Seller / Broker (supply)</text>
  <circle cx="84"  cy="581" r="7" fill="{GREEN}"/>  <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Capital / Equity Partner + Lender</text>
  <circle cx="470" cy="581" r="7" fill="{PURPLE}"/> <text x="482" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">BTR / Multifamily Investor (emerging)</text>
  <circle cx="700" cy="557" r="7" fill="{TEAL}"/>   <text x="712" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Move-Up / Detached Buyer</text>
  <circle cx="700" cy="581" r="7" fill="{GOLD}"/>   <text x="712" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Attainable Townhome Buyer (volume)</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Stakeholder Matrix - Deal / Relationship Value x Strategic Influence</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Brandywine's growth is gated by the supply-side relationships at the top - cities, landowners, and capital.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Strategic Influence on the Pipeline -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Deal / Relationship Value -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)
# X = Scale / Volume ; Y = AI & Digital Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, maturity, color, r, ldx, ldy, anchor)
    C = [
        ("Brandywine",            27, 27, ORANGE, 28, -42, 6, "end"),
        ("Lennar (LISA)",         95, 88, BLUE,   22, 0, -32, "middle"),
        ("D.R. Horton (Prophetic)", 90, 70, TEAL, 20, -8, -30, "end"),
        ("Toll / Tri Pointe",     70, 58, GREEN,  18, 0,  34, "middle"),
        ("Trumark (buyer portal)", 50, 46, DARK,  18, 36,  4, "start"),
        ("Infill cohort: Olson / City Ventures / Melia", 44, 19, GREY, 18, 0, 40, "middle"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "Brandywine" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(27), Y(27); tx, ty = X(46), Y(58)
    move = f"""
  <line x1="{sx+28}" y1="{sy-18}" x2="{tx-14}" y2="{ty+14}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="{sx+30}" y="{sy-28}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">Brandywine's move: first infill builder with AI in land, entitlements + absorption</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE + AI LEADERS (national)</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">AI-FORWARD, SMALLER</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE, LOW AI</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOCAL INFILL - NO AI (the cohort)</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Scale / Volume x AI &amp; Digital Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The AI frontier belongs to national giants aimed at large tracts. In SoCal infill, AI adoption is effectively zero.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">AI &amp; Digital Maturity -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Scale / Volume -&gt;</text>
  {quad}{dots}{move}
</svg>"""


# ============================================================================
# DIAGRAM 4 - AI ENGINE (900 x 560) - 3 columns x 4 cards
# ============================================================================

def arch_card(x, y, w, h, accent, title, desc, badge, badge_color):
    t = esc(title); d = esc(desc); b = esc(badge)
    badge_txt = WHITE if badge_color in (BLUE, DARK, TEAL, PURPLE) else DARK
    words = d.split(); l1, l2, cnt, on2 = [], [], 0, False
    for w_ in words:
        if not on2 and cnt + len(w_) + 1 <= 38:
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
    headers = f"""
  <rect x="16"  y="76" width="264" height="48" fill="{BLUE}"   rx="4"/>
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">SOURCE</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">find + qualify infill land</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">ENTITLE &amp; BUILD</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">approve + deliver faster</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">SELL &amp; PARTNER</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">absorb homes + deepen ties</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    source = (
        arch_card(20, 136, 256, 88, BLUE, "Land + Feasibility Intelligence",
                  "Scan SoCal for redevelopable infill parcels; estimate yield in minutes.", "My Dev", DARK)
        + arch_card(20, 236, 256, 88, BLUE, "Parcel + Owner Targeting",
                    "Monitor off-market sites and landowners; assemble multi-owner lots.", "Lead Gen", ORANGE)
        + arch_card(20, 336, 256, 88, BLUE, "By-Right Path Scoring",
                    "Auto-classify SB 9 / SB 35 / AB 2011 / density-bonus eligibility.", "My AI", TEAL)
        + arch_card(20, 436, 256, 88, BLUE, "Feasibility Underwriting Review",
                    "A 3-model AI council pressure-tests each deal before you commit.", "My AI", TEAL)
    )
    build = (
        arch_card(320, 136, 256, 88, ORANGE, "Entitlement Document Intelligence",
                  "Draft + track CEQA filings, staff reports, city correspondence.", "My AI", TEAL)
        + arch_card(320, 236, 256, 88, ORANGE, "Approval-Timeline Modeling",
                    "City-by-city timelines and ready community-meeting materials.", "My Dev", DARK)
        + arch_card(320, 336, 256, 88, ORANGE, "Construction-Ops AI",
                    "Schedule, budget-variance and change-order analysis across sites.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "Institutional-Knowledge Graph",
                    "32 years of playbooks, city history and subs, queryable by the team.", "My AI", TEAL)
    )
    serve = (
        arch_card(620, 136, 256, 88, TEAL, "24/7 AI Buyer Assistant",
                  "Answer plans, price, availability; book tours; catch overnight leads.", "My Dev", DARK)
        + arch_card(620, 236, 256, 88, TEAL, "Community + Answer-Engine Search",
                    "Pages AI assistants cite, plus fixing the crawler block.", "My SEO", BLUE)
        + arch_card(620, 336, 256, 88, TEAL, "Landowner + City B2B Presence",
                    "A findable PPP and redevelopment story for sellers and cities.", "My SEO", BLUE)
        + arch_card(620, 436, 256, 88, TEAL, "Capital-Partner + BTR Targeting",
                    "Surface equity and BTR partners with investor-ready deal packets.", "Lead Gen", ORANGE)
    )
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Brandywine AI Engine - Source, Entitle &amp; Build, Sell &amp; Partner</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Source land on the left, entitle and build faster in the center, absorb homes and deepen partnerships on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My AI - My AI Lead Gen - My SEO - My Dev. AI augments the land, entitlement, construction and sales teams; it does not replace the city, landowner and capital relationships 32 years built.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{source}{build}{serve}{note}
</svg>"""


# ============================================================================
# DIAGRAM 5 - 90/180/365 ROADMAP (900 x 392)
# ============================================================================

def milestone_card(x, y, w, h, accent, num, title, body, tag, tag_color):
    t = esc(title); bd = esc(body); tg = esc(tag)
    tw = len(tg) * 7 + 16; tx = x + w - tw - 8; ty = y + h - 22
    tag_txt = WHITE if tag_color in (BLUE, DARK, TEAL, PURPLE) else DARK
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">FOUNDATION</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">PIPELINE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE</text>"""
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
  <text x="820" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 365</text>"""
    COL_X = [84, 340, 588]
    R1, R2 = 162, 266
    cards = (
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Workshop + Land Intelligence",
                       "Align leadership; turn on parcel + owner targeting.", "My AI", TEAL)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Community / AEO Search",
                         "Fix the crawler block; AI-readable community pages.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Land-Feasibility Tool",
                         "Yield + by-right path scoring on SoCal parcels.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Entitlement Doc Intelligence",
                         "Draft + track CEQA filings; approval-timeline model.", "My AI", TEAL)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "24/7 Buyer Assistant + KG",
                         "Capture leads; institutional-knowledge graph live.", "My Dev", DARK)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Construction-Ops + ROI",
                         "Schedule + variance AI; ROI dashboard vs baselines.", "My Dev", DARK)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Entry program (Workshop + Land Intelligence + Search) lands first; the custom builds follow once the entry proves the lift. Targets calibrate after a 30-min discovery call.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Brandywine - Technijian program. Foundation first, then the pipeline tools, then scale across communities.</text>"""
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
    print("Generating BWH diagrams (technijian-diagram skill, SVG)...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        print("1/5  model.png");        await render(page, page_shell(build_model_svg()),       DIAGRAMS_DIR / "model.png")
        print("2/5  personas.png");     await render(page, page_shell(build_personas_svg()),    DIAGRAMS_DIR / "personas.png")
        print("3/5  competitive.png");  await render(page, page_shell(build_competitive_svg()), DIAGRAMS_DIR / "competitive.png")
        print("4/5  architecture.png"); await render(page, page_shell(build_arch_svg()),        DIAGRAMS_DIR / "architecture.png")
        print("5/5  timeline.png");     await render(page, page_shell(build_timeline_svg()),    DIAGRAMS_DIR / "timeline.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
