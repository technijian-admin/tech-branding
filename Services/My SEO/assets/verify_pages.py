"""Take per-page screenshots of the brochure for QA."""
import os
from playwright.sync_api import sync_playwright
from PIL import Image
import io

ASSETS = os.path.dirname(os.path.abspath(__file__))
PAGE_H = 1056
PAGE_W = 816

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": PAGE_W, "height": PAGE_H})
    page.goto(f"file:///{os.path.join(ASSETS, 'My SEO Brochure.html').replace(os.sep, '/')}")
    page.wait_for_load_state("networkidle")
    full = page.screenshot(full_page=True)
    img = Image.open(io.BytesIO(full))
    w, h = img.size
    pages = h // PAGE_H
    for i in range(min(pages, 10)):
        crop = img.crop((0, i * PAGE_H, w, (i + 1) * PAGE_H))
        crop.save(os.path.join(ASSETS, f"_verify_brochure_pg{i+1}.png"))
        print(f"  Page {i+1} screenshot saved ({crop.size})")
    browser.close()
    print("Done!")
