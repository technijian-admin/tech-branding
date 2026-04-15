"""My IT — HTML-to-PDF via Playwright"""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {'html': 'My IT One-Pager.html', 'pdf': 'My IT One-Pager.pdf'},
    {'html': 'My IT Brochure.html', 'pdf': 'My IT Brochure.pdf'},
]

def build():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for f in FILES:
            html_path = os.path.join(ASSETS, f['html'])
            pdf_path = os.path.join(OUT_DIR, f['pdf'])
            if not os.path.exists(html_path):
                continue
            page = browser.new_page()
            page.goto(f"file:///{html_path.replace(os.sep, '/')}")
            page.wait_for_load_state('networkidle')
            page.pdf(path=pdf_path, format='Letter', print_background=True,
                     margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'})
            print(f"  {f['pdf']} ({os.path.getsize(pdf_path)/1024:.0f} KB)")
        browser.close()

if __name__ == '__main__':
    build()
