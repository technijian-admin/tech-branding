"""
Fix: Set primary color #006DB6 using the "Choose" button in NC33 color picker,
and re-upload logo/background to the correct file inputs.
"""

import time
import os
import json
import base64
import requests
from playwright.sync_api import sync_playwright

BASE_URL      = "https://mydisk2.technijian.com"
USERNAME      = "admin"
PASSWORD      = "T3chn!j2n92618!!"
PRIMARY_COLOR = "#006DB6"   # Technijian blue

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_FILE  = os.path.join(SCRIPT_DIR, "mydisk-logo-white.png")
BG_FILE    = os.path.join(SCRIPT_DIR, "mydisk-login-bg.jpg")

def ss(page, name):
    path = os.path.join(SCRIPT_DIR, name)
    page.screenshot(path=path, full_page=False)
    print(f"  Screenshot: {path}")

def get_current_state():
    """Query OCS API to see current theming state."""
    creds = base64.b64encode(f"{USERNAME}:{PASSWORD}".encode()).decode()
    resp = requests.get(
        f"{BASE_URL}/ocs/v1.php/apps/theming/api/v1",
        headers={"Authorization": f"Basic {creds}", "Accept": "application/json"},
        verify=False,
    )
    try:
        j = resp.json()
        print(f"  Current state: name={j.get('name')!r}, primaryColor={j.get('primaryColor')!r}, "
              f"slogan={j.get('slogan')!r}, bgMime={j.get('backgroundMime')!r}")
        return j
    except Exception:
        print(f"  State fetch failed: {resp.status_code} {resp.text[:100]}")
        return {}

def run():
    import urllib3
    urllib3.disable_warnings()

    print("\n[0] Checking current state...")
    state = get_current_state()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=120)
        ctx     = browser.new_context(ignore_https_errors=True,
                                      viewport={"width": 1440, "height": 900})
        page    = ctx.new_page()

        # Login
        print("\n[1] Logging in...")
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        page.fill("#user",     USERNAME)
        page.fill("#password", PASSWORD)
        page.click("button[type=submit]")
        page.wait_for_url(f"{BASE_URL}/**", timeout=30000)
        time.sleep(2)

        # Navigate to theming
        print("\n[2] Opening theming page...")
        page.goto(f"{BASE_URL}/settings/admin/theming", wait_until="domcontentloaded")
        time.sleep(5)

        # ── Correct file inputs: background[0], favicon[1], logo[2], logoheader[3]
        file_inputs = page.query_selector_all("input[type=file]")
        print(f"\n[3] File uploads (found {len(file_inputs)} inputs)...")

        # Upload LOGO to input[2] (name='logo')
        print("  Uploading logo to input[2] (logo)...")
        try:
            file_inputs[2].set_input_files(LOGO_FILE)
            time.sleep(4)
            print("  Logo uploaded OK")
        except Exception as e:
            print(f"  Logo upload failed: {e}")

        time.sleep(1)
        ss(page, "_after_logo.png")

        # Upload BACKGROUND to input[0] (name='background')
        print("  Uploading background to input[0] (background)...")
        try:
            file_inputs[0].set_input_files(BG_FILE)
            time.sleep(4)
            print("  Background uploaded OK")
        except Exception as e:
            print(f"  Background upload failed: {e}")

        time.sleep(1)
        ss(page, "_after_bg.png")

        # ── Color picker: Click Primary color -> Choose ─────────────────────
        print("\n[4] Setting primary color #006DB6...")

        # Scroll up to make sure Primary color button is visible
        page.evaluate("() => window.scrollTo(0, 0)")
        time.sleep(0.5)

        # Click the Primary color button to open the picker
        page.click("button:has-text('Primary color')", timeout=8000)
        time.sleep(2)
        ss(page, "_picker_open.png")

        # The picker shows circles + "..." + "Choose"
        # Click "Choose" to open the full advanced color picker with hex input
        try:
            choose_btn = page.locator(".color-picker button:has-text('Choose')").first
            choose_btn.click()
            time.sleep(2)
            ss(page, "_picker_advanced.png")
            print("  Clicked 'Choose' button")
        except Exception as e:
            print(f"  Could not click Choose: {e}")
            # Try the ... button instead
            try:
                dots_btn = page.locator(".color-picker button:has-text('...')").first
                dots_btn.click()
                time.sleep(2)
                ss(page, "_picker_dots.png")
                print("  Clicked '...' button")
            except Exception as e2:
                print(f"  Could not click '...': {e2}")

        # Now look for the hex/color input in the advanced picker
        # The advanced picker renders in the same DOM (not a separate window)
        advanced_inputs = page.evaluate("""
            () => {
                const allInputs = Array.from(document.querySelectorAll('input'));
                return allInputs
                    .filter(el => el.type !== 'hidden' && el.type !== 'radio'
                               && el.type !== 'checkbox' && el.type !== 'file'
                               && el.type !== 'search'
                               && !el.id.startsWith('nc-vue-')
                               && !el.id.startsWith('initial-state'))
                    .map(el => ({
                        id: el.id, type: el.type, value: el.value,
                        maxLength: el.maxLength, className: el.className,
                        placeholder: el.placeholder
                    }));
            }
        """)
        print(f"  New inputs after Choose:")
        for inp in advanced_inputs:
            print(f"    {inp}")

        # Set color via any available color input
        color_set = False

        # Try to find and set the hex input
        result = page.evaluate(f"""
            () => {{
                const allInputs = Array.from(document.querySelectorAll('input'));
                // Look for hex input: type=color, or text with maxLength 7, or specific classes
                const candidates = allInputs.filter(el =>
                    (el.type === 'color') ||
                    (el.type === 'text' && (el.maxLength === 7 || el.maxLength === 9)) ||
                    (el.className && (el.className.includes('hex') || el.className.includes('color')))
                );
                if (candidates.length === 0) return 'no candidates';
                for (const el of candidates) {{
                    if (el.id && el.id.startsWith('nc-vue-')) continue;
                    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                    setter.call(el, '{PRIMARY_COLOR}');
                    el.dispatchEvent(new Event('input', {{bubbles: true}}));
                    el.dispatchEvent(new Event('change', {{bubbles: true}}));
                    el.focus();
                    el.dispatchEvent(new KeyboardEvent('keydown', {{key: 'Enter', keyCode: 13, bubbles: true}}));
                    el.dispatchEvent(new KeyboardEvent('keyup', {{key: 'Enter', keyCode: 13, bubbles: true}}));
                    return 'set ' + el.tagName + ' id=' + el.id + ' type=' + el.type + ' class=' + el.className + ' -> ' + el.value;
                }}
                return 'candidates found but skipped: ' + candidates.length;
            }}
        """)
        print(f"  Color set result: {result}")
        if PRIMARY_COLOR in result:
            color_set = True

        time.sleep(1)
        ss(page, "_after_color_input.png")

        # If we got a "Choose" dialog open, look for OK/Save/Apply button
        for btn_text in ("OK", "Save", "Apply", "Confirm", "Set color"):
            try:
                btn = page.locator(f"button:has-text('{btn_text}'):visible").first
                btn.click()
                time.sleep(1)
                print(f"  Clicked {btn_text} button")
                break
            except Exception:
                pass

        # Close picker by clicking outside
        page.keyboard.press("Escape")
        time.sleep(2)

        ss(page, "_after_color_set.png")

        # ── Check API state ───────────────────────────────────────────────────
        print("\n[5] Checking final state...")
        get_current_state()

        # ── Final login page ──────────────────────────────────────────────────
        print("\n[6] Final login page verification...")
        ctx2  = browser.new_context(ignore_https_errors=True,
                                    viewport={"width": 1440, "height": 900})
        page2 = ctx2.new_page()
        page2.goto(f"{BASE_URL}/login", wait_until="networkidle")
        time.sleep(3)
        ss(page2, "_login_final.png")
        ctx2.close()

        # ── Final theming page ────────────────────────────────────────────────
        page.reload(wait_until="domcontentloaded")
        time.sleep(5)
        ss(page, "_theming_final2.png")
        page.evaluate("() => window.scrollBy(0, 600)")
        time.sleep(1)
        ss(page, "_theming_scrolled2.png")

        ctx.close()
        browser.close()

        print("\nDone.")

if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()
    run()
