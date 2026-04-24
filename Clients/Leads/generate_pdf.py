"""
Render the outbound-script-guide HTML to a multi-page letter PDF.

The cover page uses fixed 8.5x11 overflow:hidden. The body flows naturally
across pages via @page CSS — this is a reference document meant to be
printed and carried in a binder, not a fixed single-page brochure.
"""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SRC = HERE / "assets" / "outbound-script-guide.html"
OUT = HERE / "outbound-script-guide.pdf"


def build():
    print(f"Rendering {SRC.name} -> {OUT.name}")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f"file:///{str(SRC).replace(os.sep, '/')}")
        page.wait_for_load_state("networkidle")
        page.pdf(
            path=str(OUT),
            format="Letter",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            prefer_css_page_size=True,
            display_header_footer=False,
        )
        size_kb = OUT.stat().st_size / 1024
        print(f"  Wrote {OUT.name} ({size_kb:.0f} KB)")
        browser.close()


if __name__ == "__main__":
    sys.exit(build() or 0)
