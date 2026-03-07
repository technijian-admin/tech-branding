---
name: technijian-proposal
description: Generate brand-compliant Technijian IT services proposals, one-pagers, and case studies as DOCX files. Use when creating sales documents, service proposals, client-facing one-pagers, or case study write-ups for Technijian.
---

# Technijian Proposal & Document Generator

## Overview

Generates Technijian-branded sales documents including proposals, one-pagers, and case studies. All output follows the Technijian Brand Guide 2026 with correct colors, typography, and voice.

**Keywords**: proposal, one-pager, case study, sales document, client document, technijian, docx, word

## Prerequisites

```bash
npm install -g docx
```

## Document Types

### 1. IT Services Proposal

**Use when**: Preparing a formal proposal for a prospective or existing client.

**Structure** (always follow this order):
1. Cover page - Title, client name, date, confidential notice
2. Table of Contents
3. Executive Summary - 2-3 paragraphs, lead with client's challenge
4. Scope of Services - Bullet list organized by service pillar
5. Service Level Agreement - Response times, uptime, support hours
6. Investment & Pricing - Table with Service, Description, Monthly Cost
7. About Technijian - Use the long boilerplate (100 words) + "Why Technijian" bullets
8. Next Steps - Numbered list of what happens next

### 2. Service One-Pager

**Use when**: Creating a single-page overview of a specific service offering.

**Structure**:
1. Service name as title (Core Blue, 36pt)
2. The Challenge - Client pain point (2-3 sentences)
3. Our Solution - What Technijian does + 4 bullet capabilities
4. Key Benefits - 3-column table (Proactive Protection, Cost Predictability, Expert Team)
5. Why Technijian - 4 differentiator bullets
6. CTA with contact info

### 3. Case Study

**Use when**: Documenting a client success story.

**Structure** (2 pages):
1. Label "CASE STUDY" in Teal, title with client/industry
2. Quick stats table (Industry, Company Size, Services)
3. The Challenge - What problems existed before Technijian
4. The Solution - What was implemented (specific technologies)
5. The Results - Metrics table (uptime, response time, cost, security)
6. Client Testimonial - Pull quote with orange left border
7. CTA

## Brand Formatting Rules

### Colors (no # prefix in docx-js)

```javascript
const CORE_BLUE = "006DB6";
const CORE_ORANGE = "F67D4B";
const DARK_CHARCOAL = "1A1A2E";
const BRAND_GREY = "59595B";
const OFF_WHITE = "F8F9FA";
const WHITE = "FFFFFF";
const LIGHT_GREY = "E9ECEF";
const TEAL = "1EAAC8";
```

### Typography

```javascript
// Heading styles for docx-js
{ id: "Heading1", run: { size: 36, bold: true, font: "Open Sans", color: CORE_BLUE },
  paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } }
{ id: "Heading2", run: { size: 30, bold: true, font: "Open Sans", color: CORE_BLUE },
  paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } }
// Default body: Open Sans, size 24 (12pt), color BRAND_GREY
```

### Tables

- **Header row**: Core Blue background, white bold text
- **Data rows**: Alternating white / off-white (`F8F9FA`)
- **Borders**: 1px `E9ECEF`
- **Cell margins**: top/bottom 80, left/right 120
- **Total row**: Dark Charcoal background, Core Orange for amount

### Header/Footer

- **Header**: Full-color logo (left-aligned, 160px wide), blue underline
- **Footer**: "Technijian | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8500 | technijian.com" + page number, centered, grey text

### Page Setup

```javascript
page: {
  size: { width: 12240, height: 15840 }, // US Letter
  margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
}
```

## Voice Rules for Proposals

1. **Lead with the client's challenge**, not Technijian's capabilities
2. **Be specific** about services, technologies, and outcomes
3. **Use "investment"** not "cost" when discussing pricing
4. **Reference the pod model** when describing ongoing support
5. **Never guarantee compliance** - say "help you navigate" or "support your compliance posture"
6. **Transparent pricing** - no hidden fees, clear scope definitions
7. **Professional but warm** - mirror the "no surprises" promise
8. **Include specific SLA commitments** - response times, uptime guarantees
9. **Avoid jargon** unless the audience is technical
10. **End with clear next steps** - make it easy for the client to say yes

## Visual Design Elements

Proposals must look like premium sales documents, not text files. Use these docx-js table-based techniques:

### Cover Page Design

Every proposal cover page should include:
1. Blue accent bar at top (full-width colored table cell)
2. Centered logo with generous top spacing
3. Orange divider line (centered via 3-column table)
4. Title in Dark Charcoal, 52pt bold
5. "Prepared for [Client Name]" subtitle
6. Date and confidential notice
7. Orange accent bar at bottom

### Section Headers with Left Bar Accent

Use a 2-column borderless table: thin Core Blue cell (120 DXA) + content cell. This creates bold visual section breaks that look designed, not typed.

### Pricing Table with Visual Polish

- Blue header row with white bold text
- Alternating Off White / White data rows
- Total row with Dark Charcoal background, Core Orange for the amount
- Always use DXA widths, never percentages

### Key Benefits Cards

For one-pagers and proposals, display benefits as a 3-column card layout: blue header cell per column + Off White content cell below. Each column highlights one benefit.

### Case Study Pull Quotes

Use a 2-column borderless table: thin Core Orange cell (80 DXA) + content cell with italicized quote text and attribution. Creates a professional testimonial callout.

### Metric Callout Cards

For case studies and proposals with stats, use large-number cards: big number (52pt, bold, Core Blue) centered on Off White background with label below. Display 3-4 in a row.

### CTA Banner

End documents with a full-width Core Blue banner containing contact information in white text.

## Logo Path

Use the full-color logo for document headers:
```
assets/logos/png/technijian-logo-full-color-600x125.png
```

## Related Skills

- **technijian-brand** — Master brand reference (colors, typography, voice, UI specs). Consult for any values not covered here.
