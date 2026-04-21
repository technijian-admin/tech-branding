"""
Chat.AI billing templates — render the populated SAMPLE HTMLs to PDF.

Only files ending in `-sample.html` are rendered. The tokenized templates
(`client-invoice.html`, `billing-report.html`) are NOT rendered because they
contain literal {{TOKEN}} placeholders — those are source files consumed by
the Chat.AI server's billing module at runtime.
"""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"


def discover():
    return sorted(ASSETS.glob("*-sample.html"))


def build():
    jobs = discover()
    if not jobs:
        print("No sample HTML files found.")
        return
    print(f"Rendering {len(jobs)} sample PDF(s)...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for html in jobs:
            pdf = ROOT / (html.stem.replace("-sample", "-sample") + ".pdf")
            page = browser.new_page()
            page.goto(f"file:///{str(html).replace(os.sep, '/')}")
            page.wait_for_load_state("networkidle")
            page.pdf(
                path=str(pdf),
                format="Letter",
                print_background=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            )
            size_kb = pdf.stat().st_size / 1024
            print(f"  {pdf.name}  ({size_kb:.0f} KB)")
            page.close()
        browser.close()
    print("Done.")


if __name__ == "__main__":
    sys.exit(build() or 0)
