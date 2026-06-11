# -*- coding: utf-8 -*-
"""Gate 0 — live digital-presence verification for AXRT (Axis Research & Technologies).
Screenshots LinkedIn, Google Maps (all 4 locations), blog, and careers pages.
Each PNG must then be OPENED and READ — the numbers come off the image, not from search."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "verify"
OUT.mkdir(exist_ok=True)

TARGETS = {
    "linkedin":      "https://www.linkedin.com/company/axis-research-technologies/",
    "maps_irvine":   "https://www.google.com/maps/search/Axis+Research+%26+Technologies+Irvine+CA",
    "maps_columbia": "https://www.google.com/maps/search/Axis+Research+%26+Technologies+Columbia+MD",
    "maps_nashville":"https://www.google.com/maps/search/Axis+Research+%26+Technologies+Nashville+TN",
    "maps_houston":  "https://www.google.com/maps/search/Axis+Research+%26+Technologies+Houston+TX",
    "blog":          "https://axisrt.com/blog/",
    "news":          "https://axisrt.com/news/",
    "site_home":     "https://axisrt.com/",
    "careers":       "https://axisrt.com/careers/",
}

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(device_scale_factor=2, viewport={"width": 1280, "height": 900})
    pg = ctx.new_page()
    for name, url in TARGETS.items():
        try:
            pg.goto(url, timeout=25000, wait_until="domcontentloaded")
            pg.wait_for_timeout(3000)
            path = OUT / f"verify_{name}.png"
            pg.screenshot(path=str(path), full_page=False)
            print(f"{name:15s} OK    {pg.title()[:70]}")
        except Exception as e:
            print(f"{name:15s} FAIL  {str(e)[:90]}")
    b.close()
print("\nScreenshots in:", OUT)
