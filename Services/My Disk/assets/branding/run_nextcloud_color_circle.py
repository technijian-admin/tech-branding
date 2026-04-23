"""
Final fix:
1. Click the correct blue circle in the NC33 color picker (rgb(0,130,201) = #0082C9)
   -- closest available preset to Technijian #006DB6
2. Re-upload background image correctly (was getting logo uploaded to bg slot)
3. Take final verification screenshots
"""

import time
import os
from playwright.sync_api import sync_playwright

BASE_URL  = "https://mydisk2.technijian.com"
USERNAME  = "admin"
PASSWORD  = "T3chn!j2n92618!!"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_FILE  = os.path.join(SCRIPT_DIR, "mydisk-logo-white.png")
BG_FILE    = os.path.join(SCRIPT_DIR, "mydisk-login-bg.jpg")

def ss(page, name):
    path = os.path.join(SCRIPT_DIR, name)
    page.screenshot(path=path, full_page=False)
    print(f"  Screenshot: {path}")

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=150)
        ctx     = browser.new_context(ignore_https_errors=True,
                                      viewport={"width": 1440, "height": 900})
        page    = ctx.new_page()

        # Login
        print("[1] Login...")
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        page.fill("#user",     USERNAME)
        page.fill("#password", PASSWORD)
        page.click("button[type=submit]")
        page.wait_for_url(f"{BASE_URL}/**", timeout=30000)
        time.sleep(2)

        # Navigate to theming
        print("[2] Open theming page...")
        page.goto(f"{BASE_URL}/settings/admin/theming", wait_until="domcontentloaded")
        time.sleep(5)

        # ── Fix background image upload ──────────────────────────────────────
        # Background thumbnail was showing the logo image - re-upload correct files
        print("[3] Upload correct background image...")

        # First reset/remove existing background by uploading the correct file
        bg_input = page.query_selector("input[type=file][name='background']")
        if bg_input:
            bg_input.set_input_files(BG_FILE)
            time.sleep(4)
            print("  Background image uploaded")
        ss(page, "_bg_uploaded.png")

        # Also ensure logo is uploaded correctly
        print("[4] Upload logo...")
        logo_input = page.query_selector("input[type=file][name='logo']")
        if logo_input:
            logo_input.set_input_files(LOGO_FILE)
            time.sleep(4)
            print("  Logo uploaded")
        ss(page, "_logo_uploaded.png")

        # ── Color picker - click the blue circle ─────────────────────────────
        print("[5] Set primary color...")
        page.evaluate("() => window.scrollTo(0, 0)")
        time.sleep(0.5)

        # Click Primary color button
        page.click("button:has-text('Primary color')", timeout=8000)
        time.sleep(2)
        ss(page, "_picker_circles.png")

        # The circles are color-picker__simple-color-circle elements
        # Get their background colors to find the blue one
        circles = page.query_selector_all(".color-picker__simple-color-circle")
        print(f"  Found {len(circles)} color circles")

        best_circle = None
        best_diff   = float('inf')
        target_r, target_g, target_b = 0x00, 0x6D, 0xB6  # #006DB6

        for i, circle in enumerate(circles):
            style = circle.evaluate("el => window.getComputedStyle(el).backgroundColor")
            print(f"  Circle [{i}]: {style}")
            # Parse rgb(r, g, b)
            import re
            m = re.match(r'rgb\((\d+),\s*(\d+),\s*(\d+)\)', style)
            if m:
                r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
                diff = abs(r - target_r) + abs(g - target_g) + abs(b - target_b)
                if diff < best_diff:
                    best_diff  = diff
                    best_circle = circle
                    print(f"    -> new best (diff={diff})")

        if best_circle:
            best_circle.click()
            time.sleep(2)
            print(f"  Clicked closest color circle (diff={best_diff})")
        else:
            # Fallback: click the 9th circle (index 8 = blue-ish based on screenshot)
            if len(circles) >= 9:
                circles[8].click()
                time.sleep(2)
                print("  Clicked circle[8] as fallback")

        ss(page, "_after_color_click.png")
        page.keyboard.press("Escape")
        time.sleep(1)

        # ── Final screenshots ─────────────────────────────────────────────────
        print("[6] Final verification...")

        # Reload theming page and check thumbnails
        page.reload(wait_until="domcontentloaded")
        time.sleep(5)
        ss(page, "_theming_complete.png")
        page.evaluate("() => window.scrollBy(0, 600)")
        time.sleep(1)
        ss(page, "_theming_complete_scrolled.png")

        # Login page in fresh context
        ctx2  = browser.new_context(ignore_https_errors=True,
                                    viewport={"width": 1440, "height": 900})
        page2 = ctx2.new_page()
        page2.goto(f"{BASE_URL}/login", wait_until="networkidle")
        time.sleep(3)
        ss(page2, "_login_complete.png")
        ctx2.close()

        ctx.close()
        browser.close()
        print("\nDone.")

if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()
    run()
