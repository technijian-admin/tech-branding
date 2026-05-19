"""
generate-diagrams.py — MWAR Monaco Wheel Restoration
Renders 3 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=12px node text, WCAG contrast,
no drop shadows, no node gradients, solid fills, brand tokens.

Output:  Clients/MWAR/diagrams/personas.png
         Clients/MWAR/diagrams/architecture.png
         Clients/MWAR/diagrams/timeline.png
Usage:   python Clients/MWAR/generate-diagrams.py
"""

import asyncio
import pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

# ── Brand tokens (mirrors assets/brand-tokens.json) ─────────────────────────
BLUE   = "#006DB6"   # Core Blue   — primary nodes, axes
ORANGE = "#F67D4B"   # Core Orange — highlight (max 1-2 per diagram), CTAs
TEAL   = "#1EAAC8"   # Teal        — secondary nodes
DARK   = "#1A1A2E"   # Dark Charcoal
GREY   = "#59595B"   # Body text, axis labels
LIGHT  = "#E9ECEF"   # Gridlines, neutral fills
OFF    = "#F8F9FA"   # Light backgrounds
WHITE  = "#FFFFFF"
GOLD   = "#C9922A"   # Gold — body-shop persona
PURPLE = "#7B2D8B"   # Purple — SC Local persona


def page_shell(svg: str, bg: str = WHITE) -> str:
    """Minimal HTML wrapper so Playwright renders the SVG at full fidelity."""
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ background: {bg}; display: inline-block; }}
  svg {{ display: block; }}
</style>
</head>
<body>{svg}</body>
</html>"""


# ─────────────────────────────────────────────────────────────────────────────
# DIAGRAM 1 — CUSTOMER PERSONA SCATTER (900 × 600)
# technijian-diagram skill: Quadrant/scatter variant
#
# X axis: Visit Frequency 0.5→6.5 (6 units), chart x=80 to x=840, w=760
# Y axis: Revenue per Visit $100→$2500 (2400 units), chart y=60 to y=500, h=440
#   X(f) = 80 + (f - 0.5) / 6.0 * 760
#   Y(r) = 500 - (r - 100) / 2400 * 440
# All coordinates on 4px grid.
# ─────────────────────────────────────────────────────────────────────────────

# Grid line positions (4px grid)
# Horizontal (constant Y)  — $500, $1000, $1500, $2000
GY500  = 428   # 500 - 400/2400*440 = 500-73.3 = 426.7 → 428
GY1000 = 336   # 500 - 900/2400*440 = 500-165  = 335   → 336
GY1500 = 244   # 500 - 1400/2400*440= 500-256.7= 243.3 → 244
GY2000 = 152   # 500 - 1900/2400*440= 500-348.3= 151.7 → 152

# Vertical (constant X) — freq 1,2,3,4,5,6
GX1 = 144    # 80 + 0.5/6*760 = 143.3 → 144
GX2 = 268    # 80 + 1.5/6*760 = 270   → 268
GX3 = 396    # 80 + 2.5/6*760 = 396.7 → 396
GX4 = 524    # 80 + 3.5/6*760 = 523.3 → 524
GX5 = 652    # 80 + 4.5/6*760 = 650   → 652
GX6 = 776    # 80 + 5.5/6*760 = 776.7 → 776

# Data points — each spreads freq slightly so no two share the same X column
# LUX: freq=1.35 → X=188, rev=1500 → Y=244
# EV:  freq=1.65 → X=228, rev=800  → Y=372
# LR:  freq=0.75 → X=112, rev=400  → Y=444
# DLR: freq=4.0  → X=524, rev=2000 → Y=152
# BSP: freq=6.0  → X=776, rev=600  → Y=408
# SCL: freq=2.0  → X=268, rev=250  → Y=472
PERSONAS_SVG = f"""<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 900 600" width="900" height="600"
  role="img" aria-labelledby="p-title">

  <!-- ── Title ─────────────────────────────────── -->
  <text id="p-title" x="80" y="28" font-family="Segoe UI, Arial, sans-serif"
        font-size="18" font-weight="700" fill="{DARK}">
    Customer Persona Matrix — Frequency × Revenue per Visit
  </text>
  <text x="80" y="48" font-family="Segoe UI, Arial, sans-serif"
        font-size="12" fill="{GREY}">
    Monaco Wheel Restoration &amp; San Clemente Wheel Repair  |  bubble radius ∝ relative volume
  </text>

  <!-- ── Chart background ──────────────────────── -->
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>

  <!-- ── Horizontal grid lines ─────────────────── -->
  <line x1="80" y1="{GY2000}" x2="840" y2="{GY2000}" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="80" y1="{GY1500}" x2="840" y2="{GY1500}" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="80" y1="{GY1000}" x2="840" y2="{GY1000}" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="80" y1="{GY500}"  x2="840" y2="{GY500}"  stroke="{LIGHT}" stroke-width="1"/>

  <!-- ── Vertical grid lines ───────────────────── -->
  <line x1="{GX1}" y1="60" x2="{GX1}" y2="500" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="{GX2}" y1="60" x2="{GX2}" y2="500" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="{GX3}" y1="60" x2="{GX3}" y2="500" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="{GX4}" y1="60" x2="{GX4}" y2="500" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="{GX5}" y1="60" x2="{GX5}" y2="500" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="{GX6}" y1="60" x2="{GX6}" y2="500" stroke="{LIGHT}" stroke-width="1"/>

  <!-- ── Axes ──────────────────────────────────── -->
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>

  <!-- ── Y-axis labels ─────────────────────────── -->
  <text x="72" y="{GY2000+4}" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="end">$2K</text>
  <text x="72" y="{GY1500+4}" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="end">$1.5K</text>
  <text x="72" y="{GY1000+4}" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="end">$1K</text>
  <text x="72" y="{GY500+4}"  font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="end">$500</text>
  <text x="72" y="64"          font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="end">$2.5K</text>

  <!-- ── X-axis labels ─────────────────────────── -->
  <text x="{GX1}" y="516" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="middle">1×/yr</text>
  <text x="{GX2}" y="516" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="middle">2×</text>
  <text x="{GX3}" y="516" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="middle">3×</text>
  <text x="{GX4}" y="516" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="middle">4×</text>
  <text x="{GX5}" y="516" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="middle">5×</text>
  <text x="{GX6}" y="516" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}" text-anchor="middle">6×</text>

  <!-- ── Axis titles ───────────────────────────── -->
  <text transform="rotate(-90,24,280)" x="24" y="280"
        font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">
    Revenue per Visit
  </text>
  <text x="460" y="540" font-family="Segoe UI,Arial" font-size="13"
        font-weight="600" fill="{DARK}" text-anchor="middle">
    Visit Frequency (annual visits / year)
  </text>

  <!-- ══════════════════════════════════════════════════════════
       DATA POINTS
       Contrast rule (per skill): white on Blue/Dark/Purple ✓
                                  dark on Orange/Teal/Gold   ✓
       ══════════════════════════════════════════════════════════ -->

  <!-- 1. LUX — Luxury Vehicle Owner: freq=1.35, rev=$1500, X=188, Y=244 -->
  <circle cx="188" cy="244" r="28" fill="{BLUE}" stroke="none"/>
  <text x="188" y="249" font-family="Segoe UI,Arial" font-size="12"
        font-weight="700" fill="{WHITE}" text-anchor="middle">LUX</text>
  <!-- label above -->
  <text x="188" y="204" font-family="Segoe UI,Arial" font-size="12"
        font-weight="600" fill="{DARK}" text-anchor="middle">Luxury Owner</text>

  <!-- 2. EV — Tesla / EV Driver: freq=1.65, rev=$800, X=228, Y=372 -->
  <circle cx="228" cy="372" r="28" fill="{ORANGE}" stroke="none"/>
  <text x="228" y="377" font-family="Segoe UI,Arial" font-size="12"
        font-weight="700" fill="{DARK}" text-anchor="middle">EV</text>
  <!-- label right -->
  <text x="264" y="370" font-family="Segoe UI,Arial" font-size="12"
        font-weight="600" fill="{DARK}" text-anchor="start">Tesla Driver</text>

  <!-- 3. LR — Lease-Return Preparer: freq=0.75, rev=$400, X=112, Y=444 -->
  <circle cx="112" cy="444" r="24" fill="{TEAL}" stroke="none"/>
  <text x="112" y="449" font-family="Segoe UI,Arial" font-size="12"
        font-weight="700" fill="{DARK}" text-anchor="middle">LR</text>
  <!-- label below -->
  <text x="112" y="480" font-family="Segoe UI,Arial" font-size="12"
        font-weight="600" fill="{DARK}" text-anchor="middle">Lease Return</text>

  <!-- 4. DLR — Dealer / Lot Manager: freq=4.0, rev=$2000, X=524, Y=152 -->
  <!-- Largest dot — highest revenue, meaningful visit frequency, B2B star -->
  <circle cx="524" cy="152" r="32" fill="{DARK}" stroke="none"/>
  <text x="524" y="157" font-family="Segoe UI,Arial" font-size="12"
        font-weight="700" fill="{WHITE}" text-anchor="middle">DLR</text>
  <!-- label above -->
  <text x="524" y="108" font-family="Segoe UI,Arial" font-size="12"
        font-weight="600" fill="{DARK}" text-anchor="middle">Dealer / Fleet</text>
  <text x="524" y="124" font-family="Segoe UI,Arial" font-size="11"
        fill="{GREY}" text-anchor="middle">(highest value)</text>

  <!-- 5. BSP — Body Shop Partner: freq=6.0, rev=$600, X=776, Y=408 -->
  <circle cx="776" cy="408" r="24" fill="{GOLD}" stroke="none"/>
  <text x="776" y="413" font-family="Segoe UI,Arial" font-size="12"
        font-weight="700" fill="{DARK}" text-anchor="middle">BSP</text>
  <!-- label left (avoids right-edge clipping) -->
  <text x="740" y="388" font-family="Segoe UI,Arial" font-size="12"
        font-weight="600" fill="{DARK}" text-anchor="end">Body Shop</text>

  <!-- 6. SCL — San Clemente Local: freq=2.0, rev=$250, X=268, Y=472 -->
  <circle cx="268" cy="472" r="22" fill="{PURPLE}" stroke="none"/>
  <text x="268" y="477" font-family="Segoe UI,Arial" font-size="12"
        font-weight="700" fill="{WHITE}" text-anchor="middle">SCL</text>
  <!-- label right -->
  <text x="300" y="470" font-family="Segoe UI,Arial" font-size="12"
        font-weight="600" fill="{DARK}" text-anchor="start">SC Local</text>

  <!-- ── Legend ────────────────────────────────── -->
  <!-- Row 1: LUX, EV, LR at y=560; Row 2: DLR, BSP, SCL at y=580 -->
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>
  <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Luxury Vehicle Owner</text>
  <circle cx="248" cy="557" r="7" fill="{ORANGE}"/>
  <text x="260" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Tesla / EV Driver</text>
  <circle cx="404" cy="557" r="7" fill="{TEAL}"/>
  <text x="416" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Lease-Return Preparer</text>
  <circle cx="84"  cy="581" r="7" fill="{DARK}"/>
  <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Dealer / Lot Manager</text>
  <circle cx="248" cy="581" r="7" fill="{GOLD}"/>
  <text x="260" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Body Shop Partner</text>
  <circle cx="404" cy="581" r="7" fill="{PURPLE}"/>
  <text x="416" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">San Clemente Local</text>

</svg>"""


# ─────────────────────────────────────────────────────────────────────────────
# DIAGRAM 2 — AI GROWTH ENGINE ARCHITECTURE (900 × 480)
# technijian-diagram skill: Architecture (layered / swimlane) adapted to 3 columns
#
# Layout:  Col 1 (Inbound)  x=16, w=264
#          Arrow zone        x=280–316, w=36
#          Col 2 (AI Layer)  x=316, w=264
#          Arrow zone        x=580–616, w=36
#          Col 3 (Outbound)  x=616, w=264
# Columns: header h=48 at y=72; 3 cards h=88 gap=12 starting at y=132
# ─────────────────────────────────────────────────────────────────────────────

# Helper: a single card rect with left accent + title + desc + badge
def arch_card(x, y, w, h, accent_color, title, desc, badge, badge_color):
    title_escaped = title.replace("&", "&amp;").replace("<", "&lt;")
    desc_escaped  = desc.replace("&", "&amp;").replace("<", "&lt;")
    badge_escaped = badge.replace("&", "&amp;")
    # Determine badge text color (white on dark/blue/teal/purple, dark on orange/gold)
    badge_txt = WHITE if badge_color in (BLUE, DARK, TEAL, PURPLE) else DARK

    # Break desc into 2 lines at ~35 chars
    words = desc_escaped.split()
    line1, line2 = [], []
    count = 0
    on_line2 = False
    for w_ in words:
        if not on_line2 and count + len(w_) + 1 <= 36:
            line1.append(w_)
            count += len(w_) + 1
        else:
            on_line2 = True
            line2.append(w_)
    l1 = " ".join(line1)
    l2 = " ".join(line2)

    badge_w = len(badge_escaped) * 7 + 16
    badge_x = x + w - badge_w - 8
    badge_y = y + h - 22

    return f"""
  <!-- card: {title[:20]} -->
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4"  height="{h}" fill="{accent_color}" rx="2"/>
  <text x="{x+14}" y="{y+20}" font-family="Segoe UI,Arial" font-size="12"
        font-weight="700" fill="{DARK}">{title_escaped}</text>
  <text x="{x+14}" y="{y+36}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{l1}</text>
  <text x="{x+14}" y="{y+50}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{l2}</text>
  <rect x="{badge_x}" y="{badge_y}" width="{badge_w}" height="16"
        fill="{badge_color}" rx="8"/>
  <text x="{badge_x + badge_w//2}" y="{badge_y+11}" font-family="Segoe UI,Arial"
        font-size="10" font-weight="700" fill="{badge_txt}" text-anchor="middle">{badge_escaped}</text>"""


def build_arch_svg():
    # Arrow marker
    marker = f"""<defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="{BLUE}"/>
    </marker>
  </defs>"""

    # Column headers
    headers = f"""
  <rect x="16"  y="72" width="264" height="48" fill="{BLUE}"   rx="4"/>
  <text x="148" y="102" font-family="Segoe UI,Arial" font-size="14" font-weight="700"
        fill="{WHITE}" text-anchor="middle">INBOUND</text>

  <rect x="316" y="72" width="264" height="48" fill="{DARK}"   rx="4"/>
  <text x="448" y="102" font-family="Segoe UI,Arial" font-size="14" font-weight="700"
        fill="{WHITE}" text-anchor="middle">AI LAYER — TECHNIJIAN</text>

  <rect x="616" y="72" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="748" y="102" font-family="Segoe UI,Arial" font-size="14" font-weight="700"
        fill="{DARK}" text-anchor="middle">OUTBOUND</text>"""

    # Column backgrounds — 4 cards: h=88 gap=12, y=132 to y=132+4*88+3*12=132+388=520
    bg = f"""
  <rect x="16"  y="120" width="264" height="408" fill="{OFF}" rx="4"/>
  <rect x="316" y="120" width="264" height="408" fill="{OFF}" rx="4"/>
  <rect x="616" y="120" width="264" height="408" fill="{OFF}" rx="4"/>"""

    # Cards — 4 per column, y=132, 232, 332, 432 (h=88, gap=12)
    c_inbound = (
        arch_card(20, 132, 256, 88, BLUE,
                  "Local SEO Dominance",
                  "Google Map Pack — Costa Mesa & San Clemente. GBP posts, citations, review velocity.",
                  "My SEO", BLUE) +
        arch_card(20, 232, 256, 88, BLUE,
                  "Photo-to-Quote AI Bot",
                  "Text a wheel photo — AI estimates damage — quote in <5 min. Captures impulse moments.",
                  "My Dev", DARK) +
        arch_card(20, 332, 256, 88, BLUE,
                  "Before & After Content",
                  "Technician documents repair — auto-formatted post — scheduled to Instagram & TikTok.",
                  "My AI", TEAL) +
        arch_card(20, 432, 256, 88, BLUE,
                  "AEO / AI Search Visibility",
                  "Best wheel repair San Clemente AI citations. FAQ content for Perplexity + ChatGPT answers.",
                  "My SEO", BLUE)
    )

    c_ai = (
        arch_card(320, 132, 256, 88, DARK,
                  "Review Velocity Engine",
                  "SMS when job completes — one-tap review link — AI responds to every Google/Yelp review.",
                  "My AI", DARK) +
        arch_card(320, 232, 256, 88, DARK,
                  "After-Hours Capture",
                  "AI chatbot handles quotes outside M-F 8am-6pm. No lead lost to weekend competitors.",
                  "My Dev", DARK) +
        arch_card(320, 332, 256, 88, DARK,
                  "Two-Brand GBP Manager",
                  "Separate GBPs, Yelp listings, and keyword tracks for Monaco WR + San Clemente WR.",
                  "My SEO", DARK) +
        arch_card(320, 432, 256, 88, DARK,
                  "CRM Repeat Trigger",
                  "6-month re-engagement: Time for another repair? Auto-text to past customers at right moment.",
                  "My Dev", DARK)
    )

    c_outbound = (
        arch_card(620, 132, 256, 88, ORANGE,
                  "My AI Lead Gen — Dealers",
                  "AI-personalized outreach to OC & LV new-car dealers from Javon's inbox. Auto Day 3 & 7 follow-up.",
                  "My AI Lead Gen", TEAL) +
        arch_card(620, 232, 256, 88, ORANGE,
                  "My AI Lead Gen — Fleet",
                  "Fleet managers, corporate accounts, rental operators. Outbound B2B sequences at scale.",
                  "My AI Lead Gen", TEAL) +
        arch_card(620, 332, 256, 88, ORANGE,
                  "Tesla Specialist Campaign",
                  "Targeted ads + landing page for OC Tesla owners. Highest $/job segment in market.",
                  "My SEO", BLUE) +
        arch_card(620, 432, 256, 88, ORANGE,
                  "San Clemente Community Play",
                  "NextDoor, local FB groups, SC Patch. Ravi's personal network activated as launch base.",
                  "My AI", ORANGE)
    )

    # Arrows between columns at y=324 (midpoint of 4-card area: 132+388/2=132+194=326→324)
    arrows = f"""
  <!-- Arrow: Inbound -> AI Layer -->
  <line x1="280" y1="324" x2="312" y2="324" stroke="{BLUE}" stroke-width="2"
        marker-end="url(#arr)"/>
  <text x="296" y="318" font-family="Segoe UI,Arial" font-size="10"
        fill="{GREY}" text-anchor="middle">data</text>

  <!-- Arrow: AI Layer -> Outbound -->
  <line x1="580" y1="324" x2="612" y2="324" stroke="{BLUE}" stroke-width="2"
        marker-end="url(#arr)"/>
  <text x="596" y="318" font-family="Segoe UI,Arial" font-size="10"
        fill="{GREY}" text-anchor="middle">leads</text>"""

    title = f"""
  <text x="16" y="36" font-family="Segoe UI,Arial" font-size="18"
        font-weight="700" fill="{DARK}">AI Growth Engine Architecture</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12"
        fill="{GREY}">How Technijian's platform transforms Monaco Wheel Restoration's customer acquisition and retention</text>"""

    note = f"""
  <text x="16" y="544" font-family="Segoe UI,Arial" font-size="11"
        fill="{GREY}" font-style="italic">
    * My SEO · My AI · My Dev · My AI Lead Gen = Technijian product pillars. All active from Day 1.
  </text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 900 560" width="900" height="560"
  role="img" aria-labelledby="arch-title">
  {marker}
  {title}
  {headers}
  {bg}
  {c_inbound}
  {c_ai}
  {c_outbound}
  {arrows}
  {note}
</svg>"""


ARCH_SVG = build_arch_svg()


# ─────────────────────────────────────────────────────────────────────────────
# DIAGRAM 3 — 30/60/90 DAY IMPLEMENTATION TIMELINE (900 × 520)
# technijian-diagram skill: Timeline / Gantt template
#
# Time axis: Day 0 → Day 90 (x=80 to x=820), w=740, 8.22px per day
# Phase zones:
#   Foundation  (Days 1-30)  x=80,  w=248  (30 * 8.22 ≈ 247)
#   Launch      (Days 31-60) x=328, w=248
#   Accelerate  (Days 61-90) x=576, w=244  (to 820)
# Timeline bar y=120 h=20
# Milestone cards: 2 per phase × 3 phases = 6 cards in a 3-col × 2-row grid
#   Row 1: y=172, Row 2: y=280, card h=88, w=224
# ─────────────────────────────────────────────────────────────────────────────

# Day-to-X helper
def dx(day):
    return round((80 + (day / 90) * 740) / 4) * 4  # snap to 4px grid


def milestone_card(x, y, w, h, accent, num, title, body, tag, tag_color):
    title_e = title.replace("&", "&amp;")
    body_e  = body.replace("&", "&amp;").replace("<", "&lt;")
    tag_e   = tag.replace("&", "&amp;")
    tag_w   = len(tag_e) * 7 + 16
    tag_x   = x + w - tag_w - 8
    tag_y   = y + h - 22
    tag_txt = WHITE if tag_color in (BLUE, DARK, TEAL, PURPLE) else DARK

    # Break body into 2 lines
    words = body_e.split()
    line1, line2, count, on2 = [], [], 0, False
    for w_ in words:
        if not on2 and count + len(w_) + 1 <= 30:
            line1.append(w_); count += len(w_) + 1
        else:
            on2 = True; line2.append(w_)

    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4"   height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+14}" y="{y+17}" font-family="Segoe UI,Arial" font-size="11"
        font-weight="700" fill="{accent}">MILESTONE {num}</text>
  <text x="{x+14}" y="{y+32}" font-family="Segoe UI,Arial" font-size="12"
        font-weight="700" fill="{DARK}">{title_e}</text>
  <text x="{x+14}" y="{y+47}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(line1)}</text>
  <text x="{x+14}" y="{y+60}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(line2)}</text>
  <rect x="{tag_x}" y="{tag_y}" width="{tag_w}" height="16"
        fill="{tag_color}" rx="8"/>
  <text x="{tag_x + tag_w//2}" y="{tag_y+11}" font-family="Segoe UI,Arial"
        font-size="10" font-weight="700" fill="{tag_txt}" text-anchor="middle">{tag_e}</text>"""


def build_timeline_svg():
    # Phase header zones (y=60, h=44)
    P1_X, P2_X, P3_X = 80, 328, 576
    P1_W, P2_W, P3_W = 248, 248, 244

    phases = f"""
  <rect x="{P1_X}" y="60" width="{P1_W}" height="44" fill="{BLUE}"   rx="4 4 0 0"/>
  <text x="{P1_X + P1_W//2}" y="86" font-family="Segoe UI,Arial" font-size="13"
        font-weight="700" fill="{WHITE}" text-anchor="middle">DAYS 1–30  |  FOUNDATION</text>

  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4 4 0 0"/>
  <text x="{P2_X + P2_W//2}" y="86" font-family="Segoe UI,Arial" font-size="13"
        font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 31–60  |  LAUNCH</text>

  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4 4 0 0"/>
  <text x="{P3_X + P3_W//2}" y="86" font-family="Segoe UI,Arial" font-size="13"
        font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 61–90  |  ACCELERATE</text>"""

    # Timeline bar (y=104, h=20) + tick marks
    TL_Y, TL_H = 104, 20
    bar = f"""
  <defs>
    <linearGradient id="tl-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="{BLUE}"/>
      <stop offset="33%"  stop-color="{TEAL}"/>
      <stop offset="66%"  stop-color="{ORANGE}"/>
      <stop offset="100%" stop-color="#c45e2c"/>
    </linearGradient>
  </defs>
  <rect x="80" y="{TL_Y}" width="740" height="{TL_H}"
        fill="url(#tl-grad)" rx="4"/>
  <!-- Tick marks at day 0, 30, 60, 90 -->
  <line x1="80"  y1="{TL_Y-6}" x2="80"  y2="{TL_Y+TL_H+6}" stroke="{GREY}" stroke-width="1.5"/>
  <line x1="328" y1="{TL_Y-6}" x2="328" y2="{TL_Y+TL_H+6}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="576" y1="{TL_Y-6}" x2="576" y2="{TL_Y+TL_H+6}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="820" y1="{TL_Y-6}" x2="820" y2="{TL_Y+TL_H+6}" stroke="{GREY}" stroke-width="1.5"/>
  <text x="80"  y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11"
        fill="{GREY}" text-anchor="middle">Day 0</text>
  <text x="328" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11"
        fill="{GREY}" text-anchor="middle">Day 30</text>
  <text x="576" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11"
        fill="{GREY}" text-anchor="middle">Day 60</text>
  <text x="820" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11"
        fill="{GREY}" text-anchor="middle">Day 90</text>"""

    # Milestone cards: 3 cols × 2 rows
    # Card w=224, h=88, gap=24 between cols, y=Row1=160, y=Row2=260
    CARD_W = 224
    COL_X  = [84, 340, 596]   # left edge of each card column
    ROW_Y  = [160, 264]       # top of each row

    cards = ""
    # Phase 1 (col 0): Foundation
    cards += milestone_card(COL_X[0], ROW_Y[0], CARD_W, 92, BLUE,
        "1", "GBP Claim & Optimize",
        "Claim San Clemente WR GBP. Optimize both profiles with services, photos, keywords.",
        "My SEO", BLUE)
    cards += milestone_card(COL_X[0], ROW_Y[1], CARD_W, 92, BLUE,
        "2", "Review Velocity Kickstart",
        "Text 20 past customers a review request. Target: 15 new reviews in 30 days.",
        "My AI", DARK)

    # Phase 2 (col 1): Launch
    cards += milestone_card(COL_X[1], ROW_Y[0], CARD_W, 92, TEAL,
        "3", "Photo-to-Quote Bot Live",
        "Customer texts wheel photo — AI quote in <5 min. Reduces friction 60%.",
        "My Dev", DARK)
    cards += milestone_card(COL_X[1], ROW_Y[1], CARD_W, 92, TEAL,
        "4", "Dealer Outreach Running",
        "10 OC dealers contacted with wholesale proposal. Target: 2 new accounts.",
        "My AI", DARK)

    # Phase 3 (col 2): Accelerate
    cards += milestone_card(COL_X[2], ROW_Y[0], CARD_W, 92, ORANGE,
        "5", "SC Wheel Repair #1 in Maps",
        "San Clemente WR at 50+ reviews. Google Map Pack position 1 targeted.",
        "My SEO", BLUE)
    cards += milestone_card(COL_X[2], ROW_Y[1], CARD_W, 92, ORANGE,
        "6", "+2 Wheels/Day Sustained",
        "13+ wheels/day. AI ROI breakeven achieved at $140 blended avg.",
        "All", ORANGE)

    # Note at bottom
    note = f"""
  <text x="80" y="376" font-family="Segoe UI,Arial" font-size="11"
        fill="{GREY}" font-style="italic">
    * +2 wheels/day = $6,160/month new revenue — covers the full Technijian program investment.
  </text>"""

    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18"
        font-weight="700" fill="{DARK}">30 / 60 / 90 Day Implementation Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12"
        fill="{GREY}">Monaco Wheel Restoration + San Clemente Wheel Repair — Technijian AI Growth Program</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 900 392" width="900" height="392"
  role="img" aria-labelledby="tl-title">
  {title}
  {phases}
  {bar}
  {cards}
  {note}
</svg>"""


TIMELINE_SVG = build_timeline_svg()


# ─────────────────────────────────────────────────────────────────────────────
# RENDER
# ─────────────────────────────────────────────────────────────────────────────

async def render(page, html: str, output: pathlib.Path):
    await page.set_content(html, wait_until="networkidle")
    # Fit viewport to content exactly
    body_box = await page.evaluate("""() => {
      const b = document.body;
      return { width: b.scrollWidth, height: b.scrollHeight };
    }""")
    await page.set_viewport_size({
        "width":  max(body_box["width"],  900),
        "height": max(body_box["height"], 100),
    })
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating MWAR diagrams (technijian-diagram skill, SVG)...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page    = await browser.new_page(device_scale_factor=2)  # 2× for crisp PNG

        print("1/3  personas.png")
        await render(page, page_shell(PERSONAS_SVG), DIAGRAMS_DIR / "personas.png")

        print("2/3  architecture.png")
        await render(page, page_shell(ARCH_SVG), DIAGRAMS_DIR / "architecture.png")

        print("3/3  timeline.png")
        await render(page, page_shell(TIMELINE_SVG), DIAGRAMS_DIR / "timeline.png")

        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
