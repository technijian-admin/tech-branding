"""
generate-diagrams.py - ALG  Algro International (Bharat Industrial Enterprises US arm)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

IMPORTANT esc() rule: box(), arch_card(), and milestone_card() run text through esc(),
so pass a LITERAL '&' to them (esc converts it to &amp;). In RAW <text> written here,
use '&amp;' directly.

Output:  Clients/ALG/diagrams/model.png         (Figure 02.0 - The B2B named-account growth engine)
         Clients/ALG/diagrams/personas.png      (Figure 05.0 - Account Volume x Account LTV)
         Clients/ALG/diagrams/competitive.png   (Figure 06.0 - Operator Scale x AI & Buyer-Experience Maturity)
         Clients/ALG/diagrams/architecture.png  (Figure 10.0 - AI growth engine)
         Clients/ALG/diagrams/timeline.png      (Figure 12.0 - 90/180/270 roadmap)
Usage:   /c/Python314/python.exe Clients/ALG/generate-diagrams.py
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
# DIAGRAM 1 - THE B2B NAMED-ACCOUNT GROWTH ENGINE (900 x 540)
# ============================================================================

def build_model_svg():
    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How a B2B Rice Importer Wins - Discover, Document, Award, Renew</text>
  <text x="40" y="55" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Named buyers; lead times in months; the lease is the contract; the cheapest win is the renewal.</text>"""

    # Demand sources (4 boxes) - ABM-shaped, not consumer
    DX = [20, 240, 460, 680]
    DW = 198
    demand = (
        box(DX[0], 74, DW, 46, OFF, LIGHT, "INBOUND RFI/RFP",  "buyer questionnaires",  DARK, GREY, 13)
        + box(DX[1], 74, DW, 46, OFF, LIGHT, "AI-SEARCH / AEO",  "Google AI, Perplexity", DARK, GREY, 13)
        + box(DX[2], 74, DW, 46, OFF, LIGHT, "TRADE SHOW / BROKER", "Gulfood, IFT, PMA",  DARK, GREY, 13)
        + box(DX[3], 74, DW, 46, OFF, LIGHT, "ABM OUTBOUND",     "named-account outreach", DARK, GREY, 13)
    )
    label = f"""<text x="450" y="140" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}" text-anchor="middle">THE BUYER FUNNEL</text>"""
    # connectors demand -> funnel
    conns = ""
    for dx in DX:
        cx = dx + DW // 2
        conns += f"""<line x1="{cx}" y1="120" x2="450" y2="150" stroke="#ADB5BD" stroke-width="1.2"/>"""

    # Funnel stages - B2B procurement
    SX = [10, 158, 306, 454, 602, 750]
    SW, SH, SY = 130, 64, 158
    stages = (
        box(SX[0], SY, SW, SH, BLUE,   BLUE,   "DISCOVER",     "be cited", WHITE, "#C9E3F4", 13)
        + box(SX[1], SY, SW, SH, TEAL,   TEAL,   "QUALIFY",      "fit check",          DARK,  DARK,      13)
        + box(SX[2], SY, SW, SH, BLUE,   BLUE,   "DOCUMENT",     "FSVP, COA, certs",   WHITE, "#C9E3F4", 13)
        + box(SX[3], SY, SW, SH, ORANGE, ORANGE, "SAMPLE/AUDIT", "site, lot, taste",   DARK,  DARK,      13)
        + box(SX[4], SY, SW, SH, BLUE,   BLUE,   "AWARD",        "PO, lease, contract",WHITE, "#C9E3F4", 13)
        + box(SX[5], SY, SW, SH, DARK,   DARK,   "RENEW",        "keep them",          WHITE, "#C9CDD6", 13)
    )
    marker = f"""<defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker>
    <marker id="ral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 Z" fill="{ORANGE}"/></marker></defs>"""
    arrows = ""
    for i in range(5):
        x1 = SX[i] + SW + 2
        x2 = SX[i + 1] - 2
        arrows += f"""<line x1="{x1}" y1="{SY+SH//2}" x2="{x2}" y2="{SY+SH//2}" stroke="{GREY}" stroke-width="2" marker-end="url(#fa)"/>"""

    # retention loop (dashed arrow RENEW -> DISCOVER, below funnel)
    loop_y = SY + SH + 30
    retention = f"""
  <line x1="{SX[5]+SW//2}" y1="{SY+SH+4}" x2="{SX[5]+SW//2}" y2="{loop_y}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4"/>
  <line x1="{SX[5]+SW//2}" y1="{loop_y}" x2="{SX[0]+SW//2}" y2="{loop_y}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4"/>
  <line x1="{SX[0]+SW//2}" y1="{loop_y}" x2="{SX[0]+SW//2}" y2="{SY+SH+4}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ral)"/>
  <rect x="320" y="{loop_y-11}" width="280" height="22" rx="11" fill="{WHITE}"/>
  <text x="460" y="{loop_y+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="middle">Renewal loop - re-award without re-winning the RFP</text>"""

    # AI band
    BY = 318
    band = f"""
  <rect x="20" y="{BY}" width="858" height="206" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="20" y="{BY}" width="6" height="206" rx="3" fill="{BLUE}"/>
  <text x="44" y="{BY+28}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Where Technijian AI plugs in - inside the named-account motion, not a shotgun funnel</text>
  <text x="44" y="{BY+58}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}">Get Cited &amp; Discovered</text>
  <text x="44" y="{BY+76}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">AEO / AI-search authority - thought leadership on tariffs, FSMA &amp; multi-origin compliance - named-account ABM intelligence</text>
  <text x="44" y="{BY+104}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}">Win the Buyer Documentation Race</text>
  <text x="44" y="{BY+122}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">AI RFP / RFI auto-drafting - FSVP/HARPC/COA/NOP/Kosher/Halal library - lot-level chain of custody - tariff signal monitor</text>
  <text x="44" y="{BY+150}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}">Hold the Account &amp; Expand</text>
  <text x="44" y="{BY+168}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">sales-pipeline knowledge memory - buyer-side conversational assistant - per-SKU spec automation - portfolio reuse (Simply So + BIEL export)</text>
  <text x="44" y="{BY+196}" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">AI never sets pricing in an antitrust-sensitive way and never replaces a GFSI / food-safety determination - a person owns both.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" width="900" height="540" role="img">
  {marker}{title}{demand}{conns}{label}{stages}{arrows}{retention}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - PERSONA MATRIX (900 x 600)
# X = Account Volume / Velocity ; Y = Account Lifetime Value
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, vol, value, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("RETAIL", "Retail Private-Label Brand Mgr", 50, 88, BLUE,   WHITE, 30, 40,  6, "start"),
        ("INDUST", "Industrial / CPG Procurement",    78, 72, ORANGE, DARK,  32, 0,   -44, "middle"),
        ("FOOD",   "Foodservice / Distributor Buyer", 86, 50, TEAL,   DARK,  28, 0,   42, "middle"),
        ("SPEC",   "Specialty / Ethnic Brand Owner",  44, 56, GOLD,   DARK,  22, -34, 2, "end"),
        ("INST",   "Institutional / Channel",          26, 72, DARK,   WHITE, 20, 0,   38, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE, HIGH-VELOCITY</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">WIN-RATE PLAYS (HIGH LTV)</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / TOP-OF-FUNNEL</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">EMERGING / NICHE</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Retail Private-Label Brand Mgr</text>
  <circle cx="320" cy="557" r="7" fill="{ORANGE}"/> <text x="332" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Industrial / CPG Procurement</text>
  <circle cx="600" cy="557" r="7" fill="{TEAL}"/>   <text x="612" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Foodservice / Distributor Buyer</text>
  <circle cx="84"  cy="581" r="7" fill="{GOLD}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Specialty / Ethnic Brand Owner</text>
  <circle cx="320" cy="581" r="7" fill="{DARK}"/>   <text x="332" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Institutional / Channel (emerging)</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Algro Buyer - Account Volume x Account Lifetime Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A retail private-label award is the highest LTV; industrial CPG is the highest velocity; foodservice is the cash flow.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Account Lifetime Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Account Volume / Velocity -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)
# X = Operator Scale / Resources ; Y = AI & Buyer-Experience Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, ai, color, r, ldx, ldy, anchor)
    C = [
        ("Algro Intl.",     22, 16, ORANGE, 26, 38,  6, "start"),
        ("Olam Agri",       92, 84, TEAL,   20, 0, -30, "middle"),
        ("LT Foods (Daawat / Royal)", 84, 70, BLUE,   22, -30, 2, "end"),
        ("KRBL (India Gate)", 92, 62, DARK,  22, -30, 2, "end"),
        ("Riviana (Ebro)",  78, 54, BLUE,   18, -28, 2, "end"),
        ("Tilda (Ebro)",    70, 66, GOLD,   16, 28,  2, "start"),
        ("Amira",           62, 48, GREY,   16, 28,  2, "start"),
        ("Kohinoor",        56, 42, TEAL,   14, -28, 2, "end"),
        ("Authentic Royal", 48, 38, GOLD,   12, 22,  2, "start"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "Algro Intl." else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(22), Y(16); tx, ty = X(22), Y(80)
    move = f"""
  <line x1="{sx}" y1="{sy-30}" x2="{tx}" y2="{ty+18}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+18}" y="{ty+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">Algro's move</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">GLOBAL SCALE + AI (THE GIANTS)</text>
  <text x="{X(24)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">INDEPENDENT SCALE + INSTITUTIONAL AI</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">BIG, DIGITALLY AVERAGE</text>
  <text x="{X(24)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">INDEPENDENT, UNDER-AUTOMATED</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Operator Scale x AI &amp; Buyer-Experience Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The category's giants have scale; Algro can have institutional-grade AI faster. The top-left corner is empty.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">AI &amp; Buyer-Experience Maturity -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Operator Scale / Resources -&gt;</text>
  {quad}{dots}{move}
</svg>"""


# ============================================================================
# DIAGRAM 4 - AI GROWTH ENGINE (900 x 560) - 3 columns x 4 cards
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET CITED &amp; DISCOVERED</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">be the answer procurement gets</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN THE DOCUMENTATION RACE</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">RFP / RFI / audits in minutes</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">HOLD &amp; EXPAND</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">retain accounts, replicate the engine</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    found = (
        arch_card(20, 136, 256, 88, BLUE, "Answer-Engine (GEO)",
                  "Be cited in Google AI, ChatGPT, and Perplexity for procurement queries.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Category Thought Leadership",
                    "Tariffs, FSMA 204, multi-origin compliance - the under-covered topics.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Named-Account ABM Intelligence",
                    "Track buyer triggers across retail PL, foodservice, and CPG teams.", "Lead Gen", ORANGE)
        + arch_card(20, 436, 256, 88, BLUE, "Buyer-Side Conversational Layer",
                    "On-site bot that answers capabilities, certifications, MOQ in seconds.", "My Dev", DARK)
    )
    faster = (
        arch_card(320, 136, 256, 88, ORANGE, "AI RFP / RFI Auto-Drafting",
                  "Generate technical responses in the buyer's exact format - in minutes.", "My Dev", DARK)
        + arch_card(320, 236, 256, 88, ORANGE, "FSVP / HARPC / COA Library",
                    "Indexed certifications, lot COAs, kosher, halal, NOP, GFSI - one query.", "My AI", TEAL)
        + arch_card(320, 336, 256, 88, ORANGE, "Multi-Origin Traceability",
                    "Lot chain of custody across India, Thailand, US - FSMA-204-ready.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "Tariff & Trade Signal Monitor",
                    "Watch USITC, FX, freight; propose origin-mix updates per buyer.", "My AI", TEAL)
    )
    keep = (
        arch_card(620, 136, 256, 88, TEAL, "Sales-Pipeline Memory",
                  "Every buyer conversation, sample, audit, recipe iteration - searchable.", "My Dev", DARK)
        + arch_card(620, 236, 256, 88, TEAL, "Per-SKU Spec Automation",
                    "Auto-generate spec sheets, allergen statements, and packaging copy.", "My AI", TEAL)
        + arch_card(620, 336, 256, 88, TEAL, "Account-Renewal Intelligence",
                    "Watch volume drift, price-hold expirations, audit cycles per account.", "My AI", TEAL)
        + arch_card(620, 436, 256, 88, TEAL, "Portfolio Reuse (Simply So + BIEL)",
                    "Same engine across consumer brand + 54-country parent export.", "My Dev", DARK)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">RFPs</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">awards</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The AI Growth Engine - Get Cited, Win the Doc Race, Hold &amp; Expand</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Demand discovery on the left; the documentation engine in the center; retention and portfolio reuse on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My AI - My Dev - My Security. AI auto-drafts, indexes, monitors, and remembers. It never sets pricing in an antitrust-sensitive way and never replaces a GFSI / food-safety determination - a person owns both.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {marker}{title}{headers}{bg}{found}{faster}{keep}{arrows}{note}
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">GET CITED &amp; CAPTURE</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">BUILD THE DOC ENGINE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-270</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">HOLD &amp; EXPAND</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "AEO + Thought Leadership",
                       "Own AI-search for tariffs, FSMA, NOP, multi-origin queries.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Named-Account ABM",
                         "Triggers + dossiers across retail PL, foodservice, industrial CPG.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Buyer-Doc / RFP Engine",
                         "Index FSVP/HARPC/COA/cert library; auto-draft buyer responses.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Multi-Origin Traceability",
                         "Lot chain of custody India/Thailand/US; tariff signal monitor.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Sales-Pipeline Memory",
                         "Account dossiers, conversation memory, renewal intelligence.", "My AI", TEAL)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Portfolio Reuse",
                         "Same engine for Simply So consumer + BIEL parent export.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Named-account roster, win-rate baselines, and FSMA-204 SKU scope calibrate after a 30-min discovery call. Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 270 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Algro + Technijian growth program. Get cited, win the doc race, hold and expand.</text>"""
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
    print("Generating ALG diagrams (technijian-diagram skill, SVG)...")
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
