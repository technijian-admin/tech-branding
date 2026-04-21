"""
Verify each sample renders exactly 1 letter page with no in-body clipping.

Two checks per HTML:
  1. total body height = 1056 px (1 letter page at 96 DPI)
  2. each .page's body content fits — i.e. body.scrollHeight == body.clientHeight
     (per feedback_verify_body_clipping: overflow:hidden silently clips content
     when scrollHeight > clientHeight, which looks like the CTA bleeding over
     tiles / metric cards)

Exit code: 0 if all pass, 1 if any clipping or wrong height.
"""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
EXPECTED_PAGE_PX = 1056  # 11in * 96dpi
TOLERANCE_PX = 4


def discover():
    return sorted(ASSETS.glob("*-sample.html"))


def verify():
    jobs = discover()
    print(f"Verifying {len(jobs)} sample HTML(s)...")
    problems = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for html in jobs:
            page = browser.new_page(viewport={"width": 816, "height": EXPECTED_PAGE_PX + 200})
            page.goto(f"file:///{str(html).replace(os.sep, '/')}")
            page.wait_for_load_state("networkidle")
            body_h = page.evaluate("() => document.body.getBoundingClientRect().height")
            status = "OK"
            if abs(body_h - EXPECTED_PAGE_PX) > TOLERANCE_PX:
                status = f"BAD body={body_h:.0f}px (expected ~{EXPECTED_PAGE_PX})"
                problems += 1
            overflows = page.evaluate(
                """() => {
                    const out = [];
                    document.querySelectorAll('.page').forEach((pg, i) => {
                        const b = pg.querySelector('.body');
                        if (!b) return;
                        if (b.scrollHeight - b.clientHeight > 2) {
                            out.push({page: i+1, clipped: b.scrollHeight - b.clientHeight});
                        }
                    });
                    return out;
                }"""
            )
            if overflows:
                for o in overflows:
                    status += f" | CLIP pg{o['page']}: {o['clipped']:.0f}px"
                problems += len(overflows)
            png = ASSETS / f"_verify_{html.stem}.png"
            page.screenshot(
                path=str(png),
                clip={"x": 0, "y": 0, "width": 816, "height": EXPECTED_PAGE_PX},
            )
            print(f"  [{status}]  {html.name}  body={body_h:.0f}px")
            page.close()
        browser.close()
    if problems:
        print(f"\n{problems} issue(s) detected.")
    else:
        print("\nAll samples render cleanly.")
    return problems


if __name__ == "__main__":
    raise SystemExit(1 if verify() else 0)
