"""One-off hi-res (2x) per-page screenshots for proofreading."""
import os
from playwright.sync_api import sync_playwright
A = os.path.dirname(os.path.abspath(__file__))
specs = [("Jian for Applications Datasheet.html", "_hi_ds", 1),
         ("Jian for Applications Brochure.html", "_hi_br", 5)]
with sync_playwright() as p:
    b = p.chromium.launch()
    for h, pfx, n in specs:
        pg = b.new_page(viewport={'width': 816, 'height': 1056}, device_scale_factor=2)
        pg.goto(f"file:///{os.path.join(A, h).replace(os.sep, '/')}", wait_until='domcontentloaded')
        pg.wait_for_timeout(1800)
        try:
            pg.wait_for_load_state('networkidle', timeout=8000)
        except Exception:
            pass
        for i in range(n):
            y = 32 + i * (1056 + 24)
            pg.screenshot(path=os.path.join(A, f"{pfx}{i+1}.png"),
                          clip={'x': 0, 'y': y, 'width': 816, 'height': 1056})
        pg.close()
    b.close()
print("hires done")
