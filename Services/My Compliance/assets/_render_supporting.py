from playwright.sync_api import sync_playwright
import os
ASSETS = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance\assets'
OUT = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance'
files = [
    ('My Compliance - vCCO One-Pager.html', 'My Compliance - vCCO One-Pager.pdf'),
    ('My Compliance - Audit Prep One-Pager.html', 'My Compliance - Audit Prep One-Pager.pdf'),
]
with sync_playwright() as p:
    browser = p.chromium.launch()
    for h, pdf in files:
        page = browser.new_page(viewport={'width': 816, 'height': 1056})
        page.goto(f"file:///{os.path.join(ASSETS, h).replace(os.sep, '/')}")
        page.wait_for_load_state('networkidle')
        page.pdf(path=os.path.join(OUT, pdf), format='Letter', print_background=True,
                 margin={'top':'0','right':'0','bottom':'0','left':'0'})
        # screenshot for verification
        ss = os.path.join(ASSETS, '_verify_' + pdf.replace('.pdf','.png'))
        page.set_viewport_size({'width': 816, 'height': 1056})
        page.screenshot(path=ss, full_page=True)
        # measure body height
        h_px = page.evaluate("document.body.scrollHeight")
        print(f"  {pdf}  bodyScrollHeight={h_px}px")
    browser.close()
print("Done.")
