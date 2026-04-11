---
name: technijian-datasheet
description: Generate brand-compliant Technijian service datasheets (one-pagers) as PDF via HTML. Use when creating a one-page marketing datasheet, product overview, or service summary for any Technijian service (e.g., My AI, Nexus Assess, Chat.AI). Produces a single US Letter page PDF with the full Technijian brand identity.
---

# Technijian Service Datasheet (One-Pager) Generator

## Overview

Generates pixel-perfect, single-page Technijian-branded service datasheets as PDF files. The workflow is: design HTML source → render to PDF via Playwright → take verification screenshots → iterate until professional.

**Keywords**: datasheet, one-pager, product sheet, service overview, marketing, technijian, pdf

## Pipeline

```
1. Design HTML (assets/[Service Name] One-Pager.html)
2. Render PDF via Playwright (assets/generate_pdfs.py)
3. Take verification screenshots
4. Review screenshots — iterate if needed
5. Final PDF goes to service root: Services/[Service Name]/[Service Name] One-Pager.pdf
```

## Folder Structure

```
Services/[Service Name]/
├── [Service Name] One-Pager.pdf          ← FINAL OUTPUT (root)
├── [Service Name] Brochure.pdf           ← FINAL OUTPUT (root)
└── assets/
    ├── [Service Name] One-Pager.html     ← HTML source
    ├── generate_pdfs.py                  ← Playwright HTML→PDF converter
    ├── _verify_onepager.png              ← QA screenshot
    └── graphics/                         ← Optional diagrams/images
```

**Rule**: Only final deliverable PDFs go in the service root. All source files, scripts, screenshots, and intermediary assets go in `assets/`.

## Brand Colors

```css
--blue: #006DB6;        /* Primary brand, section headers, CTAs */
--orange: #F67D4B;      /* Primary accent, stats, attention */
--teal: #1EAAC8;        /* Secondary accent, checkmarks, badges */
--chartreuse: #CBDB2D;  /* ROI/savings highlights */
--dark: #1A1A2E;        /* Dark backgrounds, hero sections */
--near-black: #2D2D2D;  /* Footer background */
--grey: #59595B;        /* Body text */
--light-grey: #E9ECEF;  /* Borders, dividers */
--off-white: #F8F9FA;   /* Card backgrounds, alternating rows */
```

## Typography

**Primary**: Plus Jakarta Sans (display/headings), DM Sans (body text)
**Fallback**: Helvetica, sans-serif
**Load via Google Fonts**:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

## Page Layout (US Letter: 8.5in x 11in)

```
┌─────────────────────────────────────────┐
│  HERO STRIP (~88px)                     │  Dark gradient background
│  Product name + badge + stats           │  Decorative radial glows
├─────────────────────────────────────────┤
│  ACCENT LINE (3px)                      │  Orange → Teal → Blue thirds
├─────────────────────────────────────────┤
│  VALUE PROP BAR (~24px)                 │  Blue background, white text
├──────────────────┬──────────────────────┤
│  LEFT COLUMN     │  RIGHT COLUMN        │  Two equal columns
│  • Capabilities  │  • Differentiators   │  Content-dense, compact type
│  • How It Works  │  • Engagement Models │  7-10px font sizes
│  • Case Studies  │  • Industries        │
│                  │  • Tech Stack        │
│                  │  • ROI Cards         │
├──────────────────┴──────────────────────┤
│  CTA BAR (~26px)                        │  Blue gradient, white text
├─────────────────────────────────────────┤
│  FOOTER (~26px)                         │  Near-black, small grey text
└─────────────────────────────────────────┘
```

## Section Component Patterns

### Hero Strip
- Dark gradient background (`linear-gradient(135deg, #1A1A2E, #0D1B3E, #0a2448)`)
- Decorative radial glows: teal (top-right, 0.08 opacity), orange (bottom-left, 0.06 opacity)
- Product title: large bold white + orange accent word
- Tagline: small white text, 0.55 opacity
- Badge pill: teal border + teal fill (0.1 opacity), rounded, uppercase 6.5px
- Hero stats: right-aligned, orange numbers (20px bold), grey labels (6px uppercase), vertical separators

### Section Headers
- Blue uppercase text (10px, 800 weight, 0.8px letter spacing)
- Bottom border: 1.5px light grey
- 8px bottom margin

### Capability Groups
- 3px colored left bar (blue/orange/teal/dark rotating)
- Bold 9px title
- Teal checkmark + 7.5-8px item text
- 4 groups of 4-5 items each

### Numbered Steps ("How We Engage")
- Orange circle (18px) with white number, box-shadow glow
- Bold title + em-dash + description text

### Projects/Case Studies Table
- Dark header row, alternating row backgrounds
- Project name (bold, dark) + description (grey) + result (teal, bold, right-aligned)

### Differentiators
- Colored dot (7px circle) + bold label + description text
- 7 items cycling through brand colors

### Engagement Model Cards
- Full-width colored rounded rectangles (dark/blue/teal/orange)
- White title + lighter description text

### ROI Cards
- Dark background with colored top accent bar (3px)
- Chartreuse value number (16px bold)
- Grey label + description text

### CTA Bar
- Blue gradient background with darker overlay on right 40%
- White bold centered text with orange accent on key phrase

### Footer
- Near-black background
- Small grey text: copyright, address, website

## Verification Workflow

After generating the PDF, ALWAYS:
1. Take a full-page screenshot of the PDF or HTML
2. Read the screenshot image to visually verify
3. Check for: text overflow, clipping, alignment, readability, color accuracy
4. If issues found, edit the HTML and regenerate
5. Only declare complete when visually verified as professional

## PDF Generation Script (generate_pdfs.py)

```python
"""HTML-to-PDF via Playwright"""
import os
from playwright.sync_api import sync_playwright

ASSETS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ASSETS, "..")

FILES = [
    {
        'html': os.path.join(ASSETS, '[Service] One-Pager.html'),
        'pdf': os.path.join(OUT_DIR, '[Service] One-Pager.pdf'),
    },
]

def build():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for f in FILES:
            if not os.path.exists(f['html']): continue
            page = browser.new_page()
            page.goto(f"file:///{f['html'].replace(os.sep, '/')}")
            page.wait_for_load_state('networkidle')
            page.pdf(path=f['pdf'], format='Letter', print_background=True,
                     margin={'top':'0','right':'0','bottom':'0','left':'0'})
            # Verification screenshot
            page.screenshot(path=f['html'].replace('.html','_verify.png'), full_page=True)
            print(f"  {os.path.basename(f['pdf'])} ({os.path.getsize(f['pdf'])/1024:.0f} KB)")
        browser.close()

if __name__ == '__main__':
    build()
```

## Related Skills

- **technijian-brand** — Master brand reference (colors, typography, voice)
- **technijian-brochure** — Multi-page brochure generator (same pipeline, multi-page HTML)
