"""
Case Studies — HTML-to-PDF via Playwright

Walks each industry subfolder, renders every *.html under /assets to a PDF
sibling in the industry folder. Same pattern as Services/*/assets/generate_pdfs.py.

Run:
    python "Case Studies/generate_pdfs.py"
"""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent


def discover():
    jobs = []
    for industry_dir in sorted(p for p in ROOT.iterdir() if p.is_dir()):
        assets = industry_dir / "assets"
        if not assets.is_dir():
            continue
        for html in sorted(assets.glob("*.html")):
            pdf = industry_dir / (html.stem + ".pdf")
            jobs.append((html, pdf))
    return jobs


def build():
    jobs = discover()
    if not jobs:
        print("No case-study HTML files found.")
        return

    print(f"Rendering {len(jobs)} case study PDF(s)...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for html, pdf in jobs:
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
            rel = pdf.relative_to(ROOT)
            print(f"  {rel}  ({size_kb:.0f} KB)")
            page.close()
        browser.close()
    print("Done.")


if __name__ == "__main__":
    sys.exit(build() or 0)
