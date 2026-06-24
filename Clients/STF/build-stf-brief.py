"""
build-stf-brief.py — Shoes That Fit one-page forwardable Concept Brief (HYBRID).
Self-contained HTML -> Playwright -> single US-Letter PDF + a verify PNG.
Brand tokens; authentic logo. The most forwardable artifact: gap -> two fronts -> entry -> CTA.
Usage:  py -3.12 "Clients/STF/build-stf-brief.py"
"""
import asyncio, pathlib, base64
from playwright.async_api import async_playwright

HERE = pathlib.Path(__file__).parent
LOGO = HERE / "assets" / "Technijian Logo 2.png"
PDF = HERE / "Shoes-That-Fit-Concept-Brief.pdf"
PNG = HERE / "_verify" / "brief.jpg"
PNG.parent.mkdir(exist_ok=True)

BLUE="#006DB6"; ORANGE="#F67D4B"; TEAL="#1EAAC8"; DARK="#1A1A2E"; GREY="#59595B"
LIGHT="#E9ECEF"; OFF="#F8F9FA"; GREEN="#28A745"; CRIT="#CC0000"

logo_b64 = base64.b64encode(LOGO.read_bytes()).decode()

def kpi(n, l, c):
    return f'<div class="kpi"><div class="kn" style="color:{c}">{n}</div><div class="kl">{l}</div></div>'

def li(t, d, c):
    return f'<li><span class="dot" style="background:{c}"></span><b>{t}</b> {d}</li>'

HTML = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
*{{margin:0;padding:0;box-sizing:border-box;}}
@page{{size:8.5in 11in;margin:0;}}
html,body{{width:8.5in;height:11in;font-family:'Open Sans',Arial,sans-serif;color:{DARK};}}
.bar{{height:14px;}}
.wrap{{padding:20px 40px 0 40px;}}
.top{{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid {LIGHT};padding-bottom:12px;}}
.top img{{height:42px;}}
.tag{{font-size:11px;font-weight:700;letter-spacing:1.5px;color:{ORANGE};}}
h1{{font-size:27px;font-weight:700;margin-top:16px;}}
.sub{{font-size:12.5px;color:{GREY};margin-top:5px;line-height:1.45;}}
.kpis{{display:flex;gap:10px;margin:16px 0 6px;}}
.kpi{{flex:1;background:{OFF};border-radius:6px;padding:12px 6px;text-align:center;}}
.kn{{font-size:24px;font-weight:700;}}
.kl{{font-size:9.5px;color:{GREY};margin-top:3px;line-height:1.25;}}
.moment{{font-size:12px;color:{DARK};background:#FFF4EE;border-left:4px solid {ORANGE};border-radius:4px;padding:10px 14px;margin:12px 0;line-height:1.5;}}
.cols{{display:flex;gap:16px;margin-top:6px;}}
.col{{flex:1;}}
.ch{{font-size:13px;font-weight:700;color:#fff;border-radius:5px;padding:7px 12px;}}
.col ul{{list-style:none;margin-top:9px;}}
.col li{{font-size:11px;line-height:1.4;color:{GREY};margin-bottom:8px;padding-left:16px;position:relative;}}
.col li b{{color:{DARK};}}
.dot{{position:absolute;left:0;top:5px;width:8px;height:8px;border-radius:50%;}}
.prog{{display:flex;gap:14px;margin-top:14px;align-items:flex-start;}}
.prog .box{{flex:1;background:{OFF};border-radius:6px;padding:11px 14px;}}
.prog .bh{{font-size:11px;font-weight:700;color:{BLUE};margin-bottom:4px;}}
.prog .bt{{font-size:10.5px;color:{GREY};line-height:1.45;}}
.cta{{margin-top:14px;background:{DARK};border-radius:7px;padding:13px 18px;color:#fff;display:flex;justify-content:space-between;align-items:center;}}
.cta .l{{font-size:12.5px;font-weight:700;}}
.cta .r{{font-size:10.5px;color:#C9CDD6;margin-top:3px;}}
.cta .book{{background:{ORANGE};color:{DARK};font-size:11px;font-weight:700;padding:9px 14px;border-radius:5px;white-space:nowrap;}}
.foot{{position:absolute;bottom:26px;left:40px;right:40px;font-size:9px;color:{GREY};text-align:center;line-height:1.4;}}
</style></head>
<body>
<div class="bar" style="background:{BLUE}"></div>
<div class="wrap">
  <div class="top">
    <img src="data:image/png;base64,{logo_b64}"/>
    <div class="tag">CONCEPT BRIEF · CONFIDENTIAL</div>
  </div>
  <h1>Shoes That Fit — AI Growth &amp; IT Readiness</h1>
  <div class="sub">A record $776,000 gift and a year of scaling raise the stakes on two fronts: <b>protect</b> the money and donor data, then <b>grow</b> the corporate-partner engine with AI. Built for whoever leads technology and growth — from public facts only.</div>

  <div class="kpis">
    {kpi("1992","Founded · national 501(c)(3)",BLUE)}
    {kpi("~218K","Children a year, all 50 states",ORANGE)}
    {kpi("3M+","Pairs of new shoes since 1992",TEAL)}
    {kpi("$776K+","Largest-ever gift · Stater Bros.",GREEN)}
  </div>

  <div class="moment">A gift this size, announced this publicly, is both an opportunity and a target — and the same engine that protects it can grow the partnerships that produced it.</div>

  <div class="cols">
    <div class="col">
      <div class="ch" style="background:{BLUE}">FOUNDATION — SECURE &amp; SCALE</div>
      <ul>
        {li("Payment &amp; email fraud controls —","verify every transfer so a publicized gift can't be hijacked.",BLUE)}
        {li("Identity &amp; device security —","MFA and endpoint protection for a 44-person team.",BLUE)}
        {li("Microsoft 365 grant-cliff migration —","re-license cleanly after the 2025 nonprofit change.",BLUE)}
        {li("Free Nexus Assess baseline —","one no-cost risk assessment, dark-web and M365 review.",GREEN)}
      </ul>
    </div>
    <div class="col">
      <div class="ch" style="background:{ORANGE};color:{DARK}">GROWTH — RAISE &amp; REACH</div>
      <ul>
        {li("Corporate-partner ABM —","look-alike prospects and renewal signals for the #1 engine.",ORANGE)}
        {li("Grant discovery &amp; drafting —","match funders and draft faster; staff write the case.",ORANGE)}
        {li("Donor reactivation —","segment and re-engage lapsed and mid-tier donors.",ORANGE)}
        {li("Impact stories &amp; CSR reports —","per-partner reports that win the next gift.",TEAL)}
      </ul>
    </div>
  </div>

  <div class="prog">
    <div class="box"><div class="bh">THE ENTRY</div><div class="bt">Start with the free Nexus Assess and the free/discounted nonprofit stack — including up to $10,000/mo in free Google Ad Grants — then one growth automation. Affordable by design; we scope the rest to your budget and grant cycles.</div></div>
    <div class="box"><div class="bh">HOW WE MEASURE RETURN</div><div class="bt">In dollars raised, staff hours recovered, children reached, and risk avoided — not a revenue multiple. Conservative, mid, and upside numbers come after a short discovery call gives us your real figures.</div></div>
  </div>

  <div class="cta">
    <div><div class="l">Start with the free assessment and a 30-minute working session.</div><div class="r">Ravi Jain, Founder &amp; CEO · rjain@technijian.com · 949.379.8499 · technijian.com</div></div>
    <div class="book">Book a meeting</div>
  </div>
</div>
<div class="foot">Technijian · technology as a solution · Prepared June 23, 2026. Facts from public sources (shoesthatfit.org, IRS Form 990, Charity Navigator, press); IT/security posture is private and treated as questions to confirm. "$776,000+" is the organization's figure (one outlet rounded to $766,000).</div>
<div class="bar" style="background:{ORANGE};position:absolute;bottom:0;left:0;right:0;"></div>
</body></html>"""

async def main():
    (HERE / "brief.html").write_text(HTML, encoding="utf-8")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        await page.goto((HERE / "brief.html").as_uri(), wait_until="networkidle")
        await page.wait_for_timeout(400)
        await page.pdf(path=str(PDF), width="8.5in", height="11in", print_background=True)
        await page.set_viewport_size({"width":816,"height":1056})
        await page.screenshot(path=str(PNG), full_page=True)
        await browser.close()
    print(f"Wrote: {PDF.name} and {PNG.name}")

if __name__ == "__main__":
    asyncio.run(main())
