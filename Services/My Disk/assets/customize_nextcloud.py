"""
Customize Nextcloud (mydisk2.technijian.com) with Technijian My Disk branding.

Applies:
  - Instance name: Technijian My Disk
  - Slogan: Secure. Synced. Yours.
  - Primary color: #006DB6
  - Logo: branding/mydisk-logo-white.png (generated first)
  - Login background: branding/mydisk-login-bg.jpg
"""
import os
import time
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
BRANDING = os.path.join(HERE, 'branding')

URL   = 'https://mydisk2.technijian.com'
USER  = 'admin'
PASS  = 'T3chn!j2n92618!!'

LOGO_PNG = os.path.join(BRANDING, 'mydisk-logo-white.png')
BG_JPG   = os.path.join(BRANDING, 'mydisk-login-bg.jpg')


def wait(page, ms=600):
    page.wait_for_timeout(ms)


def login(page):
    print("  Logging in...")
    page.goto(f"{URL}/login", wait_until='networkidle')
    page.fill('#user', USER)
    page.fill('#password', PASS)
    page.click('button[type=submit]')
    page.wait_for_url(f"{URL}/apps/**", timeout=15000)
    print("  Logged in.")


def go_theming(page):
    page.goto(f"{URL}/settings/admin/theming", wait_until='networkidle')
    wait(page, 1500)


def set_text_field(page, label_text, value):
    """Find input by nearby label text and set its value."""
    # Try to find input associated with a label containing label_text
    try:
        el = page.locator(f'label:has-text("{label_text}") + input, '
                          f'label:has-text("{label_text}") ~ input').first
        el.triple_click()
        el.fill(value)
        el.press('Tab')
        wait(page, 400)
        return True
    except Exception:
        pass
    return False


def set_color(page, color_hex):
    """Set the primary color via the color picker input."""
    try:
        # Nextcloud uses a color-picker component; the hex input is often a text input
        inputs = page.locator('input[type="color"], input[placeholder*="color"], input[placeholder*="#"]')
        if inputs.count() > 0:
            inp = inputs.first
            inp.triple_click()
            inp.fill(color_hex)
            inp.press('Tab')
            wait(page, 400)
            print(f"  Color set via input: {color_hex}")
            return
        # Fallback: click color swatch to open picker, type hex
        swatch = page.locator('.color-picker__swatch, [class*="colorpicker"] input').first
        swatch.click()
        wait(page, 500)
        hex_input = page.locator('input[maxlength="7"], input[placeholder="#"]').first
        hex_input.triple_click()
        hex_input.fill(color_hex.lstrip('#'))
        hex_input.press('Enter')
        wait(page, 400)
        print(f"  Color set via picker: {color_hex}")
    except Exception as e:
        print(f"  Color set skipped: {e}")


def upload_file(page, field_selector_hint, file_path):
    """Upload a file by finding the file input near a label/button hint."""
    if not os.path.exists(file_path):
        print(f"  SKIP upload — file not found: {file_path}")
        return
    try:
        inp = page.locator(f'input[type="file"]').all()
        for i, file_input in enumerate(inp):
            file_input.set_input_files(file_path)
            wait(page, 800)
            print(f"  Uploaded {os.path.basename(file_path)} to file input #{i}")
            break
    except Exception as e:
        print(f"  Upload failed: {e}")


def save_theming(page):
    try:
        btn = page.locator('button:has-text("Save"), input[value*="Save"], button[type="submit"]').first
        btn.click()
        wait(page, 1000)
        print("  Saved.")
    except Exception as e:
        print(f"  Save click: {e}")


def apply_branding(page):
    print("  Navigating to theming...")
    go_theming(page)

    ss = os.path.join(HERE, 'branding', '_before_theming.png')
    page.screenshot(path=ss, full_page=False)
    print(f"  Screenshot saved: {ss}")

    # Set name
    set_text_field(page, 'Name', 'Technijian My Disk')
    # Set slogan
    set_text_field(page, 'Slogan', 'Secure. Synced. Yours.')
    # Set URL
    set_text_field(page, 'URL', 'https://technijian.com')
    # Set color
    set_color(page, '#006DB6')

    wait(page, 500)

    # Upload logo
    if os.path.exists(LOGO_PNG):
        try:
            # Find logo upload input — Nextcloud typically has separate file inputs
            file_inputs = page.locator('input[type="file"]').all()
            print(f"  Found {len(file_inputs)} file inputs")
            if len(file_inputs) >= 1:
                file_inputs[0].set_input_files(LOGO_PNG)
                wait(page, 1000)
                print("  Logo uploaded.")
        except Exception as e:
            print(f"  Logo upload: {e}")

    # Upload login background
    if os.path.exists(BG_JPG):
        try:
            file_inputs = page.locator('input[type="file"]').all()
            if len(file_inputs) >= 2:
                file_inputs[1].set_input_files(BG_JPG)
                wait(page, 1000)
                print("  Background uploaded.")
        except Exception as e:
            print(f"  Background upload: {e}")

    # Save
    save_theming(page)

    # Final screenshot
    page.reload()
    wait(page, 2000)
    ss2 = os.path.join(HERE, 'branding', '_after_theming.png')
    page.screenshot(path=ss2, full_page=False)
    print(f"  After screenshot: {ss2}")


def verify_login_page(page):
    """Check the login page shows the new branding."""
    page.goto(URL, wait_until='networkidle')
    wait(page, 1500)
    ss = os.path.join(HERE, 'branding', '_verify_login.png')
    page.screenshot(path=ss, full_page=False)
    print(f"  Login page screenshot: {ss}")


def main():
    # Generate brand assets first if not present
    if not os.path.exists(LOGO_PNG) or not os.path.exists(BG_JPG):
        print("Generating brand assets first...")
        import subprocess
        subprocess.run(['python', os.path.join(BRANDING, 'generate_brand_assets.py')], check=True)

    print(f"Connecting to {URL}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        ctx = browser.new_context(ignore_https_errors=True)
        page = ctx.new_page()

        login(page)
        apply_branding(page)
        verify_login_page(page)

        print("\nCustomization complete. Check branding/_after_theming.png and _verify_login.png")
        browser.close()


if __name__ == '__main__':
    main()
