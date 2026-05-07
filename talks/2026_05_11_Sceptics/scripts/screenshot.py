#!/usr/bin/env python3
"""
Screenshot a Slidev dev server slide range at the venue's native canvas size,
so we can iterate on calibration without bothering the user.

Usage:
    python scripts/screenshot.py [BASE_URL] [SLIDE_NOS...]
    # default: base http://localhost:3031 slides 1 2 3 4 5 6 9 17 25
"""
import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright

DEFAULT_BASE = "http://localhost:3030"
DEFAULT_SLIDES = [1, 2, 3, 4, 5, 6, 7, 9, 17, 25]
WIDTH, HEIGHT = 3840, 2160
OUT_DIR = Path("/tmp/sceptics-shots")


async def shoot(base: str, slides: list[int]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={"width": WIDTH, "height": HEIGHT},
            device_scale_factor=1,
        )
        for n in slides:
            page = await context.new_page()
            url = f"{base}/#/{n}"
            print(f"-> {url}")
            await page.goto(url, wait_until="networkidle", timeout=20000)
            await page.wait_for_timeout(1200)  # let animations settle
            out = OUT_DIR / f"slide-{n:02d}.png"
            await page.screenshot(path=str(out), full_page=False)
            print(f"   saved {out} ({out.stat().st_size//1024} KB)")
            await page.close()
        await browser.close()


if __name__ == "__main__":
    args = sys.argv[1:]
    base = DEFAULT_BASE
    slides = DEFAULT_SLIDES
    if args:
        if args[0].startswith("http"):
            base = args[0]
            args = args[1:]
        if args:
            slides = [int(s) for s in args]
    asyncio.run(shoot(base, slides))
