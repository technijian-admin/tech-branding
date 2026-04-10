"""Login to NotebookLM using Edge browser and save storage state.
Auto-detects when login is complete by polling the page URL.
"""
import asyncio
import sys
from pathlib import Path

async def main():
    from playwright.async_api import async_playwright

    storage_path = Path.home() / ".notebooklm" / "storage_state.json"
    storage_path.parent.mkdir(parents=True, exist_ok=True)

    print("\n============================================")
    print("  NotebookLM Login via Microsoft Edge")
    print("============================================\n")
    print("  1. Edge will open to NotebookLM")
    print("  2. Log in with your Google account")
    print("  3. Login will auto-detect and save!\n")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            channel="msedge",
            headless=False,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto("https://notebooklm.google.com/")

        print("Waiting for you to log in...")
        # Poll until we're on the NotebookLM page (not login/accounts page)
        for i in range(120):  # 4 minutes max
            await asyncio.sleep(2)
            try:
                url = page.url
                if "notebooklm.google.com" in url and "accounts.google" not in url:
                    # Check if we're actually logged in (page has content)
                    title = await page.title()
                    if "NotebookLM" in title or "Notebook" in title:
                        print(f"  Detected login success! URL: {url}")
                        break
            except Exception:
                pass
            if i % 5 == 0 and i > 0:
                print(f"  Still waiting... ({i*2}s)")
        else:
            print("  Timeout waiting for login. Saving anyway...")

        # Navigate to capture all cookies
        print("  Capturing cookies...")
        await page.goto("https://accounts.google.com/", wait_until="load")
        await asyncio.sleep(1)
        await page.goto("https://notebooklm.google.com/", wait_until="load")
        await asyncio.sleep(2)

        await context.storage_state(path=str(storage_path))
        await browser.close()

    print(f"\nAuthentication saved to: {storage_path}")
    print("============================================")
    print("  Login complete!")
    print("============================================\n")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(main())
