---
name: technijian-letterhead
description: Generate brand-compliant Technijian letters and correspondence on company letterhead as DOCX files. Use when creating formal letters, client correspondence, cover letters, notices, or any official Technijian communication that requires letterhead.
---

# Technijian Letterhead & Correspondence Generator

## Overview

Generates Technijian-branded formal letters and correspondence as DOCX files on company letterhead. All output follows the Technijian Brand Guide 2026 with correct header, footer, colors, and professional formatting.

**Keywords**: letterhead, letter, correspondence, formal letter, cover letter, notice, official letter, technijian, docx

## Prerequisites

```bash
npm install docx
```

## Brand Colors (no # prefix in docx-js)

```javascript
const CORE_BLUE = "006DB6";
const CORE_ORANGE = "F67D4B";
const DARK_CHARCOAL = "1A1A2E";
const BRAND_GREY = "59595B";
const OFF_WHITE = "F8F9FA";
const WHITE = "FFFFFF";
const LIGHT_GREY = "E9ECEF";
```

## Letter Types

### 1. Standard Business Letter

**Use when**: General client correspondence, introductions, follow-ups.

**Structure**:
1. Letterhead header (logo + blue underline)
2. Date (right-aligned, Brand Grey)
3. Recipient block (Name, Title, Company, Address)
4. Salutation ("Dear [Name],")
5. Body paragraphs (1-4 paragraphs, 16px, Brand Grey)
6. Closing ("Sincerely," / "Best regards,")
7. Signature block (Name, Title, Contact)
8. Footer (address, phone, website)

### 2. Proposal Cover Letter

**Use when**: Accompanying a formal proposal or SOW.

**Structure**:
1. Letterhead header
2. Date
3. Recipient block
4. Salutation
5. Opening paragraph — Reference the proposal, express appreciation for the opportunity
6. Value paragraph — 2-3 key benefits of the proposed engagement
7. Next steps paragraph — What happens next, who to contact
8. Closing + signature block
9. "Enclosure: [Proposal Title]" notation
10. Footer

### 3. Service Notice / Change Notification

**Use when**: Informing clients of maintenance windows, service changes, or policy updates.

**Structure**:
1. Letterhead header
2. Date
3. "NOTICE:" or "IMPORTANT:" label in Core Blue, bold
4. Recipient ("Dear Valued Client," or specific name)
5. What is changing — Clear, direct statement
6. When — Specific dates and times
7. Impact — What the client should expect
8. Action required — What (if anything) the client needs to do
9. Contact info for questions
10. Closing + signature block
11. Footer

### 4. Welcome Letter

**Use when**: Onboarding a new client after contract signing.

**Structure**:
1. Letterhead header
2. Date
3. Recipient block
4. "Welcome to Technijian" heading (Core Blue, 18pt, bold)
5. Welcome paragraph — Express enthusiasm, confirm engagement start
6. Your Team paragraph — Introduce their assigned pod/team lead
7. What to Expect — Numbered list of onboarding steps
8. Key Contacts — Table with Name, Role, Email, Phone
9. Closing + signature block
10. Footer

## Letterhead Formatting

### Header

```
[Technijian Logo - 160px wide, left-aligned]
────────────────────────────────────────────── (2px Core Blue line)
```

- Logo: `assets/logos/png/technijian-logo-full-color-600x125.png`
- Blue line: Full page width, 2px, Core Blue `006DB6`
- Space below line: 24pt

### Footer

```
────────────────────────────────────────────── (1px Light Grey line)
Technijian | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8500 | technijian.com
```

- Line: 1px, Light Grey `E9ECEF`
- Text: 9pt, Brand Grey `59595B`, centered
- Page numbers: Right-aligned, 9pt, Brand Grey

### Typography

| Element | Font | Size | Color | Weight |
|---------|------|------|-------|--------|
| Date | Open Sans | 12pt (24) | Brand Grey `59595B` | Regular |
| Recipient | Open Sans | 12pt (24) | Dark Charcoal `1A1A2E` | Regular |
| Salutation | Open Sans | 12pt (24) | Dark Charcoal `1A1A2E` | Regular |
| Body text | Open Sans | 12pt (24) | Brand Grey `59595B` | Regular |
| Closing | Open Sans | 12pt (24) | Dark Charcoal `1A1A2E` | Regular |
| Sender name | Open Sans | 12pt (24) | Dark Charcoal `1A1A2E` | Bold |
| Sender title | Open Sans | 11pt (22) | Core Blue `006DB6` | Regular |
| Notice labels | Open Sans | 14pt (28) | Core Blue `006DB6` | Bold |

### Spacing

| Element | Spacing |
|---------|---------|
| After date | 360 (1.5 lines) |
| Between recipient lines | 0 (single-spaced block) |
| After recipient block | 240 (1 line) |
| Between body paragraphs | 200 |
| After closing | 600 (space for signature) |
| Between signature lines | 0 (single-spaced block) |

### Page Setup

```javascript
page: {
  size: { width: 12240, height: 15840 }, // US Letter
  margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
}
```

## Voice Rules for Letters

1. **Professional but warm** — Not stiff or legalistic; mirror the brand's "knowledgeable friend" tone
2. **Get to the point** — First paragraph states the purpose; details follow
3. **Use the recipient's name** — Personalize whenever possible
4. **Keep it concise** — Most letters should fit on one page
5. **End with a clear next step** — What should the recipient do, or what will Technijian do next
6. **Use "we" not "I"** — Letters represent the company
7. **Date format**: "March 7, 2026" (spell out month, no leading zeros)
8. **Never use ALL CAPS** except for "NOTICE:" or "CONFIDENTIAL" labels
9. **Signature block order**: Name (bold), Title (blue), then optional direct phone/email

## Visual Design Elements

Letterhead must look polished with professional header and footer design:

### Header Layout

Use a 2-column borderless table in the header:
- Left cell: Logo image (160px wide)
- Right cell: Right-aligned address on first line, phone + pipe separator + website (blue) on second line

Below this, add a thin orange accent bar using a single-cell table with Core Orange shading (4px height). This replaces a simple underline with a branded accent.

### Footer Layout

Use a thin Core Blue bar (2px height, full-width table cell) above the footer text. Footer text shows service pillars: "Technijian | Managed IT - Cybersecurity - Cloud - AI Development" centered in Brand Grey.

### Signature Block with Orange Accent

Use a 2-column borderless table: thin orange cell (80 DXA) + content cell containing sender name (bold, Dark Charcoal), title (Core Blue), company (Brand Grey), and contact info with pipe separators.

### Welcome Letter: Key Contacts Table

For welcome letters, use a branded table (blue header row, alternating white/off-white rows) for the pod team contact list.

### Notice Letters: Label Styling

For notices, use a single-cell table with Core Blue background and white text for the "NOTICE:" or "IMPORTANT:" banner.

## SVG Template Reference

A pre-designed letterhead SVG is available for visual reference or direct print use:
```
assets/print/templates/technijian-letterhead.svg
```

## Logo Path

```
assets/logos/png/technijian-logo-full-color-600x125.png
```

## Related Skills

- **technijian-brand** — Master brand reference (colors, typography, voice, UI specs). Consult for any values not covered here.
