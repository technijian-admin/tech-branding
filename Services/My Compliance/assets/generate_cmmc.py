"""Generate CMMC brochure + one-pager PDFs, plus verification screenshots."""
import os, io
from playwright.sync_api import sync_playwright
from PIL import Image

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")
PAGE_W = 816
PAGE_H = 1056

FILES = [
    {'html': 'My Compliance - CMMC Brochure.html',  'pdf': 'My Compliance - CMMC Brochure.pdf',  'ss': '_verify_cmmc_brochure.png', 'split': True},
    {'html': 'My Compliance - CMMC One-Pager.html', 'pdf': 'My Compliance - CMMC One-Pager.pdf', 'ss': '_verify_cmmc_onepager.png', 'split': False},
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for f in FILES:
        html_path = os.path.join(ASSETS, f['html'])
        pdf_path  = os.path.join(OUT_DIR, f['pdf'])
        ss_path   = os.path.join(ASSETS, f['ss'])
        page = browser.new_page(viewport={"width": PAGE_W, "height": PAGE_H})
        page.goto(f"file:///{html_path.replace(os.sep, '/')}")
        page.wait_for_load_state("networkidle")
        page.pdf(path=pdf_path, format='Letter', print_background=True,
                 margin={'top':'0','right':'0','bottom':'0','left':'0'})
        shot = page.screenshot(full_page=True)
        with open(ss_path, "wb") as out: out.write(shot)
        kb = os.path.getsize(pdf_path)/1024
        img = Image.open(io.BytesIO(shot))
        print(f"  {f['pdf']} ({kb:.0f} KB), screenshot size: {img.size}")
        if f['split']:
            w, h = img.size
            pages = (h + PAGE_H - 1) // PAGE_H
            for i in range(min(pages, 10)):
                crop = img.crop((0, i*PAGE_H, w, min((i+1)*PAGE_H, h)))
                out_path = os.path.join(ASSETS, f"_verify_cmmc_pg{i+1}.png")
                crop.save(out_path)
                print(f"    pg{i+1}: {crop.size}")
    browser.close()
print("Done")
