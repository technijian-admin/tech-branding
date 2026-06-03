"""
generate-diagrams.py - ACU  Acuity Advisors (acuityadvisors.com)
Renders 5 diagram PNGs via Playwright using HTML+SVG. ABM / professional-services framing.

Output:  Clients/ACU/diagrams/model.png         (Fig 02.0 - owners + referrals -> Acuity -> right-result transition)
         Clients/ACU/diagrams/personas.png      (Fig 06.0 - Deal Value x Strategic/Recurring Value)
         Clients/ACU/diagrams/competitive.png    (Fig 07.0 - Scale x Content & AEO Maturity 2x2)
         Clients/ACU/diagrams/architecture.png   (Fig 10.0 - Get Cited / Win the Referral & Owner / Run Leaner & Remember)
         Clients/ACU/diagrams/timeline.png       (Fig 12.0 - 90/180/270 roadmap)
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
    # idempotent: normalize any pre-encoded ampersand first, then encode once
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
# DIAGRAM 1 - OWNERS + REFERRALS -> ACUITY -> RIGHT-RESULT TRANSITION (900 x 520)
# ============================================================================

def build_model_svg():
    OWN  = (104, 86, 240, 92)
    REF  = (556, 86, 240, 92)
    ACU  = (330, 250, 240, 116)
    OUT  = (652, 262, 196, 92)

    boxes = (
        box(*OWN, WHITE, BLUE,   "BUSINESS OWNERS", "the succession wave", DARK, GREY)
        + box(*REF, WHITE, ORANGE, "REFERRAL SOURCES", "CPAs - attorneys - wealth advisors", DARK, GREY)
        + box(*ACU,  DARK,  DARK,   "ACUITY ADVISORS", "since 1989 - West Coast's largest ESOP practice", WHITE, "#C9CDD6", 14)
        + box(*OUT, WHITE, TEAL, "THE RIGHT RESULT", "ESOP - sale - family", DARK, GREY, 13)
    )

    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{DARK}"/>
      </marker>
    </defs>"""

    a1 = f"""
  <line x1="244" y1="178" x2="372" y2="250" stroke="{BLUE}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="250" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}" text-anchor="start">(1) self-educate, then engage</text>"""

    a2 = f"""
  <line x1="640" y1="178" x2="528" y2="250" stroke="{ORANGE}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="650" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="end">(2) warm introduction (#1 channel)</text>"""

    a3 = f"""
  <line x1="570" y1="300" x2="648" y2="300" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="609" y="291" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{DARK}" text-anchor="middle">(3) advise + execute</text>"""

    title = f"""
  <text x="48" y="38" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Acuity Wins Work</text>
  <text x="48" y="58" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A confidential, referral-driven practice: owners find Acuity through authority and warm introductions, then transition the right way.</text>"""

    note = f"""
  <text x="450" y="392" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle" font-style="italic">Three services, one right result: ESOP advisory - sell-side &amp; buy-side M&amp;A - valuation. Backed by Marshall &amp; Stevens.</text>"""

    band = f"""
  <rect x="48" y="414" width="804" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="48" y="414" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="68" y="436" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in - inside your security perimeter</text>
  <text x="68" y="458" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">answer-engine authority  -  referral (COI) intelligence  -  secure deal-prep AI  -  35-year institutional knowledge</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {marker}{title}{boxes}{a1}{a2}{a3}{note}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - CUSTOMER MATRIX (900 x 600)  X = Deal/Account Value ; Y = Strategic/Recurring Value
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, value, strategic, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("ESOP", "Legacy-Minded Owner (ESOP)",  80, 84, ORANGE, DARK,  28, 0,   48, "middle"),
        ("SELL", "Retiring Founder (sell-side)", 86, 50, BLUE,   WHITE, 26, 0,  -34, "middle"),
        ("BUY",  "Strategic / PE Acquirer",      72, 34, TEAL,   DARK,  22, 0,   40, "middle"),
        ("VAL",  "CFO / Board (valuation)",      50, 70, CRIT,   WHITE, 24, 34,   2, "start"),
        ("FAM",  "Family Successor",             60, 28, PURPLE, WHITE, 22, 0,   40, "middle"),
        ("CPA",  "CPA / Tax-Advisor",            28, 88, GOLD,   DARK,  22, 0,   42, "middle"),
        ("ATTY", "Attorney / Wealth Advisor",    24, 66, GREEN,  WHITE, 20, -28,  2, "end"),
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
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">STRATEGIC MULTIPLIERS</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE ENGAGEMENTS</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">SMALLER / OCCASIONAL</text>"""

    legend = f"""
  <text x="80" y="566" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" font-style="italic">Seven client types across three practice lines, plus the referral sources (COIs) who carry the most strategic value.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Client Matrix - Deal / Account Value x Strategic &amp; Recurring Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The ESOP owner and the referral source carry the most strategic, recurring value - where account-based effort should concentrate.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Strategic &amp; Recurring Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Deal / Account Value -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)  X = Scale/Reach ; Y = Content & AEO Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, maturity, color, r, ldx, ldy, anchor)
    C = [
        ("Acuity Advisors", 48, 40, ORANGE, 28, 0,  48, "middle"),
        ("Objective IBV",   44, 78, BLUE,   20, 0, -30, "middle"),
        ("Generational",    82, 88, DARK,   22, 0, -32, "middle"),
        ("Prairie Capital", 58, 72, GREEN,  18, 30,  4, "start"),
        ("ButcherJoseph",   54, 64, TEAL,   16, -28, 2, "end"),
        ("CSG Partners",    58, 54, PURPLE, 16, 26,  4, "start"),
        ("Meritage",        32, 44, GOLD,   16, 0,  34, "middle"),
        ("Cabrillo",        34, 50, GREY,   14, -26, 2, "end"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "Acuity Advisors" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(48), Y(40); tx, ty = X(58), Y(74)
    move = f"""
  <line x1="{sx+26}" y1="{sy-18}" x2="{tx-12}" y2="{ty+14}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="{sx+30}" y="{sy-26}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">Acuity's move: own the answer-engine + the M&amp;A-vs-ESOP decision</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE + CONTENT LEADERS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">CONTENT-FORWARD, SMALLER</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE, LOW CONTENT</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOCAL / EMERGING</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Scale / Reach x Content &amp; Answer-Engine Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">No competitor is answer-engine-optimized - the cited answers come from accounting firms and the NCEO, not the deal banks. That corner is open.</text>
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET CITED</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">authority owners &amp; AI engines find</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN THE REFERRAL &amp; OWNER</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">account-based, under your relationships</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">RUN LEANER &amp; REMEMBER</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">secure, in-perimeter</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    cited = (
        arch_card(20, 136, 256, 88, BLUE, "Answer-Engine + Owner Education",
                  "Own 'what is an ESOP', 'ESOP vs sale', 'sell my business' in Google &amp; AI answers.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "M&amp;A-vs-ESOP Decision Hub",
                    "Acuity does both - own the trade-off owners agonize over.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Proof Scoreboard",
                    "35 years + hundreds of ESOP deals, finally merchandised and searchable.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "Local SoCal / OC Content",
                    "Claim 'sell my business Orange County' from brokers and law firms.", "My SEO", BLUE)
    )
    win = (
        arch_card(320, 136, 256, 88, ORANGE, "Referral (COI) Intelligence",
                  "Map and nurture the CPAs, attorneys &amp; wealth advisors who send deals.", "Lead Gen", ORANGE)
        + arch_card(320, 236, 256, 88, ORANGE, "Owner Transition Signals",
                    "Flag businesses showing succession, age, or industry signals for outreach.", "My AI", TEAL)
        + arch_card(320, 336, 256, 88, ORANGE, "Pitch / CIM / Proposal Accel",
                    "First-draft pitchbooks, teasers &amp; proposals from past work - securely.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "Relationship Intelligence",
                    "Warm-intro paths and COI tracking inside the Dynamics CRM you run.", "My AI", TEAL)
    )
    run = (
        arch_card(620, 136, 256, 88, TEAL, "Institutional-Knowledge System",
                  "35 years of deals into matched precedents for the next pitch.", "My AI", TEAL)
        + arch_card(620, 236, 256, 88, TEAL, "Due-Diligence Review",
                    "Flag change-of-control, indemnity &amp; liabilities ~70% faster.", "My Dev", DARK)
        + arch_card(620, 336, 256, 88, TEAL, "Financial Spreading Support",
                    "First-pass spreads &amp; comps the credentialed pro verifies and signs.", "My AI", TEAL)
        + arch_card(620, 436, 256, 88, TEAL, "On Your Secure Perimeter",
                    "Built inside the IT &amp; security Technijian already runs - not a public chatbot.", "My IT", GOLD)
    )
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Acuity AI Engine - Get Cited, Win the Referral &amp; Owner, Run Leaner &amp; Remember</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Build authority on the left, arm the partners against named accounts &amp; referrers in the center, and raise revenue-per-professional on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My Dev - My AI, built INSIDE the security perimeter Technijian already runs for Acuity. AI assists; the credentialed professional signs; confidential deal data never touches public AI.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{cited}{win}{run}{note}
</svg>"""


# ============================================================================
# DIAGRAM 5 - 90/180/270 ROADMAP (900 x 392)
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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">AUTHORITY &amp; REFERRAL</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-270</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; REMEMBER</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Answer-Engine + Owner Education",
                       "AEO content for the questions owners Google first.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Decision Hub + Proof",
                         "M&amp;A-vs-ESOP hub; merchandise 35 years of deals.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Referral (COI) Intelligence",
                         "Map &amp; nurture CPAs / attorneys / wealth advisors.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Owner Signals + Local Content",
                         "Transition-signal monitoring; own SoCal search.", "My AI", TEAL)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Secure Deal-Prep AI",
                         "CIM / teaser / proposal + DD review, in-perimeter.", "My Dev", DARK)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Knowledge System + ROI",
                         "Institutional memory; dashboard vs. your baselines.", "My AI", TEAL)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Engagement, referral &amp; fee targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are illustrative, not a quote.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 270 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Acuity - Technijian program. Build authority, activate referrals, then scale a secure deal-prep and knowledge engine.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">
  {title}{phases}{bar}{cards}{note}
</svg>"""


# ============================================================================
# DIAGRAM 6 - SERVICE ARCHITECTURE (900 x 560) - 3 practice lines x 4 cards
# ============================================================================

def build_services_svg():
    headers = f"""
  <rect x="16"  y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">ESOP ADVISORY</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">West Coast's largest practice</text>
  <rect x="316" y="76" width="264" height="48" fill="{BLUE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">M&amp;A ADVISORY</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">sell-side and buy-side</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">VALUATION ADVISORY</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">rigorous and defensible</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""
    esop = (
        arch_card(20, 136, 256, 88, ORANGE, "Feasibility & Design",
                  "Is an ESOP the right path? Structure, financing, and plan design.", "ERISA", CRIT)
        + arch_card(20, 236, 256, 88, ORANGE, "Section 1042 Tax Structuring",
                    "Defer the owner's capital-gains tax on a qualifying sale to the ESOP.", "1042", DARK)
        + arch_card(20, 336, 256, 88, ORANGE, "Trustee-Side Valuation",
                    "The independent, defensible valuation the transaction stands on.", "USPAP", TEAL)
        + arch_card(20, 436, 256, 88, ORANGE, "Sustainability & Resale",
                    "Repurchase obligation, ongoing valuation, and the eventual second sale.", "Lifecycle", GOLD)
    )
    ma = (
        arch_card(320, 136, 256, 88, BLUE, "Sell-Side Process",
                  "Valuation, marketing, buyer screening, management presentations.", "Sell", BLUE)
        + arch_card(320, 236, 256, 88, BLUE, "Buy-Side Process",
                    "Target identification, valuation, financing, execution, post-close.", "Buy", BLUE)
        + arch_card(320, 336, 256, 88, BLUE, "Negotiation to Close",
                    "Run the process, hold the leverage, and carry the deal to the finish.", "Process", DARK)
        + arch_card(320, 436, 256, 88, BLUE, "Fairness & Solvency Opinions",
                    "Independent opinions boards and trustees rely on.", "FINRA", CRIT)
    )
    val = (
        arch_card(620, 136, 256, 88, TEAL, "Estate & Gift",
                  "Valuations for estate planning, gifting, and wealth transfer.", "Tax", TEAL)
        + arch_card(620, 236, 256, 88, TEAL, "Financial Reporting",
                    "Purchase-price allocation, impairment, and stock comp (409A).", "GAAP", DARK)
        + arch_card(620, 336, 256, 88, TEAL, "Transaction & Fairness",
                    "Deal valuations and fairness opinions for boards.", "Deal", TEAL)
        + arch_card(620, 436, 256, 88, TEAL, "Litigation & Disputes",
                    "Defensible valuations that hold up under scrutiny.", "Defense", GOLD)
    )
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Acuity's Three Practice Lines &mdash; ESOP, M&amp;A, and Valuation</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">One firm spanning the owner's whole transition - and the only kind that can advise the M&amp;A-vs-ESOP decision honestly.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Backed by CFA / ASA credentials, the Edgewater Capital broker-dealer (FINRA/SIPC), and the Marshall &amp; Stevens national platform. Badges mark the standard each service answers to.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{esop}{ma}{val}{note}
</svg>"""


# -- RENDER --
async def render(page, html, output):
    await page.set_content(html, wait_until="networkidle")
    box_ = await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width": max(box_["w"], 900), "height": max(box_["h"], 100)})
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating ACU diagrams (technijian-diagram skill, SVG)...")
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
