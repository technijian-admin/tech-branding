"""Render the USA + India letterhead HTML templates to PDF and verify
screenshots. Mirrors the Services/X/assets/generate_pdfs.py pattern.

Run from repo root:   python assets/print/templates/generate-letterhead-pdfs.py
"""
import os, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
TARGETS = [
    {
        "name": "USA Headquarters",
        "html": os.path.join(HERE, "technijian-letterhead-usa.html"),
        "pdf":  os.path.join(HERE, "technijian-letterhead-usa.pdf"),
        "png":  os.path.join(HERE, "_verify-letterhead-usa.png"),
    },
    {
        "name": "India Delivery Center",
        "html": os.path.join(HERE, "technijian-letterhead-india.html"),
        "pdf":  os.path.join(HERE, "technijian-letterhead-india.pdf"),
        "png":  os.path.join(HERE, "_verify-letterhead-india.png"),
    },
]

def build():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for t in TARGETS:
            if not os.path.exists(t["html"]):
                print(f"  SKIP {t['name']} (missing {t['html']})")
                continue
            page = browser.new_page(viewport={"width": 816, "height": 1056})
            page.goto("file:///" + t["html"].replace(os.sep, "/"))
            page.wait_for_load_state("networkidle")
            page.pdf(
                path=t["pdf"], format="Letter", print_background=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            )
            page.screenshot(path=t["png"], full_page=True)
            # Verify body clipping (per project memory feedback_verify_body_clipping.md)
            clip = page.evaluate("""
                () => {
                    const body = document.querySelector('.body');
                    if (!body) return null;
                    return { client: body.clientHeight, scroll: body.scrollHeight };
                }
            """)
            size_kb = os.path.getsize(t["pdf"]) / 1024
            shot = os.path.getsize(t["png"]) / 1024
            clip_msg = ""
            if clip and clip["scroll"] - clip["client"] > 2:
                clip_msg = f"  !! BODY CLIP: {clip['scroll'] - clip['client']}px"
            print(f"  {t['name']:<26} -> {os.path.basename(t['pdf'])} ({size_kb:.0f} KB)  screenshot {shot:.0f} KB{clip_msg}")
            page.close()
        browser.close()

if __name__ == "__main__":
    build()
