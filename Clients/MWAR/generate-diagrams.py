"""
generate-diagrams.py — MWAR Monaco Wheel Restoration
Renders 3 diagram PNGs via Playwright (HTML/CSS, no matplotlib).
Output: Clients/MWAR/diagrams/personas.png, architecture.png, timeline.png
Usage: python Clients/MWAR/generate-diagrams.py
"""

import asyncio, os, pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

CORE_BLUE    = "#006DB6"
CORE_ORANGE  = "#F67D4B"
TEAL         = "#1EAAC8"
DARK         = "#1A1A2E"
PURPLE       = "#7B2D8B"
GOLD         = "#C9922A"
GREY_BG      = "#F5F7FA"
GREY_LINE    = "#DEE2E6"
WHITE        = "#FFFFFF"
TEXT_DARK    = "#1A1A2E"
TEXT_MED     = "#495057"


# ─── 1. PERSONAS SCATTER ──────────────────────────────────────────────────────

PERSONAS_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 900px; background: #fff; font-family: 'Segoe UI', Arial, sans-serif; }
  .chart-wrap { padding: 40px 48px 48px; }
  h2 { font-size: 18px; font-weight: 700; color: """ + TEXT_DARK + """; margin-bottom: 4px; }
  .sub { font-size: 12px; color: """ + TEXT_MED + """; margin-bottom: 32px; }
  .chart { position: relative; width: 804px; height: 440px; background: """ + GREY_BG + """;
           border: 1px solid """ + GREY_LINE + """; border-radius: 6px; }
  /* Grid lines */
  .grid-h { position: absolute; left: 60px; right: 20px; height: 1px; background: """ + GREY_LINE + """; }
  .grid-v { position: absolute; top: 10px; bottom: 50px; width: 1px; background: """ + GREY_LINE + """; }
  /* Axis labels */
  .y-label { position: absolute; left: 6px; font-size: 11px; color: """ + TEXT_MED + """; transform: translateY(50%); }
  .x-label { position: absolute; bottom: 14px; font-size: 11px; color: """ + TEXT_MED + """; transform: translateX(-50%); }
  /* Axis titles */
  .axis-title-y { position: absolute; left: -30px; top: 50%; transform: translateY(-50%) rotate(-90deg);
                  font-size: 12px; font-weight: 600; color: """ + TEXT_DARK + """; white-space: nowrap; }
  .axis-title-x { position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%);
                  font-size: 12px; font-weight: 600; color: """ + TEXT_DARK + """; }
  /* Dots */
  .dot { position: absolute; border-radius: 50%; display: flex; align-items: center; justify-content: center;
         font-size: 10px; font-weight: 700; color: #fff; cursor: default; transform: translate(-50%, -50%);
         box-shadow: 0 2px 6px rgba(0,0,0,0.25); }
  /* Legend */
  .legend { display: flex; flex-wrap: wrap; gap: 10px 20px; margin-top: 20px; }
  .leg-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: """ + TEXT_DARK + """; }
  .leg-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
  /* Tooltip labels near dots */
  .dot-label { position: absolute; font-size: 9px; font-weight: 600; color: """ + TEXT_DARK + """;
               background: rgba(255,255,255,0.88); padding: 2px 5px; border-radius: 3px;
               white-space: nowrap; transform: translate(-50%, 0); }
</style>
</head>
<body>
<div class="chart-wrap">
  <h2>Customer Persona Matrix — Frequency × Revenue per Visit</h2>
  <p class="sub">Bubble size indicates relative volume. Monaco Wheel Restoration &amp; San Clemente Wheel Repair</p>
  <div class="chart" id="chart">
    <!-- Y-axis title -->
    <span class="axis-title-y">← Revenue per Visit →</span>
    <!-- X-axis title -->
    <span class="axis-title-x">← Visit Frequency (annual) →</span>

    <!-- Grid horizontals: 5 lines at 20%, 40%, 60%, 80%, 100% of chart height (from top) -->
    <!-- Chart inner area: left=60px, right=20px, top=10px, bottom=50px → inner H=380px, inner W=724px -->
    <div class="grid-h" style="top:10px;"></div>
    <div class="grid-h" style="top:106px;"></div>
    <div class="grid-h" style="top:202px;"></div>
    <div class="grid-h" style="top:298px;"></div>
    <div class="grid-h" style="top:390px;"></div>

    <!-- Grid verticals -->
    <div class="grid-v" style="left:60px;"></div>
    <div class="grid-v" style="left:241px;"></div>
    <div class="grid-v" style="left:422px;"></div>
    <div class="grid-v" style="left:603px;"></div>
    <div class="grid-v" style="left:784px;"></div>

    <!-- Y-axis labels (revenue): $5K, $2K, $1K, $500, $125 (bottom) -->
    <span class="y-label" style="top:10px;">$5K</span>
    <span class="y-label" style="top:106px;">$2K</span>
    <span class="y-label" style="top:202px;">$1K</span>
    <span class="y-label" style="top:298px;">$500</span>
    <span class="y-label" style="top:390px;">$125</span>

    <!-- X-axis labels (frequency, annual): 0.5, 1, 2, 4+ -->
    <span class="x-label" style="left:60px;">0.5×</span>
    <span class="x-label" style="left:241px;">1×</span>
    <span class="x-label" style="left:422px;">2×</span>
    <span class="x-label" style="left:603px;">4×</span>
    <span class="x-label" style="left:784px;">6×</span>

    <!--
    Personas:
    1. Luxury Vehicle Owner  — freq=1.5×/yr, rev=$1500, vol=HIGH   → color=#006DB6
    2. Tesla Driver          — freq=1.5×/yr, rev=$800,  vol=HIGH   → color=#F67D4B
    3. Lease-Return Preparer — freq=0.75×/yr, rev=$400, vol=HIGH   → color=#1EAAC8
    4. Dealer / Lot Manager  — freq=4×/yr,  rev=$2000, vol=MED    → color=#1A1A2E
    5. Body Shop Partner     — freq=6×/yr,  rev=$600,  vol=MED    → color=#C9922A
    6. San Clemente Local    — freq=2×/yr,  rev=$250,  vol=MED    → color=#7B2D8B

    X mapping: 0.5→60, 1→241, 2→422, 4→603, 6→784  → linear: left = 60 + (freq-0.5)*(724/5.5)
    Y mapping: $125→390, $5000→10  → linear: top = 390 - (rev-125)*(380/4875)
    -->

    <!-- 1. Luxury Owner: freq=1.5, rev=1500 → x=60+(1.0*131.6)=191.6, y=390-(1375*0.0779)=390-107=283 → let me recalculate
         linear x: left = 60 + (freq - 0.5) / 5.5 * 724
         freq=1.5 → 60 + 1.0/5.5*724 = 60 + 131.6 = 192
         linear y: top = 390 - (rev - 125) / 4875 * 380
         rev=1500 → 390 - 1375/4875*380 = 390 - 107.1 = 283
    -->
    <div class="dot" style="width:56px;height:56px;background:#006DB6;left:192px;top:283px;">LUX</div>
    <div class="dot-label" style="left:192px;top:315px;">Luxury Owner</div>

    <!-- 2. Tesla Driver: freq=1.5, rev=800 → x=192, y=390-(675/4875*380)=390-52.6=337 -->
    <div class="dot" style="width:52px;height:52px;background:#F67D4B;left:214px;top:337px;">EV</div>
    <div class="dot-label" style="left:214px;top:368px;">Tesla Driver</div>

    <!-- 3. Lease-Return: freq=0.75, rev=400 → x=60+(0.25/5.5*724)=60+32.9=93, y=390-(275/4875*380)=390-21.4=369 -->
    <div class="dot" style="width:50px;height:50px;background:#1EAAC8;left:93px;top:355px;">LR</div>
    <div class="dot-label" style="left:93px;top:385px;">Lease Return</div>

    <!-- 4. Dealer: freq=4, rev=2000 → x=60+(3.5/5.5*724)=60+460.4=520, y=390-(1875/4875*380)=390-146=244 -->
    <div class="dot" style="width:48px;height:48px;background:#1A1A2E;left:520px;top:244px;">DLR</div>
    <div class="dot-label" style="left:520px;top:276px;">Dealer/Fleet</div>

    <!-- 5. Body Shop: freq=6, rev=600 → x=60+(5.5/5.5*724)=60+724=784, y=390-(475/4875*380)=390-37=353 -->
    <div class="dot" style="width:44px;height:44px;background:#C9922A;left:784px;top:353px;">BSP</div>
    <div class="dot-label" style="left:784px;top:383px;">Body Shop</div>

    <!-- 6. SC Local: freq=2, rev=250 → x=60+(1.5/5.5*724)=60+197.5=258, y=390-(125/4875*380)=390-9.7=380 -->
    <div class="dot" style="width:42px;height:42px;background:#7B2D8B;left:258px;top:375px;">SCL</div>
    <div class="dot-label" style="left:258px;top:406px;">SC Local</div>
  </div>

  <div class="legend">
    <div class="leg-item"><div class="leg-dot" style="background:#006DB6;"></div>Luxury Vehicle Owner</div>
    <div class="leg-item"><div class="leg-dot" style="background:#F67D4B;"></div>Tesla / EV Driver</div>
    <div class="leg-item"><div class="leg-dot" style="background:#1EAAC8;"></div>Lease-Return Preparer</div>
    <div class="leg-item"><div class="leg-dot" style="background:#1A1A2E;"></div>Dealer / Lot Manager</div>
    <div class="leg-item"><div class="leg-dot" style="background:#C9922A;"></div>Body Shop Partner</div>
    <div class="leg-item"><div class="leg-dot" style="background:#7B2D8B;"></div>San Clemente Local</div>
  </div>
</div>
</body>
</html>"""


# ─── 2. AI GROWTH ENGINE ARCHITECTURE ────────────────────────────────────────

ARCH_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 900px; background: #fff; font-family: 'Segoe UI', Arial, sans-serif; }
  .wrap { padding: 36px 44px 44px; }
  h2 { font-size: 18px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px; }
  .sub { font-size: 12px; color: #495057; margin-bottom: 28px; }
  .cols { display: flex; gap: 16px; }
  .col { flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .col-header { padding: 12px 16px; border-radius: 6px 6px 0 0; text-align: center;
                font-size: 13px; font-weight: 700; color: #fff; letter-spacing: 0.5px; }
  .col-body { flex: 1; background: #F5F7FA; border: 1px solid #DEE2E6; border-radius: 0 0 6px 6px;
              padding: 14px 14px; display: flex; flex-direction: column; gap: 8px; }
  .item { background: #fff; border-left: 4px solid; border-radius: 4px; padding: 10px 12px;
          font-size: 12px; }
  .item-title { font-weight: 700; font-size: 12px; margin-bottom: 3px; }
  .item-desc { color: #495057; font-size: 11px; line-height: 1.4; }
  .item-tag { display: inline-block; margin-top: 5px; padding: 2px 7px; border-radius: 10px;
              font-size: 10px; font-weight: 600; color: #fff; }
  /* Center column: AI Layer */
  .ai-col .col-header { background: #1A1A2E; }
  .ai-col .item { border-left-color: #1A1A2E; }
  .ai-col .item-title { color: #1A1A2E; }
  /* Left: Inbound */
  .in-col .col-header { background: #006DB6; }
  .in-col .item { border-left-color: #006DB6; }
  .in-col .item-title { color: #006DB6; }
  /* Right: Outbound */
  .out-col .col-header { background: #F67D4B; }
  .out-col .item { border-left-color: #F67D4B; }
  .out-col .item-title { color: #c45e2c; }
  /* Arrows between cols */
  .arrow-wrap { display: flex; align-items: center; justify-content: center; padding-top: 80px; }
  .arrow { font-size: 26px; color: #ADB5BD; }
  .badge-blue { background: #006DB6; }
  .badge-orange { background: #F67D4B; }
  .badge-teal { background: #1EAAC8; }
  .badge-dark { background: #1A1A2E; }
</style>
</head>
<body>
<div class="wrap">
  <h2>AI Growth Engine Architecture</h2>
  <p class="sub">How Technijian's AI platform transforms Monaco Wheel Restoration's customer acquisition and retention</p>

  <div class="cols">
    <!-- INBOUND -->
    <div class="col in-col">
      <div class="col-header">INBOUND</div>
      <div class="col-body">
        <div class="item">
          <div class="item-title">Local SEO Dominance</div>
          <div class="item-desc">Google Map Pack ownership in Costa Mesa, Irvine, San Clemente. GBP posts, citations, review velocity.</div>
          <span class="item-tag badge-blue">My SEO</span>
        </div>
        <div class="item">
          <div class="item-title">Photo-to-Quote AI Bot</div>
          <div class="item-desc">Customer texts a photo → AI estimates damage → quote delivered in &lt;5 min. Captures impulse moments.</div>
          <span class="item-tag badge-blue">My Dev</span>
        </div>
        <div class="item">
          <div class="item-title">Before &amp; After Content Engine</div>
          <div class="item-desc">Technician documents repair → AI formats post → auto-scheduled to Instagram, TikTok, Google.</div>
          <span class="item-tag badge-teal">My AI + My SEO</span>
        </div>
        <div class="item">
          <div class="item-title">AEO / AI Search Visibility</div>
          <div class="item-desc">"Best wheel repair San Clemente" AI answer citations. Structured FAQ content targeting Perplexity + ChatGPT answers.</div>
          <span class="item-tag badge-blue">My SEO</span>
        </div>
      </div>
    </div>

    <!-- ARROW -->
    <div class="arrow-wrap"><div class="arrow">⇄</div></div>

    <!-- AI LAYER -->
    <div class="col ai-col">
      <div class="col-header">AI LAYER — TECHNIJIAN</div>
      <div class="col-body">
        <div class="item">
          <div class="item-title">Review Velocity Engine</div>
          <div class="item-desc">SMS sent when job completes → one-tap review link → automated response to every Google/Yelp review.</div>
          <span class="item-tag badge-dark">My AI</span>
        </div>
        <div class="item">
          <div class="item-title">Weekend / After-Hours Capture</div>
          <div class="item-desc">AI chatbot handles quote requests outside M–F 8am–6pm. No lead lost to weekend competitors.</div>
          <span class="item-tag badge-dark">My Dev</span>
        </div>
        <div class="item">
          <div class="item-title">CRM &amp; Repeat Trigger</div>
          <div class="item-desc">Customer database with 6-month re-engagement. "Time for a wheel checkup?" campaign with personal text from Javon.</div>
          <span class="item-tag badge-dark">My Dev</span>
        </div>
        <div class="item">
          <div class="item-title">Two-Brand GBP Manager</div>
          <div class="item-desc">Separate Google Business Profiles, separate Yelp listings, separate keyword tracks for Monaco WR + San Clemente WR.</div>
          <span class="item-tag badge-dark">My SEO</span>
        </div>
      </div>
    </div>

    <!-- ARROW -->
    <div class="arrow-wrap"><div class="arrow">⇄</div></div>

    <!-- OUTBOUND -->
    <div class="col out-col">
      <div class="col-header">OUTBOUND</div>
      <div class="col-body">
        <div class="item">
          <div class="item-title">Dealer Outreach Automation</div>
          <div class="item-desc">Identify OC new-car dealers → AI-drafted outreach emails → wholesale account onboarding sequence.</div>
          <span class="item-tag badge-orange">My AI</span>
        </div>
        <div class="item">
          <div class="item-title">Tesla Specialist Campaign</div>
          <div class="item-desc">Targeted ads + landing page for OC Tesla owners. "We know your wheels" positioning. Highest $/job segment.</div>
          <span class="item-tag badge-orange">My AI + My SEO</span>
        </div>
        <div class="item">
          <div class="item-title">Fleet &amp; Body Shop Referral</div>
          <div class="item-desc">Warm intro to detailers, fleet managers. Wholesale pricing PDF + digital referral kit auto-delivered.</div>
          <span class="item-tag badge-orange">My Dev</span>
        </div>
        <div class="item">
          <div class="item-title">San Clemente Community Play</div>
          <div class="item-desc">Hyper-local presence: NextDoor, SC Patch, local FB groups. Ravi's personal network activated as launch referral base.</div>
          <span class="item-tag badge-orange">My AI</span>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>"""


# ─── 3. IMPLEMENTATION TIMELINE ──────────────────────────────────────────────

TIMELINE_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 900px; background: #fff; font-family: 'Segoe UI', Arial, sans-serif; }
  .wrap { padding: 36px 44px 44px; }
  h2 { font-size: 18px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px; }
  .sub { font-size: 12px; color: #495057; margin-bottom: 32px; }
  /* Phase labels at top */
  .phase-row { display: flex; margin-bottom: 8px; }
  .phase-label { flex: 1; text-align: center; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
                 color: #fff; padding: 6px 0; border-radius: 4px; margin: 0 4px; }
  /* Timeline bar */
  .bar-wrap { position: relative; height: 20px; background: linear-gradient(90deg, #006DB6 0%, #1EAAC8 33%, #F67D4B 66%, #c45e2c 100%);
              border-radius: 10px; margin: 0 4px 32px; }
  .bar-tick { position: absolute; top: -8px; width: 2px; height: 36px; background: #fff; opacity: 0.7; }
  .bar-label { position: absolute; top: 26px; font-size: 10px; font-weight: 600; color: #495057;
               transform: translateX(-50%); white-space: nowrap; }
  /* Milestone blocks */
  .phases { display: flex; gap: 8px; margin: 0 4px; }
  .phase { flex: 1; }
  .phase-title { font-size: 12px; font-weight: 700; padding: 8px 12px; color: #fff; border-radius: 4px 4px 0 0; }
  .milestones { border: 1px solid #DEE2E6; border-top: none; border-radius: 0 0 4px 4px; }
  .milestone { padding: 10px 12px; border-bottom: 1px solid #DEE2E6; display: flex; align-items: flex-start; gap: 8px; }
  .milestone:last-child { border-bottom: none; }
  .ms-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .ms-text { font-size: 11px; line-height: 1.4; color: #1A1A2E; }
  .ms-text strong { display: block; font-size: 11px; margin-bottom: 1px; }
  .ms-tag { display: inline-block; margin-top: 4px; padding: 1px 6px; border-radius: 8px;
            font-size: 9px; font-weight: 700; color: #fff; }
  .note { margin-top: 20px; margin-left: 4px; font-size: 11px; color: #6C757D; font-style: italic; }
</style>
</head>
<body>
<div class="wrap">
  <h2>30 / 60 / 90 Day Implementation Roadmap</h2>
  <p class="sub">Monaco Wheel Restoration + San Clemente Wheel Repair — Technijian AI Growth Program</p>

  <div class="phase-row">
    <div class="phase-label" style="background:#006DB6;">DAYS 1–30 &nbsp;|&nbsp; FOUNDATION</div>
    <div class="phase-label" style="background:#1EAAC8;">DAYS 31–60 &nbsp;|&nbsp; LAUNCH</div>
    <div class="phase-label" style="background:#F67D4B;">DAYS 61–90 &nbsp;|&nbsp; ACCELERATE</div>
  </div>

  <div class="bar-wrap">
    <div class="bar-tick" style="left:33.3%;"></div>
    <div class="bar-tick" style="left:66.6%;"></div>
    <div class="bar-label" style="left:0%;">Day 1</div>
    <div class="bar-label" style="left:33.3%;">Day 30</div>
    <div class="bar-label" style="left:66.6%;">Day 60</div>
    <div class="bar-label" style="left:100%;">Day 90</div>
  </div>

  <div class="phases">
    <!-- Phase 1 -->
    <div class="phase">
      <div class="phase-title" style="background:#006DB6;">Foundation</div>
      <div class="milestones">
        <div class="milestone">
          <div class="ms-dot" style="background:#006DB6;"></div>
          <div class="ms-text">
            <strong>GBP Claim &amp; Optimize</strong>
            Claim San Clemente WR Google Business Profile. Optimize both GBPs with services, photos, keywords.
            <span class="ms-tag" style="background:#006DB6;">My SEO</span>
          </div>
        </div>
        <div class="milestone">
          <div class="ms-dot" style="background:#006DB6;"></div>
          <div class="ms-text">
            <strong>Review Velocity Kickstart</strong>
            Text last 20 customers a review request. Target: 15 new Google/Yelp reviews in first 30 days.
            <span class="ms-tag" style="background:#006DB6;">My AI</span>
          </div>
        </div>
        <div class="milestone">
          <div class="ms-dot" style="background:#006DB6;"></div>
          <div class="ms-text">
            <strong>After-Hours AI Bot Live</strong>
            Deploy SMS/web chatbot for quote requests outside business hours.
            <span class="ms-tag" style="background:#006DB6;">My Dev</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Phase 2 -->
    <div class="phase">
      <div class="phase-title" style="background:#1EAAC8;">Launch</div>
      <div class="milestones">
        <div class="milestone">
          <div class="ms-dot" style="background:#1EAAC8;"></div>
          <div class="ms-text">
            <strong>Photo-to-Quote Bot Live</strong>
            Customer texts wheel photo → AI damage estimate → quote in &lt;5 minutes. Reduces friction 60%+.
            <span class="ms-tag" style="background:#1EAAC8;">My Dev</span>
          </div>
        </div>
        <div class="milestone">
          <div class="ms-dot" style="background:#1EAAC8;"></div>
          <div class="ms-text">
            <strong>Social Content Engine Running</strong>
            Weekly before/after posts on Instagram + TikTok. Tesla specialist content series launched.
            <span class="ms-tag" style="background:#1EAAC8;">My AI</span>
          </div>
        </div>
        <div class="milestone">
          <div class="ms-dot" style="background:#1EAAC8;"></div>
          <div class="ms-text">
            <strong>Dealer Outreach Sequence</strong>
            10 OC new-car dealers contacted with wholesale proposal. Target 2 new dealer accounts.
            <span class="ms-tag" style="background:#1EAAC8;">My AI</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Phase 3 -->
    <div class="phase">
      <div class="phase-title" style="background:#F67D4B;">Accelerate</div>
      <div class="milestones">
        <div class="milestone">
          <div class="ms-dot" style="background:#F67D4B;"></div>
          <div class="ms-text">
            <strong>SC Wheel Repair #1 in Maps</strong>
            San Clemente WR at 50+ reviews. Target Google Map Pack position 1 for "wheel repair San Clemente."
            <span class="ms-tag" style="background:#F67D4B;">My SEO</span>
          </div>
        </div>
        <div class="milestone">
          <div class="ms-dot" style="background:#F67D4B;"></div>
          <div class="ms-text">
            <strong>CRM Repeat Campaign Live</strong>
            6-month re-engagement texts to past customers. Target 10% repeat job rate from existing base.
            <span class="ms-tag" style="background:#F67D4B;">My Dev</span>
          </div>
        </div>
        <div class="milestone">
          <div class="ms-dot" style="background:#F67D4B;"></div>
          <div class="ms-text">
            <strong>+2 Wheels/Day Sustained</strong>
            Combined inbound + outbound programs generating 13+ wheels/day. AI ROI breakeven achieved.
            <span class="ms-tag" style="background:#F67D4B;">All Products</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <p class="note">* At $140 blended avg/wheel, +2 wheels/day = $6,160/month — covers full Technijian program investment.</p>
</div>
</body>
</html>"""


async def render(page, html: str, output_path: pathlib.Path, width: int, extra_height: int = 0):
    await page.set_content(html, wait_until="networkidle")
    await page.set_viewport_size({"width": width, "height": 800})
    body = page.locator("body")
    box = await body.bounding_box()
    height = int(box["height"]) + extra_height + 20
    await page.set_viewport_size({"width": width, "height": height})
    await page.screenshot(path=str(output_path), full_page=True)
    print(f"  saved -> {output_path}")


async def main():
    print("Generating MWAR diagrams...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page()

        print("1/3  personas.png")
        await render(page, PERSONAS_HTML, DIAGRAMS_DIR / "personas.png", 900, extra_height=30)

        print("2/3  architecture.png")
        await render(page, ARCH_HTML, DIAGRAMS_DIR / "architecture.png", 900)

        print("3/3  timeline.png")
        await render(page, TIMELINE_HTML, DIAGRAMS_DIR / "timeline.png", 900)

        await browser.close()
    print("Done. All diagrams in:", DIAGRAMS_DIR)


if __name__ == "__main__":
    asyncio.run(main())
