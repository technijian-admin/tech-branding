"""
Chat.AI Marketing Datasheet — HTML-to-PDF via Playwright.
Renders the branded HTML file to a pixel-perfect PDF using headless Chromium.
No more manual coordinate math. CSS handles everything.
"""

import os
from playwright.sync_api import sync_playwright

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_PATH = os.path.join(OUT_DIR, 'Chat.AI Marketing Datasheet.html')
PDF_PATH = os.path.join(OUT_DIR, 'Chat.AI Marketing Datasheet.pdf')


def build():
    print("Rendering HTML to PDF via Playwright...")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Load the HTML file
        page.goto(f'file:///{HTML_PATH.replace(os.sep, "/")}')

        # Wait for fonts and images to load
        page.wait_for_load_state('networkidle')

        # Generate PDF with print settings
        page.pdf(
            path=PDF_PATH,
            format='Letter',
            print_background=True,       # Preserve all background colors/gradients
            margin={
                'top': '0',
                'right': '0',
                'bottom': '0',
                'left': '0',
            },
        )

        browser.close()

    size_kb = os.path.getsize(PDF_PATH) / 1024
    print(f"PDF generated: {PDF_PATH} ({size_kb:.0f} KB)")


if __name__ == '__main__':
    build()
