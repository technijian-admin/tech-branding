"""
COB — Core Benefits AI Growth Blueprint
Diagram generator: renders 3 diagrams via Playwright → PNG
Run: py -3.12 generate-diagrams.py
"""
import os, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "diagrams"
OUT.mkdir(exist_ok=True)

BLUE    = "#006DB6"
ORANGE  = "#F67D4B"
TEAL    = "#1EAAC8"
CHARCOAL= "#1A1A2E"
GREY    = "#59595B"
OFF_WHITE="#F8F9FA"
WHITE   = "#FFFFFF"
LIGHT   = "#E9ECEF"
RED     = "#CC0000"
CHART   = "#CBDB2D"
GREEN   = "#28A745"
GOLD    = "#C9922A"
PURPLE  = "#7B2D8B"

FONT = "Plus Jakarta Sans, Open Sans, sans-serif"

def render(html, path, width=1200, height=700):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.set_content(html)
        page.wait_for_timeout(600)
        page.screenshot(path=str(path), full_page=False)
        browser.close()
    print(f"  OK {path.name}")

GOOGLE_FONTS = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">'
BASE_STYLE = f"""
  body {{ margin:0; padding:0; background:{WHITE}; font-family:{FONT}; }}
  * {{ box-sizing: border-box; }}
"""

# ─────────────────────────────────────────────────────────────
# DIAGRAM 1: Employer Personas — Volume × Annual Revenue Scatter
# ─────────────────────────────────────────────────────────────
personas_html = f"""<!DOCTYPE html><html><head>{GOOGLE_FONTS}<style>
{BASE_STYLE}
.chart-wrap {{ width:1200px; height:700px; display:flex; flex-direction:column; padding:32px 48px 32px 48px; }}
.title {{ font-size:22px; font-weight:800; color:{CHARCOAL}; margin-bottom:4px; }}
.subtitle {{ font-size:14px; color:{GREY}; margin-bottom:24px; }}
.chart-area {{ flex:1; position:relative; border-left:2px solid {LIGHT}; border-bottom:2px solid {LIGHT}; margin-left:60px; margin-right:40px; margin-bottom:40px; }}
.y-label {{ position:absolute; left:-58px; top:50%; transform:translateY(-50%) rotate(-90deg); font-size:13px; color:{GREY}; white-space:nowrap; }}
.x-label {{ position:absolute; bottom:-34px; left:50%; transform:translateX(-50%); font-size:13px; color:{GREY}; }}
.dot {{ position:absolute; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:800; color:{WHITE}; box-shadow:0 3px 12px rgba(0,0,0,0.18); cursor:default; }}
.label-box {{ position:absolute; background:{WHITE}; border:1.5px solid {LIGHT}; border-radius:8px; padding:10px 14px; max-width:190px; box-shadow:0 2px 8px rgba(0,0,0,0.08); }}
.lb-name {{ font-size:13px; font-weight:700; color:{CHARCOAL}; margin-bottom:3px; }}
.lb-desc {{ font-size:11px; color:{GREY}; line-height:1.4; }}
.axis-tick {{ position:absolute; font-size:11px; color:{GREY}; }}
</style></head><body>
<div class="chart-wrap">
  <div class="title">The Four Employer Types Core Benefits Serves</div>
  <div class="subtitle">Prospect Volume (horizontal) × Annual Revenue per Client (vertical) — illustrative positioning</div>
  <div class="chart-area">
    <div class="y-label">Annual Revenue to Core Benefits ▲</div>
    <div class="x-label">Prospect Volume in OC Market ▶</div>

    <!-- axis labels -->
    <div class="axis-tick" style="bottom:-18px;left:0">Low</div>
    <div class="axis-tick" style="bottom:-18px;right:0">High</div>
    <div class="axis-tick" style="top:0;left:-52px">High</div>
    <div class="axis-tick" style="bottom:0;left:-52px">Low</div>

    <!-- Dot 1: HR Overwhelm — High Volume, Medium Revenue (right-center) -->
    <div class="dot" style="width:70px;height:70px;background:{BLUE};bottom:38%;right:12%;">1</div>
    <div class="label-box" style="bottom:55%;right:2%;">
      <div class="lb-name" style="color:{BLUE};">The HR Overwhelm</div>
      <div class="lb-desc">HR Director at 50–150 EE company; needs broker as team extension; most common in OC</div>
    </div>

    <!-- Dot 2: Cost-Driven CFO — Medium-High Volume, High Revenue (center-high) -->
    <div class="dot" style="width:70px;height:70px;background:{ORANGE};top:10%;left:40%;">2</div>
    <div class="label-box" style="top:22%;left:32%;">
      <div class="lb-name" style="color:{ORANGE};">The Cost-Driven CFO</div>
      <div class="lb-desc">CFO/CEO at 75–300 EE firm; facing 15–20% renewal increases; wants a data story not carrier guesswork</div>
    </div>

    <!-- Dot 3: PEO Refugee — Medium Volume, High Revenue (left-high) -->
    <div class="dot" style="width:70px;height:70px;background:{TEAL};top:18%;left:14%;">3</div>
    <div class="label-box" style="top:32%;left:4%;">
      <div class="lb-name" style="color:{TEAL};">The PEO Refugee</div>
      <div class="lb-desc">Exiting TriNet / Insperity / ADP TotalSource; frustrated with opaque costs and limited plan flexibility</div>
    </div>

    <!-- Dot 4: Compliance-Anxious Owner — Medium Volume, Medium Revenue (center) -->
    <div class="dot" style="width:70px;height:70px;background:{RED};bottom:32%;left:42%;">4</div>
    <div class="label-box" style="bottom:16%;left:34%;">
      <div class="lb-name" style="color:{RED};">The Compliance-Anxious Owner</div>
      <div class="lb-desc">Owner/controller nervous about ACA, ERISA, DOL audit exposure; "I can't afford a $2,500/day penalty"</div>
    </div>

    <!-- Quadrant lines -->
    <div style="position:absolute;top:50%;left:0;right:0;border-top:1px dashed {LIGHT};"></div>
    <div style="position:absolute;left:50%;top:0;bottom:0;border-left:1px dashed {LIGHT};"></div>
  </div>

  <!-- legend -->
  <div style="display:flex;gap:24px;justify-content:center;margin-top:8px;">
    <div style="display:flex;align-items:center;gap:8px;"><div style="width:16px;height:16px;border-radius:50%;background:{BLUE}"></div><span style="font-size:12px;color:{GREY};">1 The HR Overwhelm</span></div>
    <div style="display:flex;align-items:center;gap:8px;"><div style="width:16px;height:16px;border-radius:50%;background:{ORANGE}"></div><span style="font-size:12px;color:{GREY};">2 The Cost-Driven CFO</span></div>
    <div style="display:flex;align-items:center;gap:8px;"><div style="width:16px;height:16px;border-radius:50%;background:{TEAL}"></div><span style="font-size:12px;color:{GREY};">3 The PEO Refugee</span></div>
    <div style="display:flex;align-items:center;gap:8px;"><div style="width:16px;height:16px;border-radius:50%;background:{RED}"></div><span style="font-size:12px;color:{GREY};">4 The Compliance-Anxious Owner</span></div>
  </div>
</div>
</body></html>"""

# ─────────────────────────────────────────────────────────────
# DIAGRAM 2: AI Growth Engine Architecture
# ─────────────────────────────────────────────────────────────
arch_html = f"""<!DOCTYPE html><html><head>{GOOGLE_FONTS}<style>
{BASE_STYLE}
.wrap {{ width:1200px; height:700px; padding:28px 40px; display:flex; flex-direction:column; }}
.title {{ font-size:20px; font-weight:800; color:{CHARCOAL}; margin-bottom:6px; }}
.subtitle {{ font-size:13px; color:{GREY}; margin-bottom:20px; }}
.cols {{ display:flex; gap:16px; flex:1; }}
.col {{ flex:1; border-radius:10px; padding:0; overflow:hidden; display:flex; flex-direction:column; }}
.col-head {{ padding:16px 20px; font-size:15px; font-weight:700; color:{WHITE}; }}
.col-body {{ padding:14px 16px; flex:1; background:{OFF_WHITE}; display:flex; flex-direction:column; gap:10px; }}
.item {{ background:{WHITE}; border-radius:6px; padding:10px 12px; border-left:3px solid; }}
.item-title {{ font-size:13px; font-weight:700; margin-bottom:3px; }}
.item-body {{ font-size:11.5px; color:{GREY}; line-height:1.4; }}
.arrow {{ text-align:center; font-size:22px; padding-top:6px; color:{GREY}; }}
.bottom-bar {{ margin-top:14px; background:{CHARCOAL}; border-radius:8px; padding:10px 20px; display:flex; align-items:center; justify-content:space-between; }}
.bb-label {{ font-size:12px; color:rgba(255,255,255,0.7); }}
.bb-val {{ font-size:13px; font-weight:700; color:{WHITE}; }}
</style></head><body>
<div class="wrap">
  <div class="title">Core Benefits AI Growth Engine — Three-Channel Architecture</div>
  <div class="subtitle">Account-based strategy: authority content + employer intelligence + AI-powered service delivery</div>
  <div class="cols">
    <!-- Col 1: Inbound -->
    <div class="col">
      <div class="col-head" style="background:{BLUE};">📡 Get Cited — Inbound Authority</div>
      <div class="col-body">
        <div class="item" style="border-color:{BLUE};">
          <div class="item-title" style="color:{BLUE};">AEO / SEO Content Engine</div>
          <div class="item-body">AI-generated compliance content: ACA filing deadlines, CAA disclosure guides, self-funded plan explainers — so Core Benefits is the answer ChatGPT/Perplexity/Google cites</div>
        </div>
        <div class="item" style="border-color:{BLUE};">
          <div class="item-title" style="color:{BLUE};">LinkedIn Thought Leadership</div>
          <div class="item-body">Weekly compliance insights (ACA, ERISA, PCORI updates) targeting OC HR Directors + CFOs. 42 followers → 500+ in 90 days</div>
        </div>
        <div class="item" style="border-color:{BLUE};">
          <div class="item-title" style="color:{BLUE};">Google Business Profile</div>
          <div class="item-body">Claim + optimize for "employee benefits broker Orange County" — capture the local search employer-audience that currently finds competitors</div>
        </div>
        <div class="item" style="border-color:{BLUE};">
          <div class="item-title" style="color:{BLUE};">PR & Content Syndication</div>
          <div class="item-body">Quarterly compliance briefings distributed to 300+ outlets → establishes Core Benefits as the go-to OC benefits expert</div>
        </div>
      </div>
    </div>
    <!-- Col 2: Outbound -->
    <div class="col">
      <div class="col-head" style="background:{ORANGE};">🎯 Win the Account — Outbound Intelligence</div>
      <div class="col-body">
        <div class="item" style="border-color:{ORANGE};">
          <div class="item-title" style="color:{ORANGE};">Employer Account Intelligence</div>
          <div class="item-body">AI monitors named OC employers (50–300 EE) for trigger signals: job postings with "benefits" keywords, PEO contract expiry language, Glassdoor complaints about benefits</div>
        </div>
        <div class="item" style="border-color:{ORANGE};">
          <div class="item-title" style="color:{ORANGE};">CPA Referral Program AI</div>
          <div class="item-body">Harvest + score 50–100 OC CPA firms whose SMB clients are in Core Benefits' sweet spot; systematic outreach with compliance-framed value props CPAs can share</div>
        </div>
        <div class="item" style="border-color:{ORANGE};">
          <div class="item-title" style="color:{ORANGE};">PEO Exit Trigger Monitoring</div>
          <div class="item-body">TriNet / Insperity / ADP TotalSource client dissatisfaction signals (Glassdoor, LinkedIn departures, industry forums) → alert Core Benefits when exit timing is right</div>
        </div>
        <div class="item" style="border-color:{ORANGE};">
          <div class="item-title" style="color:{ORANGE};">Pre-Meeting Account Dossiers</div>
          <div class="item-body">AI-assembled profile of each prospect employer: industry, headcount, estimated premium spend, likely plan gaps, DOL filing history — delivered before every outreach call</div>
        </div>
      </div>
    </div>
    <!-- Col 3: Internal -->
    <div class="col">
      <div class="col-head" style="background:{TEAL};">⚙️ Keep &amp; Expand — AI Service Delivery</div>
      <div class="col-body">
        <div class="item" style="border-color:{TEAL};">
          <div class="item-title" style="color:{TEAL};">Claims Analytics Dashboard</div>
          <div class="item-body">Replace carrier-comparison spreadsheets: AI analyzes claims data, identifies top cost drivers, produces a client-ready data story before every renewal meeting</div>
        </div>
        <div class="item" style="border-color:{TEAL};">
          <div class="item-title" style="color:{TEAL};">AI Renewal Analysis</div>
          <div class="item-body">Multi-carrier rate comparison + trend modeling in hours not days. TJ's analysis time drops 85%; every employer client gets a data-backed renewal recommendation</div>
        </div>
        <div class="item" style="border-color:{TEAL};">
          <div class="item-title" style="color:{TEAL};">ACA / ERISA Compliance Auto-Monitor</div>
          <div class="item-body">AI tracks regulatory changes (CAA, PCORI fee updates, 1095-C deadlines) and alerts clients — Core Benefits becomes the compliance safety net, not just the plan picker</div>
        </div>
        <div class="item" style="border-color:{TEAL};">
          <div class="item-title" style="color:{TEAL};">Employee Benefits FAQ Chatbot</div>
          <div class="item-body">Deployed on each employer-client's HR portal: answers "what does my plan cover?", "is this provider in-network?", "how do I submit a claim?" — reduces HR admin calls by 60%+</div>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom-bar">
    <div><div class="bb-label">Powered by</div><div class="bb-val">My SEO + My AI + My Dev — Technijian</div></div>
    <div><div class="bb-label">GTM Motion</div><div class="bb-val">Account-Based (ABM) — not shotgun lead gen</div></div>
    <div><div class="bb-label">Target</div><div class="bb-val">50–300 Employee OC Employers</div></div>
    <div><div class="bb-label">Y1 Goal</div><div class="bb-val">2–3 New Employer Clients</div></div>
  </div>
</div>
</body></html>"""

# ─────────────────────────────────────────────────────────────
# DIAGRAM 3: Implementation Timeline
# ─────────────────────────────────────────────────────────────
timeline_html = f"""<!DOCTYPE html><html><head>{GOOGLE_FONTS}<style>
{BASE_STYLE}
.wrap {{ width:1200px; height:420px; padding:30px 50px 24px 50px; }}
.title {{ font-size:20px; font-weight:800; color:{CHARCOAL}; margin-bottom:4px; }}
.subtitle {{ font-size:13px; color:{GREY}; margin-bottom:28px; }}
.track {{ position:relative; height:32px; border-radius:16px; overflow:hidden; display:flex; }}
.phase {{ display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:{WHITE}; }}
.milestones {{ display:flex; margin-top:20px; gap:0; }}
.m-col {{ flex:1; padding:0 8px; }}
.m-header {{ font-size:12px; font-weight:700; padding-bottom:8px; border-bottom:2px solid; margin-bottom:10px; }}
.m-item {{ font-size:11.5px; color:{GREY}; margin-bottom:6px; padding-left:12px; position:relative; line-height:1.4; }}
.m-item::before {{ content:"▸"; position:absolute; left:0; }}
.outcome {{ margin-top:20px; display:flex; gap:12px; }}
.o-box {{ flex:1; border-radius:8px; padding:10px 14px; text-align:center; }}
.o-label {{ font-size:11px; color:rgba(255,255,255,0.8); margin-bottom:4px; }}
.o-val {{ font-size:13px; font-weight:700; color:{WHITE}; }}
</style></head><body>
<div class="wrap">
  <div class="title">Core Benefits × Technijian — Implementation Roadmap</div>
  <div class="subtitle">Three phases from foundation to new employer acquisition, paced to Core Benefits' capacity</div>

  <div class="track">
    <div class="phase" style="flex:1;background:{BLUE};">Phase 1 — Foundation  ·  Days 1–90</div>
    <div style="width:2px;background:{WHITE};"></div>
    <div class="phase" style="flex:1;background:{ORANGE};">Phase 2 — Intelligence  ·  Days 90–180</div>
    <div style="width:2px;background:{WHITE};"></div>
    <div class="phase" style="flex:1;background:{TEAL};">Phase 3 — Growth  ·  Days 180–270</div>
  </div>

  <div class="milestones">
    <div class="m-col">
      <div class="m-header" style="color:{BLUE};border-color:{BLUE};">FOUNDATION</div>
      <div class="m-item">Website SEO audit + on-page optimization</div>
      <div class="m-item">AI Search Optimization layer deployed</div>
      <div class="m-item">Google Business Profile claimed + enhanced</div>
      <div class="m-item">LinkedIn content calendar launched (weekly compliance posts)</div>
      <div class="m-item">Executive AI Workshop — Core Benefits team</div>
      <div class="m-item">Claims data baseline established for 3 pilot clients</div>
    </div>
    <div class="m-col">
      <div class="m-header" style="color:{ORANGE};border-color:{ORANGE};">INTELLIGENCE</div>
      <div class="m-item">Account intelligence engine operational (50 target OC employers)</div>
      <div class="m-item">CPA referral outreach program launched (25 target CPA firms)</div>
      <div class="m-item">PEO exit trigger monitoring live</div>
      <div class="m-item">First AI-powered renewal analysis delivered (pilot clients)</div>
      <div class="m-item">ACA/ERISA compliance auto-monitoring deployed</div>
      <div class="m-item">Pre-meeting account dossier template operational</div>
    </div>
    <div class="m-col">
      <div class="m-header" style="color:{TEAL};border-color:{TEAL};">GROWTH</div>
      <div class="m-item">Claims Analytics Portal development begins (My Dev)</div>
      <div class="m-item">First 1–2 new employer clients onboarded via AI-assisted pipeline</div>
      <div class="m-item">Employee FAQ chatbot piloted on 2 employer portals</div>
      <div class="m-item">Content authority visible in AI search citations (AEO)</div>
      <div class="m-item">CPA referral program delivering qualified introductions</div>
      <div class="m-item">Expansion plan reviewed: portal rollout + advisor retainer growth</div>
    </div>
  </div>

  <div class="outcome">
    <div class="o-box" style="background:{BLUE};">
      <div class="o-label">Phase 1 Outcome</div>
      <div class="o-val">Visible + Credible Online</div>
    </div>
    <div class="o-box" style="background:{ORANGE};">
      <div class="o-label">Phase 2 Outcome</div>
      <div class="o-val">Pipeline Intelligence Active</div>
    </div>
    <div class="o-box" style="background:{TEAL};">
      <div class="o-label">Phase 3 Outcome</div>
      <div class="o-val">New Employers Acquired</div>
    </div>
  </div>
</div>
</body></html>"""

print("Generating COB diagrams...")
render(personas_html,  OUT / "personas.png",      width=1200, height=700)
render(arch_html,      OUT / "architecture.png",   width=1200, height=700)
render(timeline_html,  OUT / "timeline.png",       width=1200, height=420)
print("All diagrams generated.")
