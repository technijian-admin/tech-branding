"""My Disk — HTML-to-PDF via Playwright + verification screenshots."""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {
        'html': 'My Disk One-Pager.html',
        'pdf': 'My Disk One-Pager.pdf',
        'screenshot': '_verify_onepager.png',
        'pages': 1,
    },
    {
        'html': 'My Disk Brochure.html',
        'pdf': 'My Disk Brochure.pdf',
        'screenshot': '_verify_brochure.png',
        'pages': 9,
    },
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
            page = browser.new_page(viewport={'width': 816, 'height': 1056})
            page.goto(f"file:///{html_path.replace(os.sep, '/')}", wait_until='domcontentloaded')
            page.wait_for_timeout(2000)
            try:
                page.wait_for_load_state('networkidle', timeout=10000)
            except Exception:
                pass
            page.pdf(
                path=pdf_path,
                format='Letter',
                print_background=True,
                margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
            )
            page.screenshot(path=ss_path, full_page=True)
            size_kb = os.path.getsize(pdf_path) / 1024
            print(f"  {f['pdf']} ({size_kb:.0f} KB) — {f['pages']} page(s)")

            # Per-page screenshots for brochure
            if f['pages'] > 1:
                full_ss_path = os.path.join(ASSETS, f'_verify_br_full.png')
                page.screenshot(path=full_ss_path, full_page=True)
                print(f"  Full screenshot: {os.path.basename(full_ss_path)}")
        browser.close()
    print("Done!")


if __name__ == '__main__':
    build()
