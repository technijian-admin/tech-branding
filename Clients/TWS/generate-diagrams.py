#!/usr/bin/env python3
# TWS — ThriveWell Schools — Diagram Generator
# Renders 5 HTML diagrams to PNG via Python Playwright (Chromium)
# Run: py -3.12 generate-diagrams.py

from pathlib import Path
from playwright.sync_api import sync_playwright

OUT_DIR = Path(__file__).parent / "diagrams"
OUT_DIR.mkdir(exist_ok=True)

BLUE   = "#006DB6"
ORANGE = "#F67D4B"
TEAL   = "#1EAAC8"
GREY   = "#4A4A4A"
LGREY  = "#F5F5F5"
WHITE  = "#FFFFFF"
DARK   = "#1A1A2E"

def render(html: str, name: str, width: int = 1200):
    out_path = OUT_DIR / f"{name}.png"
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": 900})
        page.set_content(html)
        page.wait_for_timeout(600)
        page.screenshot(path=str(out_path), full_page=True)
        browser.close()
    print(f"  OK  {name}.png")

# ── 1. MODEL DIAGRAM ─────────────────────────────────────────────────────────
def diagram_model():
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{background:{WHITE};padding:40px;width:1120px}}
h2{{color:{BLUE};font-size:20px;font-weight:700;text-align:center;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase}}
.sub{{text-align:center;color:{GREY};font-size:13px;margin-bottom:32px}}
.flow{{display:flex;align-items:stretch;gap:0;justify-content:center}}
.col{{flex:1;display:flex;flex-direction:column;gap:12px;max-width:220px}}
.arrow-col{{display:flex;align-items:center;justify-content:center;width:52px;flex-shrink:0}}
.arrow{{font-size:28px;color:{ORANGE};font-weight:700}}
.box{{border-radius:10px;padding:18px 14px;text-align:center}}
.box-blue{{background:{BLUE};color:{WHITE}}}
.box-teal{{background:{TEAL};color:{WHITE}}}
.box-orange{{background:{ORANGE};color:{WHITE}}}
.box-light{{background:{LGREY};color:{GREY};border:1px solid #ddd}}
.box h3{{font-size:13px;font-weight:700;margin-bottom:6px}}
.box p{{font-size:11px;line-height:1.5;opacity:0.92}}
.outcome-grid{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}
.out-card{{background:{LGREY};border-left:4px solid {TEAL};border-radius:6px;padding:10px 12px}}
.out-card h4{{font-size:11px;font-weight:700;color:{BLUE};margin-bottom:3px}}
.out-card p{{font-size:10px;color:{GREY};line-height:1.4}}
.col-label{{text-align:center;font-size:10px;font-weight:700;color:{GREY};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}}
</style></head><body>
<h2>ThriveWell Schools &mdash; Service &amp; Impact Model</h2>
<p class="sub">From foundational training to measurable district transformation</p>
<div class="flow">
  <div class="col">
    <div class="col-label">Core Programs</div>
    <div class="box box-blue"><h3>Strong Beginnings</h3><p>Community circles, co-created norms, restorative classroom culture</p></div>
    <div class="box box-blue"><h3>Foundations in Trauma</h3><p>ACE education, neuroscience of behavior, brain-body states</p></div>
    <div class="box box-blue"><h3>Restorative Discipline</h3><p>From punitive to accountability &mdash; decision frameworks &amp; flowcharts</p></div>
    <div class="box box-blue"><h3>Dysregulation Response</h3><p>De-escalation tools, co-regulation, behavior escalation cycle</p></div>
    <div class="box box-teal"><h3>Staff Resilience</h3><p>Vicarious trauma, burnout prevention, immediate support strategies</p></div>
    <div class="box box-teal"><h3>Improving Staff Culture</h3><p>Toxic-environment remediation, communication scripts, leadership repair</p></div>
  </div>
  <div class="arrow-col"><div class="arrow">&#8594;</div></div>
  <div class="col">
    <div class="col-label">Signature Offering</div>
    <div class="box box-orange" style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <h3 style="font-size:16px;margin-bottom:10px">Wellness Rooms Program</h3>
      <p style="font-size:12px">Tier I universal mental health support embedded in school infrastructure.<br><br>Students learn self-regulation &amp; coping strategies. Staff learn to guide &mdash; not just refer.<br><br>Data collection tracks behavior patterns &amp; intervention effectiveness.</p>
    </div>
    <div class="box box-light" style="margin-top:8px">
      <h3 style="color:{GREY}">Technical Support</h3>
      <p>Bi-monthly coaching, classroom observations, co-planning, sustainability guidance</p>
    </div>
  </div>
  <div class="arrow-col"><div class="arrow">&#8594;</div></div>
  <div class="col" style="max-width:300px">
    <div class="col-label">Measurable Outcomes</div>
    <div class="outcome-grid">
      <div class="out-card"><h4>70%</h4><p>Drop in behavioral referrals (CA middle school pilot)</p></div>
      <div class="out-card"><h4>ADA Up</h4><p>Improved attendance = direct district revenue recovery</p></div>
      <div class="out-card"><h4>Staff Retention</h4><p>Reduced burnout and turnover among trained educators</p></div>
      <div class="out-card"><h4>CA Dashboard</h4><p>Alignment with Chronic Absenteeism &amp; Suspension metrics</p></div>
      <div class="out-card"><h4>School Culture</h4><p>Shift from punitive to accountability-based environment</p></div>
      <div class="out-card"><h4>Pipeline Down</h4><p>Early intervention breaking school-to-incarceration pathways</p></div>
    </div>
  </div>
</div>
</body></html>"""
    render(html, "model")

# ── 2. PERSONAS DIAGRAM ──────────────────────────────────────────────────────
def diagram_personas():
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{background:{WHITE};padding:40px;width:1120px}}
h2{{color:{BLUE};font-size:20px;font-weight:700;text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px}}
.sub{{text-align:center;color:{GREY};font-size:13px;margin-bottom:28px}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}}
.card{{border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)}}
.card-header{{padding:14px 16px;color:{WHITE};font-weight:700;font-size:13px}}
.card-body{{padding:14px 16px;background:{WHITE};border:1px solid #e8e8e8;border-top:none;border-radius:0 0 10px 10px}}
.field{{display:flex;gap:8px;margin-bottom:7px;align-items:flex-start}}
.field-label{{font-size:10px;font-weight:700;color:{GREY};text-transform:uppercase;letter-spacing:0.5px;min-width:70px;flex-shrink:0;padding-top:1px}}
.field-val{{font-size:11px;color:{GREY};line-height:1.4}}
.badges{{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}}
.badge{{font-size:9px;font-weight:700;padding:3px 7px;border-radius:12px;text-transform:uppercase;letter-spacing:0.5px}}
.badge-v{{background:#E8F5E9;color:#2E7D32}}
.badge-s{{background:#E3F2FD;color:{BLUE}}}
</style></head><body>
<h2>ThriveWell Schools &mdash; Buyer Personas</h2>
<p class="sub">5 stakeholders across the district-to-classroom adoption chain</p>
<div class="grid">
  <div class="card">
    <div class="card-header" style="background:{BLUE}">1 &mdash; District Cabinet Champion</div>
    <div class="card-body">
      <div class="field"><span class="field-label">Role</span><span class="field-val">Superintendent, Asst. Superintendent, Cabinet Officer</span></div>
      <div class="field"><span class="field-label">Priority</span><span class="field-val">Board accountability, equity mandates, CA Dashboard metrics</span></div>
      <div class="field"><span class="field-label">Pain</span><span class="field-val">Public pressure on suspension rates; board wants visible equity wins</span></div>
      <div class="field"><span class="field-label">Trigger</span><span class="field-val">New CYBHI/CCSPP grant; board equity resolution; CA Dashboard flag</span></div>
      <div class="badges"><span class="badge badge-v">Low Volume</span><span class="badge badge-s">High Strategic Value</span></div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" style="background:{BLUE}">2 &mdash; Student Services Director</div>
    <div class="card-body">
      <div class="field"><span class="field-label">Role</span><span class="field-val">Dir. Student Services, Dir. Pupil Services, Dir. Special Ed</span></div>
      <div class="field"><span class="field-label">Priority</span><span class="field-val">MTSS/PBIS implementation, reducing referrals, counselor load</span></div>
      <div class="field"><span class="field-label">Pain</span><span class="field-val">Over-referred students, counselors stretched thin, no Tier I buffer</span></div>
      <div class="field"><span class="field-label">Trigger</span><span class="field-val">New wellness budget; mandate to reduce exclusionary discipline</span></div>
      <div class="badges"><span class="badge badge-v">Medium Volume</span><span class="badge badge-s">Primary RFP Champion</span></div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" style="background:{TEAL}">3 &mdash; Site Principal</div>
    <div class="card-body">
      <div class="field"><span class="field-label">Role</span><span class="field-val">School Principal, Assistant Principal</span></div>
      <div class="field"><span class="field-label">Priority</span><span class="field-val">School culture, staff morale, office referral volume, parent trust</span></div>
      <div class="field"><span class="field-label">Pain</span><span class="field-val">Behavior management consuming leadership time; teacher turnover</span></div>
      <div class="field"><span class="field-label">Trigger</span><span class="field-val">High suspension rates flagged; staff morale crisis; new PD budget</span></div>
      <div class="badges"><span class="badge badge-v">High Volume</span><span class="badge badge-s">Site-Level Gatekeeper</span></div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" style="background:{TEAL}">4 &mdash; MTSS / Wellness Coordinator</div>
    <div class="card-body">
      <div class="field"><span class="field-label">Role</span><span class="field-val">School Counselor, Psychologist, MTSS Coordinator</span></div>
      <div class="field"><span class="field-label">Priority</span><span class="field-val">Evidence-based Tier I/II supports; reducing crisis referrals to self</span></div>
      <div class="field"><span class="field-label">Pain</span><span class="field-val">400+ caseloads; every dysregulated student sent to counselor</span></div>
      <div class="field"><span class="field-label">Trigger</span><span class="field-val">MTSS restructure; wellness room budget; referral spike data</span></div>
      <div class="badges"><span class="badge badge-v">Medium Volume</span><span class="badge badge-s">Evidence-Based Advocate</span></div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" style="background:{ORANGE}">5 &mdash; Classroom Teacher</div>
    <div class="card-body">
      <div class="field"><span class="field-label">Role</span><span class="field-val">K-12 Classroom Teacher (training end-user)</span></div>
      <div class="field"><span class="field-label">Priority</span><span class="field-val">Manage behavior without referrals; survive the school year</span></div>
      <div class="field"><span class="field-label">Pain</span><span class="field-val">53% burnout rate; vicarious trauma; no support for dysregulation</span></div>
      <div class="field"><span class="field-label">Trigger</span><span class="field-val">Mandated PD day; new school year; student behavior crisis</span></div>
      <div class="badges"><span class="badge badge-v">Highest Volume</span><span class="badge badge-s">NPS &amp; Adoption Driver</span></div>
    </div>
  </div>
</div>
</body></html>"""
    render(html, "personas")

# ── 3. COMPETITIVE 2x2 ──────────────────────────────────────────────────────
def diagram_competitive():
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{background:{WHITE};padding:40px;width:1120px}}
h2{{color:{BLUE};font-size:20px;font-weight:700;text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px}}
.sub{{text-align:center;color:{GREY};font-size:13px;margin-bottom:28px}}
.outer{{display:flex;gap:24px;align-items:flex-start}}
.matrix-wrap{{position:relative;padding-left:32px}}
.axis-label-x{{text-align:center;font-size:11px;font-weight:700;color:{GREY};text-transform:uppercase;letter-spacing:1px;margin-top:8px}}
.axis-label-y{{position:absolute;left:0;top:50%;transform:translateY(-50%) rotate(-90deg);font-size:10px;font-weight:700;color:{GREY};text-transform:uppercase;letter-spacing:1px;white-space:nowrap}}
.matrix{{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;width:580px;height:440px;border:2px solid #ddd;border-radius:4px;overflow:hidden}}
.q{{padding:16px;display:flex;flex-direction:column;gap:6px;position:relative}}
.q1{{background:#FFF8F5;border-right:1px solid #ddd;border-bottom:1px solid #ddd}}
.q2{{background:#F0F8FF;border-bottom:1px solid #ddd}}
.q3{{background:#FAFAFA;border-right:1px solid #ddd}}
.q4{{background:#F0FFF4}}
.q-label{{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.5;position:absolute;top:8px;right:10px}}
.dot{{display:flex;align-items:center;gap:6px;margin-bottom:3px}}
.dot-mark{{width:11px;height:11px;border-radius:50%;flex-shrink:0}}
.dot-text{{font-size:11px;color:{GREY}}}
.tws-star{{font-size:13px;font-weight:700;color:{ORANGE};background:#FFF3E0;border:2px solid {ORANGE};border-radius:6px;padding:6px 10px;text-align:center}}
.legend{{width:260px;flex-shrink:0}}
.legend h3{{font-size:12px;font-weight:700;color:{BLUE};margin-bottom:10px}}
.li{{display:flex;align-items:flex-start;gap:8px;margin-bottom:9px}}
.li-dot{{width:11px;height:11px;border-radius:50%;flex-shrink:0;margin-top:2px}}
.li-text h4{{font-size:11px;font-weight:700;color:{GREY};margin-bottom:2px}}
.li-text p{{font-size:10px;color:{GREY};opacity:0.8;line-height:1.4}}
</style></head><body>
<h2>Competitive Landscape &mdash; ThriveWell Schools</h2>
<p class="sub">Positioning on Trauma-Informed Depth vs. Implementation Coaching vs. Scale</p>
<div class="outer">
<div class="matrix-wrap">
  <span class="axis-label-y">Implementation Depth (coaching, customization)</span>
  <div class="matrix">
    <div class="q q1">
      <span class="q-label">Curriculum / Low Scale</span>
      <div class="dot"><div class="dot-mark" style="background:#9B59B6"></div><span class="dot-text"><b>Conscious Discipline</b> &mdash; packaged curriculum</span></div>
      <div class="dot"><div class="dot-mark" style="background:#2ECC71"></div><span class="dot-text"><b>Responsive Classroom</b> &mdash; general SEL</span></div>
      <div class="dot"><div class="dot-mark" style="background:#E74C3C"></div><span class="dot-text"><b>Second Step</b> &mdash; commodity curriculum</span></div>
    </div>
    <div class="q q2">
      <span class="q-label">Deep Coaching / High Specialization</span>
      <div class="tws-star">&#11088; ThriveWell Schools<br><span style="font-size:10px;font-weight:400">Restorative + Trauma + Prison Pipeline<br>PhD-backed. Implementation-first.</span></div>
    </div>
    <div class="q q3">
      <span class="q-label">Platform / Low Coaching</span>
      <div class="dot"><div class="dot-mark" style="background:#3498DB"></div><span class="dot-text"><b>Panorama</b> &mdash; SEL data platform</span></div>
      <div class="dot"><div class="dot-mark" style="background:#1ABC9C"></div><span class="dot-text"><b>Cartwheel</b> &mdash; behavioral health tech</span></div>
      <div class="dot"><div class="dot-mark" style="background:#F39C12"></div><span class="dot-text"><b>7 Mindsets</b> &mdash; character curriculum</span></div>
    </div>
    <div class="q q4">
      <span class="q-label">Clinical / High Scale</span>
      <div class="dot"><div class="dot-mark" style="background:#E67E22"></div><span class="dot-text"><b>Hazel Health</b> &mdash; telehealth therapy</span></div>
      <div class="dot"><div class="dot-mark" style="background:#E91E63"></div><span class="dot-text"><b>Care Solace</b> &mdash; navigation platform</span></div>
    </div>
  </div>
  <div class="axis-label-x">&larr; General SEL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Trauma-Informed Specialization &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Deep Specialist &rarr;</div>
</div>
<div class="legend">
  <h3>Competitor Summary</h3>
  <div class="li"><div class="li-dot" style="background:{ORANGE}"></div><div class="li-text"><h4>ThriveWell (TWS) &#11088;</h4><p>Uncontested: RJ + trauma-informed + prison pipeline + PhD-backed coaching</p></div></div>
  <div class="li"><div class="li-dot" style="background:#3498DB"></div><div class="li-text"><h4>Panorama Education</h4><p>Largest SEL data platform; assessment-only; no implementation coaching</p></div></div>
  <div class="li"><div class="li-dot" style="background:#E91E63"></div><div class="li-text"><h4>Care Solace</h4><p>Navigation platform; connects families to providers; not PD</p></div></div>
  <div class="li"><div class="li-dot" style="background:#E67E22"></div><div class="li-text"><h4>Hazel Health</h4><p>Telehealth therapy; clinical delivery, not staff training</p></div></div>
  <div class="li"><div class="li-dot" style="background:#9B59B6"></div><div class="li-text"><h4>Conscious Discipline</h4><p>SAMHSA evidence-based; packaged curriculum; no district customization</p></div></div>
  <div class="li"><div class="li-dot" style="background:#2ECC71"></div><div class="li-text"><h4>Responsive Classroom</h4><p>25+ yr SEL approach; general classroom management; lacks RJ lens</p></div></div>
</div>
</div>
</body></html>"""
    render(html, "competitive")

# ── 4. ARCHITECTURE DIAGRAM ──────────────────────────────────────────────────
def diagram_architecture():
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{background:{WHITE};padding:40px;width:1120px}}
h2{{color:{BLUE};font-size:20px;font-weight:700;text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px}}
.sub{{text-align:center;color:{GREY};font-size:13px;margin-bottom:28px}}
.cols{{display:flex;gap:16px}}
.col{{flex:1;display:flex;flex-direction:column;gap:10px}}
.col-header{{border-radius:8px 8px 0 0;padding:14px;text-align:center;color:{WHITE};font-weight:700;font-size:14px}}
.col-body{{flex:1;background:{LGREY};border-radius:0 0 8px 8px;padding:14px;display:flex;flex-direction:column;gap:10px}}
.item{{background:{WHITE};border-radius:6px;padding:12px;border-left:4px solid transparent}}
.item h4{{font-size:12px;font-weight:700;margin-bottom:4px}}
.item p{{font-size:11px;color:{GREY};line-height:1.4}}
.result-band{{margin-top:20px;background:{BLUE};border-radius:8px;padding:16px;display:flex;justify-content:space-around}}
.r-item{{text-align:center;color:{WHITE}}}
.r-item .num{{font-size:22px;font-weight:700}}
.r-item .lbl{{font-size:10px;opacity:0.85;text-transform:uppercase;letter-spacing:0.5px}}
</style></head><body>
<h2>ThriveWell AI Growth Engine &mdash; Three Motions</h2>
<p class="sub">Technijian services mapped to ThriveWell district acquisition and delivery capacity</p>
<div class="cols">
  <div class="col">
    <div class="col-header" style="background:{BLUE}">Motion 1: Get Found</div>
    <div class="col-body">
      <div class="item" style="border-color:{BLUE}">
        <h4 style="color:{BLUE}">My SEO &mdash; Education Authority</h4>
        <p>Rank for "trauma-informed professional development California," "restorative discipline consultant K-12," "school-to-prison pipeline prevention programs"</p>
      </div>
      <div class="item" style="border-color:{BLUE}">
        <h4 style="color:{BLUE}">AI Search Optimization (AEO)</h4>
        <p>Optimize for Google SGE, Perplexity, and district AI assistants. When a Superintendent asks AI "who does trauma-informed PD in CA?" &mdash; ThriveWell appears.</p>
      </div>
      <div class="item" style="border-color:{BLUE}">
        <h4 style="color:{BLUE}">Thought Leadership Pipeline</h4>
        <p>Repurpose "Neuroscience Behind Misbehavior" into LinkedIn authority series. Monthly articles drive inbound district conversations.</p>
      </div>
    </div>
  </div>
  <div class="col">
    <div class="col-header" style="background:{TEAL}">Motion 2: Win Districts</div>
    <div class="col-body">
      <div class="item" style="border-color:{TEAL}">
        <h4 style="color:{TEAL}">My AI Lead Gen &mdash; District Intelligence</h4>
        <p>Monitor named-account signals: CYBHI/CCSPP grants awarded, superintendent transitions, CA Dashboard suspension flags &mdash; trigger personalized outreach.</p>
      </div>
      <div class="item" style="border-color:{TEAL}">
        <h4 style="color:{TEAL}">Grant Application AI</h4>
        <p>Identify open Title IV, CYBHI, SEL grants. Auto-draft application narratives. Help districts use wellness allocations to fund ThriveWell engagements.</p>
      </div>
      <div class="item" style="border-color:{TEAL}">
        <h4 style="color:{TEAL}">Outcome Documentation</h4>
        <p>Systematically collect referral rates, attendance data, staff survey scores from every engagement. Build the evidence base that wins the next district.</p>
      </div>
    </div>
  </div>
  <div class="col">
    <div class="col-header" style="background:{ORANGE}">Motion 3: Scale &amp; Serve</div>
    <div class="col-body">
      <div class="item" style="border-color:{ORANGE}">
        <h4 style="color:{ORANGE}">ThriveWell Online Platform</h4>
        <p>Deliver programs as on-demand or live-virtual. Remove Jennifer's geographic ceiling &mdash; serve districts statewide without travel.</p>
      </div>
      <div class="item" style="border-color:{ORANGE}">
        <h4 style="color:{ORANGE}">School Climate Analytics Dashboard</h4>
        <p>Real-time dashboard: referral trends, wellness room utilization, staff surveys, ADA correlation. Data that renews contracts.</p>
      </div>
      <div class="item" style="border-color:{ORANGE}">
        <h4 style="color:{ORANGE}">AI Fractional Advisor</h4>
        <p>Quarterly growth roadmap: which tools next, which grants to pursue, how to package Jennifer's IP into scalable certification programs.</p>
      </div>
    </div>
  </div>
</div>
<div class="result-band">
  <div class="r-item"><div class="num">3x</div><div class="lbl">District Capacity<br>with Online Delivery</div></div>
  <div class="r-item"><div class="num">ADA Up</div><div class="lbl">District Revenue Tied<br>to ThriveWell Outcomes</div></div>
  <div class="r-item"><div class="num">$8B</div><div class="lbl">CA Funding Window<br>Captured via Grant AI</div></div>
  <div class="r-item"><div class="num">70%</div><div class="lbl">Referral Reduction<br>Documented. Repeatable.</div></div>
</div>
</body></html>"""
    render(html, "architecture")

# ── 5. TIMELINE DIAGRAM ──────────────────────────────────────────────────────
def diagram_timeline():
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
*{{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}}
body{{background:{WHITE};padding:40px;width:1120px}}
h2{{color:{BLUE};font-size:20px;font-weight:700;text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px}}
.sub{{text-align:center;color:{GREY};font-size:13px;margin-bottom:28px}}
.phases{{display:flex;gap:0}}
.phase{{flex:1;position:relative}}
.phase-header{{padding:14px 16px;color:{WHITE};font-weight:700;font-size:13px;text-align:center}}
.phase-items{{background:{LGREY};padding:14px;min-height:280px;display:flex;flex-direction:column;gap:8px}}
.item{{background:{WHITE};border-radius:6px;padding:10px 12px;border-left:4px solid transparent;font-size:11px;color:{GREY};line-height:1.4}}
.item strong{{display:block;font-size:11px;font-weight:700;margin-bottom:2px}}
.outcome{{padding:12px;border-radius:6px;text-align:center;font-size:11px;font-weight:700;color:{WHITE};margin-top:auto}}
.phase:not(:last-child) .phase-items{{border-right:2px solid #ddd}}
</style></head><body>
<h2>ThriveWell AI Growth Roadmap</h2>
<p class="sub">90-Day Foundation &rarr; 180-Day Acceleration &rarr; 365-Day Scale</p>
<div class="phases">
  <div class="phase">
    <div class="phase-header" style="background:{BLUE}">Days 1&ndash;90 | Foundation</div>
    <div class="phase-items">
      <div class="item" style="border-color:{BLUE}"><strong>My AI Executive Workshop</strong>Map ThriveWell's AI growth opportunity: grant matching, content scaling, outcome measurement framework</div>
      <div class="item" style="border-color:{BLUE}"><strong>My SEO Authority Launch</strong>Keyword strategy: trauma-informed PD, restorative discipline, school wellness &mdash; CA-optimized</div>
      <div class="item" style="border-color:{BLUE}"><strong>Website Optimization</strong>Add 70% referral reduction case study, outcome data, and online consultation intake flow</div>
      <div class="item" style="border-color:{BLUE}"><strong>LinkedIn Authority Series</strong>"Neuroscience Behind Misbehavior" paper repurposed into 4-part district-leader series</div>
      <div class="item" style="border-color:{BLUE}"><strong>Conference Proposal</strong>Submit ACSA/CDE speaking proposal for "Breaking the School-to-Prison Pipeline"</div>
      <div class="outcome" style="background:{BLUE}">ThriveWell visible in search. Consultation pipeline active. AI roadmap in hand.</div>
    </div>
  </div>
  <div class="phase">
    <div class="phase-header" style="background:{TEAL}">Days 91&ndash;180 | Acceleration</div>
    <div class="phase-items">
      <div class="item" style="border-color:{TEAL}"><strong>My AI Lead Gen Launch</strong>Named-account district intelligence: CYBHI grants, new superintendents, CA Dashboard flags</div>
      <div class="item" style="border-color:{TEAL}"><strong>Grant Application AI</strong>Identify 5&ndash;10 open Title IV / CYBHI / SEL grants. Auto-draft narratives. Jennifer reviews and submits.</div>
      <div class="item" style="border-color:{TEAL}"><strong>Outcome Documentation</strong>Systematize data collection: referral rates, attendance, staff survey scores across all active districts</div>
      <div class="item" style="border-color:{TEAL}"><strong>Virtual Delivery Pilot</strong>Deliver Strong Beginnings or Staff Resilience virtually to 1&ndash;2 distant districts</div>
      <div class="item" style="border-color:{TEAL}"><strong>Content Flywheel</strong>Monthly blog + Substack + LinkedIn. Case study narrative from outcome data.</div>
      <div class="outcome" style="background:{TEAL}">2&ndash;4 new district conversations in pipeline. Grant applications submitted. Outcome data systematized.</div>
    </div>
  </div>
  <div class="phase">
    <div class="phase-header" style="background:{ORANGE}">Days 181&ndash;365 | Scale</div>
    <div class="phase-items">
      <div class="item" style="border-color:{ORANGE}"><strong>ThriveWell Platform Launch</strong>On-demand + live-virtual delivery: Trauma Foundations, Strong Beginnings, Staff Resilience</div>
      <div class="item" style="border-color:{ORANGE}"><strong>School Climate Dashboard</strong>District-facing outcome measurement: referral trends, wellness room data, ADA correlation</div>
      <div class="item" style="border-color:{ORANGE}"><strong>Statewide Expansion</strong>Target 10&ndash;15 new districts via AI account intelligence + SEO leads + conference pipeline</div>
      <div class="item" style="border-color:{ORANGE}"><strong>Certification Program</strong>Package Jennifer's methodology as certifiable district coach track</div>
      <div class="item" style="border-color:{ORANGE}"><strong>Year-End Review</strong>ROI reconciliation, platform metrics, grant results, referral network built</div>
      <div class="outcome" style="background:{ORANGE}">5&ndash;12 active district contracts. Platform revenue live. CA's restorative justice PD leader.</div>
    </div>
  </div>
</div>
</body></html>"""
    render(html, "timeline")

if __name__ == "__main__":
    print("Generating TWS diagrams...")
    diagram_model()
    diagram_personas()
    diagram_competitive()
    diagram_architecture()
    diagram_timeline()
    print("Done. Check Clients/TWS/diagrams/")
