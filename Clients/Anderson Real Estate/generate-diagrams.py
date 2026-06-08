"""
generate-diagrams.py — Anderson Real Estate AI Growth & Integration Blueprint
Renders 3 diagram PNGs via Playwright (HTML+SVG). Brand tokens, 4px grid, >=11px text.

Output:  diagrams/two-fronts.png  (Figure 2.0 — the AI operating layer: two fronts)
         diagrams/personas.png    (Figure 5.0 — tenant & broker segments, Value x Volume)
         diagrams/timeline.png     (Figure 10.0 — 90/180/365 roadmap)
Usage:   py -3.12 "Clients/Anderson Real Estate/generate-diagrams.py"
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


def card(x, y, w, h, accent, title, desc, badge, badge_color, char=62):
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
  <text x="{x+14}" y="{y+38}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(l1)}</text>
  <text x="{x+14}" y="{y+52}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">{" ".join(l2)}</text>
  <rect x="{bx}" y="{by}" width="{bw}" height="16" fill="{badge_color}" rx="8"/>
  <text x="{bx + bw//2}" y="{by+11}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{badge_txt}" text-anchor="middle">{b}</text>"""


# == DIAGRAM 1 — THE AI OPERATING LAYER: TWO FRONTS (900 x 588) ===============
def build_two_fronts_svg():
    title = f"""
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The AI Operating Layer — Two Fronts for Anderson Real Estate</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Front 1 wins and holds the right tenants (account-based, broker-driven). Front 2 runs the 3.1M sq ft portfolio with a lean team.</text>"""
    headers = f"""
  <rect x="16"  y="76" width="424" height="50" fill="{BLUE}"   rx="4"/>
  <text x="228" y="98"  font-family="Segoe UI,Arial" font-size="14" font-weight="700" fill="{WHITE}" text-anchor="middle">FRONT 1 — LEASING &amp; TENANT GROWTH</text>
  <text x="228" y="116" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9E3F4" text-anchor="middle">named tenants + brokers &#8594; signed &amp; renewed leases</text>
  <rect x="460" y="76" width="424" height="50" fill="{ORANGE}" rx="4"/>
  <text x="672" y="98"  font-family="Segoe UI,Arial" font-size="14" font-weight="700" fill="{DARK}" text-anchor="middle">FRONT 2 — PORTFOLIO OPS &amp; EFFICIENCY</text>
  <text x="672" y="116" font-family="Segoe UI,Arial" font-size="10.5" fill="{DARK}" text-anchor="middle">250+ leases &#8594; institutional-grade operations</text>"""
    bg = f"""
  <rect x="16"  y="126" width="424" height="396" fill="{OFF}" rx="4"/>
  <rect x="460" y="126" width="424" height="396" fill="{OFF}" rx="4"/>"""
    left = (
        card(28, 140, 400, 84, BLUE, "Get Found — Leasing SEO + GEO",
             "Be the cited answer for 'Century City office space' & Westside retail.", "My SEO", BLUE)
        + card(28, 234, 400, 84, BLUE, "Target — Broker & Tenant Intelligence",
               "Track named in-market tenants, their brokers & trigger signals.", "My AI", TEAL)
        + card(28, 328, 400, 84, BLUE, "Win — Tour & Proposal Automation",
               "AI-drafted, on-brand proposals & follow-ups in hours, not days.", "My Dev", DARK)
        + card(28, 422, 400, 84, BLUE, "Hold — Retention & Family-Brand",
               "Renewals beat new leases; 'people-first' proof vs. impersonal REITs.", "My AI", TEAL)
    )
    right = (
        card(472, 140, 400, 84, ORANGE, "Lease Intelligence — 250+ Leases",
             "Abstract dates, options & CAM; searchable, source-linked. ~1-2 FTE freed.", "My AI", TEAL)
        + card(472, 234, 400, 84, ORANGE, "Finance & CAM Automation",
               "Cut manual CAM reconciliation across 53 properties & 9 markets.", "My AI", TEAL)
        + card(472, 328, 400, 84, ORANGE, "Operations & Tenant Assistant",
               "AI-routed work orders; 24/7 tenant assistant; predictive upkeep.", "Chat.AI", ORANGE)
        + card(472, 422, 400, 84, ORANGE, "Portfolio Intelligence Dashboard",
               "Occupancy, rollover exposure & revenue — one view, not 14 tools.", "My Dev", DARK)
    )
    note = f"""
  <text x="450" y="548" font-family="Segoe UI,Arial" font-size="11.5" font-style="italic" fill="{GREY}" text-anchor="middle">AI is the operating layer under a family-owned platform — it amplifies "people come first," it does not replace the relationship.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 570" width="900" height="570" role="img">
  {title}{headers}{bg}{left}{right}{note}
</svg>"""


# == DIAGRAM 2 — PERSONAS (Value x Volume, 900 x 600) =========================
def build_personas_svg():
    def X(v): return round((90 + v / 100 * 740) / 4) * 4
    def Y(m): return round((500 - m / 100 * 440) / 4) * 4
    QVX, QHY = X(50), Y(50)
    # (key, label, volume, value, color, txt, r, dx, dy, anchor)
    P = [
        ("OFFICE", "Trophy Office Tenant",      20, 86, BLUE,   WHITE, 30, 0,   48, "middle"),
        ("BROKER", "Tenant-Rep Broker",         40, 80, ORANGE, DARK,  30, 0,  -44, "middle"),
        ("RENEW",  "Renewing Anchor Tenant",    70, 78, GOLD,   DARK,  30, 0,  -46, "middle"),
        ("RETAIL", "Lifestyle / Retail Tenant", 60, 55, TEAL,   WHITE, 26, 44,   4, "start"),
        ("FLEX",   "Industrial / Flex Tenant",  50, 42, DARK,   WHITE, 24, -36,  4, "end"),
    ]
    dots = ""
    for key, label, v, m, color, tc, r, ldx, ldy, anc in P:
        cx, cy = X(v), Y(m); lx, ly = cx + ldx, cy + ldy
        dots += f"""
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="10.5" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>"""
    quad = f"""
  <text x="{X(88)}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE, RECURRING</text>
  <text x="{X(40)}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">TROPHY, RARE</text>
  <text x="{X(88)}" y="490" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME BASE</text>"""
    legend = f"""
  <circle cx="96"  cy="560" r="7" fill="{BLUE}"/>   <text x="108" y="565" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Tenants Anderson leases to</text>
  <circle cx="330" cy="560" r="7" fill="{ORANGE}"/> <text x="342" y="565" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Tenant-rep broker — the deal-flow channel (a multiplier, not a single deal)</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="90" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Who Anderson Serves — Lease Value &#215; Volume</text>
  <text x="90" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Office is high-value/low-count; retail &amp; flex are the volume base; the broker is the channel that controls deal flow.</text>
  <rect x="90" y="60" width="740" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="90" y1="{QHY}" x2="830" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="90" y1="60"  x2="90"  y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="90" y1="500" x2="830" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,34,280)" x="34" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Lease Value per Relationship &#8594;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Volume / Count &#8594;</text>
  {quad}{dots}{legend}
</svg>"""


# == DIAGRAM 3 — 90/180/365 TIMELINE (900 x 392) =============================
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">FOUNDATION</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}"   rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">LEASING ENGINE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">PORTFOLIO INTELLIGENCE &amp; SCALE</text>"""
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
        milestone_card(COL_X[0], R1, 232, 92, BLUE, "1", "Lease-Intelligence Pilot",
                       "Abstract a first tranche of leases; instant searchable terms.", "My AI", TEAL)
        + milestone_card(COL_X[0], R2, 232, 92, BLUE, "2", "Leasing Visibility + Assess",
                         "GEO for Century City space. Free Nexus Assess risk scan.", "My SEO", BLUE)
        + milestone_card(COL_X[1], R1, 232, 92, TEAL, "3", "Broker & Tenant Intel",
                         "Track named in-market tenants and their tenant-rep brokers.", "My AI", TEAL)
        + milestone_card(COL_X[1], R2, 232, 92, TEAL, "4", "Tour & Proposal Automation",
                         "On-brand leasing proposals and follow-ups drafted in hours.", "My Dev", DARK)
        + milestone_card(COL_X[2], R1, 236, 92, ORANGE, "5", "Portfolio Dashboard",
                         "Occupancy, rollover and revenue in one view; CAM automation.", "My Dev", DARK)
        + milestone_card(COL_X[2], R2, 236, 92, ORANGE, "6", "Scale Across Holdings",
                         "Extend the operating layer enterprise-wide; ROI reporting.", "All", ORANGE)
    )
    note = f"""
  <text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Leasing-velocity, retention and ops-capacity targets calibrate after a 30-min discovery call (see the Questions section). Estimates are conservative.</text>"""
    title = f"""
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365 Day Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Anderson Real Estate — prove the highest-ROI win first (lease intelligence), then the leasing engine, then scale.</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">
  {title}{phases}{bar}{cards}{note}
</svg>"""


# == RENDER ===================================================================
async def render(page, html, output):
    await page.set_content(html, wait_until="networkidle")
    box = await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width": max(box["w"], 900), "height": max(box["h"], 100)})
    await page.screenshot(path=str(output), full_page=True)
    print(f"  saved -> {output.name}  ({output.stat().st_size // 1024} KB)")


async def main():
    print("Generating Anderson Real Estate diagrams...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        print("1/3  two-fronts.png"); await render(page, page_shell(build_two_fronts_svg()), DIAGRAMS_DIR / "two-fronts.png")
        print("2/3  personas.png");   await render(page, page_shell(build_personas_svg()),   DIAGRAMS_DIR / "personas.png")
        print("3/3  timeline.png");   await render(page, page_shell(build_timeline_svg()),   DIAGRAMS_DIR / "timeline.png")
        await browser.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
