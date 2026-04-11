"""My SEO — HTML-to-PDF via Playwright"""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {
        'html': os.path.join(ASSETS, 'My SEO One-Pager.html'),
        'pdf': os.path.join(OUT_DIR, 'My SEO One-Pager.pdf'),
        'screenshot': os.path.join(ASSETS, '_verify_onepager.png'),
    },
    {
        'html': os.path.join(ASSETS, 'My SEO Brochure.html'),
        'pdf': os.path.join(OUT_DIR, 'My SEO Brochure.pdf'),
        'screenshot': os.path.join(ASSETS, '_verify_brochure.png'),
    },
]

def build():
    print("Rendering HTML to PDF via Playwright...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for f in FILES:
            if not os.path.exists(f['html']):
                print(f"  SKIP: {os.path.basename(f['html'])} not found")
                continue
            page = browser.new_page()
            page.goto(f"file:///{f['html'].replace(os.sep, '/')}")
            page.wait_for_load_state('networkidle')
            page.pdf(path=f['pdf'], format='Letter', print_background=True,
                     margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'})
            page.screenshot(path=f['screenshot'], full_page=True)
            size_kb = os.path.getsize(f['pdf']) / 1024
            print(f"  {os.path.basename(f['pdf'])} ({size_kb:.0f} KB)")
        browser.close()
    print("Done!")

if __name__ == '__main__':
    build()
