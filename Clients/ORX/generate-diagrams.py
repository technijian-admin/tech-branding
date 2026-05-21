"""
generate-diagrams.py — ORX OrthoKinetix (powered by OrthoXpress)
Renders 4 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, no node gradients, solid fills, brand tokens.

Output:  Clients/ORX/diagrams/stockbill.png    (Figure 03.0 — Stock & Bill model)
         Clients/ORX/diagrams/personas.png     (Figure 06.0 — Volume x Margin)
         Clients/ORX/diagrams/architecture.png  (Figure 09.0 — AI growth engine)
         Clients/ORX/diagrams/timeline.png      (Figure 11.0 — 90/180/365 roadmap)
Usage:   python Clients/ORX/generate-diagrams.py
"""

import asyncio
import pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

# ── Brand tokens (mirror assets/brand-tokens.json) ──────────────────────────
BLUE   = "#006DB6"   # Core Blue   — primary nodes, axes
ORANGE = "#F67D4B"   # Core Orange — highlight, CTAs
TEAL   = "#1EAAC8"   # Teal        — secondary nodes
DARK   = "#1A1A2E"   # Dark Charcoal
GREY   = "#59595B"   # Body text, axis labels
LIGHT  = "#E9ECEF"   # Gridlines, neutral fills
OFF    = "#F8F9FA"   # Light backgrounds
WHITE  = "#FFFFFF"
GOLD   = "#C9922A"   # Gold — patient/recurring persona
PURPLE = "#7B2D8B"   # Purple — reserve
GREEN  = "#28A745"   # Pass / reimburse


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


# ═════════════════════════════════════════════════════════════════════════════
# DIAGRAM 1 — STOCK & BILL BUSINESS MODEL (900 × 500)
# Three-party B2B2C flow: Provider Office  ──dispenses──  Patient
#                                   ▲                         ▲
#                          ① stocks │            ③ billing/   │
#                                   │             follow-up    │
#                            [ ORTHOKINETIX hub ] ⇄ ② bill / ④ reimburse ⇄ [ Payer ]
# ═════════════════════════════════════════════════════════════════════════════

def box(x, y, w, h, fill, stroke, title, subtitle, title_color, sub_color, title_size=15):
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


def build_stockbill_svg():
    # Top tier — point of care
    PROV = (104, 86, 240, 92)     # Provider office  (teal)
    PAT  = (556, 86, 240, 92)     # Patient          (orange)
    # Center hub
    HUB  = (330, 250, 240, 116)   # OrthoKinetix     (dark)
    PAY  = (640, 262, 208, 92)    # Payer            (blue)

    boxes = (
        box(*PROV, WHITE, TEAL,  "PROVIDER OFFICE", "Ortho · surgery center · PT/pain", DARK, GREY)
        + box(*PAT,  WHITE, ORANGE, "PATIENT", "Receives device in-visit", DARK, GREY)
        + box(*HUB,  DARK,  DARK,  "ORTHOKINETIX", "Stocks · bills · follows up", WHITE, "#C9CDd6", 17)
        + box(*PAY,  WHITE, BLUE,  "PAYER", "Medicare · commercial · work comp", DARK, GREY)
    )

    marker = f"""<defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{DARK}"/>
      </marker>
      <marker id="arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="{GREEN}"/>
      </marker>
    </defs>"""

    # Arrow ⓪ Provider -> Patient  (dispense, top)
    a0 = f"""
  <line x1="344" y1="132" x2="552" y2="132" stroke="{TEAL}" stroke-width="2.5" marker-end="url(#ar)"/>
  <rect x="372" y="100" width="152" height="22" rx="11" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="448" y="115" font-family="Segoe UI,Arial" font-size="11" font-weight="600"
        fill="{DARK}" text-anchor="middle">dispenses device</text>"""

    # Arrow ① Hub -> Provider  (stocks, up-left) — label lifted clear of the line
    a1 = f"""
  <line x1="372" y1="250" x2="252" y2="182" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="366" y="204" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}" text-anchor="end">① stocks &amp; restocks</text>"""

    # Arrow ③ Hub -> Patient  (billing/follow-up, up-right) — label lifted clear of the line
    a3 = f"""
  <line x1="528" y1="250" x2="652" y2="182" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="534" y="204" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}" text-anchor="start">③ billing + follow-up</text>"""

    # Arrow ② Hub -> Payer  (bills insurance)
    a2 = f"""
  <line x1="570" y1="292" x2="636" y2="292" stroke="{DARK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <text x="603" y="285" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{DARK}" text-anchor="middle">② bills</text>"""

    # Arrow ④ Payer -> Hub  (reimburses, return below)
    a4 = f"""
  <line x1="636" y1="326" x2="572" y2="326" stroke="{GREEN}" stroke-width="2.5" marker-end="url(#arg)"/>
  <text x="603" y="344" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{GREEN}" text-anchor="middle">④ reimburses</text>"""

    title = f"""
  <text x="48" y="38" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Stock &amp; Bill Model — One Transaction, Three Parties</text>
  <text x="48" y="58" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">OrthoKinetix is the operator in the middle: it stocks the provider, dispenses to the patient, and bills the payer.</text>"""

    # AI acceleration band
    band = f"""
  <rect x="48" y="408" width="804" height="64" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="48" y="408" width="6" height="64" rx="3" fill="{ORANGE}"/>
  <text x="68" y="432" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI accelerates every step</text>
  <text x="68" y="454" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">instant eligibility &amp; co-pay  ·  physician notes &#8594; prior-auth packet  ·  denial prevention &amp; auto-appeal  ·  inventory forecasting per site</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">
  {marker}{title}{boxes}{a0}{a1}{a3}{a2}{a4}{band}
</svg>"""


# ═════════════════════════════════════════════════════════════════════════════
# DIAGRAM 2 — CUSTOMER SEGMENT MATRIX  Volume × Margin (900 × 600)
# X = Account Volume (Low->High) 0..100 : X(v)=80 + v/100*760
# Y = Margin / Strategic Value (Low->High) 0..100 : Y(m)=500 - m/100*440
# ═════════════════════════════════════════════════════════════════════════════

def build_personas_svg():
    def X(v): return round((80 + v / 100 * 760) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4

    QVX = X(50)   # vertical quadrant divider
    QHY = Y(50)   # horizontal quadrant divider

    # personas: (key, label, v, m, color, txt_color, r, label_dx, label_dy, anchor)
    P = [
        ("ORTHO", "Surgeon / Practice", 78, 82, BLUE,   WHITE, 32, 0,  -44, "middle"),
        ("HOSP",  "Hospital / Surg-Ctr", 50, 90, ORANGE, DARK,  28, 0,  -40, "middle"),
        ("PAIN",  "PT / Pain Clinic",    72, 54, TEAL,   DARK,  28, 0,   46, "middle"),
        ("WC",    "WC Case Mgr",         36, 78, DARK,   WHITE, 26, -38,  4, "end"),
        ("PAT",   "Patient Reorders",    86, 26, GOLD,   DARK,  28, 0,   46, "middle"),
    ]

    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m)
        lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""

    quad_labels = f"""
  <text x="{X(75)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR ACCOUNTS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE NICHE</text>
  <text x="{X(75)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / RECURRING</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">OPPORTUNISTIC</text>"""

    legend = f"""
  <circle cx="84"  cy="557" r="7" fill="{BLUE}"/>   <text x="96"  y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Surgeon / Practice Admin</text>
  <circle cx="300" cy="557" r="7" fill="{ORANGE}"/> <text x="312" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Hospital / Surgery Center</text>
  <circle cx="540" cy="557" r="7" fill="{TEAL}"/>   <text x="552" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">PT / Pain Clinic</text>
  <circle cx="84"  cy="581" r="7" fill="{DARK}"/>   <text x="96"  y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Workers' Comp Case Manager</text>
  <circle cx="300" cy="581" r="7" fill="{GOLD}"/>   <text x="312" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Patient (reorders / recurring)</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Customer Segment Matrix — Account Volume × Margin / Strategic Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">OrthoKinetix buyers (B2B) and the patient (B2C). Bubble size &#8733; relative revenue contribution.</text>

  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <!-- quadrant dividers -->
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <!-- axes -->
  <line x1="80" y1="60"  x2="80"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <!-- axis arrows + titles -->
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Margin / Strategic Value &#8594;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Account Volume &#8594;</text>
  {quad_labels}
  {dots}
  {legend}
</svg>"""


# ═════════════════════════════════════════════════════════════════════════════
# DIAGRAM 3 — AI GROWTH ENGINE (900 × 560) — 3 columns × 4 cards
# ═════════════════════════════════════════════════════════════════════════════

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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">SEO + GEO</text>
  <rect x="316" y="76" width="264" height="48" fill="{DARK}"   rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">CAPTURE &amp; CONVERT</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9CDD6" text-anchor="middle">turn searchers into leads</text>
  <rect x="616" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">ACCOUNT-BASED OUTBOUND</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">named providers &amp; hospitals</text>"""
    bg = f"""
  <rect x="16"  y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>"""

    inbound = (
        arch_card(20, 136, 256, 88, BLUE, "Local SEO — Patient Demand",
                  "'knee brace covered by Medicare near me', CPM rental, lymphedema pump — map pack + organic.", "My SEO", BLUE)
        + arch_card(20, 236, 256, 88, BLUE, "Provider SEO",
                    "'stock and bill program California' + DME-partner queries practice admins search.", "My SEO", BLUE)
        + arch_card(20, 336, 256, 88, BLUE, "GEO — AI Answer Citations",
                    "Be the cited source in ChatGPT, Perplexity, Google AI Overviews & Gemini.", "My SEO", BLUE)
        + arch_card(20, 436, 256, 88, BLUE, "Authority Content + Schema",
                    "Coverage & how-to guides w/ FAQPage schema — fuel for both SEO and GEO.", "My SEO", BLUE)
    )
    core = (
        arch_card(320, 136, 256, 88, ORANGE, "Chat.AI Site Assistant",
                  "24/7 assistant answers coverage questions and captures patient & provider leads.", "Chat.AI", ORANGE)
        + arch_card(320, 236, 256, 88, ORANGE, "Conversion Landing Pages",
                    "Intent-matched pages: patient device pages + a provider Stock & Bill page.", "My Dev", DARK)
        + arch_card(320, 336, 256, 88, ORANGE, "Provider Consult Funnel",
                    "'Request a Stock & Bill consult' routed to the right rep instantly.", "My Dev", DARK)
        + arch_card(320, 436, 256, 88, ORANGE, "Lead Routing & Tracking",
                    "Source-tagged leads to CRM — know which queries actually convert.", "My Dev", DARK)
    )
    outbound = (
        arch_card(620, 136, 256, 88, TEAL, "My AI Lead Gen — Providers",
                  "Harvest named ortho / PT / surgery-center targets from public data (NPI & more).", "Lead Gen", TEAL)
        + arch_card(620, 236, 256, 88, TEAL, "Account Dossiers",
                    "Pre-visit intelligence on each named practice for the field team.", "My AI", TEAL)
        + arch_card(620, 336, 256, 88, TEAL, "Per-Account Outreach",
                    "Personalized sequences to named hospitals & surgery centers — depth over volume.", "Lead Gen", TEAL)
        + arch_card(620, 436, 256, 88, TEAL, "WC Case-Manager Channel",
                    "Make referrals effortless — instant status + docs drive repeat referrals.", "My Dev", DARK)
    )
    arrows = f"""
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">data</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">intel</text>"""
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">SEO + GEO + Lead Gen Growth Engine — Get Found, Capture, Convert</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Broad search demand (patients + providers) on the left and center; targeted named-account outreach on the right.</text>"""
    note = f"""
  <text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO · Chat.AI (already in your stack) · My Dev · My AI Lead Gen. Any AI touching PHI stays HIPAA-safe — BAA, no PHI to public models.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {marker}{title}{headers}{bg}{inbound}{core}{outbound}{arrows}{note}
</svg>"""


# ═════════════════════════════════════════════════════════════════════════════
# DIAGRAM 4 — 90/180/365 IMPLEMENTATION ROADMAP (900 × 392)
# ═════════════════════════════════════════════════════════════════════════════

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
  <text x="{P1_X+P1_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">DAYS 1–90</text>
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">FOUNDATION — SEO/GEO</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91–180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">DEMAND ENGINE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181–365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; OUTBOUND</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "SEO/GEO Foundation",
                       "Brand + URL fix. Keyword + GEO question map. Technical SEO + schema.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Capture Layer Live",
                         "Chat.AI site assistant + provider consult funnel + lead tracking.", "Chat.AI", ORANGE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Content & GEO Engine",
                         "Authority hub publishing; first rankings + AI-answer citations.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Account Intelligence Base",
                         "My AI Lead Gen harvests named provider/hospital targets; dossiers.", "Lead Gen", TEAL)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Account-Based Outreach",
                         "Per-practice sequences; reps supported. New Stock & Bill accounts.", "Lead Gen", ORANGE)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Optimize & Compound",
                         "Double down on converting queries. Recurring reorders. ROI dashboard.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Traffic, lead &amp; account targets calibrate after a 30-min discovery call (see the Questions section). Estimates shown are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day SEO · GEO · Lead Gen Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">OrthoKinetix — Technijian growth program. Get found, capture the demand, win named accounts.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">
  {title}{phases}{bar}{cards}{note}
</svg>"""


# ── RENDER ──────────────────────────────────────────────────────────────────
async def render(page, html, output):
    await page.set_content(html, wait_until="networkidle")
    box = await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width": max(box["w"], 900), "height": max(box["h"], 100)})
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating ORX diagrams (technijian-diagram skill, SVG)...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        print("1/4  stockbill.png");    await render(page, page_shell(build_stockbill_svg()),  DIAGRAMS_DIR / "stockbill.png")
        print("2/4  personas.png");     await render(page, page_shell(build_personas_svg()),   DIAGRAMS_DIR / "personas.png")
        print("3/4  architecture.png"); await render(page, page_shell(build_arch_svg()),       DIAGRAMS_DIR / "architecture.png")
        print("4/4  timeline.png");     await render(page, page_shell(build_timeline_svg()),   DIAGRAMS_DIR / "timeline.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
