# -*- coding: utf-8 -*-
"""Capture the REAL AXRT LinkedIn page (slug has an ampersand)."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "verify"
URL = "https://www.linkedin.com/company/axis-research-&-technologies"

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(device_scale_factor=2, viewport={"width": 1280, "height": 1400},
                        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")
    pg = ctx.new_page()
    pg.goto(URL, timeout=30000, wait_until="domcontentloaded")
    pg.wait_for_timeout(4000)
    pg.screenshot(path=str(OUT / "verify_linkedin_real.png"), full_page=False)
    print("Title:", pg.title())
    try:
        text = pg.inner_text("body")[:3000]
        print(text)
    except Exception as e:
        print("text fail", e)
    b.close()
