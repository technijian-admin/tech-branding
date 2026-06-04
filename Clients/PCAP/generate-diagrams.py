"""
generate-diagrams.py - PCAP  Pet Care Plus (petcp.com)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, solid fills, brand tokens.

Output:  Clients/PCAP/diagrams/model.png         (Figure 02.0 - demand -> resort -> retention)
         Clients/PCAP/diagrams/personas.png      (Figure 06.0 - Frequency x Spend/LTV)
         Clients/PCAP/diagrams/competitive.png    (Figure 07.0 - Scale x Digital/AI maturity 2x2)
         Clients/PCAP/diagrams/architecture.png   (Figure 10.0 - AI engine: Get Found / Book Faster / Keep & Grow)
         Clients/PCAP/diagrams/timeline.png       (Figure 12.0 - 90/180/270 roadmap)
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
# DIAGRAM 1 - DEMAND -> RESORT -> RETENTION (900 x 520)
# ============================================================================

def build_model_svg():
    NEWO   = (104, 86, 240, 92)
    RETURN = (556, 86, 240, 92)
    PCAP   = (330, 250, 240, 116)
    LOYAL  = (652, 262, 196, 92)

    boxes = (
        box(*NEWO, WHITE, BLUE,   "NEW PET OWNERS", "West Loop & Chicago", DARK, GREY)
        + box(*RETURN, WHITE, ORANGE, "RETURNING REGULARS", "daycare / grooming / boarding", DARK, GREY)
        + box(*PCAP,  DARK,  DARK,   "PET CARE PLUS", "since 1998 - 24/7/365 - saltwater pool", WHITE, "#C9CDD6", 14)
        + box(*LOYAL, WHITE, TEAL, "LOYAL, RETURNING PETS", "rebook - refer - review", DARK, GREY, 12)
    )

    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{DARK}"/>
      </marker>
    </defs>"""

    a1 = f"""
  <line x1="244" y1="178" x2="372" y2="250" stroke="{BLUE}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="250" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}" text-anchor="start">(1) find via search - maps - reviews</text>"""

    a2 = f"""
  <line x1="640" y1="178" x2="528" y2="250" stroke="{ORANGE}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="650" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="end">(2) rebook the services they love</text>"""

    a3 = f"""
  <line x1="570" y1="300" x2="648" y2="300" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="609" y="291" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{DARK}" text-anchor="middle">(3) great care</text>"""

    # (retention is conveyed by NEW + RETURNING both feeding in and the LOYAL output box;
    #  an explicit loop arrow crossed the channel labels, so it is intentionally omitted)
    a4 = ""

    title = f"""
  <text x="48" y="38" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Pet Care Plus Wins &amp; Keeps Customers</text>
  <text x="48" y="58" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Local owners discover, book, and return across five services - anchored by assets no Chicago rival has.</text>"""

    note = f"""
  <text x="450" y="392" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle" font-style="italic">Five services, one resort: dog boarding - daycare - grooming - cat boarding - training (Prestige Dog Training).</text>"""

    band = f"""
  <rect x="48" y="414" width="804" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="48" y="414" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="68" y="438" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="68" y="460" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">answer-engine visibility  -  review velocity  -  instant booking + speed-to-lead  -  membership / Pool Club  -  photo updates</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {marker}{title}{boxes}{a1}{a2}{a3}{a4}{note}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - CUSTOMER MATRIX (900 x 600)  X = Visit Frequency ; Y = Spend / LTV
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, freq, ltv, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("DAY",  "Daycare Regular",        84, 80, ORANGE, DARK,  28, 0,   46, "middle"),
        ("PUP",  "New Puppy Parent",       54, 90, GREEN,  WHITE, 26, -34, -2, "end"),
        ("GRM",  "Grooming Loyalist",      60, 50, TEAL,   DARK,  24, 0,   42, "middle"),
        ("BRD",  "Traveling Boarder",      28, 72, BLUE,   WHITE, 26, 0,  -34, "middle"),
        ("CAT",  "Cat Owner",              26, 40, PURPLE, WHITE, 22, 0,   40, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR REGULARS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE / EPISODIC</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">FREQUENT / LOWER TICKET</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">OCCASIONAL</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{ORANGE}"/> <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Daycare Regular (recurring, high LTV)</text>
  <circle cx="430" cy="557" r="7" fill="{GREEN}"/>  <text x="442" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">New Puppy Parent (highest lifetime value)</text>
  <circle cx="700" cy="557" r="7" fill="{TEAL}"/>   <text x="712" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Grooming Loyalist</text>
  <circle cx="84"  cy="581" r="7" fill="{BLUE}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Traveling Boarder (episodic, high per-stay)</text>
  <circle cx="430" cy="581" r="7" fill="{PURPLE}"/> <text x="442" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Cat Owner (underserved niche)</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Customer Matrix - Visit Frequency x Spend / Lifetime Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Where each Pet Care Plus customer type sits - the daycare regular and the new puppy parent drive the most lifetime value.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Spend / Lifetime Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Visit Frequency -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - COMPETITIVE 2x2 (900 x 600)  X = Scale/Reach ; Y = Digital & AI Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, maturity, color, r, ldx, ldy, anchor)
    C = [
        ("Pet Care Plus",   36, 36, ORANGE, 28, 0,  48, "middle"),
        ("Tucker Pup's",    52, 82, BLUE,   22, 0, -32, "middle"),
        ("Wag Hotels",      88, 86, DARK,   22, 0, -32, "middle"),
        ("Found Chicago",   46, 60, GREEN,  18, -28, 2, "end"),
        ("Urban Pooch",     44, 52, TEAL,   16, 30,  4, "start"),
        ("K9 University",   40, 64, GOLD,   16, 0, -26, "middle"),
        ("PUPS Pet Club",   66, 70, PURPLE, 18, 0,  34, "middle"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "Pet Care Plus" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(36), Y(36); tx, ty = X(52), Y(70)
    move = f"""
  <line x1="{sx+28}" y1="{sy-18}" x2="{tx-14}" y2="{ty+14}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="{sx+30}" y="{sy-28}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">PCAP's move: AEO + reviews + instant booking + membership</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE + DIGITAL LEADERS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DIGITAL-FORWARD, SMALLER</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE, AVERAGE DIGITAL</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOCAL / EMERGING</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning - Scale / Reach x Digital &amp; AI Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Pet Care Plus can't out-scale Wag - but it can out-modernize on what local owners actually choose by, on assets rivals lack.</text>
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
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">local pet-owner demand</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">BOOK FASTER</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">convert demand you already pay for</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">KEEP &amp; GROW</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">retention flywheel</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    found = (
        arch_card(20, 136, 256, 88, BLUE, "Answer-Engine + Local SEO",
                  "Own 'dog boarding / daycare / grooming West Loop' in Google AI answers.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Review &amp; Reputation Engine",
                    "Automated post-stay review asks; close the volume gap vs Tucker Pup's.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "Pool / Cat / 24-7 Content",
                    "Market the saltwater pool, cat boarding, and 24/7 care nobody else does.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "PageSpeed + Technical SEO",
                    "Fix 31/100 mobile + 1,140 warnings - rank higher and convert more.", "My SEO", BLUE)
    )
    book = (
        arch_card(320, 136, 256, 88, ORANGE, "Instant Online Booking",
                  "Replace the 24-hour callback with real-time booking for new leads.", "My Dev", DARK)
        + arch_card(320, 236, 256, 88, ORANGE, "Speed-to-Lead + AI Front Desk",
                    "Text-back in seconds; AI answers hours, availability, vaccine rules 24/7.", "Lead Gen", ORANGE)
        + arch_card(320, 336, 256, 88, ORANGE, "Uncap High-Intent Ads",
                    "Free the budget-capped Branded + Grooming campaigns already converting.", "My SEO", BLUE)
        + arch_card(320, 436, 256, 88, ORANGE, "Photo Pup-Date Automation",
                    "Auto-send stay photos - the transparency premium owners pay for.", "My AI", TEAL)
    )
    grow = (
        arch_card(620, 136, 256, 88, TEAL, "Membership / Pool Club",
                  "Recurring daycare + pool membership no Chicago rival offers.", "My Dev", DARK)
        + arch_card(620, 236, 256, 88, TEAL, "Branded Booking + Webcam App",
                    "Match Wag's MyWag with a local, polished report-card app.", "My Dev", DARK)
        + arch_card(620, 336, 256, 88, TEAL, "Win-Back + Churn Model",
                    "Flag lapsing daycare regulars; automated re-engagement.", "My AI", TEAL)
        + arch_card(620, 436, 256, 88, TEAL, "Cross-Sell Journeys",
                    "Puppy -> training -> daycare -> grooming, automatically.", "My AI", TEAL)
    )
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Pet Care Plus AI Engine - Get Found, Book Faster, Keep &amp; Grow</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Capture local demand on the left, convert it faster in the center, and build the retention flywheel on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI Lead Gen - My Dev - My AI, built on the SEO + Google Ads foundation Technijian already runs for Pet Care Plus. AI augments the front desk and care team; it does not replace the people pets love.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{found}{book}{grow}{note}
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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">GROWTH</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-270</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; RETENTION</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "AEO + Technical SEO",
                       "Answer-engine + local pages; fix PageSpeed 31/100 + warnings.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Review Engine Live",
                         "Post-stay review asks; start closing the volume gap.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Instant Booking + Speed-to-Lead",
                         "Real-time booking for new leads; text-back in seconds.", "My Dev", DARK)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "AI Front Desk + Social",
                         "24/7 comms automation; pool + grooming short-form.", "My AI", TEAL)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Membership 'Pool Club'",
                         "Recurring daycare/pool program; branded booking app.", "My Dev", DARK)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Win-Back + Cross-Sell",
                         "Lapsing-regular re-engagement; puppy->daycare->grooming.", "My AI", TEAL)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* New-customer, booking-conversion &amp; membership targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are illustrative, not a quote.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 270 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Pet Care Plus - Technijian program. Build on the SEO foundation, convert demand faster, then grow retention.</text>"""
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
    print("Generating PCAP diagrams (technijian-diagram skill, SVG)...")
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
