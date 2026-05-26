"""
generate-diagrams.py - TALY  Talley and Associates, Inc.
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

IMPORTANT esc() rule: box(), arch_card(), and milestone_card() run text through esc(),
so pass a LITERAL '&' to them (esc converts it to &amp;). In RAW <text> written here,
use '&amp;' directly.

Output:  Clients/TALY/diagrams/model.png         (Figure 02.0 - Three pillars of practice)
         Clients/TALY/diagrams/personas.png      (Figure 05.0 - Engagement Volume x Strategic Value)
         Clients/TALY/diagrams/competitive.png    (Figure 06.0 - OC/MHP Specialization x Digital Authority)
         Clients/TALY/diagrams/architecture.png   (Figure 10.0 - AI growth engine)
         Clients/TALY/diagrams/timeline.png       (Figure 12.0 - 90/180/365 roadmap)
Usage:   /c/Python314/python.exe Clients/TALY/generate-diagrams.py
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
# DIAGRAM 1 - THREE PILLARS OF PRACTICE (900 x 520)
# ============================================================================

def serves_lines(x, w, y, lines):
    out = ""
    for i, ln in enumerate(lines):
        out += f"""
  <text x="{x+w//2}" y="{y + i*16}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">{ln}</text>"""
    return out


def build_model_svg():
    title = f"""
  <text x="48" y="38" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Three Pillars of Practice - One Set of Relationships</text>
  <text x="48" y="58" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Since 1981, Talley and Associates has served the same property-owner, housing, and commercial-real-estate universe across four counties.</text>"""

    # hub
    hub = box(300, 78, 300, 50, DARK, DARK,
              "TALLEY & ASSOCIATES", "Government Relations - Public Affairs - est. 1981",
              WHITE, "#C9CDD6", 16)

    # three pillars
    PX = [18, 314, 610]
    PW = 272
    pillars = (
        box(PX[0], 168, PW, 58, BLUE,   BLUE,   "GOVERNMENTAL RELATIONS", "& Local Land-Use Advocacy", WHITE, "#C9E3F4", 14)
        + box(PX[1], 168, PW, 58, ORANGE, ORANGE, "MOBILE-HOME-PARK", "Conversions & Closures", DARK, DARK, 14)
        + box(PX[2], 168, PW, 58, TEAL,   TEAL,   "ASSOCIATION & PAC", "Management", DARK, DARK, 14)
    )

    # connectors hub -> pillars
    conns = ""
    for cx in (PX[0]+PW//2, PX[1]+PW//2, PX[2]+PW//2):
        conns += f"""<line x1="450" y1="128" x2="{cx}" y2="168" stroke="#ADB5BD" stroke-width="1.5"/>"""

    # serves boxes
    serves = ""
    SY, SH = 250, 110
    for px in PX:
        serves += f"""<rect x="{px}" y="{SY}" width="{PW}" height="{SH}" rx="6" fill="{WHITE}" stroke="{LIGHT}" stroke-width="1.5"/>"""
    serves += f"""<rect x="{PX[0]}" y="{SY}" width="{PW}" height="4" rx="2" fill="{BLUE}"/>"""
    serves += f"""<rect x="{PX[1]}" y="{SY}" width="{PW}" height="4" rx="2" fill="{ORANGE}"/>"""
    serves += f"""<rect x="{PX[2]}" y="{SY}" width="{PW}" height="4" rx="2" fill="{TEAL}"/>"""
    serves += f"""<text x="{PX[0]+PW//2}" y="{SY+24}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}" text-anchor="middle">WHO IT SERVES</text>"""
    serves += f"""<text x="{PX[1]+PW//2}" y="{SY+24}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}" text-anchor="middle">WHO IT SERVES</text>"""
    serves += f"""<text x="{PX[2]+PW//2}" y="{SY+24}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}" text-anchor="middle">WHO IT SERVES</text>"""
    serves += serves_lines(PX[0], PW, SY+44, ["Developers, property owners", "&amp; businesses - entitlements,", "approvals &amp; property rights"])
    serves += serves_lines(PX[1], PW, SY+44, ["Park owners - the &#167;65863.7", "Conversion Impact Report,", "relocation &amp; the politics"])
    serves += serves_lines(PX[2], PW, SY+44, ["Trade-association boards", "&amp; PACs - MHET, CMPA,", "NAIOP, ULI, SIOR"])

    band = f"""
  <rect x="18" y="392" width="864" height="72" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="18" y="392" width="6" height="72" rx="3" fill="{ORANGE}"/>
  <text x="40" y="418" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="40" y="440" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">institutional-knowledge capture  -  legislative &amp; ~80-agenda monitoring  -  FPPC / PAC compliance  -  authority content  -  association operations</text>
  <text x="40" y="456" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">AI gives the team more reach, faster prep, and a memory that does not retire - it does not replace the relationships.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {title}{hub}{conns}{pillars}{serves}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - PERSONA MATRIX (900 x 600)
# X = Engagement Volume / Recurrence ; Y = Strategic Value to the Firm
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, vol, value, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("ASSN", "Trade-Association Board",  82, 82, TEAL,   DARK,  30, 0,  52, "middle"),
        ("MHP",  "Mobile-Home-Park Owner",   54, 90, ORANGE, DARK,  30, 0, -42, "middle"),
        ("DEV",  "Developer / Property Owner", 44, 68, BLUE,  WHITE, 28, -36, 2, "end"),
        ("PAC",  "Business + PAC / Coalition", 66, 48, GOLD,  DARK,  24, 36,  4, "start"),
        ("BOOK", "Existing Client Book",      84, 38, DARK,   WHITE, 24, 0,  44, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR RETAINERS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE / EPISODIC</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">RECURRING / VOLUME</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">OPPORTUNISTIC</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{TEAL}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Trade-Association Board (MHET, CMPA, NAIOP)</text>
  <circle cx="470" cy="557" r="7" fill="{ORANGE}"/> <text x="482" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Mobile-Home-Park Owner</text>
  <circle cx="730" cy="557" r="7" fill="{BLUE}"/>   <text x="742" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Developer / Owner</text>
  <circle cx="84"  cy="581" r="7" fill="{GOLD}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Business + PAC / Coalition</text>
  <circle cx="470" cy="581" r="7" fill="{DARK}"/>   <text x="482" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Existing Client Book (deepen)</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Talley Client - Engagement Volume x Strategic Value to the Firm</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A finite, nameable set of accounts - which is why this is account-based, not a marketing funnel.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Strategic Value to the Firm -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Engagement Volume / Recurrence -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)
# X = OC-Local / MHP-Land-Use Specialization ; Y = Digital & Content Authority
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, spec, digital, color, r, ldx, ldy, anchor)
    C = [
        ("Talley",         82, 12, ORANGE, 30, -48,  6, "end"),
        ("Curt Pringle",   68, 30, GREEN,  18, 30,  2, "start"),
        ("Cerrell",        22, 84, DARK,   18, 0, -28, "middle"),
        ("Englander K&A",  32, 78, BLUE,   18, 0, -28, "middle"),
        ("Townsend",       18, 70, TEAL,   16, -26, 2, "end"),
        ("Cal Strategies", 30, 62, TEAL,   16, 28,  2, "start"),
        ("Probolsky",      42, 70, GOLD,   16, 28,  2, "start"),
        ("Lew Edwards",    22, 50, GREY,   14, -24, 2, "end"),
        ("Renne",          16, 44, GREY,   14, 0,  32, "middle"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "Talley" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(82), Y(12); tx, ty = X(82), Y(80)
    move = f"""
  <line x1="{sx}" y1="{sy-34}" x2="{tx}" y2="{ty+22}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+18}" y="{ty+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">Talley's move</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SPECIALIST AUTHORITY, FOUND ONLINE</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">GENERALIST, STRONG ONLINE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DEEP SPECIALIST, INVISIBLE ONLINE</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LIMITED ON BOTH</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - OC / MHP Specialization x Digital &amp; Content Authority</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">The digitally strong firms are LA generalists; the OC land-use specialists are invisible online. The top-right corner is empty.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Digital &amp; Content Authority -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">OC-Local / MHP &amp; Land-Use Specialization -&gt;</text>
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET KNOWN</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">make 45 years of expertise findable</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">MONITOR &amp; MOBILIZE</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">account &amp; legislative intelligence</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">CAPTURE &amp; SCALE</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">knowledge + operations</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    known = (
        arch_card(20, 136, 256, 88, BLUE, "Modern Site + Niche Authority",
                  "Replace the Weebly site; publish the MHP and land-use explainers buyers actually search.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Answer-Engine (GEO) Optimization",
                    "Be the cited expert in Google AI, ChatGPT, and Perplexity for the niche.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Track-Record & Reputation Pages",
                    "Make the 100-plus client roster and the 45-year record visible and credible.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "Referral Reinforcement",
                    "Authority content the team shares to warm a referral before the first call.", "My AI", TEAL)
    )
    monitor = (
        arch_card(320, 136, 256, 88, ORANGE, "Legislative Monitor (Sacramento + FPPC)",
                  "Flag a bill that threatens a client, like SB 749, the week it moves.", "Lead Gen", BLUE)
        + arch_card(320, 236, 256, 88, ORANGE, "Multi-Jurisdiction Agenda Monitor",
                    "Track ~80 city and county agendas so no hearing or ordinance is missed.", "My Dev", DARK)
        + arch_card(320, 336, 256, 88, ORANGE, "Account Dossiers + Stakeholder Maps",
                    "Who sits on each council, how they vote, who to persuade - before the meeting.", "Lead Gen", BLUE)
        + arch_card(320, 436, 256, 88, ORANGE, "Position-Letter & Testimony Drafts",
                    "First-pass advocacy documents in minutes; the team finalizes and signs.", "My AI", TEAL)
    )
    capture = (
        arch_card(620, 136, 256, 88, TEAL, "Institutional-Knowledge Base",
                  "Query 45 years of relationships, park histories, and jurisdiction playbooks.", "My Dev", DARK)
        + arch_card(620, 236, 256, 88, TEAL, "FPPC / PAC Compliance Tracker",
                    "Multi-jurisdiction filing deadlines and accuracy QA; a human signs.", "My Dev", DARK)
        + arch_card(620, 336, 256, 88, TEAL, "Association-Ops Automation",
                    "Member comms, dues, events, and board reports for MHET and CMPA.", "My Dev", DARK)
        + arch_card(620, 436, 256, 88, TEAL, "Conversion Impact Report Drafting",
                    "First-pass CIRs and staff-report summaries - faster turnaround.", "My AI", TEAL)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">signals</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">memory</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The AI Growth Engine - Get Known, Monitor &amp; Mobilize, Capture &amp; Scale</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Authority on the left; account &amp; legislative intelligence in the center; knowledge and operations on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My AI - My Dev - My Security. AI monitors, drafts, and remembers - it does not lobby. The relationships, the calls to city hall, and the testimony at the dais stay with the team; a human reviews and signs every sworn filing.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {marker}{title}{headers}{bg}{known}{monitor}{capture}{arrows}{note}
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">FOUNDATION &amp; CAPTURE</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">MONITOR &amp; AUTHORITY</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; SUCCESSION</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Knowledge Base + Workshop",
                       "Stand up the secure knowledge base; capture relationships; leadership AI workshop.", "My AI", TEAL)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Site + Authority Foundation",
                         "Replace the Weebly site; first MHP and land-use explainers; set up GEO.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Legislative + Agenda Monitor",
                         "Monitor Sacramento, FPPC, and named-jurisdiction agendas; client trigger alerts.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Compliance Tracker + Content",
                         "Multi-jurisdiction FPPC / PAC filing tracker with QA; scale authority content.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Association Portal + Ops",
                         "Member comms, dues, events, board reports; document drafting in production.", "My Dev", DARK)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Scale + Succession",
                         "Knowledge base becomes a succession asset; account outreach; ROI dashboard.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Engagement, jurisdiction &amp; capacity targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Talley and Associates - Technijian growth program. Get known, monitor and mobilize, capture and scale.</text>"""
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
    print("Generating TALY diagrams (technijian-diagram skill, SVG)...")
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
