"""
generate-diagrams.py - AAVA  The Aventine at Aliso Viejo (Pacific Coast Management)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

IMPORTANT esc() rule: box(), arch_card(), and milestone_card() run text through esc(),
so pass a LITERAL '&' to them (esc converts it to &amp;). In RAW <text> written here,
use '&amp;' directly.

Output:  Clients/AAVA/diagrams/model.png         (Figure 02.0 - The leasing & retention engine)
         Clients/AAVA/diagrams/personas.png      (Figure 05.0 - Acquisition Volume x Resident Lifetime Value)
         Clients/AAVA/diagrams/competitive.png    (Figure 06.0 - Operator Scale x AI & Digital-Leasing Maturity)
         Clients/AAVA/diagrams/architecture.png   (Figure 10.0 - AI growth engine)
         Clients/AAVA/diagrams/timeline.png       (Figure 12.0 - 90/180/365 roadmap)
Usage:   /c/Python314/python.exe Clients/AAVA/generate-diagrams.py
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
# DIAGRAM 1 - THE LEASING & RETENTION ENGINE (900 x 540)
# ============================================================================

def build_model_svg():
    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How a Luxury Community Grows - Fill Faster, Convert, Keep</text>
  <text x="40" y="55" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Leads arrive from many sources; the lease is won on speed and experience; the cheapest lease is the resident you keep.</text>"""

    # Demand sources (4 boxes)
    DX = [20, 240, 460, 680]
    DW = 198
    demand = (
        box(DX[0], 74, DW, 46, OFF, LIGHT, "ILS LISTINGS", "Apartments.com, Zillow", DARK, GREY, 13)
        + box(DX[1], 74, DW, 46, OFF, LIGHT, "SEARCH & SEO", "Google, AI answers", DARK, GREY, 13)
        + box(DX[2], 74, DW, 46, OFF, LIGHT, "REPUTATION", "reviews, referrals", DARK, GREY, 13)
        + box(DX[3], 74, DW, 46, OFF, LIGHT, "DRIVE-BY", "signage, location", DARK, GREY, 13)
    )
    label = f"""<text x="450" y="140" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}" text-anchor="middle">THE LEASING FUNNEL</text>"""
    # connectors demand -> funnel
    conns = ""
    for dx in DX:
        cx = dx + DW // 2
        conns += f"""<line x1="{cx}" y1="120" x2="450" y2="150" stroke="#ADB5BD" stroke-width="1.2"/>"""

    # Funnel stages
    SX = [31, 203, 375, 547, 719]
    SW, SH, SY = 150, 64, 158
    stages = (
        box(SX[0], SY, SW, SH, BLUE,   BLUE,   "INQUIRE", "respond in minutes", WHITE, "#C9E3F4", 14)
        + box(SX[1], SY, SW, SH, TEAL,   TEAL,   "TOUR",    "book 24/7",          DARK,  DARK,      14)
        + box(SX[2], SY, SW, SH, BLUE,   BLUE,   "APPLY",   "apply online",       WHITE, "#C9E3F4", 14)
        + box(SX[3], SY, SW, SH, ORANGE, ORANGE, "LEASE",   "speed wins",         DARK,  DARK,      14)
        + box(SX[4], SY, SW, SH, DARK,   DARK,   "RENEW",   "keep them",          WHITE, "#C9CDD6", 14)
    )
    marker = f"""<defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker>
    <marker id="ral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 Z" fill="{ORANGE}"/></marker></defs>"""
    arrows = ""
    for i in range(4):
        x1 = SX[i] + SW + 2
        x2 = SX[i + 1] - 2
        arrows += f"""<line x1="{x1}" y1="{SY+SH//2}" x2="{x2}" y2="{SY+SH//2}" stroke="{GREY}" stroke-width="2" marker-end="url(#fa)"/>"""

    # retention loop (dashed arrow RENEW -> INQUIRE, below funnel)
    loop_y = SY + SH + 30
    retention = f"""
  <line x1="{SX[4]+SW//2}" y1="{SY+SH+4}" x2="{SX[4]+SW//2}" y2="{loop_y}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4"/>
  <line x1="{SX[4]+SW//2}" y1="{loop_y}" x2="{SX[0]+SW//2}" y2="{loop_y}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4"/>
  <line x1="{SX[0]+SW//2}" y1="{loop_y}" x2="{SX[0]+SW//2}" y2="{SY+SH+4}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ral)"/>
  <rect x="320" y="{loop_y-11}" width="260" height="22" rx="11" fill="{WHITE}"/>
  <text x="450" y="{loop_y+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="middle">Retention loop - re-lease without re-acquiring</text>"""

    # AI band
    BY = 318
    band = f"""
  <rect x="20" y="{BY}" width="858" height="206" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="20" y="{BY}" width="6" height="206" rx="3" fill="{BLUE}"/>
  <text x="44" y="{BY+28}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Where Technijian AI plugs in - uniformly, and disclosed as a bot</text>
  <text x="44" y="{BY+58}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}">Get Found &amp; Convert</text>
  <text x="44" y="{BY+76}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">local SEO - answer-engine (GEO) - reputation management - modern site &amp; 3D tours</text>
  <text x="44" y="{BY+104}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}">Lease Faster</text>
  <text x="44" y="{BY+122}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">24/7 AI leasing assistant - speed-to-lead nurture - online application &amp; payments - document intelligence</text>
  <text x="44" y="{BY+150}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}">Keep &amp; Grow</text>
  <text x="44" y="{BY+168}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">resident-experience assistant - renewal &amp; retention automation - transparent, itemized deposits</text>
  <text x="44" y="{BY+196}" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">AI never sets rents and never makes the accept/deny decision - a person owns pricing and screening.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" width="900" height="540" role="img">
  {marker}{title}{demand}{conns}{label}{stages}{arrows}{retention}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - PERSONA MATRIX (900 x 600)
# X = Acquisition Volume / Velocity ; Y = Resident Lifetime Value
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, vol, value, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("RELO",  "Relocating Professional", 78, 64, BLUE,   WHITE, 30, 0,  52, "middle"),
        ("MOVE",  "Move-Up / Right-Sizing",  56, 50, TEAL,   DARK,  26, -34, 2, "end"),
        ("RENEW", "Renewal-Risk Resident",   28, 90, ORANGE, DARK,  32, 0, -44, "middle"),
        ("LIFE",  "Lifestyle / Amenity",     70, 42, GOLD,   DARK,  24, 34,  4, "start"),
        ("CORP",  "Corporate / Mid-Term",    26, 38, DARK,   WHITE, 20, 0,  40, "middle"),
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
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">KEEP-FIRST (RETENTION)</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / TOP-OF-FUNNEL</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">EMERGING / NICHE</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Relocating Professional</text>
  <circle cx="360" cy="557" r="7" fill="{TEAL}"/>   <text x="372" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Move-Up / Right-Sizing</text>
  <circle cx="620" cy="557" r="7" fill="{ORANGE}"/> <text x="632" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Renewal-Risk Resident</text>
  <circle cx="84"  cy="581" r="7" fill="{GOLD}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Lifestyle / Amenity Renter</text>
  <circle cx="360" cy="581" r="7" fill="{DARK}"/>   <text x="372" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Corporate / Mid-Term (emerging)</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Aventine Renter - Acquisition Volume x Resident Lifetime Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The highest-value resident is the one you already have - retention is the cheapest lease.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Resident Lifetime Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Acquisition Volume / Velocity -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)
# X = Operator Scale / Resources ; Y = AI & Digital-Leasing Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, ai, color, r, ldx, ldy, anchor)
    C = [
        ("The Aventine",   32, 14, ORANGE, 30, 46,  6, "start"),
        ("Irvine Co.",     92, 90, DARK,   20, 0, -28, "middle"),
        ("Greystar",       88, 80, BLUE,   18, 30,  2, "start"),
        ("AvalonBay",      82, 82, TEAL,   16, -26, -16, "end"),
        ("Shea",           66, 74, TEAL,   16, -26, 2, "end"),
        ("Hanover",        58, 70, GOLD,   14, 0,  30, "middle"),
        ("FPI (Serrano)",  54, 42, GREY,   14, 26,  2, "start"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "The Aventine" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(32), Y(14); tx, ty = X(32), Y(78)
    move = f"""
  <line x1="{sx}" y1="{sy-34}" x2="{tx}" y2="{ty+18}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+18}" y="{ty+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">The Aventine's move</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">NATIONAL SCALE + AI (THE REITs)</text>
  <text x="{X(24)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">INDEPENDENT SCALE + INSTITUTIONAL-GRADE AI</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">BIG, DIGITALLY AVERAGE</text>
  <text x="{X(24)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">INDEPENDENT, UNDER-AUTOMATED</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Operator Scale x AI &amp; Digital-Leasing Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The institutional operators run 24/7 AI leasing tech; the Aventine does not. The top-left corner is empty.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">AI &amp; Digital-Leasing Maturity -&gt;</text>
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND &amp; CONVERT</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">be the community renters find first</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">LEASE FASTER</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">win on speed-to-lead, 24/7</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">KEEP &amp; GROW</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">retain residents, scale the portfolio</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    found = (
        arch_card(20, 136, 256, 88, BLUE, "Local SEO + Map Pack",
                  "Rank for the searches renters actually make for Aliso Viejo apartments.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Answer-Engine (GEO)",
                    "Be the cited community in Google AI, ChatGPT, and Perplexity.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Reputation Management",
                    "Lift the rating with AI-assisted review requests and replies.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "Modern Site + 3D Tours",
                    "A conversion-ready site with virtual tours and clear calls to action.", "My Dev", DARK)
    )
    faster = (
        arch_card(320, 136, 256, 88, ORANGE, "24/7 AI Leasing Assistant",
                  "Answer every prospect instantly by chat and text - disclosed as a bot.", "My Dev", DARK)
        + arch_card(320, 236, 256, 88, ORANGE, "Speed-to-Lead Nurture",
                    "Instant follow-up and self-service tour booking, day or night.", "Lead Gen", BLUE)
        + arch_card(320, 336, 256, 88, ORANGE, "Online Application + Payments",
                    "Replace the PDF: apply, screen, pay, and sign online.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "Document Intelligence",
                    "Auto-process applications, leases, and move-in inspections.", "My AI", TEAL)
    )
    keep = (
        arch_card(620, 136, 256, 88, TEAL, "Resident-Experience Assistant",
                  "Maintenance intake, status updates, and FAQs around the clock.", "My Dev", DARK)
        + arch_card(620, 236, 256, 88, TEAL, "Renewal & Retention Automation",
                    "Proactive renewal outreach and resident-sentiment monitoring.", "My AI", TEAL)
        + arch_card(620, 336, 256, 88, TEAL, "Transparent Deposits",
                    "Itemized, document-backed move-out handling that ends disputes.", "My AI", TEAL)
        + arch_card(620, 436, 256, 88, TEAL, "Portfolio Replication",
                    "Deploy the same stack across all nine communities.", "My Dev", DARK)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">leads</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">residents</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The AI Growth Engine - Get Found &amp; Convert, Lease Faster, Keep &amp; Grow</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Demand capture on the left; the 24/7 leasing engine in the center; retention and portfolio scale on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My AI - My Dev - My Security. AI responds, schedules, drafts, and remembers - uniformly and disclosed as a bot. It never sets rents and never makes the accept/deny decision; a person owns pricing and screening.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {marker}{title}{headers}{bg}{found}{faster}{keep}{arrows}{note}
</svg>"""


# ============================================================================
# DIAGRAM 5 - 90/180/365 ROADMAP (900 x 392)
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">GET FOUND &amp; CAPTURE</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">BUILD &amp; LEASE FASTER</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">KEEP &amp; SCALE</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Site, SEO & Reputation",
                       "Modernize the site; launch local SEO and review management to lift the rating.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Speed-to-Lead Capture",
                         "Instant response, follow-up, and tour booking on every inquiry.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "AI Leasing Assistant",
                         "Stand up the 24/7, bot-disclosed leasing assistant; expansion build.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Online Application + Portal",
                         "Replace the PDF; apply, pay, and sign online; document intelligence.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Retention & Experience",
                         "Renewal automation, maintenance intake, and sentiment monitoring.", "My AI", TEAL)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Portfolio Roll-Out",
                         "Replicate the stack across the nine communities; ROI dashboard.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Occupancy, turnover &amp; retention targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The Aventine + Technijian growth program. Get found and convert, lease faster, keep and grow.</text>"""
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
    print("Generating AAVA diagrams (technijian-diagram skill, SVG)...")
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
