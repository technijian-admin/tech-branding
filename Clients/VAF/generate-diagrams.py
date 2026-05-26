"""
generate-diagrams.py — VAF  VIA Auto Finance, LLC (a CUSO)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

Output:  Clients/VAF/diagrams/model.png         (Figure 02.0 — The CUSO model, 3 parties)
         Clients/VAF/diagrams/personas.png      (Figure 06.0 — Dealer/CU segment matrix)
         Clients/VAF/diagrams/competitive.png    (Figure 07.0 — Funding-cost x AI-speed 2x2)
         Clients/VAF/diagrams/architecture.png   (Figure 10.0 — AI growth engine)
         Clients/VAF/diagrams/timeline.png       (Figure 12.0 — 90/180/365 roadmap)
Usage:   /c/Python314/python.exe Clients/VAF/generate-diagrams.py
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
# DIAGRAM 1 - THE CUSO MODEL (900 x 520) - three parties, one loan
# ============================================================================

def build_model_svg():
    DEALER = (104, 86, 240, 92)
    BORROW = (556, 86, 240, 92)
    VIA    = (330, 250, 240, 116)
    CU     = (652, 262, 196, 92)

    boxes = (
        box(*DEALER, WHITE, TEAL,   "DEALER", "F&I desk submits the deal", DARK, GREY)
        + box(*BORROW, WHITE, ORANGE, "BORROWER", "buys the vehicle", DARK, GREY)
        + box(*VIA,   DARK,  DARK,   "VIA AUTO FINANCE", "originates - underwrites - prices", WHITE, "#C9CDD6", 17)
        + box(*CU,    WHITE, BLUE,   "PARTNER CREDIT UNION", "American Heritage - funds & services", DARK, GREY, 13)
    )

    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{DARK}"/>
      </marker>
      <marker id="arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{GREEN}"/>
      </marker>
    </defs>"""

    # top: Dealer -> Borrower (delivers vehicle)
    a0 = f"""
  <line x1="344" y1="132" x2="552" y2="132" stroke="{TEAL}" stroke-width="2.5" marker-end="url(#ar)"/>
  <rect x="386" y="110" width="124" height="22" rx="11" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="448" y="125" font-family="Segoe UI,Arial" font-size="11" font-weight="600" fill="{DARK}" text-anchor="middle">delivers vehicle</text>"""

    # Dealer -> VIA (submits deal)
    a1 = f"""
  <line x1="252" y1="178" x2="372" y2="250" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="246" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}" text-anchor="end">(1) submits deal</text>"""

    # VIA -> CU (loan awarded)
    a2 = f"""
  <line x1="570" y1="300" x2="648" y2="300" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="609" y="291" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{DARK}" text-anchor="middle">(2) awarded</text>"""

    # CU -> Borrower (funds + membership)
    a3 = f"""
  <line x1="712" y1="262" x2="676" y2="182" stroke="{GREEN}" stroke-width="2.5" marker-end="url(#arg)"/>
  <text x="722" y="214" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREEN}" text-anchor="start">(3) funds + membership</text>"""

    title = f"""
  <text x="48" y="38" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The CUSO Model - Three Parties, One Loan</text>
  <text x="48" y="58" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">VIA originates and underwrites; American Heritage Credit Union funds and services; the borrower becomes a member.</text>"""

    econ = f"""
  <text x="450" y="392" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle" font-style="italic">VIA earns CUSO economics on each loan; the credit union gains higher-ROA auto assets and new members.</text>"""

    band = f"""
  <rect x="48" y="414" width="804" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="48" y="414" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="68" y="438" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="68" y="460" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">dealer acquisition  -  stip &amp; income verification  -  fraud &amp; synthetic-ID screening  -  explainable decisioning  -  GLBA compliance</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {marker}{title}{boxes}{a0}{a1}{a2}{a3}{econ}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - DEALER / CU SEGMENT MATRIX (900 x 600)
# X = Origination Volume Potential ; Y = Strategic Value to the CUSO
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, v, m, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("CU",    "Funding CU (AHCU)",    88, 92, DARK,   WHITE, 30, 0,  -40, "middle"),
        ("GROUP", "Multi-Rooftop Group",  82, 64, BLUE,   WHITE, 30, 0,   50, "middle"),
        ("FRAN",  "Franchised Dealer",    60, 58, ORANGE, DARK,  26, -36,  4, "end"),
        ("F&I",   "High-Velocity F&I",    74, 42, GOLD,   DARK,  24, 0,   42, "middle"),
        ("IND",   "Independent Dealer",   42, 40, TEAL,   DARK,  24, 0,   42, "middle"),
        ("CUP",   "Prospective CU Partner", 34, 86, GREEN, WHITE, 24, 0,  -36, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR ACCOUNTS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">STRATEGIC / SCALE LEVERS</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / RECURRING</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">OPPORTUNISTIC</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{DARK}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Funding Credit Union (American Heritage)</text>
  <circle cx="400" cy="557" r="7" fill="{BLUE}"/>   <text x="412" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Multi-Rooftop Dealer Group</text>
  <circle cx="660" cy="557" r="7" fill="{ORANGE}"/> <text x="672" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Franchised Dealer</text>
  <circle cx="84"  cy="581" r="7" fill="{GOLD}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">High-Velocity F&amp;I Desk</text>
  <circle cx="320" cy="581" r="7" fill="{TEAL}"/>   <text x="332" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Independent Used-Car Dealer</text>
  <circle cx="600" cy="581" r="7" fill="{GREEN}"/>  <text x="612" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Prospective CU Partner</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Account Matrix - Origination Volume Potential x Strategic Value to the CUSO</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">VIA's accounts span the dealer side (sources the paper) and the funding side (the credit union that backs it).</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Strategic Value to the CUSO -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Origination Volume Potential -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)
# X = Funding-Cost / Cost-of-Capital Advantage ; Y = Origination Speed & AI
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, fund, speed, color, r, ldx, ldy, anchor)
    C = [
        ("VIA",          80, 28, ORANGE, 30, 0,  50, "middle"),
        ("Open Lending", 56, 86, BLUE,   22, 0, -32, "middle"),
        ("Upstart",      42, 92, DARK,   20, 0, -30, "middle"),
        ("Westlake",     48, 72, TEAL,   20, -28, 2, "end"),
        ("GLS",          58, 64, TEAL,   16, 28,  2, "start"),
        ("CPS",          40, 54, GOLD,   16, -26, 2, "end"),
        ("Lobel",        50, 46, GREEN,  16, 28,  2, "start"),
        ("Veros",        34, 30, GREY,   16, 0,  34, "middle"),
        ("Exeter",       48, 22, GREY,   16, 0,  34, "middle"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "VIA" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    tx, ty = X(82), Y(80); sx, sy = X(80), Y(28)
    move = f"""
  <line x1="{sx}" y1="{sy-34}" x2="{tx}" y2="{ty+22}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+18}" y="{ty+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">VIA's move</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">FUNDING MOAT + AI SPEED</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">AI-NATIVE, HIGHER FUNDING COST</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">FUNDING MOAT, MANUAL OPS</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LAGGARDS</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Funding-Cost Advantage x Origination Speed &amp; AI</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Dealers now choose on speed, not rate. VIA's credit-union deposit funding is a cost-of-capital moat no rival has - the move is straight up.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Origination Speed &amp; AI Automation -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Funding-Cost Advantage -&gt;</text>
  {quad}{dots}{move}
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">WIN DEALERS</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">account-based dealer acquisition</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">FUND FASTER &amp; SAFER</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">speed + fraud control</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">PROTECT &amp; SCALE</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">compliance + CUSO growth</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    win = (
        arch_card(20, 136, 256, 88, BLUE, "Dealer Account Intelligence",
                  "Score and prioritize which dealers to recruit by volume, credit mix, and whitespace.", "Lead Gen", ORANGE)
        + arch_card(20, 236, 256, 88, BLUE, "Competitor-Retrenchment Triggers",
                    "Alert when a dealer loses a lender (Prestige, Truist, Tricolor gaps) - call that day.", "My AI", TEAL)
        + arch_card(20, 336, 256, 88, BLUE, "Dealer-Facing Authority Content",
                    "B2B content: why a CU-backed lender funds faster and delivers better ROA.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "Field-Rep Enablement + CRM",
                    "Pre-call dossiers and pipeline for the field team across the 20-state expansion.", "My AI", TEAL)
    )
    fund = (
        arch_card(320, 136, 256, 88, ORANGE, "Stip + Income Verification",
                  "Auto-clear documents in seconds, not days - the funding speed that wins dealers.", "My Dev", DARK)
        + arch_card(320, 236, 256, 88, ORANGE, "Fraud + Synthetic-ID Screening",
                    "Catch income misrep and synthetic identities before funding - protect the CU's ROA.", "My AI", TEAL)
        + arch_card(320, 336, 256, 88, ORANGE, "Dealer Portal + Instant Decision",
                    "Real-time structures and funding status - the UX dealers now expect.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "RouteOne / Dealertrack Integration",
                    "Meet dealers where they already submit deals - table stakes for indirect.", "My Dev", DARK)
    )
    protect = (
        arch_card(620, 136, 256, 88, TEAL, "Explainable Decisioning",
                  "Accurate adverse-action reason codes on every denial - never a black box.", "My AI", TEAL)
        + arch_card(620, 236, 256, 88, TEAL, "Fair-Lending Monitoring",
                    "Ongoing disparate-impact testing and documentation - defensible by design.", "My AI", TEAL)
        + arch_card(620, 336, 256, 88, TEAL, "GLBA Safeguards / Security",
                    "The required information-security program and monitoring - the entry point.", "My Security", BLUE)
        + arch_card(620, 436, 256, 88, TEAL, "CU-Partner Expansion + Early-Warning",
                    "Recruit new funding credit unions; protect ROA with portfolio analytics.", "My AI", TEAL)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">deals</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">trust</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">VIA AI Growth Engine - Win Dealers, Fund Faster, Protect the Franchise</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Dealer acquisition on the left; funding speed and fraud control in the center; compliance and CUSO scale on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My AI Lead Gen - My AI - My SEO - My Dev - My Security. AI underwriting stays explainable and adverse-action-ready - it supports the dealer relationship and the credit union's risk team, it does not replace them or become a black box.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {marker}{title}{headers}{bg}{win}{fund}{protect}{arrows}{note}
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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">ACCELERATE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; PROTECT</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Foundation + Compliance",
                       "GLBA Safeguards review, fair-lending readiness check, site + dealer-enroll refresh.", "My Security", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Dealer Intelligence Live",
                         "Named-dealer target lists by territory + competitor-retrenchment triggers + CRM.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Verification Automation",
                         "Stip / income verification + fraud screening pilot; baseline -> target funding speed.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Portal + Integration",
                         "Instant-decision UX + RouteOne / Dealertrack; first dealers on the new flow.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Decisioning + Outreach",
                         "Explainable decisioning support live; dealer outreach scaling into new states.", "My AI", TEAL)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Scale the CUSO + Optimize",
                         "Recruit additional CU partner(s); portfolio early-warning; ROI dashboard.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Dealer, origination &amp; funding-speed targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">VIA Auto Finance - Technijian growth program. Win dealers, fund faster, protect and scale the CUSO.</text>"""
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
    print("Generating VAF diagrams (technijian-diagram skill, SVG)...")
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
