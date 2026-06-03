"""
generate-diagrams.py - MBCA  MBC Aquatic Sciences (Marine Biological Consultants, Inc.)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

IMPORTANT esc() rule: box(), arch_card(), and milestone_card() run text through esc(),
so pass a LITERAL '&' to them (esc converts it to &amp;). In RAW <text> written here,
use '&amp;' directly.

Output:  Clients/MBCA/diagrams/model.png         (Figure 02.0 - The named-account / on-call growth engine)
         Clients/MBCA/diagrams/personas.png      (Figure 05.0 - Pursuit Volume x Account LTV)
         Clients/MBCA/diagrams/competitive.png   (Figure 06.0 - Firm Scale x AI & Digital Maturity)
         Clients/MBCA/diagrams/architecture.png  (Figure 09.0 - AI growth & integration engine)
         Clients/MBCA/diagrams/timeline.png      (Figure 11.0 - 90/180/270 roadmap)
Usage:   C:/Python314/python.exe Clients/MBCA/generate-diagrams.py
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
ROSE   = "#B5476A"
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
# DIAGRAM 1 - THE NAMED-ACCOUNT / ON-CALL GROWTH ENGINE (900 x 540)
# ============================================================================

def build_model_svg():
    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How a Specialized Aquatic-Science Firm Wins - Pursue, Propose, Win, Renew</text>
  <text x="40" y="55" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Named agencies &amp; primes; QBS / on-call master agreements; the cheapest win is the on-call renewal.</text>"""

    # Demand sources (4 boxes) - ABM-shaped, not consumer
    DX = [20, 240, 460, 680]
    DW = 198
    demand = (
        box(DX[0], 74, DW, 46, OFF, LIGHT, "RFP / SOQ INVITATIONS", "agency solicitations", DARK, GREY, 12)
        + box(DX[1], 74, DW, 46, OFF, LIGHT, "AI-SEARCH / AEO",  "Google AI, Perplexity", DARK, GREY, 13)
        + box(DX[2], 74, DW, 46, OFF, LIGHT, "PRIME / REFERRAL", "A-E teaming, reputation", DARK, GREY, 12)
        + box(DX[3], 74, DW, 46, OFF, LIGHT, "ABM PURSUIT MONITOR", "named-account triggers", DARK, GREY, 12)
    )
    label = f"""<text x="450" y="140" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}" text-anchor="middle">THE PURSUIT FUNNEL</text>"""
    # connectors demand -> funnel
    conns = ""
    for dx in DX:
        cx = dx + DW // 2
        conns += f"""<line x1="{cx}" y1="120" x2="450" y2="150" stroke="#ADB5BD" stroke-width="1.2"/>"""

    # Funnel stages - B2B / agency procurement
    SX = [10, 158, 306, 454, 602, 750]
    SW, SH, SY = 130, 64, 158
    stages = (
        box(SX[0], SY, SW, SH, BLUE,   BLUE,   "IDENTIFY",     "be cited",            WHITE, "#C9E3F4", 13)
        + box(SX[1], SY, SW, SH, TEAL,   TEAL,   "QUALIFY",      "fit / go-no-go",      DARK,  DARK,      13)
        + box(SX[2], SY, SW, SH, BLUE,   BLUE,   "PROPOSE/SOQ",  "scope, quals, refs",  WHITE, "#C9E3F4", 12)
        + box(SX[3], SY, SW, SH, ORANGE, ORANGE, "SHORTLIST",    "interview, scoring",  DARK,  DARK,      13)
        + box(SX[4], SY, SW, SH, BLUE,   BLUE,   "AWARD",        "task order, contract",WHITE, "#C9E3F4", 12)
        + box(SX[5], SY, SW, SH, DARK,   DARK,   "ON-CALL RENEW","keep the master",     WHITE, "#C9CDD6", 12)
    )
    marker = f"""<defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker>
    <marker id="ral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 Z" fill="{ORANGE}"/></marker></defs>"""
    arrows = ""
    for i in range(5):
        x1 = SX[i] + SW + 2
        x2 = SX[i + 1] - 2
        arrows += f"""<line x1="{x1}" y1="{SY+SH//2}" x2="{x2}" y2="{SY+SH//2}" stroke="{GREY}" stroke-width="2" marker-end="url(#fa)"/>"""

    # retention loop (dashed arrow RENEW -> IDENTIFY, below funnel)
    loop_y = SY + SH + 30
    retention = f"""
  <line x1="{SX[5]+SW//2}" y1="{SY+SH+4}" x2="{SX[5]+SW//2}" y2="{loop_y}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4"/>
  <line x1="{SX[5]+SW//2}" y1="{loop_y}" x2="{SX[0]+SW//2}" y2="{loop_y}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4"/>
  <line x1="{SX[0]+SW//2}" y1="{loop_y}" x2="{SX[0]+SW//2}" y2="{SY+SH+4}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ral)"/>
  <rect x="318" y="{loop_y-11}" width="284" height="22" rx="11" fill="{WHITE}"/>
  <text x="460" y="{loop_y+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="middle">On-call renewal loop - re-award without re-winning the pursuit</text>"""

    # AI band
    BY = 318
    band = f"""
  <rect x="20" y="{BY}" width="858" height="206" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="20" y="{BY}" width="6" height="206" rx="3" fill="{BLUE}"/>
  <text x="44" y="{BY+28}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Where Technijian AI plugs in - under the named-account relationship, not a shotgun funnel</text>
  <text x="44" y="{BY+58}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}">Capture the Memory</text>
  <text x="44" y="{BY+76}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">institutional-memory brain - 57 years of reports, field data, taxonomy &amp; senior-scientist judgment, queryable</text>
  <text x="44" y="{BY+104}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}">Win the Proposal Race</text>
  <text x="44" y="{BY+122}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">AI SOQ / RFP auto-drafting - key-personnel &amp; project-reference sheets - CEQA/NEPA scope builder - multi-model QC</text>
  <text x="44" y="{BY+150}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}">Get Cited &amp; Pursue</text>
  <text x="44" y="{BY+168}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">AEO / AI-search authority on eelgrass, 316(b), toxicity &amp; desal - named-account pursuit monitoring - dossiers</text>
  <text x="44" y="{BY+196}" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">AI drafts, indexes, monitors &amp; remembers. It never makes the scientific determination or signs a regulatory submittal - a licensed scientist owns both.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" width="900" height="540" role="img">
  {marker}{title}{demand}{conns}{label}{stages}{arrows}{retention}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - PERSONA MATRIX (900 x 600)
# X = Pursuit Volume / Velocity ; Y = Account Lifetime Value
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, vol, value, color, txt_color, r) - 8 evidence-driven segments from MBC's real client list
    P = [
        ("POWER", "Power-Generation Utility",  26, 88, BLUE,   WHITE, 26),
        ("DESAL", "Desalination Developer",     15, 82, GOLD,   DARK,  20),
        ("WASTE", "Wastewater / Sanitation",    44, 76, TEAL,   DARK,  24),
        ("PORT",  "Port / Harbor Authority",    54, 70, ORANGE, DARK,  24),
        ("FED",   "Federal / Military",         28, 64, DARK,   WHITE, 18),
        ("MUNI",  "Municipal / Water Agency",   70, 50, PURPLE, WHITE, 24),
        ("DEV",   "Coastal Developer",          58, 40, ROSE,   WHITE, 20),
        ("PRIME", "Prime / A-E Partner",        90, 46, GREEN,  WHITE, 26),
    ]
    dots = ""
    for key, label, v, m, color, tc, r in P:
        cx, cy = X(v), Y(m)
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE, HIGH-VELOCITY</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">FLAGSHIP / HIGH-LTV ACCOUNTS</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / RECURRING</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">PROJECT / AS-NEEDED</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Power Generation</text>
  <circle cx="250" cy="557" r="7" fill="{TEAL}"/>   <text x="262" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Wastewater / Sanitation</text>
  <circle cx="470" cy="557" r="7" fill="{ORANGE}"/> <text x="482" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Port / Harbor</text>
  <circle cx="610" cy="557" r="7" fill="{GOLD}"/>   <text x="622" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Desalination</text>
  <circle cx="84"  cy="581" r="7" fill="{GREEN}"/>  <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Prime / A-E</text>
  <circle cx="250" cy="581" r="7" fill="{PURPLE}"/> <text x="262" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Municipal / Water</text>
  <circle cx="470" cy="581" r="7" fill="{DARK}"/>   <text x="482" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Federal / Military</text>
  <circle cx="660" cy="581" r="7" fill="{ROSE}"/>   <text x="672" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Coastal Developer</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The MBC Buyer - Pursuit Volume x Account Lifetime Value (from MBC's real client list)</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Power, wastewater &amp; port monitoring are the recurring backbone; desalination is the highest-value project; primes are the highest-velocity channel.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Account Lifetime Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Pursuit Volume / Velocity -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)
# X = Firm Scale / Resources ; Y = AI & Digital Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, ai, color, r, ldx, ldy, anchor)
    C = [
        ("MBC (today)",        30, 13, ORANGE, 24, 38,  6, "start"),
        ("Tenera",             44, 28, BLUE,   16, 0, -22, "middle"),
        ("Merkel & Assoc.",    22, 33, TEAL,   15, 0, -22, "middle"),
        ("Miller Marine",      16, 19, GREY,   13, -20, 4, "end"),
        ("CSA Ocean",          50, 34, GOLD,   16, 26,  4, "start"),
        ("Dudek",              68, 44, BLUE,   18, 0, -26, "middle"),
        ("Anchor QEA",         76, 34, TEAL,   16, 0,  34, "middle"),
        ("ESA",                86, 46, DARK,   18, 0, -26, "middle"),
        ("AECOM",              96, 38, GREY,   18, 0,  34, "middle"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "MBC (today)" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(30), Y(13); tx, ty = X(30), Y(80)
    move = f"""
  <line x1="{sx}" y1="{sy-30}" x2="{tx}" y2="{ty+18}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+18}" y="{ty+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">MBC's move</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">GLOBAL SCALE + AI (THE GIANTS)</text>
  <text x="{X(24)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">NICHE DEPTH + INSTITUTIONAL AI</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">BIG, DIGITALLY AVERAGE</text>
  <text x="{X(24)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">NICHE, UNDER-AUTOMATED</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Firm Scale x AI &amp; Digital Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Niche peers are small and traditional; the giants have scale but no niche AI. The top-left corner is empty.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">AI &amp; Digital Maturity -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Firm Scale / Resources -&gt;</text>
  {quad}{dots}{move}
</svg>"""


# ============================================================================
# DIAGRAM 4 - AI GROWTH & INTEGRATION ENGINE (900 x 560) - 3 columns x 4 cards
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">CAPTURE THE MEMORY</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">57 years, before it retires</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN THE PROPOSAL RACE</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">SOQs &amp; scopes in hours</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">GET CITED &amp; PURSUE</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">be the cited niche expert</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    capture = (
        arch_card(20, 136, 256, 88, BLUE, "Institutional-Memory Brain",
                  "Index 57 years of reports, field data, and taxonomy.", "My Dev", DARK)
        + arch_card(20, 236, 256, 88, BLUE, "Senior-Scientist Debrief Capture",
                    "Record the retiring bench's judgment before it leaves.", "My AI", TEAL)
        + arch_card(20, 336, 256, 88, BLUE, "Project & Site-History Search",
                    "Every eelgrass, tox, and 316(b) project, queryable.", "My Dev", DARK)
        + arch_card(20, 436, 256, 88, BLUE, "Next-Generation Onboarding",
                    "New scientists learn from the firm's accumulated judgment.", "My AI", TEAL)
    )
    propose = (
        arch_card(320, 136, 256, 88, ORANGE, "AI SOQ / RFP Auto-Drafting",
                  "Draft qualifications and scopes in the agency's format.", "My Dev", DARK)
        + arch_card(320, 236, 256, 88, ORANGE, "Key-Personnel & Reference Sheets",
                    "Auto-assemble resumes and matched past projects.", "My AI", TEAL)
        + arch_card(320, 336, 256, 88, ORANGE, "CEQA / NEPA Scope Builder",
                    "Assemble defensible scopes from approved prior work.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "Multi-Model QC Review",
                    "Cross-check drafts for gaps before the scientist signs.", "My AI", TEAL)
    )
    cited = (
        arch_card(620, 136, 256, 88, TEAL, "Answer-Engine (GEO / AEO)",
                  "Be cited for eelgrass, 316(b), tox, and desal queries.", "My SEO", BLUE)
        + arch_card(620, 236, 256, 88, TEAL, "Niche Thought Leadership",
                    "Eelgrass policy, 316(b), HABs - the under-covered topics.", "My SEO", BLUE)
        + arch_card(620, 336, 256, 88, TEAL, "Named-Account Pursuit Monitor",
                    "Watch on-call solicitations, CIP filings, NPDES cycles.", "Lead Gen", ORANGE)
        + arch_card(620, 436, 256, 88, TEAL, "Buyer-Side Conversational Layer",
                    "Answer agency and prime questions; route to a scientist.", "My Dev", DARK)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">feeds</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">wins</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The AI Growth &amp; Integration Engine - Capture, Propose, Get Cited</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The memory brain on the left feeds the proposal engine in the center; AI-search authority fills the pursuit funnel on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My AI - My Dev. AI drafts, indexes, monitors, and remembers. It never makes a scientific determination or signs a regulatory submittal - a licensed scientist owns both.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {marker}{title}{headers}{bg}{capture}{propose}{cited}{arrows}{note}
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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">MEMORY + PROPOSAL ENGINE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-270</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">QC, RENEW &amp; SCALE</text>"""
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
                       "Own AI-search for eelgrass, 316(b), tox, desal queries.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Named-Account Pursuit Monitor",
                         "Track on-call solicitations, CIP/CEQA filings, NPDES cycles.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Institutional-Memory Brain",
                         "Index 57 years of reports, data, taxonomy; queryable.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "SOQ / Proposal Engine",
                         "Auto-draft SOQs, scopes, references from the brain.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Debrief Capture + QC",
                         "Record retiring experts; multi-model QC on deliverables.", "My AI", TEAL)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Renewal & Pursuit Intelligence",
                         "Watch on-call renewals; scale the engine firm-wide.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Named-account roster, win-rate baselines, and average engagement value calibrate after a 30-min discovery call. Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 270 Day Growth &amp; Integration Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">MBC + Technijian program. Get cited and capture; build the memory and proposal engine; QC, renew, and scale.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">
  {title}{phases}{bar}{cards}{note}
</svg>"""


# ============================================================================
# DIAGRAM 6 - SERVICE ARCHITECTURE / VALUE CHAIN (900 x 540)
# Regulatory drivers -> project lifecycle -> MBC service families
# ============================================================================

def svc_card(x, y, w, h, accent, title, desc):
    t = esc(title); d = esc(desc)
    words = d.split(); l1, l2, cnt, on2 = [], [], 0, False
    for w_ in words:
        if not on2 and cnt + len(w_) + 1 <= 38:
            l1.append(w_); cnt += len(w_) + 1
        else:
            on2 = True; l2.append(w_)
    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="4" stroke="{LIGHT}"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+16}" y="{y+26}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">{t}</text>
  <text x="{x+16}" y="{y+46}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(l1)}</text>
  <text x="{x+16}" y="{y+62}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(l2)}</text>"""


def build_service_arch_svg():
    marker = f"""<defs><marker id="sa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker></defs>"""
    title = f"""
  <text x="20" y="30" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">MBC Service Architecture - Seven Capabilities Across the Regulated Project Lifecycle</text>
  <text x="20" y="51" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Regulatory drivers create the demand; MBC's service families cover every stage from baseline study to long-term monitoring. (Plus lake &amp; reservoir management.)</text>"""

    drivers = ["CEQA / NEPA", "CWA 316(a)/(b)", "NPDES / EPA WET", "Coastal / USACE / RWQCB", "CEMP / MPA"]
    DX = [20, 194, 368, 542, 716]; DW = 164
    drv_label = f"""<text x="20" y="80" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}">REGULATORY DRIVERS (why agencies need defensible marine science)</text>"""
    drv = ""
    for i, d in enumerate(drivers):
        drv += f"""<rect x="{DX[i]}" y="88" width="{DW}" height="34" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="{DX[i]+DW//2}" y="109" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}" text-anchor="middle">{esc(d)}</text>"""

    stages = ["Baseline\nStudies", "Permitting\n& Docs", "Construction\nMonitoring", "Mitigation\n& Restoration", "Long-Term\nMonitoring"]
    SX = [20, 194, 368, 542, 716]; SW = 150
    scolors = [BLUE, TEAL, ORANGE, BLUE, DARK]
    stg_label = f"""<text x="20" y="156" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}">PROJECT LIFECYCLE</text>"""
    stg = ""
    for i, s in enumerate(stages):
        c = scolors[i]; tc = WHITE if c in (BLUE, DARK, TEAL) else DARK
        ln = s.split("\n")
        stg += f"""<rect x="{SX[i]}" y="164" width="{SW}" height="52" rx="6" fill="{c}"/>
  <text x="{SX[i]+SW//2}" y="190" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{tc}" text-anchor="middle">{esc(ln[0])}</text>
  <text x="{SX[i]+SW//2}" y="206" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{tc}" text-anchor="middle">{esc(ln[1])}</text>"""
        if i < 4:
            stg += f"""<line x1="{SX[i]+SW}" y1="190" x2="{SX[i+1]}" y2="190" stroke="{GREY}" stroke-width="2" marker-end="url(#sa)"/>"""

    fam_label = f"""<text x="20" y="252" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}">MBC SERVICE FAMILIES</text>"""
    CX = [20, 314, 608]; CW = 272
    cards = (
        svc_card(CX[0], 262, CW, 84, BLUE,   "Permitting & Documentation", "CEQA/NEPA, Coastal Commission, USACE 404, RWQCB 401 processing.")
        + svc_card(CX[1], 262, CW, 84, TEAL,   "Surveying", "Eelgrass & caulerpa, bathymetric and oceanographic surveys.")
        + svc_card(CX[2], 262, CW, 84, ORANGE, "Marine Studies", "Benthic, fish, plankton, scientific diving, 316(b) studies.")
        + svc_card(CX[0], 356, CW, 84, BLUE,   "Water & Toxicity", "In-house EPA acute/chronic WET lab; NPDES water-quality monitoring.")
        + svc_card(CX[1], 356, CW, 84, TEAL,   "Biological", "Sensitive-species; benthic studies from San Diego to Alaska.")
        + svc_card(CX[2], 356, CW, 84, ORANGE, "Mitigation & Restoration", "Eelgrass (CA pioneer), wetland and kelp restoration & monitoring.")
    )
    band = f"""
  <rect x="20" y="462" width="858" height="58" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="20" y="462" width="6" height="58" rx="3" fill="{ORANGE}"/>
  <text x="44" y="486" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">The strategic point: every family above produces reports, data, and judgment - 57 years of it - that today lives in people's heads.</text>
  <text x="44" y="506" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">Captured into an institutional-memory brain, that depth becomes a compounding asset that wins proposals faster and survives the next retirement.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" width="900" height="540" role="img">
  {marker}{title}{drv_label}{drv}{stg_label}{stg}{fam_label}{cards}{band}
</svg>"""


# -- RENDER --
async def render(page, html, output):
    await page.set_content(html, wait_until="networkidle")
    box_ = await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width": max(box_["w"], 900), "height": max(box_["h"], 100)})
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating MBCA diagrams (technijian-diagram skill, SVG)...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        print("1/5  model.png");        await render(page, page_shell(build_model_svg()),       DIAGRAMS_DIR / "model.png")
        print("2/5  personas.png");     await render(page, page_shell(build_personas_svg()),    DIAGRAMS_DIR / "personas.png")
        print("3/5  competitive.png");  await render(page, page_shell(build_competitive_svg()), DIAGRAMS_DIR / "competitive.png")
        print("4/6  architecture.png"); await render(page, page_shell(build_arch_svg()),        DIAGRAMS_DIR / "architecture.png")
        print("5/6  timeline.png");     await render(page, page_shell(build_timeline_svg()),    DIAGRAMS_DIR / "timeline.png")
        print("6/6  service.png");      await render(page, page_shell(build_service_arch_svg()),DIAGRAMS_DIR / "service.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
