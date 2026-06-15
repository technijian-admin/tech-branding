"""My Jian AI Agent Suite — HTML-to-PDF via Playwright + verification screenshots."""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {
        'html': 'My Jian AI Agent Brochure.html',
        'pdf': 'My Jian AI Agent Brochure.pdf',
        'screenshot': '_verify_brochure.png',
        'page_prefix': '_br_pg',
        'pages': 8,
        'width': '8.5in', 'height': '11in',
        'viewport': (816, 1056),
    },
    {
        'html': 'My Jian AI Agent One-Pager.html',
        'pdf': 'My Jian AI Agent One-Pager.pdf',
        'screenshot': '_verify_onepager.png',
        'page_prefix': '_op_pg',
        'pages': 1,
        'width': '8.5in', 'height': '11in',
        'viewport': (816, 1056),
    },
    {
        'html': 'My Jian AI Agent Price Sheet.html',
        'pdf': 'My Jian AI Agent Price Sheet.pdf',
        'screenshot': '_verify_pricesheet.png',
        'page_prefix': '_ps_pg',
        'pages': 4,
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

            prefix = f.get('page_prefix', '_pg_')
            page_h = 1056
            gap = 24
            body_pad = 32
            for i in range(f['pages']):
                pg_path = os.path.join(ASSETS, f'{prefix}{i+1}.png')
                y_start = body_pad + i * (page_h + gap)
                page.screenshot(
                    path=pg_path,
                    full_page=True,
                    clip={'x': 0, 'y': y_start, 'width': 816, 'height': page_h},
                )
            print(f"  Per-page screenshots: {prefix}1.png through {prefix}{f['pages']}.png")

        browser.close()
    print("Done!")


if __name__ == '__main__':
    build()
