"""My AI — HTML-to-PDF via Playwright (generic + industry variants)"""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    # Generic
    {'html': 'My AI One-Pager.html', 'pdf': 'My AI One-Pager.pdf', 'screenshot': '_verify_onepager.png'},
    {'html': 'My AI Brochure.html', 'pdf': 'My AI Brochure.pdf', 'screenshot': '_verify_brochure.png'},
    # Real Estate Edition
    {'html': 'My AI - Real Estate One-Pager.html', 'pdf': 'My AI - Real Estate One-Pager.pdf', 'screenshot': '_verify_re_onepager.png'},
    {'html': 'My AI - Real Estate Brochure.html', 'pdf': 'My AI - Real Estate Brochure.pdf', 'screenshot': '_verify_re_brochure.png'},
    # Manufacturing Edition
    {'html': 'My AI - Manufacturing One-Pager.html', 'pdf': 'My AI - Manufacturing One-Pager.pdf', 'screenshot': '_verify_mfg_onepager.png'},
    {'html': 'My AI - Manufacturing Brochure.html', 'pdf': 'My AI - Manufacturing Brochure.pdf', 'screenshot': '_verify_mfg_brochure.png'},
]

def build():
    print("Rendering HTML to PDF via Playwright...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for f in FILES:
            html_path = os.path.join(ASSETS, f['html'])
            pdf_path = os.path.join(OUT_DIR, f['pdf'])
            ss_path = os.path.join(ASSETS, f['screenshot'])
            if not os.path.exists(html_path):
                print(f"  SKIP: {f['html']} not found")
                continue
            page = browser.new_page()
            page.goto(f"file:///{html_path.replace(os.sep, '/')}")
            page.wait_for_load_state('networkidle')
            page.pdf(path=pdf_path, format='Letter', print_background=True,
                     margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'})
            page.screenshot(path=ss_path, full_page=True)
            size_kb = os.path.getsize(pdf_path) / 1024
            print(f"  {f['pdf']} ({size_kb:.0f} KB)")
        browser.close()
    print("Done!")

if __name__ == '__main__':
    build()
