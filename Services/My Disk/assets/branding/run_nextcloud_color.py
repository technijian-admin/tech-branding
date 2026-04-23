"""
Nextcloud Color + Logo upload script - Technijian My Disk
Focused specifically on:
1. Setting primary color #006DB6 via the NC color picker
2. Uploading the white logo
3. Uploading the background image
"""

import time
import os
import json
from playwright.sync_api import sync_playwright

BASE_URL      = "https://mydisk2.technijian.com"
USERNAME      = "admin"
PASSWORD      = "T3chn!j2n92618!!"
PRIMARY_COLOR = "#006DB6"

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
        print("[1] Logging in...")
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        page.fill("#user",     USERNAME)
        page.fill("#password", PASSWORD)
        page.click("button[type=submit]")
        page.wait_for_url(f"{BASE_URL}/**", timeout=30000)
        time.sleep(2)

        # Navigate to theming
        print("[2] Opening theming page...")
        page.goto(f"{BASE_URL}/settings/admin/theming", wait_until="domcontentloaded")
        time.sleep(5)
        ss(page, "_color_before.png")

        # ── Upload logo via file input ──────────────────────────────────────
        print("[3] Uploading logo...")
        # The file inputs in order are: logo, favicon, background, logoheader
        # Need to scroll down to see them and identify by their label context
        # Let's get their positions from the DOM
        file_input_info = page.evaluate("""
            () => {
                const inputs = Array.from(document.querySelectorAll('input[type=file]'));
                return inputs.map((el, i) => {
                    // Walk up the DOM to find a label or section header
                    let parent = el.parentElement;
                    let label = '';
                    for (let j = 0; j < 10 && parent; j++) {
                        label = parent.innerText?.substring(0, 100) || '';
                        if (label.trim()) break;
                        parent = parent.parentElement;
                    }
                    return { index: i, name: el.name || '', label: label.trim().substring(0, 80) };
                });
            }
        """)
        print(f"  File inputs:")
        for fi in file_input_info:
            print(f"    [{fi['index']}] name={fi['name']!r} label={fi['label']!r}")

        # Upload files to the correct inputs based on context
        file_inputs = page.query_selector_all("input[type=file]")
        print(f"  Total file inputs: {len(file_inputs)}")

        logo_uploaded = False
        bg_uploaded   = False

        for i, fi in enumerate(file_input_info):
            label_lower = fi['label'].lower()
            if 'logo' in label_lower and 'header' not in label_lower and 'favicon' not in label_lower and not logo_uploaded:
                try:
                    file_inputs[i].set_input_files(LOGO_FILE)
                    time.sleep(3)
                    logo_uploaded = True
                    print(f"  Logo uploaded to input[{i}]")
                except Exception as e:
                    print(f"  Logo upload to input[{i}] failed: {e}")
            elif 'background' in label_lower and not bg_uploaded:
                try:
                    file_inputs[i].set_input_files(BG_FILE)
                    time.sleep(3)
                    bg_uploaded = True
                    print(f"  Background uploaded to input[{i}]")
                except Exception as e:
                    print(f"  Background upload to input[{i}] failed: {e}")

        if not logo_uploaded and len(file_inputs) >= 1:
            try:
                file_inputs[0].set_input_files(LOGO_FILE)
                time.sleep(3)
                logo_uploaded = True
                print("  Logo uploaded to first file input (fallback)")
            except Exception as e:
                print(f"  Logo fallback upload failed: {e}")

        if not bg_uploaded and len(file_inputs) >= 3:
            try:
                file_inputs[2].set_input_files(BG_FILE)
                time.sleep(3)
                bg_uploaded = True
                print("  Background uploaded to third file input (fallback)")
            except Exception as e:
                print(f"  Background fallback upload failed: {e}")

        time.sleep(2)
        ss(page, "_after_uploads.png")

        # ── Color picker ─────────────────────────────────────────────────────
        print("[4] Setting primary color via color picker...")

        # Scroll to "Primary color" button and click it
        page.evaluate("() => window.scrollTo(0, 400)")
        time.sleep(1)

        color_btn = page.locator("button:has-text('Primary color')").first
        color_btn.scroll_into_view_if_needed()
        time.sleep(0.5)
        color_btn.click()
        time.sleep(2)

        ss(page, "_color_picker_open.png")

        # Inspect what appeared
        picker_info = page.evaluate("""
            () => {
                // Look for the color picker popup
                const popups = Array.from(document.querySelectorAll('.nc-color-picker, .NcColorPicker, [class*="color-picker"], [class*="ColorPicker"]'));
                const allNew = Array.from(document.querySelectorAll('input[type=text], input[type=color]'))
                    .filter(el => !el.id.startsWith('nc-vue-') && !el.id.startsWith('initial-state') && el.type !== 'hidden')
                    .map(el => ({
                        id: el.id,
                        type: el.type,
                        value: el.value,
                        maxLength: el.maxLength,
                        className: el.className,
                        placeholder: el.placeholder
                    }));
                return {
                    popups: popups.map(p => p.className + ': ' + p.innerText?.substring(0, 50)),
                    inputs: allNew
                };
            }
        """)
        print(f"  Picker popups: {picker_info['popups']}")
        print(f"  New text/color inputs: {picker_info['inputs']}")

        # The Nextcloud NcColorPicker uses @nextcloud/vue which renders in a Popper
        # Look for it in the document body appended portals
        color_set = False

        # Method 1: Look for any new visible text input with hex-like value
        for inp_info in picker_info['inputs']:
            if inp_info.get('type') == 'color' or (inp_info.get('maxLength', -1) in [7, 9] and inp_info.get('type') == 'text'):
                try:
                    sel = f"input[type='{inp_info['type']}']" if not inp_info.get('id') else f"#{inp_info['id']}"
                    result = page.evaluate(f"""
                        () => {{
                            const el = document.querySelector('{sel}');
                            if (!el) return 'not found';
                            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                            setter.call(el, '{PRIMARY_COLOR}');
                            el.dispatchEvent(new Event('input', {{bubbles: true}}));
                            el.dispatchEvent(new Event('change', {{bubbles: true}}));
                            return el.value;
                        }}
                    """)
                    if result == PRIMARY_COLOR:
                        color_set = True
                        print(f"  Color set via {sel}: {result}")
                        break
                except Exception as e:
                    print(f"  Color via {inp_info}: {e}")

        # Method 2: Look for the hex input inside the picker by trying keyboard
        if not color_set:
            # The NcColorPicker might have a text input showing the hex
            # Try to find it via tabbing into the popup
            try:
                # Click the picker area and type the hex
                # Look for any visible input within the color picker bubble
                page.keyboard.press("Tab")
                time.sleep(0.5)

                # Use JS to find the color picker component and update its value
                result = page.evaluate(f"""
                    () => {{
                        // Try to find Vue component instance and update color
                        const pickerEls = document.querySelectorAll('[data-popper-reference-hidden], .v-popper--theme-tooltip, .v-popper--shown, [id*="popper"]');
                        const allInputs = Array.from(document.querySelectorAll('input'));
                        const hexInputs = allInputs.filter(el =>
                            (el.type === 'text' && (el.maxLength === 7 || el.maxLength === 9 || el.className.includes('hex')))
                            || el.type === 'color'
                        );
                        if (hexInputs.length > 0) {{
                            const el = hexInputs[0];
                            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                            setter.call(el, '{PRIMARY_COLOR}');
                            el.dispatchEvent(new Event('input', {{bubbles: true}}));
                            el.dispatchEvent(new Event('change', {{bubbles: true}}));
                            el.dispatchEvent(new KeyboardEvent('keydown', {{key: 'Enter', bubbles: true}}));
                            return 'set: ' + el.value + ' class=' + el.className;
                        }}
                        return 'no hex input found, total inputs: ' + allInputs.length;
                    }}
                """)
                print(f"  Color JS result: {result}")
                if PRIMARY_COLOR in result:
                    color_set = True
            except Exception as e:
                print(f"  Color fallback failed: {e}")

        # Method 3: Use the Vue app's internal state to set color
        if not color_set:
            result = page.evaluate(f"""
                () => {{
                    // Try to find a Vue component with a color property
                    const allEls = document.querySelectorAll('[class*="AdminTheming"], [class*="theming"], .settings-section');
                    let found = false;
                    for (const el of allEls) {{
                        const vueInstance = el.__vue__ || el.__vue_app__;
                        if (vueInstance) {{
                            try {{
                                if (vueInstance.$data && 'color' in vueInstance.$data) {{
                                    vueInstance.$data.color = '{PRIMARY_COLOR}';
                                    found = true;
                                    return 'set via $data.color';
                                }}
                            }} catch(e) {{}}
                        }}
                    }}
                    return 'vue instance not found';
                }}
            """)
            print(f"  Vue state result: {result}")

        time.sleep(2)
        ss(page, "_color_picker_closed.png")

        # ── Check current color from API ──────────────────────────────────────
        import requests, base64
        creds = base64.b64encode(f"{USERNAME}:{PASSWORD}".encode()).decode()
        resp = requests.get(
            f"{BASE_URL}/ocs/v1.php/apps/theming/api/v1",
            headers={"Authorization": f"Basic {creds}", "Accept": "application/json"},
            verify=False,
        )
        current = resp.json() if resp.ok else {}
        print(f"\n  Current theming state:")
        print(f"    name:    {current.get('name')}")
        print(f"    slogan:  {current.get('slogan')}")
        print(f"    url:     {current.get('url')}")
        print(f"    color:   {current.get('primaryColor')}")
        print(f"    bgMime:  {current.get('backgroundMime')}")
        print(f"    logoMime:{current.get('logoMime')}")

        # ── Final login page screenshot ───────────────────────────────────────
        print("\n[5] Final login page verification...")
        ctx2  = browser.new_context(ignore_https_errors=True,
                                    viewport={"width": 1440, "height": 900})
        page2 = ctx2.new_page()
        page2.goto(f"{BASE_URL}/login", wait_until="networkidle")
        time.sleep(3)
        ss(page2, "_login_branded_final.png")
        ctx2.close()

        ctx.close()
        browser.close()

        print("\nDone.")

if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()
    run()
