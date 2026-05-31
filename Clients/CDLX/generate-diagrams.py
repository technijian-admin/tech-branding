"""
CDLX (CardLogix) AI Growth Report — diagram generator.
Renders 4 diagrams via HTML + CSS + Playwright (no matplotlib), per technijian-biz-dev-blueprint skill.

  personas.png      — joint go-to-market buyer map (Account Influence x Deal Readiness)
  competitive.png   — positioning map (Card-hardware depth x Managed-services ecosystem)
  architecture.png  — AI growth engine (Inbound / Outbound / Internal -> partnership pipeline)
  timeline.png      — 3-phase implementation roadmap (Foundation -> Joint Pilot -> Scale)

Usage:  py -3.12 Clients/CDLX/generate-diagrams.py
"""
import os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "diagrams")
os.makedirs(OUT, exist_ok=True)

# Brand tokens
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
GOLD = "#F5A623"

FONT_IMPORT = (
    "@import url('https://fonts.googleapis.com/css2?"
    "family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Open+Sans:wght@400;600;700&display=swap');"
)

# Inline Lucide icons (MIT) — 24x24 stroke paths
ICONS = {
    "search": '<path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/>',
    "radar": '<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>',
    "cpu": '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    "shield": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    "fileText": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "creditCard": '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    "network": '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
    "checkCircle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    "rocket": '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "brain": '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>',
    "handshake": '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
    "scale": '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    "key": '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
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
    # Auto-crop to content + a uniform margin so no diagram ever carries trailing
    # whitespace (canvas height is generous on purpose; this trims it to fit).
    im = Image.open(path).convert("RGB")
    bbox = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).getbbox()
    if bbox:
        m = 26
        l, t, r, bo = bbox
        im.crop((max(0, l - m), max(0, t - m),
                 min(im.width, r + m), min(im.height, bo + m))).save(path)
    print(f"  wrote {os.path.relpath(path, HERE)} ({im.size[0]}x{im.size[1]} -> cropped)")


# ---------------------------------------------------------------- 1. PERSONAS
def personas():
    W, H = 1240, 880
    # quadrant: x = Deal Readiness (now -> later), y = Account Influence (low -> high)
    # dots: (label, x%, y%, color, number)
    # side: 'r' = label to the right of dot, 'l' = label to the left (for right-side dots)
    dots = [
        ("Nick Schooler<br><span>BD / internal IT owner &mdash; engage first</span>", 28, 64, BLUE, "1", "r"),
        ("Sebastien Goulet<br><span>Chairman &amp; CEO</span>", 60, 86, CRITICAL, "2", "l"),
        ("Tom Hope<br><span>Director of Sales</span>", 54, 70, ORANGE, "3", "l"),
        ("LE Agency IT Director<br><span>joint end-customer</span>", 80, 30, TEAL, "4", "l"),
        ("Prime Integrator<br><span>channel partner</span>", 72, 50, PURPLE, "5", "l"),
    ]
    plot = ""
    for label, x, y, color, n, side in dots:
        plot += f"""
        <div class="dot" style="left:{x}%; bottom:{y}%; border-color:{color};">
          <span class="num" style="background:{color};">{n}</span>
          <div class="dlab {side}">{label}</div>
        </div>"""
    body = f"""
    <div class="title">The Joint Go-to-Market <span class="o">Buyer Map</span></div>
    <div class="sub">Who moves the CardLogix &times; Technijian partnership &mdash; and in what order to engage them</div>
    <div class="chart">
      <div class="yaxis">Account Influence &#8593;</div>
      <div class="xaxis">Deal Readiness: engage now &#8594;</div>
      <div class="grid">
        <div class="ql tl">Champion &amp; sponsor<br>(warm, then escalate)</div>
        <div class="ql tr">Decision-makers<br>(highest priority)</div>
        <div class="ql bl">Influence later</div>
        <div class="ql br">Activate via partnership</div>
        {plot}
      </div>
    </div>
    <style>
    .chart {{ position:relative; margin-top:30px; height:640px; padding-left:42px; padding-bottom:38px; }}
    .yaxis {{ position:absolute; left:-2px; top:50%; transform:rotate(-90deg) translateX(50%);
      transform-origin:left center; font-weight:700; color:{BLUE}; font-size:15px; white-space:nowrap; }}
    .xaxis {{ position:absolute; bottom:0; left:50%; transform:translateX(-50%);
      font-weight:700; color:{BLUE}; font-size:15px; }}
    .grid {{ position:relative; height:600px; margin-left:42px;
      border-left:3px solid {DARK}; border-bottom:3px solid {DARK};
      background:
        linear-gradient(90deg, transparent 49.7%, {LIGHT} 49.7%, {LIGHT} 50.3%, transparent 50.3%),
        linear-gradient(0deg, transparent 49.7%, {LIGHT} 49.7%, {LIGHT} 50.3%, transparent 50.3%),
        {OFFWHITE}; }}
    .ql {{ position:absolute; font-size:13px; font-weight:700; color:{GREY}; opacity:.55;
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
    # x = Managed-services / IT ecosystem depth (low -> high)
    # y = Credentialing-grade hardware depth (low -> high)
    # side: 'r' label right of dot, 'l' label left of dot
    # left cluster = card-maker peers (hardware, little managed-services depth)
    # HID = lone incumbent top-right; CardLogix+Technijian = challenger moving right
    dots = [
        ("CardLogix today", 15, 80, ORANGE, "PIV / FIDO2 / FRAC / BIOSID", "r"),
        ("Identiv", 40, 62, GREY, "Hirsch uTrust FIDO2", "r"),
        ("Tx Systems", 27, 52, GREY, "CJIS card distributor", "r"),
        ("Yubico", 38, 32, GREY, "YubiKey FIDO2 (volume)", "r"),
        ("HID Global", 84, 70, DARK, "Full-ecosystem incumbent", "l"),
        ("CardLogix + Technijian", 70, 92, BLUE, "Hardware + managed CJIS wrap", "l"),
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
    <div class="sub">Card-maker peers cluster on hardware alone. HID is the lone incumbent with the full wrap &mdash; the partnership is how CardLogix joins it.</div>
    <div class="chart">
      <div class="yaxis">Credentialing-grade hardware depth &#8593;</div>
      <div class="xaxis">Managed-services / CJIS-IT ecosystem depth &#8594;</div>
      <div class="grid">
        <div class="peercluster">Card-maker peers:<br><span>strong hardware, thin managed-services depth</span></div>
        <div class="movenote">The move &#8594;<br><span>adding Technijian's managed wrap shifts<br>CardLogix right, into HID's lane</span></div>
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
    .peercluster {{ position:absolute; left:4%; bottom:10%; width:210px; text-align:center;
      border:1px dashed {GREY}; border-radius:10px; padding:10px 8px; color:{GREY};
      font-size:13px; font-weight:800; background:rgba(89,89,91,.04); }}
    .peercluster span {{ font-size:11px; font-weight:600; color:{GREY}; }}
    .movenote {{ position:absolute; right:4%; bottom:34%; width:250px; text-align:center;
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
    W, H = 1280, 900
    cols = [
        ("INBOUND", TEAL, "search", "Authority for named buyers", [
            ("fileText", "AEO/SEO on the exact CJIS &amp; PIV questions LE IT teams ask"),
            ("target", "Get cited by AI engines as the CJIS-MFA answer"),
            ("network", "Co-branded content with integrator partners"),
        ]),
        ("OUTBOUND", ORANGE, "radar", "Account intelligence, not lead-gen", [
            ("radar", "Trigger monitoring: agency grant cycles, CJIS audit deadlines"),
            ("fileText", "RFP / grant-response auto-drafting for joint deals"),
            ("users", "Pre-meeting account dossiers on named agencies"),
        ]),
        ("INTERNAL", BLUE, "cpu", "Evidence &amp; knowledge engine", [
            ("shield", "AI-assisted CJIS audit-evidence packs"),
            ("brain", "Knowledge graph: CJIS policy &times; each agency's controls"),
            ("checkCircle", "Card-lifecycle &amp; provisioning automation"),
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
    <div class="title">CardLogix AI <span class="o">Growth Engine</span></div>
    <div class="sub">Account-based (ABM): AI sits <i>under</i> the named-account strategy &mdash; it does not replace the relationship layer.</div>
    <div class="cols">{colhtml}</div>
    <div class="arrows">&#9660;&nbsp;&nbsp;&nbsp;&nbsp;&#9660;&nbsp;&nbsp;&nbsp;&nbsp;&#9660;</div>
    <div class="pipe">{icon('handshake','#fff',26)}<span>Joint Partnership Pipeline &mdash; more LE deals won, faster, with the full managed-CJIS story</span></div>
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
        ("PHASE 1", "Foundation", "0&ndash;90 days", BLUE, "shield", [
            "Free IT assessment of CardLogix's own environment",
            "Co-managed IT stood up (Track A land)",
            "CJIS-control gap map built from CMMC baseline",
        ]),
        ("PHASE 2", "Joint Pilot", "90&ndash;180 days", ORANGE, "handshake", [
            "One joint LE-agency pilot: cards + managed-CJIS wrap",
            "AI account-intelligence + RFP engine live",
            "Audit-evidence automation proven on the pilot",
        ]),
        ("PHASE 3", "Scale", "180&ndash;365 days", TEAL, "rocket", [
            "Repeatable channel playbook with integrators",
            "CJIS practice formalized inside My Compliance",
            "Multi-agency roll-out; co-sell motion at scale",
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
    <div class="sub">Land Track A first; prove the joint motion on one pilot; then scale the channel play.</div>
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
    print("Rendering CDLX diagrams ->", os.path.relpath(OUT, HERE))
    personas()
    competitive()
    architecture()
    timeline()
    print("Done.")
