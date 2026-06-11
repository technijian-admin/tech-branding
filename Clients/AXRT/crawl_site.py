# -*- coding: utf-8 -*-
"""Deep crawl of axisrt.com — extract social links, nav structure, page text for
internal-workflow research. Output: crawl/ folder with text dumps + linkedin URL."""
import json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "crawl"
OUT.mkdir(exist_ok=True)

PAGES = {
    "home":      "https://axisrt.com/",
    "news":      "https://axisrt.com/news/",
    "about":     "https://axisrt.com/about/",
    "services":  "https://axisrt.com/services/",
    "facilities":"https://axisrt.com/facilities/",
    "faq":       "https://axisrt.com/faq/",
    "contact":   "https://axisrt.com/contact/",
    "omnimed":   "https://axisrt.com/omnimed/",
}

results = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1280, "height": 900},
                        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")
    pg = ctx.new_page()

    for name, url in PAGES.items():
        try:
            resp = pg.goto(url, timeout=25000, wait_until="domcontentloaded")
            pg.wait_for_timeout(2500)
            title = pg.title()
            status = resp.status if resp else "?"
            # all links
            links = pg.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
            # visible text
            text = pg.inner_text("body")[:15000]
            (OUT / f"{name}.txt").write_text(
                f"URL: {url}\nSTATUS: {status}\nTITLE: {title}\n\n{text}", encoding="utf-8")
            results[name] = {"status": status, "title": title, "n_links": len(links)}
            # collect socials + nav from home
            if name == "home":
                socials = sorted({l for l in links if re.search(
                    r"linkedin\.com|facebook\.com|instagram\.com|youtube\.com|twitter\.com|x\.com|vimeo\.com", l)})
                internal = sorted({l for l in links if "axisrt.com" in l})
                (OUT / "_links.json").write_text(json.dumps(
                    {"socials": socials, "internal": internal}, indent=2), encoding="utf-8")
                print("SOCIALS:", *socials, sep="\n  ")
            print(f"{name:11s} {status} {title[:60]}")
        except Exception as e:
            print(f"{name:11s} FAIL {str(e)[:80]}")
            results[name] = {"status": "FAIL"}

    b.close()
print("\nDone. Text dumps in:", OUT)
