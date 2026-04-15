"""My Continuity — HTML-to-PDF via Playwright + verification screenshots."""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {'html': 'My Continuity One-Pager.html', 'pdf': 'My Continuity One-Pager.pdf', 'screenshot': '_verify_onepager.png', 'is_brochure': False},
    {'html': 'My Continuity Brochure.html',  'pdf': 'My Continuity Brochure.pdf',  'screenshot': '_verify_brochure.png', 'is_brochure': True},
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
            page.goto(f"file:///{html_path.replace(os.sep, '/')}")
            page.wait_for_load_state('networkidle')
            page.pdf(path=pdf_path, format='Letter', print_background=True,
                     margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'})
            page.screenshot(path=ss_path, full_page=True)
            size_kb = os.path.getsize(pdf_path) / 1024
            print(f"  {f['pdf']} ({size_kb:.0f} KB) -> {f['screenshot']}")

            if f['is_brochure']:
                # Split the already-rendered full_page screenshot into 7 per-page images
                try:
                    from PIL import Image
                    img = Image.open(ss_path)
                    w, h = img.size
                    print(f"    full-page size: {w} x {h}")
                    for i in range(1, 8):
                        top = (i-1)*1056
                        bot = min(top + 1056, h)
                        if top >= h:
                            break
                        crop = img.crop((0, top, w, bot))
                        pg_ss = os.path.join(ASSETS, f"_verify_pg{i}.png")
                        crop.save(pg_ss)
                        print(f"    page {i} -> _verify_pg{i}.png ({crop.size[0]}x{crop.size[1]})")
                except Exception as e:
                    print(f"    page-split error: {e}")
        browser.close()
    print("Done!")

if __name__ == '__main__':
    build()
