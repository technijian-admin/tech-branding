"""
generate-diagrams.py - PCU  Pacific Utility Installation, Inc. (pacificutility.com)
Renders diagram PNGs via Playwright using HTML+SVG. ABM / specialty-contractor framing.
Counts are research-driven (5 personas, derived from PUI's buyer landscape - not a borrowed number).

Output:  Clients/PCU/diagrams/model.png         (Fig - buyers -> PUI -> projects)
         Clients/PCU/diagrams/services.png      (Fig - 5 trades, single-source)
         Clients/PCU/diagrams/personas.png      (Fig - Project Value x Strategic/Recurring, 5 personas)
         Clients/PCU/diagrams/competitive.png    (Fig - Scale x Content/AEO 2x2)
         Clients/PCU/diagrams/architecture.png   (Fig - Get Found & Trusted / Win the Work / Run Leaner & Remember)
         Clients/PCU/diagrams/timeline.png       (Fig - 90/180/270 roadmap)
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
CRIT   = "#CC0000"


def page_shell(svg: str, bg: str = WHITE) -> str:
    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ background:{bg}; display:inline-block; }}
  svg {{ display:block; }}
</style></head><body>{svg}</body></html>"""


def esc(s: str) -> str:
    return s.replace("&amp;", "&").replace("&", "&amp;").replace("<", "&lt;")


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
# DIAGRAM 1 - BUYERS -> PUI -> PROJECTS (900 x 520)
# ============================================================================

def build_model_svg():
    PRIV = (104, 86, 240, 92)
    PUB  = (556, 86, 240, 92)
    PUI  = (322, 250, 256, 116)
    OUT  = (652, 262, 196, 92)

    boxes = (
        box(*PRIV, WHITE, BLUE,   "PRIVATE BUYERS", "developers - builders - GCs", DARK, GREY)
        + box(*PUB, WHITE, ORANGE, "PUBLIC & UTILITY", "agencies - utilities (grid)", DARK, GREY)
        + box(*PUI,  DARK,  DARK,   "PACIFIC UTILITY", "since 1997 - employee-owned - CA / NV / AZ", WHITE, "#C9CDD6", 14)
        + box(*OUT, WHITE, TEAL, "PROJECTS DELIVERED", "on schedule - energized - safe", DARK, GREY, 12)
    )

    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{DARK}"/>
      </marker>
    </defs>"""

    a1 = f"""
  <line x1="244" y1="178" x2="368" y2="250" stroke="{BLUE}" stroke-width="2.5" marker-end="url(#ar)"/>
  <rect x="245" y="208" width="196" height="20" rx="4" fill="{WHITE}"/>
  <text x="250" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}" text-anchor="start">(1) bid + relationship</text>"""

    a2 = f"""
  <line x1="640" y1="178" x2="532" y2="250" stroke="{ORANGE}" stroke-width="2.5" marker-end="url(#ar)"/>
  <rect x="426" y="208" width="228" height="20" rx="4" fill="{WHITE}"/>
  <text x="650" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="end">(2) RFP + prequalification</text>"""

    a3 = f"""
  <line x1="578" y1="300" x2="648" y2="300" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="613" y="291" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{DARK}" text-anchor="middle">(3) build</text>"""

    title = f"""
  <text x="48" y="38" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Pacific Utility Wins Work</text>
  <text x="48" y="58" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A relationship- and bid-driven contractor: private developers/GCs and public agencies/utilities, won account by account.</text>"""

    note = f"""
  <text x="450" y="392" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle" font-style="italic">Five trades under one roof: utility engineering - wet utility - dry utility - high voltage - streetlights &amp; signals.</text>"""

    band = f"""
  <rect x="48" y="414" width="804" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="48" y="414" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="68" y="436" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="68" y="458" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">project &amp; permit intelligence  -  bid / RFP automation  -  estimating acceleration  -  answer-engine authority  -  25-yr knowledge</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {marker}{title}{boxes}{a1}{a2}{a3}{note}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - FIVE TRADES, SINGLE-SOURCE (900 x 500) - 5 cards in a row
# ============================================================================

def trade_card(x, y, w, h, accent, title, desc, tag):
    t = esc(title); tg = esc(tag)
    words = esc(desc).split(); lines = []; cur = ""
    for wd in words:
        if len(cur) + len(wd) + 1 <= 22:
            cur = (cur + " " + wd).strip()
        else:
            lines.append(cur); cur = wd
    lines.append(cur); lines = lines[:4]
    dtext = "".join(
        f'<text x="{x+12}" y="{y+58+i*15}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{ln}</text>'
        for i, ln in enumerate(lines))
    # title may wrap to 2 lines
    tw = t.split(); tl1, tl2 = [], []; cnt = 0; on2 = False
    for wd in tw:
        if not on2 and cnt + len(wd) + 1 <= 16:
            tl1.append(wd); cnt += len(wd) + 1
        else:
            on2 = True; tl2.append(wd)
    ttext = f'<text x="{x+12}" y="{y+24}" font-family="Segoe UI,Arial" font-size="12.5" font-weight="700" fill="{DARK}">{" ".join(tl1)}</text>'
    if tl2:
        ttext += f'<text x="{x+12}" y="{y+39}" font-family="Segoe UI,Arial" font-size="12.5" font-weight="700" fill="{DARK}">{" ".join(tl2)}</text>'
    bw = len(tg) * 6 + 14
    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="4" stroke="{LIGHT}"/>
  <rect x="{x}" y="{y}" width="{w}" height="6" fill="{accent}" rx="3"/>
  {ttext}{dtext}
  <rect x="{x+12}" y="{y+h-26}" width="{bw}" height="16" fill="{accent}" rx="8"/>
  <text x="{x+12+bw//2}" y="{y+h-15}" font-family="Segoe UI,Arial" font-size="9.5" font-weight="700" fill="{WHITE}" text-anchor="middle">{tg}</text>"""


def build_services_svg():
    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">One Contractor, Five Trades &mdash; Single-Source Underground</text>
  <text x="40" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Almost no rival spans all five. Single-sourcing every underground scope de-risks the developer's schedule - PUI's differentiator.</text>"""
    CW, GAP, X0, Y0, CH = 164, 10, 40, 86, 188
    cards = (
        trade_card(X0 + 0*(CW+GAP), Y0, CW, CH, BLUE, "Utility Engineering",
                   "Site studies, estimating, constructability, conflict-overlay plans.", "Plan")
        + trade_card(X0 + 1*(CW+GAP), Y0, CW, CH, TEAL, "Wet Utility",
                     "Sewer, storm drain, water mainline, laterals, points of connection.", "Water")
        + trade_card(X0 + 2*(CW+GAP), Y0, CW, CH, ORANGE, "Dry Utility",
                     "Trenching, Rule 20 undergrounding, conduit, vaults, telecom, gas.", "Origin")
        + trade_card(X0 + 3*(CW+GAP), Y0, CW, CH, CRIT, "High Voltage",
                     "Cable, splice, make-up; set & energize transformers and switchgear.", "Safety-critical")
        + trade_card(X0 + 4*(CW+GAP), Y0, CW, CH, GOLD, "Streetlights & Signals",
                     "Street lights, traffic signals, controllers, retro-fit, maintenance.", "Public")
    )
    band = f"""
  <rect x="40" y="298" width="820" height="58" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="298" width="6" height="58" rx="3" fill="{ORANGE}"/>
  <text x="60" y="320" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Why single-source wins (and why "Applicant Installation" started here)</text>
  <text x="60" y="341" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">one schedule - one point of contact - fewer utility conflicts - faster energization - the schedule certainty siloed subs can't give a developer.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 384" width="900" height="384" role="img">
  {title}{cards}{band}
</svg>"""


# ============================================================================
# DIAGRAM 3 - CUSTOMER MATRIX (900 x 600)  X = Project/Account Value ; Y = Strategic/Recurring (5 personas)
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, value, strategic, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("UTIL", "Utility / Grid-Hardening", 86, 86, PURPLE, WHITE, 28, 0,  -34, "middle"),
        ("DEV",  "Land Developer (MPC)",     74, 68, BLUE,   WHITE, 28, 34,   4, "start"),
        ("BLDR", "Production Home Builder",   62, 54, ORANGE, DARK,  26, 0,   44, "middle"),
        ("GC",   "General Contractor",        48, 40, TEAL,   DARK,  24, 0,   42, "middle"),
        ("MUNI", "Municipal / Public-Works",  36, 80, CRIT,   WHITE, 24, 0,  -34, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR / RECURRING</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">STRATEGIC (BID / PREQUAL)</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE PROJECTS</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">PROJECT-BY-PROJECT</text>"""

    legend = f"""
  <text x="80" y="566" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" font-style="italic">Five buyer types, derived from PUI's actual work - the utility/grid and land-developer accounts carry the most strategic, recurring value.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Customer Matrix - Project / Account Value x Strategic &amp; Recurring Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Where each Pacific Utility buyer sits - the booming utility/grid channel and repeat developers anchor the account-based effort.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Strategic &amp; Recurring Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Project / Account Value -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 4 - COMPETITIVE 2x2 (900 x 600)  X = Scale/Reach ; Y = Content & AEO Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, maturity, color, r, ldx, ldy, anchor)
    C = [
        ("Pacific Utility",  42, 32, ORANGE, 26, 0,  46, "middle"),
        ("W.A. Rasic",       66, 72, BLUE,   22, 0, -32, "middle"),
        ("Helix Electric",   88, 60, DARK,   20, 0,  36, "middle"),
        ("Sturgeon (MYR)",   78, 54, PURPLE, 18, 0, -30, "middle"),
        ("Sukut",            64, 48, GREEN,  18, 30,  4, "start"),
        ("Doty Bros.",       54, 46, GOLD,   16, 0, -26, "middle"),
        ("T.E. Roberts",     30, 40, TEAL,   15, -22, 4, "end"),
        ("Turf",             26, 22, GREY,   14, 0,  30, "middle"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "Pacific Utility" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(42), Y(32)
    move = f"""
  <line x1="{sx+20}" y1="{sy-20}" x2="500" y2="232" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="172" y="210" font-family="Segoe UI,Arial" font-size="12.5" font-weight="700" fill="{ORANGE}" text-anchor="start">PUI's move: own the AI-answer</text>
  <text x="172" y="230" font-family="Segoe UI,Arial" font-size="12.5" font-weight="700" fill="{ORANGE}" text-anchor="start">authority + the single-source story</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE + CONTENT</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">CONTENT-FORWARD, SMALLER</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE, LOW CONTENT</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOCAL / LOW DIGITAL</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Scale / Reach x Content &amp; Answer-Engine Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A low-digital category: only W.A. Rasic does project-PR, and via earned media. Nobody owns AI-answer authority - that corner is open.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Content &amp; AEO Maturity -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Scale / Reach -&gt;</text>
  {quad}{dots}{move}
</svg>"""


# ============================================================================
# DIAGRAM 5 - AI ENGINE (900 x 560) - 3 columns x 4 cards
# ============================================================================

def arch_card(x, y, w, h, accent, title, desc, badge, badge_color):
    t = esc(title); d = esc(desc); b = esc(badge)
    badge_txt = WHITE if badge_color in (BLUE, DARK, TEAL, PURPLE, CRIT) else DARK
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND &amp; TRUSTED</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">authority for named buyers</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN THE WORK</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">project intelligence + bids</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">RUN LEANER &amp; REMEMBER</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">do more with fewer estimators</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""
    found = (
        arch_card(20, 136, 256, 88, BLUE, "Answer-Engine + Tri-State Local",
                  "Own 'underground / dry / HV utility contractor [CA/NV/AZ city]' in AI answers.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "The Single-Source Story",
                    "Own 'one contractor, all five trades' - the schedule-de-risking nobody else claims.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Project-Proof Scoreboard",
                    "Structured, searchable case studies - lots energized, jurisdictions cleared.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "Rule 20 / Undergrounding Authority",
                    "Claim the grid-hardening search lane no contractor owns.", "My SEO", BLUE)
    )
    win = (
        arch_card(320, 136, 256, 88, ORANGE, "Project & Permit Intelligence",
                  "Flag developers, MPCs & agencies entitling/permitting scope - months early.", "Lead Gen", ORANGE)
        + arch_card(320, 236, 256, 88, ORANGE, "Bid / RFP Response Automation",
                    "Assemble responsive public + private bids fast from PUI's history.", "My Dev", DARK)
        + arch_card(320, 336, 256, 88, ORANGE, "AI Estimating & Takeoff",
                    "Cut takeoff time; more bids per estimator - the human signs the price.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "Pre-Bid Account Dossiers",
                    "Brief the team on each target developer, agency, or utility before pursuit.", "My AI", TEAL)
    )
    run = (
        arch_card(620, 136, 256, 88, TEAL, "25-Year Knowledge System",
                  "Past bids, jurisdictions & conflict-overlays into matched precedents.", "My AI", TEAL)
        + arch_card(620, 236, 256, 88, TEAL, "Safety & Compliance Docs",
                    "HV safety, traffic-control plans, DIR / prevailing-wage, prequal packages.", "My AI", TEAL)
        + arch_card(620, 336, 256, 88, TEAL, "Schedule & Preconstruction",
                    "Generative scheduling and substructure-conflict avoidance.", "My Dev", DARK)
        + arch_card(620, 436, 256, 88, TEAL, "The Estimator Stays in Control",
                    "AI assists; the licensed estimator / PM owns final pricing and signs.", "Boundary", CRIT)
    )
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Pacific Utility AI Engine - Get Found &amp; Trusted, Win the Work, Run Leaner &amp; Remember</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Build authority for named buyers on the left, win more of the booming grid/public work in the center, do more with fewer estimators on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My Dev - My AI. On fixed-price, safety-critical work, AI assists; the licensed estimator / PM owns final pricing and signs off - never autonomous bidding.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{found}{win}{run}{note}
</svg>"""


# ============================================================================
# DIAGRAM 6 - 90/180/270 ROADMAP (900 x 392)
# ============================================================================

def milestone_card(x, y, w, h, accent, num, title, body, tag, tag_color):
    t = esc(title); bd = esc(body); tg = esc(tag)
    tw = len(tg) * 7 + 16; tx = x + w - tw - 8; ty = y + h - 22
    tag_txt = WHITE if tag_color in (BLUE, DARK, TEAL, PURPLE, CRIT) else DARK
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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">WIN THE WORK</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-270</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">RUN LEANER &amp; REMEMBER</text>"""
    TL_Y, TL_H = 110, 18
    bar = f"""
  <defs><linearGradient id="tl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="{BLUE}"/><stop offset="45%" stop-color="{TEAL}"/>
    <stop offset="75%" stop-color="{ORANGE}"/><stop offset="100%" stop-color="#c45e2c"/>
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "AEO + Tri-State Local SEO",
                       "Answer-engine + the single-source story; proof scoreboard.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Rule 20 Authority + Recency",
                         "Own the undergrounding lane; restart the content cadence.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Project & Permit Intelligence",
                         "Flag developers/agencies/utilities entitling scope, early.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Bid / RFP Automation",
                         "Assemble responsive bids fast; pre-bid account dossiers.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "AI Estimating & Takeoff",
                         "Relieve the estimator bottleneck; human signs the price.", "My Dev", DARK)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Knowledge System + ROI",
                         "25-year precedents; dashboard vs. win-rate baselines.", "My AI", TEAL)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Bid-volume, win-rate &amp; job-size targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are illustrative, not a quote.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 270 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Pacific Utility - Technijian program. Build authority, win more of the booming grid/public work, then run leaner.</text>"""
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
    print("Generating PCU diagrams (technijian-diagram skill, SVG)...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        print("1/6  model.png");        await render(page, page_shell(build_model_svg()),       DIAGRAMS_DIR / "model.png")
        print("2/6  services.png");     await render(page, page_shell(build_services_svg()),    DIAGRAMS_DIR / "services.png")
        print("3/6  personas.png");     await render(page, page_shell(build_personas_svg()),    DIAGRAMS_DIR / "personas.png")
        print("4/6  competitive.png");  await render(page, page_shell(build_competitive_svg()), DIAGRAMS_DIR / "competitive.png")
        print("5/6  architecture.png"); await render(page, page_shell(build_arch_svg()),        DIAGRAMS_DIR / "architecture.png")
        print("6/6  timeline.png");     await render(page, page_shell(build_timeline_svg()),    DIAGRAMS_DIR / "timeline.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
