# -*- coding: utf-8 -*-
"""Gate 0 — live digital-presence verification + site crawl for SC Fuels.
Screenshots LinkedIn + Google Maps, dumps key page text, extracts socials & nav.
Each PNG must be OPENED and READ — numbers come off the image, not from search."""
import json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "verify"
OUT.mkdir(exist_ok=True)
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

SHOTS = {
    "linkedin":     "https://www.linkedin.com/company/sc-fuels/",
    "maps_hq":      "https://www.google.com/maps/search/SC+Fuels+Orange+CA",
    "maps_phoenix": "https://www.google.com/maps/search/SC+Fuels+Phoenix+AZ",
}

PAGES = {
    "home":      "https://www.scfuels.com/",
    "about":     "https://www.scfuels.com/about-us/",
    "locations": "https://www.scfuels.com/locations/",
    "blog":      "https://www.scfuels.com/blog/",
    "news":      "https://www.scfuels.com/news/",
    "resources": "https://www.scfuels.com/resources/",
    "contact":   "https://www.scfuels.com/contact-us/",
    "services":  "https://www.scfuels.com/services/",
}

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(device_scale_factor=2, viewport={"width": 1280, "height": 1200}, user_agent=UA)
    pg = ctx.new_page()

    # Screenshots for visual verification
    for name, url in SHOTS.items():
        try:
            pg.goto(url, timeout=30000, wait_until="domcontentloaded")
            pg.wait_for_timeout(3500)
            pg.screenshot(path=str(OUT / f"verify_{name}.png"), full_page=False)
            print(f"SHOT {name:12s} OK  {pg.title()[:60]}")
        except Exception as e:
            print(f"SHOT {name:12s} FAIL {str(e)[:70]}")

    # Page text + link harvest
    for name, url in PAGES.items():
        try:
            resp = pg.goto(url, timeout=30000, wait_until="domcontentloaded")
            pg.wait_for_timeout(2000)
            status = resp.status if resp else "?"
            text = pg.inner_text("body")[:14000]
            (OUT / f"{name}.txt").write_text(
                f"URL: {url}\nSTATUS: {status}\nTITLE: {pg.title()}\n\n{text}", encoding="utf-8")
            if name == "home":
                links = pg.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
                socials = sorted({l for l in links if re.search(
                    r"linkedin|facebook|instagram|youtube|twitter|x\.com", l)})
                internal = sorted({l for l in links if "scfuels.com" in l})
                (OUT / "_links.json").write_text(json.dumps(
                    {"socials": socials, "internal": internal[:60]}, indent=2), encoding="utf-8")
                print("SOCIALS:", *socials, sep="\n  ")
            print(f"PAGE {name:12s} {status} {pg.title()[:55]}")
        except Exception as e:
            print(f"PAGE {name:12s} FAIL {str(e)[:70]}")

    b.close()
print("\nDone. Verify dir:", OUT)
