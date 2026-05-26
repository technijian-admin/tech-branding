"""Render the Monaco program addendum one-pager to PDF + a verification screenshot.

Usage:  /c/Python314/python.exe Clients/MWAR/generate-addendum-pdf.py
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "Monaco-Program-Addendum.html")
PDF = os.path.join(HERE, "Monaco-Program-Addendum.pdf")
SHOT = os.path.join(HERE, "_verify_addendum.png")


def build():
    print("Rendering Monaco addendum to PDF...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 816, "height": 1056})
        page.goto(f"file:///{HTML.replace(os.sep, '/')}", wait_until="domcontentloaded")
        page.wait_for_timeout(1800)
        try:
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        page.pdf(
            path=PDF,
            width="8.5in", height="11in",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        )
        page.screenshot(path=SHOT, full_page=True)
        browser.close()
    kb = os.path.getsize(PDF) / 1024
    print(f"  {os.path.basename(PDF)} ({kb:.0f} KB)")
    print(f"  {os.path.basename(SHOT)} (verify screenshot)")
    print("Done!")


if __name__ == "__main__":
    build()
