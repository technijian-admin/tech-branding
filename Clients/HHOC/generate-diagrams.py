"""
generate-diagrams.py — HHOC  Housing for Health Orange County (DBA Housing for Health California)
Renders 5 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients (only the timeline bar), solid fills, brand tokens.

Output:  Clients/HHOC/diagrams/model.png         (Figure 02.0 — CalAIM funding flow)
         Clients/HHOC/diagrams/personas.png      (Figure 06.0 — Stakeholder map)
         Clients/HHOC/diagrams/competitive.png    (Figure 07.0 — Scale x Data/AI maturity 2x2)
         Clients/HHOC/diagrams/architecture.png   (Figure 10.0 — AI engine)
         Clients/HHOC/diagrams/timeline.png       (Figure 12.0 — 90/180/365 roadmap)
Usage:   /c/Python314/python.exe Clients/HHOC/generate-diagrams.py
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
# DIAGRAM 1 - THE CALAIM FUNDING MODEL (900 x 520)
# Referral -> HHOC delivers ECM/CS to Member -> bills MCP -> MCP pays (leaky)
# ============================================================================

def build_model_svg():
    REFERRAL = (104, 86, 240, 92)
    MEMBER   = (556, 86, 240, 92)
    HHOC     = (330, 250, 240, 116)
    MCP      = (652, 262, 196, 92)

    boxes = (
        box(*REFERRAL, WHITE, TEAL,   "REFERRAL SOURCE", "hospital - county CES - MCP", DARK, GREY)
        + box(*MEMBER, WHITE, ORANGE, "MEDI-CAL MEMBER", "complex / experiencing homelessness", DARK, GREY)
        + box(*HHOC,   DARK,  DARK,   "HOUSING FOR HEALTH", "delivers ECM + housing supports", WHITE, "#C9CDD6", 16)
        + box(*MCP,    WHITE, BLUE,   "MEDI-CAL PLAN", "CalOptima - Kaiser ECM", DARK, GREY, 13)
    )

    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{DARK}"/>
      </marker>
      <marker id="aro" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/>
      </marker>
    </defs>"""

    # Referral -> HHOC (refers member)
    a1 = f"""
  <line x1="244" y1="178" x2="372" y2="250" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="250" y="222" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{TEAL}" text-anchor="start">(1) refers member</text>"""

    # HHOC -> Member (delivers services)
    a2 = f"""
  <line x1="540" y1="250" x2="648" y2="180" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="566" y="216" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}" text-anchor="start">(2) delivers ECM + housing</text>"""

    # HHOC -> MCP (bills)
    a3 = f"""
  <line x1="570" y1="292" x2="648" y2="292" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="609" y="284" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{DARK}" text-anchor="middle">(3) bills</text>"""

    # MCP -> HHOC (pays - slow/denials) - the leaky step, highlighted orange
    a4 = f"""
  <line x1="648" y1="326" x2="572" y2="326" stroke="{ORANGE}" stroke-width="2.5" marker-end="url(#aro)"/>
  <text x="610" y="344" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{ORANGE}" text-anchor="middle">(4) pays - slow / denials</text>"""

    title = f"""
  <text x="48" y="38" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The CalAIM Funding Model - How Housing for Health Gets Paid</text>
  <text x="48" y="58" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A referral becomes an enrolled member; HHOC delivers ECM and housing supports, bills the Medi-Cal plan, and gets paid.</text>"""

    note = f"""
  <text x="450" y="392" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle" font-style="italic">Step 4 is where revenue leaks - slow-pay and denials on anything that is not a clean claim. HHOC also supports partner CBOs.</text>"""

    band = f"""
  <rect x="48" y="414" width="804" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="48" y="414" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="68" y="438" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in (HIPAA-safe)</text>
  <text x="68" y="460" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">clean claims + denial recovery  -  documentation &amp; encounters  -  referral intake &amp; eligibility  -  caseload optimization  -  audit-readiness</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520" role="img">
  {marker}{title}{boxes}{a1}{a2}{a3}{a4}{note}{band}
</svg>"""


# ============================================================================
# DIAGRAM 2 - STAKEHOLDER MAP (900 x 600)
# X = Influence on Funding & Sustainability ; Y = Engagement Priority
# ============================================================================

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (key, label, v, m, color, txt_color, r, ldx, ldy, anchor)
    P = [
        ("MCP",  "Medi-Cal Plan (CalOptima)", 90, 90, DARK,   WHITE, 30, 0,  -40, "middle"),
        ("MBR",  "Medi-Cal Member",           78, 84, ORANGE, DARK,  30, 0,   50, "middle"),
        ("REF",  "Referral Source",           52, 78, TEAL,   DARK,  26, -36,  4, "end"),
        ("CM",   "Care Manager",              66, 70, GOLD,   DARK,  24, 30,   4, "start"),
        ("CBO",  "Partner CBO",               40, 58, GREEN,  WHITE, 24, 0,  -36, "middle"),
        ("FND",  "Funder / Foundation",       36, 44, BLUE,   WHITE, 22, 0,   40, "middle"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR RELATIONSHIPS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">STRATEGIC / PIPELINE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">TRANSACTIONAL</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">SUPPLEMENTAL</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{DARK}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Medi-Cal Managed Care Plan (the payer)</text>
  <circle cx="430" cy="557" r="7" fill="{ORANGE}"/> <text x="442" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Medi-Cal Member (served)</text>
  <circle cx="700" cy="557" r="7" fill="{TEAL}"/>   <text x="712" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Referral Source</text>
  <circle cx="84"  cy="581" r="7" fill="{GOLD}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Care Manager (internal capacity)</text>
  <circle cx="360" cy="581" r="7" fill="{GREEN}"/>  <text x="372" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Partner CBO (network play)</text>
  <circle cx="640" cy="581" r="7" fill="{BLUE}"/>   <text x="652" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Funder / Foundation</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Stakeholder Map - Influence on Funding x Engagement Priority</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">HHOC's growth depends on a finite, named set of payers and partners - not a broad consumer market.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Engagement Priority -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Influence on Funding &amp; Sustainability -&gt;</text>
  {quad}{dots}{legend}
</svg>"""


# ============================================================================
# DIAGRAM 3 - PEER POSITIONING 2x2 (900 x 600)
# X = Scale / Reach ; Y = Data & AI Maturity
# ============================================================================

def build_competitive_svg():
    def X(s): return round((80 + s / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)

    # (label, scale, maturity, color, r, ldx, ldy, anchor)
    C = [
        ("HHOC",              24, 28, ORANGE, 28, 0,  48, "middle"),
        ("Illumination Fdn",  66, 80, BLUE,   22, 0, -32, "middle"),
        ("Brilliant Corners", 86, 86, TEAL,   22, 0, -32, "middle"),
        ("HealthRIGHT 360",   80, 62, TEAL,   18, 30,  4, "start"),
        ("PATH",              78, 34, GREY,   20, 0,  36, "middle"),
        ("Mercy House",       46, 24, GREY,   16, 0,  34, "middle"),
    ]
    dots = ""
    for label, s, m, color, r, ldx, ldy, anc in C:
        cx, cy = X(s), Y(m); lx, ly = cx + ldx, cy + ldy
        ring = f"""<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>""" if label == "HHOC" else ""
        dots += f"""{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    sx, sy = X(24), Y(28); tx, ty = X(56), Y(66)
    move = f"""
  <line x1="{sx+30}" y1="{sy-20}" x2="{tx-16}" y2="{ty+14}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="{sx+34}" y="{sy-30}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">HHOC's move: out-modernize on data + AI</text>"""
    marker = f"""<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""

    quad = f"""
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE + DATA LEADERS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DATA-FORWARD, SMALLER</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LARGE, OPERATIONS-HEAVY</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">EMERGING</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Peer Positioning - Scale / Reach x Data &amp; AI Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">HHOC can't out-scale the leaders - but it can out-modernize the operations-heavy peers, which is what wins MCP contracts.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Data &amp; AI Maturity -&gt;</text>
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">CAPTURE REVENUE</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">collect what's already earned</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">SERVE MORE PEOPLE</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">throughput + faster placements</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}"   rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN &amp; COMPLY</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">contracts, grants, compliance</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    capture = (
        arch_card(20, 136, 256, 88, BLUE, "Claims + Billing Automation",
                  "Clean-claim generation, eligibility / authorization checks, payment-aging dashboards.", "My Dev", DARK)
        + arch_card(20, 236, 256, 88, BLUE, "Documentation + Encounters",
                    "Turn caseworker notes into compliant encounter records; flag gaps before the claim.", "My Dev", DARK)
        + arch_card(20, 336, 256, 88, BLUE, "Denial Detection + Resubmit",
                    "Catch denials early and auto-assemble corrected resubmissions - recover earned revenue.", "My AI", TEAL)
        + arch_card(20, 436, 256, 88, BLUE, "Caseload + Margin Optimization",
                    "Staff to the rate-baked caseload ratios so PMPM revenue covers cost-to-serve.", "My AI", TEAL)
    )
    serve = (
        arch_card(320, 136, 256, 88, ORANGE, "Referral Intake + Eligibility",
                  "Ingest hospital / county / MCP referrals and ADT feeds; auto-screen eligibility.", "My Dev", DARK)
        + arch_card(320, 236, 256, 88, ORANGE, "Care-Coordination Copilot",
                    "Summarize member history across systems for the lead care manager (HIPAA-safe).", "My AI", TEAL)
        + arch_card(320, 336, 256, 88, ORANGE, "Client-Housing Matching",
                    "Match members to units / landlords - bias-audited for fair-housing compliance.", "My AI", TEAL)
        + arch_card(320, 436, 256, 88, ORANGE, "Multilingual Member Comms",
                    "Reminders, consent explanations, and check-ins in members' languages.", "My AI", TEAL)
    )
    win = (
        arch_card(620, 136, 256, 88, TEAL, "MCP / County Account Intel",
                  "Track which plans offer which supports, in which counties, and when RFPs drop.", "My AI", TEAL)
        + arch_card(620, 236, 256, 88, TEAL, "Outcomes + Impact Reporting",
                    "Auto-generate the MCP, funder, and 990 reports that win renewals and grants.", "My AI", TEAL)
        + arch_card(620, 336, 256, 88, TEAL, "HIPAA + 42 CFR Part 2",
                    "The required security program and SUD-record consent (Feb 2026 deadline).", "My Security", BLUE)
        + arch_card(620, 436, 256, 88, TEAL, "Audit-Readiness Monitoring",
                    "Continuously check that documentation supports every claim - prevent clawbacks.", "My AI", TEAL)
    )
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Housing for Health AI Engine - Capture More, Serve More, Win &amp; Comply</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Collect the Medi-Cal revenue already earned (left), increase throughput (center), and win contracts and stay compliant (right).</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My Dev - My AI - My Security - My SEO. Every AI touching client data is HIPAA-safe (BAA, private endpoints, no PHI to public models, human-in-the-loop); matching is bias-audited; billing is reviewed, never autonomous.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{capture}{serve}{win}{note}
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
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; WIN</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "HIPAA + Part 2 Readiness",
                       "BAA architecture, Part 2 consent (Feb 2026), baseline denials, site fix.", "My Security", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Capture Pilot",
                         "Claims / billing + documentation automation; denial detection live.", "My Dev", DARK)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Caseload + Throughput",
                         "Optimize caseloads to the rate ratios; referral intake; serve more.", "My AI", TEAL)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Outcomes Engine",
                         "MCP / funder / 990 outcomes reporting + dashboards that win renewals.", "My AI", TEAL)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Account Intel + Grants",
                         "MCP / county targeting + RFP / grant discovery; expansion pipeline.", "My AI", TEAL)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Optimize + (opt.) Network",
                         "Audit-readiness; ROI dashboard; optional provider-network platform.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Revenue-capture, caseload &amp; outcome targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Housing for Health - Technijian program. HIPAA-safe foundation, capture earned revenue, then scale and win.</text>"""
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
    print("Generating HHOC diagrams (technijian-diagram skill, SVG)...")
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
