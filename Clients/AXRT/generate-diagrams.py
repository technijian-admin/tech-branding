"""
Axis Research & Technologies (ART) — Diagram Generator
Generates 5 PNG diagrams via Playwright for use in the DOCX report.
Run from the tech-branding/tech-branding root or directly from Clients/ART/.
"""
import asyncio, os, re
from pathlib import Path
from playwright.async_api import async_playwright

OUT_DIR = Path(__file__).parent / 'diagrams'
OUT_DIR.mkdir(exist_ok=True)

BLUE   = '#006DB6'
ORANGE = '#F67D4B'
TEAL   = '#1EAAC8'
GREY   = '#6C757D'
DARK   = '#2D3142'
WHITE  = '#FFFFFF'
OFFWH  = '#F8F9FA'
LGREY  = '#E9ECEF'

DIAGRAMS = {}

# ── 1. Business Model Diagram ─────────────────────────────────────────────
DIAGRAMS['model'] = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{width:900px;height:500px;background:#fff;padding:32px}}
h2{{color:{DARK};font-size:17px;text-align:center;margin-bottom:24px;letter-spacing:.5px}}
.grid{{display:grid;grid-template-columns:1fr 60px 1fr 60px 1fr;gap:0;align-items:center}}
.box{{background:{OFFWH};border-top:4px solid {BLUE};border-radius:8px;padding:18px 14px;text-align:center}}
.box.orange{{border-color:{ORANGE}}}
.box.teal{{border-color:{TEAL}}}
.box h3{{font-size:13px;font-weight:700;color:{DARK};margin-bottom:10px}}
.box ul{{list-style:none;padding:0}}
.box ul li{{font-size:11px;color:{GREY};padding:3px 0;border-bottom:1px solid {LGREY}}}
.box ul li:last-child{{border:none}}
.arrow{{text-align:center;font-size:28px;color:{LGREY}}}
.bottom{{margin-top:22px;background:{DARK};border-radius:8px;padding:14px 20px;display:flex;justify-content:space-around}}
.bottom .item{{text-align:center}}
.bottom .item .num{{font-size:22px;font-weight:700;color:{ORANGE}}}
.bottom .item .lbl{{font-size:11px;color:{OFFWH}}}
</style></head><body>
<h2>AXIS RESEARCH &amp; TECHNOLOGIES — SERVICE &amp; IMPACT MODEL</h2>
<div class="grid">
  <div class="box"><h3>FACILITY SERVICES</h3><ul>
    <li>Bioskills / Cadaver Labs</li><li>Wet &amp; Dry Lab Configurations</li>
    <li>Perfusion Services</li><li>C-Arm &amp; OR Equipment</li>
    <li>Conference &amp; AV Recording</li></ul></div>
  <div class="arrow">→</div>
  <div class="box orange"><h3>OMNIMED SmartOR</h3><ul>
    <li>AI Telemetry &amp; Analytics</li><li>Real-Time Performance Data</li>
    <li>Procedure Recording</li><li>Outcome Benchmarking</li>
    <li>Smart Surgical Center (UMD)</li></ul></div>
  <div class="arrow">→</div>
  <div class="box teal"><h3>CLIENT OUTCOMES</h3><ul>
    <li>FDA-Ready Surgeon Training</li><li>Device Commercialization Support</li>
    <li>CME Credits &amp; Certification</li><li>Reduced Time-to-Market</li>
    <li>Validated Performance Data</li></ul></div>
</div>
<div class="bottom">
  <div class="item"><div class="num">4</div><div class="lbl">National Locations</div></div>
  <div class="item"><div class="num">10+</div><div class="lbl">Years in Bioskills</div></div>
  <div class="item"><div class="num">36K ft²</div><div class="lbl">AI Surgical Center (UMD)</div></div>
  <div class="item"><div class="num">$26B</div><div class="lbl">Med Device Training Market</div></div>
  <div class="item"><div class="num">AI</div><div class="lbl">OMNIMED SmartOR Platform</div></div>
</div></body></html>"""

# ── 2. Personas Diagram ───────────────────────────────────────────────────
DIAGRAMS['personas'] = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{width:900px;background:#fff;padding:28px}}
h2{{color:{DARK};font-size:16px;text-align:center;margin-bottom:22px}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}}
.card{{background:{OFFWH};border-radius:8px;padding:16px;border-left:4px solid {BLUE}}}
.card.orange{{border-color:{ORANGE}}}
.card.teal{{border-color:{TEAL}}}
.card.dark{{border-color:{DARK}}}
.card.grey{{border-color:{GREY}}}
.card h3{{font-size:12px;font-weight:700;color:{DARK};margin-bottom:4px}}
.card .role{{font-size:10.5px;color:{GREY};margin-bottom:8px;font-style:italic}}
.card .row{{font-size:10px;color:{GREY};margin-bottom:3px}}
.card .row strong{{color:{DARK}}}
.card .tag{{display:inline-block;background:{BLUE};color:#fff;font-size:9px;padding:2px 7px;border-radius:10px;margin-top:6px}}
.card.orange .tag{{background:{ORANGE}}}
.card.teal .tag{{background:{TEAL}}}
.card.dark .tag{{background:{DARK}}}
.card.grey .tag{{background:{GREY}}}
.bottom{{margin-top:14px;background:{DARK};border-radius:8px;padding:12px 20px;text-align:center;font-size:11px;color:{OFFWH}}}
</style></head><body>
<h2>BUYER PERSONA MAP — AXIS RESEARCH &amp; TECHNOLOGIES</h2>
<div class="grid">
  <div class="card"><h3>Training Director</h3><div class="role">VP/Director of Training &amp; Education, Medical Device Co.</div>
    <div class="row"><strong>Goal:</strong> FDA-compliant surgeon training at scale</div>
    <div class="row"><strong>Pain:</strong> Finding lab capacity + tracking surgeon performance</div>
    <div class="row"><strong>Buys:</strong> Multi-day cadaver programs, OMNIMED data</div>
    <span class="tag">PRIMARY BUYER</span></div>
  <div class="card orange"><h3>Clinical Affairs Lead</h3><div class="role">Clinical Affairs Mgr / Medical Science Liaison</div>
    <div class="row"><strong>Goal:</strong> Clinical evidence for device launches</div>
    <div class="row"><strong>Pain:</strong> Lab availability; reproducible training outcomes</div>
    <div class="row"><strong>Buys:</strong> Simulation, testing, outcome documentation</div>
    <span class="tag">SPEC INFLUENCER</span></div>
  <div class="card teal"><h3>Surgeon Faculty</h3><div class="role">Attending Surgeon / Fellowship Program Director</div>
    <div class="row"><strong>Goal:</strong> Best facility for resident/fellow training</div>
    <div class="row"><strong>Pain:</strong> Limited OR time; training realism vs. simulation</div>
    <div class="row"><strong>Buys:</strong> Bioskills access, CME-accredited programs</div>
    <span class="tag">END-USER / ADVOCATE</span></div>
  <div class="card dark"><h3>Institution Partner</h3><div class="role">Dean / Dept Chair / CME Director</div>
    <div class="row"><strong>Goal:</strong> Expand training infrastructure without CapEx</div>
    <div class="row"><strong>Pain:</strong> Building internal labs is cost-prohibitive</div>
    <div class="row"><strong>Buys:</strong> Long-term partnership (UMD model)</div>
    <span class="tag">STRATEGIC PARTNER</span></div>
  <div class="card grey"><h3>Medtech Event Planner</h3><div class="role">Conference Manager / Marketing Ops</div>
    <div class="row"><strong>Goal:</strong> Impress surgeons at product launch events</div>
    <div class="row"><strong>Pain:</strong> Finding premium OR-adjacent event space</div>
    <div class="row"><strong>Buys:</strong> Lab + AV + conference space bundles</div>
    <span class="tag">EVENT BUYER</span></div>
  <div class="card"><h3>Axis Leadership</h3><div class="role">CEO Jill Goodwin / President Nick Moran</div>
    <div class="row"><strong>Goal:</strong> National platform + OMNIMED as licensed product</div>
    <div class="row"><strong>Pain:</strong> Digitally invisible; no AI growth engine yet</div>
    <div class="row"><strong>Buys:</strong> Technijian full growth engine</div>
    <span class="tag">INTERNAL CHAMPION</span></div>
</div>
<div class="bottom">Finite Universe: ~3,000 FDA-regulated medical device manufacturers in the US — pure account-based outreach</div>
</body></html>"""

# ── 3. Competitive Landscape ──────────────────────────────────────────────
DIAGRAMS['competitive'] = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{width:860px;height:500px;background:#fff;padding:28px}}
h2{{color:{DARK};font-size:16px;text-align:center;margin-bottom:18px}}
.quadrant{{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:0;height:360px;border:2px solid {LGREY};border-radius:8px;overflow:hidden;position:relative}}
.q{{padding:14px;position:relative}}
.q1{{background:#F0F7FF;border-right:2px solid {LGREY};border-bottom:2px solid {LGREY}}}
.q2{{background:#FFF8F0;border-bottom:2px solid {LGREY}}}
.q3{{background:#F8F9FA;border-right:2px solid {LGREY}}}
.q4{{background:#FFFEF0}}
.q-label{{font-size:9.5px;font-weight:700;color:{GREY};text-transform:uppercase;margin-bottom:8px;letter-spacing:.5px}}
.dot{{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px}}
.competitor{{font-size:10px;color:{DARK};margin:5px 0;display:flex;align-items:center}}
.axis-star{{font-size:22px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);filter:drop-shadow(0 2px 4px rgba(0,0,0,.2))}}
.axis-label{{position:absolute;top:50%;left:50%;transform:translate(-50%,-60px);font-size:11px;font-weight:700;color:{ORANGE};text-align:center;white-space:nowrap}}
.axis-x{{text-align:center;font-size:10px;color:{GREY};margin-top:8px}}
.axis-y{{position:absolute;left:-110px;top:50%;transform:translateY(-50%) rotate(-90deg);font-size:10px;color:{GREY};white-space:nowrap}}
.wrapper{{position:relative;padding-left:24px}}
</style></head><body>
<h2>COMPETITIVE LANDSCAPE — AI DEPTH vs. PHYSICAL LAB DEPTH</h2>
<div class="wrapper">
<div class="axis-y">← Less Physical Lab | More Physical Lab →</div>
<div class="quadrant">
  <div class="q q1"><div class="q-label">⬆ High AI / Low Lab</div>
    <div class="competitor"><span class="dot" style="background:{TEAL}"></span>CAE Healthcare</div>
    <div class="competitor"><span class="dot" style="background:{TEAL}"></span>Simbionix (3D Systems)</div>
    <div class="competitor"><span class="dot" style="background:{TEAL}"></span>Surgical Theater (VR)</div>
  </div>
  <div class="q q2" style="position:relative"><div class="q-label">⬆ High AI / ⬆ High Lab</div>
    <span class="axis-label">AXIS R&amp;T</span>
    <span class="axis-star">⭐</span>
  </div>
  <div class="q q3"><div class="q-label">↓ Low AI / Low Lab</div>
    <div class="competitor"><span class="dot" style="background:{GREY}"></span>Independent Labs</div>
    <div class="competitor"><span class="dot" style="background:{GREY}"></span>SurgiReal (tissue models)</div>
    <div class="competitor"><span class="dot" style="background:{GREY}"></span>Small CME providers</div>
  </div>
  <div class="q q4"><div class="q-label">↓ Low AI / ⬆ High Lab</div>
    <div class="competitor"><span class="dot" style="background:{BLUE}"></span>Univ. Simulation Centers</div>
    <div class="competitor"><span class="dot" style="background:{BLUE}"></span>Hospital Skills Labs</div>
    <div class="competitor"><span class="dot" style="background:{BLUE}"></span>Medical Schools</div>
  </div>
</div></div>
<div class="axis-x">← Simulation Only | Physical Lab Depth →</div>
</body></html>"""

# ── 4. AI Growth Engine (Architecture) ───────────────────────────────────
DIAGRAMS['architecture'] = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{width:900px;background:#fff;padding:30px}}
h2{{color:{DARK};font-size:16px;text-align:center;margin-bottom:22px}}
.cols{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}}
.col{{border-radius:10px;overflow:hidden}}
.col-head{{padding:14px 16px;text-align:center}}
.col-head.blue{{background:{BLUE}}}
.col-head.orange{{background:{ORANGE}}}
.col-head.teal{{background:{TEAL}}}
.col-head h3{{color:#fff;font-size:13px;font-weight:700;margin-bottom:3px}}
.col-head p{{color:rgba(255,255,255,.85);font-size:10px}}
.col-body{{background:{OFFWH};padding:14px 16px}}
.col-body ul{{list-style:none}}
.col-body ul li{{font-size:10.5px;color:{DARK};padding:5px 0;border-bottom:1px solid {LGREY};display:flex;align-items:flex-start;gap:6px}}
.col-body ul li:last-child{{border:none}}
.col-body ul li::before{{content:"›";color:{BLUE};font-weight:700;flex-shrink:0}}
.col.orange .col-body ul li::before{{color:{ORANGE}}}
.col.teal .col-body ul li::before{{color:{TEAL}}}
.footer{{margin-top:18px;display:flex;justify-content:center;gap:20px}}
.badge{{background:{DARK};color:#fff;padding:7px 16px;border-radius:20px;font-size:10px;font-weight:600}}
</style></head><body>
<h2>THE AXIS AI GROWTH ENGINE — THREE MOTIONS</h2>
<div class="cols">
  <div class="col">
    <div class="col-head blue"><h3>GET FOUND</h3><p>Digital Visibility for Medtech Buyers</p></div>
    <div class="col-body"><ul>
      <li>SEO for "bioskills lab," "cadaver lab medical device training," "surgical skills lab Irvine"</li>
      <li>GEO optimization so AI search tools recommend Axis first</li>
      <li>Google Business Profile for all 4 locations</li>
      <li>OMNIMED SmartOR product landing page + search presence</li>
      <li>LinkedIn content authority (43 followers → 1,000+)</li>
    </ul></div>
  </div>
  <div class="col orange">
    <div class="col-head orange"><h3>WIN CLIENTS</h3><p>Account Intelligence for Top Medtech</p></div>
    <div class="col-body"><ul>
      <li>AI-driven prospecting across 3,000 FDA-regulated device manufacturers</li>
      <li>Intent signals: new device approvals, training RFPs, surgeon hiring</li>
      <li>Automated outreach sequences to Training Directors + Clinical Affairs</li>
      <li>RFP response templates for institutional partnership proposals</li>
      <li>CRM with deal pipeline for multi-location lab bookings</li>
    </ul></div>
  </div>
  <div class="col teal">
    <div class="col-head teal"><h3>SCALE &amp; SERVE</h3><p>Operational AI Across All 4 Locations</p></div>
    <div class="col-body"><ul>
      <li>Unified IT infrastructure across Irvine, MD, Nashville, Houston</li>
      <li>Online booking + scheduling portal for lab reservations</li>
      <li>OMNIMED SmartOR integration support + IT infrastructure</li>
      <li>AI-powered data dashboards for facility utilization</li>
      <li>Secure cloud backup + HIPAA-aligned data governance</li>
    </ul></div>
  </div>
</div>
<div class="footer">
  <div class="badge">My SEO Health Tech</div>
  <div class="badge">My AI Lead Gen Pro</div>
  <div class="badge">My Dev Booking Portal</div>
  <div class="badge">My AI Advisor</div>
</div>
</body></html>"""

# ── 5. Implementation Timeline ────────────────────────────────────────────
DIAGRAMS['timeline'] = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{width:900px;background:#fff;padding:30px}}
h2{{color:{DARK};font-size:16px;text-align:center;margin-bottom:26px}}
.row{{display:flex;gap:0;margin-bottom:14px;align-items:stretch}}
.label{{width:110px;flex-shrink:0;background:{DARK};color:#fff;font-size:11px;font-weight:700;border-radius:8px 0 0 8px;display:flex;align-items:center;justify-content:center;padding:10px 8px;text-align:center;line-height:1.3}}
.label.orange{{background:{ORANGE}}}
.label.teal{{background:{TEAL}}}
.items{{flex:1;background:{OFFWH};border-radius:0 8px 8px 0;padding:10px 16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}}
.item{{font-size:10px;color:{DARK};padding:6px 10px;background:#fff;border-radius:6px;border-left:3px solid {BLUE}}}
.item.orange{{border-color:{ORANGE}}}
.item.teal{{border-color:{TEAL}}}
.item strong{{display:block;font-size:9.5px;color:{GREY};text-transform:uppercase;margin-bottom:2px}}
</style></head><body>
<h2>IMPLEMENTATION ROADMAP — 90 / 180 / 365 DAYS</h2>
<div class="row">
  <div class="label">Days 1–90<br>Foundation</div>
  <div class="items">
    <div class="item"><strong>Week 1</strong>Nexus Assess: audit all 4 locations IT + digital footprint</div>
    <div class="item"><strong>Week 2–3</strong>SEO baseline + Google Business Profiles live for all 4 locations</div>
    <div class="item"><strong>Week 3–4</strong>Exec AI Workshop with Nick Moran + Jill Goodwin</div>
    <div class="item"><strong>Month 2</strong>OMNIMED SmartOR landing page + product SEO live</div>
    <div class="item"><strong>Month 2</strong>LinkedIn content calendar launch: case studies + facility showcase</div>
    <div class="item"><strong>Month 3</strong>First medtech account list (top 100 device companies): outreach begins</div>
  </div>
</div>
<div class="row">
  <div class="label orange">Days 90–180<br>Acceleration</div>
  <div class="items">
    <div class="item orange"><strong>Month 4</strong>AI Lead Gen: automated outreach to Training Directors at top device cos</div>
    <div class="item orange"><strong>Month 4</strong>Online booking portal v1 live for lab reservations</div>
    <div class="item orange"><strong>Month 5</strong>First qualified medtech leads entering pipeline from SEO + outreach</div>
    <div class="item orange"><strong>Month 5</strong>HIPAA-aligned data governance framework + OMNIMED cloud backup</div>
    <div class="item orange"><strong>Month 6</strong>CRM pipeline tracking: all 4 locations, deal visibility</div>
    <div class="item orange"><strong>Month 6</strong>Quarterly performance report: lab bookings, SEO rankings, leads</div>
  </div>
</div>
<div class="row">
  <div class="label teal">Days 180–365<br>Full Engine</div>
  <div class="items">
    <div class="item teal"><strong>Month 7–8</strong>Expand outreach to institutional partners (medical schools, hospitals)</div>
    <div class="item teal"><strong>Month 8</strong>OMNIMED SmartOR product site + lead capture for technology licensing</div>
    <div class="item teal"><strong>Month 9</strong>UMD Smart Surgical Center: IT infrastructure planning support begins</div>
    <div class="item teal"><strong>Month 10</strong>Content authority: Axis recognized as thought leader in surgical AI</div>
    <div class="item teal"><strong>Month 11</strong>2nd-generation lead gen: referral program for surgeon faculty network</div>
    <div class="item teal"><strong>Month 12</strong>Annual review: ROI validation, Phase 2 scope for UMD facility build</div>
  </div>
</div>
</body></html>"""


async def render_diagram(page, name, html, width=900):
    out = OUT_DIR / f'{name}.png'
    await page.set_content(html)
    await page.wait_for_timeout(400)
    elem = await page.query_selector('body')
    bb = await elem.bounding_box()
    height = int(bb['height']) + 20
    await page.set_viewport_size({'width': width, 'height': height})
    await page.wait_for_timeout(200)
    await page.screenshot(path=str(out), clip={'x': 0, 'y': 0, 'width': width, 'height': height})
    # Auto-crop whitespace
    try:
        from PIL import Image
        import numpy as np
        img = Image.open(out).convert('RGB')
        arr = np.array(img)
        mask = ~((arr[:,:,0]>245)&(arr[:,:,1]>245)&(arr[:,:,2]>245))
        rows = np.any(mask, axis=1); cols = np.any(mask, axis=0)
        if rows.any():
            r0,r1 = np.where(rows)[0][[0,-1]]; c0,c1 = np.where(cols)[0][[0,-1]]
            pad = 16
            img.crop((max(0,c0-pad), max(0,r0-pad), min(img.width,c1+pad), min(img.height,r1+pad))).save(out)
    except ImportError:
        pass
    print(f'  OK {name}.png  ({out.stat().st_size//1024} KB)')

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        # device_scale_factor=3 renders at 3x resolution for ~300+ DPI in print
        context = await browser.new_context(device_scale_factor=3)
        page = await context.new_page()
        for name, html in DIAGRAMS.items():
            await render_diagram(page, name, html)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
    print('Done. Diagrams in:', OUT_DIR)
