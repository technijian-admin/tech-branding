"""
generate-diagrams.py - SKYOC  Skyline Displays of Orange County (trade-show exhibit house)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

IMPORTANT esc() rule: box(), arch_card(), and milestone_card() run text through esc(),
so pass a LITERAL '&' to them (esc converts it to &amp;). In RAW <text> written here,
use '&amp;' directly.

Output:  Clients/SKYOC/diagrams/model.png         (Figure 02.0 - The dual growth engine)
         Clients/SKYOC/diagrams/personas.png      (Figure 05.0 - Opportunity Volume x Project/Account Value)
         Clients/SKYOC/diagrams/competitive.png   (Figure 06.0 - Fabrication Scale x AI & Measurement Maturity)
         Clients/SKYOC/diagrams/architecture.png  (Figure 10.0 - AI growth engine)
         Clients/SKYOC/diagrams/timeline.png      (Figure 12.0 - 90/180/270 roadmap)
Usage:   C:/Python314/python.exe Clients/SKYOC/generate-diagrams.py
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
# DIAGRAM 1 - THE DUAL GROWTH ENGINE (900 x 540)
# ============================================================================

def build_model_svg():
    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How an Exhibit House Wins in 2026 - Get Found, Win, Deliver, Re-book</text>
  <text x="40" y="55" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Two engines on one show floor: grow Skyline's own book, and resell the AI-enabled booth to its clients.</text>"""

    # Demand sources (4 boxes)
    DX = [20, 240, 460, 680]
    DW = 198
    demand = (
        box(DX[0], 74, DW, 46, OFF, LIGHT, "AI-SEARCH / AEO",   "Google AI, Perplexity",  DARK, GREY, 13)
        + box(DX[1], 74, DW, 46, OFF, LIGHT, "SHOW RFP / RFI",    "exhibitor proposals",   DARK, GREY, 13)
        + box(DX[2], 74, DW, 46, OFF, LIGHT, "REFERRAL / REPEAT", "past clients, word-of-mouth", DARK, GREY, 13)
        + box(DX[3], 74, DW, 46, OFF, LIGHT, "TARGETED OUTBOUND", "public exhibitor lists", DARK, GREY, 13)
    )
    label = f"""<text x="450" y="140" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{GREY}" text-anchor="middle">THE BOOTH-BUYING FUNNEL</text>"""
    conns = ""
    for dx in DX:
        cx = dx + DW // 2
        conns += f"""<line x1="{cx}" y1="120" x2="450" y2="150" stroke="#ADB5BD" stroke-width="1.2"/>"""

    # Funnel stages
    SX = [10, 158, 306, 454, 602, 750]
    SW, SH, SY = 130, 64, 158
    stages = (
        box(SX[0], SY, SW, SH, BLUE,   BLUE,   "DISCOVER",      "be found",         WHITE, "#C9E3F4", 13)
        + box(SX[1], SY, SW, SH, TEAL,   TEAL,   "QUALIFY",       "fit & budget",     DARK,  DARK,      13)
        + box(SX[2], SY, SW, SH, BLUE,   BLUE,   "DESIGN / QUOTE","concept & rate",   WHITE, "#C9E3F4", 13)
        + box(SX[3], SY, SW, SH, ORANGE, ORANGE, "WIN",           "the award",        DARK,  DARK,      13)
        + box(SX[4], SY, SW, SH, BLUE,   BLUE,   "DELIVER",       "build & show",     WHITE, "#C9E3F4", 13)
        + box(SX[5], SY, SW, SH, DARK,   DARK,   "RE-BOOK",       "next show",        WHITE, "#C9CDD6", 13)
    )
    marker = f"""<defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker>
    <marker id="ral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 Z" fill="{ORANGE}"/></marker></defs>"""
    arrows = ""
    for i in range(5):
        x1 = SX[i] + SW + 2
        x2 = SX[i + 1] - 2
        arrows += f"""<line x1="{x1}" y1="{SY+SH//2}" x2="{x2}" y2="{SY+SH//2}" stroke="{GREY}" stroke-width="2" marker-end="url(#fa)"/>"""

    loop_y = SY + SH + 30
    retention = f"""
  <line x1="{SX[5]+SW//2}" y1="{SY+SH+4}" x2="{SX[5]+SW//2}" y2="{loop_y}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4"/>
  <line x1="{SX[5]+SW//2}" y1="{loop_y}" x2="{SX[0]+SW//2}" y2="{loop_y}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4"/>
  <line x1="{SX[0]+SW//2}" y1="{loop_y}" x2="{SX[0]+SW//2}" y2="{SY+SH+4}" stroke="{ORANGE}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ral)"/>
  <rect x="316" y="{loop_y-11}" width="288" height="22" rx="11" fill="{WHITE}"/>
  <text x="460" y="{loop_y+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="middle">Re-book loop - win the next show without re-winning from scratch</text>"""

    # AI band
    BY = 315
    band = f"""
  <rect x="20" y="{BY}" width="858" height="210" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="20" y="{BY}" width="6" height="210" rx="3" fill="{BLUE}"/>
  <text x="44" y="{BY+26}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Where Technijian AI plugs in - two engines on one show floor</text>
  <text x="44" y="{BY+54}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}">Get Found &amp; Win the Project</text>
  <text x="44" y="{BY+72}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">AEO / AI-search authority - reputation &amp; reviews - targeted exhibitor-list outbound - AI RFP &amp; quote drafting</text>
  <text x="44" y="{BY+100}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}">Sell the AI-Enabled Booth (new resale line)</text>
  <text x="44" y="{BY+118}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">AI lead capture (3x paper conversion) - booth concierge / chatbot - post-show AI nurture - ROI measurement dashboard</text>
  <text x="44" y="{BY+146}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}">Keep &amp; Grow the Account</text>
  <text x="44" y="{BY+164}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">repeat-client &amp; re-book intelligence - 40 years of design knowledge, searchable - social before/after content - AI-layer attach across the client base</text>
  <text x="44" y="{BY+194}" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">AI assists capture, follow-up, and drafting. It never replaces the designer's craft or makes a consent / legal call - a person owns both.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" width="900" height="540" role="img">
  {marker}{title}{demand}{conns}{label}{stages}{arrows}{retention}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - PERSONA MATRIX (900 x 600)
# X = Opportunity Volume / Velocity ; Y = Project / Account Value
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, vol, value, color, txt_color, r, ldx, ldy, anchor)
    # 5 EVIDENCE-BASED personas (research-driven, NOT an RKE template) - see _research.md 08.5
    P = [
        ("ENT",  "Enterprise / Multi-Show Program", 32, 88, ORANGE, DARK,  28, 0,   46, "middle"),
        ("CORP", "Corporate Marketing / Event Mgr", 66, 62, BLUE,   WHITE, 28, 34,  4,  "start"),
        ("EXP",  "Experiential / Agency Partner",    50, 72, RED,    WHITE, 22, -32, 2,  "end"),
        ("INST", "Institutional / Cultural",         30, 44, PURPLE, WHITE, 20, 30,  2,  "start"),
        ("EMRG", "First-Time / Emerging Brand",      88, 30, TEAL,   DARK,  28, 0,   46, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH VALUE + HIGH VOLUME</text>
  <text x="{X(24)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">FOCUSED, HIGH-VALUE (RECURRING)</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / TOP-OF-FUNNEL</text>
  <text x="{X(24)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">EMERGING / NICHE</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Skyline OC Buyer - Opportunity Volume x Project &amp; Account Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Five buyer types - enterprise multi-show is highest-value; emerging brands feed the funnel; experiential/agency is the multiplier.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Project &amp; Account Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Opportunity Volume / Velocity -&gt;</text>
  {quad}{dots}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)
# X = Fabrication Scale / Breadth ; Y = AI & Measurement Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, ai, color, r, ldx, ldy, anchor)
    # 7 representative players plotted (full set of 10 is in the report's §06 table).
    C = [
        ("Skyline Displays OC",   44, 18, ORANGE, 26, 0,   48, "middle"),
        ("Skyline Corp (CMX)",    88, 70, BLUE,   20, 0,  -30, "middle"),
        ("Metro Exhibits",        80, 52, DARK,   18, 30,  -2, "start"),
        ("ProExhibits",           68, 44, TEAL,   16, 28,  -2, "start"),
        ("RCS Custom",            60, 34, BLUE,   15, 26,   2, "start"),
        ("Greve Co.",             52, 28, GREY,   15, 26,   2, "start"),
        ("Blazer Exhibits",       30, 42, TEAL,   14, -26,  2, "end"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "Skyline Displays OC" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(44), Y(18); tx, ty = X(40), Y(84)
    move = f"""
  <line x1="{sx}" y1="{sy-30}" x2="{tx}" y2="{ty+18}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+18}" y="{ty+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">Skyline's move</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">NATIONAL SCALE + AI</text>
  <text x="{X(24)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOCAL + INSTITUTIONAL AI</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">BIG, BOOTH-FIRST</text>
  <text x="{X(24)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOCAL, BOOTH-ONLY</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Fabrication Scale x AI &amp; Measurement Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Every local rival sells a booth plus logistics. None runs a managed AI engagement layer. The top is open.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">AI &amp; Measurement Maturity -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Fabrication Scale / Breadth -&gt;</text>
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND &amp; WIN</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">be the booth partner they find first</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">SELL THE AI-ENABLED BOOTH</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">a new high-margin resale line</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">KEEP &amp; GROW</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">re-book, attach, and replicate</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    found = (
        arch_card(20, 136, 256, 88, BLUE, "Answer-Engine (AEO)",
                  "Be cited by Google AI, ChatGPT, Perplexity for booth-design queries.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Reputation & Reviews",
                    "Consolidate and grow Google reviews; surface named-client proof.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Targeted Exhibitor-List Outbound",
                    "Reach companies already registered to exhibit at the next show.", "Lead Gen", ORANGE)
        + arch_card(20, 436, 256, 88, BLUE, "AI RFP & Quote Drafting",
                    "First concepts and rate-sheet quotes in hours, not days.", "My Dev", DARK)
    )
    sell = (
        arch_card(320, 136, 256, 88, ORANGE, "AI Lead Capture + Enrichment",
                  "Badge / card scan with enrichment - 3x the conversion of paper.", "My Dev", DARK)
        + arch_card(320, 236, 256, 88, ORANGE, "Booth Concierge / Chatbot",
                    "Answers attendees, qualifies, and books meetings on the floor.", "My Dev", DARK)
        + arch_card(320, 336, 256, 88, ORANGE, "Post-Show AI Nurture",
                    "Instant personalized follow-up and CRM sync - leads stay warm.", "My AI", TEAL)
        + arch_card(320, 436, 256, 88, ORANGE, "ROI Measurement Dashboard",
                    "Engagement, dwell, leads, pipeline - prove the booth's return.", "My AI", TEAL)
    )
    keep = (
        arch_card(620, 136, 256, 88, TEAL, "Repeat-Client Intelligence",
                  "Watch show calendars and re-book windows account by account.", "My AI", TEAL)
        + arch_card(620, 236, 256, 88, TEAL, "Design Knowledge Memory",
                    "Forty years of builds and graphics, searchable and reusable.", "My Dev", DARK)
        + arch_card(620, 336, 256, 88, TEAL, "Social Before / After Content",
                    "Turn show-floor builds into reels that win the next client.", "My SEO", BLUE)
        + arch_card(620, 436, 256, 88, TEAL, "AI-Booth Attach Expansion",
                    "Add the AI layer to every booth across the client base.", "My Dev", DARK)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">leads</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">results</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The AI Growth Engine - Get Found &amp; Win, Sell the AI Booth, Keep &amp; Grow</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Demand and the project win on the left; the new AI-booth resale line in the center; retention and attach-rate growth on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My AI - My Dev. AI assists capture, follow-up, and drafting. It never replaces the designer's craft or makes a consent / legal call - a person owns both.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {marker}{title}{headers}{bg}{found}{sell}{keep}{arrows}{note}
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">GET FOUND &amp; CAPTURE</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">BUILD THE AI BOOTH</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-270</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">HOLD &amp; SCALE</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "AEO + Reputation",
                       "Own AI-search for booth-design queries; grow reviews.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Capture & Targeted Outbound",
                         "Nurture the long cycle; reach next-show exhibitor lists.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "AI-Enabled Booth Platform",
                         "Capture + concierge + nurture + ROI dashboard to resell.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "RFP/Quote + Design Memory",
                         "Faster concepts and quotes; 40-yr design knowledge base.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Repeat & Attach Growth",
                         "Re-book intelligence; add the AI layer to every booth.", "My AI", TEAL)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Scale + Enterprise Value",
                         "Roll the AI line across clients; lift the dealer's value.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Project mix, win-rate baselines, and average project value calibrate after a 30-min discovery call. Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 270 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Skyline OC + Technijian. Get found and capture, build and resell the AI booth, hold and scale.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">
  {title}{phases}{bar}{cards}{note}
</svg>"""


# ============================================================================
# DIAGRAM 6 - SERVICE VALUE CHAIN (900 x 420)
# ============================================================================

def build_servicearch_svg():
    title = f"""
  <text x="20" y="30" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Skyline's Service Architecture - One Partner, the Whole Booth Lifecycle</text>
  <text x="20" y="51" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Design through re-book under one roof - and the three points where Technijian AI adds a layer.</text>"""

    SX = [20, 144, 268, 392, 516, 640, 764]
    SW, SH, SY = 116, 56, 76
    stages = (
        box(SX[0], SY, SW, SH, BLUE,   BLUE,   "DESIGN",   "concept",      WHITE, "#C9E3F4", 13)
        + box(SX[1], SY, SW, SH, TEAL,   TEAL,   "BUILD",    "fabricate",    DARK,  DARK,      13)
        + box(SX[2], SY, SW, SH, BLUE,   BLUE,   "GRAPHICS", "print",        WHITE, "#C9E3F4", 13)
        + box(SX[3], SY, SW, SH, ORANGE, ORANGE, "I&D",      "ship/install", DARK,  DARK,      13)
        + box(SX[4], SY, SW, SH, BLUE,   BLUE,   "SHOW",     "on-site",      WHITE, "#C9E3F4", 13)
        + box(SX[5], SY, SW, SH, DARK,   DARK,   "STORE",    "asset mgmt",   WHITE, "#C9CDD6", 13)
        + box(SX[6], SY, SW, SH, ORANGE, ORANGE, "RE-BOOK",  "next show",    DARK,  DARK,      13)
    )
    marker = f"""<defs><marker id="sa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker></defs>"""
    arrows = ""
    for i in range(6):
        x1 = SX[i] + SW + 1; x2 = SX[i + 1] - 1
        arrows += f"""<line x1="{x1}" y1="{SY+SH//2}" x2="{x2}" y2="{SY+SH//2}" stroke="{GREY}" stroke-width="1.8" marker-end="url(#sa)"/>"""

    band1 = f"""
  <rect x="20" y="152" width="860" height="58" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="34" y="176" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">SKYLINE'S SERVICE LINES</text>
  <text x="34" y="196" font-family="Segoe UI,Arial" font-size="11.5" fill="{GREY}">Custom Exhibits  -  Portable / Modular  -  Rental Program  -  Creative &amp; Graphics  -  Worldwide Show Services  -  45,000 sq ft Asset Management</text>"""

    band2 = f"""
  <rect x="20" y="224" width="860" height="158" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="20" y="224" width="6" height="158" rx="3" fill="{BLUE}"/>
  <text x="40" y="250" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Where Technijian AI Adds a Layer Across the Chain</text>
  <text x="40" y="280" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}">At DESIGN - Win the Project Faster</text>
  <text x="40" y="298" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">AI-assisted concepts and rate-sheet quotes in hours, not days - so Skyline wins more of the RFPs it is invited to bid.</text>
  <text x="40" y="324" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}">At SHOW - Sell the AI-Enabled Booth (the new resale line)</text>
  <text x="40" y="342" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">Lead capture &amp; enrichment - on-floor concierge - instant post-show nurture - an ROI dashboard that proves the booth's return.</text>
  <text x="40" y="368" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}">At RE-BOOK - Keep &amp; Grow the Account</text>
  <text x="488" y="368" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">re-book intelligence + 40 years of design knowledge, searchable.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 400" width="900" height="400" role="img">
  {marker}{title}{stages}{arrows}{band1}{band2}
</svg>"""


# -- RENDER --
async def render(page, html, output):
    await page.set_content(html, wait_until="networkidle")
    box_ = await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width": max(box_["w"], 900), "height": max(box_["h"], 100)})
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating SKYOC diagrams (technijian-diagram skill, SVG)...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        print("1/6  model.png");        await render(page, page_shell(build_model_svg()),       DIAGRAMS_DIR / "model.png")
        print("2/6  servicearch.png");  await render(page, page_shell(build_servicearch_svg()), DIAGRAMS_DIR / "servicearch.png")
        print("3/6  personas.png");     await render(page, page_shell(build_personas_svg()),    DIAGRAMS_DIR / "personas.png")
        print("4/6  competitive.png");  await render(page, page_shell(build_competitive_svg()), DIAGRAMS_DIR / "competitive.png")
        print("5/6  architecture.png"); await render(page, page_shell(build_arch_svg()),        DIAGRAMS_DIR / "architecture.png")
        print("6/6  timeline.png");     await render(page, page_shell(build_timeline_svg()),    DIAGRAMS_DIR / "timeline.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
