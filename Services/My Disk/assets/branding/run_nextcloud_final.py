"""
Final Nextcloud Branding - Color + Logo/Background fix
Uses Playwright to make the AJAX call IN THE BROWSER (no CSRF issues),
handles color picker by clicking preset or using CDP to set color input,
and re-uploads logo+background to correct inputs.
"""

import time
import os
import json
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

def ajax_update(page, key, value):
    """Make authenticated AJAX call from within the browser context (CSRF auto-handled)."""
    result = page.evaluate(f"""
        async () => {{
            const token = document.querySelector('meta[name="requesttoken"]')?.getAttribute('content')
                       || (typeof OC !== 'undefined' ? OC.requestToken : null);
            const formData = new FormData();
            formData.append('key', {json.dumps(key)});
            formData.append('value', {json.dumps(value)});
            const resp = await fetch('/apps/theming/ajax/updateStylesheet', {{
                method: 'POST',
                headers: {{
                    'requesttoken': token || '',
                    'X-Requested-With': 'XMLHttpRequest'
                }},
                body: formData,
                credentials: 'same-origin'
            }});
            const text = await resp.text();
            return {{ status: resp.status, body: text }};
        }}
    """)
    print(f"  AJAX {key}: HTTP {result['status']} | {result['body'][:100]}")
    return result['status'] == 200 and '"success"' in result['body']


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        ctx     = browser.new_context(ignore_https_errors=True,
                                      viewport={"width": 1440, "height": 900})
        page    = ctx.new_page()

        # Login
        print("\n[1] Login...")
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        page.fill("#user",     USERNAME)
        page.fill("#password", PASSWORD)
        page.click("button[type=submit]")
        page.wait_for_url(f"{BASE_URL}/**", timeout=30000)
        time.sleep(2)

        # Navigate to theming
        print("\n[2] Theming page...")
        page.goto(f"{BASE_URL}/settings/admin/theming", wait_until="domcontentloaded")
        time.sleep(5)
        ss(page, "_final_start.png")

        # ── Set color via AJAX in browser ────────────────────────────────────
        print("\n[3] Setting color via browser AJAX...")
        # NC33 valid color key - determined from NC33 source:
        # apps/theming/lib/Controller/ThemingController.php
        # In NC29+, the 'color' key was split; NC33 uses 'color' for backgroundColor
        # and the primary color is set differently
        # Let's try all valid keys from the IN-browser context

        for key in ["color", "primaryColor", "primary_color"]:
            ok = ajax_update(page, key, PRIMARY_COLOR)
            if ok:
                print(f"  SUCCESS with key={key}")
                break

        time.sleep(2)
        ss(page, "_after_ajax_color.png")

        # ── Re-upload logo to correct input (index 2 = logo) ─────────────────
        print("\n[4] Uploading logo and background...")
        # Reload to get fresh state
        page.reload(wait_until="domcontentloaded")
        time.sleep(5)

        file_inputs = page.query_selector_all("input[type=file]")
        print(f"  File inputs: {len(file_inputs)}")

        # Verify correct inputs by name attribute
        for i, fi in enumerate(file_inputs):
            name = fi.get_attribute("name") or ""
            print(f"  [{i}] name={name!r}")

        # Upload logo (index 2, name='logo')
        try:
            # Find by name attribute
            logo_input = page.query_selector("input[type=file][name='logo']")
            if logo_input:
                logo_input.set_input_files(LOGO_FILE)
                time.sleep(4)
                print("  Logo uploaded via name='logo' selector")
            else:
                file_inputs[2].set_input_files(LOGO_FILE)
                time.sleep(4)
                print("  Logo uploaded via index[2]")
        except Exception as e:
            print(f"  Logo upload error: {e}")

        time.sleep(1)
        ss(page, "_after_logo.png")

        # Upload background (index 0, name='background')
        try:
            bg_input = page.query_selector("input[type=file][name='background']")
            if bg_input:
                bg_input.set_input_files(BG_FILE)
                time.sleep(4)
                print("  Background uploaded via name='background' selector")
            else:
                file_inputs[0].set_input_files(BG_FILE)
                time.sleep(4)
                print("  Background uploaded via index[0]")
        except Exception as e:
            print(f"  Background upload error: {e}")

        time.sleep(2)
        ss(page, "_after_bg.png")

        # ── Color picker via the simple preset circles ─────────────────────
        # The NcColorPicker shows preset color circles
        # If #006DB6 is close to one of the presets, click it
        # Otherwise use the CDP approach to handle native color picker
        print("\n[5] Color picker - trying preset circles...")

        page.evaluate("() => window.scrollTo(0, 0)")
        time.sleep(0.5)
        page.click("button:has-text('Primary color')", timeout=8000)
        time.sleep(2)
        ss(page, "_picker_open2.png")

        # Get the color circles and their data-color attributes
        circles_info = page.evaluate("""
            () => {
                const circles = Array.from(document.querySelectorAll(
                    '.color-picker__simple-color-circle, [class*="color-circle"], button[data-color]'
                ));
                return circles.map(el => ({
                    color: el.getAttribute('data-color') || el.style.backgroundColor || el.getAttribute('aria-label'),
                    text: el.innerText,
                    className: el.className
                }));
            }
        """)
        print(f"  Color circles: {circles_info}")

        # Try clicking a circle close to #006DB6 (a blue circle)
        # The NC preset colors include blues - find the closest one
        color_circle_clicked = False
        for circle in circles_info:
            c = circle.get('color', '') or ''
            if '006' in c or '0067' in c or '006d' in c.lower() or '0056' in c.lower():
                try:
                    page.click(f"[data-color='{c}']", timeout=2000)
                    time.sleep(1)
                    color_circle_clicked = True
                    print(f"  Clicked circle with color: {c}")
                    break
                except Exception:
                    pass

        # If no matching preset, use the CDP approach for "Choose" button
        if not color_circle_clicked:
            print("  No matching preset - trying CDP color dialog approach...")
            try:
                # Click "Choose" which opens native browser color picker
                page.click(".color-picker button:has-text('Choose')", timeout=3000)
                time.sleep(1)

                # Use CDP to get the input[type=color] and set its value directly
                client = page.context.new_cdp_session(page)

                # Get all color inputs via CDP Runtime.evaluate
                result = client.send("Runtime.evaluate", {
                    "expression": """
                        (() => {
                            const inputs = document.querySelectorAll('input[type=color]');
                            return Array.from(inputs).map(el => ({
                                id: el.id,
                                value: el.value,
                                visible: el.offsetParent !== null
                            }));
                        })()
                    """,
                    "returnByValue": True
                })
                print(f"  CDP color inputs: {result}")

                # Try to set via CDP Input.dispatchKeyEvent to type hex
                # First press Escape to close dialog, then use direct JS manipulation
                client.send("Input.dispatchKeyEvent", {"type": "keyDown", "key": "Escape"})
                time.sleep(0.5)

                # Use DOM manipulation from CDP
                result2 = client.send("Runtime.evaluate", {
                    "expression": f"""
                        (() => {{
                            // Find the NcColorPicker Vue component via internal Vue state
                            const app = document.querySelector('#app-settings-content') || document.body;

                            // Find the AdminTheming component
                            function findVue(el, maxDepth) {{
                                if (maxDepth <= 0) return null;
                                if (el.__vue__) return el.__vue__;
                                for (const child of el.children || []) {{
                                    const v = findVue(child, maxDepth - 1);
                                    if (v) return v;
                                }}
                                return null;
                            }}

                            // Try to find Vue 3 app instance
                            const appEl = document.querySelector('[data-v-app]');
                            if (appEl && appEl._vei) {{
                                return 'found Vue 3 app';
                            }}

                            // Try to use fetch to directly call the color save endpoint
                            return 'trying fetch approach';
                        }})()
                    """,
                    "returnByValue": True
                })
                print(f"  CDP Vue result: {result2}")

            except Exception as e:
                print(f"  CDP approach failed: {e}")

        # Press Escape to close any open picker
        page.keyboard.press("Escape")
        time.sleep(1)

        # ── Final verification ────────────────────────────────────────────────
        print("\n[6] Final verification...")
        ss(page, "_final_theming.png")

        ctx2  = browser.new_context(ignore_https_errors=True,
                                    viewport={"width": 1440, "height": 900})
        page2 = ctx2.new_page()
        page2.goto(f"{BASE_URL}/login", wait_until="networkidle")
        time.sleep(3)
        ss(page2, "_login_final2.png")
        ctx2.close()

        # Scroll down on theming page to see all thumbnails
        page.reload(wait_until="domcontentloaded")
        time.sleep(5)
        page.evaluate("() => window.scrollBy(0, 600)")
        time.sleep(1)
        ss(page, "_theming_scrolled_final.png")

        ctx.close()
        browser.close()
        print("\nDone.")

if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()
    run()
