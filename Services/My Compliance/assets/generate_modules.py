"""Render the four My Compliance module one-pagers to PDF + verification screenshots."""
from playwright.sync_api import sync_playwright
from PIL import Image
import io, os

ASSETS = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance\assets'
OUT = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance'
MODULES = ['Vault', 'Atlas', 'Discover', 'Govern']

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for mod in MODULES:
            html = f'My Compliance - {mod} One-Pager.html'
            pdf = f'My Compliance - {mod} One-Pager.pdf'
            shot = f'_verify_{mod.lower()}_onepager.png'
            page = browser.new_page(viewport={'width': 816, 'height': 1056})
            url = 'file:///' + os.path.join(ASSETS, html).replace(os.sep, '/')
            page.goto(url)
            page.wait_for_load_state('networkidle')
            page.pdf(
                path=os.path.join(OUT, pdf),
                format='Letter',
                print_background=True,
                margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
            )
            full_bytes = page.screenshot(full_page=True)
            img = Image.open(io.BytesIO(full_bytes))
            img.save(os.path.join(ASSETS, shot))
            h = img.size[1]
            status = 'OK' if h <= 1080 else f'OVERFLOW (+{h - 1056}px)'
            print(f'  {pdf}: {h}px - {status}')
            page.close()
        browser.close()

if __name__ == '__main__':
    main()
