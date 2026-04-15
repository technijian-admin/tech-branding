from playwright.sync_api import sync_playwright
import os
ASSETS = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance\assets'

with sync_playwright() as p:
    browser = p.chromium.launch()

    # One-pager check
    page = browser.new_page(viewport={'width': 816, 'height': 1056})
    page.goto(f"file:///{os.path.join(ASSETS, 'My Compliance - HIPAA One-Pager.html').replace(os.sep, '/')}")
    page.wait_for_load_state('networkidle')
    h = page.evaluate("() => document.body.scrollHeight")
    print(f"One-pager body scrollHeight: {h}px (target <=1080, ideally <=1056)")
    page.screenshot(path=os.path.join(ASSETS, '_verify_hipaa_onepager.png'), full_page=True)

    # Brochure per-page screenshots
    page2 = browser.new_page(viewport={'width': 816, 'height': 1056})
    page2.goto(f"file:///{os.path.join(ASSETS, 'My Compliance - HIPAA Brochure.html').replace(os.sep, '/')}")
    page2.wait_for_load_state('networkidle')
    pages_count = page2.evaluate("() => document.querySelectorAll('.page').length")
    print(f"Brochure pages: {pages_count}")
    for i in range(pages_count):
        box = page2.evaluate(f"() => {{ const el = document.querySelectorAll('.page')[{i}]; const r = el.getBoundingClientRect(); return {{x: r.x, y: r.y + window.scrollY, w: r.width, h: r.height}}; }}")
        # Scroll to page
        page2.evaluate(f"() => document.querySelectorAll('.page')[{i}].scrollIntoView({{block:'start'}})")
        page2.wait_for_timeout(200)
        page2.screenshot(path=os.path.join(ASSETS, f'_verify_hipaa_pg{i+1}.png'), clip={'x': 0, 'y': 0, 'width': 816, 'height': 1056})
        # Check if content overflows within the .page
        overflow = page2.evaluate(f"() => {{ const el = document.querySelectorAll('.page')[{i}]; return {{scrollH: el.scrollHeight, clientH: el.clientHeight}}; }}")
        print(f"  Page {i+1}: clientH={overflow['clientH']}, scrollH={overflow['scrollH']} {'OVERFLOW' if overflow['scrollH'] > overflow['clientH']+2 else 'OK'}")

    browser.close()
print("Done.")
