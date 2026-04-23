"""
Generate My Disk brand assets — logos, favicon, login background — via Playwright.

Outputs (in same folder):
  - mydisk-logo.png          512×512 square app icon
  - mydisk-logo-nav.png      480×100 nav bar logo (white, for dark bg)
  - mydisk-logo-color.png    720×180 horizontal logo (color, for light bg)
  - mydisk-favicon-256.png   256×256 favicon
  - mydisk-favicon-64.png    64×64 favicon
  - mydisk-favicon.ico       Multi-size ICO (16/32/48)
  - mydisk-login-bg.jpg      1920×1080 login background
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, 'design_assets.html')

TASKS = [
    # (selector, output_filename, viewport_w, viewport_h)
    ('#f_icon_square',      'mydisk-logo.png',         520, 520),
    ('#f_logo_horizontal',  'mydisk-logo-color.png',   740, 200),
    ('#f_logo_nav',         'mydisk-logo-nav.png',     500, 120),
    ('#f_favicon_256',      'mydisk-favicon-256.png',  260, 260),
    ('#f_favicon_64',       'mydisk-favicon-64.png',   68,  68),
    ('#f_login_bg',         'mydisk-login-bg-raw.png', 1920, 1080),
]


def build():
    url = f"file:///{HTML.replace(os.sep, '/')}"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for selector, out_name, vw, vh in TASKS:
            ctx = browser.new_context(
                viewport={'width': vw, 'height': vh},
                device_scale_factor=2,  # Retina-quality
            )
            page = ctx.new_page()
            page.goto(url, wait_until='networkidle')
            page.wait_for_timeout(400)

            # Hide other frames so only the target is visible
            page.evaluate("""
              (selector) => {
                const frames = document.querySelectorAll('.frame');
                frames.forEach(f => { f.style.display = (f.matches(selector) ? 'block' : 'none'); });
                document.body.style.margin = '0';
                document.body.style.padding = '0';
                document.documentElement.style.background = 'transparent';
              }
            """, selector)
            page.wait_for_timeout(300)

            el = page.locator(selector).first
            out_path = os.path.join(HERE, out_name)
            el.screenshot(path=out_path, omit_background=(selector != '#f_login_bg'))
            size_kb = os.path.getsize(out_path) / 1024
            print(f"  {out_name}  ({size_kb:.0f} KB)")

            ctx.close()

        browser.close()

    # Convert login background PNG -> JPG (smaller, no alpha needed)
    try:
        from PIL import Image
        raw = os.path.join(HERE, 'mydisk-login-bg-raw.png')
        jpg = os.path.join(HERE, 'mydisk-login-bg.jpg')
        img = Image.open(raw).convert('RGB')
        img.save(jpg, 'JPEG', quality=92, optimize=True)
        os.remove(raw)
        size_kb = os.path.getsize(jpg) / 1024
        print(f"  mydisk-login-bg.jpg  ({size_kb:.0f} KB)")
    except Exception as e:
        print(f"  JPG conversion skipped: {e}")

    # Build ICO favicon from the 256 PNG
    try:
        from PIL import Image
        png256 = os.path.join(HERE, 'mydisk-favicon-256.png')
        ico = os.path.join(HERE, 'mydisk-favicon.ico')
        img = Image.open(png256).convert('RGBA')
        img.save(ico, format='ICO', sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
        size_kb = os.path.getsize(ico) / 1024
        print(f"  mydisk-favicon.ico  ({size_kb:.0f} KB)")
    except Exception as e:
        print(f"  ICO build skipped: {e}")

    print("\nAll brand assets generated.")


if __name__ == '__main__':
    build()
