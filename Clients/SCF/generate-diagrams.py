"""
generate-diagrams.py — SCF  SC Fuels (Southern Counties Oil Co., L.P.)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

Output:  Clients/SCF/diagrams/model.png         (Figure 03.0 — Distribution model / channels)
         Clients/SCF/diagrams/personas.png      (Figure 06.0 — Volume x Margin segment matrix)
         Clients/SCF/diagrams/competitive.png    (Figure 07.0 — Scale x Digital-AI maturity 2x2)
         Clients/SCF/diagrams/architecture.png   (Figure 10.0 — AI growth engine)
         Clients/SCF/diagrams/timeline.png       (Figure 12.0 — 90/180/365 roadmap)
Usage:   python Clients/SCF/generate-diagrams.py
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
GOLD   = "#C9922A"   # Gold   - lubricants/DEF persona
GREEN  = "#28A745"   # Green  - renewable / ESG
PURPLE = "#7B2D8B"   # reserve


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
# DIAGRAM 1 - DISTRIBUTION MODEL / CHANNELS (900 x 520)
# Supply  ->  SC FUELS (operator)  ->  4 delivery channels  ->  segments
# ============================================================================

def build_model_svg():
    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/>
      </marker>
    </defs>"""

    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How SC Fuels Reaches the Market</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">SC Fuels is the operator in the middle: it sources supply, runs four delivery channels, and serves 11,000+ commercial accounts.</text>"""

    # SUPPLY column (teal-outline white) - 3 boxes
    supply = (
        box(40, 92,  192, 70, WHITE, TEAL, "REFINER / RACK", "Gasoline & diesel supply", DARK, GREY)
        + box(40, 180, 192, 70, WHITE, TEAL, "RENEWABLE FUELS", "R99 diesel · biodiesel", DARK, GREY)
        + box(40, 268, 192, 70, WHITE, TEAL, "PILOT NETWORK SCALE", "Berkshire-backed supply", DARK, GREY)
    )
    sup_label = f"""<text x="136" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">SUPPLY</text>"""

    # HUB - SC FUELS (dark, tall, centered)
    hub = box(300, 150, 200, 180, DARK, DARK, "SC FUELS", "source · deliver · bill · support", WHITE, "#C9CDD6", 20)
    hub_extra = f"""<text x="400" y="300" font-family="Segoe UI,Arial" font-size="11" fill="#C9CDD6" text-anchor="middle">the operator in the middle</text>"""

    # CHANNELS (blue-outline white) - 4 boxes
    channels = (
        box(568, 92,  292, 58, WHITE, BLUE, "BULK / BOBTAIL DELIVERY", "tank-truck to yards & job sites", DARK, GREY)
        + box(568, 160, 292, 58, WHITE, BLUE, "MOBILE ON-SITE FUELING", "wet-fueling fleets in place", DARK, GREY)
        + box(568, 228, 292, 58, WHITE, BLUE, "CARDLOCK NETWORK", "CFN · Pacific Pride · 230,000+ sites", DARK, GREY)
        + box(568, 296, 292, 58, WHITE, BLUE, "WHOLESALE · LUBES · DEF", "branded supply, lubricants, DEF", DARK, GREY)
    )
    chan_label = f"""<text x="714" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">DELIVERY CHANNELS</text>"""

    # Arrows supply -> hub (converge)
    arrows = f"""
  <line x1="232" y1="127" x2="296" y2="200" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="232" y1="215" x2="296" y2="240" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="232" y1="303" x2="296" y2="280" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>"""
    # Arrows hub -> channels
    arrows += f"""
  <line x1="500" y1="200" x2="564" y2="121" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="222" x2="564" y2="189" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="258" x2="564" y2="257" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="280" x2="564" y2="325" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>"""

    # SEGMENTS strip
    seg = f"""
  <rect x="40" y="372" width="820" height="46" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="52" y="390" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}">COMMERCIAL CUSTOMERS</text>
  <text x="52" y="408" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">Construction  ·  Agriculture  ·  Trucking &amp; Logistics  ·  Municipal / Government  ·  Manufacturing  ·  Food Mfg  ·  Waste  ·  Retail Stations</text>"""

    # AI acceleration band
    band = f"""
  <rect x="40" y="430" width="820" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="430" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="60" y="454" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="60" y="476" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">account intelligence  ·  AEO / local search  ·  RFP automation  ·  customer portal &amp; chatbot  ·  route &amp; tank optimization  ·  LCFS / IFTA compliance</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {marker}{title}{sup_label}{supply}{hub}{hub_extra}{chan_label}{channels}{arrows}{seg}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - CUSTOMER SEGMENT MATRIX  Volume x Margin (900 x 600)
# X = Account Fuel Volume (Low->High) ; Y = Margin / Strategic Value (Low->High)
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4

    QVX = X(50)
    QHY = Y(50)

    # (key, label, v, m, color, txt_color, r, label_dx, label_dy, anchor)
    P = [
        ("FLEET", "Fleet Ops Director",   86, 28, BLUE,   WHITE, 34, 0,   52, "middle"),
        ("CONST", "Construction Mgr",     82, 58, ORANGE, DARK,  32, 0,  -44, "middle"),
        ("AG",    "Ag Operations",        58, 50, TEAL,   DARK,  28, -38,  4, "end"),
        ("MUNI",  "Municipal Fleet",      70, 82, DARK,   WHITE, 30, 0,  -42, "middle"),
        ("ESG",   "ESG / Renewable",      34, 82, GREEN,  WHITE, 24, 0,  -36, "middle"),
        ("LUBE",  "Lubricants & DEF",     28, 60, GOLD,   DARK,  22, 0,   42, "middle"),
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
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR ACCOUNTS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE NICHE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / RECURRING</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">OPPORTUNISTIC</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Fleet Operations Director</text>
  <circle cx="290" cy="557" r="7" fill="{ORANGE}"/> <text x="302" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Construction Manager</text>
  <circle cx="490" cy="557" r="7" fill="{TEAL}"/>   <text x="502" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Agricultural Operations</text>
  <circle cx="690" cy="557" r="7" fill="{DARK}"/>   <text x="702" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Municipal / Gov Fleet</text>
  <circle cx="84"  cy="581" r="7" fill="{GREEN}"/>  <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Sustainability / ESG Fleet Buyer</text>
  <circle cx="360" cy="581" r="7" fill="{GOLD}"/>   <text x="372" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Lubricants &amp; DEF Industrial Buyer</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Customer Segment Matrix - Account Fuel Volume x Margin / Strategic Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">SC Fuels' commercial buyers. Bubble size is proportional to relative volume contribution.</text>

  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Margin / Strategic Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Account Fuel Volume -&gt;</text>
  {quad_labels}
  {dots}
  {legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE POSITIONING 2x2 (900 x 600)
# X = Scale / Reach ; Y = Digital & AI Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4

    QVX = X(50)
    QHY = Y(50)

    # (label, scale, maturity, color, r, ldx, ldy, anchor, txt_in)
    C = [
        ("SC FUELS",      78, 38, ORANGE, 30, 0,  50, "middle", DARK),
        ("World Kinect",  92, 72, BLUE,   22, 0, -32, "middle", WHITE),
        ("Mansfield",     80, 80, TEAL,   22, 0, -32, "middle", DARK),
        ("Booster",       30, 92, DARK,   22, 0, -32, "middle", WHITE),
        ("NextNRG",       22, 70, GREY,   16, -26, 2, "end",    WHITE),
        ("Pinnacle",      48, 46, TEAL,   16, 30,  2, "start",  DARK),
        ("Ramos",         34, 34, GOLD,   16, -26, 2, "end",    DARK),
        ("Hunt & Sons",   42, 20, GREY,   16, 0,  34, "middle", WHITE),
        ("Star Oilco",    16, 58, GREEN,  14, 0, -28, "middle", WHITE),
    ]

    dots = ""
    for label, s, m, color, r, ldx, ldy, anc, tin in C:
        cx, cy = X(s), Y(m)
        lx, ly = cx + ldx, cy + ldy
        # SC Fuels gets a highlight ring
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "SC FUELS" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    # Move arrow: SC Fuels -> top-right target
    tx, ty = X(82), Y(80)
    sx, sy = X(78), Y(38)
    move = f"""
  <line x1="{sx}" y1="{sy-34}" x2="{tx}" y2="{ty+22}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+16}" y="{ty-6}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">The move: #1 scale + top-tier AI</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad_labels = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE + DIGITAL LEADERS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DIGITAL-NATIVE, SUB-SCALE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE, DIGITALLY UNDER-BUILT</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">REGIONAL / DATED</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Scale / Reach x Digital &amp; AI Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">SC Fuels already leads on scale. The white space is the top-right corner: scale + AI, which no Western rival owns.</text>

  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Digital &amp; AI Maturity -&gt;</text>
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
    marker = f"""<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{BLUE}"/></marker></defs>"""
    headers = f"""
  <rect x="16"  y="76" width="264" height="48" fill="{BLUE}"   rx="4"/>
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">searchable demand: SEO + AEO</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">ACCOUNT INTELLIGENCE</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">named accounts + outbound</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">INTERNAL AUTOMATION</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">serve, retain, comply</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    inbound = (
        arch_card(20, 136, 256, 88, BLUE, "Local + AEO Search",
                  "'bulk diesel delivery [city]', 'cardlock near me', 'DEF delivery' - map pack + organic.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Location / Branch Pages",
                    "A page per branch and per service across ~15 Western markets - capture local intent.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "GEO - AI Answer Citations",
                    "Be the cited source in ChatGPT, Perplexity, Google AI Overviews & Gemini.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "Authority Content + GBP",
                    "Renewable-diesel / LCFS / fuel-market guides + reviews across every branch.", "My SEO", BLUE)
    )
    core = (
        arch_card(320, 136, 256, 88, ORANGE, "Account-Based Prospecting",
                  "Named commercial, construction, ag & municipal fleets by territory & fuel spend.", "Lead Gen", ORANGE)
        + arch_card(320, 236, 256, 88, ORANGE, "Trigger / Signal Monitoring",
                    "New permits, fleet expansions, municipal RFP postings, expiring rival contracts.", "My AI", TEAL)
        + arch_card(320, 336, 256, 88, ORANGE, "RFP / Bid Auto-Response",
                    "Draft & assemble municipal and large-fleet bids in minutes - speed beats diversity wedge.", "My AI", TEAL)
        + arch_card(320, 436, 256, 88, ORANGE, "Account Dossiers + Churn",
                    "Pre-visit briefs for reps; flag declining-gallon accounts before they leave.", "My AI", TEAL)
    )
    outbound = (
        arch_card(620, 136, 256, 88, TEAL, "Customer Portal + Chatbot",
                  "Self-serve orders, invoices, delivery status & cardlock support, 24/7.", "My Dev", DARK)
        + arch_card(620, 236, 256, 88, TEAL, "Route & Demand Optimization",
                    "Forecast demand and optimize bulk / mobile delivery routes - the Booster playbook.", "My Dev", DARK)
        + arch_card(620, 336, 256, 88, TEAL, "Predictive Tank Monitoring",
                    "Sensor + AI keep-full: trigger refills before a tank runs dry. Locks in volume.", "My Dev", DARK)
        + arch_card(620, 436, 256, 88, TEAL, "LCFS / RIN / IFTA Compliance",
                    "Automate carbon-credit, RIN and fuel-tax reporting - recurring, error-prone work.", "My AI", TEAL)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">data</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">serve</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">SC Fuels AI Growth Engine - Get Found, Win Named Accounts, Run Leaner</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Searchable demand on the left; account-based outbound to named fleets in the center; operations & compliance on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO · My AI Lead Gen · My Dev · My AI. AI surfaces and arms the field team and Pilot's supply scale - it does not replace the rep relationship that closes a supply contract.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {marker}{title}{headers}{bg}{inbound}{core}{outbound}{arrows}{note}
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
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; COMPLIANCE</text>"""
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
                       "Location pages, keyword + GEO map, technical SEO + schema, ownership refresh.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Capture Layer Live",
                         "Portal upgrade + AI chatbot + quote / open-account capture + lead tracking.", "My Dev", DARK)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Content & GEO Engine",
                         "Renewable / LCFS / fuel-market authority hub; first rankings + AI citations.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Account Intelligence Base",
                         "Named fleet / municipal target lists + dossiers + RFP pilot + churn model.", "Lead Gen", TEAL)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Account-Based Outreach",
                         "Per-account sequences; reps supported. New commercial accounts closing.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Compliance + Optimize",
                         "LCFS / IFTA automation live; route & tank optimization; ROI dashboard.", "My AI", TEAL)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Account, lead &amp; volume targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">SC Fuels - Technijian growth program. Get found, win named accounts, run leaner.</text>"""
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
    print("Generating SCF diagrams (technijian-diagram skill, SVG)...")
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
