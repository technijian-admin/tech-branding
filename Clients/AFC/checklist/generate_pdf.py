"""Render the IT Provider Accountability Checklist HTML to a 1-page Letter PDF + verify PNG."""
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
HTML = HERE / "IT Provider Accountability Checklist.html"
PDF = HERE.parent / "IT Provider Accountability Checklist.pdf"
PNG = HERE / "_verify-checklist.png"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 816, "height": 1056})
    page.goto(HTML.as_uri())
    page.wait_for_timeout(700)

    # clipping check: page body must not overflow the fixed 11in page
    metrics = page.evaluate("""() => {
        const pg = document.querySelector('.page');
        return { scrollH: pg.scrollHeight, clientH: pg.clientHeight };
    }""")
    print(f"page scrollHeight={metrics['scrollH']} clientHeight={metrics['clientH']} overflow={metrics['scrollH']-metrics['clientH']}")

    page.screenshot(path=str(PNG), full_page=True)
    page.pdf(path=str(PDF), width="8.5in", height="11in", print_background=True,
             margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
    browser.close()

print(f"PDF: {PDF} ({PDF.stat().st_size/1024:.0f} KB)")
