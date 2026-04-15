from playwright.sync_api import sync_playwright
import os
ASSETS = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance\assets'
OUT = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance'
files = [
    ('My Compliance - HIPAA Brochure.html', 'My Compliance - HIPAA Brochure.pdf'),
    ('My Compliance - HIPAA One-Pager.html', 'My Compliance - HIPAA One-Pager.pdf'),
]
with sync_playwright() as p:
    browser = p.chromium.launch()
    for h, pdf in files:
        page = browser.new_page()
        page.goto(f"file:///{os.path.join(ASSETS, h).replace(os.sep, '/')}")
        page.wait_for_load_state('networkidle')
        page.pdf(path=os.path.join(OUT, pdf), format='Letter', print_background=True,
                 margin={'top':'0','right':'0','bottom':'0','left':'0'})
        print(f"  {pdf}")
    browser.close()
print("Done.")
