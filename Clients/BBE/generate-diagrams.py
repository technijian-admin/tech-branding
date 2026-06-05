"""
BBE — Boberg Engineering & Contracting
Diagram generator: 3 PNGs rendered via Playwright (HTML+CSS+Lucide icons)
  1. diagrams/personas.png   — Persona Volume × Margin quadrant
  2. diagrams/architecture.png — AI Bid & Growth Engine (3-column)
  3. diagrams/timeline.png   — 90/180/270-day implementation roadmap
"""

import os
import sys
import subprocess
from pathlib import Path

DIAGRAMS_DIR = Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');"

# ─── Brand colours ────────────────────────────────────────────────────────────
BLUE   = "#006DB6"
ORANGE = "#F67D4B"
TEAL   = "#1EAAC8"
CHART  = "#8BC34A"
DARK   = "#1A1A2E"
GREY   = "#5A6474"
OFFWH  = "#F8F9FA"
WHITE  = "#FFFFFF"
CRIT   = "#CC0000"

# ─── Render helper ────────────────────────────────────────────────────────────
def render(html: str, out_path: Path, width: int = 1200, height: int = 700):
    """Render HTML string to PNG via Playwright (Chromium)."""
    import importlib.util
    if importlib.util.find_spec("playwright") is None:
        print(f"playwright not found; skipping {out_path.name}")
        return
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.set_content(html)
        page.wait_for_timeout(800)
        # Auto-crop to content
        page.screenshot(path=str(out_path), full_page=True)
        browser.close()
    print(f"  Rendered: {out_path.name}")

# ─── Auto-crop helper ─────────────────────────────────────────────────────────
def autocrop(path: Path, pad: int = 20):
    try:
        from PIL import Image
        img = Image.open(path).convert("RGBA")
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        diff = Image.new("RGBA", img.size)
        from PIL import ImageChops
        diff = ImageChops.difference(img, bg)
        bbox = diff.getbbox()
        if bbox:
            x0 = max(0, bbox[0] - pad)
            y0 = max(0, bbox[1] - pad)
            x1 = min(img.width,  bbox[2] + pad)
            y1 = min(img.height, bbox[3] + pad)
            img.crop((x0, y0, x1, y1)).convert("RGB").save(path)
            print(f"  Cropped:  {path.name}  ({x1-x0}×{y1-y0}px)")
    except ImportError:
        pass  # Pillow not installed; skip crop

# ══════════════════════════════════════════════════════════════════════════════
# DIAGRAM 1 — Personas: Volume × Margin quadrant
# ══════════════════════════════════════════════════════════════════════════════
PERSONAS_HTML = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
{FONT_IMPORT}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: {WHITE}; padding: 40px; }}
h2 {{ font-size: 18px; font-weight: 700; color: {DARK}; margin-bottom: 4px; text-align: center; }}
p.sub {{ font-size: 12px; color: {GREY}; text-align: center; margin-bottom: 28px; }}
.chart-wrap {{ position: relative; width: 880px; height: 520px; margin: 0 auto; border: 2px solid #E2E8F0; border-radius: 8px; background: {OFFWH}; }}
.axis-label {{ position: absolute; font-size: 11px; font-weight: 600; color: {GREY}; letter-spacing: 0.08em; text-transform: uppercase; }}
.x-label {{ bottom: 10px; left: 50%; transform: translateX(-50%); }}
.y-label {{ left: 6px; top: 50%; transform: translateY(-50%) rotate(-90deg); }}
.x-lo {{ bottom: 28px; left: 16px; font-size: 10px; color: #94A3B8; }}
.x-hi {{ bottom: 28px; right: 16px; font-size: 10px; color: #94A3B8; }}
.y-lo {{ top: unset; bottom: 16px; left: 28px; font-size: 10px; color: #94A3B8; transform: none; }}
.y-hi {{ top: 16px; left: 28px; font-size: 10px; color: #94A3B8; transform: none; }}
.mid-v {{ position: absolute; left: 50%; top: 8%; bottom: 8%; width: 1px; background: #CBD5E1; }}
.mid-h {{ position: absolute; top: 50%; left: 8%; right: 8%; height: 1px; background: #CBD5E1; }}
.bubble {{ position: absolute; border-radius: 50%; display: flex; align-items: center; justify-content: center;
           font-size: 13px; font-weight: 700; color: {WHITE}; cursor: default; transition: transform 0.2s; }}
.label {{ position: absolute; font-size: 11px; font-weight: 600; color: {DARK}; text-align: center; width: 130px; line-height: 1.3; }}
.quad-label {{ position: absolute; font-size: 10px; font-weight: 600; color: #CBD5E1; letter-spacing: 0.06em; text-transform: uppercase; }}
</style>
</head>
<body>
<h2>Four Buyer Personas — Prospect Volume × Revenue to Boberg</h2>
<p class="sub">Bubble size = estimated relationship value; position = bid volume × project margin profile</p>
<div class="chart-wrap">
  <!-- Axis lines -->
  <div class="mid-v"></div>
  <div class="mid-h"></div>
  <!-- Axis labels -->
  <span class="axis-label x-label">Bid Volume (Invitations Received per Year)</span>
  <span class="axis-label y-label">Project Margin Potential</span>
  <span class="axis-label x-lo">Lower Volume</span>
  <span class="axis-label x-hi">Higher Volume</span>
  <span class="axis-label y-lo">Lower Margin</span>
  <span class="axis-label y-hi">Higher Margin</span>
  <!-- Quadrant ghost labels -->
  <span class="quad-label" style="top:12%; left:52%; opacity:0.5;">High Volume · High Margin</span>
  <span class="quad-label" style="top:12%; left:12%; opacity:0.5;">Low Volume · High Margin</span>
  <span class="quad-label" style="bottom:12%; left:52%; opacity:0.5;">High Volume · Low Margin</span>
  <span class="quad-label" style="bottom:12%; left:12%; opacity:0.5;">Low Volume · Low Margin</span>

  <!-- P1: GC Estimator — high volume, medium margin (bottom-right area) -->
  <div class="bubble" style="width:90px;height:90px;background:{BLUE};left:62%;top:52%;">1</div>
  <div class="label" style="left:54%;top:78%;">GC Estimator / Pre-Con Lead</div>

  <!-- P2: Industrial Developer — low-medium volume, high margin (top-left area) -->
  <div class="bubble" style="width:80px;height:80px;background:{ORANGE};left:18%;top:12%;">2</div>
  <div class="label" style="left:8%;top:38%;">Industrial Developer / Owner Rep</div>

  <!-- P3: GC Principal — medium volume, high margin (top-right) -->
  <div class="bubble" style="width:85px;height:85px;background:{TEAL};left:54%;top:10%;">3</div>
  <div class="label" style="left:50%;top:36%;">GC Principal / VP Construction</div>

  <!-- P4: Commercial Developer — medium volume, medium margin -->
  <div class="bubble" style="width:72px;height:72px;background:{CHART};left:32%;top:42%;">4</div>
  <div class="label" style="left:22%;top:65%;">Commercial Developer Retail / Medical / Office</div>
</div>
</body>
</html>"""

# ══════════════════════════════════════════════════════════════════════════════
# DIAGRAM 2 — AI Bid & Growth Engine Architecture
# ══════════════════════════════════════════════════════════════════════════════
ARCH_HTML = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
{FONT_IMPORT}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: {WHITE}; padding: 32px 36px; }}
h2 {{ font-size: 17px; font-weight: 700; color: {DARK}; text-align: center; margin-bottom: 6px; }}
p.sub {{ font-size: 11px; color: {GREY}; text-align: center; margin-bottom: 24px; }}
.grid {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }}
.col {{ background: {OFFWH}; border-radius: 10px; padding: 0; overflow: hidden; }}
.col-head {{ padding: 14px 16px; text-align: center; }}
.col-head .icon {{ font-size: 22px; margin-bottom: 4px; }}
.col-head h3 {{ font-size: 14px; font-weight: 700; color: {WHITE}; margin: 0; }}
.col-head p {{ font-size: 11px; color: rgba(255,255,255,0.85); margin: 3px 0 0; }}
.items {{ padding: 14px 16px; }}
.item {{ background: {WHITE}; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; border-left: 3px solid transparent; }}
.item h4 {{ font-size: 12px; font-weight: 700; color: {DARK}; margin-bottom: 3px; }}
.item p {{ font-size: 11px; color: {GREY}; line-height: 1.45; margin: 0; }}
.svc-badge {{ display: inline-block; font-size: 9px; font-weight: 700; border-radius: 3px; padding: 2px 6px; margin-top: 5px; color: {WHITE}; }}
.footer-bar {{ margin-top: 20px; background: {DARK}; border-radius: 8px; padding: 12px 20px; display: flex; align-items: center; justify-content: center; gap: 12px; }}
.footer-bar span {{ font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.75); }}
.footer-bar strong {{ color: {WHITE}; font-size: 12px; }}
.dot {{ width: 6px; height: 6px; border-radius: 50%; background: {ORANGE}; }}
</style>
</head>
<body>
<h2>How AI Transforms Boberg's Bid & Growth Engine</h2>
<p class="sub">Three channels — all ABM-framed for Boberg's known universe of GC and developer targets</p>
<div class="grid">

  <!-- INBOUND -->
  <div class="col">
    <div class="col-head" style="background:{BLUE};">
      <div class="icon">🎯</div>
      <h3>Inbound — Authority</h3>
      <p>Get found &amp; verified by GC estimators before the bid invite</p>
    </div>
    <div class="items">
      <div class="item" style="border-left-color:{BLUE};">
        <h4>AEO / SEO Content Engine</h4>
        <p>Technical articles GC estimators actually search — "commercial grading contractor SoCal," "earthwork sub warehouse IE." BBE becomes the cited authority.</p>
        <span class="svc-badge" style="background:{BLUE};">My SEO</span>
      </div>
      <div class="item" style="border-left-color:{BLUE};">
        <h4>LinkedIn Professional Authority</h4>
        <p>Bi-weekly project spotlights + earthwork insight posts targeting GC estimators and industrial developers. 58 → 500+ followers in 6 months.</p>
        <span class="svc-badge" style="background:{BLUE};">My SEO</span>
      </div>
      <div class="item" style="border-left-color:{BLUE};">
        <h4>BuildZoom &amp; Pre-Qual Presence</h4>
        <p>AI-optimized pre-qualification profile across ConstructConnect, Dodge, PlanetBids — so BBE lands on every estimator's default sub list.</p>
        <span class="svc-badge" style="background:{BLUE};">My SEO + My AI</span>
      </div>
    </div>
  </div>

  <!-- OUTBOUND -->
  <div class="col">
    <div class="col-head" style="background:{ORANGE};">
      <div class="icon">📡</div>
      <h3>Outbound — Intelligence</h3>
      <p>Monitor named GC &amp; developer targets; act first on every bid signal</p>
    </div>
    <div class="items">
      <div class="item" style="border-left-color:{ORANGE};">
        <h4>Bid Portal Intelligence</h4>
        <p>AI scans ConstructConnect, Dodge, PlanetBids 24/7 for new projects matching BBE's sweet spot. Pre-scored alerts land in Chad's inbox 24–48 hrs before competitors see them.</p>
        <span class="svc-badge" style="background:{ORANGE};">My AI</span>
      </div>
      <div class="item" style="border-left-color:{ORANGE};">
        <h4>GC Account Intelligence</h4>
        <p>Auto-pull each target GC's project pipeline, recent permit filings, award history, and leadership changes. Pre-meeting dossiers delivered before every relationship call.</p>
        <span class="svc-badge" style="background:{ORANGE};">My AI</span>
      </div>
      <div class="item" style="border-left-color:{ORANGE};">
        <h4>Developer Trigger Monitoring</h4>
        <p>Watch for industrial permit filings, entitlement approvals, and site acquisitions by Hillwood-type developers across IE, OC, and LA — reach out before the GC is even selected.</p>
        <span class="svc-badge" style="background:{ORANGE};">My AI</span>
      </div>
    </div>
  </div>

  <!-- INTERNAL -->
  <div class="col">
    <div class="col-head" style="background:{TEAL};">
      <div class="icon">⚙️</div>
      <h3>Internal — Efficiency</h3>
      <p>Bid faster, capture institutional knowledge, reduce admin overhead</p>
    </div>
    <div class="items">
      <div class="item" style="border-left-color:{TEAL};">
        <h4>Proposal Auto-Drafting</h4>
        <p>Extract scope from project plans → auto-draft earthwork bid with BBE's standard language, alternates, and qualifications. Bid prep: 5 days → 1 day.</p>
        <span class="svc-badge" style="background:{TEAL};">My AI + My Dev</span>
      </div>
      <div class="item" style="border-left-color:{TEAL};">
        <h4>Knowledge Retention System</h4>
        <p>33 years of project data, lessons learned, and estimating rules-of-thumb captured in a searchable AI knowledge base. Institutional knowledge survives key-person transitions.</p>
        <span class="svc-badge" style="background:{TEAL};">My AI</span>
      </div>
      <div class="item" style="border-left-color:{TEAL};">
        <h4>Project Documentation AI</h4>
        <p>AI-assisted RFI responses, daily reports, and submittals. PMs spend time running projects — not typing. SWPPP and NPDES templates auto-generated per project type.</p>
        <span class="svc-badge" style="background:{TEAL};">My AI</span>
      </div>
    </div>
  </div>

</div>
<div class="footer-bar">
  <strong>Powered by Technijian</strong>
  <div class="dot"></div>
  <span>My SEO — authority &amp; discovery</span>
  <div class="dot"></div>
  <span>My AI — intelligence &amp; automation</span>
  <div class="dot"></div>
  <span>My Dev — custom bid intelligence platform</span>
</div>
</body>
</html>"""

# ══════════════════════════════════════════════════════════════════════════════
# DIAGRAM 3 — Implementation Timeline (90/180/270 days)
# ══════════════════════════════════════════════════════════════════════════════
TIMELINE_HTML = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
{FONT_IMPORT}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: {WHITE}; padding: 36px 40px; }}
h2 {{ font-size: 17px; font-weight: 700; color: {DARK}; text-align: center; margin-bottom: 4px; }}
p.sub {{ font-size: 11px; color: {GREY}; text-align: center; margin-bottom: 28px; }}
.timeline {{ position: relative; width: 100%; }}
/* Phase bar */
.bar-row {{ display: flex; gap: 0; margin-bottom: 28px; border-radius: 8px; overflow: hidden; height: 44px; }}
.bar-seg {{ flex: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: {WHITE}; letter-spacing: 0.04em; }}
/* Milestone markers below bar */
.milestones {{ display: flex; gap: 20px; }}
.phase-col {{ flex: 1; }}
.phase-col h4 {{ font-size: 12px; font-weight: 700; margin-bottom: 10px; padding: 6px 10px; border-radius: 4px; color: {WHITE}; }}
.milestone {{ background: {OFFWH}; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid transparent; }}
.milestone h5 {{ font-size: 11px; font-weight: 700; color: {DARK}; margin-bottom: 4px; }}
.milestone ul {{ padding-left: 14px; }}
.milestone ul li {{ font-size: 10px; color: {GREY}; margin-bottom: 2px; line-height: 1.4; }}
.outcome {{ margin-top: 10px; padding: 8px 10px; border-radius: 4px; font-size: 10px; font-weight: 600; color: {WHITE}; text-align: center; }}
</style>
</head>
<body>
<h2>Implementation Roadmap — 270-Day Build</h2>
<p class="sub">Entry program first · intelligence second · custom platform third</p>
<div class="timeline">
  <!-- Bar -->
  <div class="bar-row">
    <div class="bar-seg" style="background:{BLUE};">Phase 1 — Foundation · Days 1–90</div>
    <div class="bar-seg" style="background:{ORANGE};">Phase 2 — Intelligence · Days 90–180</div>
    <div class="bar-seg" style="background:{TEAL};">Phase 3 — Growth · Days 180–270</div>
  </div>
  <!-- Milestones -->
  <div class="milestones">

    <div class="phase-col">
      <h4 style="background:{BLUE};">Foundation</h4>
      <div class="milestone" style="border-left-color:{BLUE};">
        <h5>Digital Authority Baseline</h5>
        <ul>
          <li>Google Business Profile claimed + optimized</li>
          <li>LinkedIn profile rebuilt; first 3 project spotlights</li>
          <li>BuildZoom + ConstructConnect profiles updated</li>
        </ul>
      </div>
      <div class="milestone" style="border-left-color:{BLUE};">
        <h5>AI Executive Workshop</h5>
        <ul>
          <li>Map Boberg's top 20 GC/developer targets</li>
          <li>Define bid sweet spot criteria (type, size, GC tier)</li>
          <li>Prioritize AI investment sequence</li>
        </ul>
      </div>
      <div class="milestone" style="border-left-color:{BLUE};">
        <h5>My SEO Launch</h5>
        <ul>
          <li>Keyword strategy for GC estimator searches</li>
          <li>First earthwork authority article published</li>
          <li>AI Search Optimization (AEO) setup</li>
        </ul>
      </div>
      <div class="outcome" style="background:{BLUE};">Boberg is findable &amp; credible</div>
    </div>

    <div class="phase-col">
      <h4 style="background:{ORANGE};">Intelligence</h4>
      <div class="milestone" style="border-left-color:{ORANGE};">
        <h5>Bid Portal Monitoring Live</h5>
        <ul>
          <li>ConstructConnect + PlanetBids filtered feeds</li>
          <li>Daily pre-scored project alerts to Chad</li>
          <li>Industrial developer permit tracker active</li>
        </ul>
      </div>
      <div class="milestone" style="border-left-color:{ORANGE};">
        <h5>Account Intelligence Engine</h5>
        <ul>
          <li>Top 20 GC accounts with trigger monitoring</li>
          <li>Pre-meeting dossiers before relationship calls</li>
          <li>New permit/award alerts for target developers</li>
        </ul>
      </div>
      <div class="milestone" style="border-left-color:{ORANGE};">
        <h5>Proposal Template Built</h5>
        <ul>
          <li>AI-assisted bid draft from scope extract</li>
          <li>Standard BBE language + alternates library</li>
          <li>Live-tested on first real bid opportunity</li>
        </ul>
      </div>
      <div class="outcome" style="background:{ORANGE};">Boberg bids smarter &amp; faster</div>
    </div>

    <div class="phase-col">
      <h4 style="background:{TEAL};">Growth</h4>
      <div class="milestone" style="border-left-color:{TEAL};">
        <h5>Win Rate Measurement</h5>
        <ul>
          <li>Bid pipeline tracked: AI-sourced vs. traditional</li>
          <li>Win rate baseline established; AI attribution logged</li>
          <li>ROI report delivered to Chad at Day 180</li>
        </ul>
      </div>
      <div class="milestone" style="border-left-color:{TEAL};">
        <h5>Knowledge Base Deployed</h5>
        <ul>
          <li>33 years of project data ingested</li>
          <li>Estimating rules-of-thumb searchable by type</li>
          <li>Onboarding time for new estimators cut 40%</li>
        </ul>
      </div>
      <div class="milestone" style="border-left-color:{TEAL};">
        <h5>Custom Platform Scoped</h5>
        <ul>
          <li>My Dev engagement begins: Bid Intelligence Platform</li>
          <li>GC CRM + bid scoring in one tool built for earthwork subs</li>
          <li>Scale path defined: additional service lines</li>
        </ul>
      </div>
      <div class="outcome" style="background:{TEAL};">Boberg wins more &amp; retains more</div>
    </div>

  </div>
</div>
</body>
</html>"""

# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Generating BBE diagrams...")
    render(PERSONAS_HTML,  DIAGRAMS_DIR / "personas.png",      width=1000, height=700)
    autocrop(DIAGRAMS_DIR / "personas.png")
    render(ARCH_HTML,      DIAGRAMS_DIR / "architecture.png",  width=1100, height=820)
    autocrop(DIAGRAMS_DIR / "architecture.png")
    render(TIMELINE_HTML,  DIAGRAMS_DIR / "timeline.png",      width=1100, height=680)
    autocrop(DIAGRAMS_DIR / "timeline.png")
    print("Done.")

if __name__ == "__main__":
    main()
