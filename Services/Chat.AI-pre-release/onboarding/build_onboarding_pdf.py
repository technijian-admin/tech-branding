"""Chat.AI Tenant Onboarding Guide — HTML to PDF + per-page verification PNGs (Playwright)."""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "Chat.AI Tenant Onboarding Guide.html")
PDF  = os.path.join(HERE, "Chat.AI Tenant Onboarding Guide.pdf")

def build():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 816, "height": 1056}, device_scale_factor=2)
        page.goto(f"file:///{HTML.replace(os.sep, '/')}")
        page.wait_for_load_state("networkidle")

        # PDF
        page.pdf(path=PDF, format="Letter", print_background=True,
                 margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
        print(f"  PDF  -> {os.path.basename(PDF)} ({os.path.getsize(PDF)/1024:.0f} KB)")

        # Per-page verification screenshots
        pages = page.query_selector_all(".page")
        print(f"  Pages found: {len(pages)}")
        for i, el in enumerate(pages, 1):
            shot = os.path.join(HERE, "assets", f"_verify_pg{i}.png")
            el.screenshot(path=shot)
            print(f"  PNG  -> _verify_pg{i}.png")
        browser.close()
    print("Done.")

if __name__ == "__main__":
    build()
