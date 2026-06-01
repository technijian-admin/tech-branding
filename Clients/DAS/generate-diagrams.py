"""
DAS (Danielian Associates) AI Growth & Integration Strategy — diagram generator.
HTML + CSS + Playwright (no matplotlib), per technijian-biz-dev-blueprint skill.
Auto-crops every PNG to content + uniform margin; the report derives each figure's
aspect ratio from the REAL cropped pixel dims (never hardcode AR).

  personas.png      — the Danielian buyer universe (Account Value x Pursuit Frequency)
  competitive.png   — positioning map (firm scale x AI-readiness / pursuit speed)
  architecture.png  — AI Growth + Integration engine (Inbound / Outbound / Internal)
  timeline.png      — 3-phase roadmap (Foundation -> Pursuit Engine -> Firmwide Scale)

Usage:  py -3.12 Clients/DAS/generate-diagrams.py
"""
import os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "diagrams")
os.makedirs(OUT, exist_ok=True)

BLUE = "#006DB6"
ORANGE = "#F67D4B"
TEAL = "#1EAAC8"
CHARTREUSE = "#CBDB2D"
GREY = "#59595B"
DARK = "#1A1A2E"
OFFWHITE = "#F8F9FA"
LIGHT = "#E9ECEF"
CRITICAL = "#CC0000"
PURPLE = "#7B2D8B"
GOLD = "#C9922A"

FONT_IMPORT = (
    "@import url('https://fonts.googleapis.com/css2?"
    "family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Open+Sans:wght@400;600;700&display=swap');"
)

ICONS = {
    "search": '<path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/>',
    "radar": '<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>',
    "cpu": '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    "fileText": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "building": '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    "checkCircle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    "rocket": '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "brain": '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>',
    "compass": '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/>',
    "layers": '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    "penTool": '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
    "trendingUp": '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
}


def icon(name, color=BLUE, size=22, stroke=2.2):
    return (
        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
        f'stroke="{color}" stroke-width="{stroke}" stroke-linecap="round" '
        f'stroke-linejoin="round">{ICONS[name]}</svg>'
    )


def shell(body, w, h, pad=44):
    return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
{FONT_IMPORT}
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ font-family:'Plus Jakarta Sans',sans-serif; width:{w}px; height:{h}px;
  background:#fff; padding:{pad}px; color:{DARK}; }}
.title {{ font-size:30px; font-weight:800; color:{BLUE}; }}
.title .o {{ color:{ORANGE}; }}
.sub {{ font-size:16px; color:{GREY}; margin-top:6px; font-weight:600; }}
</style></head><body>{body}</body></html>"""


def render(html, path, w, h):
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.set_content(html)
        pg.wait_for_timeout(650)
        pg.screenshot(path=path, clip={"x": 0, "y": 0, "width": w, "height": h})
        b.close()
    im = Image.open(path).convert("RGB")
    bbox = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).getbbox()
    if bbox:
        m = 26
        l, t, r, bo = bbox
        im.crop((max(0, l - m), max(0, t - m),
                 min(im.width, r + m), min(im.height, bo + m))).save(path)
    print(f"  wrote {os.path.relpath(path, HERE)} ({im.size[0]}x{im.size[1]} -> cropped)")


# ---------------------------------------------------------------- 1. PERSONAS (buyer universe)
def personas():
    W, H = 1240, 900
    # x = Pursuit Frequency (occasional -> frequent), y = Account Value (lower -> higher)
    # side: 'r' label right of dot, 'l' label left of dot
    dots = [
        ("Production / National Homebuilder<br><span>core multifamily + SF volume</span>", 78, 60, BLUE, "A", "l"),
        ("Multifamily / BTR Developer<br><span>the 2026 growth category</span>", 64, 78, ORANGE, "B", "l"),
        ("Affordable-Housing Developer<br><span>mission + volume (LIHTC)</span>", 50, 50, TEAL, "r"),
        ("Master-Planned Landowner<br><span>highest value, less frequent</span>", 30, 88, PURPLE, "D", "r"),
        ("Public Agency / Municipality<br><span>planning + entitlement</span>", 26, 40, GREY, "E", "r"),
    ]
    # fix the affordable entry which lacks a number in tuple above
    dots = [
        ("Production / National Homebuilder<br><span>core multifamily + SF volume</span>", 80, 58, BLUE, "A", "l"),
        ("Multifamily / BTR Developer<br><span>the 2026 growth category</span>", 62, 80, ORANGE, "B", "l"),
        ("Affordable-Housing Developer<br><span>mission + volume (LIHTC)</span>", 48, 48, TEAL, "C", "r"),
        ("Master-Planned Landowner<br><span>highest value, less frequent</span>", 28, 90, PURPLE, "D", "r"),
        ("Public Agency / Municipality<br><span>planning + entitlement</span>", 30, 34, GREY, "E", "r"),
    ]
    plot = ""
    for label, x, y, color, n, side in dots:
        plot += f"""
        <div class="dot" style="left:{x}%; bottom:{y}%; border-color:{color};">
          <span class="num" style="background:{color};">{n}</span>
          <div class="dlab {side}">{label}</div>
        </div>"""
    body = f"""
    <div class="title">The Danielian <span class="o">Buyer Universe</span></div>
    <div class="sub">A finite, named set of developer clients &mdash; won by relationship and pursuit, not a lead funnel. AI targets this universe with depth and timing.</div>
    <div class="chart">
      <div class="yaxis">Account Value &#8593;</div>
      <div class="xaxis">Pursuit Frequency: how often they buy design &#8594;</div>
      <div class="grid">
        <div class="ql tl">High value, occasional<br>(land + master plans)</div>
        <div class="ql tr">High value, frequent<br>(anchor relationships)</div>
        <div class="ql bl">Selective pursuits</div>
        <div class="ql br">Volume engine</div>
        {plot}
      </div>
    </div>
    <style>
    .chart {{ position:relative; margin-top:30px; height:650px; padding-left:42px; padding-bottom:38px; }}
    .yaxis {{ position:absolute; left:-285px; top:300px; width:600px; text-align:center;
      transform:rotate(-90deg); transform-origin:center center;
      font-weight:700; color:{BLUE}; font-size:15px; white-space:nowrap; }}
    .xaxis {{ position:absolute; bottom:0; left:50%; transform:translateX(-50%);
      font-weight:700; color:{BLUE}; font-size:15px; }}
    .grid {{ position:relative; height:610px; margin-left:42px;
      border-left:3px solid {DARK}; border-bottom:3px solid {DARK};
      background:
        linear-gradient(90deg, transparent 49.7%, {LIGHT} 49.7%, {LIGHT} 50.3%, transparent 50.3%),
        linear-gradient(0deg, transparent 49.7%, {LIGHT} 49.7%, {LIGHT} 50.3%, transparent 50.3%),
        {OFFWHITE}; }}
    .ql {{ position:absolute; font-size:13px; font-weight:700; color:{GREY}; opacity:.5;
      width:46%; text-align:center; line-height:1.3; }}
    .ql.tl {{ top:14px; left:2%; }} .ql.tr {{ top:14px; right:2%; }}
    .ql.bl {{ bottom:14px; left:2%; }} .ql.br {{ bottom:14px; right:2%; }}
    .dot {{ position:absolute; width:18px; height:18px; border-radius:50%; background:#fff;
      border:4px solid; transform:translate(-50%,50%); }}
    .num {{ position:absolute; top:-7px; left:-7px; width:24px; height:24px; border-radius:50%;
      color:#fff; font-size:13px; font-weight:800; display:flex; align-items:center; justify-content:center; }}
    .dlab {{ position:absolute; top:-6px; font-size:13.5px; font-weight:700; color:{DARK};
      white-space:nowrap; line-height:1.25; }}
    .dlab.r {{ left:26px; text-align:left; }}
    .dlab.l {{ right:26px; text-align:right; }}
    .dlab span {{ font-weight:600; color:{GREY}; font-size:11.5px; }}
    </style>"""
    render(shell(body, W, H), os.path.join(OUT, "personas.png"), W, H)


# ------------------------------------------------------------ 2. COMPETITIVE
def competitive():
    W, H = 1240, 880
    # x = AI-readiness / pursuit & studio speed (low -> high)
    # y = firm scale / reach (low -> high)
    dots = [
        ("KTGY", 55, 88, GREY, "National-scale multifamily leader", "l"),
        ("AO Architects", 50, 78, GREY, "Large OC multifamily A/E", "l"),
        ("WHA", 40, 66, GREY, "Closest A+P peer, multi-office", "r"),
        ("Danielian today", 24, 58, ORANGE, "57 yrs, 1M+ units, award-rich", "r"),
        ("Danielian + Technijian", 82, 70, BLUE, "Same craft, fastest & smartest pursuits", "l"),
    ]
    plot = ""
    for label, x, y, color, note, side in dots:
        big = "star" if "+ Technijian" in label else ""
        plot += f"""
        <div class="cdot {big}" style="left:{x}%; bottom:{y}%; background:{color};">
          <div class="clab {side}" style="color:{color};">{label}<span>{note}</span></div>
        </div>"""
    body = f"""
    <div class="title">Competitive <span class="o">Positioning</span></div>
    <div class="sub">Rivals compete on scale. None visibly wins on speed + intelligence per pursuit &mdash; that open lane plays to Danielian's deep institutional knowledge.</div>
    <div class="chart">
      <div class="yaxis">Firm scale &amp; reach &#8593;</div>
      <div class="xaxis">AI-readiness &mdash; pursuit &amp; studio speed &#8594;</div>
      <div class="grid">
        <div class="movenote">The move &#8594;<br><span>AI makes 57 years of projects searchable<br>and pursuits faster &mdash; out-think the scale leaders</span></div>
        {plot}
      </div>
    </div>
    <style>
    .chart {{ position:relative; margin-top:30px; height:640px; padding-left:42px; padding-bottom:38px; }}
    .yaxis {{ position:absolute; left:-280px; top:290px; width:600px; text-align:center;
      transform:rotate(-90deg); transform-origin:center center;
      font-weight:700; color:{BLUE}; font-size:15px; white-space:nowrap; }}
    .xaxis {{ position:absolute; bottom:0; left:50%; transform:translateX(-50%);
      font-weight:700; color:{BLUE}; font-size:15px; }}
    .grid {{ position:relative; height:600px; margin-left:42px;
      border-left:3px solid {DARK}; border-bottom:3px solid {DARK}; background:{OFFWHITE}; overflow:hidden; }}
    .movenote {{ position:absolute; right:3%; bottom:14%; width:260px; text-align:center;
      border:2px dashed {BLUE}; border-radius:10px; padding:12px 10px; color:{BLUE};
      font-size:15px; font-weight:800; background:rgba(0,109,182,.05); }}
    .movenote span {{ font-size:11.5px; font-weight:600; color:{GREY}; }}
    .cdot {{ position:absolute; width:16px; height:16px; border-radius:50%; transform:translate(-50%,50%); z-index:3; }}
    .cdot.star {{ width:26px; height:26px; box-shadow:0 0 0 6px rgba(0,109,182,.18); border:2px solid #fff; }}
    .clab {{ position:absolute; left:22px; top:-7px; font-size:14px; font-weight:800; white-space:nowrap; line-height:1.2; }}
    .clab.l {{ left:auto; right:22px; text-align:right; }}
    .cdot.star .clab {{ left:32px; top:-2px; }}
    .cdot.star .clab.l {{ left:auto; right:32px; }}
    .clab span {{ display:block; font-weight:600; color:{GREY}; font-size:11px; }}
    </style>"""
    render(shell(body, W, H), os.path.join(OUT, "competitive.png"), W, H)


# ------------------------------------------------------------ 3. ARCHITECTURE
def architecture():
    W, H = 1290, 900
    cols = [
        ("INBOUND", TEAL, "search", "Authority for named developers", [
            ("fileText", "AEO/SEO on the housing-policy questions developers ask (SB 79, ADU, BTR)"),
            ("target", "Get cited by AI engines as the housing-design answer"),
            ("building", "Awards &amp; project authority, merchandised"),
        ]),
        ("OUTBOUND", ORANGE, "radar", "Pursuit intelligence, not lead-gen", [
            ("radar", "Trigger monitoring: land buys, entitlements, builder pipelines"),
            ("fileText", "RFQ / SOQ / proposal auto-assembly, days &rarr; hours"),
            ("users", "Pre-meeting account dossiers on named developers"),
        ]),
        ("INTERNAL", BLUE, "cpu", "Knowledge &amp; production engine", [
            ("brain", "Knowledge graph of 6,353 projects &mdash; finally searchable"),
            ("compass", "Entitlement &amp; code research assistant"),
            ("checkCircle", "Hours returned to design &amp; client time"),
        ]),
    ]
    colhtml = ""
    for name, color, ic, tag, rows in cols:
        items = ""
        for ri, rt in rows:
            items += f"""<div class="item">{icon(ri, color, 20)}<span>{rt}</span></div>"""
        colhtml += f"""
        <div class="col">
          <div class="colhead" style="background:{color};">{icon(ic,'#fff',24)}<span>{name}</span></div>
          <div class="coltag">{tag}</div>
          {items}
        </div>"""
    body = f"""
    <div class="title">The Danielian AI <span class="o">Growth + Integration Engine</span></div>
    <div class="sub">Account-based: AI sits <i>under</i> the relationship layer &mdash; it augments the licensed architects and planners; it does not design.</div>
    <div class="cols">{colhtml}</div>
    <div class="arrows">&#9660;&nbsp;&nbsp;&nbsp;&nbsp;&#9660;&nbsp;&nbsp;&nbsp;&nbsp;&#9660;</div>
    <div class="pipe">{icon('penTool','#fff',26)}<span>More pursuits won, faster proposals, hours returned to design &mdash; the studio does more with the same team</span></div>
    <style>
    .cols {{ display:flex; gap:20px; margin-top:28px; }}
    .col {{ flex:1; background:{OFFWHITE}; border:1px solid {LIGHT}; border-radius:12px; overflow:hidden; padding-bottom:14px; }}
    .colhead {{ display:flex; align-items:center; gap:10px; padding:14px 16px; color:#fff; font-weight:800; font-size:19px; }}
    .coltag {{ padding:10px 16px 4px; font-size:13px; font-weight:700; color:{GREY}; font-style:italic; }}
    .item {{ display:flex; align-items:flex-start; gap:10px; padding:9px 16px; font-size:14px; font-weight:600; color:{DARK}; line-height:1.35; }}
    .item svg {{ flex-shrink:0; margin-top:1px; }}
    .arrows {{ text-align:center; color:{ORANGE}; font-size:26px; letter-spacing:90px; padding:14px 0 6px 90px; }}
    .pipe {{ display:flex; align-items:center; justify-content:center; gap:14px; background:{BLUE};
      color:#fff; font-weight:800; font-size:19px; padding:22px; border-radius:12px; text-align:center; }}
    </style>"""
    render(shell(body, W, H), os.path.join(OUT, "architecture.png"), W, H)


# --------------------------------------------------------------- 4. TIMELINE
def timeline():
    W, H = 1320, 560
    phases = [
        ("PHASE 1", "Foundation", "0&ndash;90 days", BLUE, "compass", [
            "Free Nexus Assess + AI readiness baseline",
            "Executive AI Workshop set as an EOS Rock",
            "Pursuit-automation pilot on one live RFQ",
        ]),
        ("PHASE 2", "Pursuit Engine", "90&ndash;180 days", ORANGE, "trendingUp", [
            "Proposal / SOQ automation in production",
            "Institutional knowledge graph stood up",
            "Account intelligence on named developers",
        ]),
        ("PHASE 3", "Firmwide Scale", "180&ndash;365 days", TEAL, "rocket", [
            "Roll out across OC / LA / Nashville",
            "Entitlement + code research assistant",
            "AI Rocks on the Scorecard each quarter",
        ]),
    ]
    seg = ""
    for i, (tag, name, days, color, ic, items) in enumerate(phases):
        li = "".join(f"<li>{x}</li>" for x in items)
        seg += f"""
        <div class="phase">
          <div class="marker" style="background:{color};">{icon(ic,'#fff',26)}</div>
          <div class="pcard" style="border-top:5px solid {color};">
            <div class="ptag" style="color:{color};">{tag} &middot; {days}</div>
            <div class="pname">{name}</div>
            <ul>{li}</ul>
          </div>
        </div>"""
        if i < len(phases) - 1:
            seg += '<div class="conn">&#8594;</div>'
    body = f"""
    <div class="title">Implementation <span class="o">Roadmap</span></div>
    <div class="sub">Land the entry first; prove the pursuit lift; then scale firmwide across all three offices.</div>
    <div class="track">{seg}</div>
    <style>
    .track {{ display:flex; align-items:stretch; gap:8px; margin-top:40px; }}
    .phase {{ flex:1; display:flex; flex-direction:column; align-items:center; }}
    .marker {{ width:62px; height:62px; border-radius:50%; display:flex; align-items:center; justify-content:center;
      margin-bottom:-31px; z-index:2; box-shadow:0 4px 10px rgba(0,0,0,.15); }}
    .pcard {{ background:{OFFWHITE}; border:1px solid {LIGHT}; border-radius:12px; padding:42px 20px 20px;
      width:100%; min-height:300px; }}
    .ptag {{ font-size:13px; font-weight:800; letter-spacing:.5px; text-align:center; }}
    .pname {{ font-size:24px; font-weight:800; color:{DARK}; text-align:center; margin:4px 0 14px; }}
    .pcard ul {{ padding-left:18px; }}
    .pcard li {{ font-size:14px; font-weight:600; color:{DARK}; line-height:1.4; margin-bottom:9px; }}
    .conn {{ display:flex; align-items:center; color:{ORANGE}; font-size:34px; font-weight:800; padding-top:120px; }}
    </style>"""
    render(shell(body, W, H), os.path.join(OUT, "timeline.png"), W, H)


if __name__ == "__main__":
    print("Rendering DAS diagrams ->", os.path.relpath(OUT, HERE))
    personas()
    competitive()
    architecture()
    timeline()
    print("Done.")
