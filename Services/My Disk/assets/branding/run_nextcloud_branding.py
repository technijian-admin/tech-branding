"""
Nextcloud Branding Script -- Technijian My Disk
Target: https://mydisk2.technijian.com/
Nextcloud 33 strategy:
  1. Login via Playwright to get a valid session + CSRF token
  2. Use the authenticated session to call /apps/theming/ajax/updateStylesheet
     (which needs a valid NC session cookie, not just Basic auth)
  3. Upload images via Playwright file input (already working from prior runs)
  4. Screenshots at each stage
"""

import sys
import time
import os
import json
import requests
from playwright.sync_api import sync_playwright

# ============================================================
# Config
# ============================================================
BASE_URL      = "https://mydisk2.technijian.com"
USERNAME      = "admin"
PASSWORD      = "T3chn!j2n92618!!"
INSTANCE_NAME = "Technijian My Disk"
SLOGAN        = "Secure. Synced. Yours."
WEBSITE_URL   = "https://technijian.com"
PRIMARY_COLOR = "#006DB6"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_FILE  = os.path.join(SCRIPT_DIR, "mydisk-logo-white.png")
BG_FILE    = os.path.join(SCRIPT_DIR, "mydisk-login-bg.jpg")

# ============================================================
# Screenshot helper
# ============================================================

def ss(page, name):
    path = os.path.join(SCRIPT_DIR, name)
    page.screenshot(path=path, full_page=False)
    print(f"  Screenshot: {path}")

# ============================================================
# Main
# ============================================================

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        ctx     = browser.new_context(ignore_https_errors=True,
                                      viewport={"width": 1440, "height": 900})
        page    = ctx.new_page()

        # ── 1. Login ─────────────────────────────────────────────────────────
        print("\n=== Step 1: Login ===")
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        page.fill("#user",     USERNAME)
        page.fill("#password", PASSWORD)
        page.click("button[type=submit]")
        page.wait_for_url(f"{BASE_URL}/**", timeout=30000)
        time.sleep(2)
        ss(page, "_login_done.png")
        print("  Logged in OK")

        # ── 2. Get CSRF token from the logged-in page ─────────────────────────
        print("\n=== Step 2: Get CSRF token ===")
        page.goto(f"{BASE_URL}/settings/admin/theming", wait_until="domcontentloaded")
        time.sleep(4)

        # Extract the requesttoken from meta tag or the OC.requestToken JS var
        csrf_token = page.evaluate("""
            () => {
                // Try meta tag
                const meta = document.querySelector('meta[name="requesttoken"]');
                if (meta) return meta.getAttribute('content');
                // Try window.oc_requesttoken
                if (typeof OC !== 'undefined' && OC.requestToken) return OC.requestToken;
                if (typeof oc_requesttoken !== 'undefined') return oc_requesttoken;
                return null;
            }
        """)
        print(f"  CSRF token: {csrf_token[:20] if csrf_token else 'NOT FOUND'}...")

        # Get session cookies for requests library
        cookies = ctx.cookies()
        cookie_dict = {c['name']: c['value'] for c in cookies}
        print(f"  Session cookies: {list(cookie_dict.keys())}")

        ss(page, "_theming_page.png")

        # ── 3. Update theming via AJAX calls with session ─────────────────────
        print("\n=== Step 3: Update theming via AJAX (session + CSRF) ===")

        session = requests.Session()
        for c in cookies:
            session.cookies.set(c['name'], c['value'], domain=c.get('domain', ''))

        ajax_headers = {
            "requesttoken": csrf_token or "",
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded",
        }

        def update_field(key, value):
            resp = session.post(
                f"{BASE_URL}/apps/theming/ajax/updateStylesheet",
                headers=ajax_headers,
                data={"key": key, "value": value},
                verify=False,
            )
            try:
                j = resp.json()
                ok = j.get("status") == "success"
                print(f"  {key}: {resp.status_code} | {j}")
            except Exception:
                ok = resp.status_code == 200
                print(f"  {key}: {resp.status_code} | {resp.text[:150]}")
            return ok

        results = {}
        results["name"]   = update_field("name",   INSTANCE_NAME)
        results["slogan"] = update_field("slogan", SLOGAN)
        results["url"]    = update_field("url",    WEBSITE_URL)
        results["color"]  = update_field("color",  PRIMARY_COLOR)

        # ── 4. Upload images via requests session ─────────────────────────────
        print("\n=== Step 4: Upload images via AJAX ===")

        def upload_image(endpoint_key, file_path, mime_type):
            fname = os.path.basename(file_path)
            with open(file_path, "rb") as f:
                resp = session.post(
                    f"{BASE_URL}/apps/theming/ajax/updateLogo",
                    headers={
                        "requesttoken": csrf_token or "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    data={"key": endpoint_key},
                    files={"image": (fname, f, mime_type)},
                    verify=False,
                )
            try:
                j = resp.json()
                ok = j.get("status") == "success"
                print(f"  {endpoint_key}: {resp.status_code} | {j}")
            except Exception:
                ok = resp.status_code == 200
                print(f"  {endpoint_key}: {resp.status_code} | {resp.text[:200]}")
            return ok

        results["logo"]       = upload_image("logo",       LOGO_FILE, "image/png")
        results["background"] = upload_image("background", BG_FILE,   "image/jpeg")

        # ── 5. Also try Playwright UI fill as backup ──────────────────────────
        print("\n=== Step 5: Playwright UI fill (backup) ===")
        page.reload(wait_until="domcontentloaded")
        time.sleep(4)

        def ui_fill_id(input_id, value, label):
            """Fill a Vue input by ID and fire input event to trigger auto-save."""
            try:
                # Use evaluate to directly set value and dispatch input event
                page.evaluate(f"""
                    () => {{
                        const el = document.getElementById('{input_id}');
                        if (!el) return false;
                        el.focus();
                        // Use native input setter to bypass Vue's reactivity guards
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                            window.HTMLInputElement.prototype, 'value').set;
                        nativeInputValueSetter.call(el, {json.dumps(value)});
                        el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                        el.blur();
                        return true;
                    }}
                """)
                time.sleep(0.8)
                # Verify value was set
                actual = page.evaluate(f"() => document.getElementById('{input_id}')?.value")
                ok = actual == value
                print(f"  UI {label}: set={ok} (actual={actual!r})")
                return ok
            except Exception as e:
                print(f"  UI {label} failed: {e}")
                return False

        ui_fill_id("nc-vue-0", INSTANCE_NAME, "Name")
        ui_fill_id("nc-vue-1", WEBSITE_URL,   "Web link")
        ui_fill_id("nc-vue-2", SLOGAN,        "Slogan")

        # Give Vue time to process and auto-save
        time.sleep(3)
        ss(page, "_theming_after_fill.png")

        # ── 6. Handle color picker ────────────────────────────────────────────
        print("\n=== Step 6: Primary color picker ===")
        color_ok = False
        try:
            # Click the Primary color button
            page.click("button:has-text('Primary color')", timeout=5000)
            time.sleep(1.5)

            # The color picker in Nextcloud 33 shows a NcColorPicker with a hex input
            # Look for hex input field
            all_inputs = page.evaluate("""
                () => Array.from(document.querySelectorAll('input')).map(el => ({
                    id: el.id,
                    type: el.type,
                    value: el.value,
                    placeholder: el.placeholder,
                    maxLength: el.maxLength,
                    className: el.className
                }))
            """)
            print("  Inputs after color picker open:")
            for inp in all_inputs:
                if inp.get('type') not in ('hidden', 'radio', 'checkbox', 'search', 'file') and inp.get('id', '').startswith(('nc-', '')) and 'initial-state' not in inp.get('id', ''):
                    print(f"    {inp}")

            # Try hex input selectors specific to NC33 NcColorPicker
            hex_selectors = [
                ".color-picker__hex input",
                ".hex-input",
                "input.hex",
                ".vc-input__input",
                "input[maxlength='7']",
                "input[placeholder='#RRGGBB']",
                ".color-picker input[type='text']",
                ".NcColorPicker input[type='text']",
                # The picker might render a simple text input
                "input[type='text'][value*='#']",
            ]
            for sel in hex_selectors:
                try:
                    el = page.wait_for_selector(sel, timeout=1500)
                    if el:
                        page.evaluate(f"""
                            () => {{
                                const el = document.querySelector('{sel}');
                                if (!el) return;
                                const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                                setter.call(el, '{PRIMARY_COLOR}');
                                el.dispatchEvent(new Event('input', {{bubbles: true}}));
                                el.dispatchEvent(new Event('change', {{bubbles: true}}));
                                el.dispatchEvent(new KeyboardEvent('keydown', {{key: 'Enter', bubbles: true}}));
                            }}
                        """)
                        time.sleep(1)
                        color_ok = True
                        print(f"  Color set via: {sel}")
                        break
                except Exception:
                    pass

            if not color_ok:
                # Dump full input list after picker opened
                for inp in all_inputs:
                    if inp.get('type') not in ('hidden',):
                        print(f"    ALL: {inp}")

            # Press Escape to close picker
            page.keyboard.press("Escape")
            time.sleep(1)

        except Exception as e:
            print(f"  Color picker failed: {e}")

        results["color_ui"] = color_ok
        time.sleep(2)
        ss(page, "_after_color.png")

        # ── 7. Verify — fresh login page ──────────────────────────────────────
        print("\n=== Step 7: Verify login page branding ===")
        ctx2  = browser.new_context(ignore_https_errors=True,
                                    viewport={"width": 1440, "height": 900})
        page2 = ctx2.new_page()
        page2.goto(f"{BASE_URL}/login", wait_until="networkidle")
        time.sleep(3)
        ss(page2, "_login_branded.png")
        ctx2.close()

        # Reload theming page for final state
        page.reload(wait_until="domcontentloaded")
        time.sleep(4)
        ss(page, "_theming_final.png")

        ctx.close()
        browser.close()

        # ── Summary ───────────────────────────────────────────────────────────
        print("\n" + "=" * 60)
        print("BRANDING SUMMARY")
        print("=" * 60)
        for k, v in results.items():
            status = "OK" if v else "FAILED"
            print(f"  {k:20s}: {status}")
        print("=" * 60)


if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()
    run()
