---
name: technijian-presentation
description: Generate brand-compliant Technijian PowerPoint presentations using pptxgenjs. Use when creating slide decks, pitch presentations, client presentations, or internal presentations for Technijian.
---

# Technijian Presentation Generator

## Overview

Generates Technijian-branded PowerPoint presentations. All slides follow the Technijian Brand Guide 2026 with the correct dark/light "sandwich" pattern, brand colors, and typography.

**Keywords**: presentation, slides, powerpoint, pptx, pitch deck, client presentation, technijian

## Prerequisites

```bash
npm install pptxgenjs
```

## Brand Colors (no # prefix)

```javascript
const CORE_ORANGE = "F67D4B";
const CORE_BLUE = "006DB6";
const TEAL = "1EAAC8";
const DARK_CHARCOAL = "1A1A2E";
const BRAND_GREY = "59595B";
const OFF_WHITE = "F8F9FA";
const WHITE = "FFFFFF";
const LIGHT_GREY = "E9ECEF";
```

## Slide Layouts

Every presentation MUST use these approved layouts. Never create plain white slides with bullets only.

### 1. Title Slide (always first)
- **Background**: Dark Charcoal `1A1A2E`
- **Logo**: White/reverse version, top-left, 2.4" wide
- **Title**: White, Open Sans Bold, 40pt
- **Subtitle**: Light Grey `E9ECEF`, Open Sans Regular, 18pt
- **Accent**: Orange line at bottom (full width, 0.08" tall)
- **Tagline**: Teal, right-aligned, "technology as a solution" with letter-spacing

### 2. Section Divider
- **Background**: Core Blue `006DB6`
- **Section number**: White, 60pt, 30% transparent
- **Title**: White, Open Sans Bold, 36pt, centered
- **Divider**: White line, centered, 3" wide, 50% transparent
- **Description**: White, 16pt, centered, 20% transparent
- **Logo**: White version, bottom-left, small

### 3. Content Slide
- **Background**: White
- **Header bar**: Core Blue, full width, 0.9" tall with white logo
- **Title**: Core Blue, Open Sans Bold, 28pt
- **Body**: Brand Grey, Open Sans Regular, 15pt, line-spacing 1.4x
- **Footer**: Light grey line + "technijian.com" in grey, 9pt

### 4. Two-Column Layout
- Same header as Content Slide
- **Two columns**: Off White `F8F9FA` background, 4.2" wide each
- **Column titles**: Core Blue, Semi-Bold, 18pt
- **Column body**: Brand Grey, 14pt

### 5. Image + Text
- Same header as Content Slide
- **Left**: Image placeholder (4.4" x 4.1", dashed border)
- **Right**: Title in Core Blue 24pt + orange accent bar + body text

### 6. Quote/Testimonial
- **Background**: Off White `F8F9FA`
- **Large quote mark**: Core Blue, Georgia 120pt, 30% transparent
- **Quote text**: Dark Charcoal, Open Sans Italic, 22pt
- **Attribution**: Orange accent line + Name (bold 14pt) + Title (grey 12pt)
- **Logo**: Full-color, bottom-right

### 7. Closing/CTA (always last)
- **Background**: Dark Charcoal `1A1A2E`
- **Logo**: White/reverse, centered, 4" wide
- **Heading**: White, 40pt, "Let's Talk"
- **CTA button**: Orange rectangle, white text "949.379.8500"
- **Contact**: Teal text for email/website, grey for address

## Slide Design Rules

1. **Dark-light sandwich**: Title and closing slides are dark; content slides are light
2. **Never use plain bullets on white** - always have a header bar, column layout, or visual element
3. **Maximum 6 lines of body text per slide**
4. **One idea per slide** - if it needs more, use two slides
5. **Include visuals** - every content slide should have an icon, image, or data callout
6. **Core Orange for CTAs only** - don't overuse orange
7. **Core Blue for headings and header bars**
8. **Always include the logo** - white version on dark slides, full-color on light
9. **Use the 8px spacing scale** - standard gaps of 0.3" or 0.5"
10. **Font: Open Sans only** - Bold for titles, Regular for body

## Common Pitfalls

- NEVER use `#` prefix for colors in pptxgenjs (corrupts file)
- NEVER reuse option objects between calls (pptxgenjs mutates them)
- NEVER use unicode bullets - use `bullet: true`
- ALWAYS use `breakLine: true` between text array items
- Use `paraSpaceAfter` instead of `lineSpacing` with bullets
- Use `margin: 0` on text boxes when aligning with shapes

## Logo Paths

```
// White/reverse for dark backgrounds:
assets/logos/png/technijian-logo-reverse-white-5000x1667.png

// Full-color for light backgrounds:
assets/logos/png/technijian-logo-full-color-1200x251.png
```

## Related Skills

- **technijian-brand** — Master brand reference (colors, typography, voice, UI specs). Consult for any values not covered here.
