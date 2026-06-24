"""
build-ray-onepager.py — Rayco Exteriors (RAY) one-page forwardable Concept Brief.
HTML -> Playwright -> single Letter PDF + PNG. Brand tokens, logo embedded base64.
The reframe: NOT managed IT/security — AI to get found by community managers and win
more HOA reconstruction bids, on the SB 326 clock. AI never touches the field work.
Usage:  py -3.12 "Clients/RAY/build-ray-onepager.py"
"""
import asyncio, base64, pathlib
from playwright.async_api import async_playwright

HERE = pathlib.Path(__file__).parent
LOGO = HERE / "assets" / "Technijian Logo 2.png"
OUT_PDF = HERE / "Rayco-Exteriors-One-Page-Brief.pdf"
OUT_PNG = HERE / "Rayco-Exteriors-One-Page-Brief.png"

BLUE="#006DB6"; ORANGE="#F67D4B"; TEAL="#1EAAC8"; DARK="#1A1A2E"; GREY="#59595B"
LIGHT="#E9ECEF"; OFF="#F8F9FA"; GREEN="#28A745"; GOLD="#C9922A"

logo_b64 = base64.b64encode(LOGO.read_bytes()).decode()

HTML = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter; margin: 0; }}
*{{margin:0;padding:0;box-sizing:border-box;font-family:'Open Sans','Segoe UI',Arial,sans-serif;}}
body{{width:8.5in;height:11in;color:{DARK};}}
.bar{{height:14px;background:{BLUE};}}
.bar.o{{background:{ORANGE};}}
.wrap{{padding:24px 44px 0 44px;}}
.head{{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid {BLUE};padding-bottom:10px;}}
.head img{{height:42px;}}
.head .meta{{text-align:right;font-size:10px;color:{GREY};line-height:1.5;}}
h1{{font-size:25px;color:{DARK};margin-top:14px;}}
.sub{{font-size:12.5px;color:{ORANGE};font-weight:700;letter-spacing:.5px;margin-top:2px;}}
.reframe{{font-size:10.5px;color:{GREY};font-style:italic;margin-top:7px;line-height:1.5;border-left:3px solid {ORANGE};padding-left:10px;}}
.kpis{{display:flex;gap:10px;margin-top:13px;}}
.kpi{{flex:1;background:{OFF};border-radius:5px;padding:9px 6px;text-align:center;}}
.kpi .n{{font-size:18px;font-weight:800;}}
.kpi .l{{font-size:8.6px;color:{GREY};margin-top:3px;line-height:1.3;}}
.lead{{font-size:11px;line-height:1.6;margin-top:14px;text-align:justify;}}
.lead b{{color:{DARK};}}
.cols{{display:flex;gap:11px;margin-top:13px;}}
.col{{flex:1;border:1px solid {LIGHT};border-radius:6px;overflow:hidden;}}
.col .ch{{color:#fff;font-size:11px;font-weight:800;padding:6px 9px;}}
.col ul{{list-style:none;padding:8px 9px;}}
.col li{{font-size:9.6px;line-height:1.32;color:{GREY};margin-bottom:6px;padding-left:11px;position:relative;}}
.col li:before{{content:"";position:absolute;left:0;top:5px;width:5px;height:5px;border-radius:50%;background:{GREY};}}
.clock{{margin-top:13px;background:{OFF};border-left:5px solid {TEAL};border-radius:5px;padding:11px 14px;}}
.clock .t{{font-size:11.5px;font-weight:800;color:{TEAL};}}
.clock p{{font-size:10.2px;line-height:1.55;color:{GREY};margin-top:4px;}}
.prog{{display:flex;gap:11px;margin-top:13px;}}
.prog .box{{flex:1;border:1px solid {LIGHT};border-radius:6px;padding:11px 13px;}}
.prog .box .t{{font-size:11.5px;font-weight:800;color:{BLUE};margin-bottom:5px;}}
.prog .box p{{font-size:10px;line-height:1.5;color:{GREY};}}
.prog .box.v{{border-color:{ORANGE};}}
.prog .box.v .t{{color:{ORANGE};}}
.cta{{margin-top:14px;background:{DARK};border-radius:6px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;}}
.cta .l{{color:#fff;}}
.cta .l .t{{font-size:12.5px;font-weight:800;}}
.cta .l .d{{font-size:9.8px;color:#C9CDD6;margin-top:3px;}}
.cta .r{{color:#fff;text-align:right;font-size:10px;line-height:1.5;}}
.foot{{text-align:center;font-size:8.4px;color:{GREY};margin-top:9px;}}
</style></head><body>
<div class="bar"></div>
<div class="wrap">
  <div class="head">
    <img src="data:image/png;base64,{logo_b64}"/>
    <div class="meta">CONFIDENTIAL · Prepared for Gabe Cooley, President<br>Rayco Exteriors · June 23, 2026</div>
  </div>
  <h1>Rayco Exteriors</h1>
  <div class="sub">AI GROWTH &amp; BID-INTELLIGENCE — ONE-PAGE BRIEF</div>
  <div class="reframe">Not a managed-IT or security pitch — you’ve told us that’s not a need today, and we’ve set it aside. This is AI on your commercial front end: getting found by the community managers who hire reconstruction contractors, and winning more of the bids you already compete for. It never touches the field work.</div>

  <div class="kpis">
    <div class="kpi"><div class="n" style="color:{BLUE}">3,500+</div><div class="l">communities &amp; buildings (self-reported)</div></div>
    <div class="kpi"><div class="n" style="color:{ORANGE}">B + C-33</div><div class="l">licensed general &amp; painting contractor</div></div>
    <div class="kpi"><div class="n" style="color:{TEAL}">SB 326</div><div class="l">HOA balcony repairs every 9 yrs</div></div>
    <div class="kpi"><div class="n" style="color:{GREEN}">3.4&#9733;/27</div><div class="l">reported reviews — the gap to close</div></div>
  </div>

  <div class="lead"><b>The gap is reach and reputation, not craft.</b> Rayco wins through a knowable universe of community managers, boards, and the construction managers who write the specs — yet it is thin where those buyers look: a reported 3.4-star, 27-review profile (competitors carry hundreds), no content hub (the /resources and /careers pages error out), and little presence in the AI answers a manager now asks first. Meanwhile California’s SB 326 has put thousands of HOA balcony repairs on a recurring deadline. The work and the demand are real; the trail a 2026 buyer follows to find you is not yet built.</div>

  <div class="cols">
    <div class="col"><div class="ch" style="background:{BLUE}">BE FOUND &amp; TRUSTED</div><ul>
      <li>Modern site + board-ready SB 326 content</li>
      <li>Reputation engine — close the review gap</li>
      <li>AEO/GEO: be the answer managers search</li>
    </ul></div>
    <div class="col"><div class="ch" style="background:{ORANGE};color:{DARK}">WIN MORE BIDS</div><ul>
      <li>SB 326 / 721 account intelligence — who’s on the clock</li>
      <li>Map the management-company portfolios</li>
      <li>AI-drafted, spec-matched bid responses</li>
    </ul></div>
    <div class="col"><div class="ch" style="background:{TEAL};color:{DARK}">OPERATE FASTER</div><ul>
      <li>Estimate-to-proposal speed for the team</li>
      <li>3,500 projects searchable for faster bids</li>
      <li>Vendor-qualification packets on demand</li>
    </ul></div>
  </div>

  <div class="prog">
    <div class="box"><div class="t">The entry — start small</div><p>Be found and trusted first: a modern site with SB 326 content, local-search presence, and a reputation engine. Priced from published My&nbsp;SEO / My&nbsp;AI ranges and scaled to your firm — the cheapest, fastest win, and it lifts every bid that follows.</p></div>
    <div class="box v"><div class="t">Value at stake — not a multiple we invent</div><p>One additional HOA reconstruction or full exterior-rehab contract — or one management-company portfolio opened — is worth far more than a year of this engine. It pays for itself on a single bid that would never have reached you. Real numbers modeled at discovery.</p></div>
  </div>

  <div class="cta">
    <div class="l"><div class="t">A 45-minute working session — no obligation</div><div class="d">We’ll walk the plan and the discovery questions, and be honest about what’s worth doing now. If the answer is “not now,” we’ll respect it.</div></div>
    <div class="r"><b>Ravi Jain</b>, Founder &amp; CEO<br>rjain@technijian.com · 949.379.8499<br>technijian.com</div>
  </div>
  <div class="foot">Technijian · technology as a solution · A facts-only brief: review counts are reported, the founding year is left open, and no revenue figure is cited. The full blueprint and executive summary are available on request.</div>
</div>
<div class="bar o" style="position:absolute;bottom:0;left:0;width:8.5in;"></div>
</body></html>"""

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pg = await b.new_page(device_scale_factor=2)
        await pg.set_content(HTML, wait_until="networkidle")
        await pg.pdf(path=str(OUT_PDF), width="8.5in", height="11in", print_background=True)
        await pg.set_viewport_size({"width": 816, "height": 1056})
        await pg.screenshot(path=str(OUT_PNG), clip={"x":0,"y":0,"width":816,"height":1056})
        await b.close()
    print(f"Wrote: {OUT_PDF.name} ({OUT_PDF.stat().st_size//1024} KB)")
    print(f"Wrote: {OUT_PNG.name} ({OUT_PNG.stat().st_size//1024} KB)")

if __name__ == "__main__":
    asyncio.run(main())
