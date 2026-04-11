"""Chat.AI — HTML-to-PDF via Playwright (regenerates from HTML sources)"""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {
        'html': os.path.join(ASSETS, 'Chat.AI One-Pager.html'),
        'pdf': os.path.join(OUT_DIR, 'Chat.AI One-Pager.pdf'),
    },
    {
        'html': os.path.join(ASSETS, 'Chat.AI Brochure.html'),
        'pdf': os.path.join(OUT_DIR, 'Chat.AI Brochure.pdf'),
    },
    {
        'html': os.path.join(ASSETS, 'Chat.AI Marketing Datasheet.html'),
        'pdf': os.path.join(OUT_DIR, 'Chat.AI Marketing Datasheet.pdf'),
    },
]

def build():
    print("Rendering Chat.AI HTML to PDF via Playwright...")
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
            size_kb = os.path.getsize(f['pdf']) / 1024
            print(f"  {os.path.basename(f['pdf'])} ({size_kb:.0f} KB)")
        browser.close()
    print("Done!")

if __name__ == '__main__':
    build()
