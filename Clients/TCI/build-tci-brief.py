# -*- coding: utf-8 -*-
"""TCI Transportation one-page AI Growth + Integration Concept Brief — self-contained HTML -> single Letter-page PDF.
The most forwardable artifact in the set: a champion can send it as-is.
TRUTHFUL pricing: published entry only; expansion scoped at discovery; NO fabricated ROI ratio (Ravi, 2026-06-01)."""
import os, base64
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
LOGO = os.path.join(ROOT, "assets", "logos", "png", "technijian-logo-full-color-600x125.png")
logo_b64 = base64.b64encode(open(LOGO, "rb").read()).decode()
OUT = os.path.join(HERE, "TCI-AI-Growth-Concept-Brief.pdf")

BLUE, ORANGE, TEAL, DARK, GREY, LIGHT, OFF = "#006DB6", "#F67D4B", "#1EAAC8", "#1A1A2E", "#59595B", "#E3E7EB", "#F6F8FA"

html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap');
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ font-family:'Open Sans',Arial,sans-serif; color:{DARK}; font-size:10.2px; line-height:1.4; }}
.head {{ display:flex; align-items:center; justify-content:space-between; border-bottom:3px solid {BLUE}; padding-bottom:8px; }}
.head img {{ height:34px; }}
.head .meta {{ text-align:right; font-size:8.6px; color:{GREY}; line-height:1.5; }}
.head .meta b {{ color:{BLUE}; letter-spacing:1.4px; font-size:9.4px; font-weight:800; }}
h1 {{ font-size:16px; font-weight:800; color:{BLUE}; margin:11px 0 2px; }}
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
</style></head><body>
  <div class="head">
    <img src="data:image/png;base64,{logo_b64}">
    <div class="meta"><b>AI GROWTH + INTEGRATION — CONCEPT BRIEF</b><br>Prepared for TCI Transportation | TCI Leasing &bull; TCI Transportation<br>From Technijian &middot; June 2026 &middot; CONFIDENTIAL</div>
  </div>

  <h1>TCI <span>&times;</span> Technijian — point AI at the commercial side: get found, win named accounts, run leaner</h1>
  <div class="lede">A one-page concept: commercial AI on two pillars, sitting <i>under</i> the relationships, the yards, and the operational AI TCI already runs. It gets TCI found and arms the sales team — it does not replace the rep or sign the lease. A starting point to react to, not a commitment.</div>

  <div class="two">
    <div class="sec o">
      <h2>Pillar 1 — The Recurring Core</h2>
      <p>Capture more full-service leases, maintenance contracts, and used-truck sales: local + answer-engine search across <b>26+ yards</b>, account intelligence on fleets at a lease-vs-own inflection, and a quote / spec-to-lease assistant that converts 24/7.</p>
    </div>
    <div class="sec t">
      <h2>Pillar 2 — The EV / WAIRE Wedge</h2>
      <p>Own the California zero-emission transition the national giants treat generically. Target the <b>WAIRE-obligated warehouses</b> in TCI's own air basin with EV trucks, charging, and a compliance-cost-vs-lease ROI tool that turns the rule into a sale.</p>
    </div>
  </div>

  <div class="sec">
    <h2>Why now</h2>
    <p>California is legislating the EV pillar into a deadline — SCAQMD's WAIRE rule ramps warehouse obligations through 2031, and CARB's Advanced Clean Fleets and Advanced Clean Trucks mandates push zero-emission adoption — creating a buyer who needs exactly what TCI offers, in TCI's own backyard. Meanwhile a slow freight recovery rewards TCI's diversified, recurring mix (leasing, maintenance, factoring, used trucks), and the giants stay digitally strong but generic. The local operator that out-modernizes regionally captures both.</p>
  </div>

  <div class="sec">
    <h2>Proof — the same motion, already built</h2>
    <p>For a luxury home builder, Technijian built a multi-agent AI system harvesting seven public-records signal layers across <b>10 permit jurisdictions and 60+ committees</b> — surfacing <b>24 enriched, scored Tier-1 leads in a single 75-minute run</b> and replacing 15&ndash;20 hours a week of manual work. That is the exact motion TCI needs to find WAIRE-obligated warehouses and named fleets. Add a multi-location SEO program (340 hours over four months for a multi-property client) for the get-found pillar. TCI keeps the relationships and the yards; Technijian builds the AI layer around them.</p>
  </div>

  <div class="sec t">
    <h2>The program &mdash; two published engines, then a scoped build</h2>
    <table>
      <tr><th>Published recurring (firm pricing)</th><th>Scope</th><th class="r">Monthly</th><th class="r">Y1</th></tr>
      <tr><td><b>My SEO — Tier 5 + AEO / PR / Syndication</b></td><td>Multi-location local + answer-engine search foundation; 12-mo, unlimited hours</td><td class="r">$2,050</td><td class="r">~$24,600</td></tr>
      <tr><td><b>My AI Lead Gen — Professional</b></td><td>3 vertical pipelines (fleets, shippers, WAIRE warehouses), 2,500 leads/mo (+$5,000 setup)</td><td class="r">$3,499</td><td class="r">~$46,988</td></tr>
      <tr><td><b>PUBLISHED RECURRING</b></td><td><b>Both engines &middot; annual plans save 17% + waive setup (&asymp;$59,590)</b></td><td class="r"><b>$5,549</b></td><td class="r"><b>~$71,588</b></td></tr>
    </table>
    <p style="margin-top:5px;">The custom build — quote-to-lease assistant, WAIRE/EV ROI tool, AI-assisted portal, used-truck merchandising — plus a Fractional AI Advisor (est. ~$2,000/mo) and Executive Workshop (est. ~$5,000) are priced from the real 2026 US-led rates (development <b>$150/hr</b>, <b>$125/hr</b> on a contract cycle) and scoped into a fixed-price Statement of Work at discovery. We don't quote numbers we can't ground: the calibrated ROI model comes back within five business days of a discovery call, built on TCI's real per-deal economics.</p>
  </div>

  <div class="ask">
    <b>The ask:</b> a 30-minute walkthrough, plus five zero-commitment Quick Wins and one live before/after — no contract, no obligation. The fastest way to see the highest-value play on real TCI work.
  </div>

  <div class="foot">
    <span>Ravi Jain, Founder &amp; CEO &nbsp;|&nbsp; rjain@technijian.com &nbsp;|&nbsp; 949.379.8499 &nbsp;|&nbsp; technijian.com</span>
    <span class="c">Companion to the TCI AI Growth &amp; Integration Blueprint</span>
  </div>
</body></html>"""

with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page()
    pg.set_content(html)
    pg.wait_for_timeout(600)
    pg.pdf(path=OUT, format="Letter", print_background=True,
           margin={"top": "0.45in", "bottom": "0.4in", "left": "0.55in", "right": "0.55in"})
    b.close()

import fitz
doc = fitz.open(OUT)
print("PAGES:", doc.page_count, "size_kb:", round(os.path.getsize(OUT)/1024))
doc[0].get_pixmap(dpi=140).save(os.path.join(HERE, "_verify", "brief.png"))
doc.close()
