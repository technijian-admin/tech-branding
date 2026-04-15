"""Verify no overflow on one-pager and brochure pages"""
from playwright.sync_api import sync_playwright
from PIL import Image
import io, os

PW, PH = 816, 1056
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
htmls = [
    'Services/My IT/assets/My IT One-Pager.html',
    'Services/My IT/assets/My IT Brochure.html',
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for rel in htmls:
        full_path = os.path.abspath(os.path.join(BASE, rel))
        page = browser.new_page(viewport={'width': PW, 'height': PH})
        page.goto(f"file:///{full_path.replace(os.sep, '/')}")
        page.wait_for_load_state('networkidle')
        shot = page.screenshot(full_page=True)
        img = Image.open(io.BytesIO(shot))
        h = img.size[1]
        expected = PH if 'One-Pager' in rel else 7 * PH
        print(f"{rel}: {h}px (expected {expected}px)")
        pages = max(1, h // PH + (1 if h % PH else 0))
        for i in range(pages):
            crop = img.crop((0, i*PH, PW, min((i+1)*PH, h)))
            out = full_path.replace('.html', f'_pg{i+1}.png')
            crop.save(out)
    browser.close()
