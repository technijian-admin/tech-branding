"""Take per-page screenshots of the brochure for QA."""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
PAGE_H = 1056  # 11in at 96dpi
PAGE_W = 816   # 8.5in at 96dpi

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": PAGE_W, "height": PAGE_H})
    page.goto(f"file:///{os.path.join(ASSETS, 'My AI Brochure.html').replace(os.sep, '/')}")
    page.wait_for_load_state("networkidle")

    # Full page screenshot first
    full = page.screenshot(full_page=True)
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(full))
    w, h = img.size
    pages = h // PAGE_H
    for i in range(min(pages, 10)):
        crop = img.crop((0, i * PAGE_H, w, (i + 1) * PAGE_H))
        crop.save(os.path.join(ASSETS, f"_verify_brochure_pg{i+1}.png"))
        print(f"  Page {i+1} screenshot saved ({crop.size})")

    browser.close()
    print("Done!")
