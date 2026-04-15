"""My Compliance — HTML-to-PDF via Playwright"""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {'html': 'My Compliance - SOC 2 One-Pager.html', 'pdf': 'My Compliance - SOC 2 One-Pager.pdf', 'screenshot': '_verify_soc2_onepager.png'},
    {'html': 'My Compliance - SOC 2 Brochure.html', 'pdf': 'My Compliance - SOC 2 Brochure.pdf', 'screenshot': '_verify_soc2_brochure.png'},
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
            print(f"  {f['pdf']} ({size_kb:.0f} KB)")

            # Also capture each brochure page at 1056px
            if 'Brochure' in f['html']:
                from PIL import Image
                img = Image.open(ss_path)
                W, H = img.size
                pages = max(1, round(H / 1056))
                for i in range(pages):
                    top = i * 1056
                    bot = min(top + 1056, H)
                    crop = img.crop((0, top, W, bot))
                    crop.save(os.path.join(ASSETS, f"_verify_brochure_pg{i+1}.png"))
                print(f"    Split into {pages} page screenshots ({W}x{H})")
            else:
                from PIL import Image
                img = Image.open(ss_path)
                print(f"    One-pager size: {img.size[0]}x{img.size[1]} (target 816x1056)")
        browser.close()
    print("Done!")

if __name__ == '__main__':
    build()
