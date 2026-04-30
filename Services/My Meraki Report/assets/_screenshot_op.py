from playwright.sync_api import sync_playwright
import os

ASSETS = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(ASSETS, "My Meraki Report One-Pager.html")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 816, 'height': 1056})
    page.goto(f"file:///{html_path.replace(os.sep, '/')}", wait_until='domcontentloaded')
    page.wait_for_timeout(2000)
    try:
        page.wait_for_load_state('networkidle', timeout=8000)
    except Exception:
        pass
    page.screenshot(path=os.path.join(ASSETS, "_verify_onepager.png"), full_page=True)
    page.screenshot(
        path=os.path.join(ASSETS, "_verify_op_pricing.png"),
        full_page=True,
        clip={'x': 0, 'y': 700, 'width': 816, 'height': 356},
    )
    browser.close()
print("Done")
