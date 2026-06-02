"""
generate-diagrams.py — TCI  (TCI Transportation / Transportation Commodities, Inc.)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

Output:  Clients/TCI/diagrams/model.png         (Figure 03.0 — Business model / two units + service lines)
         Clients/TCI/diagrams/personas.png      (Figure 06.0 — Account/Contract Value x Strategic/Recurring matrix)
         Clients/TCI/diagrams/competitive.png    (Figure 07.0 — Scale x Commercial Digital-AI maturity 2x2)
         Clients/TCI/diagrams/architecture.png   (Figure 10.0 — AI growth engine)
         Clients/TCI/diagrams/timeline.png       (Figure 12.0 — 90/180/365 roadmap)
Usage:   python Clients/TCI/generate-diagrams.py
"""

import asyncio
import pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

# -- Brand tokens (mirror assets/brand-tokens.json) --------------------------
BLUE   = "#006DB6"   # Core Blue   - primary nodes, axes
ORANGE = "#F67D4B"   # Core Orange - highlight, CTAs
TEAL   = "#1EAAC8"   # Teal        - secondary nodes
DARK   = "#1A1A2E"   # Dark Charcoal
GREY   = "#59595B"   # Body text, axis labels
LIGHT  = "#E9ECEF"   # Gridlines, neutral fills
OFF    = "#F8F9FA"   # Light backgrounds
WHITE  = "#FFFFFF"
GOLD   = "#C9922A"   # Gold   - maintenance persona
GREEN  = "#28A745"   # Green  - ESG / EV
PURPLE = "#7B2D8B"   # digital brokers


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
# DIAGRAM 1 - BUSINESS MODEL (900 x 520)
# Two business units  ->  TCI (operator)  ->  service lines  ->  segments
# ============================================================================

def build_model_svg():
    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/>
      </marker>
    </defs>"""

    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How TCI Reaches the Market</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A 47-year, family-owned operator running two business units, many service lines, and 26+ yards across 10 states.</text>"""

    # UNITS column (teal-outline white) - 2 tall boxes
    units = (
        box(40, 120, 200, 96, WHITE, TEAL, "TCI LEASING", "lease - maintain - rent - used", DARK, GREY)
        + box(40, 236, 200, 96, WHITE, TEAL, "TCI TRANSPORTATION", "dedicated - brokerage - factoring", DARK, GREY)
    )
    unit_label = f"""<text x="140" y="108" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">TWO BUSINESS UNITS</text>"""

    # HUB - TCI (dark, tall, centered)
    hub = box(300, 150, 200, 180, DARK, DARK, "TCI", "47 years - family-owned", WHITE, "#C9CDD6", 24)
    hub_extra = f"""<text x="400" y="300" font-family="Segoe UI,Arial" font-size="11" fill="#C9CDD6" text-anchor="middle">3,800+ units - 26+ yards</text>"""

    # SERVICE LINES (blue-outline white) - 4 boxes
    channels = (
        box(568, 92,  292, 58, WHITE, BLUE, "FULL-SERVICE LEASING & MAINTENANCE", "NationaLease - contract maintenance", DARK, GREY)
        + box(568, 160, 292, 58, WHITE, BLUE, "USED TRUCKS & COMMERCIAL RENTAL", "heavy / medium duty - semi-trailers", DARK, GREY)
        + box(568, 228, 292, 58, WHITE, BLUE, "DEDICATED LOGISTICS & BROKERAGE", "intermodal - truckload - LTL - reefer", DARK, GREY)
        + box(568, 296, 292, 58, WHITE, BLUE, "EV / WAIRE - FACTORING - YARD", "EV acq - charging - parking - roadside", DARK, GREY)
    )
    chan_label = f"""<text x="714" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">SERVICE LINES</text>"""

    # Arrows units -> hub
    arrows = f"""
  <line x1="240" y1="168" x2="296" y2="210" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="240" y1="284" x2="296" y2="270" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>"""
    # Arrows hub -> service lines
    arrows += f"""
  <line x1="500" y1="200" x2="564" y2="121" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="222" x2="564" y2="189" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="258" x2="564" y2="257" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="280" x2="564" y2="325" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>"""

    # SEGMENTS strip
    seg = f"""
  <rect x="40" y="372" width="820" height="46" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="52" y="390" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}">WHO TCI SERVES</text>
  <text x="52" y="408" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">Private fleets  -  Shippers  -  Owner-operators &amp; small carriers  -  Warehouses / DCs (WAIRE)  -  ESG / EV fleets  -  Industrial</text>"""

    # AI acceleration band
    band = f"""
  <rect x="40" y="430" width="820" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="430" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="60" y="454" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian commercial AI plugs in</text>
  <text x="60" y="476" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">local &amp; AEO search  -  account intelligence  -  RFP / quote-to-lease automation  -  WAIRE / EV ROI tool  -  used-truck merchandising  -  portal &amp; chatbot</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {marker}{title}{unit_label}{units}{hub}{hub_extra}{chan_label}{channels}{arrows}{seg}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - CUSTOMER SEGMENT MATRIX  Value x Strategic (900 x 600)
# X = Account / Contract Value (Low->High) ; Y = Strategic / Recurring Value (Low->High)
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4

    QVX = X(50)
    QHY = Y(50)

    # (key, label, v, m, color, txt_color, r, label_dx, label_dy, anchor)
    P = [
        ("FLEET", "Fleet / Asset Mgr",   84, 82, BLUE,   WHITE, 34, 0,  -46, "middle"),
        ("LOG",   "Logistics Director",  76, 62, ORANGE, DARK,  30, 44,   4, "start"),
        ("WAIRE", "WAIRE Warehouse Op",  50, 84, TEAL,   DARK,  26, 0,  -38, "middle"),
        ("ESG",   "ESG / EV Fleet",      30, 72, GREEN,  WHITE, 22, 0,  -34, "middle"),
        ("MAINT", "Maintenance Mgr",     58, 42, GOLD,   DARK,  24, 38,   4, "start"),
        ("OWNER", "Owner-Operator",      44, 22, DARK,   WHITE, 26, 0,   46, "middle"),
    ]

    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m)
        lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad_labels = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR / RECURRING</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE NICHE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / TRANSACTIONAL</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">OPPORTUNISTIC</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Fleet / Asset Manager (leasing core)</text>
  <circle cx="360" cy="557" r="7" fill="{ORANGE}"/> <text x="372" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Logistics / Supply-Chain Director</text>
  <circle cx="636" cy="557" r="7" fill="{TEAL}"/>   <text x="648" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">WAIRE Warehouse Operator (wedge)</text>
  <circle cx="84"  cy="581" r="7" fill="{GREEN}"/>  <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">ESG / EV Fleet Buyer</text>
  <circle cx="360" cy="581" r="7" fill="{GOLD}"/>   <text x="372" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Maintenance / Equipment Manager</text>
  <circle cx="636" cy="581" r="7" fill="{DARK}"/>   <text x="648" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Owner-Operator / Small Carrier</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Customer Segment Matrix - Account / Contract Value x Strategic / Recurring Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">TCI's buyer types. Bubble size is proportional to relative recurring-revenue contribution.</text>

  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Strategic / Recurring Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Account / Contract Value -&gt;</text>
  {quad_labels}
  {dots}
  {legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE POSITIONING 2x2 (900 x 600)
# X = Scale / Reach ; Y = Commercial Digital & AI Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4

    QVX = X(50)
    QHY = Y(50)

    # (label, scale, maturity, color, r, ldx, ldy, anchor)
    C = [
        ("TCI",            44, 28, ORANGE, 30, 0,  50, "middle"),
        ("Ryder",          94, 78, BLUE,   24, 0, -34, "middle"),
        ("Penske",         87, 66, TEAL,   22, 0,  38, "middle"),
        ("Enterprise FM",  73, 60, GOLD,   18, 0,  36, "middle"),
        ("Digital brokers",58, 80, PURPLE, 18, 0, -28, "middle"),
        ("Idealease",      64, 40, GREY,   16, 26,  4, "start"),
        ("NationaLease peers", 32, 34, GREY, 16, 0, 34, "middle"),
    ]

    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m)
        lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "TCI" else ""
        tin = WHITE if color in (BLUE, DARK, PURPLE) else DARK
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tin}" text-anchor="middle">{esc(label) if label=='TCI' else ''}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label) if label!='TCI' else ''}</text>"""

    # Move arrow: TCI -> up-right target (annotation placed left into open quadrant)
    tx, ty = X(54), Y(60)
    sx, sy = X(44), Y(28)
    move = f"""
  <line x1="{sx}" y1="{sy-34}" x2="{tx}" y2="{ty+22}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx-18}" y="{ty-6}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="end">The move: out-modernize regionally</text>
  <text x="{tx-18}" y="{ty+10}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="end">+ own the CA EV / WAIRE niche</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad_labels = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">NATIONAL SCALE + STRONG DIGITAL</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DIGITAL-NATIVE, NARROWER</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE, DIGITALLY GENERIC</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">REGIONAL / INDEPENDENT</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Scale / Reach x Commercial Digital &amp; AI Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The giants lead on scale and digital - but generically. TCI's white space: nimble, local across 26 yards, and the in-basin EV / WAIRE partner.</text>

  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Commercial Digital &amp; AI Maturity -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Scale / Reach -&gt;</text>
  {quad_labels}
  {dots}
  {move}
</svg>"""


# ============================================================================
# DIAGRAM 4 - AI GROWTH ENGINE (900 x 560) - 3 columns x 4 cards
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">searchable demand: SEO + AEO</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">ACCOUNT INTELLIGENCE</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">named accounts + outbound</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">INTERNAL AUTOMATION</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">quote, serve, retain</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    inbound = (
        arch_card(20, 136, 256, 88, BLUE, "Local + AEO Search",
                  "'full-service truck leasing [city]', 'used semi for sale', 'truck parking [city]'.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Location / Yard Pages",
                    "A page per facility and service across 26+ yards in 10 states.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "GEO - AI Answer Citations",
                    "Be the cited source in ChatGPT, Perplexity & Google AI Overviews.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "WAIRE / EV Authority + GBP",
                    "Own the WAIRE & ZE-truck questions; reviews across every yard.", "My SEO", BLUE)
    )
    core = (
        arch_card(320, 136, 256, 88, ORANGE, "Named-Account Prospecting",
                  "Private fleets, shippers & carriers by territory and fleet size.", "Lead Gen", ORANGE)
        + arch_card(320, 236, 256, 88, ORANGE, "WAIRE Warehouse Targeting",
                    "Find 100k+ sq ft warehouses by truck-trip volume - the EV wedge.", "Lead Gen", ORANGE)
        + arch_card(320, 336, 256, 88, ORANGE, "RFP / Lease Proposal Auto-Draft",
                    "Dedicated-contract & lease bids drafted in hours, not days.", "My AI", TEAL)
        + arch_card(320, 436, 256, 88, ORANGE, "Account Dossiers + Churn",
                    "Pre-visit briefs for reps; flag at-risk lease / maintenance accounts.", "My AI", TEAL)
    )
    outbound = (
        arch_card(620, 136, 256, 88, TEAL, "Quote / Spec-to-Lease Assistant",
                  "Configure a lease or used-truck deal and capture the lead 24/7.", "My Dev", DARK)
        + arch_card(620, 236, 256, 88, TEAL, "WAIRE / EV ROI Tool",
                    "Compliance-cost-vs-ZE-lease calculator that starts the sales talk.", "My Dev", DARK)
        + arch_card(620, 336, 256, 88, TEAL, "Used-Truck Merchandising",
                    "Auto-listings, spec sheets, syndication and buyer-match.", "My Dev", DARK)
        + arch_card(620, 436, 256, 88, TEAL, "Portal + AI Chatbot",
                    "Leasing, maintenance, factoring & roadside self-service.", "My Dev", DARK)
    )
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">TCI AI Growth Engine - Get Found, Win Named Accounts, Run Leaner</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Searchable demand on the left; account-based outbound to named fleets, shippers &amp; WAIRE warehouses in the center; capture &amp; service on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My AI - My Dev. AI gets TCI found and arms the field team - it does not replace the relationship, the yards, or the lease that closes the deal. TCI already runs the operational AI; this adds the commercial layer.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{inbound}{core}{outbound}{note}
</svg>"""


# ============================================================================
# DIAGRAM 5 - 90/180/365 IMPLEMENTATION ROADMAP (900 x 392)
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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">DEMAND &amp; INTELLIGENCE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; AUTOMATE</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Local / AEO Foundation",
                       "Keyword + WAIRE/EV map, technical SEO + schema, first yard pages, stat refresh.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Capture Layer Live",
                         "Quote / spec-to-lease capture + portal AI assistant + lead tracking.", "My Dev", DARK)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Content & GEO Engine",
                         "WAIRE/EV + leasing / used-truck authority hub; first rankings + citations.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Account Intelligence Base",
                         "Named fleet / shipper + WAIRE-warehouse lists + dossiers + RFP pilot.", "My AI", TEAL)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Account-Based Outreach",
                         "Per-account sequences; reps armed. New lease / dedicated deals closing.", "My AI", ORANGE)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Tools + Optimize",
                         "WAIRE/EV ROI tool + used-truck merchandising live; ROI dashboard.", "My Dev", DARK)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Account, lease &amp; WAIRE-deal targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">TCI - Technijian growth program. Get found, win named accounts, run leaner.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">
  {title}{phases}{bar}{cards}{note}
</svg>"""


# -- RENDER -------------------------------------------------------------------
async def render(page, html, output):
    await page.set_content(html, wait_until="networkidle")
    box_ = await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width": max(box_["w"], 900), "height": max(box_["h"], 100)})
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating TCI diagrams (technijian-diagram skill, SVG)...")
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
