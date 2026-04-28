"""My AntiSpam - HTML-to-PDF via Playwright + verification screenshots."""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {
        'html': 'My AntiSpam One-Pager.html',
        'pdf': 'My AntiSpam One-Pager.pdf',
        'screenshot': '_verify_onepager.png',
        'pages': 1,
        'width': '8.5in', 'height': '11in',
        'viewport': (816, 1056),
    },
    {
        'html': 'My AntiSpam Brochure.html',
        'pdf': 'My AntiSpam Brochure.pdf',
        'screenshot': '_verify_brochure.png',
        'pages': 9,
        'width': '8.5in', 'height': '11in',
        'viewport': (816, 1056),
    },
    {
        'html': 'My AntiSpam Infographic.html',
        'pdf': 'My AntiSpam Infographic.pdf',
        'screenshot': '_verify_infographic.png',
        'pages': 1,
        'width': '8.5in', 'height': '11in',
        'viewport': (816, 1056),
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
            vw, vh = f['viewport']
            page = browser.new_page(viewport={'width': vw, 'height': vh})
            page.goto(f"file:///{html_path.replace(os.sep, '/')}", wait_until='domcontentloaded')
            page.wait_for_timeout(2000)
            try:
                page.wait_for_load_state('networkidle', timeout=10000)
            except Exception:
                pass
            page.pdf(
                path=pdf_path,
                width=f['width'], height=f['height'],
                print_background=True,
                margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
            )
            page.screenshot(path=ss_path, full_page=True)
            size_kb = os.path.getsize(pdf_path) / 1024
            print(f"  {f['pdf']} ({size_kb:.0f} KB) - {f['pages']} page(s)")

            if f['pages'] > 1:
                full_ss_path = os.path.join(ASSETS, '_verify_br_full.png')
                page.screenshot(path=full_ss_path, full_page=True)
                print(f"  Full screenshot: {os.path.basename(full_ss_path)}")
        browser.close()
    print("Done!")


if __name__ == '__main__':
    build()
