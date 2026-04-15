from playwright.sync_api import sync_playwright
import os
ASSETS = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance\assets'
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 816, 'height': 1056})
    page.goto(f"file:///{os.path.join(ASSETS, 'My Compliance - Audit Prep One-Pager.html').replace(os.sep,'/')}")
    page.wait_for_load_state('networkidle')
    page.screenshot(path=os.path.join(ASSETS, '_verify_audit_full.png'), full_page=True, clip={'x':0,'y':0,'width':816,'height':1056})
    h_px = page.evaluate("document.body.scrollHeight")
    print(f"body={h_px}px viewport=816x1056")
    browser.close()
