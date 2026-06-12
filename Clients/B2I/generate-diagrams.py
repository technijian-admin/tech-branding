"""
generate-diagrams.py - B2I / B2 Insurance Services (Redondo Beach CA benefits + P&C brokerage)
Renders 3 diagram PNGs via Playwright using HTML+SVG.
Follows technijian-diagram skill: SVG on 4px grid, >=11px node text, WCAG contrast,
no drop shadows, solid fills, brand tokens, only the timeline bar uses a gradient.

Output:  Clients/B2I/diagrams/personas.png      (Figure 04.0 - relationship volume x value quadrant)
         Clients/B2I/diagrams/architecture.png  (Figure 09.0 - 3-column AI engine + governance bar)
         Clients/B2I/diagrams/timeline.png      (Figure 12.0 - 90/180/365 renewal-calendar roadmap)
Usage:   py -3.12 Clients/B2I/generate-diagrams.py
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
GREEN  = "#28A745"
RED    = "#CC0000"
CHART  = "#8BC34A"


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


# ============================================================================
# DIAGRAM 1 - PERSONA QUADRANT (900 x 600)
# X: relationship count (few -> many)   Y: value per relationship (low -> high)
# ============================================================================

def persona_dot(cx, cy, color, num, label_lines, lx, ly, anchor="start"):
    lines = ""
    for i, ln in enumerate(label_lines):
        weight = "700" if i == 0 else "400"
        fill = DARK if i == 0 else GREY
        lines += f"""<text x="{lx}" y="{ly + i*15}" font-family="Segoe UI,Arial" font-size="12"
              font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{esc(ln)}</text>"""
    return f"""
  <circle cx="{cx}" cy="{cy}" r="17" fill="{color}"/>
  <text x="{cx}" y="{cy+5}" font-family="Segoe UI,Arial" font-size="14" font-weight="700"
        fill="{WHITE}" text-anchor="middle">{num}</text>
  {lines}"""


def build_personas_svg():
    # plot area
    PX, PY, PW, PH = 110, 90, 700, 400
    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Five Buyers, One Brokerage - Where the Value Concentrates</text>
  <text x="40" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Each buyer B2 serves today, placed by how many such relationships exist and what each is worth. Derived from B2's own site, content history, and review evidence.</text>"""

    frame = f"""
  <rect x="{PX}" y="{PY}" width="{PW}" height="{PH}" fill="{OFF}" stroke="{LIGHT}" stroke-width="1"/>
  <line x1="{PX+PW//2}" y1="{PY}" x2="{PX+PW//2}" y2="{PY+PH}" stroke="{LIGHT}" stroke-width="2"/>
  <line x1="{PX}" y1="{PY+PH//2}" x2="{PX+PW}" y2="{PY+PH//2}" stroke="{LIGHT}" stroke-width="2"/>
  <text x="{PX+PW//2}" y="{PY+PH+36}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{GREY}" text-anchor="middle">RELATIONSHIP COUNT  (few → many)</text>
  <text x="58" y="{PY+PH//2}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{GREY}" text-anchor="middle" transform="rotate(-90 58 {PY+PH//2})">VALUE PER RELATIONSHIP  (low → high)</text>"""

    quad_labels = f"""
  <text x="{PX+12}" y="{PY+22}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6">FEW + HIGH VALUE - the ABM front</text>
  <text x="{PX+PW-12}" y="{PY+22}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="end">MANY + HIGH VALUE</text>
  <text x="{PX+12}" y="{PY+PH-12}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6">FEW + LOWER VALUE</text>
  <text x="{PX+PW-12}" y="{PY+PH-12}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="end">MANY + LOWER VALUE - the capture front</text>"""

    dots = (
        # 4 Owner-Crossover Household: few, highest LTV
        persona_dot(200, 155, CHART, "4", ["The Owner-Crossover Household", "business + personal + retirement"], 227, 150)
        # 1 Growth-Minded Owner: few, high value
        + persona_dot(245, 215, BLUE, "1", ["The Growth-Minded Owner", "mid-market CEO - BOR + consulting buyer"], 272, 210)
        # 2 Renewal-Shocked CFO: few-mid, high value
        + persona_dot(350, 268, TEAL, "2", ["The Renewal-Shocked CFO", "staring at a +10-13% 2026 renewal"], 377, 263)
        # 3 HR Leader Under Siege: mid, mid-high value (influencer)
        + persona_dot(480, 200, ORANGE, "3", ["The HR Leader Under Siege", "compliance + admin relief seeker"], 507, 195)
        # 5 FAIR-Plan Refugee: many, lower value each
        + persona_dot(645, 390, RED, "5", ["The FAIR-Plan Refugee", "South Bay homeowner, non-renewed", "or facing the +35.8% FAIR increase"], 672, 385)
    )

    note = f"""
  <text x="40" y="{PY+PH+62}" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">Buyers 1-4 are won account-by-account through relationships and Broker-of-Record decisions; buyer 5 arrives in volume</text>
  <text x="40" y="{PY+PH+78}" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">through local search and referral - two different growth engines, covered in Section 09.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {title}{frame}{quad_labels}{dots}{note}
</svg>"""


# ============================================================================
# DIAGRAM 2 - AI GROWTH ENGINE ARCHITECTURE (940 x 660)
# 3 columns: INBOUND / OUTBOUND (ABM) / INTERNAL + governance boundary bar
# ============================================================================

def arch_card(x, y, w, h, accent, title, lines):
    body = ""
    for i, ln in enumerate(lines):
        body += f"""<text x="{x+14}" y="{y+52+i*17}" font-family="Segoe UI,Arial" font-size="11.5"
              fill="{DARK}">{esc(ln)}</text>"""
    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{WHITE}" stroke="{LIGHT}" stroke-width="1.5"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}"/>
  <text x="{x+14}" y="{y+28}" font-family="Segoe UI,Arial" font-size="13" font-weight="700"
        fill="{DARK}">{esc(title)}</text>
  {body}"""


def build_arch_svg():
    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The B2 AI Growth &amp; Integration Engine</text>
  <text x="40" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Three coordinated fronts. Inbound makes B2 findable and citable; outbound deepens the named-account pursuit; internal makes a 16-person team operate like fifty.</text>"""

    COLW, COLH = 273, 420
    X = [40, 333, 626]
    Y = 92

    def col_header(x, color, label, sub):
        return f"""
  <rect x="{x}" y="{Y}" width="{COLW}" height="56" rx="6" fill="{color}"/>
  <text x="{x+COLW//2}" y="{Y+26}" font-family="Segoe UI,Arial" font-size="14" font-weight="700" fill="{WHITE}" text-anchor="middle">{esc(label)}</text>
  <text x="{x+COLW//2}" y="{Y+44}" font-family="Segoe UI,Arial" font-size="11" fill="{WHITE}" text-anchor="middle">{esc(sub)}</text>"""

    headers = (
        col_header(X[0], BLUE, "INBOUND - GET FOUND & CITED", "fix the name collision, own the answers")
        + col_header(X[1], ORANGE, "OUTBOUND - WIN THE BOR", "account intelligence, not cold volume")
        + col_header(X[2], DARK, "INTERNAL - RUN LEAN", "the renewal machine + the brain")
    )

    cards = (
        arch_card(X[0], Y+72, COLW, 116, BLUE, "Branded-Entity AEO / GEO",
                  ['Make "B2 Insurance" resolve to B2 -', "entity schema, NAP cleanup, claimed", "profiles - in Google AND AI assistants.", "Today the name loses to a bomber."])
        + arch_card(X[0], Y+200, COLW, 116, BLUE, "Renewal-Season Authority Content",
                  ["Revive the dead blog as the cited", "answer on 2026 CA renewals, FAIR Plan", "exits, and CA employment-law briefs -", "structured for AI citation."])
        + arch_card(X[0], Y+328, COLW, 92, BLUE, "Reputation Engine",
                  ["Claim Yelp + Google profiles; turn the", "98.3%-retention base into review velocity", "(competitor benchmark: 76 reviews)."])
        + arch_card(X[1], Y+72, COLW, 116, ORANGE, "BOR-Pursuit Account Intelligence",
                  ["A living dossier per named target:", "hiring surges, funding, carrier exits,", "x-date windows - so producers walk in", "knowing more than the incumbent."])
        + arch_card(X[1], Y+200, COLW, 116, ORANGE, "Renewal-Window Trigger Alerts",
                  ["Signal monitoring across the target list", "timed to the 90-120 day renewal window -", "outreach lands when the +10-13% letter", "is on the buyer's desk."])
        + arch_card(X[1], Y+328, COLW, 92, ORANGE, "Book Mining & Cross-Sell",
                  ["FAIR-Plan depopulation remarketing;", "owners missing earthquake / umbrella /", "401(k) - warm, not cold."])
        + arch_card(X[2], Y+72, COLW, 116, TEAL, "Quote & Renewal Document Intelligence",
                  ["Extract and compare carrier quotes,", "SBCs, ACORD forms, loss runs;", "auto-draft the renewal comparison deck.", "Industry reports: ~2 staff-days to <30 min."])
        + arch_card(X[2], Y+200, COLW, 116, TEAL, "Governed HR-Compliance Assistant",
                  ["Scales the consulting hours B2 already", "bundles into its BOR - CA employment-law", "answers grounded on vetted sources,", "human-reviewed before they ship."])
        + arch_card(X[2], Y+328, COLW, 92, TEAL, "Institutional Knowledge System",
                  ["30 years of carrier / underwriter / client", "knowledge made searchable - producer", "ramp + key-person risk insurance."])
    )

    boundary = f"""
  <rect x="40" y="{Y+440}" width="859" height="80" rx="6" fill="{OFF}" stroke="{RED}" stroke-width="1.5"/>
  <text x="60" y="{Y+466}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{RED}">THE GOVERNANCE BOUNDARY</text>
  <text x="60" y="{Y+486}" font-family="Segoe UI,Arial" font-size="11.5" fill="{DARK}">Client census, health, and claims data never enters public AI tools. Private, governed deployments only;</text>
  <text x="60" y="{Y+502}" font-family="Segoe UI,Arial" font-size="11.5" fill="{DARK}">a human reviews every compliance-bound or client-facing answer. (NIST AI RMF-aligned.)</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 680" width="940" height="680" role="img">
  {title}{headers}{cards}{boundary}
</svg>"""


# ============================================================================
# DIAGRAM 3 - 90/180/365 RENEWAL-CALENDAR ROADMAP (900 x 420)
# ============================================================================

def milestone_card(x, y, w, h, accent, num, title, body, tag, tag_color):
    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{WHITE}" stroke="{LIGHT}" stroke-width="1.5"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}"/>
  <circle cx="{x+24}" cy="{y+24}" r="12" fill="{accent}"/>
  <text x="{x+24}" y="{y+28}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">{num}</text>
  <text x="{x+44}" y="{y+28}" font-family="Segoe UI,Arial" font-size="12.5" font-weight="700" fill="{DARK}">{esc(title)}</text>
  <text x="{x+14}" y="{y+50}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{esc(body[0])}</text>
  <text x="{x+14}" y="{y+65}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{esc(body[1])}</text>
  <text x="{x+w-14}" y="{y+h-10}" font-family="Segoe UI,Arial" font-size="10.5" font-weight="700" fill="{tag_color}" text-anchor="end">{esc(tag)}</text>"""


def build_timeline_svg():
    COL_X = [60, 332, 604]
    CW = 256
    R1, R2 = 158, 268

    bar = f"""
  <defs>
    <linearGradient id="tl" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{BLUE}"/><stop offset="50%" stop-color="{TEAL}"/><stop offset="100%" stop-color="{ORANGE}"/>
    </linearGradient>
  </defs>
  <rect x="60" y="92" width="800" height="14" rx="7" fill="url(#tl)"/>
  <circle cx="60" cy="99" r="9" fill="{BLUE}"/><circle cx="460" cy="99" r="9" fill="{TEAL}"/><circle cx="860" cy="99" r="9" fill="{ORANGE}"/>"""

    phases = f"""
  <text x="60" y="130" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}">DAYS 0-90 - BE FINDABLE</text>
  <text x="60" y="145" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">summer - before renewal season</text>
  <text x="332" y="130" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}">DAYS 90-180 - WIN RENEWAL SEASON</text>
  <text x="332" y="145" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">Q4 - when every buyer is in motion</text>
  <text x="604" y="130" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}">DAYS 180-365 - COMPOUND</text>
  <text x="604" y="145" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">automation + the custom build</text>"""

    cards = (
        milestone_card(COL_X[0], R1, CW, 92, BLUE, "1", "Fix the Entity",
                       ["Claim Yelp + GBP, NAP cleanup, schema;", '"B2 Insurance" resolves to B2.'], "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, CW, 92, BLUE, "2", "Reputation + Content Restart",
                       ["Review engine on the retained base;", "first renewal-season authority pieces."], "My SEO", BLUE)
        + milestone_card(COL_X[1], R1, CW, 92, TEAL, "3", "Account-Intel Pilot",
                       ["Named-target dossiers + x-date triggers", "live for the Q4 BOR pursuit."], "My AI", TEAL)
        + milestone_card(COL_X[1], R2, CW, 92, TEAL, "4", "Capture the Demand",
                       ["FAIR-depopulation + renewal-shock", "campaigns; nurture on autopilot."], "My AI Lead Gen", TEAL)
        + milestone_card(COL_X[2], R1, CW, 92, ORANGE, "5", "The Renewal Machine",
                       ["Quote/SBC document intelligence;", "renewal decks in minutes, not days."], "My Dev (scoped)", ORANGE)
        + milestone_card(COL_X[2], R2, CW, 92, ORANGE, "6", "The Brokerage Brain",
                       ["Knowledge system + governed HR-compliance", "assistant; measure, then scale or stop."], "My AI / My Dev", ORANGE)
    )

    note = f"""
  <text x="60" y="392" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}">* Paced to the insurance calendar: visibility lands before Q4 renewal season; the custom build starts only after the entry program proves the lift. Scope confirms at discovery.</text>"""

    title = f"""
  <text x="60" y="32" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The First Year, Paced to the Renewal Calendar</text>
  <text x="60" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">B2 Insurance Services + Technijian. Be findable by September, win renewal season by January, compound all year.</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420" width="900" height="420" role="img">
  {title}{bar}{phases}{cards}{note}
</svg>"""


# -- RENDER --
async def render(page, html, output):
    await page.set_content(html, wait_until="networkidle")
    box_ = await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width": max(box_["w"], 900), "height": max(box_["h"], 100)})
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating B2I diagrams (technijian-diagram skill, SVG)...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=3)
        print("1/3  personas.png");     await render(page, page_shell(build_personas_svg()),  DIAGRAMS_DIR / "personas.png")
        print("2/3  architecture.png"); await render(page, page_shell(build_arch_svg()),      DIAGRAMS_DIR / "architecture.png")
        print("3/3  timeline.png");     await render(page, page_shell(build_timeline_svg()),  DIAGRAMS_DIR / "timeline.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
