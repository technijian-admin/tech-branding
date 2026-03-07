---
name: technijian-legal
description: Generate brand-compliant Technijian legal agreements and contracts as DOCX files. Use when creating Master Services Agreements (MSAs), Statements of Work (SOWs), Non-Disclosure Agreements (NDAs), Service Level Agreements (SLAs), or Acceptable Use Policies for Technijian.
---

# Technijian Legal Agreement Generator

## Overview

Generates Technijian-branded legal agreements and contracts as DOCX files. All output follows the Technijian Brand Guide 2026 formatting with correct headers, footers, numbering, and professional legal structure.

**Keywords**: contract, agreement, MSA, SOW, NDA, SLA, legal, terms, acceptable use policy, technijian, docx

**Important**: Generated agreements are templates and starting points. All legal documents MUST be reviewed by qualified legal counsel before execution.

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

## Agreement Types

### 1. Master Services Agreement (MSA)

**Use when**: Establishing the overarching terms for an ongoing client relationship.

**Structure** (numbered sections):
1. Cover page - "Master Services Agreement", parties, effective date
2. Definitions - Key terms used throughout
3. Scope of Services - General description, reference to SOWs
4. Term and Renewal - Initial term, auto-renewal, termination notice period
5. Fees and Payment - Invoicing schedule, payment terms (Net 30), late fees
6. Service Levels - Reference to SLA exhibit or inline SLA terms
7. Client Responsibilities - Access, contacts, timely responses, data accuracy
8. Confidentiality - Mutual NDA terms, definition of confidential information
9. Intellectual Property - Ownership of work product, pre-existing IP, license grants
10. Limitation of Liability - Cap on damages, exclusion of consequential damages
11. Indemnification - Mutual indemnification obligations
12. Insurance - Required coverage types and minimums
13. Termination - For cause, for convenience, effect of termination
14. Dispute Resolution - Governing law (California), mediation, arbitration
15. General Provisions - Force majeure, notices, assignment, entire agreement, amendments
16. Signature Block - Both parties, name, title, date

### 2. Statement of Work (SOW)

**Use when**: Defining a specific project or service engagement under an existing MSA.

**Structure**:
1. Header - SOW number, reference to MSA, effective date
2. Project Overview - 2-3 paragraph description of the engagement
3. Scope of Work - Detailed deliverables as numbered list
4. Out of Scope - Explicit exclusions to prevent scope creep
5. Timeline & Milestones - Table with Milestone, Description, Target Date
6. Deliverables - Table with Deliverable, Format, Acceptance Criteria
7. Client Responsibilities - What the client must provide (access, data, contacts)
8. Investment - Table with Phase/Item, Description, Fee; total row
9. Payment Schedule - Milestone-based or monthly billing terms
10. Assumptions - Conditions under which estimates hold
11. Change Management - Process for scope changes and their cost impact
12. Acceptance - Deliverable review period and acceptance criteria
13. Signature Block

### 3. Non-Disclosure Agreement (NDA)

**Use when**: Protecting confidential information before or during an engagement.

**Structure**:
1. Header - "Mutual Non-Disclosure Agreement", parties, effective date
2. Purpose - Reason for sharing confidential information
3. Definition of Confidential Information - What is covered, what is excluded
4. Obligations of Receiving Party - Non-disclosure, non-use, care standard
5. Exclusions - Publicly available, independently developed, rightfully obtained
6. Term - Duration of agreement and survival of obligations
7. Return of Information - Obligations upon termination
8. Remedies - Injunctive relief, acknowledgment of irreparable harm
9. General Provisions - Governing law, entire agreement, amendments
10. Signature Block

### 4. Service Level Agreement (SLA)

**Use when**: Defining measurable service commitments for managed services clients.

**Structure**:
1. Header - "Service Level Agreement", reference to MSA, effective date
2. Service Description - Summary of covered services
3. Service Availability - Uptime target (e.g., 99.9%), measurement method, exclusions
4. Response Times - Table by severity level:
   | Severity | Description | Response Time | Resolution Target |
   |----------|-------------|---------------|-------------------|
   | Critical | Business down | 15 minutes | 4 hours |
   | High | Major degradation | 30 minutes | 8 hours |
   | Medium | Limited impact | 2 hours | 24 hours |
   | Low | Minor issue | 4 hours | 48 hours |
5. Support Hours - Business hours, after-hours, holiday coverage
6. Escalation Procedures - Contact chain and escalation timelines
7. Service Credits - Credit calculation for SLA misses
8. Reporting - Monthly/quarterly reports provided
9. Review & Amendment - Annual SLA review process

### 5. Acceptable Use Policy (AUP)

**Use when**: Defining permitted and prohibited use of IT systems managed by Technijian.

**Structure**:
1. Header - "Acceptable Use Policy", client name, effective date
2. Purpose & Scope - Who is covered, what systems are covered
3. Acceptable Use - Permitted activities
4. Prohibited Activities - Specific prohibited actions (unauthorized access, malware, data exfiltration, etc.)
5. Security Requirements - Password policy, MFA, device management
6. Monitoring & Privacy - Notice that systems may be monitored
7. Data Handling - Classification, storage, transmission, disposal rules
8. Incident Reporting - How to report violations or security incidents
9. Enforcement - Consequences of policy violations
10. Acknowledgment - Signature/acceptance block

## Formatting Rules

### Typography

| Element | Font | Size | Color | Weight |
|---------|------|------|-------|--------|
| Document title | Open Sans | 24pt (48) | Core Blue `006DB6` | Bold |
| Section headings (1.) | Open Sans | 14pt (28) | Core Blue `006DB6` | Bold |
| Subsection headings (1.1) | Open Sans | 12pt (24) | Dark Charcoal `1A1A2E` | Bold |
| Body text | Open Sans | 11pt (22) | Brand Grey `59595B` | Regular |
| Definitions | Open Sans | 11pt (22) | Dark Charcoal `1A1A2E` | Bold for term, Regular for definition |
| Signature labels | Open Sans | 11pt (22) | Brand Grey `59595B` | Regular |
| Footer | Open Sans | 9pt (18) | Brand Grey `59595B` | Regular |

### Section Numbering

Use hierarchical decimal numbering for all agreements:
```
1. SECTION TITLE
   1.1 Subsection Title
       (a) First item
       (b) Second item
   1.2 Another Subsection
2. NEXT SECTION
```

- Section titles: ALL CAPS, Core Blue, Bold
- Subsection titles: Title Case, Dark Charcoal, Bold
- List items: Lowercase letters in parentheses

### Tables

- **Header row**: Core Blue background, white bold text
- **Data rows**: Alternating white / off-white (`F8F9FA`)
- **Borders**: 1px `E9ECEF`
- **Cell margins**: top/bottom 80, left/right 120

### Signature Block Layout

```
_________________________________          _________________________________
Name:                                      Name:
Title:                                     Title:
Company: Technijian                        Company: [Client Name]
Date:                                      Date:
```

- Signature lines: 1px Dark Charcoal, 200px wide
- Two-column layout for mutual agreements
- Single column for policies

### Header/Footer

- **Header**: Full-color logo (left-aligned, 140px wide), blue underline, "CONFIDENTIAL" right-aligned (if applicable)
- **Footer**: "Technijian | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8500" + "Page X of Y", grey text

### Page Setup

```javascript
page: {
  size: { width: 12240, height: 15840 }, // US Letter
  margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
}
```

## Voice Rules for Legal Documents

1. **Clear and precise** — Legal documents require exact language; avoid ambiguity
2. **Use defined terms consistently** — Once defined in Section 2, always capitalize and use the exact term
3. **Plain English where possible** — Avoid unnecessary legalese; "must" not "shall", "if" not "in the event that"
4. **Be specific about obligations** — Who does what, by when, with what consequence for failure
5. **Include mutual protections** — Both parties should be treated fairly in indemnification and liability
6. **Never make guarantees** about compliance outcomes — "support compliance posture" not "ensure compliance"
7. **Date format**: "March 7, 2026" (spell out month) in body text
8. **Currency format**: "$X,XXX.XX" with two decimal places
9. **Reference governing law**: State of California, unless client requires otherwise
10. **Include change management** — All agreements should specify how amendments are made

## Visual Design Elements

Legal agreements must look polished and professional. Use these docx-js table-based techniques:

### Section Headers with Left Bar Accent

Use a 2-column borderless table: thin Core Blue cell (120 DXA) + content cell with section number and title in bold caps. This replaces plain text headings with visual section breaks.

### Key Terms / Definitions Callout Box

Display definitions in a styled table: blue header row with "Key Definitions" title, alternating Off White/White rows. Each row has the term in bold Dark Charcoal followed by an em-dash and definition in Brand Grey.

### Payment / Term Summary Cards

For financial or timeline terms, use a 3-column metric card row (similar to report KPIs): large number/value centered in an Off White cell with a label below.

### Important Clause Callout

Highlight critical clauses (Limitation of Liability, Indemnification) with a bordered callout box: orange left border (6px), light orange background (`FEF3EE`), darker text.

### Termination Summary Cards

Use a 3-column table with teal top border: card title in bold Teal + detail text in Brand Grey. Shows For Cause, For Convenience, and Transition at a glance.

### Professional Signature Blocks

Use a 2-column borderless table. Each column has a Dark Charcoal header bar (single-cell table with shading), then signature line, printed name line, title line, and date line with subtle grey separators.

### Cover Page Design

Every agreement cover page should include:
1. Blue accent bar at top (full-width)
2. Centered logo with spacing
3. Orange divider line (centered)
4. Document title in Dark Charcoal, 52pt bold
5. Party names in styled Off White boxes with an orange "&" between them
6. Effective date
7. Orange accent bar at bottom + CONFIDENTIAL notice

### CTA Banner

End the document with a full-width Core Blue banner containing contact information in white text.

## Disclaimer

All generated legal documents are templates. They MUST be reviewed and approved by qualified legal counsel before being sent to clients or used in business transactions. Technijian assumes no liability for the use of template documents without proper legal review.

## Logo Path

```
assets/logos/png/technijian-logo-full-color-600x125.png
```

## Related Skills

- **technijian-brand** — Master brand reference (colors, typography, voice, UI specs). Consult for any values not covered here.
- **technijian-proposal** — For generating proposals and SOWs that reference these agreements.
