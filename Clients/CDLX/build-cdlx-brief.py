# -*- coding: utf-8 -*-
"""Goulet/Hope one-page Partnership Concept Brief — self-contained HTML -> single Letter-page PDF."""
import os, base64
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
LOGO = os.path.join(ROOT, "assets", "logos", "png", "technijian-logo-full-color-600x125.png")
logo_b64 = base64.b64encode(open(LOGO, "rb").read()).decode()
OUT = os.path.join(HERE, "CardLogix-Partnership-Concept-Brief.pdf")

BLUE, ORANGE, TEAL, DARK, GREY, LIGHT, OFF = "#006DB6", "#F67D4B", "#1EAAC8", "#1A1A2E", "#59595B", "#E3E7EB", "#F6F8FA"

html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap');
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ font-family:'Open Sans',Arial,sans-serif; color:{DARK}; font-size:10.3px; line-height:1.42; }}
.head {{ display:flex; align-items:center; justify-content:space-between; border-bottom:3px solid {BLUE}; padding-bottom:8px; }}
.head img {{ height:34px; }}
.head .meta {{ text-align:right; font-size:8.6px; color:{GREY}; line-height:1.5; }}
.head .meta b {{ color:{BLUE}; letter-spacing:1.4px; font-size:9.4px; font-weight:800; }}
h1 {{ font-size:17px; font-weight:800; color:{BLUE}; margin:11px 0 2px; }}
h1 span {{ color:{ORANGE}; }}
.lede {{ font-size:10.6px; color:{GREY}; margin-bottom:10px; }}
.sec {{ border-left:3px solid {BLUE}; background:{OFF}; padding:7px 11px; margin-bottom:8px; border-radius:0 6px 6px 0; }}
.sec.o {{ border-color:{ORANGE}; }} .sec.t {{ border-color:{TEAL}; }}
.sec h2 {{ font-size:11px; font-weight:800; color:{BLUE}; margin-bottom:3px; }}
.sec.o h2 {{ color:{ORANGE}; }} .sec.t h2 {{ color:{TEAL}; }}
.sec p {{ margin:0; }}
.sec p + p {{ margin-top:4px; }}
table {{ width:100%; border-collapse:collapse; margin-top:5px; }}
td, th {{ border:1px solid {LIGHT}; padding:4px 7px; text-align:left; vertical-align:top; }}
th {{ background:{BLUE}; color:#fff; font-weight:700; font-size:9.4px; }}
td b {{ color:{BLUE}; }}
ul {{ margin:2px 0 0 15px; }} li {{ margin-bottom:2px; }}
.ask {{ background:{BLUE}; color:#fff; border-radius:7px; padding:9px 13px; margin-top:9px; }}
.ask b {{ font-size:11.5px; }}
.foot {{ margin-top:9px; border-top:1px solid {LIGHT}; padding-top:6px; font-size:8.4px; color:{GREY}; display:flex; justify-content:space-between; }}
.foot .c {{ color:{BLUE}; font-weight:700; }}
.hon {{ font-style:italic; color:{GREY}; font-size:9px; margin-top:3px; }}
</style></head><body>
  <div class="head">
    <img src="data:image/png;base64,{logo_b64}">
    <div class="meta"><b>PARTNERSHIP CONCEPT BRIEF</b><br>Prepared for Sebastien Goulet (CEO) &amp; Tom Hope (Sales)<br>From Technijian &middot; May 2026 &middot; CONFIDENTIAL</div>
  </div>

  <h1>CardLogix <span>&times;</span> Technijian — the managed wrap that completes the card</h1>
  <div class="lede">A one-page concept for a channel partnership Nick Schooler and Technijian framed on May 29. It is a proposal to react to, not a commitment — and it is separate from CardLogix's own co-managed IT, which can proceed on its own.</div>

  <div class="sec o">
    <h2>Why now</h2>
    <p>Strong MFA has moved from recommended to required in three waves — federal, then state/local and law enforcement (CJIS, mandatory since Oct&nbsp;1, 2024), and now private companies pushed by cyber-insurance renewals. CardLogix's PIV / FIDO2 / FRAC credentials are exactly what these buyers must adopt. What they still lack is a partner to deploy and operate the environment around the card — the gap HID closes with its ecosystem and CardLogix cannot close alone.</p>
  </div>

  <div class="sec">
    <h2>The partnership</h2>
    <p>CardLogix supplies the credential and owns the customer. Technijian wraps the managed IT, 24/7 security operations, the CJIS-aligned compliance program, and the HSM-backed managed certificate authority around it — and the two co-sell a complete answer to CJIS-bound agencies and insurance-driven private firms. Neither side tells this story alone today.</p>
  </div>

  <div class="sec t">
    <h2>The economics — an opening position</h2>
    <table>
      <tr><th>Model</th><th>What CardLogix gets</th><th>Who delivers &amp; carries risk</th></tr>
      <tr><td><b>Referral</b></td><td>Up to <b>10% of the gross monthly service invoice</b> — ongoing</td><td>Technijian contracts, delivers, owns the SLA</td></tr>
      <tr><td><b>Resale</b></td><td>Your own markup; you set retail</td><td>Technijian wholesales to you and operates it</td></tr>
    </table>
    <p style="margin-top:5px;"><b>100% of hardware revenue stays with CardLogix</b>, delivery-side exposure is essentially zero either way, and the partnership adds a recurring margin stream on hardware you already sell. Exact split is a short negotiation, not a prerequisite.</p>
  </div>

  <div class="sec">
    <h2>Why Technijian — and how the risk is contained</h2>
    <ul>
      <li>Local — Irvine Spectrum, five minutes away; operating since 2000; a dedicated team per client.</li>
      <li>Eight compliance frameworks today (HIPAA, SOC&nbsp;2, PCI, CMMC/DFARS, GDPR, NIST&nbsp;CSF, CIS, ISO&nbsp;27001).</li>
      <li><b>CJIS is an honest near-term build</b> on the CMMC practice already run — a dated, months-not-years plan, scoped to one pilot before any multi-agency commitment, with US-based, background-screened staff on any CJI-touching work.</li>
    </ul>
    <div class="hon">We do not claim a CJIS delivery practice we have not earned — the partnership is exactly what would justify standing it up.</div>
  </div>

  <div class="ask">
    <b>The ask:</b> one 30-minute conversation to decide whether to run a single joint pilot — one LE agency, cards plus the managed wrap — and prove the motion before anything scales. Nothing here commits CardLogix.
  </div>

  <div class="foot">
    <span>Ravi Jain, Founder &amp; CEO &nbsp;|&nbsp; RJain@technijian.com &nbsp;|&nbsp; 949.379.8499 &nbsp;|&nbsp; technijian.com</span>
    <span class="c">Companion to the CardLogix AI Growth &amp; Integration Strategy</span>
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
