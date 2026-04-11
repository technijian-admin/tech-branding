---
name: technijian-brochure
description: Generate brand-compliant Technijian multi-page service brochures as PDF via HTML. Use when creating marketing brochures, product brochures, or service overviews that span multiple pages (typically 6-8 pages). Produces a polished, print-ready PDF with the full Technijian brand identity.
---

# Technijian Service Brochure Generator

## Overview

Generates pixel-perfect, multi-page Technijian-branded service brochures as PDF files. The workflow is: design multi-page HTML source → render to PDF via Playwright → take verification screenshots of each page → iterate until professional.

**Keywords**: brochure, multi-page, marketing, product brochure, service brochure, technijian, pdf

## Pipeline

```
1. Design HTML (assets/[Service Name] Brochure.html)
   - Each page is a <section class="page"> with fixed 8.5in x 11in dimensions
   - CSS page-break-after: always between sections
2. Render PDF via Playwright (assets/generate_pdfs.py)
3. Take verification screenshots of each page
4. Review screenshots — iterate if needed
5. Final PDF goes to service root: Services/[Service Name]/[Service Name] Brochure.pdf
```

## Folder Structure

Same as technijian-datasheet skill:
```
Services/[Service Name]/
├── [Service Name] Brochure.pdf           ← FINAL OUTPUT (root)
└── assets/
    ├── [Service Name] Brochure.html      ← HTML source
    ├── generate_pdfs.py                  ← Playwright HTML→PDF converter
    ├── _verify_brochure_pg*.png          ← QA screenshots per page
    └── graphics/                         ← Optional diagrams/images
```

## Brand Colors

Same palette as technijian-datasheet:
```css
--blue: #006DB6;  --orange: #F67D4B;  --teal: #1EAAC8;
--chartreuse: #CBDB2D;  --dark: #1A1A2E;  --near-black: #2D2D2D;
--grey: #59595B;  --light-grey: #E9ECEF;  --off-white: #F8F9FA;
```

## Typography

Same as technijian-datasheet: Plus Jakarta Sans (display) + DM Sans (body).

## Multi-Page HTML Structure

```html
<body>
  <!-- Each page is a fixed-size section -->
  <section class="page"><!-- Page 1: Cover --></section>
  <section class="page"><!-- Page 2: Challenge --></section>
  <section class="page"><!-- Page 3: Services --></section>
  <section class="page"><!-- Page 4: Case Studies --></section>
  <section class="page"><!-- Page 5: Engagement --></section>
  <section class="page"><!-- Page 6: CTA + Back --></section>
</body>
```

```css
@page { size: letter; margin: 0; }
.page {
  width: 8.5in;
  height: 11in;
  position: relative;
  overflow: hidden;
  page-break-after: always;
}
.page:last-child { page-break-after: auto; }
```

## Standard Brochure Page Types (6-8 pages)

### Page 1: Cover (Dark)
- Full dark gradient background with decorative glows
- Badge pill (teal border, uppercase, small)
- Large product title: white + orange accent
- Subtitle and tagline (reduced opacity)
- Accent line (orange/teal/blue thirds)
- 4 stat cards at bottom: large orange numbers + grey labels
- Footer bar

### Page 2: The Challenge (Light)
- Light/off-white background
- Title: "The [Topic]" + orange "Challenge" accent
- Introduction paragraph
- 4 pain point cards (2x2 grid): white cards with left colored accent bar
- Dark strip at bottom: "Why [Topic] Now?" with bullet reasons

### Page 3: Our Services / Solution (White)
- White background
- Title: "[Service]" + orange "Services" accent
- 4 service pillar cards (2x2 grid): off-white cards with colored top accent bar
- Each card: title, 5-6 checkmark items
- Dark strip at bottom: "How We Engage" with numbered steps + arrows

### Page 4: Proven Results / Case Studies (White)
- White background
- Title: "Proven" + orange "Results"
- 5 case study cards (stacked): off-white/white alternating
- Each card: tag badge, title, description, 3 metric pills

### Page 5: Engagement Models + Industries (White + Dark)
- White top: 4 engagement model cards (2x2 grid)
- Each card: colored top bar, title, description, checkmark items, "Best for:" line
- Dark bottom strip: "Industries We Serve" with colored pill badges (2x4 grid)

### Page 6: CTA + Back Cover (Blue + Dark)
- Blue top half: large CTA heading, two buttons (solid orange + outlined white), contact info
- Dark bottom half: accent line, "What You Get" bullet list, company name + tagline
- Footer bar

## Dark vs Light Page Alternation

Mix dark and light pages to create visual rhythm:
- Page 1: DARK (cover)
- Page 2: LIGHT (challenge)
- Page 3: WHITE top + DARK strip bottom
- Page 4: WHITE (results)
- Page 5: WHITE top + DARK strip bottom
- Page 6: BLUE top + DARK bottom

## Card Design Patterns

### Pain Point Card
```css
.card {
  background: white;
  border-radius: 6px;
  padding: 16px;
  position: relative;
}
.card::before { /* Left accent bar */
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 5px; border-radius: 3px;
  background: var(--blue); /* Rotate colors */
}
```

### Service Pillar Card
```css
.pillar {
  background: var(--off-white);
  border-radius: 6px;
  position: relative;
}
.pillar::before { /* Top accent bar */
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 4px;
  background: var(--blue); /* Rotate colors */
}
```

### Case Study Card
```css
.case {
  background: var(--off-white);
  border-radius: 6px;
  border-left: 5px solid var(--blue);
}
.case .tag { /* Category badge */
  display: inline-block;
  padding: 2px 8px;
  border-radius: 7px;
  background: rgba(0,109,182,0.1);
  font-size: 7px; font-weight: 700;
  color: var(--blue);
}
.case .metric-pill {
  background: rgba(0,109,182,0.08);
  border-radius: 4px;
  text-align: center;
}
```

## Verification Workflow

After generating the PDF, ALWAYS:
1. Take screenshots of EACH page (crop to page boundaries)
2. Read each screenshot image to visually verify
3. Check for: text overflow, clipping, alignment, readability, visual hierarchy
4. Check dark pages for contrast and legibility
5. Check card spacing and grid alignment
6. If issues found, edit the HTML and regenerate
7. Only declare complete when ALL pages are visually verified as professional

## PDF Generation

Same generate_pdfs.py as datasheet skill — Playwright renders HTML to PDF with zero margins, Letter format, background colors enabled.

## Related Skills

- **technijian-brand** — Master brand reference
- **technijian-datasheet** — Single-page datasheet generator (same pipeline)
