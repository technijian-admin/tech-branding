"""Generate RMG Post-Visit Report PDF via Playwright."""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))

def build():
    print("Rendering RMG Post-Visit Report HTML to PDF...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        html_path = os.path.join(HERE, 'Technijian_RMG_PostVisit_Report.html')
        pdf_path  = os.path.join(HERE, 'Technijian_RMG_PostVisit_Report.pdf')

        page = browser.new_page(viewport={'width': 816, 'height': 1056})
        page.goto(f"file:///{html_path.replace(os.sep, '/')}", wait_until='domcontentloaded')
        page.wait_for_timeout(2000)
        try:
            page.wait_for_load_state('networkidle', timeout=10000)
        except Exception:
            pass

        page.pdf(
            path=pdf_path,
            width='8.5in', height='11in',
            print_background=True,
            margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
        )

        size_kb = os.path.getsize(pdf_path) / 1024
        print(f"  PDF: Technijian_RMG_PostVisit_Report.pdf ({size_kb:.0f} KB)")

        # Full-page screenshot for visual verification
        ss_full = os.path.join(HERE, '_verify_full.png')
        page.screenshot(path=ss_full, full_page=True)
        print(f"  Full screenshot: _verify_full.png")

        # Per-page screenshots (11in = 1056px at 96dpi, 32px body pad, 24px gap)
        page_h = 1056
        gap    = 24
        pad    = 32
        for i in range(10):  # up to 10 pages
            pg_path = os.path.join(HERE, f'_pg{i+1}.png')
            y = pad + i * (page_h + gap)
            page.screenshot(path=pg_path, full_page=True,
                            clip={'x': 0, 'y': y, 'width': 816, 'height': page_h})
        print("  Per-page screenshots: _pg1.png through _pg10.png")

        browser.close()
    print("Done!")

if __name__ == '__main__':
    build()
