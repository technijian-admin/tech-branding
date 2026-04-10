"""
Nexus Assess Pulse — HTML-to-PDF via Playwright
Renders both the One-Pager and Brochure HTML to pixel-perfect PDFs.
"""
import os
from playwright.sync_api import sync_playwright

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

FILES = [
    {
        'html': os.path.join(OUT_DIR, 'Nexus Assess Pulse One-Pager.html'),
        'pdf': os.path.join(OUT_DIR, 'Nexus Assess Pulse One-Pager.pdf'),
    },
    {
        'html': os.path.join(OUT_DIR, 'Nexus Assess Pulse Brochure.html'),
        'pdf': os.path.join(OUT_DIR, 'Nexus Assess Pulse Brochure.pdf'),
    },
]


def build():
    print("Rendering HTML to PDF via Playwright...")

    with sync_playwright() as p:
        browser = p.chromium.launch()

        for f in FILES:
            if not os.path.exists(f['html']):
                print(f"  SKIP: {f['html']} not found")
                continue

            page = browser.new_page()
            page.goto(f"file:///{f['html'].replace(os.sep, '/')}")
            page.wait_for_load_state('networkidle')

            page.pdf(
                path=f['pdf'],
                format='Letter',
                print_background=True,
                margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
            )

            size_kb = os.path.getsize(f['pdf']) / 1024
            name = os.path.basename(f['pdf'])
            print(f"  {name} ({size_kb:.0f} KB)")

        browser.close()

    print("Done!")


if __name__ == '__main__':
    build()
