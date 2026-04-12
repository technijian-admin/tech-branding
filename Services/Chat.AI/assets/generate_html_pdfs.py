"""Chat.AI — HTML-to-PDF via Playwright (regenerates all variants from HTML sources)"""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    # Generic
    {'html': 'Chat.AI One-Pager.html', 'pdf': 'Chat.AI One-Pager.pdf'},
    {'html': 'Chat.AI Brochure.html', 'pdf': 'Chat.AI Brochure.pdf'},
    {'html': 'Chat.AI Marketing Datasheet.html', 'pdf': 'Chat.AI Marketing Datasheet.pdf'},
    # Healthcare variant
    {'html': 'Chat.AI - Healthcare One-Pager.html', 'pdf': 'Chat.AI - Healthcare One-Pager.pdf'},
    # Financial Services variant
    {'html': 'Chat.AI - Financial Services One-Pager.html', 'pdf': 'Chat.AI - Financial Services One-Pager.pdf'},
]

def build():
    print("Rendering Chat.AI HTML to PDF via Playwright...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for f in FILES:
            html_path = os.path.join(ASSETS, f['html'])
            pdf_path = os.path.join(OUT_DIR, f['pdf'])
            if not os.path.exists(html_path):
                print(f"  SKIP: {f['html']} not found")
                continue
            page = browser.new_page()
            page.goto(f"file:///{html_path.replace(os.sep, '/')}")
            page.wait_for_load_state('networkidle')
            page.pdf(path=pdf_path, format='Letter', print_background=True,
                     margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'})
            size_kb = os.path.getsize(pdf_path) / 1024
            print(f"  {f['pdf']} ({size_kb:.0f} KB)")
        browser.close()
    print("Done!")

if __name__ == '__main__':
    build()
