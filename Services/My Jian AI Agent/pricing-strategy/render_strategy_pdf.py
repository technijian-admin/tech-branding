"""Render the SaaS Pricing Strategy report HTML -> PDF (flowing Letter format)."""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "SAAS_PRICING_STRATEGY.html")
PDF = os.path.join(HERE, "SAAS_PRICING_STRATEGY.pdf")
SS = os.path.join(HERE, "_verify_strategy.png")


def build():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 816, "height": 1056})
        page.goto(f"file:///{HTML.replace(os.sep, '/')}", wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        try:
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        page.pdf(
            path=PDF,
            format="Letter",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            prefer_css_page_size=True,
        )
        page.screenshot(path=SS, full_page=True)
        browser.close()
    kb = os.path.getsize(PDF) / 1024
    print(f"OK: {PDF} ({kb:.0f} KB)")


if __name__ == "__main__":
    build()
