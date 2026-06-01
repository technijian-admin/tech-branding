# -*- coding: utf-8 -*-
"""Danielian one-page AI Growth + Integration Concept Brief — self-contained HTML -> single Letter-page PDF.
The most forwardable artifact in the set: a champion (Deborah Muro / Victor Alvarez-Duran) can send it as-is."""
import os, base64
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
LOGO = os.path.join(ROOT, "assets", "logos", "png", "technijian-logo-full-color-600x125.png")
logo_b64 = base64.b64encode(open(LOGO, "rb").read()).decode()
OUT = os.path.join(HERE, "Danielian-AI-Growth-Concept-Brief.pdf")

BLUE, ORANGE, TEAL, DARK, GREY, LIGHT, OFF = "#006DB6", "#F67D4B", "#1EAAC8", "#1A1A2E", "#59595B", "#E3E7EB", "#F6F8FA"

html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap');
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ font-family:'Open Sans',Arial,sans-serif; color:{DARK}; font-size:10.2px; line-height:1.4; }}
.head {{ display:flex; align-items:center; justify-content:space-between; border-bottom:3px solid {BLUE}; padding-bottom:8px; }}
.head img {{ height:34px; }}
.head .meta {{ text-align:right; font-size:8.6px; color:{GREY}; line-height:1.5; }}
.head .meta b {{ color:{BLUE}; letter-spacing:1.4px; font-size:9.4px; font-weight:800; }}
h1 {{ font-size:16.5px; font-weight:800; color:{BLUE}; margin:11px 0 2px; }}
h1 span {{ color:{ORANGE}; }}
.lede {{ font-size:10.4px; color:{GREY}; margin-bottom:9px; }}
.sec {{ border-left:3px solid {BLUE}; background:{OFF}; padding:7px 11px; margin-bottom:7px; border-radius:0 6px 6px 0; }}
.sec.o {{ border-color:{ORANGE}; }} .sec.t {{ border-color:{TEAL}; }}
.sec h2 {{ font-size:11px; font-weight:800; color:{BLUE}; margin-bottom:3px; }}
.sec.o h2 {{ color:{ORANGE}; }} .sec.t h2 {{ color:{TEAL}; }}
.sec p {{ margin:0; }}
.two {{ display:flex; gap:8px; }}
.two .sec {{ flex:1; }}
table {{ width:100%; border-collapse:collapse; margin-top:5px; }}
td, th {{ border:1px solid {LIGHT}; padding:4px 7px; text-align:left; vertical-align:top; }}
th {{ background:{BLUE}; color:#fff; font-weight:700; font-size:9.2px; }}
td b {{ color:{BLUE}; }}
.r {{ text-align:right; }}
ul {{ margin:2px 0 0 15px; }} li {{ margin-bottom:2px; }}
.ask {{ background:{BLUE}; color:#fff; border-radius:7px; padding:9px 13px; margin-top:8px; }}
.ask b {{ font-size:11.5px; }}
.foot {{ margin-top:8px; border-top:1px solid {LIGHT}; padding-top:6px; font-size:8.4px; color:{GREY}; display:flex; justify-content:space-between; }}
.foot .c {{ color:{BLUE}; font-weight:700; }}
.hon {{ font-style:italic; color:{GREY}; font-size:9px; margin-top:3px; }}
</style></head><body>
  <div class="head">
    <img src="data:image/png;base64,{logo_b64}">
    <div class="meta"><b>AI GROWTH + INTEGRATION — CONCEPT BRIEF</b><br>Prepared for Danielian Associates | Architects &bull; Planners<br>From Technijian &middot; June 2026 &middot; CONFIDENTIAL</div>
  </div>

  <h1>Danielian <span>&times;</span> Technijian — win more pursuits, run the studio with less drag</h1>
  <div class="lede">A one-page concept: AI on two fronts, sitting <i>under</i> the relationships and the craft Danielian has built over 57 years. It augments the licensed architects and planners — it does not design or stamp. This is a starting point to react to, not a commitment.</div>

  <div class="two">
    <div class="sec o">
      <h2>Front 1 — Growth</h2>
      <p>Win a larger share of the named developer universe Danielian already competes for: pursuit/proposal assembly from days to hours, account intelligence on land buys and entitlement filings, and authority content on the questions developers ask. <b>Owner: Deborah Muro (BD).</b></p>
    </div>
    <div class="sec t">
      <h2>Front 2 — Integration</h2>
      <p>Make 57 years and 6,353 projects searchable; give entitlement and code research a head start; return hours to billable design. For an established firm this may be the bigger near-term win. <b>Owner: Victor Alvarez-Duran (CTM).</b></p>
    </div>
  </div>

  <div class="sec">
    <h2>Why now</h2>
    <p>California is legislating housing demand up into Danielian's exact product lines — SB&nbsp;79 transit upzoning (effective July&nbsp;1, 2026), SB&nbsp;1211 (up to 8 ADUs per multifamily lot), and ADU streamlining — while the architecture field splits into AI-ready and AI-behind firms (53% of A&amp;E firms now use AI; only ~20% feel "highly prepared"). The firm that turns pursuits around fastest captures disproportionate share.</p>
  </div>

  <div class="sec">
    <h2>Proof — same market, already built</h2>
    <p>For a luxury custom-home builder in OC coastal communities, Technijian built a multi-agent AI system watching the signals that precede a permit (just-sold, ARC filings, story poles, DRB agendas) across 10 permit jurisdictions and 60+ HOA committees — surfacing <b>24 enriched, scored Tier-1 leads in a single 75-minute run</b>. Same public-records terrain as Danielian's developer pursuits. The design craft stays with Danielian; Technijian builds the AI and IT layer around it.</p>
  </div>

  <div class="sec t">
    <h2>The program &mdash; framed as EOS Rocks</h2>
    <table>
      <tr><th>Entry (the easy yes)</th><th>Scope</th><th class="r">Est. Y1</th></tr>
      <tr><td><b>My AI Workshop + Readiness</b></td><td>Set the program as EOS Rocks; readiness baseline</td><td class="r">~$5,000</td></tr>
      <tr><td><b>Fractional AI Advisor</b></td><td>Program lead, governance, pursuit-automation pilot</td><td class="r">~$24,000</td></tr>
      <tr><td><b>My SEO — Authority / AEO</b></td><td>Authority content on the housing-policy questions developers ask</td><td class="r">~$12,000</td></tr>
      <tr><td><b>ENTRY PROGRAM (Y1)</b></td><td><b>Prove the lift, no large build</b></td><td class="r"><b>~$41,000</b></td></tr>
    </table>
    <p style="margin-top:5px;">Modeled ROI vs. the entry: <b>pays for itself</b> on recovered studio hours alone (zero added wins); <b>~2.6&times;</b> expected (one added pursuit win + hours); ~5.5&times; upside. The expansion — the knowledge graph, account intelligence, and entitlement assistant — is scoped at discovery and compounds across every pursuit and office. Estimates, calibrated to Danielian's real numbers.</p>
  </div>

  <div class="ask">
    <b>The ask:</b> a 30-minute walkthrough, plus a free Nexus Assess and one live-pursuit before/after — no contract, no obligation. The fastest way to see the highest-value play on real work.
  </div>

  <div class="foot">
    <span>Ravi Jain, Founder &amp; CEO &nbsp;|&nbsp; rjain@technijian.com &nbsp;|&nbsp; 949.379.8499 &nbsp;|&nbsp; technijian.com</span>
    <span class="c">Companion to the Danielian AI Growth &amp; Integration Strategy</span>
  </div>
</body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.set_content(html)
    pg.wait_for_timeout(600)
    pg.pdf(path=OUT, format="Letter", print_background=True,
           margin={"top": "0.45in", "bottom": "0.4in", "left": "0.55in", "right": "0.55in"})
    b.close()

import fitz
doc = fitz.open(OUT)
print("PAGES:", doc.page_count, "size_kb:", round(os.path.getsize(OUT)/1024))
doc[0].get_pixmap(dpi=130).save(os.path.join(HERE, "_brief.jpg"))
doc.close()
