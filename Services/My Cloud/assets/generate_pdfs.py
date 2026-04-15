"""My Cloud -- HTML-to-PDF via Playwright with verification screenshots."""
import os
import sys
from playwright.sync_api import sync_playwright
from PIL import Image

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {'html': 'My Cloud One-Pager.html', 'pdf': 'My Cloud One-Pager.pdf', 'screenshot': '_verify_onepager.png', 'type': 'onepager'},
    {'html': 'My Cloud Brochure.html',  'pdf': 'My Cloud Brochure.pdf',  'screenshot': '_verify_brochure.png',  'type': 'brochure'},
]

def build():
    print("Rendering HTML to PDF via Playwright...")
    results = []
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
            img = Image.open(ss_path)
            w, h = img.size
            pages = round(h / 1056, 2)
            print(f"  {f['pdf']} ({size_kb:.0f} KB) | screenshot {w}x{h}px ~ {pages} pages")
            results.append((f, w, h, pages))

            # Per-page screenshots for brochures
            if f['type'] == 'brochure':
                for i in range(7):
                    page_ss = os.path.join(ASSETS, f"_verify_brochure_pg{i+1}.png")
                    box = (0, i * 1056, w, min((i + 1) * 1056, h))
                    if box[1] >= h:
                        break
                    img.crop(box).save(page_ss)
            page.close()
        browser.close()

    print("\n=== Verification ===")
    all_ok = True
    for f, w, h, pages in results:
        if f['type'] == 'onepager':
            if h > 1060:
                print(f"  FAIL one-pager overflow: {h}px (>1056)")
                all_ok = False
            else:
                print(f"  OK   one-pager: {h}px (<=1056)")
        elif f['type'] == 'brochure':
            if abs(pages - 7) > 0.05:
                print(f"  WARN brochure pages: {pages} (expected 7)")
                all_ok = False
            else:
                print(f"  OK   brochure: {pages} pages")
    print("Done!" if all_ok else "Issues to address.")
    return all_ok

if __name__ == '__main__':
    ok = build()
    sys.exit(0 if ok else 1)
