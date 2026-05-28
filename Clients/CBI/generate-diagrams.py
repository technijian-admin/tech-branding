"""
generate-diagrams.py — CBI  Christian Brother's Flooring & Interiors (cbinteriors.net)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

Output:  Clients/CBI/diagrams/model.png         (Figure 02.0 — Two-channel model)
         Clients/CBI/diagrams/personas.png      (Figure 06.0 — Customer matrix)
         Clients/CBI/diagrams/competitive.png    (Figure 07.0 — Scale x Digital/AI maturity 2x2)
         Clients/CBI/diagrams/architecture.png   (Figure 10.0 — AI engine)
         Clients/CBI/diagrams/timeline.png       (Figure 12.0 — 90/180/365 roadmap)
Usage:   /c/Python314/python.exe Clients/CBI/generate-diagrams.py
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
# DIAGRAM 1 - TWO-CHANNEL MODEL (900 x 520)
# Homebuilder (B2B) + Homeowner (B2C) -> CBI -> Finished/installed
# ============================================================================

def build_model_svg():
    BUILDER  = (104, 86, 240, 92)
    HOMEOWN  = (556, 86, 240, 92)
    CBI      = (330, 250, 240, 116)
    FINISHED = (652, 262, 196, 92)

    boxes = (
        box(*BUILDER, WHITE, BLUE,   "HOMEBUILDER", "production / semi-custom", DARK, GREY)
        + box(*HOMEOWN, WHITE, ORANGE, "HOMEOWNER", "remodel + new-home buyer", DARK, GREY)
        + box(*CBI,    DARK,  DARK,   "CHRISTIAN BROTHERS", "design center + flooring & finishes", WHITE, "#C9CDD6", 14)
        + box(*FINISHED, WHITE, TEAL, "FINISHED HOME", "personalized + installed", DARK, GREY, 13)
    )

    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{DARK}"/>
      </marker>
    </defs>"""

    # Builder -> CBI (B2B channel)
    a1 = f"""
  <line x1="244" y1="178" x2="372" y2="250" stroke="{BLUE}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="250" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}" text-anchor="start">(1) outsources design center</text>"""

    # Homeowner -> CBI (B2C channel)
    a2 = f"""
  <line x1="640" y1="178" x2="528" y2="250" stroke="{ORANGE}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="650" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="end">(2) finds via search + showroom</text>"""

    # CBI -> Finished
    a3 = f"""
  <line x1="570" y1="300" x2="648" y2="300" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="609" y="291" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{DARK}" text-anchor="middle">(3) install</text>"""

    title = f"""
  <text x="48" y="38" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Two Ways Christian Brothers Wins Work</text>
  <text x="48" y="58" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A B2B homebuilder design-center channel and a B2C homeowner channel, both converging on the showroom and install crew.</text>"""

    note = f"""
  <text x="450" y="392" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle" font-style="italic">New-home buyers personalize their selections through the Studio Chateau tool CBI already uses; homeowners come through local search + the showroom.</text>"""

    band = f"""
  <rect x="48" y="414" width="804" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="48" y="414" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="68" y="438" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="68" y="460" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">local search &amp; reviews  -  room visualizer  -  homebuilder account intelligence  -  selection &amp; quote automation  -  lead capture</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {marker}{title}{boxes}{a1}{a2}{a3}{note}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - CUSTOMER MATRIX (900 x 600)
# X = Project / Account Value ; Y = Strategic / Recurring Value
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, v, m, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("BLDR", "Homebuilder",            80, 88, BLUE,   WHITE, 30, 0,   48, "middle"),
        ("REF",  "Referral Source",        36, 80, GOLD,   DARK,  24, 0,  -34, "middle"),
        ("NEW",  "New-Home Buyer",         48, 58, ORANGE, DARK,  26, -36,  4, "end"),
        ("DEV",  "Multifamily / Commercial", 84, 50, GREEN, WHITE, 24, 0,   42, "middle"),
        ("WHM",  "Whole-Home Move-Up",     66, 36, DARK,   WHITE, 22, 0,   40, "middle"),
        ("RMD",  "Remodel Homeowner",      42, 32, TEAL,   DARK,  26, 0,   44, "middle"),
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
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE PROJECTS</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / TRANSACTIONAL</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Homebuilder (design-center partner)</text>
  <circle cx="430" cy="557" r="7" fill="{ORANGE}"/> <text x="442" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">New-Home Buyer</text>
  <circle cx="660" cy="557" r="7" fill="{TEAL}"/>   <text x="672" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Remodel Homeowner</text>
  <circle cx="84"  cy="581" r="7" fill="{GOLD}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Referral Source (realtor / designer / GC)</text>
  <circle cx="430" cy="581" r="7" fill="{GREEN}"/>  <text x="442" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Multifamily / Commercial Developer</text>
  <circle cx="660" cy="581" r="7" fill="{DARK}"/>   <text x="672" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Whole-Home Move-Up Homeowner</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Customer Matrix - Project / Account Value x Strategic / Recurring Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">CBI's buyers span a B2B builder channel (recurring) and a B2C homeowner channel (volume), plus referral multipliers.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Strategic / Recurring Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Project / Account Value -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)
# X = Scale / Reach ; Y = Digital & AI Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, maturity, color, r, ldx, ldy, anchor)
    C = [
        ("CBI",                30, 34, ORANGE, 28, 0,  48, "middle"),
        ("Metro Flooring",     48, 78, BLUE,   20, 0, -30, "middle"),
        ("West Coast Flooring", 64, 82, TEAL,  20, 0, -30, "middle"),
        ("Floor Store",        54, 66, GREEN,  16, 28,  4, "start"),
        ("Chateau Interiors",  84, 84, DARK,   22, 0, -32, "middle"),
        ("Empire Today",       88, 54, GREY,   18, 0,  34, "middle"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "CBI" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(30), Y(34); tx, ty = X(52), Y(66)
    move = f"""
  <line x1="{sx+30}" y1="{sy-20}" x2="{tx-16}" y2="{ty+14}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="{sx+34}" y="{sy-30}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">CBI's move: reviews, visual portfolio + room visualizer</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE + DIGITAL LEADERS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DIGITAL-FORWARD, SMALLER</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE, AVERAGE DIGITAL</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOCAL / EMERGING</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Scale / Reach x Digital &amp; AI Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">CBI can't out-scale Empire or Chateau - but it can out-modernize on what local homeowners actually choose by.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Digital &amp; AI Maturity -&gt;</text>
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">homeowner demand (B2C)</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN BUILDERS</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">design-center partnerships (B2B)</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">CONVERT &amp; SERVE</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">speed + capacity</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    found = (
        arch_card(20, 136, 256, 88, BLUE, "Geo-SEO Fix + Local / AEO",
                  "Re-anchor to San Diego, city-by-product pages, both Google Business Profiles.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Review-Generation Engine",
                    "Post-install asks to Google / Yelp / Houzz - close the review-volume gap.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Visual Portfolio + Social",
                    "Completed jobs into Houzz / Instagram / Pinterest content; unify the two brands.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "AI Room Visualizer",
                    "'See your floor in your room' on the site and a showroom kiosk - de-risk the choice.", "My Dev", DARK)
    )
    build = (
        arch_card(320, 136, 256, 88, ORANGE, "Builder Account Intelligence",
                  "Monitor new San Diego communities, starts, and permits; rank builders to pursue.", "Lead Gen", ORANGE)
        + arch_card(320, 236, 256, 88, ORANGE, "New-Community Triggers",
                    "Alert when a builder staffs a community needing a design-center partner.", "My AI", TEAL)
        + arch_card(320, 336, 256, 88, ORANGE, "Design-Center Proof Library",
                    "Package the BIA Icon-winning builder work into a searchable proof library.", "My SEO", BLUE)
        + arch_card(320, 436, 256, 88, ORANGE, "RFP / Proposal Automation",
                    "Draft builder proposals from past work - speed wins the relationship.", "My AI", TEAL)
    )
    serve = (
        arch_card(620, 136, 256, 88, TEAL, "Lead Capture + CRM Nurture",
                  "Speed-to-lead replies and drip for showroom, shop-at-home, and design leads.", "My Dev", DARK)
        + arch_card(620, 236, 256, 88, TEAL, "AI Mood-Boards + Concepts",
                    "Generate room concepts and finish palettes to speed the designer meetings.", "My AI", TEAL)
        + arch_card(620, 336, 256, 88, TEAL, "Selection + Quote Automation",
                    "AI-assisted measure-to-quote and options pricing around Studio Chateau.", "My Dev", DARK)
        + arch_card(620, 436, 256, 88, TEAL, "Booking + Install Coordination",
                    "Online scheduling with reminders; install status and post-job review prompts.", "My Dev", DARK)
    )
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Christian Brothers AI Engine - Get Found, Win Builders, Convert &amp; Serve</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Capture homeowner demand on the left, win builder design-center partnerships in the center, convert and serve on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My Dev - My AI, built on the IT &amp; security foundation Technijian already runs for CBI. AI augments the designers, showroom, and install crew; it integrates around the Studio Chateau tool CBI already uses.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{found}{build}{serve}{note}
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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">CAPTURE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">GROW</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Geo-SEO + GBP Foundation",
                       "Re-anchor to San Diego, city/product pages, both Google profiles.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Review Engine Live",
                         "Post-install review asks; start closing the volume gap vs rivals.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Room Visualizer",
                         "'See your floor in your room' on the site + showroom kiosk.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Visual Portfolio + Social",
                         "Houzz / Instagram / Pinterest content engine; unify the brands.", "My SEO", BLUE)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Builder Account Intelligence",
                         "SD community + starts targets; design-center proof library.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Automate + Optimize",
                         "Lead capture / CRM + selection / quote automation; ROI dashboard.", "My Dev", DARK)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Lead, project &amp; builder-pipeline targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Christian Brothers - Technijian program. Fix the foundation, capture homeowner demand, grow the builder channel.</text>"""
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
    print("Generating CBI diagrams (technijian-diagram skill, SVG)...")
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
