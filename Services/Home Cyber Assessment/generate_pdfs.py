"""
Render the Home Cybersecurity Remediation packet HTMLs to multi-page letter PDFs.

Cover page is fixed 8.5x11. Body content flows naturally with @page-driven
header/footer for binders. Output replaces the legacy unbranded PDFs.
"""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"

JOBS = [
    (ASSETS / "pre-visit-client-packet.html",  ROOT / "Technijian_Pre_Visit_Client_Packet.pdf"),
    (ASSETS / "onsite-visit-checklist.html",   ROOT / "Technijian_Onsite_Visit_Checklist.pdf"),
]


def build():
    print(f"Rendering {len(JOBS)} document(s)...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for html, pdf in JOBS:
            page = browser.new_page()
            page.goto(f"file:///{str(html).replace(os.sep, '/')}")
            page.wait_for_load_state("networkidle")
            page.pdf(
                path=str(pdf),
                format="Letter",
                print_background=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
                prefer_css_page_size=True,
                display_header_footer=False,
            )
            size_kb = pdf.stat().st_size / 1024
            print(f"  {pdf.name}  ({size_kb:.0f} KB)")
            page.close()
        browser.close()
    print("Done.")


if __name__ == "__main__":
    sys.exit(build() or 0)
