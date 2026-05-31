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

> **Source of truth:** `assets/brand-tokens.json` is the single source of truth for every brand value. The hex values below are a cached convenience — read/sync from `brand-tokens.json` rather than trusting these literals, which can drift.

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
- **Footer**: "Technijian | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8499 | technijian.com" + page number, centered, grey text
  - Use the MAIN switchboard **949.379.8499** (reaches USA + India) for contact/CTA. 949.379.8500 is Sales-direct only; 949.379.8501 is Billing-direct only — use those two only when that specific desk is the intended recipient.
  - Technijian runs two offices: Irvine HQ (above) + a Panchkula, India delivery center.

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

## Pricing, ROI & Channel Economics

- **Ground every number in the real 2026 rate card** — never invent pricing. Flag any not-yet-confirmed figures as estimates "confirmed at discovery."
- **Do NOT expose the offshore/India cost basis** on a client-facing page. Present a single blended US-led rate.
- **Show ROI as a RANGE** — a downside-protected floor, a likely/expected case, and an upside. Never lead the reader with a sub-1x floor optic: relabel the floor "Downside-Protected" and lead the prose and any callout with the expected (~likely) case.
- **Channel/referral economics:** a REFERRAL pays the partner a MAX of 10% of the GROSS MONTHLY SERVICE INVOICE only (recurring services — NOT hardware, NOT one-time/project fees). The alternative is a RESALE markup the partner sets on top of our rate. Never write "10-20%" or any open-ended/"ongoing %" arrangement.

## Conversion Mechanics

Structure the ask so a champion can say yes:

- **Split the ask**: separate a small, priced "easy yes" track (low-risk first step) from the larger strategic track, bracketed separately so the approver knows exactly what they are signing off on now vs. later.
- **One dated, in-document CTA** with explicit risk-reversal. Put the date and the call to action in the proposal itself — never "use the Book-a-Meeting button in my signature."
- **Quick-win on-ramp**: offer the free **Nexus Assess** assessment (Network Detective — internal + external vulnerability scan + Microsoft 365 review) as the low-friction first step / CTA on-ramp.
- **Right-size the comparison anchors**: an inflated vendor-stack or savings number REDUCES credibility. Keep cost/savings comparisons defensible.
- **Proactively rebut the known prior objection** and **quantify the cost of inaction** so doing nothing has a visible price.
- Use real, anonymized case studies — scope and effort only. NO fabricated outcome metrics, quotes, or stats.

## Honesty Discipline

- The service is launching — there are NO completed client projects. Use anonymized industry profiles, not named clients (also applies to the Case Study document type above).
- Frame any not-yet-built capability as a dated NEAR-TERM BUILD, never as already delivered.
- No fabricated proof, metrics, case-study outcomes, quotes, or stats. Flag any soft figures as estimates "confirmed at discovery."

## Executive Concept Brief (companion artifact)

For longer proposals/SOWs, also produce a forwardable 1-page **concept brief** for executives: a self-contained HTML page rendered via Playwright to a single Letter page. It lets a champion forward the gist internally without sending the full document.

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

Use the REAL logo assets — never recreate or approximate the mark. Full-color logo on light backgrounds; reverse-white logo on dark backgrounds (e.g. the CTA banner). Center the logo on cover pages.
```
assets/logos/png/technijian-logo-full-color-600x125.png
```

## Tagline

The official tagline is **"technology as a solution"** (lowercase, no period). The old "Technology Support, Your Way." is RETIRED — never use it.

## Build Pipeline Gotchas

- **docx-js spread**: SPREAD helper functions into the `children` array (`...sectionHeader()`, `...numberedSteps()`). Calling them un-spread makes docx emit an invalid `<0/>` token and Word refuses to open the file. After every build, validate `word/document.xml` is well-formed (no `<0/>`).
- **DOCX -> PDF**: convert with docx2pdf (`py -3.12 docx-to-pdf.py`). Convert files SEQUENTIALLY, never in parallel — parallel Word COM wedges. If it locks up, clear `Normal.dotm`.
- **Diagrams** (HTML + Playwright PNG -> embed): auto-crop each PNG to its content plus a small uniform margin; DERIVE each figure's aspect ratio from the REAL PNG pixel dimensions — never hardcode an AR (it drifts and distorts/strands figures). For long y-axis labels, use a fixed-width bar rotated about its own center so the label cannot overflow the plot.

## Verification (before declaring done)

- Build the PDF/DOCX, then render EVERY page to an image and visually proofread at display size. Never declare done unverified.
- Use a body-region fill metric (header/footer excluded) to catch whitespace, short pages, and stranded captions — a page can pass a raw height check while content silently clips or strands.

## Related Skills

- **technijian-brand** — Master brand reference (colors, typography, voice, UI specs). Consult for any values not covered here.
