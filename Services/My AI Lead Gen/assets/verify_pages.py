"""Capture per-page screenshots for verification (US Letter at 816x1056)."""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))

JOBS = [
    {'html': 'My AI Lead Gen One-Pager.html', 'pages': 1, 'prefix': '_verify_op'},
    {'html': 'My AI Lead Gen Brochure.html', 'pages': 10, 'prefix': '_verify_br'},
]

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for job in JOBS:
            html_path = os.path.join(ASSETS, job['html'])
            if not os.path.exists(html_path):
                print(f"SKIP {job['html']}")
                continue
            page = browser.new_page(viewport={'width': 816, 'height': 1056})
            page.goto(f"file:///{html_path.replace(os.sep, '/')}")
            page.wait_for_load_state('networkidle')
            full_ss = os.path.join(ASSETS, f"{job['prefix']}_full.png")
            page.screenshot(path=full_ss, full_page=True)
            print(f"  {os.path.basename(full_ss)}")
            from PIL import Image
            img = Image.open(full_ss)
            for i in range(job['pages']):
                y = i * 1056
                if y >= img.height:
                    break
                bottom = min(y + 1056, img.height)
                cropped = img.crop((0, y, min(816, img.width), bottom))
                ss_path = os.path.join(ASSETS, f"{job['prefix']}_pg{i+1}.png")
                cropped.save(ss_path)
                print(f"  {os.path.basename(ss_path)}")
        browser.close()

if __name__ == '__main__':
    capture()
