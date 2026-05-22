"""
generate-diagrams.py — EBRMD / Robinson Facial Plastic Surgery (Dr. Ernest B. Robinson, MD)
Renders 4 diagram PNGs via Playwright (HTML+SVG). Brand tokens, 4px grid, >=11px text, WCAG contrast.

Output:  diagrams/two-engine.png   (Figure 2.0 — the two growth engines + where My AI Lead Gen fits)
         diagrams/referral-map.png (Figure 5.0 — referral sources My AI Lead Gen harvests)
         diagrams/personas.png     (Figure 8.0 — patient + referral segments, Value x Volume)
         diagrams/timeline.png      (Figure 11.0 — 90/180/365 roadmap)
Usage:   python Clients/EBRMD/generate-diagrams.py
"""

import asyncio
import pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

# Brand tokens
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


def page_shell(svg, bg=WHITE):
    return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ background:{bg}; display:inline-block; }}
  svg {{ display:block; }}
</style></head><body>{svg}</body></html>"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;")


def card(x, y, w, h, accent, title, desc, badge, badge_color, char=40):
    t = esc(title); d = esc(desc); b = esc(badge)
    badge_txt = WHITE if badge_color in (BLUE, DARK, TEAL) else DARK
    words = d.split(); l1, l2, cnt, on2 = [], [], 0, False
    for w_ in words:
        if not on2 and cnt + len(w_) + 1 <= char:
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


# ── DIAGRAM 1 — THE TWO GROWTH ENGINES (900 × 560) ──────────────────────────
def build_two_engine_svg():
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Two Growth Engines — and Where My AI Lead Gen Fits</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Consumer growth = capture &amp; nurture (build on the My SEO you already run). Referral growth = account-based lead gen.</text>"""
    # headers
    headers = f"""
  <rect x="16"  y="76" width="424" height="50" fill="{BLUE}"   rx="4"/>
  <text x="228" y="98"  font-family="Segoe UI,Arial" font-size="14" font-weight="700" fill="{WHITE}" text-anchor="middle">ENGINE A — CONSUMER DEMAND CAPTURE</text>
  <text x="228" y="116" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9E3F4" text-anchor="middle">patients searching for procedures &#8594; booked consults</text>
  <rect x="460" y="76" width="424" height="50" fill="{ORANGE}" rx="4"/>
  <text x="672" y="98"  font-family="Segoe UI,Arial" font-size="14" font-weight="700" fill="{DARK}" text-anchor="middle">ENGINE B — B2B REFERRAL LEAD GEN</text>
  <text x="672" y="116" font-family="Segoe UI,Arial" font-size="10.5" fill="{DARK}" text-anchor="middle">named practices &#8594; recurring referral pipeline</text>"""
    bg = f"""
  <rect x="16"  y="126" width="424" height="386" fill="{OFF}" rx="4"/>
  <rect x="460" y="126" width="424" height="386" fill="{OFF}" rx="4"/>"""
    left = (
        card(28, 140, 400, 80, BLUE, "Get Found — SEO + GEO",
             "Rank in Google (live) AND get cited by ChatGPT, Perplexity & AI Overviews.", "My SEO", BLUE, char=62)
        + card(28, 232, 400, 80, BLUE, "Capture — Chat.AI Assistant",
               "24/7 assistant answers candidacy / cost / financing and books the consult.", "Chat.AI", ORANGE, char=62)
        + card(28, 324, 400, 80, BLUE, "Nurture — Consult to Surgery",
               "Tasteful email/SMS over the weeks patients deliberate — lifts the #1 metric.", "My AI", TEAL, char=62)
        + card(28, 416, 400, 80, BLUE, "Reputation — Review Engine",
               "Systematic review requests close the 32-vs-hundreds gap; feeds SEO + GEO.", "My AI", TEAL, char=62)
    )
    right = (
        card(472, 140, 400, 80, ORANGE, "Harvest — My AI Lead Gen",
             "Pull every OC dermatology/Mohs, med spa, dental & optometry practice from public data.", "Lead Gen", TEAL, char=62)
        + card(472, 232, 400, 80, ORANGE, "Score — Mohs Derms First",
               "Rank targets; Mohs/derm top the list (face reconstruction is a direct line).", "Lead Gen", TEAL, char=62)
        + card(472, 324, 400, 80, ORANGE, "Outreach — Per-Practice",
               "Personalized sequences in Dr. Robinson's voice; coordinator follows up.", "My AI", TEAL, char=62)
        + card(472, 416, 400, 80, ORANGE, "Referrals — Recurring Cases",
               "A referral relationship sends cases for years — compounding, low-cost growth.", "My Dev", DARK, char=62)
    )
    note = f"""
  <rect x="436" y="250" width="28" height="24" rx="6" fill="{ORANGE}"/>
  <text x="450" y="266" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">&#9733;</text>
  <text x="450" y="540" font-family="Segoe UI,Arial" font-size="11" font-style="italic" fill="{GREY}" text-anchor="middle">My AI Lead Gen powers Engine B (referrals) — not consumer patient acquisition. The honest fit.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">
  {title}{headers}{bg}{left}{right}{note}
</svg>"""


# ── DIAGRAM 2 — REFERRAL-SOURCE MAP (900 × 480) ─────────────────────────────
def build_referral_svg():
    marker = f"""<defs><marker id="rar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>"""
    # hub
    hub = f"""
  <rect x="600" y="196" width="252" height="92" rx="8" fill="{DARK}"/>
  <text x="726" y="232" font-family="Segoe UI,Arial" font-size="14" font-weight="700" fill="{WHITE}" text-anchor="middle">ROBINSON FACIAL</text>
  <text x="726" y="252" font-family="Segoe UI,Arial" font-size="14" font-weight="700" fill="{WHITE}" text-anchor="middle">PLASTIC SURGERY</text>
  <text x="726" y="272" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">surgical + reconstructive cases</text>"""
    # source nodes (left), with priority stars
    sources = [
        (96, "Dermatologists / Mohs surgeons", "Mohs face excision &#8594; reconstruction", BLUE, "5"),
        (170, "Non-surgical med spas", "refer surgical cases up", TEAL, "4"),
        (244, "Dentists / oral surgeons", "chin, jaw, facial referrals", GOLD, "3"),
        (318, "Optometry / ophthalmology", "droopy-lid / blepharoplasty", TEAL, "3"),
        (392, "PCP · OB-GYN · salons", "general cosmetic referrals", GREY, "2"),
    ]
    node_svg = ""
    for (y, label, sub, color, stars) in sources:
        starstr = "&#9733;" * int(stars)
        node_svg += f"""
  <rect x="40" y="{y}" width="300" height="58" rx="6" fill="{WHITE}" stroke="{color}" stroke-width="2"/>
  <rect x="40" y="{y}" width="5" height="58" rx="2" fill="{color}"/>
  <text x="56" y="{y+24}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{label}</text>
  <text x="56" y="{y+42}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{sub}</text>
  <text x="332" y="{y+20}" font-family="Segoe UI,Arial" font-size="10" fill="{ORANGE}" text-anchor="end">{starstr}</text>
  <line x1="340" y1="{y+29}" x2="596" y2="242" stroke="{ORANGE}" stroke-width="1.6" marker-end="url(#rar)" opacity="0.75"/>"""
    # harvest band (bottom)
    band = f"""
  <rect x="40" y="476" width="812" height="34" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="476" width="6" height="34" rx="3" fill="{ORANGE}"/>
  <text x="58" y="497" font-family="Segoe UI,Arial" font-size="11.5" fill="{DARK}"><tspan font-weight="700">My AI Lead Gen</tspan> harvests, enriches &amp; scores every one of these from public data (NPI registry, Google Business), then runs account-based outreach.</text>"""
    title = f"""
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Referral Engine — What My AI Lead Gen Builds</text>
  <text x="40" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A finite, nameable universe of local practices that send surgical cases. &#9733; = referral priority.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 528" width="900" height="528" role="img">
  {marker}{title}{node_svg}{hub}{band}
</svg>"""


# ── DIAGRAM 3 — PERSONAS (Value × Volume, 900 × 600) ────────────────────────
def build_personas_svg():
    def X(v): return round((90 + v / 100 * 740) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)
    # (key, label, volume, value, color, txt, r, dx, dy, anchor)
    P = [
        ("SURG", "Surgical Self-Investor", 22, 90, BLUE,   WHITE, 30, 0,  -42, "middle"),
        ("RHINO","Rhinoplasty Patient",    34, 72, BLUE,   WHITE, 26, 0,   44, "middle"),
        ("INJ",  "Injectables Regular",    86, 32, BLUE,   WHITE, 28, 0,   46, "middle"),
        ("OOT",  "Out-of-Town Guest",      16, 66, BLUE,   WHITE, 22, -34,  4, "end"),
        ("DERM", "Referring Mohs/Derm",    74, 84, ORANGE, DARK,  32, 0,  -44, "middle"),
        ("SPA",  "Med-Spa Referrer",       58, 60, GOLD,   DARK,  26, 44,   4, "start"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""
    quad = f"""
  <text x="{X(74)}" y="78" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR VALUE</text>
  <text x="{X(24)}" y="78" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-TICKET, RARE</text>
  <text x="{X(74)}" y="490" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">RECURRING VOLUME</text>"""
    legend = f"""
  <circle cx="96"  cy="560" r="7" fill="{BLUE}"/>   <text x="108" y="565" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Consumer / patient (Engine A)</text>
  <circle cx="380" cy="560" r="7" fill="{ORANGE}"/> <text x="392" y="565" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Referral source — My AI Lead Gen (Engine B)</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="90" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Patient &amp; Referral Segments — Revenue Value × Volume</text>
  <text x="90" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Blue = consumer patients (capture &amp; nurture). Orange/gold = referral sources (My AI Lead Gen). Bubble &#8733; contribution.</text>
  <rect x="90" y="60" width="740" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="90" y1="{QHY}" x2="830" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="90" y1="60"  x2="90"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="90" y1="500" x2="830" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,34,280)" x="34" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Revenue Value per &#8594;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Volume / Throughput &#8594;</text>
  {quad}{dots}{legend}
</svg>"""


# ── DIAGRAM 4 — 90/180/365 TIMELINE (900 × 392) ─────────────────────────────
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
  <text x="{P1_X+P1_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">DAYS 1–90</text>
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">FOUNDATION</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91–180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">REFERRAL ENGINE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181–365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE BOTH ENGINES</text>"""
    TL_Y, TL_H = 110, 18
    bar = f"""
  <defs><linearGradient id="tl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="{BLUE}"/><stop offset="45%" stop-color="{TEAL}"/>
    <stop offset="72%" stop-color="{ORANGE}"/><stop offset="100%" stop-color="#c45e2c"/>
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Reputation + GEO",
                       "Review engine live. GEO layer on the My SEO you already run.", "My SEO", BLUE)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Capture & Nurture Live",
                         "Chat.AI consult assistant + consult-to-surgery nurture flows.", "Chat.AI", ORANGE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Harvest the Universe",
                         "My AI Lead Gen pulls OC derms/Mohs, med spas, dental, optometry.", "Lead Gen", TEAL)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Account-Based Outreach",
                         "Per-practice sequences; Mohs derms first. Coordinator follow-up.", "Lead Gen", TEAL)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Both Engines Compound",
                         "Consult conversion up; steady referral case flow building.", "All", ORANGE)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Optimize & Report",
                         "Double down on what converts. ROI dashboard vs. baselines.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Consult-conversion &amp; referral-volume targets calibrate after a 30-min discovery call (see the Questions section). Estimates are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Robinson Facial Plastic Surgery — strengthen the consumer engine first, then stand up the referral engine.</text>"""
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
    print("Generating EBRMD diagrams...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        print("1/4  two-engine.png");   await render(page, page_shell(build_two_engine_svg()), DIAGRAMS_DIR / "two-engine.png")
        print("2/4  referral-map.png"); await render(page, page_shell(build_referral_svg()),   DIAGRAMS_DIR / "referral-map.png")
        print("3/4  personas.png");     await render(page, page_shell(build_personas_svg()),   DIAGRAMS_DIR / "personas.png")
        print("4/4  timeline.png");     await render(page, page_shell(build_timeline_svg()),   DIAGRAMS_DIR / "timeline.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
