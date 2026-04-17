"""
Verify that each case study HTML fits 2 letter pages with no overflow.
For each HTML:
  - Render at 816x1056 px (8.5x11in at 96 DPI)
  - Check full-body height is within tolerance of 2112 px (2 pages)
  - Save per-page PNG screenshots for visual review
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
EXPECTED_PAGE_PX = 1056  # 11in * 96dpi
EXPECTED_TOTAL_PX = EXPECTED_PAGE_PX * 2
TOLERANCE_PX = 4


def discover():
    out = []
    for industry in sorted(p for p in ROOT.iterdir() if p.is_dir()):
        assets = industry / "assets"
        if not assets.is_dir():
            continue
        for html in sorted(assets.glob("*.html")):
            out.append((industry, html))
    return out


def verify():
    jobs = discover()
    print(f"Verifying {len(jobs)} case studies...")
    problems = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for industry, html in jobs:
            page = browser.new_page(viewport={"width": 816, "height": EXPECTED_TOTAL_PX + 200})
            page.goto(f"file:///{str(html).replace(os.sep, '/')}")
            page.wait_for_load_state("networkidle")
            body_h = page.evaluate(
                "() => document.body.getBoundingClientRect().height"
            )
            status = "OK"
            if abs(body_h - EXPECTED_TOTAL_PX) > TOLERANCE_PX:
                status = f"BAD body={body_h:.0f}px"
                problems += 1

            # Detect in-body content clipping (CTA overlapping content above it).
            # For each page, find the .body's bottom and compare against the
            # actual content height inside .body. If content > body height, overflow:hidden
            # is clipping visible content.
            overflows = page.evaluate(
                """() => {
                    const pages = document.querySelectorAll('.page');
                    const report = [];
                    pages.forEach((pg, i) => {
                        const body = pg.querySelector('.body');
                        if (!body) return;
                        const bodyH = body.clientHeight;
                        const scrollH = body.scrollHeight;
                        if (scrollH - bodyH > 2) {
                            report.push({page: i+1, clientH: bodyH, scrollH: scrollH, clipped: scrollH - bodyH});
                        }
                    });
                    return report;
                }"""
            )
            if overflows:
                for o in overflows:
                    status += f" | CLIP pg{o['page']}: {o['clipped']:.0f}px over"
                if "CLIP" in status and "OK" in status:
                    status = status.replace("OK | ", "")
                problems += len(overflows)

            stem = html.stem
            png1 = industry / "assets" / f"_verify_{stem}_pg1.png"
            page.screenshot(path=str(png1), clip={"x": 0, "y": 0, "width": 816, "height": 1056})
            png2 = industry / "assets" / f"_verify_{stem}_pg2.png"
            page.screenshot(path=str(png2), clip={"x": 0, "y": 1056, "width": 816, "height": 1056})

            print(f"  [{status}]  {industry.name} / {stem}  body={body_h:.0f}px")
            page.close()
        browser.close()
    if problems:
        print(f"\n{problems} case study(ies) have overflow issues.")
    else:
        print("\nAll case studies fit 2 pages cleanly.")
    return problems


if __name__ == "__main__":
    raise SystemExit(1 if verify() else 0)
