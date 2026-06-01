---
name: technijian-report
description: Generate brand-compliant Technijian reports as DOCX files. Use when creating IT assessment reports, quarterly business reviews (QBRs), security audit reports, compliance reports, or any structured multi-page report for Technijian clients.
---

# Technijian Report Generator

## Overview

Generates Technijian-branded reports as DOCX files. All output follows the Technijian Brand Guide 2026 with correct colors, typography, tables, and professional formatting.

**Keywords**: report, quarterly business review, QBR, IT assessment, security audit, compliance report, technijian, docx

## Prerequisites

```bash
npm install docx
```

## DOCX Build Safety (must-follow)

These two gotchas silently produce files Word refuses to open — bake them into every build:

1. **SPREAD helper functions into `children`.** When a helper returns an array of paragraphs/tables (e.g. `sectionHeader()`, `numberedSteps()`, `metricCards()`), splat it: `children: [ ...sectionHeader("Findings"), ...riskTable(rows) ]`. Pushing the function or array un-spread makes docx emit an invalid `<0/>` token and Word won't open the document.
2. **Validate the XML after every build.** Unzip the `.docx` and confirm `word/document.xml` is well-formed and contains no `<0/>` token before declaring the report done. A clean build that won't open is not done.

## DOCX -> PDF Conversion

When a PDF is also required, convert via **docx2pdf**: `py -3.12 docx-to-pdf.py`.

- Convert files **sequentially, never in parallel** — Word COM wedges under concurrent conversions.
- If conversion locks up, clear `Normal.dotm` (a corrupt/locked global template is the usual culprit) and retry.

## Brand Colors (no # prefix in docx-js)

**Source of truth:** `assets/brand-tokens.json` holds the canonical brand values (colors, tagline, contact, logos). Read/sync from it at build time. The constants below are a cached convenience for docx-js (which needs hex without the `#`) — if they ever disagree with brand-tokens.json, brand-tokens.json wins.

```javascript
const CORE_BLUE = "006DB6";
const CORE_ORANGE = "F67D4B";
const TEAL = "1EAAC8";
const DARK_CHARCOAL = "1A1A2E";
const BRAND_GREY = "59595B";
const OFF_WHITE = "F8F9FA";
const WHITE = "FFFFFF";
const LIGHT_GREY = "E9ECEF";
```

## Report Types

### 1. IT Assessment Report

**Use when**: Delivering findings from an infrastructure or security assessment.

**Structure** (always follow this order):
1. Cover page - Report title, client name, assessment date, "CONFIDENTIAL" notice
2. Table of Contents
3. Executive Summary - 2-3 paragraphs summarizing key findings and recommendations
4. Assessment Scope - What was evaluated (network, endpoints, cloud, compliance posture)
5. Findings - Organized by category with severity ratings (Critical/High/Medium/Low)
6. Risk Matrix - Table with Finding, Severity, Impact, Recommendation columns
7. Recommendations - Prioritized action items with timeline (Immediate/30-day/90-day)
8. About Technijian - Short boilerplate + contact info
9. Appendix - Technical details, scan results, or evidence (if applicable)

### 2. Quarterly Business Review (QBR)

**Use when**: Presenting quarterly performance metrics to an existing client.

**Structure**:
1. Cover page - "[Client Name] Quarterly Business Review", quarter/year, Technijian logo
2. Executive Summary - 3-4 bullet highlights of the quarter
3. Service Performance - Uptime %, tickets resolved, response time averages
4. Ticket Analysis - Table or summary of ticket categories, trends, and resolution times
5. Security Overview - Threats blocked, patches applied, vulnerabilities remediated
6. Projects Completed - Summary of any project work delivered during the quarter
7. Recommendations - Suggested improvements, upgrades, or services for next quarter
8. Next Quarter Outlook - Planned work, upcoming renewals, strategic initiatives

### 3. Security Audit Report

**Use when**: Documenting security posture findings for a client.

**Structure**:
1. Cover page - "Security Audit Report", client name, audit period
2. Executive Summary - Overall security score/rating, top 3 findings
3. Methodology - Standards referenced (NIST, CIS, HIPAA, PCI if applicable)
4. Findings by Category:
   - Network Security
   - Endpoint Protection
   - Identity & Access Management
   - Data Protection
   - Backup & Disaster Recovery
5. Compliance Status - Table of control areas with Pass/Fail/Partial status
6. Risk Register - Finding, Risk Level, Current State, Recommended State
7. Remediation Roadmap - Prioritized actions with effort estimates
8. Appendix - Technical evidence

### 4. Compliance Report

**Use when**: Documenting compliance posture for HIPAA, PCI, SOC 2, or GDPR.

**Structure**:
1. Cover page - "[Framework] Compliance Assessment", client name, date
2. Executive Summary - Compliance readiness score, key gaps
3. Framework Overview - Brief description of the compliance framework
4. Control Assessment - Table with Control ID, Description, Status, Evidence, Gap
5. Gap Analysis - Detailed findings for each non-compliant control
6. Remediation Plan - Prioritized actions to close gaps
7. Timeline & Investment - Estimated effort and cost for remediation
8. About Technijian

## Brand Formatting Rules

### Typography

```javascript
// Heading styles for docx-js
{ id: "Heading1", run: { size: 36, bold: true, font: "Open Sans", color: CORE_BLUE },
  paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } }
{ id: "Heading2", run: { size: 30, bold: true, font: "Open Sans", color: CORE_BLUE },
  paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } }
{ id: "Heading3", run: { size: 26, bold: true, font: "Open Sans", color: DARK_CHARCOAL },
  paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } }
// Default body: Open Sans, size 24 (12pt), color BRAND_GREY
```

### Tables

- **Header row**: Core Blue background, white bold text
- **Data rows**: Alternating white / off-white (`F8F9FA`)
- **Borders**: 1px `E9ECEF`
- **Cell margins**: top/bottom 80, left/right 120

### Severity/Status Indicators

Use colored text or cell shading to indicate severity:

| Level | Color | Use |
|-------|-------|-----|
| Critical | `CC0000` (red) | Critical security findings |
| High | `F67D4B` (Core Orange) | High-priority items |
| Medium | `1EAAC8` (Teal) | Medium-priority items |
| Low | `59595B` (Brand Grey) | Low-priority or informational |
| Pass | `28A745` (green) | Compliance controls met |
| Fail | `CC0000` (red) | Compliance controls not met |
| Partial | `F67D4B` (Core Orange) | Partially compliant |

### Metric Callouts

For key statistics (uptime, ticket counts, response times), use a large number format:
- Number: Core Blue, Bold, 28pt
- Label: Brand Grey, Regular, 12pt
- Place in a table cell with Off White background for visual emphasis

### Header/Footer

- **Header**: Full-color logo (left-aligned, 160px wide), blue underline
- **Footer**: "Technijian | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8499 | technijian.com" + page number, centered, grey text
  - Use the MAIN switchboard **949.379.8499** for any contact/CTA line (reaches USA + India). 949.379.8500 is Sales-direct ONLY and 949.379.8501 is Billing-direct ONLY — do not put those on a general report footer.
  - **Tagline:** the only approved tagline is **"technology as a solution"** (lowercase, no period). The old "Technology Support, Your Way." is RETIRED — never use it. Place the tagline under the logo on the cover and/or in the footer.
  - **Two offices:** Irvine HQ (18 Technology Dr., Ste 141, Irvine, CA 92618) is the default report address; Technijian also operates a **Panchkula, India delivery center** — include the India office in the About/contact block (or footer) when the engagement calls for showing the global footprint.

### Page Setup

```javascript
page: {
  size: { width: 12240, height: 15840 }, // US Letter
  margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
}
```

## Voice Rules for Reports

1. **Lead with findings and data**, not methodology
2. **Use specific numbers** — "97.2% uptime" not "high uptime"
3. **Severity language must be precise** — Critical means business-stopping, not just important
4. **Never guarantee compliance** — say "supports your compliance posture" or "addresses control requirements"
5. **Recommendations should be actionable** — include who, what, and when
6. **Professional and objective tone** — reports are reference documents, not sales pitches
7. **Use tables for structured data** — avoid long prose paragraphs for findings
8. **Include "Next Steps" or "Recommendations"** — every report should end with clear actions
9. **Mark confidential documents** — include "CONFIDENTIAL" on cover page and footer where appropriate
10. **Date everything** — assessment period, report date, and recommendation timelines
11. **No fabricated proof** — never invent metrics, case-study outcomes, customer quotes, or stats. If a number isn't measured, flag it as an estimate "to be confirmed at discovery." The service is launching, so cite anonymized industry profiles (scope + effort only), not named client outcomes.
12. **Frame not-yet-built capability as a dated near-term build** — never describe a planned capability as already delivered.

## Recommendation, Pricing & ROI Sections (when the report proposes work)

QBRs, assessment recommendations, remediation roadmaps, and blueprint-style reports often recommend paid work. When they do, apply these rules so the report converts without overselling:

- **Pricing from the real rate card.** Ground every estimate in the actual 2026 rate card — never invent numbers. Present a **blended US-led rate**; do NOT expose the offshore/India cost basis on a client-facing page.
- **ROI as a range, never a sub-1x lead optic.** Show very-conservative floor / likely / upside. Relabel the floor **"Downside-Protected"** and lead the prose and any callout with the **expected (~likely)** case — never anchor the reader on a below-1x floor.
- **Split the ask.** Separate a small, priced **"easy yes"** track (e.g. the free or low-cost first step) from the strategic later track, bracketed separately so the approver knows exactly what they're signing off on.
- **One dated, in-document CTA + explicit risk-reversal.** Put a single dated call-to-action and a clear risk-reversal in the document itself; never "use the Book-a-Meeting button in my signature."
- **Right-size comparison anchors.** An inflated vendor-stack or savings number REDUCES credibility — keep anchors realistic.
- **Quantify the cost of inaction** and **proactively rebut the known prior objection** rather than waiting for it.
- **Channel/referral economics (only if the report covers partnerships):** a client/channel REFERRAL pays the partner a MAX of **10% of the GROSS MONTHLY SERVICE INVOICE** only (not hardware, not one-time fees); the alternative is a RESALE markup the partner sets. Never write "10-20%" or an open-ended ongoing %.

### Quick-win on-ramp (CTA)

The lowest-friction first step / CTA is a free **"Nexus Assess"** assessment (Network Detective: internal + external vulnerability scan + M365 review). Use it as the "easy yes" track and the on-ramp to deeper engagements.

### Forwardable Concept Brief (companion artifact)

For a long report or blueprint, also produce a **1-page Concept Brief** an executive can forward: a self-contained HTML page rendered to a **single Letter page via Playwright**. It distills the recommendation, the expected-case ROI, the dated CTA, and the Nexus Assess on-ramp into one shareable page.

## Visual Design Elements

Reports must look professional and polished, not like formatted text files. Use these docx-js table-based techniques to create visual elements:

### Colored Section Headers with Left Bar Accent

Use a 2-column borderless table: thin colored cell (120 DXA) + content cell. This creates a bold visual section break.

```javascript
new Table({
  columnWidths: [120, 9240],
  rows: [new TableRow({
    children: [
      new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({})] }),
      new TableCell({ borders: noBorders, margins: { top: 80, bottom: 80, left: 160, right: 0 },
        children: [new Paragraph({ children: [new TextRun({ text: "SECTION TITLE", size: 32, bold: true, color: CORE_BLUE })] })] })
    ]
  })]
});
```

### Metric Callout Cards (KPIs)

Display key metrics (uptime, tickets, response time) as large-number cards in a row. Use a multi-column borderless table with Off White background cells.

```javascript
// Each card: big number (52pt, bold, blue) + label (16pt, grey) centered in an Off White cell
new TableCell({
  shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders,
  children: [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "99.5%", size: 52, bold: true, color: CORE_BLUE })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Uptime", size: 16, color: BRAND_GREY })] }),
  ]
});
```

### Callout / Dashboard Boxes

Wrap findings, summaries, or security dashboards in a bordered table with accent color on the left border and light background shading.

### Full-Width Color Banners

Use single-cell tables with colored shading for cover page accents, CTA bars, or section dividers. Place blue accent bar at top and orange at bottom of cover pages.

### Status-Colored Tables

In findings and compliance tables, use colored TextRun for severity/status values:
- Critical/Fail: `CC0000` red bold
- High/Partial: `F67D4B` orange bold
- Medium: `1EAAC8` teal bold
- Low/Pass: `28A745` green bold

### Cover Page Design

Every report cover page should include:
1. Blue accent bar at top (full-width colored table cell, 8px height)
2. Centered logo with generous top spacing
3. Orange divider line (centered via 3-column table: spacer | orange-bordered cell | spacer)
4. Title in Dark Charcoal, 52pt bold
5. Client name and date
6. Orange accent bar at bottom
7. "CONFIDENTIAL" notice below

## Verify Before Done (mandatory)

A report is not done until it has been visually proofread, not just generated:

1. Render **every page** of the final PDF to an image and view each at display size — catch overflow, clipped tables, stranded captions, and short/half-empty pages.
2. Use a **body-region fill metric** (header/footer excluded) to flag pages that are mostly whitespace or where content silently clipped — page-height passing is not enough; check the content region itself.
3. Confirm the cover, TOC page numbers, tables, and metric callouts all render correctly. Iterate until professional. Never declare done unverified.

## Logo Path

Use the REAL logos, centered (full-color on light backgrounds, reverse-white on dark backgrounds). Paths and the canonical color/contact values live in `assets/brand-tokens.json` — read from it rather than hardcoding.

Full-color logo for report headers (light background):
```
assets/logos/png/technijian-logo-full-color-600x125.png
```

## Related Skills

- **technijian-brand** — Master brand reference (colors, typography, voice, UI specs). Consult for any values not covered here.
